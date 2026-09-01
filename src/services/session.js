import * as SecureStore from 'expo-secure-store';

export const TOKEN_KEY = 'adopet.token';
export const USUARIO_KEY = 'adopet.usuario';

let memoryToken = null;

export function getMemoryToken() {
  return memoryToken;
}

export function setMemoryToken(token) {
  memoryToken = token;
}

export async function readStoredToken() {
  return SecureStore.getItemAsync(TOKEN_KEY);
}

export async function readStoredUsuario() {
  const raw = await SecureStore.getItemAsync(USUARIO_KEY);
  if (!raw) {
    return null;
  }
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export async function saveSession(token, usuario) {
  memoryToken = token;
  await SecureStore.setItemAsync(TOKEN_KEY, token);
  await SecureStore.setItemAsync(USUARIO_KEY, JSON.stringify(usuario));
}

export async function saveUsuario(usuario) {
  await SecureStore.setItemAsync(USUARIO_KEY, JSON.stringify(usuario));
}

async function deleteKey(key) {
  try {
    await SecureStore.deleteItemAsync(key);
  } catch {
    // chave ausente
  }
}

export async function clearSession() {
  memoryToken = null;
  await deleteKey(TOKEN_KEY);
  await deleteKey(USUARIO_KEY);
}
