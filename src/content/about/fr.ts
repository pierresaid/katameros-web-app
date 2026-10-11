import type { AboutContent } from './types'

const content: AboutContent = {
    title: 'Qu’est-ce que le Katameros ?',
    description: 'Katameros : le lectionnaire de l’Église copte orthodoxe, ses cinq livres, le calendrier copte et comment sont choisies les lectures de chaque jour.',
    lead: 'Le Katameros est le lectionnaire de l’Église copte orthodoxe : le livre qui indique les passages de la Bible lus à l’église lors des offices quotidiens, chaque jour de l’année.',

    name: {
        heading: 'Le nom',
        paragraphs: [
            'Le nom vient du grec *kata meros*, « par parties » : le livre est divisé en plusieurs parties, et il présente les Écritures portion par portion, jour après jour.',
        ],
    },

    church: {
        heading: 'Lu à l’église',
        paragraphs: [
            'À l’église, le Katameros est posé sur le lutrin (le pupitre de lecture), ouvert à la page des lectures du jour. Pendant les offices du jour, les lecteurs, les diacres et le prêtre lisent les passages qu’il indique. Les églises coptes orthodoxes du monde entier suivent le même lectionnaire.',
        ],
    },

    contents: {
        heading: 'Ce qu’il contient',
        intro: 'Pour la plupart des jours, le Katameros donne les lectures de trois offices. Pour l’Église, le jour commence au coucher du soleil : les lectures débutent donc le soir précédent avec l’Office de la Veille, puis viennent l’Office du Matin et enfin la Messe (l’Eucharistie). Ces deux premiers offices sont aussi appelés Vêpres et Matines, ou élévation de l’encens du soir et du matin.',
        services: [
            { name: 'Office de la Veille', when: 'La veille au soir', parts: ['Psaume et Évangile'] },
            { name: 'Office du Matin', when: 'Le matin', parts: ['Psaume et Évangile'] },
            { name: 'Messe', when: 'Après l’Office du Matin', parts: ['Épitre de Saint Paul', 'Épitre universelle', 'Actes des Apôtres', 'Synaxaire', 'Psaume et Évangile'] },
        ],
        readingsLabel: 'Les lectures de la Messe',
        readings: [
            { name: 'Épitre de Saint Paul', text: 'Un passage de l’une des lettres de saint Paul.' },
            { name: 'Épitre universelle', text: 'Un passage des lettres de saint Jacques, saint Pierre, saint Jean ou saint Jude. Ces lettres sont dites universelles, ou catholiques (« catholique » veut dire universel) : la plupart d’entre elles s’adressent à toute l’Église plutôt qu’à une seule Église locale.' },
            { name: 'Actes des Apôtres', text: 'Un passage du livre des Actes. Cette lecture est aussi appelée Praxis, mot grec qui veut dire « actes ».' },
            { name: 'Synaxaire', text: 'Une lecture qui ne vient pas de la Bible et se lit dans un livre à part : la vie des saints commémorés ce jour-là.' },
            { name: 'Psaume et Évangile', text: 'Quelques versets d’un psaume, chantés juste avant l’Évangile. Les psaumes sont lus comme des prophéties sur le Christ : le psaume annonce donc l’Évangile. L’Évangile est la lecture principale du jour, et les autres lectures s’y rattachent généralement.' },
        ],
        note: 'Des lectures tirées des prophètes de l’Ancien Testament sont ajoutées, principalement pendant le Grand Carême et la Semaine sainte.',
    },

    books: {
        heading: 'Cinq livres',
        intro: 'Le Katameros est imprimé en cinq livres, chacun utilisé à son moment de l’année :',
        items: [
            { name: 'Jours de semaine', text: 'Du lundi au samedi, selon les saints et les fêtes du calendrier copte.' },
            { name: 'Dimanches', text: 'Les dimanches de l’année, avec un thème pour chaque mois.' },
            { name: 'Grand Carême', text: 'La semaine de préparation et les Quarante Jours, ainsi que le Jeûne de Ninive.' },
            { name: 'Semaine sainte', text: 'La semaine qui précède Pâques, avec des lectures pour chacune de ses heures de prière. Dans l’Église copte, on appelle cette semaine Pascha.' },
            { name: 'Cinquante Jours saints', text: 'De Pâques à la Pentecôte.' },
        ],
    },

    calendar: {
        heading: 'Le calendrier copte',
        paragraphs: [
            'Le Katameros suit le calendrier copte, le calendrier de l’Église hérité de l’Égypte ancienne. L’année copte compte 13 mois : 12 mois de 30 jours, puis un mois court appelé Nasie, de cinq jours (six quand le mois de février suivant compte 29 jours).',
            'Les mois sont Thout, Babah, Hatour, Kiahk, Toubah, Amshir, Baramhat, Baramoudah, Bashans, Baounah, Abib, Misra et Nasie. L’année commence le 1er Thout, qui correspond au 11 septembre (au 12 septembre quand le mois de février suivant compte 29 jours).',
        ],
    },

    choice: {
        heading: 'Comment les lectures sont choisies',
        intro: 'Les lectures d’un jour ne sont pas choisies au hasard : elles correspondent à ce que l’Église célèbre ce jour-là. Le choix dépend de trois éléments : le saint ou la fête du jour dans le calendrier copte, le dimanche et son thème, et les périodes qui se déplacent avec Pâques. Quand ils tombent le même jour, les fêtes du Seigneur (les fêtes du Christ, comme la Nativité) et ces périodes l’emportent sur le dimanche. Le dimanche l’emporte sur le saint du jour.',

        weekdays: {
            heading: 'En semaine : les saints du jour',
            paragraphs: [
                'Du lundi au samedi, les lectures correspondent au saint ou à la fête que le Synaxaire commémore à cette date copte. Souvent, l’Évangile suffit à montrer de qui l’on fait mémoire : les prophètes mis à mort (Matthieu 23) pour un prophète, la persécution (Luc 21) pour un martyr, le Bon Pasteur (Jean 10) pour un pape ou un patriarche, les vierges sages (Matthieu 25) pour une sainte.',
                'Mais le livre des Jours de semaine ne prévoit pas de lectures différentes pour chaque jour de l’année. Seules 70 dates environ ont des lectures qui leur sont propres. Toutes les autres dates reprennent les lectures de l’une de ces dates, celle d’un saint de la même catégorie : un martyr reçoit les lectures d’un autre martyr, un évêque celles d’un autre évêque, un moine celles d’un grand moine. C’est pourquoi les mêmes lectures reviennent plusieurs fois dans l’année.',
                'Par exemple, les lectures de saint Antoine, le père des moines, fêté le 22 Toubah, sont reprises à huit autres dates, surtout des fêtes de moines.',
            ],
        },

        sundays: {
            heading: 'Le dimanche : l’œuvre de la Sainte Trinité',
            paragraphs: [
                'Les dimanches ne suivent pas le saint du jour. Lues l’une après l’autre, les lectures des dimanches de l’année racontent une seule histoire : l’œuvre de la Sainte Trinité pour notre salut. Chaque mois copte donne à ses dimanches un thème tiré de cette histoire. Par exemple, au mois de Kiahk, qui mène à la Nativité, les Évangiles des quatre dimanches racontent l’Incarnation : l’annonce faite à Zacharie, l’Annonciation faite à Marie, la Visitation et la naissance de Jean-Baptiste.',
            ],
            more: {
                title: 'Les dimanches, mois par mois',
                intro: 'Le thème de chaque mois et les Évangiles de ses dimanches.',
                items: [
                    {
                        name: 'Thout',
                        text: [
                            'L’amour de Dieu le Père pour l’humanité.',
                            'Évangiles : Jean-Baptiste (Luc 7:28–35), le grand commandement (Luc 10:21–28), Zachée (Luc 19:1–10) et la pécheresse pardonnée (Luc 7:36–50).',
                        ],
                    },
                    {
                        name: 'Babah',
                        text: [
                            'La puissance du Christ, manifestée dans ses miracles.',
                            'Évangiles : le paralytique descendu par le toit (Marc 2:1–12), la pêche miraculeuse (Luc 5:1–11), la guérison d’un homme aveugle et muet (Matthieu 12:22–28) et le fils de la veuve ressuscité à Naïn (Luc 7:11–17).',
                        ],
                    },
                    {
                        name: 'Hatour',
                        text: [
                            'Son enseignement et ses œuvres.',
                            'Évangiles : la parabole du semeur, deux fois (Luc 8:4–15 et Matthieu 13:1–9), ce qu’il en coûte de le suivre (Luc 14:25–35) et le jeune homme riche (Marc 10:17–31).',
                        ],
                    },
                    {
                        name: 'Kiahk',
                        text: [
                            'L’Incarnation.',
                            'Évangiles tirés du premier chapitre de saint Luc : l’annonce faite à Zacharie, l’Annonciation faite à Marie, la Visitation et la naissance de Jean-Baptiste.',
                        ],
                    },
                    {
                        name: 'Toubah',
                        text: [
                            'Le salut offert à toutes les nations.',
                            'Évangiles : la fuite en Égypte (Matthieu 2:13–23), le signe de Jonas (Luc 11:27–36), le témoignage de Jean-Baptiste (Jean 3:22–36) et l’aveugle-né (Jean 9:1–38).',
                        ],
                    },
                    {
                        name: 'Amshir',
                        text: [
                            'Le Christ, pain de vie.',
                            'Évangiles : Jean 6 (la multiplication des pains pour cinq mille hommes et le pain de vie), lu trois dimanches, et Zachée (Luc 19:1–10).',
                        ],
                    },
                    { name: 'Baramhat, Baramoudah', text: 'Le Grand Carême, la Semaine sainte ou les Cinquante Jours saints (voir la partie suivante).' },
                    {
                        name: 'Bashans',
                        text: [
                            'Ses premiers dimanches tombent pendant les Cinquante Jours saints.',
                            'Évangiles des derniers dimanches : le bon Samaritain (Luc 10:25–37) et la tentation du Christ (Luc 4:1–13).',
                        ],
                    },
                    {
                        name: 'Baounah',
                        text: [
                            'Le don de l’Esprit Saint.',
                            'Évangiles : le Père qui donne l’Esprit Saint à ceux qui le lui demandent (Luc 11:1–13), le paralytique pardonné (Luc 5:17–26), le péché contre l’Esprit Saint (Matthieu 12:22–37) et « Aimez vos ennemis » (Luc 6:27–38).',
                        ],
                    },
                    {
                        name: 'Abib',
                        text: [
                            'L’aide du Seigneur à ses apôtres.',
                            'Évangiles : l’envoi des soixante-dix disciples (Luc 10:1–20), « Qui est le plus grand ? » (Matthieu 18:1–9), la multiplication des pains pour cinq mille hommes (Luc 9:10–17) et la résurrection de Lazare (Jean 11:1–45).',
                        ],
                    },
                    {
                        name: 'Misra',
                        text: [
                            'Sa sollicitude pour son Église.',
                            'Évangiles : les méchants vignerons (Luc 20:9–19), l’appel de Lévi (Luc 5:27–39), la maison divisée (Marc 3:22–35) et la fin des temps (Marc 13:3–37).',
                        ],
                    },
                    {
                        name: 'Nasie',
                        text: [
                            'La seconde venue du Christ.',
                            'Évangile : les signes de la fin (Matthieu 24:3–35).',
                        ],
                    },
                ],
                notes: [
                    'Le cinquième dimanche d’un mois, on lit la multiplication des pains pour cinq mille hommes : de Thout à Amshir, les lectures du deuxième dimanche d’Amshir (Jean 6:5–14), et de Baramhat à Misra, des lectures propres (Luc 9:12–17). Il y a des exceptions, notamment le 29 d’un mois en dehors de Toubah et d’Amshir, ou le 30 Kiahk.',
                    'En Babah, en Hatour et de Bashans à Misra, l’Évangile de l’Office du Matin, le dimanche, est celui de la Résurrection, racontée tour à tour par Matthieu, Marc, Luc et Jean.',
                ],
            },
        },

        seasons: {
            heading: 'Les périodes qui se déplacent avec Pâques',
            paragraphs: [
                'Le calendrier copte est fixe, mais Pâques ne l’est pas : sa date est calculée chaque année, et elle tombe entre le 4 avril et le 8 mai. Plusieurs périodes sont comptées à partir de Pâques ; elles se déplacent donc avec Pâques chaque année :',
            ],
            items: [
                { name: 'Jeûne de Ninive', text: 'Trois jours, deux semaines avant le Grand Carême.' },
                { name: 'Grand Carême', text: 'La semaine de préparation et les Quarante Jours. Il commence entre début février et mi-mars.' },
                { name: 'Semaine sainte', text: 'La semaine qui précède Pâques.' },
                { name: 'Cinquante Jours saints', text: 'De Pâques à la Pentecôte, qui tombe entre le 23 mai et le 26 juin.' },
            ],
            note: 'Pendant ces semaines, environ 15 par an, les lectures sont tirées des livres de ces périodes, semaine par semaine et jour par jour, au lieu des livres des Jours de semaine et des Dimanches. Les lectures suivent la période : pendant le Grand Carême, on lit le dimanche la tentation du Christ, le fils prodigue et la Samaritaine ; la Semaine sainte suit les derniers jours du Christ, jour après jour. Seules quelques fêtes du Seigneur, comme la fête de la Croix le 10 Baramhat, gardent leurs propres lectures.',
            more: {
                title: 'Ce qu’on lit pendant ces périodes',
                items: [
                    { name: 'Jeûne de Ninive', text: 'Le livre de Jonas, lu au cours des trois jours.' },
                    { name: 'Jours de semaine du Grand Carême', text: 'Du lundi au vendredi, il n’y a pas d’élévation de l’encens du soir, et à l’Office du Matin, des lectures des prophètes de l’Ancien Testament précèdent l’Évangile.' },
                    {
                        name: 'Dimanches du Grand Carême',
                        list: true,
                        text: [
                            'Dimanche avant le Grand Carême : l’aumône, la prière et le jeûne dans le secret (Matthieu 6:1–18).',
                            '1er dimanche : les trésors dans le ciel (Matthieu 6:19–33).',
                            '2e dimanche : la tentation du Christ (Matthieu 4:1–11).',
                            '3e dimanche : le fils prodigue (Luc 15:11–32).',
                            '4e dimanche : la Samaritaine (Jean 4:1–42).',
                            '5e dimanche : le paralytique de Béthesda (Jean 5:1–18).',
                            '6e dimanche : l’aveugle-né (Jean 9:1–41).',
                        ],
                    },
                    { name: 'Samedi de Lazare', text: 'La veille du dimanche des Rameaux : la résurrection de Lazare (Jean 11:1–45).' },
                    { name: 'Dimanche des Rameaux', text: 'L’entrée à Jérusalem, lue dans les quatre Évangiles.' },
                    { name: 'Semaine sainte', text: 'Des lectures pour chaque heure de prière du jour et de la nuit : les Première, Troisième, Sixième, Neuvième et Onzième Heures, avec une Douzième Heure le vendredi. Chaque heure commence par l’Ancien Testament.' },
                    {
                        name: 'Jour après jour',
                        list: true,
                        text: [
                            'Lundi : le figuier et la purification du Temple.',
                            'Mardi : les paraboles et les avertissements sur la fin.',
                            'Mercredi : l’onction à Béthanie et le marché conclu par Judas.',
                            'Jeudi : la Cène et les paroles d’adieu du Christ.',
                            'Vendredi : la Passion, d’après les quatre Évangiles.',
                            'Samedi : la Résurrection (Matthieu 28).',
                        ],
                    },
                    {
                        name: 'Dimanches des Cinquante Jours saints',
                        list: true,
                        lead: 'À la Messe, l’Évangile de chaque dimanche est tiré de saint Jean :',
                        text: [
                            'Jour de Pâques : le tombeau vide (Jean 20:1–18).',
                            '1er dimanche : Thomas (Jean 20:19–31).',
                            '2e dimanche : le pain de vie (Jean 6:35–45).',
                            '3e dimanche : l’eau vive (Jean 4:1–42).',
                            '4e dimanche : la lumière du monde (Jean 12:35–50).',
                            '5e dimanche : le chemin, la vérité et la vie (Jean 14:1–11).',
                            '6e dimanche : « J’ai vaincu le monde » (Jean 16:23–33).',
                        ],
                    },
                    {
                        name: 'Ascension, Pentecôte',
                        list: true,
                        text: [
                            'L’Ascension, le 40e jour : Luc 24:36–53.',
                            'La Pentecôte, le 50e jour : la venue du Consolateur (Jean 15:26–16:15).',
                        ],
                    },
                ],
                notes: [
                    'L’Évangile de la Samaritaine est lu deux dimanches : pendant le Grand Carême, avec un psaume qui parle de chercher le Seigneur (Psaume 105), et après Pâques, avec un psaume qui parle de la bénédiction du Seigneur (Psaume 115).',
                ],
            },
        },
    },

    footer: {
        readings: 'Lectures du jour',
        contact: 'Contact',
        getApp: 'Télécharger l’application :',
        sourceCode: 'Code source',
    },
}

export default content
