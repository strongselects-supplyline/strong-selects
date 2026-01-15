import { google } from "googleapis";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { businessName, contactName, email, phone, cart, notes, total } = body;

        // 1. DIAGNOSTIC: List all keys starting with GOOGLE (Safe, no values shown)
        const allKeys = Object.keys(process.env);
        const googleKeys = allKeys.filter(k => k.includes("GOOGLE"));

        console.log("Available Google Keys:", googleKeys);

        // 2. CHECK SPECIFIC VARS
        const rawId = process.env.GOOGLE_SHEET_ID;
        const rawEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
        const rawKey = process.env.GOOGLE_PRIVATE_KEY;

        if (!rawId) {
            throw new Error(`MISSING ID. The server sees these Google-related variables: [${googleKeys.join(", ") || "NONE"}]. Please match the name in Vercel exactly to GOOGLE_SHEET_ID.`);
        }
        if (!rawEmail) throw new Error("Environment Variable GOOGLE_SERVICE_ACCOUNT_EMAIL is missing.");
        if (!rawKey) throw new Error("Environment Variable GOOGLE_PRIVATE_KEY is missing.");

        const spreadsheetId = rawId.trim();
        const client_email = rawEmail.trim();
        const private_key = rawKey.replace(/\\n/g, "\n").trim();

        // 3. AUTHENTICATION & APPEND (The actual work)
        const auth = new google.auth.GoogleAuth({
            credentials: { client_email, private_key },
            scopes: ["https://www.googleapis.com/auth/spreadsheets"],
        });

        const sheets = google.sheets({ version: "v4", auth });
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
        console.error("Diagnostic Error:", error);
        return NextResponse.json(
            { error: "Configuration Error", details: error.message },
            { status: 500 }
        );
    }
}
