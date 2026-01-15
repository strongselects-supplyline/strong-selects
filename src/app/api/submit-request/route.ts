import { google } from "googleapis";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { businessName, contactName, email, phone, cart, notes, total } = body;

        // 1. SMART SEARCH: Find the REAL service account email
        // We look through EVERY variable for one that contains "gserviceaccount.com"
        const allEnv = process.env;
        const serviceEmail = Object.values(allEnv).find(val =>
            val?.includes("gserviceaccount.com")
        );

        const sheetId = (
            allEnv.GOOGLE_SHEET_ID ||
            allEnv.NEXT_PUBLIC_GOOGLE_SHEET_ID ||
            allEnv.SHEET_ID
        )?.trim();

        const privateKey = (
            allEnv.GOOGLE_PRIVATE_KEY ||
            allEnv.NEXT_PUBLIC_GOOGLE_PRIVATE_KEY ||
            allEnv.PRIVATE_KEY
        )?.trim();

        if (!serviceEmail || !sheetId || !privateKey) {
            const missing = [];
            if (!serviceEmail) missing.push("Service Account Email (@...gserviceaccount.com)");
            if (!sheetId) missing.push("Sheet ID");
            if (!privateKey) missing.push("Private Key");
            throw new Error(`Connection Error: Missing [${missing.join(", ")}]. Check your Vercel variables.`);
        }

        const formattedKey = privateKey.replace(/\\n/g, "\n");

        // 2. AUTH & APPEND
        const auth = new google.auth.GoogleAuth({
            credentials: {
                client_email: serviceEmail.trim(),
                private_key: formattedKey
            },
            scopes: ["https://www.googleapis.com/auth/spreadsheets"],
        });

        const sheets = google.sheets({ version: "v4", auth });
        const spreadsheetId = sheetId;

        const spreadsheet = await sheets.spreadsheets.get({ spreadsheetId });
        const sheetName = spreadsheet.data.sheets?.[0]?.properties?.title || "Sheet1";

        const row = [
            new Date().toLocaleString(),
            businessName, contactName, email, phone,
            cart.map((item: any) => `${item.product.strain_name} (${item.quantity}${item.unit})`).join(", "),
            `$${total}`, notes
        ];

        await sheets.spreadsheets.values.append({
            spreadsheetId,
            range: `${sheetName}!A:H`,
            valueInputOption: "USER_ENTERED",
            requestBody: { values: [row] },
        });

        return NextResponse.json({ success: true });

    } catch (error: any) {
        console.error("Diagnostic Error:", error.message);
        return NextResponse.json(
            { error: "Order Error", details: error.message },
            { status: 500 }
        );
    }
}
