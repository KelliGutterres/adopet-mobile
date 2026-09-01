import { isUfValid } from './authService';

export const IDADE_MAX = 20;

export const FORM_COPY = {
  P: {
    title: 'Cadastrar animal perdido',
    subtitle: 'Preencha as informações do animal que você perdeu.',
    nomePlaceholder: 'Ex: Luna',
  },
  E: {
    title: 'Cadastrar animal encontrado',
    subtitle: 'Preencha as informações do animal que você encontrou.',
    nomePlaceholder: 'Ex: sem nome conhecido',
  },
};

export const ESPECIE_OPTIONS = [
  { value: 'CAO', label: 'Cão' },
  { value: 'GATO', label: 'Gato' },
];

export const PORTE_OPTIONS = [
  { value: 'P', label: 'Pequeno' },
  { value: 'M', label: 'Médio' },
  { value: 'G', label: 'Grande' },
];

export function isStatusPermitido(status) {
  return status === 'P' || status === 'E';
}

export function tabDaSituacao(status) {
  return status === 'P' ? 'Perdidos' : 'Encontrados';
}

export function labelIdadeOpcao(idade) {
  const n = Number(idade);
  if (n === 1) {
    return '1 ano';
  }
  return `${n} anos`;
}

export function emptyAnimalForm(usuario) {
  return {
    nome: '',
    especie: '',
    raca: '',
    idade: '',
    porte: '',
    descricao: '',
    cidade: usuario?.cidade?.nome || '',
    uf: usuario?.cidade?.uf || '',
  };
}

export function formFromAnimal(animal) {
  return {
    nome: animal?.nome || '',
    especie: animal?.especie || '',
    raca: animal?.raca?.nome || '',
    idade: animal?.idade === null || animal?.idade === undefined ? '' : String(animal.idade),
    porte: animal?.porte || '',
    descricao: animal?.descricao || '',
    cidade: animal?.cidade?.nome || '',
    uf: animal?.cidade?.uf || '',
  };
}

function normalizeAnimalForm(form) {
  return {
    nome: (form.nome || '').trim(),
    especie: form.especie || '',
    raca: (form.raca || '').trim(),
    idade: form.idade === '' || form.idade === undefined || form.idade === null ? '' : String(form.idade),
    porte: form.porte || '',
    descricao: (form.descricao || '').trim(),
    cidade: (form.cidade || '').trim(),
    uf: (form.uf || '').trim().toUpperCase(),
  };
}

export function isAnimalFormDirty(form, snapshot) {
  const current = normalizeAnimalForm(form);
  const initial = normalizeAnimalForm(snapshot);
  return (
    current.nome !== initial.nome ||
    current.especie !== initial.especie ||
    current.raca !== initial.raca ||
    current.idade !== initial.idade ||
    current.porte !== initial.porte ||
    current.descricao !== initial.descricao ||
    current.cidade !== initial.cidade ||
    current.uf !== initial.uf
  );
}

export function validateAnimalForm(form) {
  if (!form.nome.trim()) {
    return 'Informe o nome';
  }
  if (!form.especie) {
    return 'Selecione a espécie';
  }
  if (!form.raca.trim()) {
    return 'Informe a raça';
  }
  if (!form.porte) {
    return 'Selecione o porte';
  }
  if (form.idade !== '') {
    const idade = Number(form.idade);
    if (!Number.isInteger(idade) || idade < 0) {
      return 'Informe a idade em anos (0 ou mais)';
    }
  }
  if (!form.cidade.trim()) {
    return 'Informe a cidade';
  }
  if (!isUfValid(form.uf)) {
    return 'Informe a UF (2 letras, ex.: RS)';
  }
  if (!form.descricao.trim()) {
    return 'Informe a descrição';
  }
  if (form.descricao.trim().length > 200) {
    return 'A descrição deve ter no máximo 200 caracteres';
  }
  return '';
}

export function buildAnimalBody(form, status) {
  if (status !== undefined && status !== null && status !== '') {
    if (!isStatusPermitido(status)) {
      return null;
    }
  }

  const body = {
    nome: form.nome.trim(),
    descricao: form.descricao.trim(),
    especie: form.especie,
    porte: form.porte,
    cidade: {
      nome: form.cidade.trim(),
      uf: form.uf.trim().toUpperCase(),
    },
    raca: { nome: form.raca.trim() },
  };

  if (isStatusPermitido(status)) {
    body.status = status;
  }

  if (form.idade !== '') {
    body.idade = Number(form.idade);
  }

  return body;
}
