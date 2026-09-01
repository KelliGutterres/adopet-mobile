# Spec 011 — Meus animais (listar, editar e excluir no app)

> **Status:** aprovada e implementada.  
> Pontos 1–6 fechados em 2026-08-31 (pacote sugerido).  
> Depende de: spec 009/010 (Perfil); spec 007 (`AnimalForm`, `POST`); spec 008 (`AnimalDetail`, `GET /:id`); spec 005 (`AnimalCard`, `GET /animais`); backend specs 005 + 008 (`PATCH`/`DELETE` + dono).  
> **Não altera** o `adopet-backend` nesta fatia (ponto 5-A: filtro no cliente).  
> Card Trello: [Cadastro e edição de animal pelo usuário](https://trello.com/c/znr44dFV/56-cadastro-e-edi%C3%A7%C3%A3o-de-animal-pelo-usu%C3%A1rio) — a 007 cobriu só o **cadastro**; **esta fatia fecha edição e exclusão**.  
> Número: a 010 fechou a conta. Edição/exclusão de animal no mobile é **esta 011**.

O mobile é **somente usuário**. CRUD da ONG permanece no web (web spec 007). O usuário **só muta o animal que ele cadastrou** (`idUsuario === auth.id`); a API já recusa o resto com **403**.

## Objetivo

Dar ao usuário um lugar para **ver, editar e excluir os animais que ele cadastrou**. Entrada: linha **Meus animais** na tela de Perfil (consulta). Destino: tela nova no stack autenticado.

Cobre o restante do **RF0003** no canal mobile (edição + exclusão de P/E), com usabilidade (**RNF0001**) e mutação autenticada (**RNF0002**).

As listas públicas (Adoção / Perdidos / Encontrados) continuam **consulta**. O usuário não edita animal de outra pessoa nem animal de adoção da ONG.

## Recorte vs o que já existe

| Fluxo | Onde está | Nesta spec |
|-------|-----------|------------|
| Cadastro P/E (FAB → escolha → form → POST) | spec 007 | **inalterado** |
| Detalhe só leitura nas três listas | spec 008 | **inalterado** (ponto 3-B); ações só no detalhe aberto **a partir de Meus animais** |
| Perfil consulta + edição da conta + logout | specs 009 / 010 | **só entra** a linha Meus animais (consulta; some no modo edição da conta) |
| Listas A/P/E + FAB + Similaridade + sino | specs 005 / 006 / 009 | **inalterados** |
| `PATCH` / `DELETE /animais/:id` (JWT, dono) | backend 005 + 008 | **consumir** |
| CRUD da ONG (qualquer animal) | web spec 007 | **fora** |
| Menu hambúrguer / drawer | conversa de UX | **fora** — Perfil continua sendo o hub de conta |

A 007 escreveu: “Edição/exclusão depois do detalhe”. A 008 entregou só leitura. Esta 011 é essa fatia.

## Referência visual

Não há print mobile de “meus animais” na Parte 1 (Fig. 15 = listagem pública; Fig. 16–17 = web). Espelhar o idioma já no app + as ações do painel.

| Fonte | Uso |
|-------|------|
| Spec 009/010 (`ProfileScreen`) | Header roxo da marca; voltar; cards; linha de ação com chevron |
| Spec 005 (`AnimalCard`, empty/loading/erro) | Lista em cards; pull-to-refresh |
| Spec 007 (`AnimalForm`) | Mesmo form em **modo edição**; tema pela situação do animal |
| Spec 008 (`AnimalDetail`) | Toque no card → detalhe (se o ponto 2 for A) |
| Web spec 007 | Copy de exclusão; `PATCH` **sem** `status`; `DELETE` com confirmação |

## Escopo (esta tarefa)

1. Na tela Perfil (**consulta**): card/linha **Meus animais** → tela nova no stack
2. Tela `MyAnimals`: listar só os animais com `idUsuario` da sessão
3. Editar: reusar `AnimalForm` em modo edição → `GET /animais/:id` (prefill) → `PATCH /animais/:id`
4. Excluir: confirmação → `DELETE /animais/:id`
5. Estados: loading, vazio, erro de rede/API, 401 → logout, 403, 404, 409
6. Atualizar `docs/CONTEXTO-PROJETO.md` após implementação

Editar/Excluir ficam no **header do detalhe** da jornada Meus animais (1-B). Toque no card abre o detalhe (2-A). Listas públicas continuam só leitura (3-B).

## Fora de escopo

- Alterar o `adopet-backend` (filtro `?idUsuario=`, `GET /animais/meus`, envelope, paginação)
- Cadastro de adoção (`status=A`) no mobile (continua ONG / web)
- Recategorizar para adoção (`P`/`E` → `A`)
- Menu hambúrguer, drawer, nova aba na barra inferior
- Foto / Storage / câmera (RF0007 — fase 2)
- Filtros avançados (RF0005 — fase 2)
- Soft-delete
- Transferir dono (`idUsuario` / `idInstituicao` **não** vão no body)
- Edição da ONG no web
- Aba Similaridade / sino / câmera P/E das listas
- TypeScript, NativeWind, Expo Router, lib de form
- Testes automatizados
- Role `admin` no JWT

## RF/RNF relacionados

| ID | Cobertura nesta spec |
|----|----------------------|
| RF0003 | **Fecha** no mobile: cadastro (007) + **edição e exclusão** (esta). Sem adoção |
| RF0004 | Listas públicas inalteradas; recarregam no `useFocusEffect` se o animal mudou |
| RF0006 | Detalhe público inalterado (3-B); o dono edita/exclui só via Meus animais |
| RNF0001 | Entrada óbvia no Perfil; lista só dos seus; confirmar exclusão; erros em PT-BR |
| RNF0002 | Mutações com JWT; 403 se não for dono; senha/token não logados |

## O que já existe (não reinventar)

| Já pronto | Onde |
|-----------|------|
| `GET /animais` público (sem paginação; `?status=` opcional) | backend spec 005 |
| `GET /animais/:id` → `{ animal }` | backend spec 005 / mobile 008 |
| `PATCH /animais/:id` parcial; body **sem** dono | backend spec 005; web usa PATCH |
| `DELETE /animais/:id` → **204**; **409** se `Transacao` | backend spec 005 |
| `usuario` só muta se `animal.idUsuario === auth.id`; senão **403** | backend spec 008 |
| `animaisService.listarAnimais` / `buscarAnimal` / `criarAnimal` | mobile |
| `requestJson` já trata **204** (`return null`) | `api.js` |
| `AnimalForm` + `animalForm.js` (validação, body, P/E) | spec 007 — **estender** para edição |
| `AnimalCard`, `animalLabels`, empty/erro das listas | spec 005 |
| `PencilIcon`; cor `colors.danger` | spec 009 / tema |
| Stack autenticado (`Profile` já é tela, não aba) | specs 007–010 |
| Seed: Mel (`E`) do `usuario@adopet.local` | `prisma/seed.js` |

O app passa a chamar `PATCH` e `DELETE` de `/animais/:id` (além do `GET`/`POST` já existentes). Nunca `/auth/ongs/*`. Nunca mutar animal com `status=A`.

## Contexto técnico (API já pronta)

Base: `EXPO_PUBLIC_API_URL`.  
Envelope de erro: `{ "error": { "message": "..." } }`.  
`GET` público; o cliente envia Bearer assim mesmo. Mutações: JWT `usuario`.

### Autorização

| Papel | Ao criar | Editar / excluir |
|-------|----------|------------------|
| `usuario` (este app) | `idUsuario = auth.id` | só se `idUsuario === auth.id` |
| `ong` (web) | instituição logada | qualquer animal |

**403** `Acesso negado` se o usuário tentar mutar animal da ONG (Thor/Luna) ou de outro usuário.

Edição **não** transfere tutor: o body **não** envia `idUsuario` / `idInstituicao`.

### `GET /animais`

**200** `{ "animais": [ ... ] }`. Query `?status=A|P|E` opcional.

Nesta fatia, **sem** query de status (ponto 5-A): um `GET` e filtro no cliente:

```
animal.idUsuario === usuario.idUsuario
```

(`idUsuario` é escalar do Animal; o include também traz `usuario: { idUsuario, nome }`. Preferir o escalar; fallback `animal.usuario?.idUsuario`.)

Não há paginação. Ordem da API: `idAnimal` crescente — manter.

### `GET /animais/:id`

Igual spec 008. Prefill do form de edição. **404** “Animal não encontrado”.

### `PATCH /animais/:id`

O mobile usa **`PATCH`** (igual o web). Update parcial; body vazio → **400** `Nenhum campo para atualizar`.

**Body de edição** (espelho web — **sem** `status`, ponto 4-A):

```json
{
  "nome": "Mel",
  "descricao": "Cachorra encontrada perto da praça",
  "especie": "CAO",
  "idade": 1,
  "porte": "P",
  "cidade": { "nome": "Lajeado", "uf": "RS" },
  "raca": { "nome": "Vira-lata" }
}
```

Mesmos campos e obrigatoriedade do cadastro (spec 007). Não enviar `idCidade`, `idRaca`, `idUsuario`, `idInstituicao`.

Se o form **não** estiver dirty: **não** chamar a API (evita 400), só `goBack()`.

**200** `{ animal }`. **403** não é dono. **404** não existe.

### `DELETE /animais/:id`

**204**. **403** não é dono. **404** não existe. **409** `Animal possui transações vinculadas e não pode ser excluído`.

## Decisões desta rodada (2026-08-31)

Pacote sugerido aceito pela autora.

| # | Tema | Decisão |
|---|------|---------|
| 1 | Onde aparecem Editar e Excluir | **B** — no header do detalhe (lápis + lixeira), só na jornada Meus animais |
| 2 | Toque no card em Meus animais | **A** — abre `AnimalDetail` (mesmo da 008) com `from: 'MyAnimals'` |
| 3 | Mutar também a partir das listas públicas? | **B** — não; gestão só em Meus animais |
| 4 | Trocar situação P ↔ E na edição? | **A** — não (`PATCH` omite `status`) |
| 5 | Como obter “meus” animais | **A** — `GET /animais` sem status + filtro `idUsuario` no cliente |
| 6 | Lista vazia | **B** — texto + botão “Cadastrar animal” → `ChooseAnimalStatus` |

Meus animais é a **única** superfície de gestão. O card abre o **detalhe**. No detalhe aberto **a partir de Meus animais**, o header ganha lápis e lixeira. Nas abas públicas o detalhe permanece só leitura. Cadastro continua no FAB (e no empty state). Sem recategorizar. Sem spec de backend.

### Ponto 1 — por que B

A lista mistura P e E; o detalhe já existe e mostra todos os campos. Colocar mutação **no detalhe dessa jornada** evita um segundo layout de card (ícones apertados no `AnimalCard` atual) e espelha o Perfil (lápis no header). Excluir no header, com `Alert`, é o mesmo espírito do Sair.

### Ponto 3 — por que B nesta fatia

É tentador mostrar Editar no detalhe público quando `idUsuario` bate. Isso mistura **descoberta** (listas) com **gestão** (meus). A 008 foi explícita em “consulta pura”. Dá para abrir o ponto 3-A numa spec seguinte sem redesenhar Meus animais.

### Ponto 4 — por que A

O web não recategoriza no form. Situação no mobile nasce na tela Encontrei/Perdi. Mudar P→E (ou o contrário) é regra de negócio nova; não inventar nesta fatia.

### Ponto 5 — por que A

A API não pagina. Um GET e `filter` é o mesmo padrão da busca das listas. Dois GET (5-B) duplica round-trip. Endpoint novo é RF0005 / fatia de API.

## Decisões já fechadas (não reabrir)

| Tema | Decisão |
|------|---------|
| Entrada | Linha na tela **Perfil** (consulta). Não é aba. Não é hambúrguer |
| Escopo da fatia | Lista **+** editar **+** excluir (fecha RF0003 mobile) |
| Form | Reusar `AnimalForm`; não criar tela paralela |
| HTTP update | `PATCH` |
| Adoção | Usuário não cria, não edita, não exclui `status=A` |
| Header Meus animais | Roxo da marca (`colors.primary`), igual Perfil — lista mista não tem uma cor A/P/E |
| Título do card na lista | Sempre o **`nome`** (não o rótulo genérico de Encontrados da spec 005) |
| Chip de situação | Sim, na lista Meus animais (P e E misturados) |
| Busca textual | **Não** nesta fatia (lista curta; SearchBar das abas públicas inalterada) |
| Confirmar exclusão | `Alert` nativo (título + nome + “não pode ser desfeita”), igual o dirty do perfil |
| Dirty no form de edição | Se dirty, `Alert` ao voltar/cancelar (igual spec 010). Se limpo, `goBack()` |
| Depois de PATCH | `goBack()` para o **detalhe**; `useFocusEffect` recarrega o GET (Meus animais também recarrega ao voltar) |
| Depois de DELETE no detalhe | `navigate('MyAnimals')`; lista recarrega |
| Cadastro (FAB) | Inalterado; sucesso continua indo à aba P ou E (spec 007) |

## Fluxos

### Abrir Meus animais

```
Usuário                     App                           API
 |  avatar → Perfil          |                             |
 |  Meus animais             |                             |
 |-------------------------->|  GET /animais               |
 |                           |---------------------------->|
 |                           |  200 { animais }            |
 |  lista filtrada (meus)    |<----------------------------|
```

1. Perfil em **consulta** (não em edição da conta).
2. Toque em Meus animais → `navigate('MyAnimals')`.
3. Loading → `GET /animais` → filtrar `idUsuario`.
4. Voltar → Perfil.

### Editar (pacote recomendado)

```
Meus animais → detalhe (idAnimal) → lápis → AnimalForm modo edit
                                         → GET /animais/:id (prefill)
                                         → PATCH (se dirty)
                                         → goBack → detalhe (focus GET)
                                         → goBack → Meus animais (focus GET)
```

1. Só se `status` for `P` ou `E` **e** for dono.
2. Se o animal não for P/E (ex.: `A` órfão): **não** mostrar lápis/lixeira.
3. Prefill pelo GET, não pelo card (o card não tem descrição completa).
4. Tema do form = situação atual do animal (inalterável, ponto 4-A).
5. Sucesso → voltar; listas públicas também recarregam no focus (spec 005 já faz).

### Excluir (pacote recomendado)

1. Lixeira no header do detalhe (jornada Meus animais).
2. `Alert`: “Excluir **{nome}**? Esta ação não pode ser desfeita.”
3. Cancelar → nada. Confirmar → `DELETE`.
4. **204** → `navigate('MyAnimals')` (não ficar num detalhe 404).
5. **409** → mensagem da API na tela, animal permanece.

### Falha

| Situação | UI |
|----------|-----|
| Loading lista | “Carregando seus animais…” |
| Lista vazia | ponto 6 |
| Rede / 5xx | mensagem do `api.js` + Tentar novamente |
| 401 | logout → Login |
| 403 no PATCH/DELETE | `error.message` (Acesso negado); não desloga |
| 404 no GET do form | “Animal não encontrado.” + voltar à lista |
| 400 validação | `error.message`; permanece no form |
| 409 delete | `error.message` |
| `idAnimal` inválido | igual 404 |
| Perfil em modo edição da conta | linha Meus animais **não** aparece |

## Contrato de UI

Idioma: **PT-BR**. Identificadores em inglês.

### Perfil (delta)

Só no modo **consulta**. Abaixo do card Informações:

```
  ┌─ ─────────────────────────────────┐
  │  Meus animais                  ›  │
  └───────────────────────────────────┘
```

| Elemento | Copy / regra |
|----------|----------------|
| Label | Meus animais |
| A11y | `accessibilityLabel="Meus animais"`; hint “Ver animais que você cadastrou” |
| Toque | `navigate('MyAnimals')` |
| Modo edição da conta | **ocultar** a linha |
| Ícone | opcional (pata ou lista); chevron à direita, idioma do `AnimalCard` |

Não é item da barra inferior. Não muda a aba ao voltar.

### Tela `MyAnimals`

Stack autenticado, `headerShown: false` (header próprio).

```
[ ← ]     Meus animais
────────────────────────────────────────
  lista de cards (nome + chip P/E + cidade + espécie/porte)
```

| Elemento | Copy / regra |
|----------|----------------|
| Título | Meus animais |
| Voltar | `goBack()` → Perfil |
| Fundo header | `colors.primary` |
| StatusBar | `light` |
| Sino / avatar | **não** (não é lista pública) |
| FAB | **não** nesta tela (cadastro continua no `+` das abas; empty pode ter CTA) |
| Card | foto placeholder + **nome** + chip Perdido/Encontrado + cidade + espécie/porte |
| Toque no card | ponto 2 (rec.: detalhe com `idAnimal` + flag de jornada) |
| Pull-to-refresh | sim |
| Busca / filtros | não |

Empty (ponto 6-B):

| Elemento | Texto |
|----------|--------|
| Título vazio | Você ainda não cadastrou animais. |
| Apoio | Cadastre um animal perdido ou encontrado pelo botão + nas listas. |
| CTA (6-B) | Cadastrar animal → `navigate('ChooseAnimalStatus')` |

Loading / erro: mesmo espírito das listas (005).

### Detalhe na jornada Meus animais (se 1-B / 2-A)

Reusar `AnimalDetailScreen`. Distinguir a origem com param, por exemplo:

```
navigate('AnimalDetail', { idAnimal, from: 'MyAnimals' })
```

| `from` | Header direita | Excluir depois do 204 |
|--------|----------------|------------------------|
| `MyAnimals` | lápis + lixeira (se dono e P/E) | `navigate('MyAnimals')` |
| ausente (listas 005) | nenhum (spec 008) | — |

Lápis: `navigate('AnimalForm', { idAnimal, status })`.  
Lixeira: `Alert` → `DELETE`.  
A11y: “Editar animal”; “Excluir animal”.

Não usar `from` para relaxar a regra de dono: mesmo com a flag, conferir `idUsuario` da sessão. Sem lápis/lixeira se `status === 'A'` ou se não for dono.

### Formulário — modo edição

Mesma `AnimalFormScreen`. Params:

| Modo | Params | Request |
|------|--------|---------|
| Criar (007) | `{ status: 'P' \| 'E' }` | `POST` |
| Editar (esta) | `{ idAnimal, status }` | `GET` + `PATCH` |

`idAnimal` presente → edição. `status` só para tema/copy; **não** vai no PATCH (4-A). Se o GET vier com status diferente do param, o tema segue o **animal**.

Se `status` do animal não for P/E: não montar o form; voltar.

| Elemento | Criar (007) | Editar |
|----------|-------------|--------|
| Título | Cadastrar animal perdido/encontrado | Editar animal |
| Subtítulo | copy da 007 | Atualize os dados de {nome}. |
| Submit | Salvar animal | Salvar animal |
| Loading submit | Salvando… | Salvando… |
| Loading GET | — | Carregando animal… |
| Cancelar / voltar | escolha ou lista | `goBack`; Alert se dirty |

Campos: **os mesmos** da 007. Sem campo Situação. Sem fotos.

### Copy de exclusão

| Elemento | Texto |
|----------|--------|
| Título do Alert | Excluir animal |
| Corpo | Excluir **{nome}**? Esta ação não pode ser desfeita. |
| Confirmar | Excluir (estilo destructive) |
| Cancelar | Cancelar |

### Navegação

```
AppNavigator (stack)
  MainTabs
  ChooseAnimalStatus
  AnimalForm          # criar { status }  |  editar { idAnimal, status }
  AnimalDetail        # + param from?
  Profile
  MyAnimals           # nova — esta spec
```

| Tela | Auth | Comportamento |
|------|------|----------------|
| `MyAnimals` | sessão usuário | GET + filtro dono |
| `AnimalForm` edição | sessão usuário | GET + PATCH; só P/E do dono |
| `AnimalDetail` | sessão usuário | 008; ações só se ponto 1-B e `from=MyAnimals` |
| Perfil / listas / FAB | inalterados | + linha Meus animais no Perfil |

Voltar de Meus animais **não** passa pelo form. Voltar do form de edição **não** reseta o stack das tabs (diferente do POST da 007, que vai para a aba da situação).

### Acessibilidade mínima

- Linha Meus animais e ícones: área ≥ 44px
- Cards: `accessibilityRole="button"`; hint “Ver detalhes” (se 2-A)
- Lápis / lixeira com label, não só ícone
- Alert de exclusão: nome do animal no anúncio
- Contraste: lixeira `colors.danger` no header roxo (igual Sair no Perfil)

## Arquitetura de código

```
src/
  navigation/
    AppNavigator.js              # + screen MyAnimals
  screens/
    ProfileScreen.js             # + linha Meus animais (consulta)
    MyAnimalsScreen.js           # nova
    AnimalFormScreen.js          # modo edição (idAnimal)
    AnimalDetailScreen.js        # lápis/lixeira se from=MyAnimals (ponto 1-B)
  services/
    animaisService.js            # + atualizarAnimal + excluirAnimal
    animalForm.js                # formFromAnimal; buildAnimalBody sem status na edição
  components/
    AnimalCard.js                # prop opcional: título=nome + chip de situação
                                 # (não quebrar as listas 005)
    ListIcons.js                 # + TrashIcon
```

Filtro “meus”: helper pequeno em `animaisService` ou `animalLabels` — `isAnimalDoUsuario(animal, idUsuario)`.

`AnimalForm`: se `idAnimal`, `useEffect` chama `buscarAnimal`; `formFromAnimal` (espelho do web). Submit: `atualizarAnimal` vs `criarAnimal`.

Telas de lista pública **não** ganham botões de mutação nesta fatia (ponto 3-B).

## Regras de negócio (cliente)

1. Não chamar PATCH/DELETE se não for dono (esconder ações). A API é a defesa real.
2. Nunca enviar `status=A` nem mutar animal `A`.
3. Nunca enviar `idUsuario` / `idInstituicao` / ids de cidade e raça.
4. PATCH sem `status` (ponto 4-A).
5. Form limpo → sem PATCH.
6. 401 → logout. 403 → mensagem, sessão permanece.
7. Não logar JWT.
8. Quem aparece em Meus animais é só o `idUsuario` da sessão, nunca a ONG.

## Critérios de pronto (após implementação)

- [x] Pontos 1–6 fechados nesta spec
- [x] Specs 001–010 já implementadas
- [x] Login `usuario@adopet.local` / `senha123` → Perfil → Meus animais → **Mel** (seed, `E`)
- [x] Thor e Luna **não** aparecem (são da ONG)
- [x] Editar Mel → PATCH 200 → nome/descrição atualizados na lista e no detalhe
- [x] Excluir (depois de cadastrar um P/E de teste) → Alert → 204 → some da lista
- [x] Empty: usuário sem animais vê o estado vazio (ponto 6)
- [x] Perfil em edição da conta: linha Meus animais oculta
- [x] Listas públicas, FAB, detalhe público, Similaridade, sino: inalterados (se 3-B)
- [x] 401 em PATCH/DELETE desloga
- [x] Sem endpoint novo; backend intocado
- [x] CONTEXTO atualizado (checklist RF0003 mobile; decisão §8)
- [x] `specs/README.md` — status aprovada e implementada (só depois de codar)

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

1. Login do usuário → avatar → Perfil → Meus animais → Mel
2. Abrir Mel → editar um campo → Salvar → volta e o card reflete
3. Voltar ao Perfil; voltar à lista Encontrados → Mel atualizada (focus GET)
4. FAB → cadastrar um perdido de teste → aparece em Perdidos **e** em Meus animais
5. Em Meus animais, excluir o de teste → some; Mel permanece
6. Tentar (se 3-B) abrir Thor pelo detalhe em Adoção → **sem** lápis/lixeira
7. Perfil → lápis (editar conta) → linha Meus animais **não** está na tela

## Checklist de implementação (após aprovação)

1. Fechar pontos 1–6 nesta spec + índice no `specs/README.md`
2. `atualizarAnimal` / `excluirAnimal` no `animaisService`
3. `formFromAnimal` + modo edição no `AnimalForm`
4. `MyAnimalsScreen` + rota + linha no `ProfileScreen`
5. Chip de situação / título=nome no card dessa lista
6. Ações no detalhe se 1-B; `TrashIcon`; Alert de exclusão
7. CONTEXTO (RF0003 edição/exclusão mobile; decisão na tabela §8)

## Relação com as specs 007 e 008

A 007 entregou o POST e deixou mutação para depois do detalhe. A 008 entregou o GET do detalhe e deixou “botões Editar / Excluir” fora. Esta 011 **não** reabre cadastro nem o detalhe público (se 3-B). Só acrescenta a jornada de gestão a partir do Perfil.
