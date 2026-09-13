import { NativeModules } from 'react-native';
import Constants from 'expo-constants';
import { getMemoryToken } from './session';

const DEFAULT_API_URL = 'http://127.0.0.1:3000';
const REQUEST_TIMEOUT_MS = 20000;
const NETWORK_ERROR_MESSAGE =
  'Não foi possível conectar à API. Verifique se o backend está no ar.';

export class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

function originFromRaw(raw) {
  if (!raw || typeof raw !== 'string') {
    return null;
  }

  const normalized = raw.startsWith('exp://')
    ? raw.replace(/^exp:\/\//, 'https://')
    : /^https?:\/\//.test(raw)
      ? raw
      : `http://${raw}`;

  try {
    const url = new URL(normalized);
    if (url.hostname === 'localhost' || url.hostname === '127.0.0.1') {
      return null;
    }
    const isTunnel =
      url.hostname.includes('on.expo.app') || url.hostname.includes('exp.direct');
    const protocol = isTunnel ? 'https' : url.protocol === 'https:' ? 'https' : 'http';
    return `${protocol}://${url.host}`;
  } catch {
    return null;
  }
}

function inExpoGo() {
  return Constants.appOwnership === 'expo';
}

export function apiUrl(path = '') {
  const fromEnv = (process.env.EXPO_PUBLIC_API_URL || DEFAULT_API_URL).replace(/\/$/, '');
  const fromBundler = inExpoGo()
    ? originFromRaw(NativeModules.SourceCode?.scriptURL) ||
      originFromRaw(Constants.expoConfig?.hostUri) ||
      originFromRaw(Constants.linkingUri)
    : null;
  const base = fromBundler || fromEnv;
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${base}${normalizedPath}`;
}

async function fetchWithTimeout(url, options) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    return await fetch(url, {
      ...options,
      signal: controller.signal,
    });
  } catch {
    throw new ApiError(NETWORK_ERROR_MESSAGE);
  } finally {
    clearTimeout(timer);
  }
}

export async function request(path, options = {}) {
  const { method = 'GET', headers = {}, body, ...rest } = options;
  const token = getMemoryToken();

  return fetchWithTimeout(apiUrl(path), {
    method,
    headers: {
      ...(body !== undefined ? { 'Content-Type': 'application/json' } : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
    ...rest,
  });
}

async function parseJsonResponse(response) {
  if (response.status === 204) {
    return null;
  }

  let data = null;
  const text = await response.text();
  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = null;
    }
  }

  if (!response.ok) {
    const message = data?.error?.message || 'Erro na requisição';
    throw new ApiError(message, response.status);
  }

  return data;
}

export async function requestJson(path, options = {}) {
  const response = await request(path, options);
  return parseJsonResponse(response);
}

export async function requestForm(path, formData, options = {}) {
  const { method = 'POST', headers = {}, ...rest } = options;
  const token = getMemoryToken();

  const response = await fetchWithTimeout(apiUrl(path), {
    method,
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
    body: formData,
    ...rest,
  });

  return parseJsonResponse(response);
}
