import { NextRequest, NextResponse } from "next/server";
import pdf from "pdf-parse";

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const file = formData.get("file") as File | null;

        if (!file) {
            return NextResponse.json({ error: "No file provided" }, { status: 400 });
        }

        const buffer = Buffer.from(await file.arrayBuffer());

        if (file.type === "application/pdf") {
            const data = await pdf(buffer);
            const text = data.text;
            return NextResponse.json({ text, type: "pdf", name: file.name });
        } else if (file.type.startsWith("image/")) {
            // Convert to base64
            const base64 = buffer.toString('base64');
            const url = `data:${file.type};base64,${base64}`;
            return NextResponse.json({ url, type: "image", name: file.name });
        } else if (file.type === "text/plain") {
            const text = buffer.toString('utf-8');
            return NextResponse.json({ text, type: "text", name: file.name });
        } else {
            return NextResponse.json({ error: "Unsupported file type" }, { status: 400 });
        }

    } catch (error: any) {
        console.error("Error parsing file:", error);
        return NextResponse.json({ error: error.message || "Failed to parse document" }, { status: 500 });
    }
}
