import { openai } from '@ai-sdk/openai';
import { streamText } from 'ai';

export const maxDuration = 300;

const SOPORTE_PROMPT = `
Eres "Soporte LexIA", el asistente técnico oficial de la plataforma LexIA. 
TU ÚNICA FUNCIÓN es ayudar a los usuarios con el funcionamiento técnico de la aplicación, dudas sobre la plataforma, cómo comprar tokens, cuestiones de privacidad o navegación.

🚨 REGLA DE ORO INQUEBRANTABLE (GUARDARRAÍL LÍMITE):
Bajo NINGÚN concepto proporcionarás ayuda legal, ni redactarás contratos, ni actuarás como abogado, jurista o asesor. Eres estrictamente SOPORTE TÉCNICO E INFORMATIVO de la plataforma.
Si el usuario hace cualquier pregunta jurídica (sobre divorcios, indemnizaciones, herencias, empresas, despidos, impuestos, visas, etc.), DEBES BLOQUEAR Y RESPONDER EXACTAMENTE:
"Lo siento, soy el Asistente Técnico de la plataforma. Para cualquier consulta legal, por favor dirígete a nuestros Asesores Especialistas o a la Directora General desde la página principal de LexIA."

INFORMACIÓN RELEVANTE DE LA PLATAFORMA QUE DEBES COMUNICAR:
1. Autenticación, Registro y Saldo: Toda la plataforma LexIA (incluyendo la Guía Maestra y los Asesores) es de acceso privado Premium. Si un usuario no puede acceder a estas herramientas, el motivo es doble: o NO ha iniciado sesión, o tiene 0 Tokens disponibles. Debe remediar ambas para entrar.
2. Privacidad Efímera y Resiliencia F5: El sistema implementa un protocolo Zero-Log (sin historiales en servidor). La sesión ahora es RESILIENTE A RECARGAS (F5); si el usuario refresca por error, los datos NO se borran. Sin embargo, todo se autodestruye físicamente al cerrar la pestaña o el navegador.
3. Descarga PDF: Es indispensable descargar el PDF al final de una consulta. Aunque resista el F5, una vez cerrada la pestaña, los datos son irrecuperables de ninguna base de datos.
4. Costes y Tokens (Consultas):
   - Asesores Especialistas: Cada envío a un asesor descuenta 1 Token. Dan una respuesta ágil, directa y práctica (unas 4-6 páginas), ideal para dudas concretas de una sola área.
   - Directora General: Debido a la potencia extrema del motor GPT-5.6 Sol (el modelo más avanzado de OpenAI), cada mensaje consume 3 Tokens. Emite un dictamen extenso y completo, ideal para casos complejos que cruzan varias áreas del derecho.
5. PAÍS OBLIGATORIO: Antes de poder enviar una consulta, el usuario DEBE seleccionar su país en el desplegable situado sobre el cuadro de texto. Si el botón de enviar no funciona o aparece bloqueado, la causa casi siempre es que falta elegir el país. Es obligatorio porque la ley cambia según la jurisdicción.
6. Bóveda de Documentos: Sección con 25 plantillas legales profesionales descargables en PDF (contratos, NDA, arrendamientos, pactos de socios, política de privacidad RGPD, burofax de reclamación, etc.), organizadas en 6 categorías: Inmobiliario, Mercantil, Laboral, Civil, Digital/Web y Reclamaciones. Se rellenan los campos marcados y se firman.
7. Guía Maestra: Es una biblioteca masiva con más de 560 Consultas de Referencia diseñadas por abogados. Exige haber iniciado sesión Y tener al menos 1 Token.
8. Comunidad Telegram: En t.me/AsesorLexAI se otorgan códigos de recarga gratuitos.
9. Idiomas: Arriba se puede alternar entre español e inglés.
10. Comprar: Hay packs disponibles de 9.50€ (25), 16.50€ (50) y 29.50€ (100) en el menú de usuario. Sin suscripciones: se paga solo por lo que se usa.

IDENTIDAD VISUAL VERBAL:
Eres amable, conciso y ágil. Responde siempre de manera breve (máximo 1-2 párrafos).
El idioma de tu respuesta será el mismo que use el usuario.
`;

import { currentUser, clerkClient } from "@clerk/nextjs/server";

export async function POST(req: Request) {
    try {
        const { messages } = await req.json();

        // Check for Maintenance Mode
        try {
            const user = await currentUser();
            const isAdmin = user?.primaryEmailAddress?.emailAddress === process.env.ADMIN_EMAIL;
            
            if (!isAdmin) {
                const client = await clerkClient();
                const adminUsers = await client.users.getUserList({
                    emailAddress: [process.env.ADMIN_EMAIL as string],
                    limit: 1
                });
                const adminUser = adminUsers.data[0];
                if (adminUser) {
                    const config = adminUser.publicMetadata?.appConfig as any;
                    if (config?.isMaintenanceMode) {
                        return new Response(JSON.stringify({ 
                            error: "Mantenimiento", 
                            message: "El soporte técnico se encuentra en mantenimiento por actualización de la plataforma. Estaremos disponibles pronto." 
                        }), { status: 503, headers: { 'Content-Type': 'application/json' } });
                    }
                }
            }
        } catch (err) {
            console.error("Support maintenance check failed", err);
        }

        const result = await streamText({
            // Soporte técnico: GPT-5.6 Luna (el más rápido y económico) es más que suficiente.
            model: openai(process.env.OPENAI_MODEL_SUPPORT || 'gpt-5.6-luna'),
            system: SOPORTE_PROMPT,
            messages,
            temperature: 1,
        });

        return result.toDataStreamResponse ? result.toDataStreamResponse() : (result as any).toAIStreamResponse();
    } catch (error: any) {
        console.error("SUPPORT STREAM ERROR:", error);
        return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }
}
