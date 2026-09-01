# Spec 010 — Edição do perfil do usuário (app mobile)

> **Status:** aprovada e implementada.  
> Pontos 1–5 fechados em 2026-08-31.  
> Depende de: spec 009 (tela Perfil + lápis “Em breve”); spec 003 (form de cadastro, máscara, validação); spec 002 (`AuthContext` + SecureStore); backend spec 009 (`GET`/`PATCH /usuarios/me`).  
> **Não altera** o `adopet-backend` nesta fatia.  
> Card Trello: [Perfil do usuário -> Editar conta](https://trello.com/c/VLtmn6n5/59-perfil-do-usu%C3%A1rio-editar-conta).  
> Número: a 009 entregou **consulta** + logout e deixou a edição persistida para “spec seguinte + API”. A API já existe (backend 009). **Esta fatia é a 010.**

O mobile é **somente usuário**. Edição da conta da ONG permanece no web (`PATCH /ongs/me` **não** é chamado aqui).

## Objetivo

Ativar o **lápis** da tela Perfil para o usuário **alterar os próprios dados** (nome, e-mail, contato, cidade), consumindo `PATCH /usuarios/me` com JWT. Depois do sucesso, a sessão local e a tela de consulta refletem o que a API devolveu.

Cobre o restante do **RF0001** no canal mobile (edição da conta), usabilidade (**RNF0001**) e mutação autenticada sem senha na tela (**RNF0002**).

## Recorte vs o que já existe

| Fluxo | Onde está | Nesta spec |
|-------|-----------|------------|
| Consulta do perfil + avatar + logout | spec 009 | **inalterado** (só o lápis deixa de ser “Em breve”) |
| Cadastro (nome, e-mail, contato, cidade, senha) | spec 003 | **reusar** validação, máscara e campos — **sem** senha |
| Esqueci senha (público, sem JWT) | spec 004 | **inalterado** — não reusar no perfil |
| `GET /auth/me` → `{ id, papel, email }` | spec 002 | **inalterado** (fumaça do JWT; e-mail do token pode ficar stale) |
| API `GET`/`PATCH /usuarios/me` | backend spec 009 | **consumir só o PATCH** (ponto 2-A: sem GET) |
| Edição da ONG / listar usuários | web (futuro) | **fora** |

A spec 009 continua válida para consulta, avatar, Similaridade e logout. O que muda: lápis **habilitado** → a própria tela entra em **modo edição** (ponto 1-B) → persistir na API se houve mudança → voltar à consulta na mesma tela.

## Referência visual

Não há print mobile de edição de perfil na Parte 1 (Fig. 13 = auth; Fig. 15 = listagem). Espelhar o idioma já no app.

| Fonte | Uso |
|-------|-----|
| Spec 009 (`ProfileScreen`) | Header roxo `#7C3AED`; voltar; cartões; o lápis passa a **alternar modo edição** na mesma tela |
| Spec 003 (`RegisterScreen`) | Campos, labels, máscara de telefone, UF 2 letras, erros em texto |
| Spec 007 (`AnimalFormScreen`) | Form no stack autenticado (não usar `AuthLayout`); header próprio; botão salvar; 401 → logout |
| `TextField` + ícones de `AuthIcons` | Reusar; sem `PasswordField` |

## Escopo (esta tarefa)

1. Habilitar o lápis na tela Perfil (tira disabled / “Em breve”)
2. A própria `ProfileScreen` entra em **modo edição** (ponto 1-B); sem tela nova no stack
3. Formulário: nome, e-mail, contato (máscara), cidade, UF — **sem** senha
4. `usuariosService.atualizarMe` → `PATCH /usuarios/me` com Bearer; body com os quatro campos **só se o form estiver dirty** (ponto 5-B)
5. Sucesso **200**: gravar o `usuario` da resposta no SecureStore **sem** trocar o JWT; atualizar `AuthContext`; sair do modo edição na mesma tela (ponto 3-A, adaptado ao 1-B)
6. Descartar: `Alert` se dirty (ponto 4-B); senão sai do modo edição sem request
7. Validação local alinhada ao cadastro (spec 003) e à API; erro de API/rede em PT-BR; 401 → logout
8. Atualizar `docs/CONTEXTO-PROJETO.md` após implementação

## Fora de escopo

- Alterar o `adopet-backend` (contrato, validação, envelope, reemitir JWT)
- Troca de senha **logada** (`senhaAtual` + `senhaNova`) — o `PUT /auth/usuarios/senha` é o fluxo **esqueci senha**, público, spec 004
- Usuário excluir a própria conta
- Foto de perfil / Storage / câmera
- Edição da ONG (`/ongs/me`) no web
- `GET /auth/me` enriquecido (continua `{ id, papel, email }`)
- Invalidar JWT depois de mudar e-mail (não há blacklist; decisão da API ponto 9)
- Autocomplete de cidade (`GET /cidades`)
- Alterar listagem, cadastro P/E, detalhe, auth (login/cadastro/esqueci)
- Aba Similaridade / sino / câmera P/E
- TypeScript, NativeWind, Expo Router, lib de form
- Testes automatizados
- Role `admin` no JWT

## RF/RNF relacionados

| ID | Cobertura nesta spec |
|----|----------------------|
| RF0001 | **Fecha** no mobile: cadastro (003) + consulta (009) + **edição persistida** (esta) |
| RF0002 | 401 na mutação continua deslogando; logout da 009 inalterado |
| RNF0001 | Lápis óbvio; form no mesmo padrão do cadastro; erros em PT-BR; Alert se dirty ao descartar |
| RNF0002 | Mutação com JWT; senha **nunca** no form, no body nem no storage |

## O que já existe (não reinventar)

| Já pronto | Onde |
|-----------|------|
| `PATCH /usuarios/me` (parcial; mesmo handler do PUT) | backend spec 009 |
| `GET /usuarios/me` → `{ usuario }` do banco | backend spec 009 — **não chamado** nesta fatia (2-A) |
| Objeto `usuario` (sem senha, com `cidade`) | igual login/cadastro |
| Lápis no header do Perfil | spec 009 — esta fatia **habilita** |
| Validação + `maskPhone` / `unmaskPhone` / UF | `authService.js` (spec 003) |
| `saveSession(token, usuario)` | `session.js` — hoje **sempre** grava os dois |
| `AuthContext` (`login`, `cadastrar`, `logout`) | spec 002/003 — **falta** atualizar só o `usuario` |
| `TextField`, ícones, header de stack | specs 003 e 007 |
| 401 → `logout()` | spec 007 (`AnimalForm`) / spec 008 |

O app chama **somente** `PATCH /usuarios/me` (além de `/auth/*` já existente). Nunca `GET /usuarios/me` nesta fatia. Nunca `/ongs/*`.

## Contexto técnico (API já pronta)

Base: `EXPO_PUBLIC_API_URL`.  
Envelope de erro: `{ "error": { "message": "..." } }`.  
CORS aberto. Mutação **com JWT** + papel `usuario`.

Papel `ong` em `/usuarios/me` → **403** (o app do usuário não deve chegar nesse caso). Sem JWT → **401**.

### `GET /usuarios/me`

Existe na API. **Esta fatia não chama** (ponto 2-A): prefill e consulta leem só `AuthContext.usuario`.

Não substitui o `GET /auth/me` do bootstrap: o `/auth/me` continua sendo a fumaça do JWT (`papel === "usuario"`). **Não** sobrescrever a sessão com o e-mail do `/auth/me` depois de um PATCH — o claim `email` do token fica velho até o próximo login (backend spec 009, ponto 9).

### `PATCH /usuarios/me` (preferir PATCH; PUT é o mesmo handler)

Campos **opcionais** na API; só atualiza o que vier. Body vazio → **400** `Nenhum campo para atualizar`.

Quando o form está **dirty**, o cliente envia **os quatro campos** (não é PATCH campo a campo). Se nada mudou (ponto 5-B), **não** chama a API — evita o 400 `Nenhum campo para atualizar` e um round-trip inútil.

**Body**

```json
{
  "nome": "Maria Souza",
  "email": "maria.souza@email.com",
  "contato": "51988888888",
  "cidade": { "nome": "Estrela", "uf": "RS" }
}
```

| Campo | Regra da API | Regra do cliente |
|-------|----------------|------------------|
| `nome` | se vier: trim; 1–150 | obrigatório no form; `maxLength` 150 |
| `email` | se vier: mesmo regex do cadastro; minúsculo; **409** se outro usuário já usa | `isEmailValid`; trim |
| `contato` | se vier: trim; 1–20 | máscara na UI; body só dígitos (`unmaskPhone`); 10 ou 11 dígitos (`isPhoneValid`) |
| `cidade` | se vier: find-or-create (backend spec 007) | `{ nome, uf }`; UF 2 letras; **não** enviar `idCidade` |
| `senha` | **400** se enviado | **não** existe no form |
| `status` | **400** se enviado | **não** enviar |
| `idCidade` | **400** | **não** enviar |

**200**

```json
{
  "usuario": {
    "idUsuario": 2,
    "nome": "Maria Souza",
    "email": "maria.souza@email.com",
    "contato": "51988888888",
    "status": "A",
    "idCidade": 3,
    "cidade": { "idCidade": 3, "nome": "Estrela", "uf": "RS" }
  }
}
```

**Não** devolve token novo. O JWT atual permanece. O cliente **substitui** o objeto `usuario` da sessão pelo da resposta.

| Status | Quando | `error.message` (hoje) |
|--------|--------|-------------------------|
| `400` | validação / senha / status / `idCidade` / body vazio | Nome é obrigatório / E-mail inválido / Nenhum campo para atualizar / … |
| `401` | sem JWT ou token inválido | (middleware) |
| `403` | papel não é `usuario` | Acesso negado |
| `409` | e-mail já usado por **outro** `idUsuario` | E-mail já cadastrado |

E-mail igual ao atual: ok, sem 409.

## Fluxo

```
Usuário                     App                         API
 |                           |                           |
 |  Perfil (consulta)        |                           |
 |  lápis → modo edição      |                           |
 |  altera campos → Salvar   |                           |
 |-------------------------->|  PATCH /usuarios/me       |
 |                           |  Authorization: Bearer    |
 |                           |-------------------------->|
 |                           |  200 { usuario }          |
 |                           |<--------------------------|
 |                           |  saveUsuario (token igual)|
 |                           |  setUsuario(resposta)     |
 |  mesma tela, modo consulta atualizado                 |
 |<--------------------------|                           |
```

Salvar **sem** mudança (ponto 5-B): sai do modo edição, **sem** PATCH.

401 no PATCH: `logout()` (mesmo padrão do cadastro de animal). O `RootNavigator` volta ao login.

Descartar (voltar no modo edição): se dirty → `Alert`; se confirmar ou se não dirty → modo consulta, **sem** PATCH. Logout permanece imediato (limpa a sessão de qualquer forma).

Quem não está autenticado **não** vê esta tela (`AppNavigator` só existe com sessão).

## Decisões desta rodada (2026-08-31)

| # | Tema | Decisão |
|---|------|---------|
| 1 | Onde fica o form | **B:** a própria `ProfileScreen` entra em modo edição. Sem tela `EditProfile` |
| 2 | Prefill | **A:** só `AuthContext.usuario` (sessão). Sem `GET /usuarios/me` |
| 3 | Depois do 200 | **A:** sai do modo edição e mostra a consulta **na mesma tela** (não há `goBack` de outra rota) |
| 4 | Descartar | **B:** `Alert` se o form estiver dirty |
| 5 | Save sem mudança | **B:** se nada mudou, sai do modo edição **sem** request |

Herdado da API (não reabrir, salvo a autora querer o contrário):

- JWT **não** é reemitido; se o e-mail mudar, o claim do token fica stale até o próximo login; a sessão local usa o objeto da resposta.
- Sem senha, sem status, sem exclusão da própria conta, sem foto.

Encaixe 1-B + 3-A: “voltar ao Perfil” = **desligar o modo edição**. O `←` do header no modo **consulta** continua `goBack()` para a lista (spec 009). No modo **edição**, o `←` descarta o form (com Alert se dirty) e volta à consulta, **sem** sair da tela.

Copy do Alert (ponto 4-B), salvo a autora mudar:

| | Texto |
|--|--------|
| Título | Descartar alterações? |
| Corpo | As alterações não salvas serão perdidas. |
| Cancelar | Continuar editando (fica no form) |
| Confirmar | Descartar (volta à consulta) |

Logout **não** pede esse Alert (continua imediato, spec 009).

Ponto 2-A: a consulta e o form leem a sessão. O PATCH, quando dirty, atualiza a sessão com a resposta. `GET /usuarios/me` fica para uma fatia futura se a sessão incompleta ou o multi-aparelho virarem problema.

## Contrato de UI

Idioma: **PT-BR**. Identificadores de código em inglês.

### Perfil — modo consulta (delta da spec 009)

O lápis deixa de ser disabled. **Não** há rota nova.

| Elemento | Hoje (009) | Nesta spec |
|----------|------------|------------|
| Lápis | disabled, hint “Em breve” | **habilitado**; entra em modo edição |
| a11y lápis | “Editar perfil, em breve” | “Editar perfil” (sem hint “Em breve”) |
| `←` | `goBack()` → lista | inalterado **neste modo** |
| Logout / avatar / cartão Informações | inalterado | inalterado |

Header roxo e avatar grande **não** mudam. Depois do PATCH, nome/iniciais/contato/cidade (e o círculo do `AppHeader`) atualizam porque leem o `AuthContext`.

### Perfil — modo edição (ponto 1-B)

Mesma tela, mesmo header roxo. O cartão Informações vira o formulário. Sem `AuthLayout`.

```
[ ← ]     Editar perfil      [ sair ]
────────────────────────────────────────
              (avatar grande)
              {nome}
              Usuário

  Nome      [ Maria Silva              ]
  E-mail    [ maria@email.com          ]
  Contato   [ (51) 99999-9999          ]
  Cidade    [ Lajeado     ]  UF [ RS ]

  [erro, se houver]

  [ Salvar ]
```

| Elemento | Copy / regra |
|----------|----------------|
| Título | Editar perfil |
| `←` | descarta o form (Alert se dirty, ponto 4-B) → modo consulta; **não** sai da tela |
| Sair | logout **imediato** (spec 009); sem Alert de dirty |
| Lápis | **oculto** neste modo (já está editando) |
| Prefill | sessão (`AuthContext.usuario`) — ponto 2-A |
| Nome | mesmo do cadastro (`maxLength` 150, `autoCapitalize="words"`) |
| E-mail | `keyboardType="email-address"` |
| Contato | `maskPhone` na UI; placeholder `(51) 99999-9999` |
| Cidade + UF | mesma linha do cadastro; UF só letras, 2 chars, maiúsculo |
| Senha | **não** listar (nem “alterar senha”) |
| Botão | Salvar; dirty + válido → PATCH; **não** dirty → só sai do modo (ponto 5-B); durante o request: “Salvando…” e disabled |
| Erro | faixa vermelha (`colors.dangerSoft`), `accessibilityRole="alert"` |

Dirty: qualquer campo (nome trim, e-mail trim/lower, dígitos do contato, cidade trim, UF maiúscula) diferente do snapshot do prefill.

### Navegação

```
AppNavigator (stack)
  MainTabs
  ChooseAnimalStatus
  AnimalForm
  AnimalDetail
  Profile              # consulta + modo edição — sem rota extra
```

| Tela | Auth | Comportamento |
|------|------|----------------|
| `Profile` | sessão usuário | consulta; lápis → edição; Salvar/descartar → consulta; `←` na consulta → lista |
| Auth | pública | **inalterada** |

### Copy compartilhada

| Elemento | Texto |
|----------|--------|
| Título (consulta) | Perfil |
| Título (edição) | Editar perfil |
| Lápis (a11y) | Editar perfil |
| Salvar | Salvar |
| Salvando | Salvando… |
| Voltar (consulta) | Voltar |
| Voltar (edição) | descarta o form (Alert se dirty) |
| Alert título | Descartar alterações? |
| Alert corpo | As alterações não salvas serão perdidas. |
| Alert cancelar | Continuar editando |
| Alert confirmar | Descartar |
| Erro nome | Informe o nome completo |
| Erro e-mail | Informe um e-mail válido |
| Erro contato vazio | Informe o contato |
| Erro contato inválido | Informe um contato válido |
| Erro cidade | Informe a cidade |
| Erro UF | Informe a UF (2 letras, ex.: RS) |
| 409 | E-mail já cadastrado (mensagem da API) |
| Rede | Não foi possível conectar à API. Verifique se o backend está no ar. |

Validação local **antes** do PATCH, na mesma ordem do cadastro (spec 003), **sem** os passos de senha.

### Acessibilidade mínima

- Voltar e Salvar: área ≥ 44px
- Lápis no Perfil: **não** mais `disabled`
- Campos com `label` visível (`TextField`)
- Erro com `accessibilityRole="alert"`
- Contraste: ícones brancos no header roxo; botão Salvar `primary` sobre fundo `listBackground`

## Arquitetura de código

```
src/
  screens/
    ProfileScreen.js           # + modo edição (lápis / form / Alert / Salvar)
  context/
    AuthContext.js             # + atualizarPerfil(usuarioDaApi)
  services/
    session.js                 # + saveUsuario(usuario) — token intacto
    usuariosService.js         # novo — PATCH /usuarios/me (sem GET, ponto 2-A)
    authService.js             # inalterado (só /auth/* + helpers de validação)
```

`AppNavigator` **não** ganha rota. Sem `EditProfileScreen`.

Não misturar `/usuarios/me` em `authService.js`: auth continua cadastro/login/senha/`/auth/me`.

### Sessão

Hoje `saveSession(token, usuario)` grava os dois. Depois do PATCH o token **não** muda.

```
saveUsuario(usuario)
  → SecureStore USUARIO_KEY
  → setUsuario no AuthContext
  → memoryToken / TOKEN_KEY intocados
```

`atualizarPerfil` no contexto: recebe o objeto `usuario` da resposta (já persistido pelo service ou pelo próprio contexto — um lugar só). **Não** chamar `login()` de novo.

Bootstrap (`GET /auth/me` + `usuarioFromMe`) **inalterado**: se existe `storedUsuario.email`, usa o storage. Isso é o que impede o e-mail stale do JWT de apagar a edição.

### Cliente HTTP

```js
atualizarMe({ nome, email, contato, cidade })
  → requestJson('/usuarios/me', { method: 'PATCH', body })
  → { usuario }
```

Bearer já é injetado por `api.js` via `getMemoryToken()`. Não montar header na tela. Sem `GET /usuarios/me`. Sem `UsuarioContext` novo. Telas não chamam `fetch`.

## Regras de negócio (cliente)

1. Papel `usuario` só edita a **própria** conta (`/usuarios/me`). Nunca `PATCH` com `:id`.
2. Não enviar `senha`, `status`, `idCidade` nem `idUsuario`.
3. Contato na UI sempre mascarado; o body e o storage continuam só com dígitos.
4. Cidade no body é `{ nome, uf }`, find-or-create no servidor.
5. Sucesso: substituir o `usuario` da sessão pelo da resposta; **não** gravar token novo.
6. 401 → `logout()`. Demais erros → faixa na tela (`err.message`).
7. Não logar JWT nem senha (senha nem entra).
8. Cadastro P/E que preenche cidade da sessão (`emptyAnimalForm`) passa a usar a cidade **nova** depois do PATCH, sem código extra.
9. Não chamar `/ongs/*` nem `/auth/usuarios/senha`.

## Critérios de pronto (após aprovação + implementação)

- [x] Pontos 1–5 fechados nesta spec (1-B, 2-A, 3-A, 4-B, 5-B)
- [x] Specs 001–009 já implementadas; API de contas no ar
- [x] Login `usuario@adopet.local` / `senha123` → Perfil → lápis **entra em edição na mesma tela** (não mais “Em breve”)
- [x] Form já vem com nome, e-mail, contato mascarado, cidade e UF da sessão
- [x] Salvar nome novo → 200 → mesma tela em consulta + avatar do header com nome/iniciais novos
- [x] Salvar e-mail já usado por outra conta → faixa “E-mail já cadastrado”; sessão **não** muda
- [x] Voltar no modo edição com mudança → Alert; Descartar → consulta com dados **antigos**; Continuar editando → form intacto
- [x] Salvar sem mudar nada → volta à consulta **sem** PATCH
- [x] Fechar/reabrir o app → sessão continua logada com os dados **novos** (JWT antigo + `usuario` atualizado)
- [x] Senha **não** aparece no form; esqueci senha (004) inalterado
- [x] Logout, Similaridade, sino e câmera P/E intactos
- [x] Auth (login/cadastro/esqueci) **não** reescrita
- [x] Backend intocado
- [x] CONTEXTO atualizado (checklist RF0001 edição mobile; decisão §8)
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

1. Login do usuário → avatar → Perfil → lápis
2. Conferir prefill (seed: Usuario Demo, `usuario@adopet.local`, contato, Lajeado - RS)
3. Alterar só o nome → Salvar → Perfil e header com o nome novo
4. Voltar à lista → avatar com iniciais novas (se o nome mudou as letras)
5. Editar de novo → e-mail `ong@adopet.local` (já existe na tabela Usuario? se não, usar um segundo cadastro) → 409 visível
6. Alterar cidade/UF → Salvar → linha Cidade do Perfil atualizada
7. Abrir cadastro P/E (`+`) → cidade do form é a **nova**
8. Fechar o app e reabrir → continua logado, Perfil com os dados novos
9. Voltar no modo edição com mudança → Alert → Descartar → consulta antiga; Salvar sem mudar → sem PATCH
10. Sino, Similaridade, câmera P/E e Sair como na 009

Não usar o `PUT /auth/usuarios/senha` neste fluxo.

## Checklist de implementação (após aprovação)

1. Fechar pontos 1–5 nesta spec + índice no `specs/README.md`
2. `session.saveUsuario` + `AuthContext.atualizarPerfil`
3. `usuariosService.js` (`PATCH` only)
4. `ProfileScreen`: modo edição + Alert dirty + Salvar (sem rota nova)
5. CONTEXTO (checklist RF0001 edição no mobile; tabela §8; linha da spec 009 “lápis Em breve”)

## Relação com as specs 003, 004 e 009

- **003** nasceu a conta; validação e máscara **reusam**. Senha fica no cadastro, não na edição.
- **004** continua o único jeito de trocar senha (deslogado, e-mail + senha nova). Não criar “alterar senha” no perfil.
- **009** continua a consulta. Esta 010 **só** tira o “Em breve” do lápis e grava de verdade. Sem a API, a 009 estava certa em não fingir edição local.
