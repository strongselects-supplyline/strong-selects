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

        // FORMAT ITEMS
        const itemsString = cart.map((item: any) =>
            `${item.product.strain_name} (${item.quantity}${item.unit})`
        ).join(", ");

        // PREPARE ROW
        const row = [
            new Date().toISOString(), // Timestamp
            businessName,
            contactName,
            email,
            phone,
            itemsString,
            total,
            notes
        ];

        // APPEND TO SHEET
        await sheets.spreadsheets.values.append({
            spreadsheetId,
            range: "Sheet1!A:H", // Assumes first sheet is named Sheet1
            valueInputOption: "USER_ENTERED",
            requestBody: {
                values: [row],
            },
        });

        return NextResponse.json({ success: true });

    } catch (error) {
        console.error("Sheet Error:", error);
        return NextResponse.json(
            { error: "Failed to submit order to sheet" },
            { status: 500 }
        );
    }
}
