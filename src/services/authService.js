import { requestJson } from './api';

export const MIN_SENHA = 6;
export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function isEmailValid(email) {
  return EMAIL_REGEX.test(String(email).trim());
}

export function loginUsuario({ email, senha }) {
  return requestJson('/auth/usuarios/login', {
    method: 'POST',
    body: { email, senha },
  });
}

export function me() {
  return requestJson('/auth/me');
}
