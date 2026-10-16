import type { AboutContent } from './types'

const content: AboutContent = {
    title: 'Czym jest Katameros?',
    description: 'Czym jest Katameros: lekcjonarz Koptyjskiego Kościoła Ortodoksyjnego, jego pięć ksiąg, kalendarz koptyjski i to, jak dobiera się czytania na każdy dzień.',
    lead: 'Katameros to lekcjonarz Koptyjskiego Kościoła Ortodoksyjnego: księga, która na każdy dzień roku podaje fragmenty Biblii czytane w kościele podczas codziennych nabożeństw.',

    name: {
        heading: 'Nazwa',
        paragraphs: [
            'Nazwa pochodzi od greckiego wyrażenia *kata meros*, czyli „częściami”: Pismo Święte czyta się fragmentami, wybranymi na każdy dzień.',
        ],
    },

    church: {
        heading: 'Czytany w kościele',
        paragraphs: [
            'W kościele lekcjonarz leży na analogionie (pulpicie do czytania), otwarty na czytaniach danego dnia. Podczas nabożeństw tego dnia lektorzy, diakoni i kapłan czytają wskazane w nim fragmenty. Parafie Koptyjskiego Kościoła Ortodoksyjnego na całym świecie posługują się tym samym lekcjonarzem.',
        ],
    },

    contents: {
        heading: 'Zawartość',
        intro: 'Na większość dni lekcjonarz podaje czytania trzech nabożeństw. W Kościele dzień liturgiczny rozpoczyna się o zachodzie słońca. Dlatego czytania zaczynają się poprzedniego wieczoru, od Nieszporów. Potem następują Jutrznia i Liturgia (Eucharystia). Nieszpory i Jutrznia nazywane są też wieczornym i porannym ofiarowaniem kadzidła.',
        services: [
            { name: 'Nieszpory', when: 'Poprzedniego wieczoru', parts: ['Psalm i Ewangelia'] },
            { name: 'Jutrznia', when: 'Rano', parts: ['Psalm i Ewangelia'] },
            { name: 'Liturgia', when: 'Po Jutrzni', parts: ['List Świętego Pawła', 'List powszechny', 'Dzieje Apostolskie', 'Synaksarion', 'Psalm i Ewangelia'] },
        ],
        readingsLabel: 'Czytania Liturgii',
        readings: [
            { name: 'List Świętego Pawła', text: 'Fragment jednego z listów św. Pawła.' },
            { name: 'List powszechny', text: 'Fragment listów św. Jakuba, św. Piotra, św. Jana lub św. Judy. Nazywa się je powszechnymi lub katolickimi („katolicki” znaczy „powszechny”): większość z nich jest skierowana do całego Kościoła, a nie do jednego Kościoła lokalnego.' },
            { name: 'Dzieje Apostolskie', text: 'Fragment Dziejów Apostolskich. To czytanie nazywa się też Praxis, co po grecku znaczy „Dzieje”.' },
            { name: 'Synaksarion', text: 'Żywoty świętych i męczenników wspominanych tego dnia, czytane z osobnej księgi.' },
            { name: 'Psalm i Ewangelia', text: 'Kilka wersetów psalmu, śpiewanych tuż przed Ewangelią. Ewangelia jest głównym czytaniem dnia, a pozostałe czytania zwykle do niej nawiązują.' },
        ],
    },

    books: {
        heading: 'Pięć ksiąg',
        intro: 'Katameros dzieli się na pięć ksiąg. W zależności od dnia czyta się z jednej z nich. Dwóch pierwszych używa się przez cały rok, z wyjątkiem wielkich okresów wokół Wielkanocy, które mają własne księgi:',
        items: [
            { name: 'Dni powszednie', text: 'Od poniedziałku do soboty, według wspomnień świętych i świąt kalendarza koptyjskiego.' },
            { name: 'Niedziele', text: 'Niedziele całego roku, z osobnym tematem na każdy miesiąc.' },
            { name: 'Wielki Post', text: 'Tydzień przygotowawczy i czterdzieści dni postu, a także Post Niniwy.' },
            { name: 'Wielki Tydzień', text: 'Tydzień przed Wielkanocą, z czytaniami na każdą z jego godzin modlitwy. W Kościele koptyjskim ten tydzień nazywa się Paschą.' },
            { name: 'Święte Pięćdziesiąt Dni', text: 'Od Wielkanocy do Pięćdziesiątnicy.' },
        ],
    },

    calendar: {
        heading: 'Kalendarz koptyjski',
        paragraphs: [
            'Katameros opiera się na kalendarzu koptyjskim, czyli kalendarzu Kościoła odziedziczonym po starożytnym Egipcie. Rok koptyjski ma 13 miesięcy: 12 miesięcy po 30 dni, a potem krótki miesiąc zwany Nasie, który ma pięć dni[^nasie].',
            'Miesiące to: Thout, Babah, Hatour, Kiahk, Toubah, Amshir, Baramhat, Baramoudah, Bashans, Baounah, Abib, Misra i Nasie. Rok zaczyna się 1 Thout, czyli 11 września[^thout].',
            'Lata koptyjskie liczy się od roku 284, kiedy Dioklecjan został cesarzem. Tę rachubę lat nazywa się erą męczenników, na pamiątkę wielu chrześcijan zabitych w czasie jego prześladowań.',
        ],
    },

    choice: {
        heading: 'Jak dobiera się czytania',
        intro: 'Czytań danego dnia nie dobiera się przypadkowo. Odpowiadają one temu, co Kościół tego dnia obchodzi. Decydują o nich trzy czynniki:',
        factors: [
            { name: 'Wspomnienie świętego lub święto danego dnia w kalendarzu koptyjskim' },
            { name: 'Niedziela i jej temat' },
            { name: 'Okresy, które przesuwają się z Wielkanocą', detail: 'Post Niniwy, Wielki Post, Wielki Tydzień, Święte Pięćdziesiąt Dni' },
        ],
        priority: 'Gdy kilka z nich przypada na ten sam dzień, święta Pańskie (takie jak Boże Narodzenie) i wielkie okresy wokół Wielkanocy mają pierwszeństwo przed niedzielą. Niedziela ma pierwszeństwo przed wspomnieniem świętego danego dnia.',

        weekdays: {
            heading: 'Dni powszednie: święci danego dnia',
            intro: [
                'Od poniedziałku do soboty czytania są związane ze świętym danego dnia, którego Synaksarion wspomina pod daną datą koptyjską.',
                'Na przykład 3 Abib Kościół wspomina św. Cyryla Aleksandryjskiego, papieża. Podczas Liturgii czyta się Ewangelię o Dobrym Pasterzu: „Ja jestem dobrym pasterzem. Dobry pasterz oddaje swoje życie za owce” (Jana 10:11). Papież jest pasterzem swojego Kościoła.',
                'Każdy rodzaj świętych ma więc swoje czytania. Jeśli chodzi o Ewangelię Liturgii:',
            ],
            gospels: [
                { name: 'Na dzień proroka', text: 'Zabici prorocy', ref: 'Mateusza 23', passage: 'prophets' },
                { name: 'Na dzień męczennika', text: 'Prześladowania', ref: 'Łukasza 21', passage: 'persecution' },
                { name: 'Na dzień papieża lub patriarchy', text: 'Dobry Pasterz', ref: 'Jana 10', passage: 'shepherd' },
                { name: 'Na dzień świętej kobiety', text: 'Mądre panny', ref: 'Mateusza 25', passage: 'virgins' },
            ],
            openLabel: 'Czytaj',
            paragraphs: [
                'Święci tego samego rodzaju mają zatem wspólne czytania[^martyrs]. Dlatego te same czytania powtarzają się kilka razy w roku. Wielkie święta i niektórzy wielcy święci mają własne czytania.',
            ],
        },

        sundays: {
            heading: 'Niedziele: dzieło Trójcy Świętej',
            paragraphs: [
                'W niedziele czytania nie są związane ze świętym danego dnia, lecz z tematem miesiąca koptyjskiego.',
                'Przez kolejne niedziele roku czytania skupiają się wokół jednego tematu: dzieła Trójcy Świętej dla naszego zbawienia. Każdy miesiąc koptyjski ukazuje jeden aspekt tego dzieła.',
                'Na przykład Kiahk to miesiąc, który prowadzi do Bożego Narodzenia. Jego tematem jest Wcielenie. Ewangelie czterech niedziel tego miesiąca opowiadają o zwiastowaniu Zachariaszowi, Zwiastowaniu Maryi, Nawiedzeniu i narodzeniu Jana Chrzciciela.',
            ],
            more: {
                title: 'Niedziele miesiąc po miesiącu',
                intro: 'Temat każdego miesiąca i jego niedzielne Ewangelie.',
                items: [
                    {
                        name: 'Thout',
                        text: [
                            'Miłość Boga Ojca do ludzi.',
                            'Ewangelie: Jan Chrzciciel (Łukasza 7:28–35), największe przykazanie (Łukasza 10:21–28), Zacheusz (Łukasza 19:1–10) i grzesznica, której przebaczono (Łukasza 7:36–50).',
                        ],
                    },
                    {
                        name: 'Babah',
                        text: [
                            'Moc Chrystusa, objawiona w Jego cudach.',
                            'Ewangelie: paralityk spuszczony przez dach (Marka 2:1–12), cudowny połów ryb (Łukasza 5:1–11), uzdrowienie niewidomego i niemego człowieka (Mateusza 12:22–28) oraz wskrzeszenie syna wdowy w Nain (Łukasza 7:11–17).',
                        ],
                    },
                    {
                        name: 'Hatour',
                        text: [
                            'Jego nauczanie i dzieła.',
                            'Ewangelie: przypowieść o siewcy, dwukrotnie (Łukasza 8:4–15 i Mateusza 13:1–9), cena pójścia za Nim (Łukasza 14:25–35) i bogaty młodzieniec (Marka 10:17–31).',
                        ],
                    },
                    {
                        name: 'Kiahk',
                        text: [
                            'Wcielenie.',
                            'Ewangelie z pierwszego rozdziału Ewangelii św. Łukasza: zwiastowanie Zachariaszowi, Zwiastowanie Maryi, Nawiedzenie i narodzenie Jana Chrzciciela.',
                        ],
                    },
                    {
                        name: 'Toubah',
                        text: [
                            'Zbawienie ofiarowane wszystkim narodom.',
                            'Ewangelie: ucieczka do Egiptu (Mateusza 2:13–23), znak Jonasza (Łukasza 11:27–36), świadectwo Jana Chrzciciela (Jana 3:22–36) i niewidomy od urodzenia (Jana 9:1–38).',
                        ],
                    },
                    {
                        name: 'Amshir',
                        text: [
                            'Chrystus, chleb życia.',
                            'Ewangelie: Jana 6 (nakarmienie pięciu tysięcy ludzi i chleb życia) w trzy niedziele oraz Zacheusz (Łukasza 19:1–10).',
                        ],
                    },
                    { name: 'Baramhat, Baramoudah', text: 'Wielki Post, Wielki Tydzień lub Święte Pięćdziesiąt Dni (zob. następną część).' },
                    {
                        name: 'Bashans',
                        text: [
                            'Pierwsze niedziele tego miesiąca przypadają w okresie Świętych Pięćdziesięciu Dni.',
                            'Ewangelie ostatnich niedziel: miłosierny Samarytanin (Łukasza 10:25–37) i kuszenie Chrystusa (Łukasza 4:1–13).',
                        ],
                    },
                    {
                        name: 'Baounah',
                        text: [
                            'Dar Ducha Świętego.',
                            'Ewangelie: Ojciec, który daje Ducha Świętego tym, którzy Go proszą (Łukasza 11:1–13), paralityk, któremu odpuszczono grzechy (Łukasza 5:17–26), grzech przeciwko Duchowi Świętemu (Mateusza 12:22–37) i „miłujcie waszych nieprzyjaciół” (Łukasza 6:27–38).',
                        ],
                    },
                    {
                        name: 'Abib',
                        text: [
                            'Pomoc Pana dla Jego apostołów.',
                            'Ewangelie: rozesłanie siedemdziesięciu uczniów (Łukasza 10:1–20), „kto jest największy?” (Mateusza 18:1–9), nakarmienie pięciu tysięcy ludzi (Łukasza 9:10–17) i wskrzeszenie Łazarza (Jana 11:1–45).',
                        ],
                    },
                    {
                        name: 'Misra',
                        text: [
                            'Jego troska o swój Kościół.',
                            'Ewangelie: przewrotni rolnicy (Łukasza 20:9–19), powołanie Lewiego (Łukasza 5:27–39), dom wewnętrznie skłócony (Marka 3:22–35) i koniec czasów (Marka 13:3–37).',
                        ],
                    },
                    {
                        name: 'Nasie',
                        text: [
                            'Powtórne przyjście Chrystusa.',
                            'Ewangelia: znaki końca (Mateusza 24:3–35).',
                        ],
                    },
                ],
            },
        },

        seasons: {
            heading: 'Okresy, które przesuwają się z Wielkanocą',
            paragraphs: [
                'Kalendarz koptyjski jest stały, ale Wielkanoc nie: jej datę oblicza się co roku i przypada ona między 4 kwietnia a 8 maja. Kilka okresów liczy się od Wielkanocy, dlatego co roku przesuwają się razem z nią:',
            ],
            items: [
                { name: 'Post Niniwy', text: 'Trzy dni postu, dwa tygodnie przed rozpoczęciem Wielkiego Postu.' },
                { name: 'Wielki Post', text: 'Tydzień przygotowawczy, a potem czterdzieści dni postu. Zaczyna się między początkiem lutego a połową marca.' },
                { name: 'Wielki Tydzień', text: 'Tydzień przed Wielkanocą.' },
                { name: 'Święte Pięćdziesiąt Dni', text: 'Od Wielkanocy do Pięćdziesiątnicy, która przypada między 23 maja a 26 czerwca.' },
            ],
            more: {
                title: 'Co się czyta w tych okresach',
                items: [
                    { name: 'Post Niniwy', text: 'Księga Jonasza, czytana w ciągu tych trzech dni.' },
                    { name: 'Dni powszednie Wielkiego Postu', text: 'Od poniedziałku do piątku nie ma wieczornego ofiarowania kadzidła, a na Jutrzni Ewangelię poprzedzają czytania z proroków Starego Testamentu.' },
                    {
                        name: 'Niedziele Wielkiego Postu',
                        list: true,
                        text: [
                            'Niedziela przed Wielkim Postem: jałmużna, modlitwa i post w ukryciu (Mateusza 6:1–18).',
                            'I niedziela: skarby w niebie (Mateusza 6:19–33).',
                            'II niedziela: kuszenie Chrystusa (Mateusza 4:1–11).',
                            'III niedziela: syn marnotrawny (Łukasza 15:11–32).',
                            'IV niedziela: Samarytanka (Jana 4:1–42).',
                            'V niedziela: paralityk przy sadzawce Betesda (Jana 5:1–18).',
                            'VI niedziela: niewidomy od urodzenia (Jana 9:1–41).',
                        ],
                    },
                    { name: 'Sobota Łazarza', text: 'Dzień przed Niedzielą Palmową: wskrzeszenie Łazarza (Jana 11:1–45).' },
                    { name: 'Niedziela Palmowa', text: 'Wjazd do Jerozolimy, czytany według wszystkich czterech Ewangelii.' },
                    { name: 'Wielki Tydzień', text: 'Czytania na każdą godzinę modlitwy dnia i nocy: Pierwszą, Trzecią, Szóstą, Dziewiątą i Jedenastą Godzinę, a w piątek także Dwunastą. Każda godzina zaczyna się od czytań ze Starego Testamentu.' },
                    {
                        joined: true,
                        name: 'Dzień po dniu',
                        list: true,
                        text: [
                            'Poniedziałek: figowiec i oczyszczenie świątyni.',
                            'Wtorek: przypowieści i przestrogi o końcu czasów.',
                            'Środa: namaszczenie w Betanii i umowa Judasza z arcykapłanami.',
                            'Czwartek: Ostatnia Wieczerza i mowa pożegnalna Chrystusa.',
                            'Piątek: Męka Pańska według wszystkich czterech Ewangelii.',
                            'Sobota: Zmartwychwstanie (Mateusza 28:1–20).',
                        ],
                    },
                    {
                        name: 'Niedziele Świętych Pięćdziesięciu Dni',
                        list: true,
                        lead: 'Na Liturgii w każdą niedzielę czyta się Ewangelię według św. Jana:',
                        text: [
                            'Niedziela Wielkanocna: pusty grób (Jana 20:1–18).',
                            'I niedziela: Tomasz (Jana 20:19–31).',
                            'II niedziela: chleb życia (Jana 6:35–45).',
                            'III niedziela: woda żywa (Jana 4:1–42).',
                            'IV niedziela: światłość świata (Jana 12:35–50).',
                            'V niedziela: droga, prawda i życie (Jana 14:1–11).',
                            'VI niedziela: „Ja zwyciężyłem świat” (Jana 16:23–33).',
                        ],
                    },
                    {
                        name: 'Wniebowstąpienie, Pięćdziesiątnica',
                        list: true,
                        text: [
                            'Wniebowstąpienie, 40. dnia: Łukasza 24:36–53.',
                            'Pięćdziesiątnica, 50. dnia: przyjście Pocieszyciela (Jana 15:26–16:15).',
                        ],
                    },
                ],
            },
        },
    },

    footnotes: {
        heading: 'Przypisy',
        label: 'Przypis',
        backLabel: 'Powrót do tekstu',
        items: [
            { id: 'nasie', text: 'Co cztery lata Nasie ma sześć dni: gdy następny luty ma 29 dni.' },
            { id: 'thout', text: 'Co cztery lata 1 Thout przypada na 12 września, po Nasie, który ma sześć dni.' },
            { id: 'martyrs', text: 'Jeden rodzaj świętych może mieć kilka zestawów czytań: tak jest na przykład w przypadku męczenników.' },
        ],
    },

    footer: {
        readings: 'Dzisiejsze czytania',
        contact: 'Kontakt',
        getApp: 'Pobierz aplikację:',
        sourceCode: 'Kod źródłowy',
    },
}

export default content
