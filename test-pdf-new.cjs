const { extractText } = require('unpdf');
const fs = require('fs');
const path = require('path');

async function test() {
    try {
        const filePath = 'f:\\Agentes de IA especializados como asesores jurídicos y técnicos\\Archivos de prueba\\LexIA_Asesoria_1774800516645.pdf';
        const buffer = fs.readFileSync(filePath);
        const uint8Array = new Uint8Array(buffer);
        const { text } = await extractText(uint8Array);
        console.log("PDF CONTENT BEGINS:");
        console.log("-------------------");
        console.log(text);
        console.log("-------------------");
        console.log("PDF CONTENT ENDS.");
    } catch (e) {
        console.error("Extraction error:", e);
    }
}

test();
