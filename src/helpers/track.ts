export function track(event: string, data?:  Record<string, any>): void {
    if (typeof window !== 'undefined' && window.umami) {
        if (data) {
            window.umami.track(event, data);
        }
        else {
            window.umami.track(event);
        }
    }
}