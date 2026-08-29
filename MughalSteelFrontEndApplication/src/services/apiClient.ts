const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5263';

export interface ApiResponse<T> {
  data?: T;
  message?: string;
  success?: boolean;
}

export const getAuthToken = (): string | null => {
  return localStorage.getItem('ms_token') || localStorage.getItem('ic_token');
};

export const setAuthToken = (token: string): void => {
  localStorage.setItem('ms_token', token);
  localStorage.setItem('ic_token', token);
};

export const clearAuthToken = (): void => {
  localStorage.removeItem('ms_token');
  localStorage.removeItem('ic_token');
  localStorage.removeItem('user');
};

export async function apiFetch<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = getAuthToken();
  const headers = new Headers(options.headers || {});

  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  if (!(options.body instanceof FormData) && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const contentType = response.headers.get('content-type');
  let data: any = null;
  if (contentType && contentType.includes('application/json')) {
    data = await response.json().catch(() => null);
  }

  if (!response.ok) {
    const errorMsg = data?.message || (typeof data === 'string' ? data : `Request failed with status ${response.status}`);
    throw new Error(errorMsg);
  }

  return data as T;
}
