import { google } from "googleapis";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { businessName, contactName, email, phone, cart, notes, total } = body;

        // 1. HYPER-GREEDY SEARCH: Find the right values even if keys are swapped
        // The user's screenshot showed the service account email was put into "NEXT_PUBLIC_REQUEST_EMAIL"
        const sheetId = (
            process.env.GOOGLE_SHEET_ID ||
            process.env.NEXT_PUBLIC_GOOGLE_SHEET_ID ||
            process.env.SHEET_ID
        )?.trim();

        // Try to find the email that ends in .gserviceaccount.com
        let serviceEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL ||
            process.env.NEXT_PUBLIC_GOOGLE_SERVICE_ACCOUNT_EMAIL ||
            process.env.NEXT_PUBLIC_REQUEST_EMAIL ||
            process.env.SERVICE_EMAIL;

        const privateKey = (
            process.env.GOOGLE_PRIVATE_KEY ||
            process.env.NEXT_PUBLIC_GOOGLE_PRIVATE_KEY ||
            process.env.PRIVATE_KEY
        )?.trim();

        if (!sheetId || !serviceEmail || !privateKey) {
            throw new Error(`Technical missing: ID=${!!sheetId}, Email=${!!serviceEmail}, Key=${!!privateKey}`);
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
        const spreadsheet = await sheets.spreadsheets.get({ spreadsheetId: sheetId });
        const sheetName = spreadsheet.data.sheets?.[0]?.properties?.title || "Sheet1";

        const row = [
            new Date().toLocaleString(),
            businessName, contactName, email, phone,
            cart.map((item: any) => `${item.product.strain_name} (${item.quantity}${item.unit})`).join(", "),
            `$${total}`, notes
        ];

        await sheets.spreadsheets.values.append({
            spreadsheetId: sheetId,
            range: `${sheetName}!A:H`,
            valueInputOption: "USER_ENTERED",
            requestBody: { values: [row] },
        });

        return NextResponse.json({ success: true });

    } catch (error: any) {
        console.error("Auth Error:", error.message);
        return NextResponse.json(
            { error: "Order Connection Error", details: error.message },
            { status: 500 }
        );
    }
}
