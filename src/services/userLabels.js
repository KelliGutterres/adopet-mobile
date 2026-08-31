export function displayNomeUsuario(usuario) {
  const nome = (usuario?.nome || '').trim();
  if (nome) {
    return nome;
  }
  return (usuario?.email || '').trim();
}

export function iniciaisUsuario(nome) {
  const parts = String(nome || '')
    .trim()
    .split(/\s+/)
    .filter(Boolean);
  if (parts.length === 0) {
    return '?';
  }
  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }
  return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
}

export function labelCidadeUsuario(cidade) {
  const nome = (cidade?.nome || '').trim();
  const uf = (cidade?.uf || '').trim();
  if (!nome && !uf) {
    return '';
  }
  if (!uf) {
    return nome;
  }
  if (!nome) {
    return uf;
  }
  return `${nome} - ${uf}`;
}
