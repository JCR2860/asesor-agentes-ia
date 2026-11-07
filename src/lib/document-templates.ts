// Metadatos de la Bóveda de Documentos (las tarjetas). El texto completo de cada
// documento está en document-content.ts y se carga solo al previsualizar o descargar.
// Generado a partir de las plantillas redactadas; words y pages se calculan sobre el PDF real.

export type DocumentCategory =
    | 'inmobiliario'
    | 'mercantil'
    | 'laboral'
    | 'civil'
    | 'digital'
    | 'reclamaciones';

export type DocumentTemplate = {
    id: string;
    title: string;
    category: DocumentCategory;
    description: string;
    words: number;  // palabras del documento (sin las notas del asesor)
    pages: number;  // páginas del PDF maquetado
};

export const documentTemplates: DocumentTemplate[] = [
    {
        id: "nda-pro",
        title: "Acuerdo de Confidencialidad (NDA) Reforzado",
        category: "mercantil",
        description: "Acuerdo bilateral de confidencialidad corporativa que protege secretos empresariales, algoritmos, know-how y datos personales, con medidas de seguridad, cláusula penal y reglas de resolución de controversias.",
        words: 3331,
        pages: 12,
    },
    {
        id: "prestacion-servicios",
        title: "Contrato de Prestación de Servicios Profesionales (B2B / Freelance)",
        category: "mercantil",
        description: "Contrato mercantil para consultores, agencias y profesionales autónomos que regula servicios, entregables, pagos, propiedad intelectual, niveles de servicio, penalizaciones y protección de la relación comercial.",
        words: 3948,
        pages: 13,
    },
    {
        id: "pacto-socios",
        title: "Pacto de Socios (Startups y PYMES)",
        category: "mercantil",
        description: "Pacto de socios para startups y pymes que regula inversión, gobierno, vesting, transmisiones, arrastre, acompañamiento y salida, con protección del inversor y garantías equilibradas para los fundadores.",
        words: 6250,
        pages: 20,
    },
    {
        id: "agencia-comercial",
        title: "Contrato de Agencia Comercial",
        category: "mercantil",
        description: "Contrato de agencia comercial con regulación de zona, exclusividad, comisiones y obligaciones, que protege la independencia del agente y concreta el preaviso y la indemnización por clientela.",
        words: 3700,
        pages: 13,
    },
    {
        id: "reconocimiento-deuda",
        title: "Reconocimiento de Deuda con Calendario de Pagos",
        category: "mercantil",
        description: "Reconocimiento de deuda con calendario de pagos, intereses y garantías de cobro, que regula el impago, el vencimiento anticipado y la reclamación judicial con respeto a los límites legales.",
        words: 2418,
        pages: 10,
    },
    {
        id: "arras-pro",
        title: "Contrato de Arras Penitenciales (Art. 1454 CC)",
        category: "inmobiliario",
        description: "Contrato completo de arras penitenciales para reservar una compraventa inmobiliaria, concretar cargas y pagos y regular financiación, escritura, entrega y consecuencias económicas del desistimiento.",
        words: 3064,
        pages: 12,
    },
    {
        id: "alquiler-vivienda",
        title: "Contrato de Arrendamiento de Vivienda Habitual (LAU)",
        category: "inmobiliario",
        description: "Contrato completo de alquiler de vivienda habitual, con duración y prórrogas legales, límites de renta, actualización, fianza, reparto de gastos y anexos para documentar la entrega y proteger a ambas partes.",
        words: 4370,
        pages: 15,
    },
    {
        id: "alquiler-local",
        title: "Arrendamiento de Local de Negocio (Uso Distinto de Vivienda)",
        category: "inmobiliario",
        description: "Contrato completo de arrendamiento de local u oficina que regula renta, garantías, actividad, obras y traspaso, con renuncia expresa a la indemnización por clientela y anexos para documentar la entrega.",
        words: 4120,
        pages: 15,
    },
    {
        id: "compraventa-inmueble",
        title: "Contrato Privado de Compraventa de Inmueble",
        category: "inmobiliario",
        description: "Contrato privado de compraventa de inmueble previo a escritura, con regulación del precio, pagos, hipoteca, entrega de llaves, cargas y saneamiento, y garantías para comprador y vendedor.",
        words: 3482,
        pages: 13,
    },
    {
        id: "contrato-trabajo-pro",
        title: "Contrato de Trabajo Indefinido (Modelo Profesional)",
        category: "laboral",
        description: "Contrato indefinido completo para formalizar la relación laboral con seguridad jurídica, definir funciones, jornada y salario, y regular confidencialidad, derechos digitales y teletrabajo mediante anexo específico.",
        words: 3229,
        pages: 11,
    },
    {
        id: "alta-direccion",
        title: "Contrato de Alta Dirección (RD 1382/1985)",
        category: "laboral",
        description: "Contrato de alta dirección que regula poderes, objetivos, retribución y garantías de salida, con pactos de exclusividad, blindaje y no competencia adaptables a la empresa y al directivo.",
        words: 3135,
        pages: 12,
    },
    {
        id: "pacto-no-competencia",
        title: "Pacto de No Competencia Post-Contractual",
        category: "laboral",
        description: "Pacto laboral de no competencia poscontractual y confidencialidad para proteger conocimientos estratégicos, con límites precisos, compensación proporcionada y consecuencias equilibradas del incumplimiento.",
        words: 2103,
        pages: 9,
    },
    {
        id: "acuerdo-teletrabajo",
        title: "Acuerdo de Trabajo a Distancia (Ley 10/2021)",
        category: "laboral",
        description: "Acuerdo de trabajo a distancia completo y adaptable que regula presencialidad, medios, gastos, horario, desconexión y reversibilidad, con inventario y garantías para la empresa y la persona trabajadora.",
        words: 3167,
        pages: 12,
    },
    {
        id: "finiquito",
        title: "Recibo de Finiquito y Saldo",
        category: "laboral",
        description: "Recibo laboral de saldo y finiquito con desglose de cantidades, acreditación del pago, reservas de derechos y asistencia de la representación legal de las personas trabajadoras en la firma.",
        words: 1145,
        pages: 6,
    },
    {
        id: "compraventa-vehiculo",
        title: "Contrato de Compraventa de Vehículo entre Particulares",
        category: "civil",
        description: "Contrato completo para comprar o vender un coche o moto entre particulares, con garantías sobre su estado y titularidad, opciones sobre vicios ocultos y reglas claras de pago, entrega y transferencia.",
        words: 2232,
        pages: 8,
    },
    {
        id: "prestamo-particulares",
        title: "Contrato de Préstamo entre Particulares (Sin Intereses)",
        category: "civil",
        description: "Contrato de préstamo gratuito entre particulares con calendario de devolución, amortización anticipada y garantías de trazabilidad, acompañado de instrucciones para presentar el Modelo 600 y acreditar su realidad.",
        words: 2530,
        pages: 9,
    },
    {
        id: "comodato",
        title: "Contrato de Comodato (Préstamo de Uso Gratuito)",
        category: "civil",
        description: "Contrato completo para ceder gratuitamente el uso temporal de una vivienda, local, vehículo u otro bien, con reglas claras sobre conservación, gastos, responsabilidad y devolución.",
        words: 1933,
        pages: 8,
    },
    {
        id: "autorizacion-menor-viaje",
        title: "Autorización de Viaje de Menor",
        category: "civil",
        description: "Autorización completa para que un menor viaje solo o acompañado por un tercero, con identificación de responsables, itinerario, límites del consentimiento y pautas para su formalización y uso.",
        words: 1012,
        pages: 5,
    },
    {
        id: "politica-privacidad-web",
        title: "Política de Privacidad para Web/App (RGPD)",
        category: "digital",
        description: "Política de privacidad completa para webs y aplicaciones, con información sobre tratamientos, bases jurídicas, proveedores, transferencias y derechos, adaptable a los servicios y tecnologías de cada negocio.",
        words: 3267,
        pages: 12,
    },
    {
        id: "aviso-legal-web",
        title: "Aviso Legal y Condiciones de Uso (LSSI-CE)",
        category: "digital",
        description: "Aviso legal completo para identificar al titular de una web y regular su uso, con protección de contenidos, responsabilidad equilibrada, información sobre privacidad y vías de reclamación.",
        words: 2522,
        pages: 9,
    },
    {
        id: "encargo-tratamiento-rgpd",
        title: "Contrato de Encargo de Tratamiento (Art. 28 RGPD)",
        category: "digital",
        description: "Contrato completo para regular el acceso de proveedores a datos personales, con instrucciones, garantías de seguridad, control de subencargados, gestión de brechas y devolución o supresión de información.",
        words: 3314,
        pages: 12,
    },
    {
        id: "burofax-reclamacion-cantidad",
        title: "Burofax de Reclamación de Cantidad (Requerimiento de Pago)",
        category: "reclamaciones",
        description: "Burofax profesional para reclamar deudas de forma fehaciente, requerir el pago, documentar la mora y promover una negociación previa que facilite, cuando proceda, la posterior reclamación judicial.",
        words: 1304,
        pages: 6,
    },
    {
        id: "reclamacion-vuelo-261",
        title: "Reclamación a Aerolínea (Reglamento CE 261/2004)",
        category: "reclamaciones",
        description: "Reclamación formal a la aerolínea por cancelación, gran retraso o denegación de embarque, con solicitud de compensación, asistencia y reembolso, preparada para acreditar la reclamación previa ante AESA o los tribunales.",
        words: 1468,
        pages: 6,
    },
    {
        id: "hoja-reclamacion-consumo",
        title: "Reclamación de Consumo (Producto/Servicio Defectuoso)",
        category: "reclamaciones",
        description: "Reclamación formal por productos o servicios defectuosos que permite exigir su subsanación, sustitución, rebaja o reembolso, documentar el incumplimiento y preparar la defensa del consumidor.",
        words: 1477,
        pages: 6,
    },
    {
        id: "desistimiento-compra-online",
        title: "Desistimiento de Compra Online (14 días)",
        category: "reclamaciones",
        description: "Comunica el desistimiento de una compra online dentro del plazo legal, solicita la devolución del dinero y deja constancia de la operación, los plazos y las condiciones de devolución aplicables.",
        words: 1135,
        pages: 5,
    },
];
