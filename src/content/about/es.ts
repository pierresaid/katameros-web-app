import type { AboutContent } from './types'

const content: AboutContent = {
    title: '¿Qué es el Katameros?',
    description: 'Qué es el Katameros: el leccionario de la Iglesia copta ortodoxa, sus cinco libros, el calendario copto y cómo se eligen las lecturas de cada día.',
    lead: 'El Katameros es el leccionario de la Iglesia copta ortodoxa: el libro que indica los pasajes de la Biblia que se leen en la iglesia durante los oficios diarios, todos los días del año.',

    name: {
        heading: 'El nombre',
        paragraphs: [
            'El nombre viene del griego *kata meros*, «por partes»: el libro está dividido en varias partes y presenta las Escrituras fragmento a fragmento, día a día.',
        ],
    },

    church: {
        heading: 'Se lee en la iglesia',
        paragraphs: [
            'En la iglesia, el Katameros está sobre el facistol (el atril de lectura), abierto en las lecturas del día. En los oficios del día, los lectores, los diáconos y el sacerdote leen los pasajes que indica. Las iglesias coptas ortodoxas de todo el mundo siguen el mismo leccionario.',
        ],
    },

    contents: {
        heading: 'Qué contiene',
        intro: 'Para la mayoría de los días, el Katameros da las lecturas de tres oficios. Para la Iglesia, el día empieza a la puesta del sol. Por eso las lecturas comienzan la tarde anterior con el Oficio de la Vigilancia, siguen por la mañana con el Oficio del Mañana y después con la Misa (la Eucaristía). El Oficio de la Vigilancia y el Oficio del Mañana son las vísperas y los maitines, también llamados ofrendas del incienso de la tarde y de la mañana.',
        services: [
            { name: 'Oficio de la Vigilancia', when: 'La tarde anterior', parts: ['Salmo y Evangelio'] },
            { name: 'Oficio del Mañana', when: 'Por la mañana', parts: ['Salmo y Evangelio'] },
            { name: 'Misa', when: 'Después del Oficio del Mañana', parts: ['Epístola de San Pablo', 'Epístola universal', 'Hechos de los Apóstoles', 'Sinaxario', 'Salmo y Evangelio'] },
        ],
        readingsLabel: 'Las lecturas de la Misa',
        readings: [
            { name: 'Epístola de San Pablo', text: 'Un pasaje de una de las cartas de San Pablo.' },
            { name: 'Epístola universal', text: 'Un pasaje de las cartas de Santiago, San Pedro, San Juan o San Judas. También se llaman «católicas», palabra que significa «universales»: la mayoría de estas cartas se dirigen a toda la Iglesia y no a una sola iglesia local.' },
            { name: 'Hechos de los Apóstoles', text: 'Un pasaje del libro de los Hechos. Esta lectura también se llama Praxis, que en griego significa «Hechos».' },
            { name: 'Sinaxario', text: 'No es una lectura bíblica y se lee en su propio libro: las vidas de los santos que se conmemoran ese día.' },
            { name: 'Salmo y Evangelio', text: 'Unos versículos de un salmo, cantados justo antes del Evangelio. Los salmos se leen como profecías sobre Cristo, así que el salmo anuncia el Evangelio. El Evangelio es la lectura principal del día, y las demás lecturas suelen estar relacionadas con él.' },
        ],
        note: 'Se añaden lecturas de los profetas del Antiguo Testamento, principalmente en la Gran Cuaresma y la Semana Santa.',
    },

    books: {
        heading: 'Cinco libros',
        intro: 'El Katameros se imprime en cinco libros, y cada uno se usa en su época del año:',
        items: [
            { name: 'Días de semana', text: 'De lunes a sábado, según los santos y las fiestas del calendario copto.' },
            { name: 'Domingos', text: 'Los domingos del año, con un tema para cada mes.' },
            { name: 'Gran Cuaresma', text: 'La semana de preparación y los Cuarenta Días, así como el Ayuno de Nínive.' },
            { name: 'Semana Santa', text: 'La semana antes de Pascua, con lecturas para cada una de sus horas de oración. En la Iglesia copta, esta semana se llama Pascha.' },
            { name: 'Santos Cincuenta Días', text: 'De Pascua a Pentecostés.' },
        ],
    },

    calendar: {
        heading: 'El calendario copto',
        paragraphs: [
            'El Katameros sigue el calendario copto, el calendario de la Iglesia heredado del antiguo Egipto. El año copto tiene 13 meses: 12 meses de 30 días y luego un mes corto llamado Nasie, de cinco días (seis cuando el febrero siguiente tiene 29 días).',
            'Los meses son Thout, Babah, Hatour, Kiahk, Toubah, Amshir, Baramhat, Baramoudah, Bashans, Baounah, Abib, Misra y Nasie. El año empieza el 1 de Thout, que corresponde al 11 de septiembre (al 12 de septiembre cuando el febrero siguiente tiene 29 días).',
        ],
    },

    choice: {
        heading: 'Cómo se eligen las lecturas',
        intro: 'Las lecturas de un día no se eligen al azar, sino según lo que la Iglesia celebra ese día. Tres cosas lo deciden: el santo o la fiesta del día en el calendario copto, el domingo y su tema, y los tiempos que se mueven con la Pascua. Cuando caen el mismo día, las fiestas del Señor (las fiestas de Cristo, como la Navidad) y esos tiempos tienen prioridad sobre el domingo. El domingo tiene prioridad sobre el santo del día.',

        weekdays: {
            heading: 'Días de semana: los santos del día',
            paragraphs: [
                'De lunes a sábado, las lecturas corresponden al santo o a la fiesta que el Sinaxario conmemora en esa fecha copta. A menudo basta el Evangelio para saber de quién es el día: los profetas asesinados (Mateo 23) para un profeta, la persecución (Lucas 21) para un mártir, el Buen Pastor (Juan 10) para un papa o un patriarca, las vírgenes prudentes (Mateo 25) para una santa.',
                'Pero el libro de los días de semana no tiene lecturas distintas para cada día del año. Solo unas 70 fechas tienen lecturas propias. Todas las demás fechas reutilizan las lecturas de una de ellas, elegida porque su santo es de la misma categoría: un mártir toma las lecturas de otro mártir, un obispo las de otro obispo, un monje las de un gran monje. Por eso las mismas lecturas se repiten varias veces al año.',
                'Por ejemplo, las lecturas del 22 de Toubah, día de San Antonio, padre de los monjes, se reutilizan en otras ocho fechas, en su mayoría fiestas de monjes.',
            ],
        },

        sundays: {
            heading: 'Domingos: la obra de la Santísima Trinidad',
            paragraphs: [
                'Los domingos no siguen al santo del día. Leídas una tras otra, las lecturas dominicales del año cuentan una sola historia: la obra de la Santísima Trinidad para nuestra salvación. Cada mes copto da a sus domingos un tema dentro de esa historia. En Kiahk, por ejemplo, el mes que conduce a la Navidad, los Evangelios de sus cuatro domingos narran la Encarnación: el anuncio a Zacarías, la Anunciación a María, la Visitación y el nacimiento de Juan el Bautista.',
            ],
            more: {
                title: 'Los domingos, mes a mes',
                intro: 'El tema de cada mes y los Evangelios de sus domingos.',
                items: [
                    {
                        name: 'Thout',
                        text: [
                            'El amor de Dios Padre por la humanidad.',
                            'Evangelios: Juan el Bautista (Lucas 7:28–35), el gran mandamiento (Lucas 10:21–28), Zaqueo (Lucas 19:1–10) y la pecadora perdonada (Lucas 7:36–50).',
                        ],
                    },
                    {
                        name: 'Babah',
                        text: [
                            'El poder de Cristo, manifestado en sus milagros.',
                            'Evangelios: el paralítico descolgado por el techo (Marcos 2:1–12), la pesca milagrosa (Lucas 5:1–11), la curación de un ciego y mudo (Mateo 12:22–28) y la resurrección del hijo de la viuda de Naín (Lucas 7:11–17).',
                        ],
                    },
                    {
                        name: 'Hatour',
                        text: [
                            'La enseñanza y las obras de Cristo.',
                            'Evangelios: la parábola del sembrador, dos veces (Lucas 8:4–15 y Mateo 13:1–9), lo que cuesta seguirlo (Lucas 14:25–35) y el joven rico (Marcos 10:17–31).',
                        ],
                    },
                    {
                        name: 'Kiahk',
                        text: [
                            'La Encarnación.',
                            'Evangelios del primer capítulo de San Lucas: el anuncio a Zacarías, la Anunciación a María, la Visitación y el nacimiento de Juan el Bautista.',
                        ],
                    },
                    {
                        name: 'Toubah',
                        text: [
                            'La salvación ofrecida a todas las naciones.',
                            'Evangelios: la huida a Egipto (Mateo 2:13–23), la señal de Jonás (Lucas 11:27–36), el testimonio de Juan el Bautista (Juan 3:22–36) y el ciego de nacimiento (Juan 9:1–38).',
                        ],
                    },
                    {
                        name: 'Amshir',
                        text: [
                            'Cristo, el pan de vida.',
                            'Evangelios: Juan 6 (la multiplicación de los panes para los cinco mil y el pan de vida) en tres domingos, y Zaqueo (Lucas 19:1–10).',
                        ],
                    },
                    { name: 'Baramhat, Baramoudah', text: 'La Gran Cuaresma, la Semana Santa o los Santos Cincuenta Días (véase la sección siguiente).' },
                    {
                        name: 'Bashans',
                        text: [
                            'Sus primeros domingos caen en los Santos Cincuenta Días.',
                            'Evangelios de los últimos domingos: el buen samaritano (Lucas 10:25–37) y la tentación de Cristo (Lucas 4:1–13).',
                        ],
                    },
                    {
                        name: 'Baounah',
                        text: [
                            'El don del Espíritu Santo.',
                            'Evangelios: el Padre que da el Espíritu Santo a quienes se lo piden (Lucas 11:1–13), el paralítico perdonado (Lucas 5:17–26), el pecado contra el Espíritu Santo (Mateo 12:22–37) y «amad a vuestros enemigos» (Lucas 6:27–38).',
                        ],
                    },
                    {
                        name: 'Abib',
                        text: [
                            'La ayuda del Señor a sus apóstoles.',
                            'Evangelios: el envío de los setenta (Lucas 10:1–20), «¿quién es el mayor?» (Mateo 18:1–9), la multiplicación de los panes para los cinco mil (Lucas 9:10–17) y la resurrección de Lázaro (Juan 11:1–45).',
                        ],
                    },
                    {
                        name: 'Misra',
                        text: [
                            'El cuidado del Señor por su Iglesia.',
                            'Evangelios: los viñadores malvados (Lucas 20:9–19), la llamada de Leví (Lucas 5:27–39), la casa dividida (Marcos 3:22–35) y el fin de los tiempos (Marcos 13:3–37).',
                        ],
                    },
                    {
                        name: 'Nasie',
                        text: [
                            'La Segunda Venida.',
                            'Evangelio: las señales del fin (Mateo 24:3–35).',
                        ],
                    },
                ],
                notes: [
                    'Cuando hay un quinto domingo, se lee la multiplicación de los panes para los cinco mil: de Thout a Amshir, con las lecturas del segundo domingo de Amshir (Juan 6:5–14), y de Baramhat a Misra, con lecturas propias (Lucas 9:12–17). Hay excepciones, en particular el día 29 de un mes que no sea Toubah ni Amshir, o el 30 de Kiahk.',
                    'En Babah, Hatour y de Bashans a Misra, el Evangelio del domingo en el Oficio del Mañana es la Resurrección, narrada por Mateo, Marcos, Lucas y Juan, uno tras otro.',
                ],
            },
        },

        seasons: {
            heading: 'Los tiempos que se mueven con la Pascua',
            paragraphs: [
                'El calendario copto es fijo, pero la Pascua no: su fecha se calcula cada año y cae entre el 4 de abril y el 8 de mayo. Varios periodos se cuentan a partir de la Pascua, así que se mueven con ella cada año:',
            ],
            items: [
                { name: 'Ayuno de Nínive', text: 'Tres días, dos semanas antes de la Gran Cuaresma.' },
                { name: 'Gran Cuaresma', text: 'La semana de preparación y los Cuarenta Días. Empieza entre principios de febrero y mediados de marzo.' },
                { name: 'Semana Santa', text: 'La semana antes de Pascua.' },
                { name: 'Santos Cincuenta Días', text: 'De Pascua a Pentecostés, que cae entre el 23 de mayo y el 26 de junio.' },
            ],
            note: 'Durante estas semanas, unas 15 al año, las lecturas proceden de los libros de estos tiempos, por semana y por día, en lugar de los libros de los días de semana y de los domingos. Las lecturas siguen el tiempo litúrgico: en la Gran Cuaresma, los domingos se leen la tentación de Cristo, el hijo pródigo y la samaritana; la Semana Santa sigue los últimos días de Cristo, día a día. Solo unas pocas fiestas del Señor, como la Fiesta de la Cruz del 10 de Baramhat, conservan sus propias lecturas.',
            more: {
                title: 'Qué se lee en estos tiempos',
                items: [
                    { name: 'Ayuno de Nínive', text: 'El libro de Jonás, leído a lo largo de los tres días.' },
                    { name: 'Días de semana de la Gran Cuaresma', text: 'De lunes a viernes no hay ofrenda del incienso de la tarde, y en el Oficio del Mañana hay lecturas de los profetas del Antiguo Testamento antes del Evangelio.' },
                    {
                        name: 'Domingos de la Gran Cuaresma',
                        list: true,
                        text: [
                            'Domingo antes de la Gran Cuaresma: la limosna, la oración y el ayuno en secreto (Mateo 6:1–18).',
                            '1.er domingo: los tesoros en el cielo (Mateo 6:19–33).',
                            '2.º domingo: la tentación de Cristo (Mateo 4:1–11).',
                            '3.er domingo: el hijo pródigo (Lucas 15:11–32).',
                            '4.º domingo: la samaritana (Juan 4:1–42).',
                            '5.º domingo: el paralítico de Betesda (Juan 5:1–18).',
                            '6.º domingo: el ciego de nacimiento (Juan 9:1–41).',
                        ],
                    },
                    { name: 'Sábado de Lázaro', text: 'El día antes del Domingo de Ramos: la resurrección de Lázaro (Juan 11:1–45).' },
                    { name: 'Domingo de Ramos', text: 'La entrada en Jerusalén, leída en los cuatro Evangelios.' },
                    { name: 'Semana Santa', text: 'Lecturas para cada hora de oración del día y de la noche: la Primera, la Tercera, la Sexta, la Novena y la Undécima Hora, con una Duodécima Hora el viernes. Cada hora empieza con el Antiguo Testamento.' },
                    {
                        name: 'Día a día',
                        list: true,
                        text: [
                            'Lunes: la higuera y la purificación del Templo.',
                            'Martes: las parábolas y las advertencias sobre el fin.',
                            'Miércoles: la unción en Betania y el pacto de Judas.',
                            'Jueves: la Última Cena y las palabras de despedida de Cristo.',
                            'Viernes: la Pasión, según los cuatro Evangelios.',
                            'Sábado: la Resurrección (Mateo 28).',
                        ],
                    },
                    {
                        name: 'Domingos de los Santos Cincuenta Días',
                        list: true,
                        lead: 'En la Misa, el Evangelio de cada domingo es de San Juan:',
                        text: [
                            'Domingo de Pascua: el sepulcro vacío (Juan 20:1–18).',
                            '1.er domingo: Tomás (Juan 20:19–31).',
                            '2.º domingo: el pan de vida (Juan 6:35–45).',
                            '3.er domingo: el agua viva (Juan 4:1–42).',
                            '4.º domingo: la luz del mundo (Juan 12:35–50).',
                            '5.º domingo: el camino, la verdad y la vida (Juan 14:1–11).',
                            '6.º domingo: «yo he vencido al mundo» (Juan 16:23–33).',
                        ],
                    },
                    {
                        name: 'Ascensión, Pentecostés',
                        list: true,
                        text: [
                            'La Ascensión, el día 40: Lucas 24:36–53.',
                            'Pentecostés, el día 50: la venida del Consolador (Juan 15:26–16:15).',
                        ],
                    },
                ],
                notes: [
                    'La samaritana es el Evangelio de dos domingos: en la Gran Cuaresma, con un salmo que habla de buscar al Señor (Salmo 105), y después de Pascua, con un salmo que habla de la bendición del Señor (Salmo 115).',
                ],
            },
        },
    },

    footer: {
        readings: 'Lecturas de hoy',
        contact: 'Contacto',
        getApp: 'Descarga la aplicación:',
        sourceCode: 'Código fuente',
    },
}

export default content
