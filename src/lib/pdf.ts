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
        // Convertir etiquetas de gráficos en resúmenes de texto legibles
        let clean = text
            .replace(/<(?:visual_graph|visual_data)>([\s\S]*?)<\/(?:visual_graph|visual_data)>/g, (match, jsonStr) => {
                try {
                    const data = JSON.parse(jsonStr.trim());
                    let summary = `\n[RESUMEN DE DATOS: ${data.titulo}]\n`;
                    if (data.datos) {
                        data.datos.forEach((item: any) => {
                            summary += `  • ${item.etiqueta}${item.valor !== undefined ? ': ' + item.valor : ''}${item.children ? ' (Dependientes: ' + item.children.join(', ') + ')' : ''}\n`;
                        });
                    }
                    return summary + "\n";
                } catch (e) {
                    return '\n[Gráfico Visual / Infografía]\n';
                }
            })
            // Limpiar posibles restos de markdown de imagen que el modelo intente forzar
            .replace(/!\[.*?\]\(.*?\)/g, '')
            .replace(/\[BANDERA:\s*(VERDE|AMARILLO|ROJO)\]/g, '$1:')
            .replace(/\*\*(.*?)\*\*/g, '$1')
            .replace(/\*(.*?)\*/g, '$1')
            .replace(/###(.*)/g, '$1')
            .replace(/##(.*)/g, '$1')
            .replace(/#(.*)/g, '$1');
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

export function generateFullHistoryPDF(messages: any[], agentTitle: string) {
    const doc = new jsPDF();
    const margin = 20;
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    let y = margin;

    // Logo / Title Header
    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    doc.setTextColor(40, 40, 40);
    doc.text("Informe de Asesoría Completo", pageWidth / 2, y, { align: "center" });
    y += 10;

    // Subtitle / Agent details
    doc.setFontSize(14);
    doc.setTextColor(100, 100, 100);
    doc.text(`Expediente con: ${agentTitle}`, pageWidth / 2, y, { align: "center" });
    y += 10;

    // Date
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text(`Descargado el: ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`, pageWidth / 2, y, { align: "center" });
    y += 20;

    // Divider Line
    doc.setDrawColor(200, 200, 200);
    doc.line(margin, y, pageWidth - margin, y);
    y += 15;

    const cleanMarkdown = (text: string) => {
        let clean = text
            .replace(/<(?:visual_graph|visual_data)>([\s\S]*?)<\/(?:visual_graph|visual_data)>/g, (match, jsonStr) => {
                try {
                    const data = JSON.parse(jsonStr.trim());
                    let summary = `\n[RESUMEN DE DATOS: ${data.titulo}]\n`;
                    if (data.datos) {
                        data.datos.forEach((item: any) => {
                            summary += `  • ${item.etiqueta}${item.valor !== undefined ? ': ' + item.valor : ''}${item.children ? ' (Dependientes: ' + item.children.join(', ') + ')' : ''}\n`;
                        });
                    }
                    return summary + "\n";
                } catch (e) {
                    return '\n[Gráfico Visual / Infografía]\n';
                }
            })
            .replace(/!\[.*?\]\(.*?\)/g, '')
            .replace(/\[BANDERA:\s*(VERDE|AMARILLO|ROJO)\]/g, '$1:')
            .replace(/\*\*(.*?)\*\*/g, '$1')
            .replace(/\*(.*?)\*/g, '$1')
            .replace(/###(.*)/g, '$1')
            .replace(/##(.*)/g, '$1')
            .replace(/#(.*)/g, '$1');
        return clean;
    };

    messages.forEach((msg, idx) => {
        if (msg.role === 'system') return;
        
        const sender = msg.role === 'user' ? 'USUARIO' : agentTitle.toUpperCase();
        const contentLines = doc.splitTextToSize(`${sender}:\n${cleanMarkdown(msg.content)}`, pageWidth - 2 * margin);

        for (let i = 0; i < contentLines.length; i++) {
            if (y > pageHeight - margin - 20) {
                doc.addPage();
                y = margin;
                doc.setFontSize(9);
                doc.setTextColor(150, 150, 150);
                doc.text(`${agentTitle} - Chat Completo`, margin, y);
                y += 15;
            }
            
            doc.setFontSize(11);
            doc.setTextColor(50, 50, 50);
            doc.text(contentLines[i], margin, y);
            y += 7;
        }
        
        y += 10; // Extra space between messages
        doc.setDrawColor(240, 240, 240);
        doc.line(margin, y - 5, pageWidth - margin, y - 5);
    });

    // Footer
    doc.setFontSize(9);
    doc.setTextColor(150, 150, 150);
    doc.text("LexIA puede cometer errores y es imperativo contrastar la respuesta de la IA.", pageWidth / 2, pageHeight - margin, { align: "center" });

    const filename = `Expediente_LexIA_${new Date().getTime()}.pdf`;
    const blob = doc.output('blob');
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
}
