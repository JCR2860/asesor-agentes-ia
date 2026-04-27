export type DocumentTemplate = {
    id: string;
    title: string;
    category: 'inmobiliario' | 'mercantil' | 'laboral' | 'civil';
    description: string;
    content: string; // Long professional text with placeholders
};

export const documentTemplates: DocumentTemplate[] = [
    {
        id: "nda-pro",
        title: "NDA - Acuerdo de Confidencialidad Elite",
        category: "mercantil",
        description: "Contrato de 5 páginas para proteger secretos comerciales, algoritmos y estrategias de negocio.",
        content: `CONTRATO DE CONFIDENCIALIDAD Y NO REVELACIÓN (NDA)

En __________, a __ de __________ de 202_

REUNIDOS
De una parte, D./Dña. ___________________________, con DNI/NIE __________, en nombre y representación de la sociedad ___________________________ con CIF __________ y domicilio en ___________________________ (en adelante, la "PARTE DIVULGADORA").

Y de otra parte, D./Dña. ___________________________, con DNI/NIE __________, en nombre y representación de la sociedad ___________________________ con CIF __________ y domicilio en ___________________________ (en adelante, la "PARTE RECEPTORA").

Ambas partes se reconocen mutuamente capacidad legal suficiente para obligarse mediante el presente contrato y, a tal efecto,

EXPONEN
I. Que la PARTE DIVULGADORA posee cierta información técnica, financiera, comercial y estratégica relativa a ___________________________ que tiene carácter confidencial y es de su exclusiva propiedad.
II. Que ambas partes tienen interés en entablar conversaciones para una posible colaboración consistente en ___________________________ (en adelante, el "PROYECTO").
III. Que para el análisis de dicha colaboración es necesario que la PARTE DIVULGADORA revele a la PARTE RECEPTORA parte de dicha Información Confidencial.

CLÁUSULAS

PRIMERA. DEFINICIÓN DE INFORMACIÓN CONFIDENCIAL
Se entenderá por Información Confidencial toda aquella información, datos, conocimientos, software, algoritmos, bases de datos, estrategias de marketing, listados de clientes, previsiones financieras y cualquier otro material sensible que sea revelado por la PARTE DIVULGADORA, ya sea de forma verbal, escrita, visual o electrónica.

SEGUNDA. OBLIGACIONES DE LA PARTE RECEPTORA
La PARTE RECEPTORA se obliga a:
a) Mantener la más estricta confidencialidad sobre la información recibida.
b) Utilizar la información única y exclusivamente para los fines del PROYECTO.
c) No revelar ni divulgar dicha información a terceros sin el consentimiento expreso y por escrito de la PARTE DIVULGADORA.
d) Restringir el acceso a la información únicamente a aquellos empleados o asesores que necesiten conocerla para el PROYECTO y que estén sujetos a obligaciones de confidencialidad similares.

TERCERA. EXCEPCIONES
No se considerará Información Confidencial aquella que:
- Sea de dominio público en el momento de la revelación.
- Haya sido desarrollada de forma independiente por la PARTE RECEPTORA.
- Sea requerida por ley o por orden judicial, en cuyo caso la PARTE RECEPTORA deberá avisar inmediatamente a la PARTE DIVULGADORA.

CUARTA. DURACIÓN Y VIGENCIA
El presente acuerdo entrará en vigor en la fecha de su firma y se mantendrá vigente durante un periodo de ___ años a contar desde la finalización de las conversaciones o de la relación contractual entre las partes.

QUINTA. PENALIZACIÓN POR INCUMPLIMIENTO
El incumplimiento de las obligaciones de confidencialidad aquí pactadas dará derecho a la PARTE DIVULGADORA a reclamar una indemnización por daños y perjuicios. Las partes pactan expresamente una cláusula penal de __________ EUR en concepto de daños mínimos, sin perjuicio de que la PARTE DIVULGADORA pueda acreditar daños superiores.

SEXTA. JURISDICCIÓN Y LEY APLICABLE
El presente contrato se rige por la ley española. Para cualquier controversia, las partes se someten a los juzgados y tribunales de la ciudad de ___________________.

Y en prueba de conformidad, firman el presente contrato por duplicado ejemplar en el lugar y fecha arriba indicados.

Firma PARTE DIVULGADORA                Firma PARTE RECEPTORA`
    },
    {
        id: "arras-pro",
        title: "Contrato de Arras Penitenciales (Art. 1454 CC)",
        category: "inmobiliario",
        description: "Modelo jurídico blindado para la reserva de inmuebles con penalización por desistimiento.",
        content: `CONTRATO DE ARRAS PENITENCIALES

En __________, a __ de __________ de 202_

REUNIDOS
De una parte, como VENDEDOR: D./Dña. ___________________________, mayor de edad, con DNI __________ y domicilio en ___________________________.
De otra parte, como COMPRADOR: D./Dña. ___________________________, mayor de edad, con DNI __________ y domicilio en ___________________________.

INTERVIENEN
Ambos en su propio nombre y derecho, y se reconocen capacidad legal suficiente para otorgar el presente contrato, a tal efecto,

EXPONEN
I. Que la PARTE VENDEDORA es propietaria en pleno dominio de la siguiente finca: ___________________________, inscrita en el Registro de la Propiedad de ____________ con el número de finca ________.
II. Que la PARTE COMPRADORA está interesada en la adquisición de dicha finca, por lo que ambas partes acuerdan formalizar el presente contrato de Arras Penitenciales sujeto a las siguientes:

CLÁUSULAS

PRIMERA. OBJETO
La PARTE VENDEDORA se obliga a vender a la PARTE COMPRADORA, que se obliga a comprar, la finca descrita en el exponente I, libre de cargas y gravámenes, y al corriente en el pago de impuestos y gastos de comunidad.

SEGUNDA. PRECIO Y FORMA DE PAGO
El precio total de la compraventa se fija en la cantidad de __________ EUR.
En este acto, la PARTE COMPRADORA entrega a la PARTE VENDEDORA la cantidad de __________ EUR en concepto de ARRAS PENITENCIALES. La PARTE VENDEDORA manifiesta haber recibido dicha cantidad y otorga mediante el presente la más eficaz carta de pago.

TERCERA. PLAZO DE ESCRITURACIÓN
La escritura pública de compraventa se otorgará ante el Notario que designe la PARTE COMPRADORA en un plazo máximo que finaliza el día __ de __________ de 202_. La entrega de llaves y de la posesión se realizará simultáneamente a la firma de la escritura.

CUARTA. ARRAS PENITENCIALES (ART. 1454 CÓDIGO CIVIL)
La cantidad entregada tiene el carácter de arras penitenciales, de conformidad con lo establecido en el artículo 1454 del Código Civil. En consecuencia:
- Si la PARTE COMPRADORA desistiera del contrato, perderá la cantidad entregada, que quedará en propiedad de la PARTE VENDEDORA.
- Si la PARTE VENDEDORA desistiera del contrato, vendrá obligada a devolver a la PARTE COMPRADORA el duplo de la cantidad recibida.

QUINTA. GASTOS E IMPUESTOS
Los gastos e impuestos derivados de la escritura pública de compraventa serán satisfechos conforme a Ley (o según pacto: ___________________________).

SEXTA. JURISDICCIÓN
Para cualquier controversia que pudiera derivarse del presente contrato, las partes se someten a los Juzgados y Tribunales de ___________________.

Y en prueba de conformidad, firman el presente documento por duplicado en el lugar y fecha indicados.

Firma VENDEDOR                          Firma COMPRADOR`
    },
    {
        id: "alquiler-vivienda",
        title: "Contrato de Arrendamiento de Vivienda (LAU)",
        category: "inmobiliario",
        description: "Contrato adaptado a la última Ley de Arrendamientos Urbanos y Ley de Vivienda.",
        content: `CONTRATO DE ARRENDAMIENTO DE VIVIENDA

En __________, a __ de __________ de 202_

REUNIDOS
De una parte, el ARRENDADOR: D./Dña. ___________________________, con DNI __________.
De otra parte, el ARRENDATARIO: D./Dña. ___________________________, con DNI __________.

EXPONEN
I. Que el ARRENDADOR es propietario de la vivienda sita en ___________________________.
II. Que ambas partes acuerdan el arrendamiento de dicha vivienda mediante las siguientes:

CLÁUSULAS

PRIMERA. DURACIÓN
El plazo de duración de este contrato es de ___ AÑO/S, a contar desde el día __ de __________ de 202_. Llegado el día del vencimiento del contrato, este se prorrogará obligatoriamente por plazos anuales hasta que el arrendamiento alcance una duración mínima de cinco años (o siete si el arrendador es persona jurídica), de conformidad con la LAU vigente.

SEGUNDA. RENTA
La renta anual se fija en __________ EUR, a pagar en plazos mensuales de __________ EUR dentro de los primeros siete días de cada mes. La renta se actualizará anualmente conforme al índice de referencia pactado (o límite legal vigente).

TERCERA. FIANZA
El arrendatario entrega en este acto la cantidad de __________ EUR, equivalente a una mensualidad de renta, en concepto de fianza legal.

CUARTA. GASTOS
Los gastos de suministros (agua, luz, gas) serán por cuenta del arrendatario. Los gastos de comunidad e IBI serán por cuenta del arrendador (salvo pacto en contrario).

QUINTA. JURISDICCIÓN
Las partes se someten a los juzgados de la ciudad donde radica la finca.

Firma ARRENDADOR                        Firma ARRENDATARIO`
    },
    {
        id: "prestacion-servicios",
        title: "Contrato de Prestación de Servicios (Freelance/B2B)",
        category: "mercantil",
        description: "Ideal para consultores, agencias y profesionales independientes. Incluye propiedad intelectual.",
        content: `CONTRATO DE PRESTACIÓN DE SERVICIOS PROFESIONALES

En __________, a __ de __________ de 202_

REUNIDOS
De una parte, el CLIENTE: ___________________________
De otra parte, el PRESTADOR: ___________________________

CLÁUSULAS

PRIMERA. OBJETO DEL CONTRATO
El PRESTADOR se compromete a realizar para el CLIENTE los siguientes servicios: ___________________________.

SEGUNDA. HONORARIOS Y FORMA DE PAGO
El precio total de los servicios se fija en __________ EUR (+ IVA). El pago se realizará mediante ___________________________ en las siguientes fechas: ___________________________.

TERCERA. PROPIEDAD INTELECTUAL
Una vez satisfechos los honorarios en su totalidad, la propiedad intelectual de los resultados de los servicios realizados pasará a ser del CLIENTE.

CUARTA. CONFIDENCIALIDAD
El PRESTADOR se compromete a mantener absoluta confidencialidad sobre la información a la que tenga acceso durante la prestación de los servicios.

QUINTA. DURACIÓN
El presente contrato tendrá una vigencia desde el __ de __________ hasta el __ de __________.

Firma CLIENTE                            Firma PRESTADOR`
    },
    {
        id: "compraventa-vehiculo",
        title: "Contrato de Compraventa de Vehículo",
        category: "civil",
        description: "Contrato estándar para la venta de coches o motos entre particulares.",
        content: `CONTRATO DE COMPRAVENTA DE VEHÍCULO USADO ENTRE PARTICULARES

En __________, a __ de __________ de 202_

VENDEDOR: ___________________________ DNI: __________
COMPRADOR: ___________________________ DNI: __________

DATOS DEL VEHÍCULO:
Marca: __________ Modelo: __________ Matrícula: __________ Bastidor: __________ Kilómetros: __________

CLÁUSULAS
1. El precio de la compraventa es de __________ EUR.
2. El VENDEDOR declara que el vehículo no tiene cargas ni gravámenes.
3. El COMPRADOR declara conocer el estado actual del vehículo y lo acepta en las condiciones en que se encuentra.
4. El VENDEDOR responde de la evicción y saneamiento conforme al Código Civil (vicios ocultos por 6 meses).
5. Los gastos de transferencia serán por cuenta de: ___________________________.

Firma VENDEDOR                          Firma COMPRADOR`
    },
    {
        id: "prestamo-particulares",
        title: "Contrato de Préstamo entre Particulares (Sin Intereses)",
        category: "civil",
        description: "Documento necesario para justificar transferencias ante Hacienda. DEBE presentarse el Modelo 600 en su CCAA.",
        content: `CONTRATO DE PRÉSTAMO ENTRE PARTICULARES SIN INTERESES

En __________, a __ de __________ de 202_

PRESTAMISTA: D./Dña. ___________________________ con DNI __________
PRESTATARIO: D./Dña. ___________________________ con DNI __________

CLÁUSULAS
1. El PRESTAMISTA entrega en este acto al PRESTATARIO la cantidad de __________ EUR mediante transferencia bancaria.
2. El préstamo es GRATUITO, no devengando interés alguno de conformidad con el Art. 1755 del Código Civil.
3. El PRESTATARIO se obliga a devolver la cantidad recibida en un plazo de ___ meses/años, mediante cuotas de __________ EUR.
4. El préstamo podrá ser amortizado anticipadamente en cualquier momento.

⚠️ NOTA IMPORTANTE PARA VALIDEZ LEGAL:
Para que este préstamo sea reconocido por la Agencia Tributaria (Hacienda) y no sea considerado una donación encubierta, las partes DEBEN presentar este contrato junto con el MODELO 600 en la oficina de Hacienda de su Comunidad Autónoma. Este trámite está exento de impuestos pero es obligatorio para dotar de fecha fehaciente al documento y justificar el movimiento bancario.

Firma PRESTAMISTA                       Firma PRESTATARIO`
    },
    {
        id: "contrato-trabajo-pro",
        title: "Contrato de Trabajo de Régimen General",
        category: "laboral",
        description: "Modelo de contrato laboral con cláusulas de protección de datos, confidencialidad y teletrabajo.",
        content: `CONTRATO DE TRABAJO (MODELO PROFESIONAL)

En __________, a __ de __________ de 202_

EMPRESA (EMPLEADOR): ___________________________ CIF: __________
TRABAJADOR (EMPLEADO): ___________________________ DNI: __________

CLÁUSULAS

PRIMERA. OBJETO
El trabajador es contratado para desempeñar el cargo de ___________________________, encuadrado en el Grupo Profesional ____ del Convenio Colectivo de ___________________________.

SEGUNDA. JORNADA Y LUGAR
La jornada de trabajo será de ___ horas semanales, prestadas en el centro de trabajo ubicado en ___________________________ (o mediante la modalidad de Teletrabajo según anexo adjunto).

TERCERA. RETRIBUCIÓN
El trabajador percibirá una retribución total de __________ EUR brutos anuales, distribuidos en ___ pagas.

CUARTA. CONFIDENCIALIDAD Y PROTECCIÓN DE DATOS
El trabajador se obliga a mantener el más estricto secreto profesional sobre toda la información interna de la empresa a la que tenga acceso. Asimismo, autoriza el tratamiento de sus datos personales para la gestión de la relación laboral conforme al RGPD.

QUINTA. PERIODO DE PRUEBA
Se establece un periodo de prueba de ___ meses, durante el cual cualquiera de las partes podrá rescindir el contrato sin preaviso ni indemnización.

SEXTA. DURACIÓN
El presente contrato tiene carácter INDEFINIDO / TEMPORAL (marcar opción), iniciándose la relación laboral el día __ de __________ de 202_.

Firma EMPLEADOR                         Firma TRABAJADOR`
    },
    {
        id: "pacto-no-competencia",
        title: "Pacto de No Competencia Post-Contractual",
        category: "laboral",
        description: "Documento para proteger el 'know-how' de la empresa tras la salida de un empleado clave.",
        content: `PACTO DE NO COMPETENCIA POST-CONTRACTUAL Y CONFIDENCIALIDAD

En __________, a __ de __________ de 202_

REUNIDOS
De una parte, ___________________________ (en adelante, la "EMPRESA").
De otra parte, D./Dña. ___________________________ (en adelante, el "TRABAJADOR").

EXPONEN
Que dadas las funciones del TRABAJADOR y su acceso a información estratégica, ambas partes acuerdan:

CLÁUSULAS

PRIMERA. NO COMPETENCIA
El TRABAJADOR se compromete a no realizar, por cuenta propia o ajena, actividades que supongan competencia directa o indirecta con la EMPRESA durante un periodo de ___ meses (máximo 2 años para técnicos) tras la extinción de su contrato.

SEGUNDA. ÁMBITO GEOGRÁFICO
Esta prohibición se extiende al siguiente ámbito: ___________________________.

TERCERA. COMPENSACIÓN ECONÓMICA
En contraprestación por esta limitación, la EMPRESA abonará al TRABAJADOR la cantidad de __________ EUR, pagaderos de la siguiente forma: ___________________________. Las partes reconocen que esta compensación es proporcionada y suficiente.

CUARTA. INCUMPLIMIENTO
En caso de incumplimiento por parte del TRABAJADOR, este deberá reintegrar a la EMPRESA la compensación recibida, además de una indemnización adicional fijada en __________ EUR en concepto de daños y perjuicios.

Firma EMPLEADOR                         Firma TRABAJADOR`
    }
];
