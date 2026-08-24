const ESPECIE_LABELS = {
  CAO: 'Cão',
  GATO: 'Gato',
};

const PORTE_LABELS = {
  P: 'Pequeno',
  M: 'Médio',
  G: 'Grande',
};

export const LIST_COPY = {
  A: {
    title: 'Animais para Adoção',
    subtitle: 'Encontre seu novo melhor amigo',
    empty: 'Nenhum animal para adoção cadastrado.',
  },
  E: {
    title: 'Animais Encontrados',
    subtitle: 'Ajude a encontrar o tutor',
    empty: 'Nenhum animal encontrado cadastrado.',
  },
  P: {
    title: 'Animais Perdidos',
    subtitle: 'Ajude a encontrar o animal',
    empty: 'Nenhum animal perdido cadastrado.',
  },
};

export function labelEspecie(especie) {
  if (!especie) {
    return '';
  }
  return ESPECIE_LABELS[especie] || '';
}

export function labelPorte(porte) {
  if (!porte) {
    return '';
  }
  return PORTE_LABELS[porte] || '';
}

export function labelIdade(idade) {
  if (idade === null || idade === undefined || idade === '') {
    return '';
  }
  const n = Number(idade);
  if (!Number.isInteger(n) || n < 0) {
    return '';
  }
  return n === 1 ? '1 ano' : `${n} anos`;
}

export function labelCidade(cidade) {
  if (!cidade?.nome) {
    return '';
  }
  return cidade.uf ? `${cidade.nome} - ${cidade.uf}` : cidade.nome;
}

export function labelTutorAdocao(animal) {
  return animal?.instituicao?.nome || animal?.usuario?.nome || labelCidade(animal?.cidade);
}

export function linhaCaracteristicas(animal) {
  return [labelIdade(animal?.idade), labelPorte(animal?.porte)].filter(Boolean).join(' • ');
}

export function tituloCard(animal) {
  if (animal?.status === 'E') {
    if (animal.especie === 'GATO') {
      return 'Gato encontrado';
    }
    if (animal.especie === 'CAO') {
      return 'Cachorro encontrado';
    }
    return 'Animal encontrado';
  }
  return (animal?.nome || '').trim() || 'Animal';
}

export function iniciaisNome(nome) {
  const trimmed = (nome || '').trim();
  if (!trimmed) {
    return '?';
  }
  return trimmed.charAt(0).toUpperCase();
}

export function animalMatchesFilters(animal, { busca } = {}) {
  const query = (busca || '').trim().toLowerCase();
  if (!query) {
    return true;
  }

  const haystack = [
    animal.nome,
    animal.raca?.nome,
    animal.especie,
    labelEspecie(animal.especie),
    animal.especie === 'CAO' ? 'Cachorro' : '',
    animal.cidade?.nome,
    animal.cidade?.uf,
    tituloCard(animal),
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();

  return haystack.includes(query);
}
