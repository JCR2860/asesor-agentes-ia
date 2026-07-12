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
    content: string; // Texto profesional extenso con campos a rellenar (___)
};

export const documentTemplates: DocumentTemplate[] = [
    // ─────────────────────────────────────────────────────────────
    //  MERCANTIL
    // ─────────────────────────────────────────────────────────────
    {
        id: "nda-pro",
        title: "Acuerdo de Confidencialidad (NDA) Reforzado",
        category: "mercantil",
        description: "NDA bilateral de nivel corporativo: protege secretos empresariales, algoritmos, know-how y datos personales, con cláusula penal y sumisión expresa.",
        content: `ACUERDO DE CONFIDENCIALIDAD Y NO DIVULGACIÓN (NDA)

En __________________, a ____ de ________________ de 20____.

REUNIDOS

DE UNA PARTE, D./Dña. _________________________________, mayor de edad, con DNI/NIE número __________________, actuando en nombre y representación de la mercantil _________________________________, con C.I.F. __________________ y domicilio social en _________________________________, constituida mediante escritura autorizada por el Notario de __________________ D./Dña. __________________ e inscrita en el Registro Mercantil de __________________ (en adelante, la "PARTE DIVULGADORA" o "Parte A").

DE OTRA PARTE, D./Dña. _________________________________, mayor de edad, con DNI/NIE número __________________, actuando en nombre y representación de la mercantil _________________________________, con C.I.F. __________________ y domicilio social en _________________________________ (en adelante, la "PARTE RECEPTORA" o "Parte B").

Ambas partes, en la representación que ostentan, se reconocen recíprocamente la capacidad legal necesaria para obligarse mediante el presente Acuerdo y, a tal efecto,

EXPONEN

I.- Que las partes están interesadas en iniciar conversaciones y evaluar una posible colaboración empresarial consistente en _________________________________ (en adelante, la "FINALIDAD").

II.- Que para el desarrollo de dicha FINALIDAD resulta necesario que las partes se intercambien información técnica, financiera, comercial, industrial y estratégica de carácter reservado.

III.- Que las partes desean regular las condiciones bajo las cuales dicha información será revelada y tratada, garantizando su confidencialidad.

En su virtud, las partes acuerdan suscribir el presente Acuerdo con arreglo a las siguientes

CLÁUSULAS

PRIMERA.- OBJETO Y CARÁCTER BILATERAL.
El presente Acuerdo tiene por objeto regular el intercambio de Información Confidencial entre las partes con carácter recíproco, de modo que cada una podrá actuar indistintamente como parte divulgadora o receptora, quedando ambas sujetas a idénticas obligaciones.

SEGUNDA.- DEFINICIÓN DE INFORMACIÓN CONFIDENCIAL.
Se entenderá por "Información Confidencial" toda información, dato o material, con independencia de su soporte (verbal, escrito, gráfico, magnético o electrónico), que una parte revele a la otra, incluyendo con carácter enunciativo y no limitativo: secretos empresariales e industriales, código fuente, algoritmos, arquitecturas de software, bases de datos, metodologías, planes de negocio, proyecciones financieras, listados y datos de clientes y proveedores, estrategias de marketing, precios, márgenes, know-how y cualquier información que, por su naturaleza, deba razonablemente considerarse reservada. Tendrá esta consideración con arreglo a la Ley 1/2019, de 20 de febrero, de Secretos Empresariales.

TERCERA.- OBLIGACIONES DE LA PARTE RECEPTORA.
La Parte Receptora se obliga a:
a) Mantener la Información Confidencial con la más estricta reserva, aplicando un grado de diligencia no inferior al que emplea con su propia información confidencial y, en todo caso, el de un ordenado empresario.
b) Utilizar la Información Confidencial única y exclusivamente para la FINALIDAD, quedando prohibido cualquier otro uso, directo o indirecto, en beneficio propio o de terceros.
c) No reproducir, copiar ni registrar la Información Confidencial salvo en la medida imprescindible para la FINALIDAD.
d) Limitar el acceso a la Información Confidencial a aquellos administradores, empleados o asesores que necesiten conocerla ("need to know"), quienes deberán estar sujetos a obligaciones de confidencialidad de alcance equivalente, respondiendo la Parte Receptora de su incumplimiento como si fuera propio.
e) No realizar ingeniería inversa, descompilación ni desensamblado de ningún material, software o prototipo recibido.

CUARTA.- EXCLUSIONES.
No tendrá la consideración de Información Confidencial aquella que la Parte Receptora pueda acreditar fehacientemente que: (i) era de dominio público en el momento de su revelación o pasó a serlo posteriormente sin incumplimiento del presente Acuerdo; (ii) ya obraba legítimamente en su poder con anterioridad y sin obligación de confidencialidad; (iii) fue desarrollada de forma independiente sin utilizar la Información Confidencial; o (iv) fue obtenida lícitamente de un tercero no obligado a secreto.

QUINTA.- REVELACIÓN OBLIGATORIA POR LEY.
Si la Parte Receptora resultara legalmente obligada a revelar Información Confidencial por mandato de una autoridad administrativa o judicial, lo notificará de inmediato a la Parte Divulgadora, revelará únicamente la información estrictamente exigida y colaborará para que se le dispense el tratamiento más reservado posible.

SEXTA.- PROPIEDAD Y AUSENCIA DE LICENCIA.
La Información Confidencial y cuantos derechos de propiedad intelectual e industrial recaigan sobre ella son y seguirán siendo propiedad exclusiva de la Parte Divulgadora. El presente Acuerdo no supone la concesión de licencia, cesión ni transmisión de derecho alguno.

SÉPTIMA.- PROTECCIÓN DE DATOS PERSONALES.
Cuando la Información Confidencial incluya datos de carácter personal, la Parte Receptora los tratará conforme al Reglamento (UE) 2016/679 (RGPD) y a la Ley Orgánica 3/2018 (LOPDGDD), aplicando las medidas técnicas y organizativas adecuadas y absteniéndose de utilizarlos para finalidad distinta de la FINALIDAD.

OCTAVA.- DURACIÓN.
El presente Acuerdo entrará en vigor en la fecha de su firma. Las obligaciones de confidencialidad se mantendrán vigentes durante toda la relación entre las partes y subsistirán durante un plazo de ______ años (recomendado: mínimo 3) tras su finalización. Respecto de la información que constituya secreto empresarial, la obligación se mantendrá mientras conserve tal condición.

NOVENA.- DEVOLUCIÓN O DESTRUCCIÓN.
A la finalización del Acuerdo o a simple requerimiento de la Parte Divulgadora, la Parte Receptora devolverá o destruirá, a elección de aquella, toda la Información Confidencial y sus copias, certificando por escrito su destrucción.

DÉCIMA.- PENALIZACIÓN POR INCUMPLIMIENTO.
El incumplimiento de las obligaciones aquí asumidas facultará a la parte perjudicada para reclamar la indemnización de los daños y perjuicios causados. Las partes pactan expresamente, como cláusula penal, una indemnización mínima de __________________ EUR, sin perjuicio del derecho a reclamar los daños adicionales que se acrediten y de las acciones civiles y penales que procedan.

UNDÉCIMA.- MISCELÁNEA.
La nulidad de cualquier cláusula no afectará a la validez del resto del Acuerdo. La tolerancia o el retraso en el ejercicio de un derecho no supondrá renuncia al mismo. El presente Acuerdo constituye la totalidad de lo pactado entre las partes sobre esta materia.

DUODÉCIMA.- LEY APLICABLE Y JURISDICCIÓN.
El presente Acuerdo se rige por la legislación española. Para la resolución de cualquier controversia, las partes, con renuncia expresa a su propio fuero, se someten a los Juzgados y Tribunales de __________________.

Y en prueba de conformidad, las partes firman el presente Acuerdo por duplicado y a un solo efecto, en el lugar y fecha indicados en el encabezamiento.


____________________________          ____________________________
LA PARTE DIVULGADORA (Parte A)         LA PARTE RECEPTORA (Parte B)`
    },
    {
        id: "prestacion-servicios",
        title: "Contrato de Prestación de Servicios Profesionales (B2B / Freelance)",
        category: "mercantil",
        description: "Contrato mercantil completo para consultores, agencias y autónomos: alcance, hitos, propiedad intelectual, SLA, penalizaciones y no captación.",
        content: `CONTRATO DE PRESTACIÓN DE SERVICIOS PROFESIONALES

En __________________, a ____ de ________________ de 20____.

REUNIDOS

DE UNA PARTE, _________________________________, con C.I.F./DNI __________________ y domicilio en _________________________________, representada por D./Dña. _________________________________ (en adelante, el "CLIENTE").

DE OTRA PARTE, _________________________________, con C.I.F./DNI __________________ y domicilio en _________________________________, dado de alta en el epígrafe del IAE / RETA correspondiente (en adelante, el "PRESTADOR").

Ambas partes se reconocen capacidad legal suficiente para contratar y obligarse y, a tal fin,

EXPONEN

I.- Que el PRESTADOR es un profesional/empresa especializado en _________________________________, con medios propios, organización y experiencia acreditada.
II.- Que el CLIENTE está interesado en contratar dichos servicios en los términos que se detallan.

CLÁUSULAS

PRIMERA.- OBJETO Y ALCANCE DE LOS SERVICIOS.
El PRESTADOR se obliga a prestar al CLIENTE los siguientes servicios (en adelante, los "Servicios"): _________________________________. El detalle de entregables, especificaciones técnicas y fases se recoge en el Anexo I (Pliego de Alcance), que forma parte inseparable del presente contrato.

SEGUNDA.- NATURALEZA MERCANTIL E INDEPENDENCIA.
La relación entre las partes es estrictamente mercantil. El PRESTADOR actúa con plena autonomía e independencia, con sus propios medios y organización, sin sujeción a horario, dirección ni disciplina del CLIENTE, asumiendo sus propias obligaciones fiscales y de Seguridad Social. Nada en este contrato podrá interpretarse como constitutivo de relación laboral.

TERCERA.- PLAZO DE EJECUCIÓN E HITOS.
Los Servicios se ejecutarán entre el ____ de ________________ de 20____ y el ____ de ________________ de 20____, conforme al siguiente calendario de hitos:
- Hito 1: _________________________________ — fecha: ______________.
- Hito 2: _________________________________ — fecha: ______________.
- Hito 3: _________________________________ — fecha: ______________.

CUARTA.- HONORARIOS Y FORMA DE PAGO.
El precio de los Servicios se fija en __________________ EUR, más el IVA legalmente aplicable. El pago se realizará mediante __________________ (transferencia/domiciliación) conforme a: __________________ (p. ej. 30% a la firma, 40% al Hito 2, 30% a la entrega). Las facturas se abonarán en un plazo de ______ días desde su emisión. El retraso devengará el interés de demora previsto en la Ley 3/2004 de lucha contra la morosidad.

QUINTA.- OBLIGACIONES DEL CLIENTE.
El CLIENTE se obliga a facilitar en plazo la información, accesos y materiales necesarios, a designar un interlocutor con capacidad de decisión y a validar los entregables en un plazo máximo de ______ días hábiles, entendiéndose aceptados de no mediar objeción motivada en dicho plazo.

SEXTA.- NIVEL DE SERVICIO Y REVISIONES.
El PRESTADOR ejecutará los Servicios conforme a la lex artis de su profesión. Se incluyen ______ rondas de revisión por entregable; las revisiones adicionales se facturarán a razón de __________________ EUR/hora.

SÉPTIMA.- PROPIEDAD INTELECTUAL E INDUSTRIAL.
Una vez abonados íntegramente los honorarios, el PRESTADOR cede al CLIENTE, en exclusiva y con la máxima amplitud legal, para todo el mundo y por el máximo plazo legal, los derechos de explotación (reproducción, distribución, comunicación pública y transformación) sobre los entregables originales creados a su medida. Se exceptúan las herramientas, librerías, componentes preexistentes y el know-how del PRESTADOR, sobre los que este concede al CLIENTE una licencia no exclusiva e indefinida para el uso de los entregables. Hasta el pago íntegro, el PRESTADOR conserva todos los derechos.

OCTAVA.- CONFIDENCIALIDAD.
Ambas partes guardarán secreto sobre la información confidencial a la que accedan, obligación que subsistirá ______ años tras la finalización del contrato.

NOVENA.- PROTECCIÓN DE DATOS.
Si la prestación implica el acceso del PRESTADOR a datos personales responsabilidad del CLIENTE, las partes suscribirán el correspondiente contrato de encargo de tratamiento conforme al art. 28 RGPD (Anexo II).

DÉCIMA.- NO CAPTACIÓN.
Durante la vigencia del contrato y los ______ meses siguientes, ninguna parte captará ni contratará, directa o indirectamente, al personal de la otra que haya intervenido en los Servicios, salvo autorización escrita.

UNDÉCIMA.- RESPONSABILIDAD.
El PRESTADOR responderá de los daños directos causados por dolo o negligencia grave, limitándose su responsabilidad total al importe de los honorarios percibidos en los últimos 12 meses, salvo en los supuestos en que la ley no permita dicha limitación.

DUODÉCIMA.- RESOLUCIÓN.
Cualquier parte podrá resolver el contrato por incumplimiento grave de la otra no subsanado en ______ días desde el requerimiento fehaciente. El CLIENTE podrá desistir en cualquier momento abonando los Servicios ejecutados y los gastos comprometidos.

DECIMOTERCERA.- LEY Y JURISDICCIÓN.
El presente contrato se rige por la legislación española. Las partes se someten a los Juzgados y Tribunales de __________________.

Y en prueba de conformidad, firman por duplicado en el lugar y fecha indicados.


____________________________          ____________________________
EL CLIENTE                             EL PRESTADOR`
    },
    {
        id: "pacto-socios",
        title: "Pacto de Socios (Startups y PYMES)",
        category: "mercantil",
        description: "Pacto parasocial de inversión con vesting, arrastre (drag-along), acompañamiento (tag-along), antidilución, no competencia y régimen de salida.",
        content: `PACTO DE SOCIOS

En __________________, a ____ de ________________ de 20____.

REUNIDOS

Los abajo firmantes, en su condición de socios de la mercantil _________________________________, S.L. (en adelante, la "Sociedad"), con C.I.F. __________________ y domicilio social en _________________________________:

- D./Dña. _________________________________, DNI __________________, titular del ______% del capital social (Socio Fundador).
- D./Dña. _________________________________, DNI __________________, titular del ______% del capital social (Socio Fundador).
- D./Dña. _________________________________, DNI __________________, titular del ______% del capital social (Socio Inversor).

EXPONEN

I.- Que los firmantes son titulares de la totalidad / mayoría de las participaciones sociales de la Sociedad.
II.- Que es su voluntad regular sus relaciones como socios, la gobernanza de la Sociedad y el régimen de transmisión de participaciones, complementando los Estatutos Sociales.
III.- Que este Pacto tiene naturaleza de pacto parasocial (art. 29 LSC) y obliga a todos los firmantes.

ESTIPULACIONES

PRIMERA.- OBJETO Y PREVALENCIA.
El presente Pacto regula las relaciones entre los socios. En caso de contradicción con los Estatutos y en todo aquello que sea legalmente disponible entre las partes, prevalecerá lo dispuesto en este Pacto, obligándose los socios a promover las modificaciones estatutarias necesarias.

SEGUNDA.- GOBIERNO Y MAYORÍAS REFORZADAS.
El órgano de administración será _________________________________. Requerirán el voto favorable de socios que representen al menos el ______% del capital (materias reservadas): (i) modificación de estatutos; (ii) ampliaciones y reducciones de capital; (iii) aprobación de presupuesto anual y política de retribución; (iv) endeudamiento superior a __________________ EUR; (v) reparto de dividendos; (vi) operaciones vinculadas; (vii) venta de activos esenciales; y (viii) fusión, escisión o disolución.

TERCERA.- DEDICACIÓN Y VESTING DE LOS FUNDADORES.
Los Socios Fundadores se obligan a dedicación plena y exclusiva a la Sociedad. Sus participaciones quedan sujetas a consolidación progresiva ("vesting") durante ______ años, con un periodo inicial de carencia ("cliff") de ______ meses. En caso de cese, se distinguirá entre "Good Leaver" y "Bad Leaver" a efectos del precio de recompra de las participaciones no consolidadas, conforme al Anexo I.

CUARTA.- RESTRICCIÓN A LA TRANSMISIÓN (LOCK-UP).
Durante ______ años desde la firma, ningún socio podrá transmitir sus participaciones sin el consentimiento previo y escrito de los socios que representen el ______% del capital, salvo las transmisiones expresamente permitidas en este Pacto.

QUINTA.- DERECHO DE ADQUISICIÓN PREFERENTE.
Cualquier transmisión proyectada deberá ofrecerse primero a los demás socios, a prorrata de su participación, en los términos y precio ofertados por el tercero de buena fe.

SEXTA.- DERECHO DE ACOMPAÑAMIENTO (TAG-ALONG).
Si uno o varios socios que representen la mayoría del capital transmitieran sus participaciones a un tercero, los socios minoritarios tendrán derecho a sumarse a la venta en las mismas condiciones y precio por participación.

SÉPTIMA.- DERECHO DE ARRASTRE (DRAG-ALONG).
Si un tercero de buena fe ofreciera adquirir el 100% del capital y la oferta fuese aceptada por socios que representen al menos el ______% del capital, estos podrán obligar al resto de socios a vender sus participaciones en idénticas condiciones y precio por participación.

OCTAVA.- ANTIDILUCIÓN Y PREFERENCIA DE LIQUIDACIÓN.
El Socio Inversor gozará de protección antidilución en futuras rondas a valoración inferior ("down round") mediante ajuste de ______ (weighted average / full ratchet). En caso de liquidación o venta, tendrá derecho a una preferencia de liquidación de ______ (1x) sobre su inversión, con carácter ______ (participativo / no participativo).

NOVENA.- NO COMPETENCIA Y NO CAPTACIÓN.
Mientras ostenten la condición de socios y durante ______ meses tras dejar de serlo, los socios se abstendrán de desarrollar actividades que compitan con el objeto social y de captar clientes, proveedores o empleados de la Sociedad.

DÉCIMA.- PROPIEDAD INTELECTUAL.
Los socios y colaboradores cederán a la Sociedad la totalidad de los derechos de propiedad intelectual e industrial generados en relación con la actividad social.

UNDÉCIMA.- REPARTO DE DIVIDENDOS.
La política de dividendos se acordará conforme a la cláusula de mayorías reforzadas, priorizando la reinversión durante la fase de crecimiento.

DUODÉCIMA.- RESOLUCIÓN DE CONFLICTOS Y SITUACIONES DE BLOQUEO.
Los conflictos se intentarán resolver de buena fe. En caso de bloqueo persistente del órgano social, se aplicará el mecanismo de _________________________________ (p. ej. cláusula de "ruleta rusa" / "texas shoot-out") descrito en el Anexo II.

DECIMOTERCERA.- DURACIÓN, LEY Y JURISDICCIÓN.
El presente Pacto tendrá una duración de ______ años, prorrogable. Se rige por la legislación española y las partes se someten a _________________________________ (Juzgados de __________________ / arbitraje de la Corte de __________________).

Y en prueba de conformidad, firman todos los socios por ejemplar duplicado.


____________________    ____________________    ____________________
Socio Fundador          Socio Fundador          Socio Inversor`
    },
    {
        id: "agencia-comercial",
        title: "Contrato de Agencia Comercial",
        category: "mercantil",
        description: "Contrato de agencia conforme a la Ley 12/1992: exclusividad, comisiones, zona, y la crítica indemnización por clientela.",
        content: `CONTRATO DE AGENCIA COMERCIAL

En __________________, a ____ de ________________ de 20____.

REUNIDOS

DE UNA PARTE, _________________________________, con C.I.F. __________________ y domicilio en _________________________________ (en adelante, el "EMPRESARIO" o "Principal").
DE OTRA PARTE, _________________________________, con C.I.F./DNI __________________ y domicilio en _________________________________ (en adelante, el "AGENTE").

EXPONEN que el EMPRESARIO desea promover la comercialización de sus productos/servicios y el AGENTE, de manera independiente, se dedica profesionalmente a la promoción de operaciones mercantiles, por lo que acuerdan suscribir el presente contrato de agencia, regulado por la Ley 12/1992, de 27 de mayo, sobre Contrato de Agencia, con arreglo a las siguientes

CLÁUSULAS

PRIMERA.- OBJETO.
El AGENTE se obliga, de modo continuado y estable, a promover y, en su caso, concluir por cuenta del EMPRESARIO la venta de los siguientes productos/servicios: _________________________________, actuando como intermediario independiente sin asumir el riesgo de las operaciones, salvo pacto expreso de garantía.

SEGUNDA.- ZONA Y EXCLUSIVIDAD.
La actuación del AGENTE se circunscribe a la siguiente zona geográfica y/o grupo de clientes: _________________________________. Se pacta que dicha zona tendrá / no tendrá carácter de EXCLUSIVA a favor del AGENTE.

TERCERA.- OBLIGACIONES DEL AGENTE.
El AGENTE actuará de buena fe, velará por los intereses del EMPRESARIO, desarrollará una actividad adecuada para promover las operaciones, comunicará la información relevante de mercado y se ajustará a las instrucciones razonables recibidas, sin poder delegar salvo autorización.

CUARTA.- OBLIGACIONES DEL EMPRESARIO.
El EMPRESARIO facilitará muestras, catálogos, tarifas y la información necesaria, comunicará al AGENTE la aceptación o rechazo de las operaciones y su ejecución, y abonará puntualmente las comisiones devengadas.

QUINTA.- COMISIONES.
El AGENTE percibirá una comisión del ______% sobre el importe (neto/bruto) de las operaciones concluidas gracias a su intervención. La comisión se devengará en el momento de _________________________________ (ejecución de la operación / pago por el cliente) y se liquidará dentro del último día del mes siguiente al trimestre natural de su devengo.

SEXTA.- DURACIÓN.
El contrato tendrá una duración _________________________________ (indefinida / determinada, hasta el ____ de ________________ de 20____). En los contratos de duración indefinida, cualquier parte podrá denunciarlo mediante preaviso escrito de un mes por cada año de vigencia, con un máximo de seis meses.

SÉPTIMA.- INDEMNIZACIÓN POR CLIENTELA.
A la extinción del contrato, el AGENTE tendrá derecho a la indemnización por clientela prevista en el art. 28 de la Ley 12/1992 cuando hubiera aportado nuevos clientes o incrementado sensiblemente las operaciones y su actividad pueda seguir produciendo ventajas sustanciales al EMPRESARIO. Su importe no podrá exceder de la media anual de las remuneraciones percibidas durante los últimos cinco años (o del periodo de vigencia si fuera inferior).

OCTAVA.- INDEMNIZACIÓN POR DAÑOS Y PACTO DE LIMITACIÓN DE COMPETENCIA.
Se estará a lo dispuesto en los arts. 29 y 20 de la Ley 12/1992. Cualquier pacto de limitación de competencia posterior a la extinción no podrá exceder de dos años y se limitará a la zona y productos objeto del contrato.

NOVENA.- LEY Y JURISDICCIÓN.
El contrato se rige por la Ley 12/1992 y demás normativa española aplicable. Las partes se someten a los Juzgados y Tribunales del domicilio del AGENTE, conforme al art. 46 de dicha Ley (norma imperativa).

Y en prueba de conformidad, firman por duplicado.


____________________________          ____________________________
EL EMPRESARIO                          EL AGENTE`
    },
    {
        id: "reconocimiento-deuda",
        title: "Reconocimiento de Deuda con Calendario de Pagos",
        category: "mercantil",
        description: "Documento que blinda una deuda: reconoce el importe, fija un calendario, pacta intereses, vencimiento anticipado y facilita una futura reclamación judicial.",
        content: `DOCUMENTO DE RECONOCIMIENTO DE DEUDA Y COMPROMISO DE PAGO

En __________________, a ____ de ________________ de 20____.

REUNIDOS

DE UNA PARTE, D./Dña. _________________________________, mayor de edad, con DNI/NIE __________________ y domicilio en _________________________________ (en adelante, el "ACREEDOR").

DE OTRA PARTE, D./Dña. _________________________________, mayor de edad, con DNI/NIE __________________ y domicilio en _________________________________ (en adelante, el "DEUDOR").

Ambas partes se reconocen capacidad legal para obligarse y

EXPONEN

I.- Que el DEUDOR adeuda al ACREEDOR la cantidad de __________________ EUR (___________________________ euros), cuyo origen es el siguiente: _________________________________ (p. ej. facturas impagadas nº ___, préstamo, entrega de género, etc.).
II.- Que el DEUDOR reconoce de forma expresa, pura, simple e incondicional la existencia, legitimidad y exigibilidad de dicha deuda.
III.- Que las partes desean documentar la deuda y fijar un calendario para su pago.

CLÁUSULAS

PRIMERA.- RECONOCIMIENTO.
El DEUDOR reconoce adeudar al ACREEDOR la cantidad de __________________ EUR, obligándose a su pago en los términos de este documento.

SEGUNDA.- CALENDARIO DE PAGOS.
El importe se abonará mediante ______ cuotas (mensuales/las que se pacten) de __________________ EUR cada una, con vencimiento el día ____ de cada mes, comenzando el ____ de ________________ de 20____ y finalizando el ____ de ________________ de 20____, mediante ingreso o transferencia a la cuenta IBAN __________________________________.

TERCERA.- INTERESES.
La deuda devengará / no devengará un interés remuneratorio del ______% anual. En caso de impago, la cantidad vencida devengará el interés de demora del ______% anual desde la fecha del incumplimiento.

CUARTA.- VENCIMIENTO ANTICIPADO.
El impago de ______ cuotas, consecutivas o alternas, facultará al ACREEDOR para declarar vencida la totalidad de la deuda pendiente y exigir su pago íntegro de forma inmediata, más intereses y gastos.

QUINTA.- IMPUTACIÓN DE PAGOS Y GASTOS.
Los pagos se imputarán primero a gastos, después a intereses y por último al principal. Serán de cuenta del DEUDOR los gastos derivados de una eventual reclamación, incluidos los honorarios de abogado y procurador aunque su intervención no fuera preceptiva.

SEXTA.- TÍTULO PARA RECLAMACIÓN.
Las partes reconocen que el presente documento constituye prueba de la deuda a los efectos oportunos, incluida su reclamación por el procedimiento monitorio (arts. 812 y ss. LEC) o el que corresponda.

SÉPTIMA.- LEY Y JURISDICCIÓN.
Este documento se rige por la legislación española. Para cualquier controversia, las partes se someten a los Juzgados y Tribunales de __________________.

Y en prueba de conformidad, firman por duplicado. Se recomienda su elevación a público ante Notario para reforzar su eficacia ejecutiva.


____________________________          ____________________________
EL ACREEDOR                            EL DEUDOR`
    },

    // ─────────────────────────────────────────────────────────────
    //  INMOBILIARIO
    // ─────────────────────────────────────────────────────────────
    {
        id: "arras-pro",
        title: "Contrato de Arras Penitenciales (Art. 1454 CC)",
        category: "inmobiliario",
        description: "Reserva de compraventa blindada: describe la finca y sus cargas, fija el precio, el plazo de escritura, el reparto de gastos y la penalización por desistimiento.",
        content: `CONTRATO DE ARRAS PENITENCIALES

En __________________, a ____ de ________________ de 20____.

REUNIDOS

DE UNA PARTE, como PARTE VENDEDORA: D./Dña. _________________________________, mayor de edad, con DNI/NIE __________________ y domicilio en _________________________________.
DE OTRA PARTE, como PARTE COMPRADORA: D./Dña. _________________________________, mayor de edad, con DNI/NIE __________________ y domicilio en _________________________________.

Ambas partes se reconocen capacidad legal suficiente para contratar y

EXPONEN

I.- Que la PARTE VENDEDORA es propietaria en pleno dominio de la siguiente finca urbana:
Descripción: _________________________________.
Dirección: _________________________________.
Referencia catastral: __________________________________.
Inscripción: Registro de la Propiedad de __________________, tomo ____, libro ____, folio ____, finca nº ______.
Cuota de participación / superficie: _________________________________.

II.- Que la finca se encuentra (marcar): [ ] libre de cargas y gravámenes; [ ] gravada con _________________________________ (p. ej. hipoteca a favor de __________________ con saldo pendiente de __________________ EUR).
III.- Que la PARTE COMPRADORA está interesada en adquirir la finca y ambas partes acuerdan formalizar el presente contrato de arras penitenciales.

CLÁUSULAS

PRIMERA.- OBJETO Y ESTADO DE CARGAS.
La PARTE VENDEDORA se obliga a vender, y la COMPRADORA a comprar, la finca descrita, que se transmitirá libre de cargas, gravámenes, arrendatarios y ocupantes, y al corriente en el pago de tributos, suministros y cuotas de la comunidad de propietarios. La PARTE VENDEDORA declara hallarse al corriente de dichas obligaciones.

SEGUNDA.- PRECIO.
El precio total y cerrado de la compraventa se fija en __________________ EUR (___________________________ euros).

TERCERA.- ENTREGA DE ARRAS.
En este acto, la PARTE COMPRADORA entrega a la VENDEDORA la cantidad de __________________ EUR en concepto de ARRAS PENITENCIALES, que se imputará al precio final. La PARTE VENDEDORA declara recibir dicha cantidad mediante __________________ (transferencia/cheque) y otorga la más eficaz carta de pago.

CUARTA.- NATURALEZA DE LAS ARRAS (ART. 1454 CC).
Las cantidades entregadas tienen la naturaleza de arras penitenciales del art. 1454 del Código Civil, de modo que:
a) Si desistiera la PARTE COMPRADORA, perderá la cantidad entregada, que quedará en beneficio de la VENDEDORA.
b) Si desistiera la PARTE VENDEDORA, deberá devolver a la COMPRADORA el DUPLO de la cantidad recibida.

QUINTA.- PLAZO Y OTORGAMIENTO DE ESCRITURA.
La escritura pública de compraventa se otorgará, a más tardar, el día ____ de ________________ de 20____, ante el Notario que designe la PARTE COMPRADORA. En dicho acto se abonará el precio pendiente y se entregará la posesión y las llaves del inmueble.

SEXTA.- CONDICIÓN DE FINANCIACIÓN (OPCIONAL).
La eficacia de la compraventa queda / no queda condicionada a la obtención por la COMPRADORA de financiación hipotecaria por importe mínimo de __________________ EUR antes del ____ de ________________ de 20____. De no obtenerse y acreditarse dicha denegación, se restituirán las arras sin penalización.

SÉPTIMA.- GASTOS E IMPUESTOS.
Los gastos e impuestos se distribuirán conforme a la Ley: el Impuesto sobre el Incremento de Valor de los Terrenos (plusvalía municipal) y los gastos de la escritura matriz corresponden a la VENDEDORA; el Impuesto de Transmisiones Patrimoniales (ITP) o el IVA/AJD, la primera copia y la inscripción registral corresponden a la COMPRADORA, salvo el pacto en contrario que aquí se indique: _________________________________.

OCTAVA.- LEY Y JURISDICCIÓN.
Este contrato se rige por la legislación española. Para cualquier controversia, las partes se someten a los Juzgados y Tribunales de la localidad donde radica la finca.

Y en prueba de conformidad, firman por duplicado en el lugar y fecha del encabezamiento.


____________________________          ____________________________
LA PARTE VENDEDORA                     LA PARTE COMPRADORA`
    },
    {
        id: "alquiler-vivienda",
        title: "Contrato de Arrendamiento de Vivienda Habitual (LAU)",
        category: "inmobiliario",
        description: "Contrato de alquiler adaptado a la LAU y a la Ley 12/2023 por el derecho a la vivienda: duración, prórrogas, fianza, actualización de renta y reparto de gastos.",
        content: `CONTRATO DE ARRENDAMIENTO DE VIVIENDA

En __________________, a ____ de ________________ de 20____.

REUNIDOS

DE UNA PARTE, como ARRENDADOR: D./Dña. _________________________________, con DNI/NIE __________________ y domicilio en _________________________________.
DE OTRA PARTE, como ARRENDATARIO: D./Dña. _________________________________, con DNI/NIE __________________ y domicilio a efectos de notificaciones en _________________________________.

EXPONEN

I.- Que el ARRENDADOR es propietario/usufructuario de la vivienda sita en _________________________________, con referencia catastral __________________________________, y cédula de habitabilidad / certificado energético con calificación ______.
II.- Que ambas partes convienen el arrendamiento de dicha vivienda, destinada a satisfacer la necesidad permanente de vivienda del ARRENDATARIO, con sujeción a la Ley 29/1994 de Arrendamientos Urbanos (LAU) y a la Ley 12/2023 por el derecho a la vivienda.

CLÁUSULAS

PRIMERA.- OBJETO Y DESTINO.
Se arrienda la vivienda descrita, junto con el mobiliario y enseres que se relacionan en el Anexo I (inventario), con destino exclusivo a vivienda habitual del ARRENDATARIO y las personas que con él convivan. Queda prohibido subarrendar o ceder sin consentimiento escrito del ARRENDADOR.

SEGUNDA.- DURACIÓN Y PRÓRROGAS.
El plazo de duración se pacta en ______ año/s, con inicio el ____ de ________________ de 20____. Llegado el vencimiento, el contrato se prorrogará obligatoriamente por plazos anuales hasta alcanzar una duración mínima de cinco años (siete si el arrendador es persona jurídica), salvo que el ARRENDATARIO manifieste su voluntad de no renovar con treinta días de antelación. Transcurrido dicho periodo, operará la prórroga tácita prevista en el art. 10 LAU.

TERCERA.- DESISTIMIENTO DEL ARRENDATARIO.
El ARRENDATARIO podrá desistir una vez transcurridos seis meses, comunicándolo con treinta días de antelación. Se pacta / no se pacta indemnización equivalente a una mensualidad por cada año que reste por cumplir (art. 11 LAU).

CUARTA.- RENTA.
La renta se fija en __________________ EUR mensuales, que se abonarán dentro de los siete primeros días de cada mes mediante transferencia a la cuenta IBAN __________________________________. El impago de la renta faculta al ARRENDADOR para instar el desahucio.

QUINTA.- ACTUALIZACIÓN DE LA RENTA.
La renta se actualizará anualmente conforme al índice de referencia que legalmente resulte aplicable en cada momento y dentro de los límites establecidos por la normativa vigente (Ley 12/2023). En zonas declaradas de mercado tensionado se aplicarán, además, los límites específicos previstos.

SEXTA.- FIANZA Y GARANTÍAS ADICIONALES.
El ARRENDATARIO entrega en este acto la cantidad de __________________ EUR, equivalente a una mensualidad, en concepto de fianza legal, que el ARRENDADOR depositará en el organismo autonómico competente. Se pactan / no se pactan garantías adicionales por importe máximo de dos mensualidades.

SÉPTIMA.- GASTOS Y SUMINISTROS.
Serán de cuenta del ARRENDATARIO los suministros individualizables por contador (agua, luz, gas, telecomunicaciones). Los gastos generales de comunidad y el IBI corresponden al ARRENDADOR (salvo pacto expreso en contrario recogido aquí: _________________________________). Conforme a la Ley 12/2023, los gastos de gestión inmobiliaria y de formalización del contrato corren a cargo del arrendador cuando este sea persona jurídica.

OCTAVA.- CONSERVACIÓN Y OBRAS.
El ARRENDADOR realizará las reparaciones necesarias para conservar la habitabilidad. Las pequeñas reparaciones por el uso ordinario corresponden al ARRENDATARIO. Este no podrá realizar obras que modifiquen la configuración de la vivienda sin consentimiento escrito.

NOVENA.- PROHIBICIONES Y OBLIGACIONES.
El ARRENDATARIO destinará la vivienda al uso pactado, mantendrá la convivencia normal, no desarrollará actividades molestas, insalubres o ilícitas y permitirá las visitas de inspección razonablemente acordadas.

DÉCIMA.- RESOLUCIÓN.
El incumplimiento de las obligaciones esenciales por cualquiera de las partes facultará a la otra para resolver el contrato conforme al art. 27 LAU.

UNDÉCIMA.- LEY Y JURISDICCIÓN.
Este contrato se rige por la LAU y la Ley 12/2023. Las partes se someten a los Juzgados del lugar donde radique la vivienda.

Y en prueba de conformidad, firman por duplicado, con entrega de una copia a cada parte.


____________________________          ____________________________
EL ARRENDADOR                          EL ARRENDATARIO`
    },
    {
        id: "alquiler-local",
        title: "Arrendamiento de Local de Negocio (Uso Distinto de Vivienda)",
        category: "inmobiliario",
        description: "Contrato para locales comerciales y oficinas: renta, garantías, actividad, obras, traspaso y renuncia a la indemnización por clientela.",
        content: `CONTRATO DE ARRENDAMIENTO PARA USO DISTINTO DE VIVIENDA (LOCAL DE NEGOCIO)

En __________________, a ____ de ________________ de 20____.

REUNIDOS

DE UNA PARTE, como ARRENDADOR: _________________________________, con C.I.F./DNI __________________ y domicilio en _________________________________.
DE OTRA PARTE, como ARRENDATARIO: _________________________________, con C.I.F./DNI __________________ y domicilio en _________________________________.

EXPONEN que el ARRENDADOR es titular del local sito en _________________________________, referencia catastral __________________________________, y que el ARRENDATARIO desea arrendarlo para destinarlo a la actividad de _________________________________, sujetándose el contrato al régimen de los arrendamientos para uso distinto de vivienda de la LAU (arts. 29 y ss.), que otorga primacía a la voluntad de las partes.

CLÁUSULAS

PRIMERA.- OBJETO Y DESTINO.
Se arrienda el local descrito para el ejercicio exclusivo de la actividad de _________________________________. La obtención de licencias y autorizaciones administrativas corresponde al ARRENDATARIO, sin que el ARRENDADOR garantice la aptitud del local para una actividad concreta más allá de sus condiciones físicas.

SEGUNDA.- DURACIÓN.
La duración se pacta en ______ años, con inicio el ____ de ________________ de 20____, prorrogable por acuerdo de las partes. Se pacta / no se pacta un periodo de obligado cumplimiento de ______ años, cuyo incumplimiento por el ARRENDATARIO devengará una indemnización equivalente a _________________________________.

TERCERA.- RENTA Y ACTUALIZACIÓN.
La renta mensual se fija en __________________ EUR más el IVA aplicable, pagadera por meses anticipados. Se actualizará anualmente conforme a _________________________________ (índice pactado). Se pacta / no se pacta carencia de renta durante los primeros ______ meses para adecuación del local.

CUARTA.- FIANZA Y GARANTÍAS.
El ARRENDATARIO entrega dos mensualidades en concepto de fianza legal, más una garantía adicional de _________________________________ (aval bancario / depósito de ______ mensualidades).

QUINTA.- OBRAS Y CONSERVACIÓN.
El ARRENDATARIO podrá realizar las obras de acondicionamiento necesarias para su actividad, previa autorización escrita, quedando en beneficio del local a la finalización sin derecho a indemnización, salvo pacto. Las reparaciones estructurales corresponden al ARRENDADOR.

SEXTA.- CESIÓN Y TRASPASO.
Conforme al art. 32 LAU, el ARRENDATARIO podrá ceder o subarrendar el local, teniendo el ARRENDADOR derecho a la elevación de renta legalmente prevista. Se pacta la obligación de comunicación fehaciente en el plazo de un mes.

SÉPTIMA.- RENUNCIA A INDEMNIZACIÓN POR CLIENTELA.
Las partes pactan expresamente la renuncia del ARRENDATARIO a la indemnización del art. 34 LAU a la extinción del contrato por transcurso del plazo.

OCTAVA.- GASTOS.
Serán de cuenta del ARRENDATARIO los suministros, la comunidad de propietarios y el IBI del local (salvo pacto: _________________________________).

NOVENA.- RESOLUCIÓN, LEY Y JURISDICCIÓN.
El incumplimiento facultará a la resolución conforme al art. 35 LAU. El contrato se rige por la LAU y las partes se someten a los Juzgados de __________________.

Y en prueba de conformidad, firman por duplicado.


____________________________          ____________________________
EL ARRENDADOR                          EL ARRENDATARIO`
    },
    {
        id: "compraventa-inmueble",
        title: "Contrato Privado de Compraventa de Inmueble",
        category: "inmobiliario",
        description: "Contrato privado previo a la escritura pública: precio, forma de pago, subrogación o cancelación de hipoteca, entrega de posesión y saneamiento.",
        content: `CONTRATO PRIVADO DE COMPRAVENTA DE BIEN INMUEBLE

En __________________, a ____ de ________________ de 20____.

REUNIDOS

DE UNA PARTE, como VENDEDOR: D./Dña. _________________________________, con DNI/NIE __________________ y domicilio en _________________________________.
DE OTRA PARTE, como COMPRADOR: D./Dña. _________________________________, con DNI/NIE __________________ y domicilio en _________________________________.

EXPONEN

I.- Que el VENDEDOR es propietario en pleno dominio de la finca sita en _________________________________, referencia catastral __________________________________, inscrita en el Registro de la Propiedad de __________________, finca nº ______.
II.- Que su estado de cargas es: _________________________________ (libre / hipoteca a favor de __________________, saldo pendiente __________________ EUR).
III.- Que ambas partes acuerdan la compraventa con arreglo a las siguientes

CLÁUSULAS

PRIMERA.- OBJETO Y PRECIO.
El VENDEDOR vende y el COMPRADOR compra la finca descrita, libre de arrendatarios y ocupantes, por el precio total de __________________ EUR.

SEGUNDA.- FORMA DE PAGO.
El precio se abonará del siguiente modo: (i) __________________ EUR en este acto en concepto de señal, imputable al precio; (ii) __________________ EUR mediante _________________________________; y (iii) el resto, __________________ EUR, en el momento de la firma de la escritura pública.

TERCERA.- TRATAMIENTO DE LA HIPOTECA EXISTENTE.
El COMPRADOR se subrogará / no se subrogará en la hipoteca que grava la finca. En caso de no subrogación, el VENDEDOR se obliga a cancelarla registralmente antes o simultáneamente al otorgamiento de la escritura, destinando parte del precio a tal fin.

CUARTA.- ESCRITURA Y ENTREGA DE POSESIÓN.
La escritura pública se otorgará, a más tardar, el ____ de ________________ de 20____, ante Notario designado por el COMPRADOR. La entrega de la posesión y llaves se producirá en dicho acto, libre la finca de cargas, ocupantes y al corriente de gastos.

QUINTA.- GASTOS E IMPUESTOS.
Se distribuirán conforme a la Ley: la plusvalía municipal y los gastos de la matriz corresponden al VENDEDOR; el ITP/IVA-AJD, la copia y la inscripción, al COMPRADOR (salvo pacto: _________________________________).

SEXTA.- SANEAMIENTO Y EVICCIÓN.
El VENDEDOR responde de la evicción y de los vicios o defectos ocultos conforme a los arts. 1474 y ss. del Código Civil, y declara que sobre la finca no pesan cargas, deudas ni limitaciones distintas de las expresadas.

SÉPTIMA.- INCUMPLIMIENTO.
El incumplimiento de las obligaciones esenciales facultará a la parte cumplidora para exigir el cumplimiento forzoso o la resolución, con indemnización de daños y perjuicios (art. 1124 CC).

OCTAVA.- LEY Y JURISDICCIÓN.
Este contrato se rige por la legislación española. Las partes se someten a los Juzgados del lugar donde radica la finca.

Y en prueba de conformidad, firman por duplicado.


____________________________          ____________________________
EL VENDEDOR                            EL COMPRADOR`
    },

    // ─────────────────────────────────────────────────────────────
    //  LABORAL
    // ─────────────────────────────────────────────────────────────
    {
        id: "contrato-trabajo-pro",
        title: "Contrato de Trabajo Indefinido (Modelo Profesional)",
        category: "laboral",
        description: "Contrato laboral completo: grupo profesional, jornada, retribución, periodo de prueba, confidencialidad, propiedad intelectual, RGPD y régimen de teletrabajo.",
        content: `CONTRATO DE TRABAJO INDEFINIDO

En __________________, a ____ de ________________ de 20____.

REUNIDOS

DE UNA PARTE, la EMPRESA _________________________________, con C.I.F. __________________ y domicilio social en _________________________________, código de cuenta de cotización __________________, representada por D./Dña. _________________________________ (en adelante, la "EMPRESA").

DE OTRA PARTE, D./Dña. _________________________________, mayor de edad, con DNI/NIE __________________, número de afiliación a la Seguridad Social __________________ y domicilio en _________________________________ (en adelante, la "PERSONA TRABAJADORA").

Ambas partes se reconocen capacidad legal y acuerdan celebrar el presente contrato de trabajo, regulado por el Real Decreto Legislativo 2/2015 (Estatuto de los Trabajadores) y el convenio colectivo de aplicación, con arreglo a las siguientes

CLÁUSULAS

PRIMERA.- OBJETO Y CLASIFICACIÓN PROFESIONAL.
La PERSONA TRABAJADORA prestará servicios con la categoría/puesto de _________________________________, encuadrada en el Grupo Profesional ______ del Convenio Colectivo de _________________________________, desarrollando las siguientes funciones esenciales: _________________________________.

SEGUNDA.- DURACIÓN.
El contrato se concierta por tiempo INDEFINIDO, iniciándose la relación laboral el día ____ de ________________ de 20____.

TERCERA.- PERIODO DE PRUEBA.
Se establece un periodo de prueba de ______ (conforme al convenio y al art. 14 ET; con carácter general, seis meses para técnicos titulados y dos meses para el resto), durante el cual cualquiera de las partes podrá extinguir la relación sin preaviso ni indemnización.

CUARTA.- JORNADA, HORARIO Y REGISTRO.
La jornada será de ______ horas semanales, distribuidas de _________________________________. La EMPRESA llevará el registro diario de jornada conforme al art. 34.9 ET. El régimen de descansos y vacaciones (mínimo 30 días naturales) se ajustará al convenio.

QUINTA.- LUGAR DE TRABAJO Y TELETRABAJO.
El centro de trabajo se ubica en _________________________________. Se pacta / no se pacta la modalidad de trabajo a distancia en un porcentaje del ______%, que se regirá por el acuerdo específico de trabajo a distancia (Ley 10/2021) que se adjunta como Anexo.

SEXTA.- RETRIBUCIÓN.
La retribución bruta anual asciende a __________________ EUR, distribuida en ______ pagas, comprensiva del salario base y los complementos siguientes: _________________________________. Su abono se realizará mediante transferencia dentro de los ______ primeros días del mes siguiente al devengo.

SÉPTIMA.- CONFIDENCIALIDAD Y SECRETO PROFESIONAL.
La PERSONA TRABAJADORA guardará secreto sobre la información reservada de la EMPRESA y de sus clientes a la que acceda, obligación que subsistirá tras la extinción del contrato.

OCTAVA.- PROPIEDAD INTELECTUAL E INDUSTRIAL.
Las obras, invenciones y desarrollos realizados en el ejercicio de sus funciones corresponderán a la EMPRESA, conforme al Estatuto de los Trabajadores, la Ley de Propiedad Intelectual y la Ley de Patentes.

NOVENA.- PROTECCIÓN DE DATOS Y USO DE MEDIOS.
La PERSONA TRABAJADORA queda informada del tratamiento de sus datos para la gestión de la relación laboral conforme al RGPD y la LOPDGDD. El uso de los medios tecnológicos de la EMPRESA se sujetará a su política interna, respetándose los derechos digitales del art. 87 y ss. LOPDGDD.

DÉCIMA.- PREVENCIÓN DE RIESGOS LABORALES.
La EMPRESA garantizará la seguridad y salud conforme a la Ley 31/1995, y la PERSONA TRABAJADORA cumplirá las medidas de prevención y utilizará los equipos de protección facilitados.

UNDÉCIMA.- EXTINCIÓN.
La relación se extinguirá por las causas legalmente previstas en el art. 49 ET, con los efectos y las indemnizaciones que en cada caso correspondan.

DUODÉCIMA.- NORMATIVA APLICABLE.
En lo no previsto, se estará al Estatuto de los Trabajadores, al convenio colectivo aplicable y a la legislación laboral y de Seguridad Social vigente.

Y en prueba de conformidad, firman por duplicado.


____________________________          ____________________________
LA EMPRESA                             LA PERSONA TRABAJADORA`
    },
    {
        id: "alta-direccion",
        title: "Contrato de Alta Dirección (RD 1382/1985)",
        category: "laboral",
        description: "Relación laboral especial de directivos: poderes, retribución variable, blindaje, exclusividad, no competencia post-contractual y desistimiento.",
        content: `CONTRATO DE TRABAJO DE ALTA DIRECCIÓN

En __________________, a ____ de ________________ de 20____.

REUNIDOS

DE UNA PARTE, la EMPRESA _________________________________, con C.I.F. __________________ y domicilio en _________________________________, representada por su órgano de administración (en adelante, la "EMPRESA").
DE OTRA PARTE, D./Dña. _________________________________, con DNI/NIE __________________ (en adelante, el "ALTO DIRECTIVO").

EXPONEN que las partes acuerdan formalizar una relación laboral de carácter especial de alta dirección, regulada por el Real Decreto 1382/1985, de 1 de agosto, con arreglo a las siguientes

CLÁUSULAS

PRIMERA.- OBJETO Y FACULTADES.
El ALTO DIRECTIVO desempeñará el cargo de _________________________________, ejerciendo poderes inherentes a la titularidad jurídica de la empresa y relativos a sus objetivos generales, con autonomía y plena responsabilidad, sólo limitadas por los criterios e instrucciones del órgano de administración.

SEGUNDA.- DEDICACIÓN Y EXCLUSIVIDAD.
El ALTO DIRECTIVO prestará sus servicios en régimen de plena dedicación y exclusividad, no pudiendo desarrollar otras actividades, retribuidas o no, sin autorización expresa del órgano de administración.

TERCERA.- DURACIÓN.
El contrato se concierta por tiempo indefinido / por el plazo de ______ años, con inicio el ____ de ________________ de 20____. Se establece un periodo de prueba de hasta nueve meses.

CUARTA.- RETRIBUCIÓN.
La retribución se compone de: (i) una parte fija de __________________ EUR brutos anuales; (ii) una retribución variable de hasta el ______% de la fija en función de objetivos (Anexo I); y (iii) los siguientes beneficios: _________________________________ (vehículo, seguro, plan de pensiones, etc.).

QUINTA.- DESISTIMIENTO Y EXTINCIÓN.
La EMPRESA podrá desistir del contrato mediante preaviso de ______ meses (mínimo tres para contratos superiores a un año). En caso de desistimiento, el ALTO DIRECTIVO percibirá una indemnización de _________________________________ (a falta de pacto, siete días de salario en metálico por año, con el límite de seis mensualidades). En caso de despido declarado improcedente, la indemnización será de _________________________________ (a falta de pacto, veinte días por año con el límite de doce mensualidades).

SEXTA.- BLINDAJE POR CAMBIO DE CONTROL (OPCIONAL).
En caso de cambio de control de la EMPRESA, el ALTO DIRECTIVO tendrá derecho a _________________________________ .

SÉPTIMA.- PACTO DE NO COMPETENCIA POST-CONTRACTUAL.
Tras la extinción, el ALTO DIRECTIVO no competirá con la EMPRESA durante ______ meses (máximo dos años), percibiendo por ello una compensación de __________________ EUR.

OCTAVA.- CONFIDENCIALIDAD.
El ALTO DIRECTIVO mantendrá secreto sobre la información estratégica de la EMPRESA durante la relación y tras su extinción.

NOVENA.- LEGISLACIÓN APLICABLE Y JURISDICCIÓN.
Se aplicará el RD 1382/1985 y, supletoriamente, la legislación civil y mercantil. Las controversias se someterán a la jurisdicción social.

Y en prueba de conformidad, firman por duplicado.


____________________________          ____________________________
LA EMPRESA                             EL ALTO DIRECTIVO`
    },
    {
        id: "pacto-no-competencia",
        title: "Pacto de No Competencia Post-Contractual",
        category: "laboral",
        description: "Protege el know-how tras la salida de un empleado clave: objeto, ámbito, duración máxima legal, compensación económica proporcional y penalización.",
        content: `PACTO DE NO COMPETENCIA POST-CONTRACTUAL Y CONFIDENCIALIDAD

En __________________, a ____ de ________________ de 20____.

REUNIDOS

DE UNA PARTE, la EMPRESA _________________________________, con C.I.F. __________________ (en adelante, la "EMPRESA").
DE OTRA PARTE, D./Dña. _________________________________, con DNI/NIE __________________, que presta servicios como _________________________________ (en adelante, la "PERSONA TRABAJADORA").

EXPONEN que, dado el acceso de la PERSONA TRABAJADORA a información estratégica, clientela y know-how de la EMPRESA, ambas partes acuerdan suscribir el presente pacto al amparo del art. 21.2 del Estatuto de los Trabajadores, con arreglo a las siguientes

CLÁUSULAS

PRIMERA.- OBJETO.
La PERSONA TRABAJADORA se compromete a no prestar servicios, por cuenta propia o ajena, en actividades que concurran o compitan, directa o indirectamente, con la actividad de la EMPRESA, tras la extinción de su contrato.

SEGUNDA.- INTERÉS INDUSTRIAL O COMERCIAL EFECTIVO.
Las partes reconocen que la EMPRESA tiene un efectivo interés industrial y comercial en la limitación, dado que la PERSONA TRABAJADORA accede a _________________________________ (secretos, cartera de clientes, tecnología, etc.).

TERCERA.- ÁMBITO Y DURACIÓN.
La prohibición se extiende al siguiente ámbito geográfico y de actividad: _________________________________, y tendrá una duración de ______ meses (máximo dos años para técnicos y seis meses para el resto) desde la extinción del contrato.

CUARTA.- COMPENSACIÓN ECONÓMICA.
En contraprestación, la EMPRESA abonará a la PERSONA TRABAJADORA la cantidad de __________________ EUR, pagaderos _________________________________ (durante la relación como complemento mensual / a la extinción). Las partes reconocen dicha compensación como adecuada y proporcionada a la limitación asumida.

QUINTA.- INCUMPLIMIENTO.
El incumplimiento facultará a la EMPRESA para exigir la devolución de las cantidades percibidas por este concepto y una indemnización adicional por daños y perjuicios que las partes cifran, como cláusula penal, en __________________ EUR, sin perjuicio de la acción de cesación de la conducta.

SEXTA.- CONFIDENCIALIDAD.
La PERSONA TRABAJADORA mantendrá secreto indefinido sobre la información confidencial y los secretos empresariales (Ley 1/2019) a los que haya accedido.

SÉPTIMA.- JURISDICCIÓN.
Las controversias se someterán a la jurisdicción social.

Y en prueba de conformidad, firman por duplicado.


____________________________          ____________________________
LA EMPRESA                             LA PERSONA TRABAJADORA`
    },
    {
        id: "acuerdo-teletrabajo",
        title: "Acuerdo de Trabajo a Distancia (Ley 10/2021)",
        category: "laboral",
        description: "Anexo de teletrabajo obligatorio: porcentaje de presencialidad, inventario de medios, compensación de gastos, horario, desconexión digital y reversibilidad.",
        content: `ACUERDO DE TRABAJO A DISTANCIA

En __________________, a ____ de ________________ de 20____.

REUNIDOS

DE UNA PARTE, la EMPRESA _________________________________, con C.I.F. __________________ (en adelante, la "EMPRESA").
DE OTRA PARTE, D./Dña. _________________________________, con DNI/NIE __________________ (en adelante, la "PERSONA TRABAJADORA").

EXPONEN que ambas partes acuerdan formalizar el trabajo a distancia con carácter voluntario, al amparo de la Ley 10/2021, de 9 de julio, de trabajo a distancia, mediante las siguientes

CLÁUSULAS

PRIMERA.- OBJETO Y PORCENTAJE.
Se acuerda la prestación de servicios a distancia en un porcentaje del ______% de la jornada, desarrollándose el resto de forma presencial en el centro de trabajo. La modalidad es voluntaria y reversible para ambas partes.

SEGUNDA.- LUGAR DE TRABAJO A DISTANCIA.
La PERSONA TRABAJADORA prestará servicios desde _________________________________, que reúne las condiciones adecuadas de seguridad y ergonomía.

TERCERA.- INVENTARIO DE MEDIOS.
La EMPRESA facilita los siguientes medios, equipos y herramientas: _________________________________, cuya titularidad conserva y que deberán devolverse a la finalización del acuerdo (Anexo — inventario detallado).

CUARTA.- COMPENSACIÓN DE GASTOS.
La EMPRESA compensará los gastos derivados del trabajo a distancia (conexión, consumo, etc.) mediante el abono de __________________ EUR mensuales, conforme a lo previsto en el convenio y en la Ley 10/2021.

QUINTA.- HORARIO, FLEXIBILIDAD Y REGISTRO.
El horario de referencia será de _________________________________, respetándose el registro horario y las reglas de disponibilidad. Se permite / no se permite flexibilidad horaria dentro de las siguientes franjas: _________________________________.

SEXTA.- DERECHO A LA DESCONEXIÓN DIGITAL.
La PERSONA TRABAJADORA tiene derecho a la desconexión digital fuera de su horario, no estando obligada a responder comunicaciones profesionales durante sus periodos de descanso, permisos y vacaciones (art. 88 LOPDGDD).

SÉPTIMA.- PROTECCIÓN DE DATOS Y SEGURIDAD.
La PERSONA TRABAJADORA cumplirá la política de protección de datos y seguridad de la información, utilizando los medios exclusivamente para fines profesionales.

OCTAVA.- PREVENCIÓN DE RIESGOS.
Se aplicará la evaluación de riesgos del puesto a distancia, prestando la PERSONA TRABAJADORA su colaboración para la comprobación de las condiciones del lugar de trabajo.

NOVENA.- REVERSIBILIDAD Y DURACIÓN.
El acuerdo tendrá una duración de _________________________________ y podrá revertirse a trabajo presencial mediante preaviso de ______ días, conforme a lo pactado y a la Ley 10/2021.

Y en prueba de conformidad, firman por duplicado como anexo al contrato de trabajo.


____________________________          ____________________________
LA EMPRESA                             LA PERSONA TRABAJADORA`
    },
    {
        id: "finiquito",
        title: "Recibo de Finiquito y Saldo",
        category: "laboral",
        description: "Documento de liquidación a la extinción del contrato: conceptos pendientes, cláusula de saldo y finiquito y derecho a la presencia de representación sindical.",
        content: `RECIBO DE SALDO Y FINIQUITO

En __________________, a ____ de ________________ de 20____.

D./Dña. _________________________________, con DNI/NIE __________________, que ha venido prestando servicios para la EMPRESA _________________________________ (C.I.F. __________________) con la categoría de _________________________________ y antigüedad desde el ____ de ________________ de 20____, hace constar:

PRIMERO.- Que con fecha ____ de ________________ de 20____ se extingue la relación laboral por la siguiente causa: _________________________________ (baja voluntaria / fin de contrato / despido / etc.).

SEGUNDO.- Que en este acto recibe de la EMPRESA la cantidad de __________________ EUR (netos), correspondiente a la liquidación de las siguientes partidas devengadas y no percibidas:

- Salario de los días trabajados del mes en curso ............. __________________ EUR
- Parte proporcional de pagas extraordinarias ................. __________________ EUR
- Vacaciones devengadas y no disfrutadas ...................... __________________ EUR
- Otros conceptos (_______________________________) .......... __________________ EUR
- (En su caso) Indemnización por _____________________ ........ __________________ EUR
                                                    TOTAL LÍQUIDO: __________________ EUR

TERCERO.- CLÁUSULA DE SALDO Y FINIQUITO.
Que con la percepción de dicha cantidad la persona trabajadora se da por saldada y finiquitada por todos los conceptos derivados de la relación laboral que le unía con la EMPRESA, no teniendo nada más que reclamar por ningún concepto y quedando extinguida la relación a todos los efectos.

CUARTO.- Que la persona trabajadora ha sido informada de su derecho a que un representante legal de los trabajadores esté presente en el momento de la firma, haciendo uso / no haciendo uso de tal derecho.

QUINTO.- La firma del presente recibo no supone conformidad con una eventual decisión extintiva de la empresa a efectos de su impugnación, si dicha reserva se hace constar expresamente a continuación: _________________________________.

Y para que conste, se firma por duplicado en el lugar y fecha indicados.


____________________________          ____________________________
LA EMPRESA                             LA PERSONA TRABAJADORA
                                       (Recibí)`
    },

    // ─────────────────────────────────────────────────────────────
    //  CIVIL
    // ─────────────────────────────────────────────────────────────
    {
        id: "compraventa-vehiculo",
        title: "Contrato de Compraventa de Vehículo entre Particulares",
        category: "civil",
        description: "Contrato completo para coches y motos: datos técnicos, precio, estado, exención de vicios, reparto de gastos de transferencia y responsabilidad hasta el cambio de titularidad.",
        content: `CONTRATO DE COMPRAVENTA DE VEHÍCULO USADO ENTRE PARTICULARES

En __________________, a ____ de ________________ de 20____.

REUNIDOS

DE UNA PARTE, como VENDEDOR: D./Dña. _________________________________, con DNI/NIE __________________ y domicilio en _________________________________.
DE OTRA PARTE, como COMPRADOR: D./Dña. _________________________________, con DNI/NIE __________________ y domicilio en _________________________________.

DATOS DEL VEHÍCULO
Marca y modelo: _________________________________.
Matrícula: __________________   Nº de bastidor (VIN): __________________________________.
Fecha de matriculación: ______________   Kilómetros: __________________.
Combustible: ______________   Nº permiso de circulación: __________________.
Última ITV en vigor hasta: ______________.

CLÁUSULAS

PRIMERA.- OBJETO Y PRECIO.
El VENDEDOR vende al COMPRADOR el vehículo descrito por el precio de __________________ EUR, que el COMPRADOR abona en este acto mediante _________________________________, sirviendo el presente de carta de pago.

SEGUNDA.- ESTADO Y ENTREGA.
El COMPRADOR declara haber examinado y probado el vehículo, recibiéndolo en este acto en el estado físico y mecánico en que se encuentra, que declara conocer y aceptar. Se entregan la documentación, las llaves y _________________________________.

TERCERA.- CARGAS Y TITULARIDAD.
El VENDEDOR declara que el vehículo es de su propiedad, que se encuentra libre de cargas, embargos, reservas de dominio y multas pendientes, y al corriente del Impuesto de Vehículos de Tracción Mecánica (IVTM).

CUARTA.- SANEAMIENTO POR VICIOS OCULTOS.
El VENDEDOR responde de los vicios o defectos ocultos que hagan impropio el vehículo para su uso, conforme a los arts. 1484 y ss. del Código Civil, durante el plazo legal de seis meses, salvo que se pacte expresamente la venta "a riesgo y ventura" del comprador: _________________________________.

QUINTA.- CAMBIO DE TITULARIDAD Y GASTOS.
El COMPRADOR se obliga a tramitar el cambio de titularidad ante la Jefatura de Tráfico en el plazo de ______ días. Los gastos e impuestos de la transferencia serán de cuenta de _________________________________ (comprador/vendedor).

SEXTA.- RESPONSABILIDAD HASTA LA TRANSFERENCIA.
A partir de la entrega, el COMPRADOR asume la posesión, uso y responsabilidad del vehículo, incluidas sanciones y responsabilidad civil. El VENDEDOR comunicará la venta a la DGT para deslindar su responsabilidad.

SÉPTIMA.- LEY Y JURISDICCIÓN.
Este contrato se rige por el Código Civil. Las partes se someten a los Juzgados de __________________.

Y en prueba de conformidad, firman por duplicado.


____________________________          ____________________________
EL VENDEDOR                            EL COMPRADOR`
    },
    {
        id: "prestamo-particulares",
        title: "Contrato de Préstamo entre Particulares (Sin Intereses)",
        category: "civil",
        description: "Préstamo gratuito con validez ante Hacienda: fecha fehaciente, calendario, cancelación anticipada y las instrucciones exactas del Modelo 600 para evitar la donación encubierta.",
        content: `CONTRATO DE PRÉSTAMO ENTRE PARTICULARES SIN INTERESES

En __________________, a ____ de ________________ de 20____.

REUNIDOS

DE UNA PARTE, como PRESTAMISTA: D./Dña. _________________________________, mayor de edad, con DNI/NIE __________________ y domicilio en _________________________________.
DE OTRA PARTE, como PRESTATARIO: D./Dña. _________________________________, mayor de edad, con DNI/NIE __________________ y domicilio en _________________________________.

Ambas partes se reconocen capacidad legal para obligarse y

EXPONEN

I.- Que el PRESTAMISTA está dispuesto a entregar en préstamo al PRESTATARIO la cantidad de __________________ EUR.
II.- Que ambas partes desean documentar dicho préstamo con carácter gratuito, con arreglo a las siguientes

CLÁUSULAS

PRIMERA.- IMPORTE Y ENTREGA.
El PRESTAMISTA entrega al PRESTATARIO la cantidad de __________________ EUR (___________________________ euros) mediante transferencia bancaria a la cuenta IBAN __________________________________, de modo que quede constancia fehaciente del movimiento. El PRESTATARIO declara recibir dicha cantidad.

SEGUNDA.- GRATUIDAD.
El préstamo es GRATUITO y no devengará interés remuneratorio alguno, de conformidad con el art. 1755 del Código Civil, que exige pacto expreso para el devengo de intereses.

TERCERA.- PLAZO Y DEVOLUCIÓN.
El PRESTATARIO se obliga a devolver la cantidad recibida en un plazo de ______ (meses/años), mediante ______ cuotas de __________________ EUR cada una, con vencimiento el día ____ de cada mes, comenzando el ____ de ________________ de 20____, mediante ingreso o transferencia a la cuenta del PRESTAMISTA.

CUARTA.- AMORTIZACIÓN ANTICIPADA.
El PRESTATARIO podrá amortizar total o parcialmente el préstamo en cualquier momento, sin penalización.

QUINTA.- VENCIMIENTO ANTICIPADO.
El impago de ______ cuotas facultará al PRESTAMISTA para exigir la totalidad de la cantidad pendiente.

SEXTA.- IMPUESTOS Y VALIDEZ FRENTE A HACIENDA.
El presente préstamo está sujeto pero EXENTO del Impuesto sobre Transmisiones Patrimoniales y Actos Jurídicos Documentados (ITPAJD).

⚠️ TRÁMITE OBLIGATORIO PARA SU VALIDEZ FISCAL:
Para que la Agencia Tributaria no considere la entrega de dinero como una DONACIÓN ENCUBIERTA (que tributaría por el Impuesto de Sucesiones y Donaciones), las partes DEBEN:
1. Presentar este contrato mediante el MODELO 600 ante la oficina liquidadora de la Comunidad Autónoma del PRESTATARIO, en el plazo de un mes desde la firma. El trámite está exento de pago, pero es obligatorio y dota al documento de FECHA FEHACIENTE.
2. Conservar el justificante de la TRANSFERENCIA bancaria (nunca entregar el dinero en efectivo).
3. Documentar cada una de las devoluciones mediante transferencia, de forma coherente con el calendario pactado.
El incumplimiento de estos requisitos es la principal causa de sanciones por parte de Hacienda.

SÉPTIMA.- LEY Y JURISDICCIÓN.
Este contrato se rige por el Código Civil. Las partes se someten a los Juzgados de __________________.

Y en prueba de conformidad, firman por duplicado. Se recomienda su firma ante testigos o su elevación a público.


____________________________          ____________________________
EL PRESTAMISTA                         EL PRESTATARIO`
    },
    {
        id: "comodato",
        title: "Contrato de Comodato (Préstamo de Uso Gratuito)",
        category: "civil",
        description: "Cesión gratuita y temporal del uso de un bien (vivienda, local, vehículo) sin transmitir la propiedad, con obligación de restitución y conservación.",
        content: `CONTRATO DE COMODATO (PRÉSTAMO DE USO)

En __________________, a ____ de ________________ de 20____.

REUNIDOS

DE UNA PARTE, como COMODANTE: D./Dña. _________________________________, con DNI/NIE __________________ y domicilio en _________________________________.
DE OTRA PARTE, como COMODATARIO: D./Dña. _________________________________, con DNI/NIE __________________ y domicilio en _________________________________.

EXPONEN que el COMODANTE es titular del bien que se describe y desea cederlo gratuitamente en uso al COMODATARIO, quien lo acepta, con arreglo a los arts. 1740 y ss. del Código Civil y a las siguientes

CLÁUSULAS

PRIMERA.- OBJETO.
El COMODANTE entrega al COMODATARIO, en concepto de préstamo de uso gratuito, el siguiente bien: _________________________________ (descripción, dirección o matrícula, estado), para que se sirva de él durante el plazo pactado.

SEGUNDA.- GRATUIDAD Y DESTINO.
El comodato es esencialmente GRATUITO. El COMODATARIO destinará el bien exclusivamente al uso siguiente: _________________________________, sin poder cederlo a terceros.

TERCERA.- DURACIÓN.
El préstamo de uso se pacta por el plazo de _________________________________, o hasta que el COMODATARIO concluya el uso para el que se prestó. El COMODANTE podrá reclamar el bien antes si tuviera urgente necesidad de él (art. 1749 CC).

CUARTA.- CONSERVACIÓN Y GASTOS.
El COMODATARIO conservará el bien con la diligencia de un buen padre de familia y sufragará los gastos ordinarios de uso y conservación. No responderá del deterioro por el uso normal, pero sí de la pérdida por dolo o culpa.

QUINTA.- RESTITUCIÓN.
Concluido el plazo o el uso, el COMODATARIO restituirá el bien en el mismo estado en que lo recibió, salvo el desgaste por el uso normal.

SEXTA.- LEY Y JURISDICCIÓN.
Se rige por el Código Civil. Las partes se someten a los Juzgados de __________________.

Y en prueba de conformidad, firman por duplicado.


____________________________          ____________________________
EL COMODANTE                           EL COMODATARIO`
    },
    {
        id: "autorizacion-menor-viaje",
        title: "Autorización de Viaje de Menor",
        category: "civil",
        description: "Autorización paterna/materna para que un menor viaje con un tercero o solo, con los datos exigidos para su tramitación (recomendable legitimar la firma).",
        content: `AUTORIZACIÓN PARA VIAJE DE MENOR DE EDAD

En __________________, a ____ de ________________ de 20____.

DATOS DEL PROGENITOR/TUTOR QUE AUTORIZA
D./Dña. _________________________________, con DNI/NIE/Pasaporte __________________, en calidad de (padre/madre/tutor legal) del menor, con domicilio en _________________________________ y teléfono __________________.

(En su caso, segundo progenitor)
D./Dña. _________________________________, con DNI/NIE/Pasaporte __________________, en calidad de _________________________________.

DATOS DEL MENOR
Nombre y apellidos: _________________________________.
Fecha de nacimiento: ______________   DNI/Pasaporte: __________________.

DATOS DE LA PERSONA ACOMPAÑANTE (si procede)
D./Dña. _________________________________, con DNI/NIE/Pasaporte __________________, relación con el menor: _________________________________.

AUTORIZA / AUTORIZAN

Que el menor identificado realice el siguiente viaje:
- Destino: _________________________________.
- Fechas: del ____ de ________________ al ____ de ________________ de 20____.
- Medio de transporte: _________________________________.
- Motivo: _________________________________.

El menor viajará (marcar): [ ] acompañado por la persona arriba indicada; [ ] solo bajo la custodia de la compañía de transporte; [ ] en viaje organizado por _________________________________.

El/los firmante/s declara/n ostentar la patria potestad o tutela del menor y autoriza/n expresamente este viaje, así como la adopción de las decisiones urgentes que resulten necesarias para su seguridad y salud durante el mismo.

Se acompaña copia del DNI/pasaporte del/los autorizante/s y del menor.

Nota: para viajes al extranjero de menores que no viajen con ambos progenitores, suele exigirse que esta autorización sea firmada ante la Policía Nacional, un Notario o autoridad competente. Verifique los requisitos del país de destino.


____________________________          ____________________________
Firma del progenitor/tutor            Firma del segundo progenitor
                                       (en su caso)`
    },

    // ─────────────────────────────────────────────────────────────
    //  DIGITAL / WEB
    // ─────────────────────────────────────────────────────────────
    {
        id: "politica-privacidad-web",
        title: "Política de Privacidad para Web/App (RGPD)",
        category: "digital",
        description: "Texto legal obligatorio para sitios web y apps que recogen datos: responsable, finalidades, bases jurídicas, conservación, cesiones y derechos RGPD.",
        content: `POLÍTICA DE PRIVACIDAD

Última actualización: ____ de ________________ de 20____.

1. RESPONSABLE DEL TRATAMIENTO
Titular: _________________________________.
NIF/CIF: __________________.
Domicilio: _________________________________.
Email de contacto / Delegado de Protección de Datos (DPD): __________________.

La presente Política regula el tratamiento de los datos personales que el Usuario facilite o genere al navegar y utilizar el sitio web / aplicación _________________________________ (en adelante, el "Sitio"), conforme al Reglamento (UE) 2016/679 (RGPD) y a la Ley Orgánica 3/2018 (LOPDGDD).

2. DATOS QUE TRATAMOS
Según la interacción del Usuario, podemos tratar: (i) datos identificativos y de contacto (nombre, email, teléfono); (ii) datos de facturación; (iii) datos de navegación y dispositivo (IP, cookies); (iv) datos facilitados en formularios; y (v) _________________________________.

3. FINALIDADES Y BASES JURÍDICAS
- Gestionar el registro y prestar los servicios del Sitio. Base: ejecución de un contrato (art. 6.1.b RGPD).
- Atender consultas y solicitudes. Base: consentimiento / interés legítimo (art. 6.1.a/f).
- Enviar comunicaciones comerciales de productos propios. Base: consentimiento o interés legítimo, con derecho de oposición.
- Cumplir obligaciones legales (fiscales, contables). Base: obligación legal (art. 6.1.c).
- Analítica y mejora del Sitio mediante cookies. Base: consentimiento.

4. PLAZOS DE CONSERVACIÓN
Los datos se conservarán mientras dure la relación y, tras su finalización, durante los plazos legalmente exigidos para atender posibles responsabilidades (con carácter general, hasta ______ años para obligaciones fiscales y contractuales).

5. DESTINATARIOS Y ENCARGADOS
No se cederán datos a terceros salvo obligación legal. Podrán acceder a los datos, como encargados de tratamiento, los proveedores de _________________________________ (hosting, pasarela de pago, email marketing), con quienes se han suscrito los correspondientes contratos del art. 28 RGPD.

6. TRANSFERENCIAS INTERNACIONALES
En caso de utilizar proveedores fuera del Espacio Económico Europeo, se garantizará un nivel adecuado de protección mediante _________________________________ (decisión de adecuación / cláusulas contractuales tipo).

7. DERECHOS DEL USUARIO
El Usuario puede ejercer sus derechos de acceso, rectificación, supresión, oposición, limitación del tratamiento y portabilidad, así como retirar el consentimiento, dirigiéndose a __________________, acreditando su identidad. Igualmente, puede reclamar ante la Agencia Española de Protección de Datos (www.aepd.es).

8. SEGURIDAD
El Responsable aplica medidas técnicas y organizativas apropiadas para garantizar la seguridad de los datos y evitar su alteración, pérdida o acceso no autorizado.

9. MENORES
El Sitio no está dirigido a menores de 14 años, que no deben facilitar sus datos sin el consentimiento de sus progenitores o tutores.

10. CAMBIOS
El Responsable podrá modificar esta Política para adaptarla a novedades legislativas, informando de los cambios sustanciales.`
    },
    {
        id: "aviso-legal-web",
        title: "Aviso Legal y Condiciones de Uso (LSSI-CE)",
        category: "digital",
        description: "Aviso legal obligatorio conforme a la Ley 34/2002: datos del titular, propiedad intelectual del sitio, condiciones de uso y exención de responsabilidad.",
        content: `AVISO LEGAL Y CONDICIONES GENERALES DE USO

1. DATOS IDENTIFICATIVOS
En cumplimiento del deber de información del art. 10 de la Ley 34/2002, de Servicios de la Sociedad de la Información y de Comercio Electrónico (LSSI-CE), se informa:
Titular: _________________________________.
NIF/CIF: __________________.
Domicilio: _________________________________.
Email: __________________   Teléfono: __________________.
Datos registrales (si procede): _________________________________.
Sitio web: _________________________________.

2. OBJETO
El presente Aviso Legal regula el acceso, navegación y uso del sitio web (en adelante, el "Sitio"). El acceso al Sitio atribuye la condición de Usuario e implica la aceptación plena de estas condiciones.

3. CONDICIONES DE USO
El Usuario se compromete a utilizar el Sitio conforme a la ley, la buena fe y el orden público, absteniéndose de: (i) realizar actividades ilícitas o lesivas de derechos de terceros; (ii) introducir virus o código malicioso; (iii) intentar acceder de forma no autorizada a los sistemas; y (iv) utilizar los contenidos con fines comerciales no autorizados.

4. PROPIEDAD INTELECTUAL E INDUSTRIAL
Todos los contenidos del Sitio (textos, imágenes, marcas, logotipos, diseño, código fuente) son titularidad del Titular o de terceros que han autorizado su uso, y están protegidos por la normativa de propiedad intelectual e industrial. Queda prohibida su reproducción, distribución o transformación sin autorización expresa.

5. EXCLUSIÓN DE RESPONSABILIDAD
El Titular no se responsabiliza de: (i) los daños derivados del uso indebido del Sitio; (ii) las interrupciones, virus o fallos técnicos ajenos a su control; ni (iii) los contenidos de sitios de terceros enlazados. El Titular procura que la información sea veraz y actualizada, pero no garantiza la ausencia de errores.

6. ENLACES (LINKS)
Los enlaces a sitios de terceros se ofrecen a título informativo, sin que el Titular asuma responsabilidad sobre su contenido o disponibilidad.

7. MODIFICACIONES
El Titular se reserva el derecho a modificar el Sitio y estas condiciones en cualquier momento.

8. LEGISLACIÓN Y JURISDICCIÓN
Estas condiciones se rigen por la legislación española. Para la resolución de controversias, las partes se someten a los Juzgados y Tribunales de __________________, salvo que la normativa de consumidores establezca otro fuero imperativo.`
    },
    {
        id: "encargo-tratamiento-rgpd",
        title: "Contrato de Encargo de Tratamiento (Art. 28 RGPD)",
        category: "digital",
        description: "Contrato obligatorio entre responsable y encargado (proveedores, gestorías, SaaS): objeto, instrucciones, seguridad, subencargados, brechas y devolución de datos.",
        content: `CONTRATO DE ENCARGO DE TRATAMIENTO DE DATOS PERSONALES

En __________________, a ____ de ________________ de 20____.

REUNIDOS

DE UNA PARTE, _________________________________, con NIF/CIF __________________ (en adelante, el "RESPONSABLE del tratamiento").
DE OTRA PARTE, _________________________________, con NIF/CIF __________________ (en adelante, el "ENCARGADO del tratamiento").

EXPONEN que, para la prestación del servicio de _________________________________, el ENCARGADO tratará datos personales por cuenta del RESPONSABLE, por lo que suscriben el presente contrato conforme al art. 28 del RGPD, con las siguientes

CLÁUSULAS

PRIMERA.- OBJETO Y DETALLE DEL TRATAMIENTO.
El ENCARGADO tratará los datos necesarios para prestar el servicio descrito. Se detallan en el Anexo: la naturaleza y finalidad del tratamiento, el tipo de datos, las categorías de interesados y la duración.

SEGUNDA.- INSTRUCCIONES DEL RESPONSABLE.
El ENCARGADO tratará los datos únicamente siguiendo las instrucciones documentadas del RESPONSABLE y exclusivamente para la finalidad pactada, no aplicándolos ni utilizándolos para fines propios.

TERCERA.- DEBER DE CONFIDENCIALIDAD.
El ENCARGADO garantizará que las personas autorizadas para tratar los datos se hayan comprometido a respetar la confidencialidad.

CUARTA.- MEDIDAS DE SEGURIDAD.
El ENCARGADO aplicará las medidas técnicas y organizativas apropiadas (art. 32 RGPD): seudonimización y cifrado cuando proceda, confidencialidad, integridad, disponibilidad y resiliencia de los sistemas, y verificación periódica de su eficacia.

QUINTA.- SUBENCARGADOS.
El ENCARGADO no subcontratará ningún tratamiento sin autorización previa del RESPONSABLE. El subencargado quedará sujeto a las mismas obligaciones mediante contrato.

SEXTA.- DERECHOS DE LOS INTERESADOS.
El ENCARGADO asistirá al RESPONSABLE para atender las solicitudes de ejercicio de derechos, dando traslado de las que reciba directamente.

SÉPTIMA.- NOTIFICACIÓN DE BRECHAS DE SEGURIDAD.
El ENCARGADO notificará al RESPONSABLE, sin dilación indebida y en un plazo máximo de ______ horas, cualquier violación de la seguridad de los datos de la que tenga conocimiento, con la información necesaria para su documentación y comunicación.

OCTAVA.- DEVOLUCIÓN O SUPRESIÓN.
Finalizada la prestación, el ENCARGADO, a elección del RESPONSABLE, devolverá o suprimirá los datos y las copias existentes, salvo obligación legal de conservación.

NOVENA.- AUDITORÍA.
El ENCARGADO pondrá a disposición del RESPONSABLE la información necesaria para demostrar el cumplimiento y permitirá auditorías, incluidas inspecciones.

DÉCIMA.- LEY Y JURISDICCIÓN.
Este contrato se rige por el RGPD y la LOPDGDD. Las partes se someten a los Juzgados de __________________.

Y en prueba de conformidad, firman por duplicado.


____________________________          ____________________________
EL RESPONSABLE                         EL ENCARGADO`
    },

    // ─────────────────────────────────────────────────────────────
    //  RECLAMACIONES / ESCRITOS
    // ─────────────────────────────────────────────────────────────
    {
        id: "burofax-reclamacion-cantidad",
        title: "Burofax de Reclamación de Cantidad (Requerimiento de Pago)",
        category: "reclamaciones",
        description: "Requerimiento fehaciente de pago previo a la vía judicial: interrumpe la prescripción, constituye en mora al deudor y prepara el procedimiento monitorio.",
        content: `REQUERIMIENTO FEHACIENTE DE PAGO
(Enviar por BUROFAX con acuse de recibo y certificación de texto)

REMITENTE: _________________________________, con DNI/NIE/CIF __________________ y domicilio en _________________________________.
DESTINATARIO: _________________________________, con domicilio en _________________________________.

En __________________, a ____ de ________________ de 20____.

Muy Sr./Sra. mío/a:

Me dirijo a usted en relación con la deuda que mantiene pendiente conmigo, cuyo origen y detalle es el siguiente:

- Concepto: _________________________________ (factura/s nº ___, contrato, préstamo, etc.).
- Fecha/s de devengo o vencimiento: _________________________________.
- Importe principal adeudado: __________________ EUR.
- Intereses devengados (en su caso): __________________ EUR.
- IMPORTE TOTAL RECLAMADO: __________________ EUR.

Pese a haber vencido el plazo de pago y a los requerimientos previos realizados, a fecha de hoy dicha cantidad continúa impagada.

Por medio del presente le REQUIERO FORMALMENTE para que, en el plazo improrrogable de ______ días naturales desde la recepción de esta comunicación, proceda al abono de la cantidad total adeudada mediante ingreso o transferencia en la cuenta IBAN __________________________________.

Le advierto que, transcurrido dicho plazo sin haber hecho efectivo el pago, procederé a reclamar judicialmente la deuda por el procedimiento que corresponda (entre ellos, el procedimiento monitorio de los arts. 812 y ss. de la Ley de Enjuiciamiento Civil), reclamando además los intereses de demora, las costas y los gastos que se generen, con el consiguiente incremento de la cantidad a satisfacer.

El presente requerimiento produce, a todos los efectos legales, la interrupción de la prescripción de la deuda (art. 1973 del Código Civil) y la constitución en mora del deudor (art. 1100 del Código Civil).

Confiando en que resuelva este asunto en el plazo indicado y evitemos acudir a la vía judicial, le saluda atentamente,


____________________________
Fdo.: _________________________________`
    },
    {
        id: "reclamacion-vuelo-261",
        title: "Reclamación a Aerolínea (Reglamento CE 261/2004)",
        category: "reclamaciones",
        description: "Reclama la compensación por cancelación, gran retraso o denegación de embarque: importes de 250/400/600 € y solicitud previa antes de acudir a AESA o a los tribunales.",
        content: `RECLAMACIÓN POR INCIDENCIA AÉREA (REGLAMENTO CE 261/2004)

A la atención del Servicio de Atención al Cliente de la compañía aérea _________________________________.

DATOS DEL PASAJERO
Nombre y apellidos: _________________________________.
DNI/Pasaporte: __________________   Email: __________________   Teléfono: __________________.

DATOS DEL VUELO
Nº de reserva/localizador: __________________.
Nº de vuelo: __________________   Fecha: ______________.
Origen: __________________   Destino: __________________.
Distancia aproximada del trayecto: __________________ km.

En __________________, a ____ de ________________ de 20____.

EXPONE:

1.- Que era titular de una reserva confirmada en el vuelo arriba indicado, habiéndose presentado en tiempo y forma a la facturación.

2.- Que se produjo la siguiente incidencia (marcar): [ ] CANCELACIÓN del vuelo; [ ] RETRASO de ______ horas en la llegada al destino final; [ ] DENEGACIÓN DE EMBARQUE por overbooking.

3.- Que la compañía no acreditó la concurrencia de circunstancias extraordinarias que la eximan de responsabilidad conforme al art. 5.3 del Reglamento (CE) nº 261/2004.

SOLICITA:

A) El abono de la COMPENSACIÓN ECONÓMICA que corresponde conforme al art. 7 del Reglamento (CE) 261/2004:
   - 250 EUR para vuelos de hasta 1.500 km.
   - 400 EUR para vuelos intracomunitarios de más de 1.500 km y demás vuelos entre 1.500 y 3.500 km.
   - 600 EUR para el resto de vuelos (más de 3.500 km).
   Importe reclamado: __________________ EUR.

B) El reembolso de los gastos de atención y asistencia (manutención, alojamiento, transporte y comunicaciones) que hube de sufragar, por importe de __________________ EUR, que se justifican con las facturas adjuntas.

C) (En su caso) El reembolso del billete o el transporte alternativo conforme al art. 8 del Reglamento.

Solicito que la compensación se abone mediante transferencia a la cuenta IBAN __________________________________ en el plazo máximo de ______ días.

Le advierto que, de no atender esta reclamación en el plazo indicado, presentaré la correspondiente reclamación ante la Agencia Estatal de Seguridad Aérea (AESA) y, en su caso, ejercitaré las acciones judiciales oportunas, reclamando además los intereses y costas.

Se adjunta: tarjeta de embarque/reserva, justificantes de gastos y demás documentación acreditativa.


____________________________
Fdo.: _________________________________`
    },
    {
        id: "hoja-reclamacion-consumo",
        title: "Reclamación de Consumo (Producto/Servicio Defectuoso)",
        category: "reclamaciones",
        description: "Reclamación ante una empresa por bienes o servicios defectuosos conforme a la Ley de Consumidores: exige reparación, sustitución, rebaja o reembolso.",
        content: `RECLAMACIÓN DE CONSUMO

DATOS DEL CONSUMIDOR
Nombre y apellidos: _________________________________.
DNI/NIE: __________________   Domicilio: _________________________________.
Email: __________________   Teléfono: __________________.

DATOS DE LA EMPRESA RECLAMADA
Denominación: _________________________________.
CIF (si se conoce): __________________   Domicilio/Establecimiento: _________________________________.

En __________________, a ____ de ________________ de 20____.

HECHOS:

1.- Que el día ____ de ________________ de 20____ adquirí / contraté con la empresa reclamada el siguiente producto o servicio: _________________________________, por un importe de __________________ EUR, según justificante/factura nº __________________ que se adjunta.

2.- Que dicho producto o servicio presenta la siguiente falta de conformidad o defecto: _________________________________.

3.- Que dicha falta de conformidad existía en el momento de la entrega/prestación y no se debe a un uso inadecuado por mi parte.

FUNDAMENTOS:

Conforme al Real Decreto Legislativo 1/2007, Texto Refundido de la Ley General para la Defensa de los Consumidores y Usuarios, el empresario responde de las faltas de conformidad que se manifiesten en el plazo de tres años desde la entrega (bienes) o de las deficiencias en los servicios, teniendo el consumidor derecho a la subsanación, sustitución, rebaja del precio o resolución del contrato.

SOLICITO:

Que se proceda, a mi elección, a (marcar): [ ] la REPARACIÓN del producto/servicio; [ ] su SUSTITUCIÓN por otro conforme; [ ] la REBAJA del precio en __________________ EUR; [ ] la RESOLUCIÓN del contrato con REEMBOLSO de __________________ EUR, en el plazo de ______ días, sin coste alguno para mí.

Le advierto que, de no obtener una respuesta satisfactoria en dicho plazo, formularé reclamación ante la Junta Arbitral de Consumo y/o la Dirección General de Consumo competente, y ejercitaré las acciones judiciales que en derecho procedan.

Solicito, asimismo, la HOJA OFICIAL DE RECLAMACIONES a mi disposición como consumidor.

Se adjunta: factura/ticket, contrato y documentación acreditativa del defecto.


____________________________
Fdo.: _________________________________`
    },
    {
        id: "desistimiento-compra-online",
        title: "Desistimiento de Compra Online (14 días)",
        category: "reclamaciones",
        description: "Ejerce el derecho de desistimiento en compras a distancia dentro de los 14 días naturales, sin necesidad de justificar el motivo, con derecho a reembolso íntegro.",
        content: `COMUNICACIÓN DE DESISTIMIENTO DE CONTRATO A DISTANCIA

DESTINATARIO (empresa vendedora): _________________________________.
Domicilio / email de atención al cliente: _________________________________.

DATOS DEL CONSUMIDOR
Nombre y apellidos: _________________________________.
DNI/NIE: __________________   Domicilio: _________________________________.
Email: __________________   Teléfono: __________________.

En __________________, a ____ de ________________ de 20____.

Por la presente les comunico que DESISTO del contrato de compraventa del siguiente bien / prestación del siguiente servicio:

- Descripción del producto/servicio: _________________________________.
- Nº de pedido / factura: __________________.
- Fecha del pedido: ______________   Fecha de recepción: ______________.
- Importe abonado: __________________ EUR.

Ejercito este derecho al amparo de los artículos 102 y siguientes del Real Decreto Legislativo 1/2007 (Ley General para la Defensa de los Consumidores y Usuarios), que reconoce al consumidor la facultad de desistir de los contratos celebrados a distancia o fuera del establecimiento mercantil en el plazo de 14 días naturales, sin necesidad de justificación ni penalización alguna.

En consecuencia, SOLICITO:

1.- El REEMBOLSO ÍNTEGRO de las cantidades abonadas, incluidos los gastos de entrega, por importe total de __________________ EUR, en el plazo máximo de 14 días naturales, mediante el mismo medio de pago empleado o mediante transferencia a la cuenta IBAN __________________________________.

2.- Que me indiquen la dirección y el procedimiento para la devolución del producto, en su caso.

Le recuerdo que, conforme a la normativa citada, si la empresa no informó debidamente del derecho de desistimiento, el plazo se amplía hasta doce meses.

Quedo a la espera de su confirmación.


____________________________
Fdo.: _________________________________`
    }
];
