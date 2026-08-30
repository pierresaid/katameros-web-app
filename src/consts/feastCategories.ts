export type FeastCategory = 'lord' | 'marian' | 'church' | 'solemn';

// Liturgical grouping of the API's feast ids (Feasts table), used to color
// the calendar marks: red for feasts of the Lord, blue for the Virgin,
// green for church celebrations, violet for Holy Week / paramoun /
// fast-related days (the fasting color).
const CATEGORY_BY_FEAST_ID: Record<number, FeastCategory> = {
    1: 'lord',    // Christmas
    2: 'lord',    // Ascension
    3: 'lord',    // Lazarus Saturday
    4: 'lord',    // Palm Sunday
    11: 'lord',   // Entrance into Egypt
    12: 'lord',   // Annunciation
    18: 'lord',   // Theophany
    19: 'lord',   // Wedding at Cana
    22: 'lord',   // Pascha (Resurrection)
    25: 'lord',   // Pentecost
    26: 'lord',   // Circumcision
    27: 'lord',   // Transfiguration
    28: 'lord',   // Thomas Sunday
    10: 'marian', // Entrance of the Virgin into the Temple
    30: 'marian', // Assumption of St. Mary
    13: 'church', // Feast of the Cross
    15: 'church', // Jonas
    23: 'church', // Nayrouz (Coptic New Year)
    29: 'church', // Feast of the Apostles
    5: 'solemn',  // Pascha Monday
    6: 'solemn',  // Pascha Tuesday
    7: 'solemn',  // Pascha Wednesday
    8: 'solemn',  // Pascha Thursday
    9: 'solemn',  // Pascha Friday
    24: 'solemn', // Holy Saturday
    14: 'solemn', // Fast of Ninevah
    16: 'solemn', // Nativity Paramoun
    17: 'solemn', // Theophany Paramoun
    20: 'solemn', // Saturday before the Great Fast
    21: 'solemn', // Sunday before the Great Fast
};

export function feastCategory(id: number): FeastCategory {
    return CATEGORY_BY_FEAST_ID[id] ?? 'church';
}

// CSS custom property carrying the category color, themed in App.vue
export function feastColor(id: number): string {
    return `var(--feast-${feastCategory(id)})`;
}
