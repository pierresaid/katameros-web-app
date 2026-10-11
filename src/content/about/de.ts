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
            'In der Kirche liegt der Katameros auf dem Lesepult, aufgeschlagen bei den Lesungen des Tages. In den Gottesdiensten des Tages lesen die Lektoren, die Diakone und der Priester die Abschnitte, die der Katameros angibt. Die koptisch-orthodoxen Gemeinden in aller Welt folgen demselben Lektionar.',
        ],
    },

    contents: {
        heading: 'Was der Katameros enthält',
        intro: 'Für die meisten Tage gibt der Katameros die Lesungen von drei Gottesdiensten an. Der liturgische Tag beginnt bei Sonnenuntergang. Deshalb beginnen die Lesungen am Vorabend mit dem Abendweihrauchopfer, am Morgen folgt das Morgenweihrauchopfer und danach die heilige Liturgie (die Eucharistiefeier). Das Abend- und das Morgenweihrauchopfer werden auch Vesper und Matutin genannt.',
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
            { name: 'Synaxär', text: 'Keine Bibellesung, sondern eine Lesung aus einem eigenen Buch: das Leben der Heiligen, deren an diesem Tag gedacht wird.' },
            { name: 'Psalm und Evangelium', text: 'Einige Verse eines Psalms, die unmittelbar vor dem Evangelium gesungen werden. Die Psalmen werden als Prophezeiungen über Christus gelesen, deshalb kündigt der Psalm das Evangelium an. Das Evangelium ist die wichtigste Lesung des Tages, und die anderen Lesungen beziehen sich meist darauf.' },
        ],
        note: 'Lesungen aus den Propheten des Alten Testaments kommen hinzu, vor allem in der Großen Fastenzeit und in der Karwoche.',
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
        ],
    },

    choice: {
        heading: 'Wie die Lesungen ausgewählt werden',
        intro: 'Die Lesungen eines Tages sind nicht zufällig: Sie werden so ausgewählt, dass sie zu dem passen, was die Kirche an diesem Tag feiert. Drei Dinge entscheiden darüber: der Heilige oder das Fest des Tages im koptischen Kalender, der Sonntag und sein Thema sowie die Zeiten, die sich mit Ostern verschieben. Fallen sie auf denselben Tag, haben die Herrenfeste (die Feste Christi, zum Beispiel Weihnachten) und diese Zeiten Vorrang vor dem Sonntag. Der Sonntag hat Vorrang vor dem Heiligen des Tages.',

        weekdays: {
            heading: 'Wochentage: die Heiligen des Tages',
            paragraphs: [
                'Von Montag bis Samstag passen die Lesungen zu dem Heiligen oder dem Fest, dessen an diesem koptischen Datum im Synaxär gedacht wird. Oft zeigt schon das Evangelium allein, wessen Tag es ist: die getöteten Propheten (Matthäus 23) für einen Propheten, die Verfolgung (Lukas 21) für einen Märtyrer, der Gute Hirte (Johannes 10) für einen Papst oder Patriarchen, die klugen Jungfrauen (Matthäus 25) für eine heilige Frau.',
                'Doch das Buch der Wochentage hat nicht für jeden Tag des Jahres eigene Lesungen. Nur etwa 70 Tage haben eigens für sie festgelegte Lesungen. Alle anderen Tage übernehmen die Lesungen eines dieser Tage, an dem ein Heiliger derselben Art gefeiert wird: Ein Märtyrer erhält die Lesungen eines anderen Märtyrers, ein Bischof die eines anderen Bischofs, ein Mönch die eines großen Mönchs. Deshalb wiederholen sich dieselben Lesungen mehrmals im Jahr.',
                'Zum Beispiel werden die Lesungen des 22. Toubah für den heiligen Antonius, den Vater der Mönche, an acht weiteren Tagen wiederverwendet, meist an Gedenktagen von Mönchen.',
            ],
        },

        sundays: {
            heading: 'Sonntage: das Werk der Heiligen Dreifaltigkeit',
            paragraphs: [
                'Die Sonntage folgen nicht dem Heiligen des Tages. Nacheinander gelesen, erzählen die Sonntagslesungen des Jahres eine einzige Geschichte: das Werk der Heiligen Dreifaltigkeit für unser Heil. Jeder koptische Monat gibt seinen Sonntagen ein Thema innerhalb dieser Geschichte. Im Monat Kiahk zum Beispiel, der auf Weihnachten hinführt, erzählen die vier Sonntagsevangelien von der Menschwerdung: die Ankündigung an Zacharias, die Verkündigung an Maria, die Heimsuchung und die Geburt Johannes des Täufers.',
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
                notes: [
                    'An einem fünften Sonntag wird die Speisung der Fünftausend gelesen: von Thout bis Amshir die Lesungen des zweiten Sonntags im Amshir (Johannes 6:5–14), von Baramhat bis Misra eigene Lesungen (Lukas 9:12–17). Es gibt Ausnahmen, insbesondere am 29. eines Monats (außer im Toubah und Amshir) oder am 30. Kiahk.',
                    'Im Babah, im Hatour und von Bashans bis Misra handelt das Evangelium beim Morgenweihrauchopfer am Sonntag von der Auferstehung, wie sie der Reihe nach Matthäus, Markus, Lukas und Johannes erzählen.',
                ],
            },
        },

        seasons: {
            heading: 'Die Zeiten, die sich mit Ostern verschieben',
            paragraphs: [
                'Der koptische Kalender ist fest, Ostern aber nicht: Das Osterdatum wird jedes Jahr berechnet und liegt zwischen dem 4. April und dem 8. Mai. Mehrere Zeiten werden von Ostern aus gezählt, deshalb verschieben sie sich jedes Jahr mit dem Osterfest:',
            ],
            items: [
                { name: 'Fasten von Ninive', text: 'Drei Tage, zwei Wochen vor der Großen Fastenzeit.' },
                { name: 'Große Fastenzeit', text: 'Die Vorbereitungswoche und die vierzig Tage. Sie beginnt zwischen Anfang Februar und Mitte März.' },
                { name: 'Karwoche', text: 'Die Woche vor Ostern.' },
                { name: 'Heilige fünfzig Tage', text: 'Von Ostern bis Pfingsten, das zwischen dem 23. Mai und dem 26. Juni liegt.' },
            ],
            note: 'In diesen Wochen, etwa 15 im Jahr, kommen die Lesungen nicht aus den Büchern der Wochentage und der Sonntage, sondern aus den Büchern dieser Zeiten, nach Woche und Tag geordnet. Die Lesungen folgen der jeweiligen Zeit: In der Großen Fastenzeit werden an den Sonntagen die Versuchung Christi, der verlorene Sohn und die Samariterin gelesen; die Karwoche folgt Tag für Tag den letzten Tagen Christi. Nur wenige Herrenfeste, etwa das Fest des Kreuzes am 10. Baramhat, behalten ihre eigenen Lesungen.',
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
                notes: [
                    'Das Evangelium von der Samariterin wird an zwei Sonntagen gelesen: in der Großen Fastenzeit mit einem Psalm über die Suche nach dem Herrn (Psalm 105) und nach Ostern mit einem Psalm über den Segen des Herrn (Psalm 115).',
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
