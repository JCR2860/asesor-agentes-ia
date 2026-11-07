import { streamResponse, type Effort } from '@/lib/ai-engine';

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
   - Directora General: Funciona con GPT-6.1 Sol, el modelo de razonamiento de última generación de OpenAI, y por su análisis profundo cada mensaje consume 3 Tokens. Emite un dictamen extenso y completo, ideal para casos complejos que cruzan varias áreas del derecho.
5. PAÍS OBLIGATORIO: Antes de poder enviar una consulta, el usuario DEBE seleccionar su país en el desplegable situado sobre el cuadro de texto. Si el botón de enviar no funciona o aparece bloqueado, la causa casi siempre es que falta elegir el país. Es obligatorio porque la ley cambia según la jurisdicción.
6. Bóveda de Documentos: Sección con 25 documentos legales redactados con nivel de despacho de abogados (derecho español vigente), descargables en PDF maquetado y con vista previa antes de descargar: contratos, NDA, arrendamientos, pactos de socios, política de privacidad RGPD, burofax de reclamación, etc., organizados en 6 categorías: Inmobiliario, Mercantil, Laboral, Civil, Digital/Web y Reclamaciones. Cada documento incluye al final unas «Notas del asesor» (requisitos legales, fiscalidad, registros y errores frecuentes) que deben eliminarse antes de firmar. Se rellenan los campos marcados y se firman; en operaciones importantes conviene que lo revise un profesional.
7. Guía Maestra: Es una biblioteca masiva con más de 560 Consultas de Referencia diseñadas por abogados. Exige haber iniciado sesión Y tener al menos 1 Token. Al elegir una consulta de la Guía, el usuario puede adaptarla a su propio caso antes de enviarla al asesor.
11. Región y Ficha del caso: En países donde la ley cambia por región (España, Estados Unidos, México, Argentina, Brasil, Canadá, Reino Unido, Bélgica, Suiza, Alemania y Australia) aparece un segundo desplegable para elegir comunidad autónoma, estado, provincia, región o cantón (recomendado, no obligatorio). La «Ficha del caso» es un panel opcional para indicar perfil, fechas clave, importe, ciudad o municipio, si hay un procedimiento abierto y el objetivo; mejora mucho la precisión del dictamen. Se recomienda no incluir nombres, DNI ni datos bancarios.
8. Comunidad Telegram: En t.me/AsesorLexAI se otorgan códigos de recarga gratuitos.
9. Idiomas: Arriba se puede alternar entre español e inglés.
10. Comprar: Hay packs disponibles de 9.50€ (25), 16.50€ (50) y 29.50€ (100) en el menú de usuario. Sin suscripciones: se paga solo por lo que se usa.

IDENTIDAD VISUAL VERBAL:
Eres amable, conciso y ágil. Responde siempre de manera breve (máximo 1-2 párrafos).
Trata al usuario de usted. Llama «créditos» a los tokens (en la web aparecen como créditos o consultas).
El idioma de tu respuesta será el mismo que use el usuario.
FORMATO: Markdown sencillo: frases cortas, **negrita** para lo importante y listas breves solo cuando ayuden.
No inventes correos electrónicos, teléfonos ni otros canales de contacto que no figuren en esta información. Si no puedes resolver algo, explica qué puede comprobar el usuario (por ejemplo, cerrar sesión y volver a entrar para refrescar el saldo, o revisar el justificante de Stripe en su correo).
`;

import { currentUser, clerkClient } from "@clerk/nextjs/server";
import { getCreditsBreakdownDB } from '@/lib/credits';
import { rateLimit, visitorKey } from '@/lib/rate-limit';

// El soporte está abierto también a visitantes sin sesión (dudas antes de comprar),
// con límites para evitar abusos. Cada mensaje cuesta ~0,0005 $ (GPT-6 Luna).
const LIMITS = {
    visitorPerHour: Number(process.env.SUPPORT_LIMIT_VISITOR) || 15,
    userPerHour: Number(process.env.SUPPORT_LIMIT_USER) || 40,
    visitorsPerDay: Number(process.env.SUPPORT_LIMIT_VISITORS_DAY) || 3000, // total de todos los visitantes
};

// Errores con un código que la burbuja traduce al idioma del usuario.
const fail = (status: number, code: string, message: string, retryAfterSec?: number) =>
    new Response(JSON.stringify({ code, message, retryAfterSec }), {
        status,
        headers: { 'Content-Type': 'application/json', ...(retryAfterSec ? { 'Retry-After': String(retryAfterSec) } : {}) },
    });

const madrid = (iso: string) => new Date(iso).toLocaleString('es-ES', { timeZone: 'Europe/Madrid', day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' });

export async function POST(req: Request) {
    try {
        // Solo los últimos mensajes y con longitud acotada (coste y abuso).
        const body = await req.json().catch(() => null);
        const messages = (Array.isArray(body?.messages) ? body.messages : [])
            .filter((m: any) => (m?.role === 'user' || m?.role === 'assistant') && typeof m.content === 'string')
            .slice(-10)
            .map((m: any) => ({ role: m.role, content: String(m.content).slice(0, 1500) }));
        if (!messages.length || messages[messages.length - 1].role !== 'user') {
            return fail(400, 'invalid', 'Mensaje no válido.');
        }

        let user: Awaited<ReturnType<typeof currentUser>> = null;
        try { user = await currentUser(); } catch { /* visitante */ }
        const isAdmin = !!user && user.emailAddresses.some(e => e.emailAddress === process.env.ADMIN_EMAIL);

        // Límites de uso
        if (!isAdmin) {
            const r = user
                ? await rateLimit(`support:u:${user.id}`, LIMITS.userPerHour, 3600)
                : await rateLimit(`support:v:${visitorKey(req)}`, LIMITS.visitorPerHour, 3600);
            if (!r.ok) {
                return fail(429, 'rate_limited', `Ha alcanzado el límite de mensajes del soporte. Podrá volver a escribir en ${Math.ceil(r.retryAfterSec / 60)} minutos.`, r.retryAfterSec);
            }
            if (!user) {
                const g = await rateLimit('support:visitors:day', LIMITS.visitorsPerDay, 86400);
                if (!g.ok) return fail(429, 'busy', 'El soporte para visitantes está muy solicitado ahora mismo. Inicie sesión o inténtelo más tarde.', g.retryAfterSec);
            }
        }

        // Modo mantenimiento (no afecta al administrador)
        if (!isAdmin) {
            try {
                const client = await clerkClient();
                const adminUsers = await client.users.getUserList({ emailAddress: [process.env.ADMIN_EMAIL as string], limit: 1 });
                const config = adminUsers.data[0]?.publicMetadata?.appConfig as any;
                if (config?.isMaintenanceMode) {
                    return fail(503, 'maintenance', 'El soporte técnico está en mantenimiento por una actualización de la plataforma. Estaremos disponibles pronto.');
                }
            } catch (err) {
                console.error("Support maintenance check failed", err);
            }
        }

        // Contexto de la cuenta: permite responder con el saldo real.
        let account: string;
        if (user) {
            const clerkCredits = Number(user.publicMetadata?.credits) || 0;
            const b = isAdmin ? null : await getCreditsBreakdownDB(user.id, clerkCredits);
            const lines = ['- Sesión iniciada: sí.'];
            if (isAdmin) lines.push('- Es el administrador de la plataforma: saldo ilimitado.');
            else if (b && b.db) {
                lines.push(`- Saldo disponible: ${b.effective} crédito(s).`);
                lines.push(`- Créditos comprados (no caducan nunca): ${b.purchased}.`);
                lines.push(b.gift > 0 && b.giftExpiresAt
                    ? `- Créditos de regalo: ${b.gift}, caducan el ${madrid(b.giftExpiresAt)} (hora de Madrid).`
                    : '- No tiene créditos de regalo activos.');
            } else {
                lines.push(`- Saldo disponible: ${clerkCredits} crédito(s).`);
            }
            account = lines.join('\n');
        } else {
            account = '- Sesión iniciada: NO (visitante). Si pregunta por su saldo, sus consultas, la Guía o la Bóveda, explícale que debe crear una cuenta o iniciar sesión con el botón «Iniciar sesión» de arriba a la derecha y, para consultar, comprar un pack.';
        }

        const instructions = `${SOPORTE_PROMPT}
━━━ DATOS DE ESTA CONVERSACIÓN (privados: úsalos solo si el usuario pregunta por su cuenta o su saldo) ━━━
${account}`;

        // Soporte técnico: GPT-6 Luna sin razonamiento (respuestas breves, instantáneas y muy baratas).
        return streamResponse({
            model: process.env.OPENAI_MODEL_SUPPORT || 'gpt-6-luna',
            effort: (process.env.OPENAI_EFFORT_SUPPORT || 'none') as Effort,
            instructions,
            messages,
            maxOutputTokens: 1000,
            label: user ? 'SOPORTE' : 'SOPORTE (visitante)',
        });
    } catch (error: any) {
        console.error("SUPPORT STREAM ERROR:", error?.message);
        return fail(500, 'error', 'No se pudo conectar con el soporte. Inténtelo de nuevo.');
    }
}
