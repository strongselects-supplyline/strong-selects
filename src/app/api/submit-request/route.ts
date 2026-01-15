import { google } from "googleapis";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { businessName, contactName, email, phone, cart, notes, total } = body;

        // 1. GREEDY SEARCH: Try multiple names for the variables
        // Sometimes Vercel prefix requirements or typos cause misses
        const sheetId = process.env.GOOGLE_SHEET_ID ||
            process.env.NEXT_PUBLIC_GOOGLE_SHEET_ID ||
            process.env.SHEET_ID;

        const serviceEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL ||
            process.env.NEXT_PUBLIC_GOOGLE_SERVICE_ACCOUNT_EMAIL ||
            process.env.SERVICE_EMAIL;

        const privateKey = process.env.GOOGLE_PRIVATE_KEY ||
            process.env.NEXT_PUBLIC_GOOGLE_PRIVATE_KEY ||
            process.env.PRIVATE_KEY;

        // 2. DIAGNOSTIC: See what we actually found
        if (!sheetId || !serviceEmail || !privateKey) {
            const missing = [];
            if (!sheetId) missing.push("SHEET_ID");
            if (!serviceEmail) missing.push("EMAIL");
            if (!privateKey) missing.push("PRIVATE_KEY");

            throw new Error(`The Vercel Server is still reporting these variables as missing: [${missing.join(", ")}]. This usually means the Redeploy didn't finish or the project name in Vercel is different from this domain.`);
        }

        const spreadsheetId = sheetId.trim();
        const client_email = serviceEmail.trim();
        const formattedKey = privateKey.replace(/\\n/g, "\n").trim();

        // 3. AUTH & APPEND
        const auth = new google.auth.GoogleAuth({
            credentials: { client_email, private_key: formattedKey },
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
        return NextResponse.json(
            { error: "Order Connection Error", details: error.message },
            { status: 500 }
        );
    }
}
