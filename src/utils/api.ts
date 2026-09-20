interface ApiErrorPayload {
  error?: string;
}

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

export async function api<T>(path: string, options: RequestInit = {}): Promise<T> {
  const isFormData = options.body instanceof FormData;
  const response = await fetch(`/api${path}`, {
    ...options,
    credentials: 'include',
    headers: {
      ...(options.body && !isFormData ? { 'Content-Type': 'application/json' } : {}),
      ...options.headers
    }
  });

  const payload = await response.json().catch(() => ({})) as T & ApiErrorPayload;
  if (!response.ok) {
    throw new ApiError(payload.error || 'La requête a échoué.', response.status);
  }

  return payload;
}

export async function uploadImage(file: File): Promise<string> {
  const formData = new FormData();
  formData.append('image', file);
  const result = await api<{ url: string }>('/uploads/image', {
    method: 'POST',
    body: formData
  });
  return result.url;
}

export async function uploadHeroImage(file: File): Promise<{
  desktopUrl: string;
  mobileUrl: string;
}> {
  const formData = new FormData();
  formData.append('image', file);
  return api<{ desktopUrl: string; mobileUrl: string }>('/uploads/hero', {
    method: 'POST',
    body: formData
  });
}
