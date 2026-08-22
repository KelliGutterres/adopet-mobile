# Spec 002 — Tela de login do usuário (app mobile)

> **Status:** aprovada e implementada.  
> Depende de: spec 001 (scaffold Expo + `api.js` + nav); backend specs 003 (login JWT) e 004 (seed).  
> **Não altera** o `adopet-backend`.  
> Card Trello: [Tela login + persistência do JWT](https://trello.com/c/G0NQvNNN/52-tela-login-persistencia-do-jwt).

## Objetivo

Permitir que o **usuário** autentique no app mobile com **e-mail e senha**, consumindo `POST /auth/usuarios/login`, persistindo o JWT e entrando numa área autenticada mínima (Home placeholder). Cobre **RF0002**, com usabilidade (**RNF0001**) e sem expor a senha (**RNF0002**).

Referência visual: **Figura 13** — [login-cadastro-mobile.png](../docs/prototipos/login-cadastro-mobile.png) (login à esquerda; cadastro à direita só como contexto). O layout do **login** segue o print. Cadastro, OAuth e esqueci senha **não** são implementados nesta fatia.

O mobile é **somente usuário**. Login de `ong` permanece no painel web (`POST /auth/ongs/login` **não** é chamado aqui).

## Recorte vs spec 001

A spec 001 planejou a 002 como “login + cadastro + esqueci senha”. Fechado pela autora (2026-08-22): **só login + JWT**.

| Fluxo | Web (já feito) | Mobile (esta spec) |
|-------|----------------|--------------------|
| Login + JWT + sessão | spec 002 | **esta spec** (card 52) |
| Esqueci senha | na spec 002 | **fora** — spec futura |
| Cadastro | spec 005 | **fora** — [card 51](https://trello.com/c/UrE2dIP9), spec seguinte |
| Layout fiel ao print | spec 004 (Fig. 14) | **nesta spec** (Fig. 13, só o login) |

## Escopo (esta tarefa)

1. Tela de login no layout da Fig. 13: e-mail, senha, botão Entrar, estados de loading/erro
2. Serviço `authService` → `POST /auth/usuarios/login`
3. Persistência do `token` + dados do `usuario` no **SecureStore** (`expo-secure-store`)
4. `AuthContext` + dois stacks: público (`Login`) e autenticado (`Home` placeholder)
5. Logout no placeholder (limpa storage; **sem** endpoint de logout — a API não tem)
6. Links **Esqueceu sua senha?** e **Cadastre-se** visíveis e **desabilitados** (“Em breve”)
7. Bootstrap: se houver token, validar com `GET /auth/me`; se `papel !== "usuario"` ou 401, deslogar
8. Injeção do Bearer no `api.js` (cache em memória; SecureStore é assíncrono)
9. Olho para mostrar/ocultar senha
10. Atualizar `docs/CONTEXTO-PROJETO.md` após implementação

## Fora de escopo

- Cadastro de usuário (`POST /auth/usuarios/cadastro`) — spec seguinte (card 51)
- Fluxo esqueci senha (`PUT /auth/usuarios/senha` + tela funcional) — spec futura
- Login Google / Apple / qualquer OAuth — o print mostra; **não implementar** (igual web spec 004). Sem divisor “ou”
- Edição de perfil (RF0001 parcial — a API ainda **não** tem endpoint; card Trello 59)
- Listagem / detalhe / CRUD de animais — a Home autenticada é só placeholder
- Login de ONG / papéis mistos
- Refresh token, blacklist, logout server-side
- Rate limiting / captcha
- Alterar CORS, envelope de erro ou contratos da API
- TypeScript, NativeWind, Expo Router
- Testes automatizados
- Alterações no `adopet-backend`

## RF/RNF relacionados

| ID | Cobertura nesta spec |
|----|----------------------|
| RF0002 | Login e-mail/senha no app do usuário |
| RF0001 | **Não** — cadastro/edição de conta |
| RF0009 | **Não** — login da ONG é no web |
| RNF0001 | Formulário no layout da Fig. 13; erros em PT-BR; loading no botão |
| RNF0002 | Senha só no body da API; nunca persistida; token no SecureStore |

## O que já existe (não reinventar)

O mobile **consome** a API; não duplica regras de negócio.

| Já pronto | Onde |
|-----------|------|
| `POST /auth/usuarios/login` → `{ usuario, token }` | backend spec 003 |
| `GET /auth/me` (JWT) → `{ id, papel, email }` | backend spec 003 |
| Envelope de erro `{ error: { message } }` | `src/services/api.js` (spec 001) |
| `apiUrl` / `request` / `requestJson` / `ApiError` | spec 001 |
| Seed: `usuario@adopet.local` / `senha123` (nome “Usuario Demo”) | backend spec 004 |
| Painel web da ONG (não misturar papéis) | `adopet-web` spec 002 |

O app chama **somente** `/auth/usuarios/login` + `GET /auth/me`. Nunca `/auth/ongs/*`.

## Contexto técnico (API já pronta)

Base: `EXPO_PUBLIC_API_URL` (ex.: `http://127.0.0.1:3000` no simulador; `http://10.0.2.2:3000` no emulador Android; IP LAN no Expo Go).  
Envelope de erro: `{ "error": { "message": "..." } }`.  
CORS aberto no backend (`app.use(cors())`).

### `POST /auth/usuarios/login`

**Body**

```json
{
  "email": "usuario@adopet.local",
  "senha": "senha123"
}
```

**200**

```json
{
  "usuario": {
    "idUsuario": 1,
    "nome": "Usuario Demo",
    "email": "usuario@adopet.local",
    "contato": "51999999999",
    "status": "A",
    "idCidade": 1,
    "cidade": { "idCidade": 1, "nome": "Lajeado", "uf": "RS" }
  },
  "token": "<jwt>"
}
```

JWT (claim): `{ "sub": idUsuario, "papel": "usuario", "email": "..." }` — HS256, expiração `JWT_EXPIRES_IN` (hoje `7d`).  
A resposta **nunca** inclui `senha`.

**401** — `{ "error": { "message": "Credenciais inválidas" } }`  
(e-mail inexistente, senha errada, body vazio **ou e-mail de ONG** — mensagem genérica; **não** distinguir se o e-mail existe).

### `GET /auth/me`

Header: `Authorization: Bearer <token>`  
**200:** `{ "id", "papel", "email" }`  
**401:** token ausente, inválido ou expirado.

Usar no bootstrap para recusar token de `ong` colado no SecureStore.

## Fluxos

### Login

```
Usuário                     App                         API
 |                           |                           |
 |  e-mail + senha           |                           |
 |-------------------------->|  POST /auth/usuarios/login|
 |                           |-------------------------->|
 |                           |  200 { usuario, token }   |
 |                           |<--------------------------|
 |                           |  SecureStore + memória    |
 |  stack autenticado (Home) |                           |
 |<--------------------------|                           |
```

### Já autenticado

1. App sobe → lê SecureStore (assíncrono) → preenche cache em memória.
2. Sem token → stack público (`Login`).
3. Com token → `GET /auth/me`. Se `papel === "usuario"` → sessão ok. Senão (401 ou `ong`) → limpar storage e ir para `Login`.
4. Enquanto o bootstrap não termina (`ready === false`) → tela de carregamento (“Carregando…”), para não piscar o login.

## Contrato de UI

Idioma: **PT-BR**. Identificadores de código em inglês.

### Navegação (React Navigation, dois stacks)

Espelho das rotas do web (`/login` pública, `/painel` protegida). Aqui não há URL: o `RootNavigator` escolhe o stack pela sessão.

| Tela | Auth | Comportamento |
|------|------|----------------|
| `Login` | pública; se já logado → stack autenticado | Login |
| `Home` | exige sessão `usuario` | Placeholder (“Olá, {nome}” + Sair) |
| bootstrap | — | Splash textual “Carregando…” até `ready` |

`headerShown: false` no Login (o layout da tela traz a marca). Na Home autenticada, header nativo com título “AdoPet” é aceitável nesta fatia.

Não há tela `ForgotPassword` nem `Register` nesta spec.

### Login — campos e copy

Copy de **erro / loading / validação**: desta spec (ponto 7).  
Labels visíveis do formulário: **Fig. 13** (ponto 3), alinhadas ao que o print mostra no login.

| Elemento | Copy |
|----------|------|
| Marca | AdoPet |
| Slogan | Conectando pets a um novo começo 💜 |
| Título | Bem-vindo de volta! |
| Subtítulo | Faça login para continuar |
| E-mail | label “E-mail”; placeholder “Digite seu e-mail”; `autoCapitalize="none"`; `keyboardType="email-address"`; `autoCorrect={false}` |
| Senha | label “Senha”; placeholder “Digite sua senha”; `secureTextEntry` + toggle olho |
| Link senha | “Esqueceu sua senha?” — **visível e desabilitado** (`accessibilityHint="Em breve"`); não navega |
| Submit | Entrar (+ ícone de login); loading: botão desabilitado; texto “Entrando…” |
| Cadastre-se | “Ainda não tem uma conta? **Cadastre-se**” — **visível e desabilitado** (`Em breve`); não navega |
| Erro API 401 | Credenciais inválidas |
| Erro de rede | Não foi possível conectar à API. Verifique se o backend está no ar. |
| Validação local | Informe um e-mail válido / A senha deve ter no mínimo 6 caracteres |

Ícones de campo (print): envelope à esquerda no e-mail; cadeado à esquerda na senha; olho à direita na senha.

### Layout (Fig. 13 — tela de login)

- Fundo lavanda claro, patas decorativas discretas.
- Topo: logo (pata + cão/gato), “AdoPet” em roxo, slogan.
- Cartão branco com cantos superiores arredondados (~28px) sobrepondo o fundo; formulário empilhado.
- Rodapé ilustrativo: silhuetas de cão e gato (SVG simples; não recortar o print).
- Primária **`#7C3AED`** (mesmo token do web `--painel-primary`).
- `KeyboardAvoidingView` + `ScrollView` para o teclado não cobrir os campos.
- **Sem** botões Google/Apple e **sem** divisor “ou” (pedido da autora / padrão web spec 004).

A tela de cadastro do print **não** entra nesta fatia.

### Acessibilidade mínima

- `TextInput` com `accessibilityLabel` (e-mail / senha)
- Erro da API em texto visível (`accessibilityRole="alert"`)
- Toggle da senha com `accessibilityLabel` (“Mostrar senha” / “Ocultar senha”)
- Botão Entrar com `accessibilityState={{ disabled, busy }}` no loading
- Cadastre-se e Esqueceu sua senha? com `accessibilityState={{ disabled: true }}` e hint “Em breve”
- Área de toque ≥ 44px no olho e no botão Entrar

## Persistência e sessão

Espelho das chaves do web (`adopet.token` / `adopet.ong`), com o perfil do **usuário**.

| Chave | Valor | Onde |
|-------|--------|------|
| `adopet.token` | string JWT | SecureStore + cache em memória |
| `adopet.usuario` | JSON do `usuario` público (sem senha) | SecureStore |

- **Não** guardar a senha.
- SecureStore: `setItemAsync` / `getItemAsync` / `deleteItemAsync`. Chaves: letras, números, `.`, `-` e `_`.
- Limite histórico ~2048 bytes no iOS: JWT + JSON do usuário cabem.
- Header das próximas chamadas: `Authorization: Bearer ${token}`. O `request()` lê um **cache em memória** preenchido no bootstrap / login / logout (`src/services/session.js`).
- Logout: apagar as duas chaves no SecureStore, zerar o cache, voltar ao stack público.
- Token de `ong` no storage **nunca** libera o app.

Pacote: `npx expo install expo-secure-store`. Ícones: `react-native-svg` (mesmo traço do web). Sem AsyncStorage nesta fatia.

## Arquitetura de código

Camadas mobile (contexto): **screens / components / services / hooks / navigation**. `context/` entra nesta fatia (já previsto na spec 001). Arquivos em **`.js`**, como o restante do app.

```
src/
  screens/
    LoginScreen.js
    HomeScreen.js             # placeholder autenticado
  components/
    AuthLayout.js             # marca + cartão + ilustração
    AuthIcons.js              # envelope, cadeado, olho, login
    PasswordField.js
    TextField.js
    PawLogo.js
  navigation/
    RootNavigator.js          # ready gate + escolhe stack
    AuthNavigator.js
    AppNavigator.js
  services/
    api.js                    # + Bearer a partir do cache
    authService.js            # loginUsuario, me
    session.js                # SecureStore + cache em memória
  context/
    AuthContext.js            # session, login, logout, bootstrap
  hooks/
    useAuth.js                # reexport do context (igual web)
  theme/
    colors.js                 # paleta roxa
App.js                        # AuthProvider envolvendo o navigator
docs/prototipos/
  login-cadastro-mobile.png
```

Fluxo: tela → `useAuth` / context → `authService` → `api.js` (`fetch`) → backend.

Igual ao web: telas não chamam `fetch` direto; `AuthContext` não conhece React Navigation (o `RootNavigator` troca de stack).

## Regras de negócio (cliente)

1. Chamar **somente** `/auth/usuarios/login` e `GET /auth/me`.
2. Validar e-mail/senha no cliente **antes** do POST (menos round-trip); a API continua sendo a fonte da verdade.
3. Exibir `error.message` da API quando houver; fallback genérico se o JSON não vier (`ApiError` da spec 001).
4. Não logar `senha` nem o JWT no `console`.
5. Credencial de **ONG** no formulário do usuário → 401 “Credenciais inválidas” (comportamento correto da API).
6. E-mail: trim; a API já normaliza lowercase.
7. Links desabilitados não disparam navegação nem alerta modal.

## Decisões técnicas (fechadas em 2026-08-22)

| Item | Escolha |
|------|---------|
| Storage | `expo-secure-store` + cache em memória para o Bearer |
| Cadastro usuário | **não** nesta fatia (card 51 / spec seguinte) |
| Esqueci senha | **não** nesta fatia (spec futura); link visível e desabilitado |
| Pós-login | Home placeholder “Olá, {nome}” + Sair (listagem = spec 003) |
| Visual | Fig. 13 (`docs/prototipos/login-cadastro-mobile.png`); paleta `#7C3AED` |
| Cadastre-se | visível, desabilitado, “Em breve” |
| Google / Apple / “ou” | **não** |
| Context | `AuthContext` (sem Redux) |
| Mostrar senha | sim (olho) |
| Navegação | dois native-stacks (auth vs app) |
| Copy de erro/validação | desta spec |
| Copy visível do login | Fig. 13 |

## Pontos abertos para refinamento

Nenhum. Fechados em 2026-08-22:

1. Cadastro nesta fatia — **não**.
2. Esqueci senha agora — **não** (spec futura).
3. Figura 13 — anexada em `docs/prototipos/login-cadastro-mobile.png`.
4. Cadastre-se — visível e desabilitado.
5. Mostrar/ocultar senha — sim.
6. Home autenticada — placeholder + Sair.
7. Copy de erro/validação — desta spec; labels do form — print.

## Critérios de pronto

- [x] Spec aprovada (pontos 1–7 fechados)
- [x] Spec 001 já implementada
- [x] Login com `usuario@adopet.local` / `senha123` entra na Home autenticada
- [x] Senha errada ou e-mail de ONG → mensagem “Credenciais inválidas”, permanece no Login
- [x] Token e `usuario` no SecureStore; senha nunca persistida
- [x] Reabrir o app autenticado mantém a sessão (token válido)
- [x] Token expirado / `papel !== "usuario"` → volta ao Login
- [x] Home sem token não é alcançável (stack público)
- [x] Cadastre-se e Esqueceu sua senha? visíveis e inativos
- [x] Sem botões Google/Apple e sem “ou”
- [x] Teclado não cobre os campos; formulário usável no Expo Go **e** no emulador Android
- [x] Backend intocado
- [x] CONTEXTO atualizado (checklist mobile RF0002; decisão SecureStore na tabela §8)

## Como validar (após implementação)

Pré-requisito: API + seed (`npm run prisma:seed` no backend).

```bash
# terminal 1
cd D:\adopet-backend && npm run dev

# terminal 2
cd D:\adopet-mobile
# .env com a URL certa (emulador vs celular)
npx expo start
```

1. Abrir o app → tela de Login (layout reconhecível em relação à Fig. 13, sem OAuth)
2. Entrar com `usuario@adopet.local` / `senha123` → Home “Olá, Usuario Demo” + Sair
3. Fechar e reabrir o app → continua autenticado
4. Sair → volta ao Login; SecureStore limpo
5. Tentar `ong@adopet.local` / `senha123` → erro de credenciais
6. Cadastre-se e Esqueceu sua senha? não navegam
7. Parar o backend e clicar Entrar → mensagem de falha de rede

## Checklist de implementação (após aprovação)

1. `npx expo install expo-secure-store react-native-svg`
2. `session.js` (SecureStore + cache) + Bearer no `api.js`
3. `authService` + `AuthContext` + `useAuth` (login, logout, bootstrap `/auth/me`)
4. `AuthLayout` + campos + `LoginScreen` (Fig. 13, sem OAuth)
5. `AuthNavigator` / `AppNavigator` / `RootNavigator` (ready gate)
6. `HomeScreen` placeholder autenticado + Sair
7. `App.js`: `AuthProvider`
8. CONTEXTO (checklist mobile RF0002; decisão na tabela §8)
9. `specs/README.md` — status aprovada e implementada (só depois de codar)
