import type { AboutContent } from './types'

const content: AboutContent = {
    title: 'Was ist der Katameros?',
    description: 'Was der Katameros ist: das Lektionar der koptisch-orthodoxen Kirche, seine fünf Bücher, der koptische Kalender und die Auswahl der Lesungen für jeden Tag.',
    lead: 'Der Katameros ist das Lektionar der koptisch-orthodoxen Kirche: das Buch, das für jeden Tag des Jahres angibt, welche Bibelabschnitte in der Kirche bei den täglichen Gottesdiensten gelesen werden.',

    name: {
        heading: 'Der Name',
        paragraphs: [
            'Der Name kommt vom griechischen *kata meros*, „in Teilen“: Das Buch ist in mehrere Teile gegliedert und bietet die Heilige Schrift Abschnitt für Abschnitt dar, Tag für Tag.',
        ],
    },

    church: {
        heading: 'In der Kirche gelesen',
        paragraphs: [
            'In der Kirche liegt das Lektionar auf dem Lesepult, aufgeschlagen bei den Lesungen des Tages. In den Gottesdiensten des Tages lesen die Lektoren, die Diakone und der Priester die Abschnitte, die es angibt. Die koptisch-orthodoxen Gemeinden in aller Welt folgen demselben Lektionar.',
        ],
    },

    contents: {
        heading: 'Was das Lektionar enthält',
        intro: 'An den meisten Tagen gibt das Lektionar die Lesungen von drei Gottesdiensten an. Für die Kirche beginnt der liturgische Tag bei Sonnenuntergang. Die Lesungen fangen deshalb am Vorabend mit dem Abendweihrauchopfer an. Dann folgen das Morgenweihrauchopfer und die heilige Liturgie (die Eucharistiefeier). Die beiden ersten Gottesdienste heißen auch kurz Abendweihrauch und Morgenweihrauch.',
        services: [
            { name: 'Abendweihrauchopfer', when: 'Am Vorabend', parts: ['Psalm und Evangelium'] },
            { name: 'Morgenweihrauchopfer', when: 'Am Morgen', parts: ['Psalm und Evangelium'] },
            { name: 'Die heilige Liturgie', when: 'Nach dem Morgenweihrauchopfer', parts: ['Paulusbrief', 'Katholikon', 'Apostelgeschichte', 'Synaxär', 'Psalm und Evangelium'] },
        ],
        readingsLabel: 'Die Lesungen der Liturgie',
        readings: [
            { name: 'Paulusbrief', text: 'Ein Abschnitt aus einem der Briefe des heiligen Paulus.' },
            { name: 'Katholikon', text: 'Ein Abschnitt aus den Briefen der heiligen Jakobus, Petrus, Johannes und Judas. „Katholikon“ kommt von „katholisch“, was „allgemein“ bedeutet: Die meisten dieser Briefe richten sich an die ganze Kirche und nicht an eine einzelne Ortskirche.' },
            { name: 'Apostelgeschichte', text: 'Ein Abschnitt aus der Apostelgeschichte. Diese Lesung heißt auch Praxis, griechisch für „Taten“.' },
            { name: 'Synaxär', text: 'Das Leben der Heiligen und Märtyrer, deren an diesem Tag gedacht wird, aus einem eigenen Buch gelesen.' },
            { name: 'Psalm und Evangelium', text: 'Einige Verse eines Psalms, die unmittelbar vor dem Evangelium gesungen werden. Das Evangelium ist die wichtigste Lesung des Tages, und die anderen Lesungen beziehen sich meist darauf.' },
        ],
    },

    books: {
        heading: 'Fünf Bücher',
        intro: 'Der Katameros wird in fünf Büchern gedruckt, die jeweils zu ihrer Zeit im Jahr verwendet werden:',
        items: [
            { name: 'Wochentage', text: 'Montag bis Samstag, nach den Heiligen und Festen des koptischen Kalenders.' },
            { name: 'Sonntage', text: 'Die Sonntage des Jahres, mit einem Thema für jeden Monat.' },
            { name: 'Große Fastenzeit', text: 'Die Vorbereitungswoche und die vierzig Tage, dazu das Fasten von Ninive.' },
            { name: 'Karwoche', text: 'Die Woche vor Ostern, mit Lesungen für jede ihrer Gebetsstunden. In der koptischen Kirche heißt diese Woche Pascha.' },
            { name: 'Heilige fünfzig Tage', text: 'Von Ostern bis Pfingsten.' },
        ],
    },

    calendar: {
        heading: 'Der koptische Kalender',
        paragraphs: [
            'Der Katameros folgt dem koptischen Kalender, dem Kalender der Kirche, der aus dem alten Ägypten überliefert ist. Das koptische Jahr hat 13 Monate: 12 Monate mit je 30 Tagen, dann einen kurzen Monat namens Nasie mit fünf Tagen (sechs, wenn der folgende Februar 29 Tage hat).',
            'Die Monate heißen Thout, Babah, Hatour, Kiahk, Toubah, Amshir, Baramhat, Baramoudah, Bashans, Baounah, Abib, Misra und Nasie. Das Jahr beginnt am 1. Thout, das ist der 11. September (der 12. September, wenn der folgende Februar 29 Tage hat).',
            'Die koptischen Jahre werden seit 284 gezählt, dem Jahr, in dem Diokletian Kaiser wurde. Diese Zeitrechnung heißt Ära der Märtyrer, zur Erinnerung an die vielen Christen, die während seiner Verfolgung getötet wurden.',
        ],
    },

    choice: {
        heading: 'Wie die Lesungen ausgewählt werden',
        intro: 'Die Lesungen eines Tages werden nicht zufällig ausgewählt. Sie folgen dem, was die Kirche an diesem Tag feiert. Drei Dinge bestimmen sie:',
        factors: [
            { name: 'Der Heilige oder das Fest des Tages im koptischen Kalender' },
            { name: 'Der Sonntag und sein Thema' },
            { name: 'Die Zeiten, die sich mit Ostern verschieben', detail: 'Fasten von Ninive, Große Fastenzeit, Karwoche, heilige fünfzig Tage' },
        ],
        priority: 'Fallen mehrere davon auf denselben Tag, haben die Herrenfeste (zum Beispiel Weihnachten) und die großen Zeiten rund um Ostern Vorrang vor dem Sonntag. Der Sonntag hat Vorrang vor dem Heiligen des Tages.',

        weekdays: {
            heading: 'Wochentage: die Heiligen des Tages',
            intro: 'Von Montag bis Samstag passen die Lesungen zu dem Heiligen oder dem Fest, dessen das Synaxär an diesem koptischen Datum gedenkt. Oft zeigt schon das Evangelium, wessen Tag es ist:',
            gospels: [
                { name: 'Für einen Propheten', text: 'Die getöteten Propheten', ref: 'Matthäus 23', passage: 'prophets' },
                { name: 'Für einen Märtyrer', text: 'Die Verfolgung', ref: 'Lukas 21', passage: 'persecution' },
                { name: 'Für einen Papst oder Patriarchen', text: 'Der Gute Hirte', ref: 'Johannes 10', passage: 'shepherd' },
                { name: 'Für eine heilige Frau', text: 'Die klugen Jungfrauen', ref: 'Matthäus 25', passage: 'virgins' },
            ],
            openLabel: 'Lesen',
            paragraphs: [
                'Im Buch der Wochentage hat nicht jeder Tag des Jahres eigene Lesungen: Das gilt nur für etwa 70 Tage. Alle anderen Tage übernehmen die Lesungen eines Heiligen derselben Art, dessen Fest auf einen dieser Tage fällt: Ein Märtyrer erhält die Lesungen eines anderen Märtyrers, ein Bischof die eines anderen Bischofs, ein Mönch die eines großen Mönchs. Deshalb wiederholen sich dieselben Lesungen mehrmals im Jahr.',
                'Zum Beispiel wird der heilige Antonius, der Vater der Mönche, am 22. Toubah gefeiert. Seine Lesungen werden an acht weiteren Tagen wiederholt, meist an Gedenktagen von Mönchen.',
            ],
        },

        sundays: {
            heading: 'Sonntage: das Werk der Heiligen Dreifaltigkeit',
            paragraphs: [
                'Sonntags folgen die Lesungen nicht dem Heiligen des Tages, sondern dem Thema des koptischen Monats.',
                'Über die Sonntage des Jahres hinweg kreisen die Lesungen um einen einzigen Gegenstand: das Werk der Heiligen Dreifaltigkeit für unser Heil. Jeder koptische Monat zeigt einen Aspekt dieses Werkes.',
                'Zum Beispiel ist Kiahk der Monat, der auf Weihnachten hinführt. Sein Thema ist die Menschwerdung. Die Evangelien seiner vier Sonntage erzählen von der Ankündigung an Zacharias, der Verkündigung an Maria, der Heimsuchung und der Geburt Johannes des Täufers.',
            ],
            more: {
                title: 'Die Sonntage, Monat für Monat',
                intro: 'Das Thema jedes Monats und seine Sonntagsevangelien.',
                items: [
                    {
                        name: 'Thout',
                        text: [
                            'Die Liebe Gottes des Vaters zu den Menschen.',
                            'Evangelien: Johannes der Täufer (Lukas 7:28–35), das wichtigste Gebot (Lukas 10:21–28), Zachäus (Lukas 19:1–10) und die Sünderin, der vergeben wird (Lukas 7:36–50).',
                        ],
                    },
                    {
                        name: 'Babah',
                        text: [
                            'Die Macht Christi, die sich in seinen Wundern zeigt.',
                            'Evangelien: der Gelähmte, der durch das Dach hinabgelassen wird (Markus 2:1–12), der wunderbare Fischfang (Lukas 5:1–11), die Heilung eines blinden und stummen Mannes (Matthäus 12:22–28) und die Auferweckung des Sohnes der Witwe in Nain (Lukas 7:11–17).',
                        ],
                    },
                    {
                        name: 'Hatour',
                        text: [
                            'Seine Lehre und seine Werke.',
                            'Evangelien: das Gleichnis vom Sämann, zweimal (Lukas 8:4–15 und Matthäus 13:1–9), der Preis der Nachfolge (Lukas 14:25–35) und der reiche junge Mann (Markus 10:17–31).',
                        ],
                    },
                    {
                        name: 'Kiahk',
                        text: [
                            'Die Menschwerdung.',
                            'Evangelien aus dem ersten Kapitel des Lukasevangeliums: die Ankündigung an Zacharias, die Verkündigung an Maria, die Heimsuchung und die Geburt Johannes des Täufers.',
                        ],
                    },
                    {
                        name: 'Toubah',
                        text: [
                            'Das Heil, das allen Völkern angeboten wird.',
                            'Evangelien: die Flucht nach Ägypten (Matthäus 2:13–23), das Zeichen des Jona (Lukas 11:27–36), das Zeugnis Johannes des Täufers (Johannes 3:22–36) und der Blindgeborene (Johannes 9:1–38).',
                        ],
                    },
                    {
                        name: 'Amshir',
                        text: [
                            'Christus, das Brot des Lebens.',
                            'Evangelien: an drei Sonntagen Johannes 6 (die Speisung der Fünftausend und das Brot des Lebens), außerdem Zachäus (Lukas 19:1–10).',
                        ],
                    },
                    { name: 'Baramhat, Baramoudah', text: 'Die Große Fastenzeit, die Karwoche oder die heiligen fünfzig Tage (siehe den nächsten Abschnitt).' },
                    {
                        name: 'Bashans',
                        text: [
                            'Die ersten Sonntage des Monats fallen in die heiligen fünfzig Tage.',
                            'Evangelien der letzten Sonntage: der barmherzige Samariter (Lukas 10:25–37) und die Versuchung Christi (Lukas 4:1–13).',
                        ],
                    },
                    {
                        name: 'Baounah',
                        text: [
                            'Die Gabe des Heiligen Geistes.',
                            'Evangelien: der Vater, der denen den Heiligen Geist gibt, die ihn bitten (Lukas 11:1–13), der Gelähmte, dem vergeben wird (Lukas 5:17–26), die Sünde gegen den Heiligen Geist (Matthäus 12:22–37) und „Liebt eure Feinde“ (Lukas 6:27–38).',
                        ],
                    },
                    {
                        name: 'Abib',
                        text: [
                            'Die Hilfe des Herrn für seine Apostel.',
                            'Evangelien: die Aussendung der Siebzig (Lukas 10:1–20), „Wer ist der Größte?“ (Matthäus 18:1–9), die Speisung der Fünftausend (Lukas 9:10–17) und die Auferweckung des Lazarus (Johannes 11:1–45).',
                        ],
                    },
                    {
                        name: 'Misra',
                        text: [
                            'Seine Sorge für seine Kirche.',
                            'Evangelien: die bösen Winzer (Lukas 20:9–19), die Berufung des Levi (Lukas 5:27–39), das in sich gespaltene Haus (Markus 3:22–35) und das Ende der Zeiten (Markus 13:3–37).',
                        ],
                    },
                    {
                        name: 'Nasie',
                        text: [
                            'Die Wiederkunft Christi.',
                            'Evangelium: die Zeichen des Endes (Matthäus 24:3–35).',
                        ],
                    },
                ],
            },
        },

        seasons: {
            heading: 'Die Zeiten, die sich mit Ostern verschieben',
            paragraphs: [
                'Der koptische Kalender ist fest, Ostern aber nicht: Das Osterdatum wird jedes Jahr berechnet und liegt zwischen dem 4. April und dem 8. Mai. Mehrere Zeiten werden von Ostern aus gezählt, deshalb verschieben sie sich jedes Jahr mit dem Osterfest:',
            ],
            items: [
                { name: 'Fasten von Ninive', text: 'Drei Fastentage, zwei Wochen vor Beginn der Großen Fastenzeit.' },
                { name: 'Große Fastenzeit', text: 'Eine Vorbereitungswoche, dann die vierzig Tage. Sie beginnt zwischen Anfang Februar und Mitte März.' },
                { name: 'Karwoche', text: 'Die Woche vor Ostern.' },
                { name: 'Heilige fünfzig Tage', text: 'Von Ostern bis Pfingsten, das zwischen dem 23. Mai und dem 26. Juni liegt.' },
            ],
            after: [
                'In diesen Wochen, etwa 15 im Jahr, kommen die Lesungen nicht aus den Büchern der Wochentage und der Sonntage, sondern aus den Büchern dieser Zeiten, nach Woche und Tag geordnet.',
                'Die Lesungen folgen der jeweiligen Zeit. In der Großen Fastenzeit werden an den Sonntagen die Versuchung Christi, der verlorene Sohn und die Samariterin gelesen. Die Karwoche folgt Tag für Tag den letzten Tagen Christi.',
                'Nur wenige Herrenfeste, etwa das Fest des Kreuzes am 10. Baramhat, behalten ihre eigenen Lesungen.',
            ],
            more: {
                title: 'Was in diesen Zeiten gelesen wird',
                items: [
                    { name: 'Fasten von Ninive', text: 'Das Buch Jona, verteilt auf die drei Tage.' },
                    { name: 'Wochentage der Großen Fastenzeit', text: 'Von Montag bis Freitag gibt es kein Abendweihrauchopfer, und beim Morgenweihrauchopfer gehen dem Evangelium Lesungen aus den Propheten des Alten Testaments voraus.' },
                    {
                        name: 'Sonntage der Großen Fastenzeit',
                        list: true,
                        text: [
                            'Sonntag vor der Großen Fastenzeit: Almosen, Gebet und Fasten im Verborgenen (Matthäus 6:1–18).',
                            '1. Sonntag: Schätze im Himmel (Matthäus 6:19–33).',
                            '2. Sonntag: die Versuchung Christi (Matthäus 4:1–11).',
                            '3. Sonntag: der verlorene Sohn (Lukas 15:11–32).',
                            '4. Sonntag: die Samariterin (Johannes 4:1–42).',
                            '5. Sonntag: der Gelähmte von Betesda (Johannes 5:1–18).',
                            '6. Sonntag: der Blindgeborene (Johannes 9:1–41).',
                        ],
                    },
                    { name: 'Lazarus-Samstag', text: 'Der Tag vor dem Palmsonntag: die Auferweckung des Lazarus (Johannes 11:1–45).' },
                    { name: 'Palmsonntag', text: 'Der Einzug in Jerusalem, gelesen aus allen vier Evangelien.' },
                    { name: 'Karwoche', text: 'Lesungen für jede Gebetsstunde des Tages und der Nacht: die Erste, Dritte, Sechste, Neunte und Elfte Stunde, am Freitag zusätzlich eine Zwölfte Stunde. Jede Stunde beginnt mit dem Alten Testament.' },
                    {
                        joined: true,
                        name: 'Tag für Tag',
                        list: true,
                        text: [
                            'Montag: der Feigenbaum und die Tempelreinigung.',
                            'Dienstag: die Gleichnisse und die Warnungen vor dem Ende der Zeiten.',
                            'Mittwoch: die Salbung in Betanien und die Abmachung des Judas mit den Hohepriestern.',
                            'Donnerstag: das Letzte Abendmahl und die Abschiedsreden Christi.',
                            'Freitag: die Passion, aus allen vier Evangelien.',
                            'Samstag: die Auferstehung (Matthäus 28).',
                        ],
                    },
                    {
                        name: 'Sonntage der heiligen fünfzig Tage',
                        list: true,
                        lead: 'In der Liturgie stammt das Evangelium jedes Sonntags aus dem Johannesevangelium:',
                        text: [
                            'Ostersonntag: das leere Grab (Johannes 20:1–18).',
                            '1. Sonntag: Thomas (Johannes 20:19–31).',
                            '2. Sonntag: das Brot des Lebens (Johannes 6:35–45).',
                            '3. Sonntag: das lebendige Wasser (Johannes 4:1–42).',
                            '4. Sonntag: das Licht der Welt (Johannes 12:35–50).',
                            '5. Sonntag: der Weg, die Wahrheit und das Leben (Johannes 14:1–11).',
                            '6. Sonntag: „Ich habe die Welt besiegt“ (Johannes 16:23–33).',
                        ],
                    },
                    {
                        name: 'Himmelfahrt, Pfingsten',
                        list: true,
                        text: [
                            'Die Himmelfahrt, am 40. Tag: Lukas 24:36–53.',
                            'Pfingsten, am 50. Tag: das Kommen des Beistands (Johannes 15:26–16:15).',
                        ],
                    },
                ],
            },
        },
    },

    footer: {
        readings: 'Lesungen von heute',
        contact: 'Kontakt',
        getApp: 'App herunterladen:',
        sourceCode: 'Quellcode',
    },
}

export default content
