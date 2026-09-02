
export interface FeastDate {
    id: number;
    // Local ISO datetime from the API, e.g. "2026-01-07T00:00:00"
    date: string;
    name: string | null;
    description?: string | null;
}

export interface FastPeriod {
    id: number;
    // Local ISO datetimes from the API, e.g. "2026-02-16T00:00:00"
    start: string;
    end: string;
    name: string | null;
    description?: string | null;
}
