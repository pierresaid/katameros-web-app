import type { AboutContent } from './types'

const content: AboutContent = {
    title: 'Che cos’è il Katameros?',
    description: 'Che cos’è il Katameros: il lezionario della Chiesa copta ortodossa, i suoi cinque libri, il calendario copto e come vengono scelte le letture di ogni giorno.',
    lead: 'Il Katameros è il lezionario della Chiesa copta ortodossa: il libro che elenca i brani della Bibbia letti in chiesa nelle celebrazioni quotidiane, per ogni giorno dell’anno.',

    name: {
        heading: 'Il nome',
        paragraphs: [
            'Il nome viene dal greco *kata meros*, «in parti»: vi si legge la Bibbia a brani, scelti per ogni giorno.',
        ],
    },

    church: {
        heading: 'Un libro letto in chiesa',
        paragraphs: [
            'In chiesa, il lezionario è posto sul leggio (il supporto per la lettura), aperto alla pagina delle letture del giorno. Nelle celebrazioni del giorno, i lettori, i diaconi e il sacerdote leggono i brani che vi sono indicati. Le chiese copte ortodosse di tutto il mondo seguono questo stesso lezionario.',
        ],
    },

    contents: {
        heading: 'Che cosa contiene',
        intro: 'Nella maggior parte dei giorni, il lezionario riporta le letture di tre celebrazioni. Per la Chiesa, il giorno liturgico comincia al tramonto. Le letture iniziano quindi la sera prima, con l’Incenso. Seguono la celebrazione del Mattino e la Messa (l’Eucaristia). Le prime due celebrazioni, dette anche Vespri e Mattutino, sono l’offerta dell’incenso della sera e quella del mattino.',
        services: [
            { name: 'Incenso', when: 'La sera prima', parts: ['Salmo e Vangelo'] },
            { name: 'Mattino', when: 'Al mattino', parts: ['Salmo e Vangelo'] },
            { name: 'Messa', when: 'Dopo la celebrazione del Mattino', parts: ['San Paolo', 'Katholicon', 'Atti degli Apostoli', 'Sinassario', 'Salmo e Vangelo'] },
        ],
        readingsLabel: 'Le letture della Messa',
        readings: [
            { name: 'San Paolo', text: 'Un brano di una delle lettere di san Paolo.' },
            { name: 'Katholicon', text: 'Un brano delle lettere di san Giacomo, san Pietro, san Giovanni o san Giuda, dette lettere cattoliche. «Cattolico» significa universale: la maggior parte di queste lettere è indirizzata a tutta la Chiesa e non a una sola Chiesa locale.' },
            { name: 'Atti degli Apostoli', text: 'Un brano del libro degli Atti. Questa lettura si chiama anche Praxis, che in greco significa «Atti».' },
            { name: 'Sinassario', text: 'Le vite dei santi e dei martiri commemorati quel giorno, lette da un libro a parte.' },
            { name: 'Salmo e Vangelo', text: 'Alcuni versetti di un salmo, cantati subito prima del Vangelo. Il Vangelo è la lettura principale del giorno, e di solito le altre letture vi si ricollegano.' },
        ],
    },

    books: {
        heading: 'Cinque libri',
        intro: 'Il Katameros è diviso in cinque libri. A seconda del giorno, si legge nell’uno o nell’altro. I primi due si usano tutto l’anno, tranne nei grandi periodi intorno alla Pasqua, che hanno i propri libri:',
        items: [
            { name: 'Giorni feriali', text: 'Dal lunedì al sabato, secondo i santi e le feste del calendario copto.' },
            { name: 'Domeniche', text: 'Le domeniche dell’anno, con un tema per ogni mese.' },
            { name: 'Grande Quaresima', text: 'La settimana di preparazione e i Quaranta giorni, oltre al Digiuno di Giona.' },
            { name: 'Settimana Santa', text: 'La settimana prima di Pasqua, con letture per ciascuna delle sue ore di preghiera. Nella Chiesa copta questa settimana si chiama Pascha.' },
            { name: 'Cinquanta giorni santi', text: 'Da Pasqua a Pentecoste.' },
        ],
    },

    calendar: {
        heading: 'Il calendario copto',
        paragraphs: [
            'Il Katameros segue il calendario copto, il calendario della Chiesa ereditato dall’antico Egitto. L’anno copto ha 13 mesi: 12 mesi di 30 giorni, poi un mese breve chiamato Nasie, di cinque giorni[^nasie].',
            'I mesi sono Thout, Babah, Hatour, Kiahk, Toubah, Amshir, Baramhat, Baramoudah, Bashans, Baounah, Abib, Misra e Nasie. L’anno comincia il 1º Thout, che corrisponde all’11 settembre[^thout].',
            'Gli anni copti si contano dal 284, quando Diocleziano divenne imperatore. Questo computo si chiama era dei martiri, in ricordo dei tanti cristiani uccisi durante la sua persecuzione.',
        ],
    },

    choice: {
        heading: 'Come vengono scelte le letture',
        intro: 'Le letture di un giorno non sono scelte a caso. Seguono ciò che la Chiesa celebra quel giorno. A deciderle sono tre elementi:',
        factors: [
            { name: 'Il santo o la festa del giorno nel calendario copto' },
            { name: 'La domenica e il suo tema' },
            { name: 'I periodi che si spostano con la Pasqua', detail: 'Digiuno di Giona, Grande Quaresima, Settimana Santa, Cinquanta giorni santi' },
        ],
        priority: 'Quando ne cade più di uno nello stesso giorno, le feste del Signore (come il Natale) e i grandi periodi intorno alla Pasqua hanno la precedenza sulla domenica. La domenica ha la precedenza sul santo del giorno.',

        weekdays: {
            heading: 'I giorni feriali: i santi del giorno',
            intro: [
                'Dal lunedì al sabato, le letture sono legate al santo del giorno, quello che il Sinassario ricorda in quella data copta.',
                'Per esempio, il 3 Abib la Chiesa festeggia san Cirillo d’Alessandria, papa. Alla Messa si legge il Vangelo del Buon Pastore: «Io sono il buon pastore. Il buon pastore offre la vita per le pecore» (Giovanni 10:11). Il papa è il pastore della sua Chiesa.',
                'Ogni tipo di santo ha così le sue letture. Per il Vangelo della Messa:',
            ],
            gospels: [
                { name: 'Per un profeta', text: 'I profeti uccisi', ref: 'Matteo 23', passage: 'prophets' },
                { name: 'Per un martire', text: 'La persecuzione', ref: 'Luca 21', passage: 'persecution' },
                { name: 'Per un papa o un patriarca', text: 'Il Buon Pastore', ref: 'Giovanni 10', passage: 'shepherd' },
                { name: 'Per una santa', text: 'Le vergini sagge', ref: 'Matteo 25', passage: 'virgins' },
            ],
            openLabel: 'Leggi',
            paragraphs: [
                'I santi dello stesso tipo condividono quindi le loro letture[^martyrs]. Per questo le stesse letture tornano più volte all’anno. Le grandi feste e alcuni grandi santi hanno letture proprie.',
            ],
        },

        sundays: {
            heading: 'Le domeniche: l’opera della Santa Trinità',
            paragraphs: [
                'La domenica, le letture non seguono il santo del giorno, ma il tema del mese copto.',
                'Nel corso delle domeniche dell’anno, le letture ruotano attorno a un unico argomento: l’opera della Santa Trinità per la nostra salvezza. Ogni mese copto ne mostra un aspetto.',
                'Per esempio, Kiahk è il mese che porta al Natale. Il suo tema è l’Incarnazione. I Vangeli delle sue quattro domeniche raccontano l’annuncio a Zaccaria, l’Annunciazione a Maria, la Visitazione e la nascita di Giovanni Battista.',
            ],
            more: {
                title: 'Le domeniche, mese per mese',
                intro: 'Il tema di ogni mese e i Vangeli delle sue domeniche.',
                items: [
                    {
                        name: 'Thout',
                        text: [
                            'L’amore di Dio Padre per l’umanità.',
                            'Vangeli: Giovanni Battista (Luca 7:28–35), il grande comandamento (Luca 10:21–28), Zaccheo (Luca 19:1–10) e la peccatrice perdonata (Luca 7:36–50).',
                        ],
                    },
                    {
                        name: 'Babah',
                        text: [
                            'La potenza di Cristo, manifestata nei suoi miracoli.',
                            'Vangeli: il paralitico calato dal tetto (Marco 2:1–12), la pesca miracolosa (Luca 5:1–11), la guarigione di un uomo cieco e muto (Matteo 12:22–28) e il figlio della vedova risuscitato a Nain (Luca 7:11–17).',
                        ],
                    },
                    {
                        name: 'Hatour',
                        text: [
                            'Il suo insegnamento e le sue opere.',
                            'Vangeli: la parabola del seminatore, due volte (Luca 8:4–15 e Matteo 13:1–9), il prezzo da pagare per seguirlo (Luca 14:25–35) e il giovane ricco (Marco 10:17–31).',
                        ],
                    },
                    {
                        name: 'Kiahk',
                        text: [
                            'L’Incarnazione.',
                            'Vangeli tratti dal primo capitolo di san Luca: l’annuncio a Zaccaria, l’Annunciazione a Maria, la Visitazione e la nascita di Giovanni Battista.',
                        ],
                    },
                    {
                        name: 'Toubah',
                        text: [
                            'La salvezza offerta a tutti i popoli.',
                            'Vangeli: la fuga in Egitto (Matteo 2:13–23), il segno di Giona (Luca 11:27–36), la testimonianza di Giovanni Battista (Giovanni 3:22–36) e il cieco nato (Giovanni 9:1–38).',
                        ],
                    },
                    {
                        name: 'Amshir',
                        text: [
                            'Cristo, pane della vita.',
                            'Vangeli: Giovanni 6 (la moltiplicazione dei pani per cinquemila persone e il pane della vita) in tre domeniche, e Zaccheo (Luca 19:1–10).',
                        ],
                    },
                    { name: 'Baramhat, Baramoudah', text: 'La Grande Quaresima, la Settimana Santa o i Cinquanta giorni santi (vedi la sezione seguente).' },
                    {
                        name: 'Bashans',
                        text: [
                            'Le sue prime domeniche cadono nei Cinquanta giorni santi.',
                            'Vangeli delle ultime domeniche: il buon samaritano (Luca 10:25–37) e le tentazioni di Cristo (Luca 4:1–13).',
                        ],
                    },
                    {
                        name: 'Baounah',
                        text: [
                            'Il dono dello Spirito Santo.',
                            'Vangeli: il Padre che dà lo Spirito Santo a chi glielo chiede (Luca 11:1–13), il paralitico perdonato (Luca 5:17–26), il peccato contro lo Spirito Santo (Matteo 12:22–37) e «amate i vostri nemici» (Luca 6:27–38).',
                        ],
                    },
                    {
                        name: 'Abib',
                        text: [
                            'L’aiuto del Signore ai suoi apostoli.',
                            'Vangeli: l’invio dei settanta discepoli (Luca 10:1–20), «chi è il più grande?» (Matteo 18:1–9), la moltiplicazione dei pani per cinquemila persone (Luca 9:10–17) e la risurrezione di Lazzaro (Giovanni 11:1–45).',
                        ],
                    },
                    {
                        name: 'Misra',
                        text: [
                            'La cura che ha per la sua Chiesa.',
                            'Vangeli: i vignaioli omicidi (Luca 20:9–19), la chiamata di Levi (Luca 5:27–39), la casa divisa (Marco 3:22–35) e la fine dei tempi (Marco 13:3–37).',
                        ],
                    },
                    {
                        name: 'Nasie',
                        text: [
                            'La seconda venuta.',
                            'Vangelo: i segni della fine (Matteo 24:3–35).',
                        ],
                    },
                ],
            },
        },

        seasons: {
            heading: 'I periodi che si spostano con la Pasqua',
            paragraphs: [
                'Il calendario copto è fisso, ma la Pasqua no: la sua data si calcola ogni anno e cade tra il 4 aprile e l’8 maggio. Diversi periodi si contano a partire dalla Pasqua, quindi ogni anno si spostano con essa:',
            ],
            items: [
                { name: 'Digiuno di Giona', text: 'Tre giorni di digiuno, due settimane prima dell’inizio della Grande Quaresima.' },
                { name: 'Grande Quaresima', text: 'Una settimana di preparazione, poi i Quaranta giorni. Comincia tra l’inizio di febbraio e la metà di marzo.' },
                { name: 'Settimana Santa', text: 'La settimana prima di Pasqua.' },
                { name: 'Cinquanta giorni santi', text: 'Da Pasqua a Pentecoste, che cade tra il 23 maggio e il 26 giugno.' },
            ],
            more: {
                title: 'Che cosa si legge in questi periodi',
                items: [
                    { name: 'Digiuno di Giona', text: 'Il libro di Giona, letto nei tre giorni.' },
                    { name: 'Giorni feriali della Grande Quaresima', text: 'Dal lunedì al venerdì non si celebra l’Incenso (l’offerta dell’incenso della sera), e nella celebrazione del Mattino le letture dei profeti dell’Antico Testamento vengono prima del Vangelo.' },
                    {
                        name: 'Domeniche della Grande Quaresima',
                        list: true,
                        text: [
                            'Domenica prima della Grande Quaresima: l’elemosina, la preghiera e il digiuno nel segreto (Matteo 6:1–18).',
                            '1ª domenica: i tesori in cielo (Matteo 6:19–33).',
                            '2ª domenica: le tentazioni di Cristo (Matteo 4:1–11).',
                            '3ª domenica: il figliol prodigo (Luca 15:11–32).',
                            '4ª domenica: la samaritana (Giovanni 4:1–42).',
                            '5ª domenica: il paralitico di Betzatà (Giovanni 5:1–18).',
                            '6ª domenica: il cieco nato (Giovanni 9:1–41).',
                        ],
                    },
                    { name: 'Sabato di Lazzaro', text: 'Il giorno prima della Domenica delle Palme: la risurrezione di Lazzaro (Giovanni 11:1–45).' },
                    { name: 'Domenica delle Palme', text: 'L’ingresso in Gerusalemme, letto in tutti e quattro i Vangeli.' },
                    { name: 'Settimana Santa', text: 'Letture per ogni ora di preghiera del giorno e della notte: la Prima, la Terza, la Sesta, la Nona e l’Undicesima ora, e il venerdì anche una Dodicesima ora. Ogni ora comincia con l’Antico Testamento.' },
                    {
                        joined: true,
                        name: 'Giorno per giorno',
                        list: true,
                        text: [
                            'Lunedì: il fico e la cacciata dei mercanti dal Tempio.',
                            'Martedì: le parabole e gli avvertimenti sulla fine.',
                            'Mercoledì: l’unzione a Betania e il patto di Giuda.',
                            'Giovedì: l’Ultima Cena e i discorsi di addio di Cristo.',
                            'Venerdì: la Passione, letta in tutti e quattro i Vangeli.',
                            'Sabato: la Risurrezione (Matteo 28).',
                        ],
                    },
                    {
                        name: 'Domeniche dei Cinquanta giorni santi',
                        list: true,
                        lead: 'Nella Messa, il Vangelo di ogni domenica è tratto da san Giovanni:',
                        text: [
                            'Domenica di Pasqua: il sepolcro vuoto (Giovanni 20:1–18).',
                            '1ª domenica: Tommaso (Giovanni 20:19–31).',
                            '2ª domenica: il pane della vita (Giovanni 6:35–45).',
                            '3ª domenica: l’acqua viva (Giovanni 4:1–42).',
                            '4ª domenica: la luce del mondo (Giovanni 12:35–50).',
                            '5ª domenica: la via, la verità e la vita (Giovanni 14:1–11).',
                            '6ª domenica: «Io ho vinto il mondo» (Giovanni 16:23–33).',
                        ],
                    },
                    {
                        name: 'Ascensione, Pentecoste',
                        list: true,
                        text: [
                            'L’Ascensione, il 40º giorno: Luca 24:36–53.',
                            'La Pentecoste, il 50º giorno: la venuta del Consolatore (Giovanni 15:26–16:15).',
                        ],
                    },
                ],
            },
        },
    },

    footnotes: {
        heading: 'Note',
        label: 'Nota',
        backLabel: 'Torna al testo',
        items: [
            { id: 'nasie', text: 'Un anno su quattro Nasie ha sei giorni: quando il febbraio successivo ha 29 giorni.' },
            { id: 'thout', text: 'Un anno su quattro il 1º Thout cade il 12 settembre, dopo un Nasie di sei giorni.' },
            { id: 'martyrs', text: 'Uno stesso tipo di santo può avere più serie di letture: è il caso, per esempio, dei martiri.' },
        ],
    },

    footer: {
        readings: 'Le letture di oggi',
        contact: 'Contatto',
        getApp: 'Scarica l’app:',
        sourceCode: 'Codice sorgente',
    },
}

export default content
