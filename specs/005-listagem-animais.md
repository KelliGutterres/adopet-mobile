# Spec 005 — Listagem de animais (app mobile)

> **Status:** aprovada e implementada.  
> Pontos 1–7 e 6b fechados em 2026-08-23.
> Depende de: spec 001 (`api.js`); spec 002 (`AppNavigator` autenticado + JWT); backend spec 005 (`GET /animais?status=`).  
> **Não altera** o `adopet-backend`.  
> Espelho de produto: web spec 003 (três listas A / P / E no painel da ONG).  
> Card Trello: [Listagem de animais: adoção, perdidos e encontrados](https://trello.com/c/PJF6fGYg/53-listagem-de-animais-ado%C3%A7%C3%A3o-perdidos-e-encontrados).

A spec 002 deixou a Home autenticada como placeholder (“a listagem entra na próxima fatia”). A 003/004 deslocaram o número: **esta 005 é a listagem**. Detalhe do animal continua na 006; CRUD pelo usuário na 007; filtros avançados (RF0005) na 008 — fase 2.

O mobile é **somente usuário**. Listagem da ONG permanece no painel web.

## Objetivo

Substituir o placeholder autenticado por **três listagens em cards** — adoção (`A`), encontrados (`E`) e perdidos (`P`) — no layout da Figura 15 (print mobile). Cobre **RF0004**, com usabilidade (**RNF0001**).

O `GET /animais` já existe e é público. Esta fatia só **entrega a UI** no canal mobile, consumindo o contrato vigente.

## Recorte vs roadmap anterior

A spec 001 planejou a listagem como 003. A 002/003/004 empurraram: login → cadastro → esqueci senha. A listagem é **esta 005**.

| Fluxo | Web (já feito) | Mobile |
|-------|----------------|--------|
| Login + JWT | spec 002 | spec 002 |
| Cadastro | spec 005 | spec 003 |
| Esqueci senha | spec 006 | spec 004 |
| Listagem A / P / E | spec 003 | **esta spec** |
| Detalhe do animal | futura | spec 006 |
| CRUD de animal | spec 004 (web) | spec 007 |

## Referência visual (TCC)

Print anexado em `docs/prototipos/`:

| Arquivo | Tela | Uso nesta spec |
|---------|------|----------------|
| [listagem-animais-mobile.png](../docs/prototipos/listagem-animais-mobile.png) | Fig. 15 — Encontrados (roxo) + Adoção (verde) | **Fonte de layout** desta fatia |
| [login-cadastro-mobile.png](../docs/prototipos/login-cadastro-mobile.png) | Fig. 13 — auth | Só identidade da marca (pata + AdoPet); **não** redesenhar auth |

A tela **Perdidos não veio no print**. Reutilizar o **mesmo layout dos Encontrados** (localização + chips), com subtítulo, `status` e cor do tema próprios. O **título do card** em Perdidos é o `nome` (não o rótulo genérico de Encontrados).

## Escopo (esta tarefa)

1. Shell autenticado com **barra inferior** (5 itens) + header (marca AdoPet + sino)
2. Três telas de listagem parametrizadas pelo `status`: Adoção, Encontrados, Perdidos
3. Consumir `GET /animais?status=A|P|E` via `animaisService`
4. Cards no estilo do print: foto placeholder, título, linha de contexto, chips, chevron
5. Busca **no cliente** sobre a lista já carregada
6. Estados: loading, vazio, erro de rede/API, pull-to-refresh
7. Tema dinâmico por situação (roxo / verde / cor de Perdidos)
8. Itens ainda sem tela (FAB cadastrar, sino, toque no card → detalhe, aba Perfil): visíveis e **desabilitados** (“Em breve”)
9. **Sem** botão Sair nesta fatia (ponto 6b-B). Logout volta na spec 009 (tela Perfil)
10. Atualizar `docs/CONTEXTO-PROJETO.md` após implementação

## Fora de escopo

- Alterar o `adopet-backend` (contrato, paginação, novos campos, envelope)
- Tela de **detalhe** (RF0006 — spec 006); o chevron existe, o toque não navega
- Cadastro / edição / exclusão de animal (RF0003 — spec 007); o FAB `+` existe e fica **desabilitado**
- Filtros avançados no servidor (RF0005 — spec 008 / fase 2)
- Foto real / Supabase Storage (fase 2)
- Inventar campos que **não existem** no Prisma: gênero/sexo, data de encontro/perda, vacinado, vermifugado, cor, bairro, `createdAt`
- Notificações reais (sino com badge “2”)
- Edição de perfil e tela da aba Perfil (card 59 / spec 009) — a aba existe no menu, **sem ação** nesta fatia
- Botão **Sair** / logout na UI (a sessão permanece até limpar o storage do app; `logout` do `AuthContext` continua existindo, sem controle visível)
- Comparação por IA (RF0008)
- Listagem pública sem login (o app continua exigindo JWT, como hoje)
- Paginação no servidor (API devolve a lista inteira)
- TypeScript, NativeWind, Expo Router
- Testes automatizados
- Alterar telas de auth (specs 002–004)

## RF/RNF relacionados

| ID | Cobertura nesta spec |
|----|----------------------|
| RF0004 | Lista adoção, perdidos e encontrados no app do usuário |
| RF0005 | **Parcial no cliente** — busca textual; botão Filtros visível e desabilitado; sem ordenar |
| RF0006 | **Não** — só o chevron visual |
| RF0003 | **Parcial visual** — FAB cadastrar no layout, sem mutação |
| RNF0001 | Cards, empty/erro em PT-BR, loading visível, tema por situação |
| RNF0002 | JWT já injetado no `api.js`; GET público mesmo assim envia Bearer se houver sessão |

## O que já existe (não reinventar)

O mobile **consome** a API; não duplica regras de negócio.

| Já pronto | Onde |
|-----------|------|
| `GET /animais?status=A\|P\|E` → `{ animais }` (público) | backend spec 005 |
| Envelope `{ error: { message } }` | `src/services/api.js` |
| JWT no SecureStore + Bearer em memória | spec 002 |
| `AppNavigator` autenticado (hoje só `Home`) | spec 002 |
| Paleta roxa `#7C3AED`, `PawLogo` | spec 002 / `theme/colors.js` |
| Seed: Thor=`A` (ONG), Luna=`P` (ONG), Mel=`E` (usuário) | backend spec 004 |
| Três listas no painel web (espelho de produto, layout diferente) | `adopet-web` spec 003 |

O app chama **somente** `GET /animais` (além do auth já existente). Nunca `/auth/ongs/*`.

## Contexto técnico (API já pronta)

Base: `EXPO_PUBLIC_API_URL`.  
Envelope de erro: `{ "error": { "message" } }`.  
`GET` é **público**; o cliente mobile **mesmo assim** envia `Authorization: Bearer` (já injetado).

### `GET /animais`

| Query | Valores | Efeito |
|-------|---------|--------|
| `status` | `A` \| `P` \| `E` | Filtra pela situação |
| (ausente) | — | Todos — **não usar** nesta fatia; cada tela manda o próprio status |

**200** — `{ "animais": [ Animal, ... ] }`

Campos disponíveis hoje (sem foto, sem gênero, sem data, sem saúde):

```json
{
  "idAnimal": 1,
  "nome": "Thor",
  "status": "A",
  "descricao": "Cachorro dócil disponível para adoção",
  "especie": "CAO",
  "idade": 3,
  "porte": "M",
  "cidade": { "idCidade": 1, "nome": "Lajeado", "uf": "RS" },
  "raca": { "idRaca": 1, "nome": "Vira-lata" },
  "instituicao": { "idInstituicao": 1, "nome": "ONG AdoPet Demo" },
  "usuario": null
}
```

**400** — `status` inválido (o cliente só envia `A`/`P`/`E`).

Seed esperado na validação:

| Animal | `status` | Tutor | Tela |
|--------|----------|-------|------|
| Thor | `A` | ONG | Adoção |
| Mel | `E` | usuário | Encontrados |
| Luna | `P` | ONG | Perdidos |

### Print × modelo (o que cabe agora)

Mesma disciplina da web spec 003: **não inventar campo**.

| Elemento no print | No modelo/API? | Nesta fatia |
|-------------------|----------------|-------------|
| Foto | não (Storage futuro) | placeholder (iniciais do nome ou ícone de pata) |
| Título Adoção | `nome` | sim (ex.: “Thor”) |
| Título Perdidos | `nome` | sim (ex.: “Luna”) — quem perdeu o animal informa o nome |
| Título Encontrados | print usa rótulo genérico | **não** usar `nome`: `CAO` → “Cachorro encontrado”; `GATO` → “Gato encontrado” (sem flexão de gênero) |
| Localização E/P | cidade; **sem bairro** | `{cidade.nome} - {uf}` (ex.: “Lajeado - RS”) |
| “Encontrado em DD/MM/AAAA” | **não existe** (`createdAt` / data de encontro) | **omitir** a linha de data |
| ONG na Adoção | `instituicao.nome` (pode ser `null` se o tutor for usuário) | nome da ONG; se `null`, cair para `usuario.nome` ou cidade |
| “2 anos • Macho • Médio” | idade + porte; **sem gênero** | `{idade} • {porte}` (sem “Macho/Fêmea”) |
| Chip gênero (Macho/Fêmea) | **não existe** | **omitir**; segundo chip = espécie (Cão/Gato) |
| Chip porte (Pequeno/Médio/Grande) | `porte` P/M/G | sim; se `null`, omitir o chip |
| Chips Vacinado / Vermifugado | **não existem** | **omitir**; na Adoção os chips são espécie + porte |
| Cor na busca | **não existe** | busca cobre nome, raça, espécie, cidade — **sem cor** |
| Sino com badge | não existe | ícone **sem** badge e **sem** ação |
| FAB `+` Cadastrar | API existe, tela não | visível, desabilitado, “Em breve” |
| Chevron / detalhe | spec 006 | visível; toque **não** navega nesta fatia |
| “Ordenar por: Mais recentes” | sem `createdAt` | **omitir** |
| Botão Filtros | RF0005 fase 2 | visível, desabilitado, “Em breve” |
| Aba Início no print | não é uma das 3 situações | vira **Perdidos** (opção A) |
| Aba Perfil | spec 009 | visível, sem ação |

## Decisões desta rodada (2026-08-23)

| # | Tema | Decisão |
|---|------|---------|
| 1 | Barra + Perdidos | **Opção A:** Perdidos · Encontrados · + · Adoção · Perfil. Home pós-login = **Adoção** |
| 2 | Cor Perdidos | Laranja **suave** (terracota `#C2784A`) — não neon / alerta forte. Encontrados `#7C3AED`, Adoção `#16A34A` |
| 3 | Subtítulo Perdidos | **Ajude a encontrar o animal** |
| 5 | Busca / Filtros / Ordenar | Busca **funcional no cliente**; Filtros visível e **desabilitado**; “Ordenar por” **omitido** |
| 4 | Título do card | **Encontrados:** “Cachorro encontrado” / “Gato encontrado” (sem nome — não sabemos esse nível). **Perdidos e Adoção:** `nome` |
| 6 | Aba Perfil | Visível no menu, **sem ação** (“Em breve”). Sem tela de perfil nesta fatia |
| 6b | Sair | **Opção B:** nenhum Sair nesta fatia. Sessão permanece até limpar o storage; logout na spec 009 |
| 7 | Card / FAB / sino | Visíveis, **sem ação** (detalhe = 006, cadastro = 007) |

Header, item ativo da barra e FAB (quando a aba da situação estiver ativa) usam a cor do tema. Auth **não** muda.

Título do card (ponto 4, fechado):

| Tela | Seed | Título no card |
|------|------|----------------|
| Encontrados (`E`) | Mel, `CAO` | **Cachorro encontrado** |
| Encontrados (`E`) | — `GATO` | **Gato encontrado** |
| Perdidos (`P`) | Luna | **Luna** |
| Adoção (`A`) | Thor | **Thor** |

Sem “encontrada/perdida”: não há sexo no modelo. O `nome` do registro encontrado continua na API (busca no cliente ainda pode achar “Mel”), mas **não** é o título do card; entra no detalhe (spec 006).

## Escopo visual (todos os pontos fechados)

### Mapeamento aba ↔ API

| Item da barra (proposta A) | `GET` | Tema |
|----------------------------|-------|------|
| Perdidos | `?status=P` | terracota `#C2784A` |
| Encontrados | `?status=E` | roxo `#7C3AED` |
| Adoção | `?status=A` | verde `#16A34A` |
| Perfil | — | visível, **sem destino** (não seleciona aba, “Em breve”) |
| FAB `+` | — | cor da aba de lista ativa; visível e desabilitado |

Nas **três** listas, mostrar **todos** os animais daquela situação, independente do tutor (ONG ou usuário). Igual decisão da web em 2026-08-19. O cliente **não** filtra por `idUsuario`.

### Card — Encontrados e Perdidos (mesmo layout; título diferente)

1. Placeholder quadrado (iniciais do `nome` da API, mesmo quando o título da tela E é genérico)
2. Título:
   - Encontrados: “Cachorro encontrado” / “Gato encontrado”
   - Perdidos: `nome`
3. Ícone de pin + `{cidade.nome} - {uf}`
4. Chips: espécie (Cão/Gato) + porte (Pequeno/Médio/Grande), se houver
5. Chevron à direita (visual)

Sem linha de data.

### Card — Adoção

1. Placeholder quadrado (iniciais)
2. `nome`
3. Ícone de pin + `instituicao.nome` (fallback: `usuario.nome` ou cidade)
4. Linha `{idade} • {porte}` (omitir parte ausente; se os dois forem nulos, omitir a linha)
5. Chips: espécie + porte (substitutos de Vacinado/Vermifugado)
6. Chevron à direita (visual)

### Header comum das três listas

- Esquerda: `PawLogo` pequeno + “AdoPet”
- Direita: sino sem badge (**sem** Sair)
- Fundo: cor do tema da situação
- Abaixo: título + subtítulo da tela
- Busca + botão Filtros (desabilitado)

## Fluxos

### Entrar autenticado

```
Usuário                      App                          API
 |  sessão JWT                |                            |
 |--------------------------->|  GET /animais?status=A     |
 |  (home → aba Adoção)       |--------------------------->|
 |                            |  200 { animais }           |
 |                            |<---------------------------|
 |  lista Adoção (Thor)       |                            |
 |<---------------------------|                            |
```

### Trocar de lista (barra)

1. Toque em Encontrados ou Perdidos.
2. Troca a aba (React Navigation tabs).
3. Novo `GET /animais?status=E|P` (ou reaproveita cache da aba se já tiver carregado nesta sessão).
4. Busca da tela **reseta** ao entrar de novo, ou permanece por aba — **proposta:** estado local **por aba** (cada lista lembra o texto da busca enquanto o app estiver aberto).

### Busca (cliente)

Aplicada **depois** do GET, sem nova request:

- texto em `nome`, `raca.nome`, label de espécie (cão/gato), `cidade.nome`, `cidade.uf`

### Sem resultados / falha

| Situação | UI |
|----------|----|
| Array vazio (API) | empty da tela (“Nenhum animal para adoção cadastrado.” / “…perdido…” / “…encontrado…”) |
| GET ok, busca sem match | “Nenhum animal encontrado com essa busca.” |
| API fora / rede | mensagem já usada no `api.js` (“Não foi possível conectar à API…”) |
| 401 | deslogar e ir para o login (mesmo critério da spec 002) |

Pull-to-refresh dispara de novo o `GET` da aba atual.

## Contrato de UI

Idioma: **PT-BR**. Identificadores de código em inglês.

### Navegação

`AppNavigator` deixa de ser um stack só com Home. Passa a ter **tabs** (`@react-navigation/bottom-tabs`) como raiz autenticada.

| Tela | Auth | Comportamento |
|------|------|----------------|
| `Adocao` | exige sessão usuário | lista `status=A` |
| `Encontrados` | idem | lista `status=E` |
| `Perdidos` | idem | lista `status=P` |
| `Perfil` | — | **não é tela**; item da barra visível e desabilitado |
| Auth (Login/Cadastro/Esqueci) | pública | **inalterado** |

Dependência nova (única desta fatia): `@react-navigation/bottom-tabs` (alinhada à v7 já usada no projeto). Sem biblioteca de UI (Paper, NativeBase). FAB central = `tabBarButton` customizado, não um 6º destino.

### Copy compartilhada

| Elemento | Texto |
|----------|--------|
| Busca | placeholder “Buscar por nome, raça ou localização...” |
| Filtros | Filtros (disabled, “Em breve”) |
| Loading | Carregando animais… |
| Vazio `A` | Nenhum animal para adoção cadastrado. |
| Vazio `E` | Nenhum animal encontrado cadastrado. |
| Vazio `P` | Nenhum animal perdido cadastrado. |
| Busca sem match | Nenhum animal encontrado com essa busca. |
| Erro de rede | Não foi possível conectar à API. Verifique se o backend está no ar. |
| Tentar de novo | Tentar novamente |
| Perfil (aba) | Perfil (disabled, “Em breve”) |
| FAB | acessibilidade: “Cadastrar animal, em breve” |
| Sino | acessibilidade: “Notificações, em breve” |
| Labels espécie | Cão / Gato |
| Labels porte | Pequeno / Médio / Grande |
| Idade | `{n} ano` / `{n} anos`; se `null`, omitir |

### Identidade visual (do print)

| Token | Valor |
|-------|--------|
| Primária Encontrados | `#7C3AED` |
| Primária Adoção | `#16A34A` |
| Primária Perdidos | `#C2784A` (terracota suave) |
| Fundo da lista | `#F3F4F6` (cinza claro do print, não o lilás do login) |
| Superfície (card, barra) | `#FFFFFF` |
| Texto | `#111827` |
| Texto secundário | `#6B7280` |
| Borda | `#E5E7EB` |
| Chip espécie | fundo suave da cor do tema |
| Chip porte | fundo azul suave `#DBEAFE` / texto `#1D4ED8` |
| Raio do card | ~12–16px |
| Área de toque | mín. 44px (FAB e abas) |

Login/cadastro/esqueci senha **não mudam** (continuam no roxo da spec 002).

### Acessibilidade mínima

- Aba ativa com `tabBarAccessibilityLabel` + estado selecionado
- FAB, sino e aba Perfil: `accessibilityState={{ disabled: true }}` + hint “Em breve”
- Lista: `accessibilityRole="list"`; card com label composto (título + cidade)
- Loading `accessibilityLiveRegion`; erro visível em texto (não só cor)
- Contraste do header branco sobre a cor do tema

## Arquitetura de código

```
src/
  theme/
    colors.js                 # + adoption / lost / found
  navigation/
    AppNavigator.js           # Bottom tabs (deixa de ser só stack Home)
  screens/
    AnimalListScreen.js       # uma tela, parametrizada pelo status
    HomeScreen.js             # removida — não manter placeholder
    # sem ProfileScreen nesta fatia (aba desabilitada)
  components/
    AppHeader.js              # logo + sino
    AnimalCard.js             # layout A vs E/P
    SearchBar.js
    BottomTabBar.js           # barra custom (FAB central) se o default não chegar no print
  services/
    animaisService.js         # listarAnimais({ status })
    animalLabels.js           # espécie/porte/idade; título E = Cachorro/Gato encontrado; P/A = nome
```

Fluxo: aba → `status` → `animaisService.listarAnimais` → estado local → FlatList + busca cliente.

Sem `AnimaisContext`. Sem persistir a lista no SecureStore.

Uma tela só (`AnimalListScreen`) com `route`/`status` — não copiar três arquivos quase iguais. O card decide o layout pela situação (`A` vs `E`/`P`) e o título (`E` genérico vs `P`/`A` nome).

## Regras de negócio (cliente)

1. Chamar **somente** `GET /animais` (além do auth já existente).
2. Situação só pela **aba** ↔ `status`; não misturar as três listas num único GET sem filtro.
3. Busca só no cliente.
4. Não persistir a lista no dispositivo.
5. Não logar o JWT.
6. Labels em PT-BR; códigos `A`/`P`/`E` e `CAO`/`GATO` só no código.
7. Placeholder de foto local — sem URL externa e sem Storage.
8. FAB / sino / card / aba Perfil: **não** chamar POST/PATCH/DELETE nem `GET /animais/:id`.
9. Quem aparece: **todos** os da situação, não só os do usuário logado.

## Decisões técnicas

| Item | Escolha |
|------|---------|
| Canal | **Mobile** (usuário) |
| Backend | **sem mudança** |
| Layout | cards do print (não tabela do web) |
| Perdidos | mesmo card de Encontrados |
| Barra | opção **A** (Perdidos no lugar de Início) |
| Home pós-login | aba Adoção |
| Paleta | roxo E / verde A / terracota suave P (`#C2784A`) |
| Gênero / data / vacina / vermífugo / cor / bairro | **omitir** |
| Busca | cliente |
| Filtros + ordenar | Filtros disabled; ordenar omitido |
| Foto | placeholder |
| Sino / FAB / detalhe | visíveis, sem ação |
| Perfil | visível no menu, **sem ação** |
| Sair | **omitido** nesta fatia (volta na spec 009) |
| Dados | **todos** os animais da situação |
| Tabs | `@react-navigation/bottom-tabs` |
| Título do card | E = “Cachorro/Gato encontrado”; P e A = `nome` |

## Critérios de pronto

- [x] Spec aprovada (pontos 1–7 e 6b fechados em 2026-08-23)
- [x] Specs 001–004 já implementadas
- [x] Login `usuario@adopet.local` / `senha123` → aba Adoção com **Thor**
- [x] Aba Encontrados → **Cachorro encontrado**; Perdidos → **Luna**
- [x] Item ativo da barra acompanha a aba e a cor do tema
- [x] Títulos/subtítulos diferentes por tela (incluindo Perdidos)
- [x] Card Adoção = **Thor**; Encontrados = **Cachorro encontrado** (Mel); Perdidos = **Luna**
- [x] Busca por “Thor” na Adoção deixa só Thor; limpar volta a lista
- [x] Lista vazia / busca sem match com empty visível
- [x] Backend parado → erro de rede + Tentar novamente
- [x] Pull-to-refresh recarrega a aba atual
- [x] Sem botão Sair; aba Perfil não navega
- [x] FAB, sino e toque no card visíveis e inativos
- [x] Sem gênero, data, vacinado, vermifugado, cor, bairro
- [x] Auth (login/cadastro/esqueci) **não** foi reescrita
- [x] Backend intocado
- [x] Layout reconhecível em relação ao print (header + busca + cards + barra)
- [x] CONTEXTO atualizado

## Como validar (após implementação)

Pré-requisito: API + seed (`npm run prisma:seed` no backend).

```bash
# terminal 1
cd D:\adopet-backend
npm run dev

# terminal 2
cd D:\adopet-mobile
npx expo start
```

1. Login do usuário → aba Adoção com **Thor** (nome + ONG)
2. Aba Encontrados → **Cachorro encontrado** (registro Mel); Perdidos → **Luna**
3. Buscar na lista filtra no cliente; limpar volta a lista
4. Parar o backend e puxar para atualizar → erro de rede
5. Aba Perfil visível e sem ação; **não** há Sair (para retestar o login: limpar dados do Expo Go / app)
6. Conferir visualmente com `docs/prototipos/listagem-animais-mobile.png`

## Checklist de implementação (após aprovação)

1. Instalar `@react-navigation/bottom-tabs`
2. Tokens de cor por situação em `theme/colors.js`
3. `animaisService` + `animalLabels`
4. `AnimalListScreen` + `AnimalCard` + `SearchBar` + `AppHeader`
5. `AppNavigator` em tabs (Perdidos / Encontrados / FAB / Adoção / Perfil)
6. Tabs com Perfil desabilitado; remover placeholder da Home (**sem** Sair)
7. Empty / loading / erro / pull-to-refresh
8. CONTEXTO (checklist mobile RF0004; decisão na tabela §8)
