import { google } from "googleapis";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { businessName, contactName, email, phone, cart, notes, total } = body;

        // AUTHENTICATION
        const auth = new google.auth.GoogleAuth({
            credentials: {
                client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
                private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"), // Fix newline issues
            },
            scopes: [
                "https://www.googleapis.com/auth/spreadsheets",
            ],
        });

        const sheets = google.sheets({ version: "v4", auth });
        const spreadsheetId = process.env.GOOGLE_SHEET_ID;

        // 1. Get the first sheet name dynamically instead of assuming "Sheet1"
        const spreadsheet = await sheets.spreadsheets.get({ spreadsheetId });
        const sheetName = spreadsheet.data.sheets?.[0]?.properties?.title || "Sheet1";

        // 2. Format items list
        const itemsString = cart.map((item: any) =>
            `${item.product.strain_name} (${item.quantity}${item.unit})`
        ).join(", ");

        // 3. Prepare the row data
        const row = [
            new Date().toLocaleString(), // Localized timestamp
            businessName,
            contactName,
            email,
            phone,
            itemsString,
            `$${total}`,
            notes
        ];

        // 4. Append to the sheet
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
        console.error("Sheet Error:", error);

        // Return descriptive error for debugging
        return NextResponse.json(
            {
                error: "Failed to submit order to sheet",
                details: error.message || "Unknown error",
                status: error.status || 500
            },
            { status: 500 }
        );
    }
}
