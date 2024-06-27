import axios, { AxiosError, type AxiosInstance, type AxiosRequestConfig } from "axios";

interface HttpRequestConfig {
    /**
     * The service name that is logged on errors
     */
    httpServiceName?: string;
    baseURL?: string;
}

class Http {
    private instance: AxiosInstance;
    private _errorHandler?: () => void;
    private _unauthorizedHandler?: () => void;
    private _config: HttpRequestConfig;

    constructor(config: HttpRequestConfig = {}) {
        this._config = config;
        this.instance = axios.create(config as AxiosRequestConfig);
    }

    /**
     * Set the default Authorization header for every Http call
     * @param token Authorization token
     */
    setToken(token: string | null) {
        if (token)
            this.instance.defaults.headers.common["Authorization"] = token;
        else
            delete this.instance.defaults.headers.common.Authorization;
    }

    /**
     * @param handler The error handler called on every failed request
     */
    public set errorHandler(handler: () => void) {
        this._errorHandler = handler;
        this.setInterceptors();
    }

    /**
     * @param handler The handler called on every 401 failed response
     */
    public set onUnauthorized(handler: () => void) {
        this._unauthorizedHandler = handler;
        this.setInterceptors();
    }

    private setInterceptors() {
        this.instance.interceptors.response.use(
            (config) => {
                return config;
            },
            (error: AxiosError) => {
                console.error(
                    `[HTTP] ${this._config.httpServiceName ?? ""} ${error.message}`,
                    error.toJSON()
                );
                if (error.response?.status === 401 && this._unauthorizedHandler) {
                    this._unauthorizedHandler();
                }
                if (this._errorHandler) {
                    this._errorHandler();
                }
                return Promise.reject(error);
            }
        );
    }

    /**
     * Http GET `url`
     * @param url Url
     * @param params Query Params
     */
    async get<T = any>(route: string, params?: Record<string, unknown>) {
        const res = await this.instance.get<T>(route, { params });
        return res.data;
    }

    /**
     * Http POST `url`
     * @param url Url
     * @param data data to post
     * @param params Query Params
     */
    async post<T = any>(route: string, data?: unknown, params?: Record<string, unknown>) {
        const res = await this.instance.post<T>(route, data, { params });
        return res.data;
    }

    /**
     * Http PUT `url`
     * @param url Url
     * @param data data to put
     * @param params Query Params
     */
    async put<T = any>(route: string, data?: unknown, params?: Record<string, unknown>) {
        const res = await this.instance.put<T>(route, data, { params });
        return res.data;
    }

    /**
     * Http DELETE `url`
     * @param url Url
     * @param params Query Params
     */
    async delete<T = any>(route: string, params?: Record<string, unknown>) {
        const res = await this.instance.delete<T>(route, { params });
        return res.data;
    }
}

export const http = new Http({ baseURL: import.meta.env.VITE_API_BASE_URL });
