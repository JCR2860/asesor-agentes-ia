import jsPDF from 'jspdf';

export function generatePDF(content: string, agentTitle: string, userPrompt?: string) {
    const doc = new jsPDF();
    const margin = 20;
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    let y = margin;

    // Logo / Title Header
    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    doc.setTextColor(40, 40, 40);
    doc.text("Informe de Asesoría", pageWidth / 2, y, { align: "center" });
    y += 10;

    // Subtitle / Agent details
    doc.setFontSize(14);
    doc.setTextColor(100, 100, 100);
    doc.text(`Generado por: ${agentTitle}`, pageWidth / 2, y, { align: "center" });
    y += 10;

    // Date
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text(`Fecha: ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`, pageWidth / 2, y, { align: "center" });
    y += 20;

    // Divider Line
    doc.setDrawColor(200, 200, 200);
    doc.line(margin, y, pageWidth - margin, y);
    y += 15;

    // Content Parsing
    const cleanMarkdown = (text: string) => {
        let clean = text.replace(/\*\*(.*?)\*\*/g, '$1');
        clean = clean.replace(/\*(.*?)\*/g, '$1');
        clean = clean.replace(/###(.*)/g, '$1');
        clean = clean.replace(/##(.*)/g, '$1');
        clean = clean.replace(/#(.*)/g, '$1');
        return clean;
    };

    let combineText = "";
    if (userPrompt) {
        combineText += `CONSULTA ORIGINAL:\n${cleanMarkdown(userPrompt)}\n\n`;
        combineText += `--------------------------------------------------\n\n`;
        combineText += `RESPUESTA DEL ASESOR:\n`;
    }
    combineText += cleanMarkdown(content);

    const splitText = doc.splitTextToSize(combineText, pageWidth - 2 * margin);

    // Pagination logic
    for (let i = 0; i < splitText.length; i++) {
        if (y > pageHeight - margin) {
            doc.addPage();
            y = margin;
            // Add a subtle header on new pages
            doc.setFontSize(9);
            doc.setTextColor(150, 150, 150);
            doc.text(`${agentTitle} - Continuación`, margin, y);
            y += 10;
            doc.setFontSize(11);
            doc.setTextColor(50, 50, 50);
        }
        doc.text(splitText[i], margin, y);
        y += 7; // Line height
    }

    // Footer
    doc.setFontSize(9);
    doc.setTextColor(150, 150, 150);
    doc.text("LexIA puede cometer errores y es imperativo contrastar la respuesta de la IA.", pageWidth / 2, pageHeight - margin, { align: "center" });

    const filename = `LexIA_Asesoria_${new Date().getTime()}.pdf`;

    // Create a blob and download link to support mobile browsers better
    const blob = doc.output('blob');
    const url = window.URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();

    // Cleanup
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
}
