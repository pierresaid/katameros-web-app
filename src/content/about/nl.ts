import type { AboutContent } from './types'

const content: AboutContent = {
    title: 'Wat is de Katameros?',
    description: 'Wat de Katameros is: het lectionarium van de Koptisch-Orthodoxe Kerk, de vijf boeken, de Koptische kalender en hoe de lezingen van elke dag worden gekozen.',
    lead: 'De Katameros is het lectionarium van de Koptisch-Orthodoxe Kerk: het boek dat voor elke dag van het jaar aangeeft welke Bijbelgedeelten in de kerk worden gelezen tijdens de dagelijkse diensten.',

    name: {
        heading: 'De naam',
        paragraphs: [
            'De naam komt van het Griekse *kata meros*, “in delen”: daarin wordt de Bijbel gelezen in gedeelten die voor elke dag gekozen zijn.',
        ],
    },

    church: {
        heading: 'Gelezen in de kerk',
        paragraphs: [
            'In de kerk ligt het lectionarium op de lezenaar (de leesstandaard), opengeslagen bij de lezingen van de dag. Tijdens de diensten van de dag lezen de lectoren, de diakens en de priester de gedeelten die erin staan. Koptisch-orthodoxe kerken over de hele wereld volgen ditzelfde lectionarium.',
        ],
    },

    contents: {
        heading: 'Wat erin staat',
        intro: 'Op de meeste dagen geeft het lectionarium de lezingen van drie diensten. Voor de Kerk begint de liturgische dag bij zonsondergang. Daarom beginnen de lezingen de avond ervoor, met het Avond Wierookgebed. Daarna volgen het Ochtend Wierookgebed en de Eucharistieviering (de Goddelijke Liturgie). De eerste twee diensten heten ook wel de vespers en de metten.',
        services: [
            { name: 'Avond Wierookgebed', when: 'De avond ervoor', parts: ['Het Heilige Evangelie'] },
            { name: 'Ochtend Wierookgebed', when: 'In de ochtend', parts: ['Het Heilige Evangelie'] },
            { name: 'Eucharistieviering', when: 'Na het Ochtend Wierookgebed', parts: ['Paulinische brieven', 'Katholieke brieven', 'Handelingen van de Apostelen', 'Synaxarium', 'Het Heilige Evangelie'] },
        ],
        readingsLabel: 'De lezingen van de Eucharistieviering',
        readings: [
            { name: 'Paulinische brieven', text: 'Een gedeelte uit een van de brieven van de heilige Paulus.' },
            { name: 'Katholieke brieven', text: 'Een gedeelte uit de brieven van de heilige Jakobus, Petrus, Johannes of Judas. “Katholiek” betekent algemeen: de meeste van deze brieven zijn gericht aan de hele Kerk en niet aan één plaatselijke kerk.' },
            { name: 'Handelingen van de Apostelen', text: 'Een gedeelte uit het boek Handelingen. Deze lezing heet ook de Praxis, Grieks voor “Handelingen”.' },
            { name: 'Synaxarium', text: 'De levens van de heiligen en martelaren die op die dag worden herdacht, gelezen uit een eigen boek.' },
            { name: 'Het Heilige Evangelie', text: 'Een psalm en het Evangelie: van de psalm worden een paar verzen gezongen, vlak voor het Evangelie. Het Evangelie is de belangrijkste lezing van de dag, en de andere lezingen sluiten er meestal bij aan.' },
        ],
    },

    books: {
        heading: 'Vijf boeken',
        intro: 'De Katameros is verdeeld in vijf boeken. Afhankelijk van de dag leest men uit het ene of het andere. De eerste twee worden het hele jaar door gebruikt, behalve in de grote periodes rond Pasen, die hun eigen boeken hebben:',
        items: [
            { name: 'Weekdagen', text: 'Van maandag tot en met zaterdag, volgens de heiligen en feesten van de Koptische kalender.' },
            { name: 'Zondagen', text: 'De zondagen van het jaar, met een thema voor elke maand.' },
            { name: 'Grote Vasten', text: 'De voorbereidingsweek en de Veertig Dagen, en ook de Vasten van Ninevé.' },
            { name: 'Goede Week', text: 'De week vóór Pasen, met lezingen voor elk gebedsuur. In de Koptische Kerk heet deze week Pascha.' },
            { name: 'Heilige Vijftig Dagen', text: 'Van Pasen tot Pinksteren.' },
        ],
    },

    calendar: {
        heading: 'De Koptische kalender',
        paragraphs: [
            'De Katameros volgt de Koptische kalender, de kalender die de Kerk heeft geërfd van het oude Egypte. Het Koptische jaar heeft 13 maanden: 12 maanden van 30 dagen en daarna een korte maand, Nasie, van vijf dagen[^nasie].',
            'De maanden zijn Thout, Babah, Hatour, Kiahk, Toubah, Amshir, Baramhat, Baramoudah, Bashans, Baounah, Abib, Misra en Nasie. Het jaar begint op 1 Thout, dat is 11 september[^thout].',
            'De Koptische jaren worden geteld vanaf het jaar 284, toen Diocletianus keizer werd. Deze jaartelling heet de era van de martelaren, ter herinnering aan de vele christenen die tijdens zijn vervolging werden gedood.',
        ],
    },

    choice: {
        heading: 'Hoe de lezingen worden gekozen',
        intro: 'De lezingen van een dag worden niet willekeurig gekozen. Ze volgen wat de Kerk die dag viert. Drie dingen bepalen de keuze:',
        factors: [
            { name: 'De heilige of het feest van de dag in de Koptische kalender' },
            { name: 'De zondag en zijn thema' },
            { name: 'De periodes die met Pasen meeschuiven', detail: 'Vasten van Ninevé, Grote Vasten, Goede Week, Heilige Vijftig Dagen' },
        ],
        priority: 'Als er meerdere op dezelfde dag vallen, hebben de feesten van de Heer (zoals Kerstmis) en de grote periodes rond Pasen voorrang op de zondag. De zondag heeft voorrang op de heilige van de dag.',

        weekdays: {
            heading: 'Weekdagen: de heiligen van de dag',
            intro: [
                'Van maandag tot en met zaterdag horen de lezingen bij de heilige van de dag, die op die Koptische datum in het Synaxarium wordt herdacht.',
                'Op 3 Abib herdenkt de Kerk bijvoorbeeld de heilige Cyrillus van Alexandrië, een paus. In de Eucharistieviering wordt het Evangelie van de Goede Herder gelezen: “Ik ben de goede Herder; de goede herder geeft zijn leven voor de schapen” (Johannes 10:11). De paus is de herder van zijn Kerk.',
                'Zo heeft elke soort heilige eigen lezingen. Voor het Evangelie van de Eucharistieviering:',
            ],
            gospels: [
                { name: 'Voor een profeet', text: 'De profeten die werden gedood', ref: 'Mattheüs 23', passage: 'prophets' },
                { name: 'Voor een martelaar', text: 'Vervolging', ref: 'Lukas 21', passage: 'persecution' },
                { name: 'Voor een paus of een patriarch', text: 'De Goede Herder', ref: 'Johannes 10', passage: 'shepherd' },
                { name: 'Voor een heilige vrouw', text: 'De wijze maagden', ref: 'Mattheüs 25', passage: 'virgins' },
            ],
            openLabel: 'Lees',
            paragraphs: [
                'De lezingen zijn dus dezelfde voor alle heiligen van dezelfde soort[^martyrs]: voor Mozes, Jesaja of Jeremia wordt hetzelfde Evangelie gelezen, dat van de profeten die werden gedood (Mattheüs 23). Daarom komen dezelfde lezingen meerdere keren per jaar terug. De grote feesten en enkele grote heiligen hebben eigen lezingen.',
            ],
        },

        sundays: {
            heading: 'Zondagen: het werk van de Heilige Drie-eenheid',
            paragraphs: [
                'Op zondag volgen de lezingen niet de heilige van de dag, maar het thema van de Koptische maand.',
                'Het hele jaar door draaien de zondagslezingen om één onderwerp: het werk van de Heilige Drie-eenheid voor onze redding. Elke Koptische maand laat er één aspect van zien.',
                'Een voorbeeld: Kiahk is de maand die naar Kerstmis toe leidt. Het thema is de Menswording. De Evangeliën van de vier zondagen vertellen over de aankondiging aan Zacharias, de Aankondiging aan Maria, het bezoek van Maria aan Elisabet en de geboorte van Johannes de Doper.',
            ],
            more: {
                title: 'De zondagen, maand voor maand',
                intro: 'Het thema van elke maand en de Evangeliën van zijn zondagen.',
                items: [
                    {
                        name: 'Thout',
                        text: [
                            'De liefde van God de Vader voor de mensheid.',
                            'Evangeliën: Johannes de Doper (Lukas 7:28–35), het grote gebod (Lukas 10:21–28), Zacheüs (Lukas 19:1–10) en de zondares die vergeving krijgt (Lukas 7:36–50).',
                        ],
                    },
                    {
                        name: 'Babah',
                        text: [
                            'De macht van Christus, zichtbaar in Zijn wonderen.',
                            'Evangeliën: de verlamde die door het dak werd neergelaten (Markus 2:1–12), de wonderbare visvangst (Lukas 5:1–11), de genezing van een blinde en stomme man (Mattheüs 12:22–28) en de opwekking van de zoon van de weduwe van Naïn (Lukas 7:11–17).',
                        ],
                    },
                    {
                        name: 'Hatour',
                        text: [
                            'Zijn onderwijs en Zijn werken.',
                            'Evangeliën: de gelijkenis van de zaaier, twee keer (Lukas 8:4–15 en Mattheüs 13:1–9), wat het kost om Hem te volgen (Lukas 14:25–35) en de rijke jongeman (Markus 10:17–31).',
                        ],
                    },
                    {
                        name: 'Kiahk',
                        text: [
                            'De Menswording.',
                            'Evangeliën uit het eerste hoofdstuk van Lukas: de aankondiging aan Zacharias, de Aankondiging aan Maria, het bezoek van Maria aan Elisabet en de geboorte van Johannes de Doper.',
                        ],
                    },
                    {
                        name: 'Toubah',
                        text: [
                            'De redding die aan alle volken wordt aangeboden.',
                            'Evangeliën: de vlucht naar Egypte (Mattheüs 2:13–23), het teken van Jona (Lukas 11:27–36), het getuigenis van Johannes de Doper (Johannes 3:22–36) en de man die blind geboren was (Johannes 9:1–38).',
                        ],
                    },
                    {
                        name: 'Amshir',
                        text: [
                            'Christus, het brood van het leven.',
                            'Evangeliën: Johannes 6 (de spijziging van de vijfduizend en het brood van het leven) op drie zondagen, en Zacheüs (Lukas 19:1–10).',
                        ],
                    },
                    { name: 'Baramhat, Baramoudah', text: 'De Grote Vasten, de Goede Week of de Heilige Vijftig Dagen (zie het volgende onderdeel).' },
                    {
                        name: 'Bashans',
                        text: [
                            'De eerste zondagen van deze maand vallen in de Heilige Vijftig Dagen.',
                            'Evangeliën van de laatste zondagen: de barmhartige Samaritaan (Lukas 10:25–37) en de verzoeking van Christus (Lukas 4:1–13).',
                        ],
                    },
                    {
                        name: 'Baounah',
                        text: [
                            'De gave van de Heilige Geest.',
                            'Evangeliën: de Vader die de Heilige Geest geeft aan wie erom vraagt (Lukas 11:1–13), de verlamde die vergeving krijgt (Lukas 5:17–26), de zonde tegen de Heilige Geest (Mattheüs 12:22–37) en “heb uw vijanden lief” (Lukas 6:27–38).',
                        ],
                    },
                    {
                        name: 'Abib',
                        text: [
                            'De hulp van de Heer aan Zijn apostelen.',
                            'Evangeliën: de uitzending van de zeventig (Lukas 10:1–20), “wie is de grootste?” (Mattheüs 18:1–9), de spijziging van de vijfduizend (Lukas 9:10–17) en de opwekking van Lazarus (Johannes 11:1–45).',
                        ],
                    },
                    {
                        name: 'Misra',
                        text: [
                            'Zijn zorg voor Zijn Kerk.',
                            'Evangeliën: de boze wijngaardeniers (Lukas 20:9–19), de roeping van Levi (Lukas 5:27–39), het verdeelde huis (Markus 3:22–35) en het einde der tijden (Markus 13:3–37).',
                        ],
                    },
                    {
                        name: 'Nasie',
                        text: [
                            'De wederkomst van Christus.',
                            'Evangelie: de tekenen van het einde (Mattheüs 24:3–35).',
                        ],
                    },
                ],
            },
        },

        seasons: {
            heading: 'De periodes die met Pasen meeschuiven',
            paragraphs: [
                'De Koptische kalender ligt vast, maar Pasen niet: de datum wordt elk jaar berekend en valt tussen 4 april en 8 mei. Meerdere periodes worden vanaf Pasen geteld, zodat ze elk jaar met Pasen meeschuiven:',
            ],
            items: [
                { name: 'Vasten van Ninevé', text: 'Drie dagen vasten, twee weken vóór het begin van de Grote Vasten.' },
                { name: 'Grote Vasten', text: 'Een voorbereidingsweek, daarna de Veertig Dagen. Ze begint tussen begin februari en half maart.' },
                { name: 'Goede Week', text: 'De week vóór Pasen.' },
                { name: 'Heilige Vijftig Dagen', text: 'Van Pasen tot Pinksteren, dat tussen 23 mei en 26 juni valt.' },
            ],
            more: {
                title: 'Wat er in deze periodes wordt gelezen',
                items: [
                    { name: 'Vasten van Ninevé', text: 'Het boek Jona, verdeeld over de drie dagen.' },
                    { name: 'Weekdagen van de Grote Vasten', text: 'Van maandag tot en met vrijdag is er geen Avond Wierookgebed, en in het Ochtend Wierookgebed komen lezingen uit de profeten van het Oude Testament vóór het Evangelie.' },
                    {
                        name: 'Zondagen van de Grote Vasten',
                        list: true,
                        text: [
                            'Zondag vóór de Grote Vasten: aalmoezen geven, bidden en vasten in het verborgene (Mattheüs 6:1–18).',
                            '1e zondag: schatten in de hemel (Mattheüs 6:19–33).',
                            '2e zondag: de verzoeking van Christus (Mattheüs 4:1–11).',
                            '3e zondag: de verloren zoon (Lukas 15:11–32).',
                            '4e zondag: de Samaritaanse vrouw (Johannes 4:1–42).',
                            '5e zondag: de verlamde bij Bethesda (Johannes 5:1–18).',
                            '6e zondag: de man die blind geboren was (Johannes 9:1–41).',
                        ],
                    },
                    { name: 'Zaterdag van Lazarus', text: 'De dag vóór Palmzondag: de opwekking van Lazarus (Johannes 11:1–45).' },
                    { name: 'Palmzondag', text: 'De intocht in Jeruzalem, gelezen uit alle vier de Evangeliën.' },
                    { name: 'Goede Week', text: 'Lezingen voor elk gebedsuur van de dag en van de nacht: het Eerste, Derde, Zesde, Negende en Elfde Uur, met op vrijdag ook een Twaalfde Uur. Elk uur begint met het Oude Testament.' },
                    {
                        joined: true,
                        name: 'Dag voor dag',
                        list: true,
                        text: [
                            'Maandag: de vijgenboom en de reiniging van de tempel.',
                            'Dinsdag: de gelijkenissen en de waarschuwingen over het einde.',
                            'Woensdag: de zalving in Bethanië en Judas die Jezus verkoopt.',
                            'Donderdag: het Laatste Avondmaal en de afscheidswoorden van Christus.',
                            'Vrijdag: het lijdensverhaal, uit alle vier de Evangeliën.',
                            'Zaterdag: de Opstanding (Mattheüs 28:1–20).',
                        ],
                    },
                    {
                        name: 'Zondagen van de Heilige Vijftig Dagen',
                        list: true,
                        lead: 'In de Eucharistieviering komt het Evangelie van elke zondag uit Johannes:',
                        text: [
                            'Paaszondag: het lege graf (Johannes 20:1–18).',
                            '1e zondag: Thomas (Johannes 20:19–31).',
                            '2e zondag: het brood van het leven (Johannes 6:35–45).',
                            '3e zondag: het levende water (Johannes 4:1–42).',
                            '4e zondag: het licht van de wereld (Johannes 12:35–50).',
                            '5e zondag: de weg, de waarheid en het leven (Johannes 14:1–11).',
                            '6e zondag: “Ik heb de wereld overwonnen” (Johannes 16:23–33).',
                        ],
                    },
                    {
                        name: 'Hemelvaart, Pinksteren',
                        list: true,
                        text: [
                            'Hemelvaart, op de 40e dag: Lukas 24:36–53.',
                            'Pinksteren, op de 50e dag: de komst van de Trooster (Johannes 15:26–16:15).',
                        ],
                    },
                ],
            },
        },
    },

    footnotes: {
        heading: 'Noten',
        label: 'Noot',
        backLabel: 'Terug naar de tekst',
        items: [
            { id: 'nasie', text: 'Eens in de vier jaar heeft Nasie zes dagen: als de eerstvolgende februari 29 dagen heeft.' },
            { id: 'thout', text: 'Eens in de vier jaar valt 1 Thout op 12 september, na een Nasie van zes dagen.' },
            { id: 'martyrs', text: 'Eén soort heilige kan meerdere reeksen lezingen hebben: dat geldt bijvoorbeeld voor de martelaren.' },
        ],
    },

    footer: {
        readings: 'Lezingen van vandaag',
        contact: 'Contact',
        getApp: 'Download de app:',
        sourceCode: 'Broncode',
    },
}

export default content
