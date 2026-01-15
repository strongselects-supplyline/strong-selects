import { google } from "googleapis";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { businessName, contactName, email, phone, cart, notes, total } = body;

        const sheetId = (process.env.GOOGLE_SHEET_ID || process.env.NEXT_PUBLIC_GOOGLE_SHEET_ID)?.trim();
        const serviceEmail = (process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL || process.env.NEXT_PUBLIC_GOOGLE_SERVICE_ACCOUNT_EMAIL)?.trim();
        const privateKey = (process.env.GOOGLE_PRIVATE_KEY || process.env.NEXT_PUBLIC_GOOGLE_PRIVATE_KEY)?.replace(/\\n/g, "\n")?.trim();

        if (!sheetId || !serviceEmail || !privateKey) {
            throw new Error("Server configuration incomplete. Check environment variables.");
        }

        const auth = new google.auth.GoogleAuth({
            credentials: { client_email: serviceEmail, private_key: privateKey },
            scopes: ["https://www.googleapis.com/auth/spreadsheets"],
        });

        const sheets = google.sheets({ version: "v4", auth });

        // Dynamic sheet detection
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
        console.error("Submission Error:", error.message);
        return NextResponse.json(
            { error: "Order Submission Failed", details: error.message },
            { status: 500 }
        );
    }
}
