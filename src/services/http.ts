const baseURL = String(import.meta.env.VITE_API_BASE_URL ?? "").replace(/\/+$/, "");

function buildUrl(route: string, params?: Record<string, unknown>) {
    const path = route.startsWith("/") ? route : `/${route}`;
    let url = `${baseURL}${path}`;
    if (params) {
        const search = new URLSearchParams();
        for (const [key, value] of Object.entries(params)) {
            if (value !== undefined && value !== null) {
                search.append(key, String(value));
            }
        }
        const qs = search.toString();
        if (qs) url += `?${qs}`;
    }
    return url;
}

async function request<T>(
    method: string,
    route: string,
    body?: unknown,
    params?: Record<string, unknown>
): Promise<T> {
    const url = buildUrl(route, params);
    const headers: Record<string, string> = { Accept: "application/json" };
    const init: RequestInit = { method, headers };
    if (body !== undefined) {
        headers["Content-Type"] = "application/json";
        init.body = JSON.stringify(body);
    }

    let response: Response;
    try {
        response = await fetch(url, init);
    } catch (e) {
        const message = e instanceof Error ? e.message : String(e);
        console.error(`[HTTP] ${method} ${url} ${message}`);
        throw e;
    }

    if (!response.ok) {
        console.error(`[HTTP] ${method} ${url} ${response.status} ${response.statusText}`);
        throw new Error(`HTTP ${response.status} ${response.statusText}`);
    }

    if (response.status === 204) {
        return undefined as T;
    }
    const text = await response.text();
    if (!text) {
        return undefined as T;
    }
    try {
        return JSON.parse(text) as T;
    } catch {
        return text as unknown as T;
    }
}

export const http = {
    get<T = any>(route: string, params?: Record<string, unknown>) {
        return request<T>("GET", route, undefined, params);
    },
    post<T = any>(route: string, data?: unknown, params?: Record<string, unknown>) {
        return request<T>("POST", route, data, params);
    },
    put<T = any>(route: string, data?: unknown, params?: Record<string, unknown>) {
        return request<T>("PUT", route, data, params);
    },
    delete<T = any>(route: string, params?: Record<string, unknown>) {
        return request<T>("DELETE", route, undefined, params);
    },
};
