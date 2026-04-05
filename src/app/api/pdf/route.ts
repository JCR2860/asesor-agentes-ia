import { NextResponse } from 'next/server';
import puppeteer from 'puppeteer-core';
import chromium from '@sparticuz/chromium';

export const maxDuration = 30; // 30 seconds max for Vercel
export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
    let browser = null;

    try {
        const { html, title } = await req.json();

        // Check if running on local environment
        const isLocal = process.env.NODE_ENV === 'development';

        let executablePath: string;
        if (isLocal) {
            // Local dev path: usually C:\Program Files\Google\Chrome\Application\chrome.exe
            // Fallback checking typical Windows paths
            executablePath = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
        } else {
            // Vercel serverless environment
            executablePath = await chromium.executablePath();
        }

        const args = isLocal 
            ? puppeteer.defaultArgs() 
            : chromium.args;

        browser = await puppeteer.launch({
            args,
            defaultViewport: { width: 1920, height: 1080 },
            executablePath,
            headless: true,
        });

        const page = await browser.newPage();

        // Construir la estructura final inyectando el Tailwind CSS oficial para asegurar todos los gráficos
        const contentHtml = `
            <!DOCTYPE html>
            <html lang="es">
            <head>
                <meta charset="UTF-8">
                <script src="https://cdn.tailwindcss.com"></script>
                <style>
                    /* Ajustes para PDF limpio */
                    body { 
                        background-color: #0a0a0a; 
                        color: #ffffff; 
                        padding: 30px; 
                        margin: 0;
                        -webkit-print-color-adjust: exact;
                        print-color-adjust: exact;
                    }
                    .pdf-header {
                        margin-bottom: 30px;
                        padding-bottom: 20px;
                        border-bottom: 1px solid #333;
                    }
                    .print-msg {
                        page-break-inside: avoid;
                        margin-bottom: 20px;
                    }
                </style>
            </head>
            <body>
                <div class="pdf-header">
                    <h1 style="color: #3b82f6; font-size: 24px; font-weight: bold; margin: 0;">Dictamen: ${title}</h1>
                    <p style="color: #888; font-size: 12px; margin-top: 5px;">${new Date().toLocaleString('es-ES')}</p>
                </div>
                <!-- El HTML del Chat Area -->
                <div class="max-w-3xl mx-auto flex flex-col gap-6 p-4">
                    ${html}
                </div>
            </body>
            </html>
        `;

        // Esperar a que el script de tailwindc compile las clases en tiempo real
        await page.setContent(contentHtml, { waitUntil: 'networkidle0' });

        // Generar PDF nativo 
        const pdfBuffer = await page.pdf({
            format: 'A4',
            printBackground: true,
            margin: { top: '15mm', right: '15mm', bottom: '15mm', left: '15mm' }
        });

        await browser.close();

        return new NextResponse(Buffer.from(pdfBuffer), {
            status: 200,
            headers: {
                'Content-Type': 'application/pdf',
                'Content-Disposition': 'attachment; filename="LexIA_' + title.replace(/\\s+/g, '_') + '.pdf"'
            }
        });
    } catch (error) {
        console.error("Error generating advanced PDF with Puppeteer:", error);
        if (browser) await browser.close();
        return NextResponse.json({ error: "Failed to generate PDF" }, { status: 500 });
    }
}
