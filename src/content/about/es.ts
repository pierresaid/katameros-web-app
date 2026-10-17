import type { AboutContent } from './types'

const content: AboutContent = {
    title: '¿Qué es el Katameros?',
    description: 'Qué es el Katameros: el leccionario de la Iglesia copta ortodoxa, sus cinco libros, el calendario copto y cómo se eligen las lecturas de cada día.',
    lead: 'El Katameros es el leccionario de la Iglesia copta ortodoxa: el libro que indica los pasajes de la Biblia que se leen en la iglesia durante los oficios diarios, todos los días del año.',

    name: {
        heading: 'El nombre',
        paragraphs: [
            'El nombre viene del griego *kata meros*, «por partes»: en él se lee la Biblia por pasajes, elegidos para cada día.',
        ],
    },

    church: {
        heading: 'Se lee en la iglesia',
        paragraphs: [
            'En la iglesia, el leccionario está sobre el facistol (el atril de lectura), abierto en las lecturas del día. En los oficios del día, los lectores, los diáconos y el sacerdote leen los pasajes que indica. Las iglesias coptas ortodoxas de todo el mundo siguen este mismo leccionario.',
        ],
    },

    contents: {
        heading: 'Qué contiene',
        intro: 'La mayoría de los días, el leccionario da las lecturas de tres oficios. Para la Iglesia, el día litúrgico empieza a la puesta del sol. Por eso las lecturas comienzan la tarde anterior, con el Oficio de la Vigilancia. Después vienen el Oficio del Mañana y la Misa (la Eucaristía). Los dos primeros oficios son las vísperas y los maitines, también llamados ofrendas del incienso de la tarde y de la mañana.',
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
            { name: 'Sinaxario', text: 'Las vidas de los santos y mártires que se conmemoran ese día, leídas en un libro propio.' },
            { name: 'Salmo y Evangelio', text: 'Unos versículos de un salmo, cantados justo antes del Evangelio. El Evangelio es la lectura principal del día, y las demás lecturas suelen estar relacionadas con él.' },
        ],
    },

    books: {
        heading: 'Cinco libros',
        intro: 'El Katameros está dividido en cinco libros. Según el día, se lee en uno o en otro. Los dos primeros se usan todo el año, salvo en los grandes tiempos en torno a la Pascua, que tienen sus propios libros:',
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
            'El Katameros sigue el calendario copto, el calendario de la Iglesia heredado del antiguo Egipto. El año copto tiene 13 meses: 12 meses de 30 días y luego un mes corto llamado Nasie, de cinco días[^nasie].',
            'Los meses son Thout, Babah, Hatour, Kiahk, Toubah, Amshir, Baramhat, Baramoudah, Bashans, Baounah, Abib, Misra y Nasie. El año empieza el 1 de Thout, que corresponde al 11 de septiembre[^thout].',
            'Los años coptos se cuentan desde el año 284, cuando Diocleciano se convirtió en emperador. Esta cuenta se llama era de los mártires, en recuerdo de los numerosos cristianos asesinados durante su persecución.',
        ],
    },

    choice: {
        heading: 'Cómo se eligen las lecturas',
        intro: 'Las lecturas de un día no se eligen al azar, sino según lo que la Iglesia celebra ese día. Tres cosas las determinan:',
        factors: [
            { name: 'El santo o la fiesta del día en el calendario copto' },
            { name: 'El domingo y su tema' },
            { name: 'Los tiempos que se mueven con la Pascua', detail: 'Ayuno de Nínive, Gran Cuaresma, Semana Santa, Santos Cincuenta Días' },
        ],
        priority: 'Cuando varias de ellas caen el mismo día, las fiestas del Señor (como la Navidad) y los grandes tiempos en torno a la Pascua tienen prioridad sobre el domingo. El domingo tiene prioridad sobre el santo del día.',

        weekdays: {
            heading: 'Días de semana: los santos del día',
            intro: [
                'De lunes a sábado, las lecturas están ligadas al santo del día, el que el Sinaxario conmemora en la fecha copta.',
                'Por ejemplo, el 3 de Abib la Iglesia celebra a San Cirilo de Alejandría, papa. En la Misa se lee el Evangelio del Buen Pastor: «Yo soy el buen pastor: el buen pastor su alma da por las ovejas» (Juan 10:11). El papa es el pastor de su Iglesia.',
                'Así, cada tipo de santo tiene sus propias lecturas. Para el Evangelio de la Misa:',
            ],
            gospels: [
                { name: 'Para un profeta', text: 'Los profetas asesinados', ref: 'Mateo 23', passage: 'prophets' },
                { name: 'Para un mártir', text: 'La persecución', ref: 'Lucas 21', passage: 'persecution' },
                { name: 'Para un papa o un patriarca', text: 'El Buen Pastor', ref: 'Juan 10', passage: 'shepherd' },
                { name: 'Para una santa', text: 'Las vírgenes prudentes', ref: 'Mateo 25', passage: 'virgins' },
            ],
            openLabel: 'Leer',
            paragraphs: [
                'Las lecturas son, por tanto, las mismas para todos los santos de un mismo tipo[^martyrs]: para Moisés, Isaías o Jeremías se lee el mismo Evangelio, el de los profetas asesinados (Mateo 23). Por eso las mismas lecturas se repiten varias veces al año. Las grandes fiestas y algunos grandes santos tienen lecturas propias.',
            ],
        },

        sundays: {
            heading: 'Domingos: la obra de la Santísima Trinidad',
            paragraphs: [
                'Los domingos, las lecturas no siguen al santo del día, sino el tema del mes copto.',
                'A lo largo de los domingos del año, las lecturas giran en torno a un solo asunto: la obra de la Santísima Trinidad para nuestra salvación. Cada mes copto muestra un aspecto de esta obra.',
                'Por ejemplo, Kiahk es el mes que conduce a la Navidad. Su tema es la Encarnación. Los Evangelios de sus cuatro domingos narran el anuncio a Zacarías, la Anunciación a María, la Visitación y el nacimiento de Juan el Bautista.',
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
            },
        },

        seasons: {
            heading: 'Los tiempos que se mueven con la Pascua',
            paragraphs: [
                'El calendario copto es fijo, pero la Pascua no: su fecha se calcula cada año y cae entre el 4 de abril y el 8 de mayo. Varios periodos se cuentan a partir de la Pascua, así que se mueven con ella cada año:',
            ],
            items: [
                { name: 'Ayuno de Nínive', text: 'Tres días de ayuno, dos semanas antes del comienzo de la Gran Cuaresma.' },
                { name: 'Gran Cuaresma', text: 'Una semana de preparación y luego los Cuarenta Días. Empieza entre principios de febrero y mediados de marzo.' },
                { name: 'Semana Santa', text: 'La semana antes de Pascua.' },
                { name: 'Santos Cincuenta Días', text: 'De Pascua a Pentecostés, que cae entre el 23 de mayo y el 26 de junio.' },
            ],
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
                        joined: true,
                        name: 'Día a día',
                        list: true,
                        text: [
                            'Lunes: la higuera y la purificación del Templo.',
                            'Martes: las parábolas y las advertencias sobre el fin.',
                            'Miércoles: la unción en Betania y el pacto de Judas.',
                            'Jueves: la Última Cena y las palabras de despedida de Cristo.',
                            'Viernes: la Pasión, según los cuatro Evangelios.',
                            'Sábado: la Resurrección (Mateo 28:1–20).',
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
            },
        },
    },

    footnotes: {
        heading: 'Notas',
        label: 'Nota',
        backLabel: 'Volver al texto',
        items: [
            { id: 'nasie', text: 'Un año de cada cuatro, Nasie tiene seis días: cuando el febrero siguiente tiene 29 días.' },
            { id: 'thout', text: 'Un año de cada cuatro, el 1 de Thout cae el 12 de septiembre, después de un Nasie de seis días.' },
            { id: 'martyrs', text: 'Un mismo tipo de santo puede tener varias series de lecturas: es el caso, por ejemplo, de los mártires.' },
        ],
    },

    footer: {
        readings: 'Lecturas de hoy',
        contact: 'Contacto',
        getApp: 'Descarga la aplicación:',
        sourceCode: 'Código fuente',
    },
}

export default content
