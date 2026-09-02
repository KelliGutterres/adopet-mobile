import { ApiError, requestForm, requestJson } from './api';

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

export function idDonoAnimal(animal) {
  return animal?.idUsuario ?? animal?.usuario?.idUsuario ?? null;
}

export function isAnimalDoUsuario(animal, idUsuario) {
  const dono = Number(idDonoAnimal(animal));
  const id = Number(idUsuario);
  if (!Number.isInteger(dono) || !Number.isInteger(id) || dono <= 0 || id <= 0) {
    return false;
  }
  return dono === id;
}

export async function atualizarAnimal(id, body) {
  const idAnimal = parseIdAnimal(id);
  if (!idAnimal) {
    throw new ApiError('id inválido', 400);
  }

  const data = await requestJson(`/animais/${idAnimal}`, {
    method: 'PATCH',
    body,
  });
  return data?.animal ?? null;
}

export async function excluirAnimal(id) {
  const idAnimal = parseIdAnimal(id);
  if (!idAnimal) {
    throw new ApiError('id inválido', 400);
  }

  await requestJson(`/animais/${idAnimal}`, {
    method: 'DELETE',
  });
}

export async function enviarImagem(id, uri) {
  const idAnimal = parseIdAnimal(id);
  if (!idAnimal) {
    throw new ApiError('id inválido', 400);
  }
  if (!uri) {
    throw new ApiError('imagem é obrigatório', 400);
  }

  const formData = new FormData();
  formData.append('imagem', {
    uri,
    name: 'foto.jpg',
    type: 'image/jpeg',
  });

  const data = await requestForm(`/animais/${idAnimal}/imagem`, formData);
  return data?.animal ?? null;
}

export async function removerImagem(id) {
  const idAnimal = parseIdAnimal(id);
  if (!idAnimal) {
    throw new ApiError('id inválido', 400);
  }

  await requestJson(`/animais/${idAnimal}/imagem`, {
    method: 'DELETE',
  });
}
