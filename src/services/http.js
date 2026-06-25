const BASE = 'https://api.services.avtotime.kz/api/v1';

export class HttpError extends Error {
  constructor(message, status, data) {
    super(message);
    this.name   = 'HttpError';
    this.status = status;
    this.data   = data;
  }
}

async function request(path, { method = 'GET', token, body } = {}) {
  const headers = {};
  if (token)            headers['Authorization']  = `Bearer ${token}`;
  if (body !== undefined) headers['Content-Type'] = 'application/json';

  const res = await fetch(`${BASE}${path}`, {
    method,
    headers,
    ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new HttpError(data?.message || res.statusText, res.status, data);
  }

  return data;
}

export const http = {
  get:    (path, token)        => request(path, { token }),
  post:   (path, body, token)  => request(path, { method: 'POST',   body, token }),
  put:    (path, body, token)  => request(path, { method: 'PUT',    body, token }),
  patch:  (path, body, token)  => request(path, { method: 'PATCH',  body, token }),
  delete: (path, token)        => request(path, { method: 'DELETE', token }),
};
