import { ApiError, requestJson } from './api';

export async function listarAnimais({ status } = {}) {
  const query = status ? `?status=${encodeURIComponent(status)}` : '';
  const data = await requestJson(`/animais${query}`);
  return Array.isArray(data?.animais) ? data.animais : [];
}

export async function criarAnimal(body) {
  const status = body?.status;
  if (status !== 'P' && status !== 'E') {
    throw new ApiError('Situação inválida', 400);
  }

  const data = await requestJson('/animais', {
    method: 'POST',
    body,
  });
  return data?.animal ?? null;
}

export function parseIdAnimal(id) {
  const n = Number(id);
  if (!Number.isInteger(n) || n <= 0) {
    return null;
  }
  return n;
}

export async function buscarAnimal(id) {
  const idAnimal = parseIdAnimal(id);
  if (!idAnimal) {
    throw new ApiError('id inválido', 400);
  }

  const data = await requestJson(`/animais/${idAnimal}`);
  return data?.animal ?? null;
}
