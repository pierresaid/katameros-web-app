export type FeastCategory = 'lord' | 'marian' | 'church';

// Liturgical grouping of the API's feast ids (Feasts table), used to color
// the calendar marks: red for feasts of the Lord (Holy Week and the
// paramoun eves included — they are the Lord's own days), blue for the
// Virgin, green for church celebrations. Fasting periods are drawn as teal
// washes, a different mark shape, so they never compete with the dots.
const CATEGORY_BY_FEAST_ID: Record<number, FeastCategory> = {
    1: 'lord',    // Christmas
    2: 'lord',    // Ascension
    3: 'lord',    // Lazarus Saturday
    4: 'lord',    // Palm Sunday
    5: 'lord',    // Pascha Monday
    6: 'lord',    // Pascha Tuesday
    7: 'lord',    // Pascha Wednesday
    8: 'lord',    // Pascha Thursday
    9: 'lord',    // Pascha Friday
    11: 'lord',   // Entrance into Egypt
    12: 'lord',   // Annunciation
    16: 'lord',   // Nativity Paramoun
    17: 'lord',   // Theophany Paramoun
    18: 'lord',   // Theophany
    19: 'lord',   // Wedding at Cana
    22: 'lord',   // Pascha (Resurrection)
    24: 'lord',   // Holy Saturday
    25: 'lord',   // Pentecost
    26: 'lord',   // Circumcision
    27: 'lord',   // Transfiguration
    28: 'lord',   // Thomas Sunday
    10: 'marian', // Entrance of the Virgin into the Temple
    30: 'marian', // Assumption of St. Mary
    13: 'church', // Feast of the Cross
    14: 'church', // Fast of Ninevah
    15: 'church', // Jonas
    20: 'church', // Saturday before the Great Fast
    21: 'church', // Sunday before the Great Fast
    23: 'church', // Nayrouz (Coptic New Year)
    29: 'church', // Feast of the Apostles
};

export function feastCategory(id: number): FeastCategory {
    return CATEGORY_BY_FEAST_ID[id] ?? 'church';
}

// CSS custom property carrying the category color, themed in App.vue
export function feastColor(id: number): string {
    return `var(--feast-${feastCategory(id)})`;
}
