import { requestJson } from './api';

export function atualizarMe({ nome, email, contato, cidade }) {
  return requestJson('/usuarios/me', {
    method: 'PATCH',
    body: { nome, email, contato, cidade },
  });
}
