import type { AboutContent } from './types'

const content: AboutContent = {
    title: 'What is the Katameros?',
    description: 'What the Katameros is: the lectionary of the Coptic Orthodox Church, its five books, the Coptic calendar, and how each day’s readings are chosen.',
    lead: 'The Katameros is the lectionary of the Coptic Orthodox Church: the book that lists the Bible passages read in church at the daily services, on every day of the year.',

    name: {
        heading: 'The name',
        paragraphs: [
            'The name comes from the Greek *kata meros*, “in parts”: the Bible is read in passages, chosen for each day.',
        ],
    },

    church: {
        heading: 'Read in church',
        paragraphs: [
            'In church, the lectionary sits on the lectern (the reading stand), open at the day’s readings. At the day’s services, the readers, the deacons and the priest read the passages it lists. Coptic Orthodox churches around the world follow this same lectionary.',
        ],
    },

    contents: {
        heading: 'What it contains',
        intro: 'On most days, the lectionary gives the readings of three services. For the Church, the liturgical day begins at sunset. So the readings start the evening before, with Vespers. Then come Matins and the Liturgy (the Eucharist). Vespers and Matins are also called the evening and morning Raising of Incense.',
        services: [
            { name: 'Vespers', when: 'The evening before', parts: ['Psalm & Gospel'] },
            { name: 'Matins', when: 'In the morning', parts: ['Psalm & Gospel'] },
            { name: 'Liturgy', when: 'After Matins', parts: ['Pauline Epistle', 'Catholic Epistle', 'Acts of the Apostles', 'Synaxarium', 'Psalm & Gospel'] },
        ],
        readingsLabel: 'The readings of the Liturgy',
        readings: [
            { name: 'Pauline Epistle', text: 'A passage from one of the letters of St. Paul.' },
            { name: 'Catholic Epistle', text: 'A passage from the letters of St. James, St. Peter, St. John or St. Jude. “Catholic” means universal: most of these letters are addressed to the whole Church rather than to one local church.' },
            { name: 'Acts of the Apostles', text: 'A passage from the book of Acts. This reading is also called the Praxis, Greek for “Acts”.' },
            { name: 'Synaxarium', text: 'The lives of the saints and martyrs commemorated that day, read from a book of its own.' },
            { name: 'Psalm & Gospel', text: 'A few verses of a psalm, chanted just before the Gospel. The Gospel is the main reading of the day, and the other readings usually relate to it.' },
        ],
    },

    books: {
        heading: 'Five books',
        intro: 'The Katameros is divided into five books. Which one is read depends on the day. The first two are used all year round, except during the great seasons around Easter, which have their own books:',
        items: [
            { name: 'Weekdays', text: 'Monday to Saturday, following the saints and feasts of the Coptic calendar.' },
            { name: 'Sundays', text: 'The Sundays of the year, with a theme for each month.' },
            { name: 'Great Lent', text: 'The preparation week and the Forty Days, as well as the Fast of Nineveh.' },
            { name: 'Holy Week', text: 'The week before Easter, with readings for each of its prayer hours. In the Coptic Church, this week is called Pascha.' },
            { name: 'Holy Fifty Days', text: 'From Easter to Pentecost.' },
        ],
    },

    calendar: {
        heading: 'The Coptic calendar',
        paragraphs: [
            'The Katameros follows the Coptic calendar, the Church’s calendar inherited from ancient Egypt. The Coptic year has 13 months: 12 months of 30 days, then a short month called Nasie, with five days.[^nasie]',
            'The months are Thout, Babah, Hatour, Kiahk, Toubah, Amshir, Baramhat, Baramoudah, Bashans, Baounah, Abib, Misra and Nasie. The year begins on 1 Thout, which is September 11.[^thout]',
            'Coptic years are counted from 284, when Diocletian became emperor. This era is called the Era of the Martyrs, in memory of the many Christians killed in his persecution.',
        ],
    },

    choice: {
        heading: 'How the readings are chosen',
        intro: 'The readings of a day are not chosen at random. They follow what the Church celebrates that day. Three things decide them:',
        factors: [
            { name: 'The saint or feast of the day in the Coptic calendar' },
            { name: 'The Sunday and its theme' },
            { name: 'The seasons that move with Easter', detail: 'the Fast of Nineveh, Great Lent, Holy Week, the Holy Fifty Days' },
        ],
        priority: 'When several fall on the same day, the feasts of the Lord (such as the Nativity) and the great seasons around Easter take priority over the Sunday. The Sunday takes priority over the saint of the day.',

        weekdays: {
            heading: 'Weekdays: the saints of the day',
            intro: [
                'From Monday to Saturday, the readings are tied to the saint of the day, the one the Synaxarium commemorates on that Coptic date.',
                'For example, on 3 Abib the Church commemorates St. Cyril of Alexandria, a pope. At the Liturgy, the Gospel of the Good Shepherd is read: “I am the good shepherd. The good shepherd gives His life for the sheep” (John 10:11). The pope is the shepherd of his Church.',
                'So each kind of saint has its own readings. For the Liturgy Gospel:',
            ],
            gospels: [
                { name: 'For a prophet', text: 'The prophets who were killed', ref: 'Matthew 23', passage: 'prophets' },
                { name: 'For a martyr', text: 'Persecution', ref: 'Luke 21', passage: 'persecution' },
                { name: 'For a pope or a patriarch', text: 'The Good Shepherd', ref: 'John 10', passage: 'shepherd' },
                { name: 'For a holy woman', text: 'The wise virgins', ref: 'Matthew 25', passage: 'virgins' },
            ],
            openLabel: 'Read',
            paragraphs: [
                'The readings are therefore the same for all saints of the same kind.[^martyrs] For Moses, Isaiah or Jeremiah, the same Gospel is read: the one about the prophets who were killed (Matthew 23). This is why the same readings come back several times a year. The great feasts and a few great saints have readings of their own.',
            ],
        },

        sundays: {
            heading: 'Sundays: the work of the Holy Trinity',
            paragraphs: [
                'On Sundays, the readings do not follow the saint of the day, but the theme of the Coptic month.',
                'Through the Sundays of the year, the readings revolve around a single subject: the work of the Holy Trinity for our salvation. Each Coptic month shows one aspect of it.',
                'For example, Kiahk is the month that leads to the Nativity. Its theme is the Incarnation. The Gospels of its four Sundays tell of the annunciation to Zechariah, the Annunciation to Mary, the Visitation and the birth of John the Baptist.',
            ],
            more: {
                title: 'The Sundays, month by month',
                intro: 'The theme of each month and its Sunday Gospels.',
                items: [
                    {
                        name: 'Thout',
                        text: [
                            'The love of God the Father for mankind.',
                            'Gospels: John the Baptist (Luke 7:28–35), the great commandment (Luke 10:21–28), Zacchaeus (Luke 19:1–10) and the sinful woman forgiven (Luke 7:36–50).',
                        ],
                    },
                    {
                        name: 'Babah',
                        text: [
                            'The power of Christ, shown in His miracles.',
                            'Gospels: the paralytic let down through the roof (Mark 2:1–12), the miraculous catch of fish (Luke 5:1–11), a blind and mute man healed (Matthew 12:22–28) and the widow’s son raised at Nain (Luke 7:11–17).',
                        ],
                    },
                    {
                        name: 'Hatour',
                        text: [
                            'His teaching and works.',
                            'Gospels: the parable of the sower, twice (Luke 8:4–15 and Matthew 13:1–9), the cost of following Him (Luke 14:25–35) and the rich young man (Mark 10:17–31).',
                        ],
                    },
                    {
                        name: 'Kiahk',
                        text: [
                            'The Incarnation.',
                            'Gospels from the first chapter of St. Luke: the annunciation to Zechariah, the Annunciation to Mary, the Visitation and the birth of John the Baptist.',
                        ],
                    },
                    {
                        name: 'Toubah',
                        text: [
                            'Salvation offered to all nations.',
                            'Gospels: the flight into Egypt (Matthew 2:13–23), the sign of Jonah (Luke 11:27–36), John the Baptist’s witness (John 3:22–36) and the man born blind (John 9:1–38).',
                        ],
                    },
                    {
                        name: 'Amshir',
                        text: [
                            'Christ, the bread of life.',
                            'Gospels: John 6 (the feeding of the five thousand and the bread of life) on three Sundays, and Zacchaeus (Luke 19:1–10).',
                        ],
                    },
                    { name: 'Baramhat, Baramoudah', text: 'Great Lent, Holy Week or the Holy Fifty Days (see the next section).' },
                    {
                        name: 'Bashans',
                        text: [
                            'Its first Sundays fall in the Holy Fifty Days.',
                            'Gospels of the last Sundays: the Good Samaritan (Luke 10:25–37) and the temptation of Christ (Luke 4:1–13).',
                        ],
                    },
                    {
                        name: 'Baounah',
                        text: [
                            'The gift of the Holy Spirit.',
                            'Gospels: the Father who gives the Holy Spirit to those who ask (Luke 11:1–13), the paralytic forgiven (Luke 5:17–26), the sin against the Holy Spirit (Matthew 12:22–37) and “love your enemies” (Luke 6:27–38).',
                        ],
                    },
                    {
                        name: 'Abib',
                        text: [
                            'The Lord’s help to His apostles.',
                            'Gospels: the sending of the Seventy (Luke 10:1–20), “who is the greatest?” (Matthew 18:1–9), the feeding of the five thousand (Luke 9:10–17) and the raising of Lazarus (John 11:1–45).',
                        ],
                    },
                    {
                        name: 'Misra',
                        text: [
                            'His care for His Church.',
                            'Gospels: the wicked vinedressers (Luke 20:9–19), the call of Levi (Luke 5:27–39), the house divided (Mark 3:22–35) and the end of the age (Mark 13:3–37).',
                        ],
                    },
                    {
                        name: 'Nasie',
                        text: [
                            'The Second Coming.',
                            'Gospel: the signs of the end (Matthew 24:3–35).',
                        ],
                    },
                ],
            },
        },

        seasons: {
            heading: 'The seasons that move with Easter',
            paragraphs: [
                'The Coptic calendar is fixed, but Easter is not: its date is calculated each year, and it falls between April 4 and May 8. Several periods are counted from Easter, so they move with it every year:',
            ],
            items: [
                { name: 'Fast of Nineveh', text: 'Three days of fasting, two weeks before the start of Great Lent.' },
                { name: 'Great Lent', text: 'A preparation week, then the Forty Days. It begins between early February and mid-March.' },
                { name: 'Holy Week', text: 'The week before Easter.' },
                { name: 'Holy Fifty Days', text: 'From Easter to Pentecost, which falls between May 23 and June 26.' },
            ],
            more: {
                title: 'What these seasons read',
                items: [
                    { name: 'Fast of Nineveh', text: 'The book of Jonah, read over the three days.' },
                    { name: 'Weekdays of Great Lent', text: 'From Monday to Friday, there is no evening Raising of Incense, and at Matins, readings from the Old Testament prophets come before the Gospel.' },
                    {
                        name: 'Sundays of Great Lent',
                        list: true,
                        text: [
                            'Sunday before Great Lent: giving, prayer and fasting in secret (Matthew 6:1–18).',
                            '1st Sunday: treasures in heaven (Matthew 6:19–33).',
                            '2nd Sunday: the temptation of Christ (Matthew 4:1–11).',
                            '3rd Sunday: the prodigal son (Luke 15:11–32).',
                            '4th Sunday: the Samaritan woman (John 4:1–42).',
                            '5th Sunday: the paralytic at Bethesda (John 5:1–18).',
                            '6th Sunday: the man born blind (John 9:1–41).',
                        ],
                    },
                    { name: 'Lazarus Saturday', text: 'The day before Palm Sunday: the raising of Lazarus (John 11:1–45).' },
                    { name: 'Palm Sunday', text: 'The entry into Jerusalem, read from all four Gospels.' },
                    { name: 'Holy Week', text: 'Readings for each prayer hour of the day and of the night: the First, Third, Sixth, Ninth and Eleventh Hours, with a Twelfth Hour on Friday. Each hour begins with the Old Testament.' },
                    {
                        joined: true,
                        name: 'Day by day',
                        list: true,
                        text: [
                            'Monday: the fig tree and the cleansing of the Temple.',
                            'Tuesday: the parables and warnings of the end.',
                            'Wednesday: the anointing at Bethany and Judas’s bargain.',
                            'Thursday: the Last Supper and Christ’s farewell words.',
                            'Friday: the Passion, from all four Gospels.',
                            'Saturday: the Resurrection (Matthew 28:1–20).',
                        ],
                    },
                    {
                        name: 'Sundays of the Holy Fifty Days',
                        list: true,
                        lead: 'In the Liturgy, the Gospel of each Sunday is from St. John:',
                        text: [
                            'Easter Day: the empty tomb (John 20:1–18).',
                            '1st Sunday: Thomas (John 20:19–31).',
                            '2nd Sunday: the bread of life (John 6:35–45).',
                            '3rd Sunday: the living water (John 4:1–42).',
                            '4th Sunday: the light of the world (John 12:35–50).',
                            '5th Sunday: the way, the truth and the life (John 14:1–11).',
                            '6th Sunday: “I have overcome the world” (John 16:23–33).',
                        ],
                    },
                    {
                        name: 'Ascension, Pentecost',
                        list: true,
                        text: [
                            'The Ascension, on the 40th day: Luke 24:36–53.',
                            'Pentecost, on the 50th day: the coming of the Helper (John 15:26–16:15).',
                        ],
                    },
                ],
            },
        },
    },

    footnotes: {
        heading: 'Notes',
        label: 'Note',
        backLabel: 'Back to the text',
        items: [
            { id: 'nasie', text: 'One year in four, Nasie has six days: this is when the next February has 29 days.' },
            { id: 'thout', text: 'One year in four, 1 Thout falls on September 12, after a Nasie of six days.' },
            { id: 'martyrs', text: 'One kind of saint can have several sets of readings: this is the case for martyrs, for example.' },
        ],
    },

    footer: {
        readings: 'Today’s readings',
        contact: 'Contact',
        getApp: 'Get the app:',
        sourceCode: 'Source code',
    },
}

export default content
