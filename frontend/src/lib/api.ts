import { authClient } from "./auth-client";

const BACKEND_URL = process.env.NEXT_PUBLIC_BETTER_AUTH_URL || "http://localhost:8080";

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
    const businessId = typeof window !== 'undefined' ? localStorage.getItem('active_business_id') : null;

    const headers = new Headers(init.headers || {});
    if (businessId) {
        headers.set('x-business-id', businessId);
    }

    // Better Auth uses credentials (cookies)
    init.credentials = 'include';
    init.headers = headers;

    const response = await fetch(url.toString(), init);

    if (response.status === 401) {
        // Handle unauthorized (maybe redirect to login or refresh)
    }

    if (!response.ok) {
        const error = await response.json().catch(() => ({ message: 'An unknown error occurred' }));
        throw new Error(error.message || response.statusText);
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
