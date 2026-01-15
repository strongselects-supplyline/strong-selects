import { google } from "googleapis";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { businessName, contactName, email, phone, cart, notes, total } = body;

        // 1. SANITIZE & VALIDATE ENV VARS
        const rawId = process.env.GOOGLE_SHEET_ID;
        const rawEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
        const rawKey = process.env.GOOGLE_PRIVATE_KEY;

        // Check if anything is missing BEFORE calling Google
        if (!rawId) throw new Error("Environment Variable GOOGLE_SHEET_ID is missing in Vercel.");
        if (!rawEmail) throw new Error("Environment Variable GOOGLE_SERVICE_ACCOUNT_EMAIL is missing in Vercel.");
        if (!rawKey) throw new Error("Environment Variable GOOGLE_PRIVATE_KEY is missing in Vercel.");

        const spreadsheetId = rawId.trim();
        const client_email = rawEmail.trim();
        const private_key = rawKey.replace(/\\n/g, "\n").trim();

        // 2. AUTHENTICATION
        const auth = new google.auth.GoogleAuth({
            credentials: {
                client_email,
                private_key,
            },
            scopes: ["https://www.googleapis.com/auth/spreadsheets"],
        });

        const sheets = google.sheets({ version: "v4", auth });

        // 3. GET SHEET NAME
        const spreadsheet = await sheets.spreadsheets.get({ spreadsheetId });
        const sheetName = spreadsheet.data.sheets?.[0]?.properties?.title || "Sheet1";

        // 4. FORMAT DATA
        const itemsString = cart.map((item: any) =>
            `${item.product.strain_name} (${item.quantity}${item.unit})`
        ).join(", ");

        const row = [
            new Date().toLocaleString(),
            businessName,
            contactName,
            email,
            phone,
            itemsString,
            `$${total}`,
            notes
        ];

        // 5. APPEND
        await sheets.spreadsheets.values.append({
            spreadsheetId,
            range: `${sheetName}!A:H`,
            valueInputOption: "USER_ENTERED",
            requestBody: {
                values: [row],
            },
        });

        return NextResponse.json({ success: true });

    } catch (error: any) {
        console.error("DEBUG - Full Error:", error);

        return NextResponse.json(
            {
                error: "Submission Error",
                details: error.message || "Unknown error",
                // Help user identify if it's a specific Vercel var issue
                isConfigError: error.message.includes("Environment Variable")
            },
            { status: 500 }
        );
    }
}
