import { authClient } from "./auth-client";

const BACKEND_URL = (process.env.NEXT_PUBLIC_BETTER_AUTH_URL || "http://localhost:8080").replace(/\/api\/auth$/, "");

type RequestOptions = RequestInit & {
    params?: Record<string, string>;
};

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
    const { params, ...init } = options;

    // Construct URL with query params
    const url = new URL(`${BACKEND_URL}${path}`);
    if (params) {
        Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));
    }

    // Get business ID from localStorage
    let businessId = typeof window !== 'undefined' ? localStorage.getItem('active_business_id') : null;

    // Safety check for weird storage values
    if (businessId === "null" || businessId === "undefined") businessId = null;

    const headers = new Headers(init.headers || {});

    // Only set if not already present (allows explicit override)
    if (businessId && !headers.has('x-business-id')) {
        headers.set('x-business-id', businessId);
    }

    // Better Auth uses credentials (cookies)
    init.credentials = 'include';
    init.headers = headers;

    if (process.env.NODE_ENV === 'development') {
        if (!headers.has('x-business-id') && path !== '/v1/business' && !path.includes('/auth')) {
            console.warn(`[API] Missing x-business-id for request: ${options.method || 'GET'} ${path}`);
        }
    }

    const response = await fetch(url.toString(), init);

    if (response.status === 401) {
        // Handle unauthorized (maybe redirect to login or refresh)
    }

    if (!response.ok) {
        let errorMessage = `Request failed: ${options.method || 'GET'} ${path} - Status ${response.status}`;
        try {
            const error = await response.json();
            errorMessage = error.error || error.message || errorMessage;
        } catch (e) {
            if (response.statusText) errorMessage = `${response.statusText} (${response.status})`;
        }

        if (process.env.NODE_ENV === 'development') {
            console.error(`[API ERROR]`, { path, status: response.status, message: errorMessage });
        }
        throw new Error(errorMessage);
    }

    if (response.status === 204) {
        return {} as T;
    }

    return response.json();
}

export const api = {
    get: <T>(path: string, options?: RequestOptions) => request<T>(path, { ...options, method: 'GET' }),
    post: <T>(path: string, data?: any, options?: RequestOptions) =>
        request<T>(path, { ...options, method: 'POST', body: JSON.stringify(data), headers: { 'Content-Type': 'application/json', ...options?.headers } }),
    put: <T>(path: string, data?: any, options?: RequestOptions) =>
        request<T>(path, { ...options, method: 'PUT', body: JSON.stringify(data), headers: { 'Content-Type': 'application/json', ...options?.headers } }),
    patch: <T>(path: string, data?: any, options?: RequestOptions) =>
        request<T>(path, { ...options, method: 'PATCH', body: JSON.stringify(data), headers: { 'Content-Type': 'application/json', ...options?.headers } }),
    delete: <T>(path: string, options?: RequestOptions) => request<T>(path, { ...options, method: 'DELETE' }),
};
