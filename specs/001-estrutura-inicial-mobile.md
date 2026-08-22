# Spec 001 — Estrutura inicial do app mobile (usuário)

> **Status:** aprovada e implementada.  
> Depende de: nada no repo mobile no início da fatia (`docs/`, `specs/`, `.cursor/rules/`).  
> API já pronta no `adopet-backend` (auth JWT usuário + CRUD `/animais`).  
> Card Trello: [Navegação base do app + serviço de API + env](https://trello.com/c/3LyXzbdr/50-navegacao-base-do-app-servico-de-api-env).  
> Próxima fatia: spec 002 (login, cadastro **e** esqueci senha do usuário + JWT).

## Objetivo

Criar a base do repositório `adopet-mobile` com **React Native**, canal exclusivo do **usuário** (papel JWT `usuario`). A ONG permanece no painel web.

Esta fatia **não** entrega login, cadastro nem listagem. Só o scaffold para a spec 002 plugar o fluxo de autenticação — o mesmo recorte da web spec 001.

Cobre a fundação do canal mobile (**RF0001/RF0002** ainda não; **RNF0001** layout base; **RNF0002** URL da API só em `.env`).

## Escopo (esta tarefa)

1. Scaffold **Expo** (workflow gerenciado) + React Native, **JavaScript**
2. Organização de pastas do MVP (`screens` / `components` / `services` / `hooks` / `navigation`)
3. Navegação mínima (stack placeholder)
4. Cliente HTTP base apontando para a API (`EXPO_PUBLIC_API_URL`)
5. Tema/estilo global mínimo (`StyleSheet`), sem design system completo
6. `.env.example`, `.gitignore`, `README.md` de desenvolvimento
7. Atualizar `docs/CONTEXTO-PROJETO.md` após aprovação + implementação

## Fora de escopo

- Tela de login / JWT / persistência de sessão (spec 002 — card Trello 52)
- Cadastro de usuário (spec 002 — card Trello 51)
- Esqueci senha (`PUT /auth/usuarios/senha`) — **spec 002** (não fica para spec futura)
- Listagem / detalhe / CRUD de animais
- Filtros (RF0005 — fase 2)
- Upload, câmera, galeria (RF0007 — fase 2)
- IA (RF0008 — fase 2)
- Edição de perfil (RF0001 parcial — a API ainda **não** tem endpoint; card Trello 59)
- TypeScript
- NativeWind / styled-components / biblioteca de UI (Paper, NativeBase, etc.)
- Expo Router (navegação desta fatia: React Navigation)
- EAS Build / publicação nas lojas
- Testes automatizados
- Alterações no `adopet-backend`

## RF/RNF relacionados

| ID | Cobertura nesta spec |
|----|----------------------|
| RF0001 / RF0002 | Fundação do canal mobile do usuário (telas na 002+) |
| RF0004 | Navegação pronta para listagens depois |
| RNF0001 | App abre com tela placeholder legível |
| RNF0002 | URL da API só em `.env` (sem secrets) |

## O que já existe (não reinventar)

O mobile **consome** a API; não duplica regras de negócio.

| Já pronto | Onde |
|-----------|------|
| `POST /auth/usuarios/cadastro` (body com `cidade: { nome, uf }`; `contato` obrigatório; devolve `{ usuario, token }`) | backend specs 003 + 007 |
| `POST /auth/usuarios/login` → `{ usuario, token }` | backend spec 003 |
| `PUT /auth/usuarios/senha` `{ email, senha }` → 204 | backend spec 006 |
| `GET /auth/me` (JWT) → `{ id, papel, email }` | backend spec 003 |
| `GET /animais?status=A\|P\|E` e `GET /animais/:id` **públicos** | backend spec 005 |
| `POST` / `PATCH` / `DELETE /animais` com JWT; usuário só o próprio | backend specs 005 + 008 |
| Envelope de erro `{ error: { message } }` | API atual |
| CORS aberto (`app.use(cors())`) | backend |
| Seed: `usuario@adopet.local` / `senha123` | backend spec 004 |
| Painel web da ONG (não misturar papéis) | `adopet-web` |

O app mobile chama **somente** `/auth/usuarios/*` + `GET /auth/me` + `/animais`. Nunca `/auth/ongs/*`.

## Contexto técnico (hoje)

| Item | Estado |
|------|--------|
| `adopet-mobile` | Expo blank + pastas `src/` (spec 001) |
| API | `adopet-backend` em `http://localhost:3000` (`GET /health` → `{ "status": "ok" }`) |
| Papel do mobile | Somente `usuario`. ONG fica no web |
| Protótipos Parte 1 | Fig. 13 (auth/cadastro) e Fig. 15 (listagem) — a autora anexa em `docs/prototipos/` **quando formos implementar as specs das telas** (não nesta 001) |
| Dev Windows | Mesmo cuidado do web: preferir `127.0.0.1` a `localhost` quando houver reset de conexão |

## Roadmap de specs (mobile) — não implementar agora

Alinhado ao contexto (MVP = auth + CRUD) e aos cards em **A Fazer** no Trello. A autora fechou: **login e cadastro na spec 002**.

| Spec | Tema | Card Trello | Fase |
|------|------|-------------|------|
| **001** (esta) | Scaffold RN + pastas + nav + `api.js` + env | [50](https://trello.com/c/3LyXzbdr) | 1 |
| 002 | Login + cadastro + esqueci senha do usuário + JWT | [52](https://trello.com/c/G0NQvNNN) + [51](https://trello.com/c/UrE2dIP9) | 1 |
| 003 | Listagem A / P / E | [53](https://trello.com/c/PJF6fGYg) | 1 |
| 004 | Detalhe do animal | [54](https://trello.com/c/AkJGJESM) | 1 |
| 005 | Cadastro / edição / exclusão de animal pelo usuário | [56](https://trello.com/c/znr44dFV) | 1 |
| 006 | Filtros de busca (RF0005) | [55](https://trello.com/c/5jbmdE6U) | 2 |
| 007 | Perfil / editar conta | [59](https://trello.com/c/VLtmn6n5) | depois da API de edição de perfil |

Fase 2 também: câmera/galeria (RF0007), imagens nas listas, IA (RF0008). Sem spec até a API de Storage existir.

Visual das telas (Fig. 13 e 15): entra nas specs 002+ quando os prints forem anexados. A 001 continua placeholder textual.

## Stack proposta

O **código é React Native** (o que a Parte 1 cita). O **Expo** é a ferramenta para criar, subir e testar esse app — o paralelo do **Vite** no web.

| Item | Escolha | Motivo |
|------|---------|--------|
| Linguagem da UI | **React Native** | Parte 1 / contexto; `View`, `Text`, `StyleSheet` |
| Como executar | **Expo** (managed) | `npx expo start` + Expo Go no celular **e** emulador Android |
| Linguagem | **JavaScript** (não TypeScript) | Fechado pela autora; igual backend e web |
| Template inicial | **`blank`** | Projeto vazio em JS; nós montamos as pastas (ver esclarecimento abaixo) |
| Navegação | **React Navigation** (`native-stack`) | Troca de telas explícita, como o `react-router-dom` no web |
| HTTP | **`fetch`** nativo | Igual ao web; helper em `src/services/api.js` |
| Estilo | **`StyleSheet`** + objeto de cores em `src/theme/` | Sem NativeWind nesta fase |
| Env | **`EXPO_PUBLIC_API_URL`** | Prefixo oficial do Expo (inlined no bundle) |
| Alias `@/` | **não** nesta fatia | Menos config no Babel; relative imports |
| Onde testar | **Expo Go no celular e emulador Android** | Fechado pela autora |

SDK Expo: **54.0.37** (alinhado ao Expo Go da App Store no iPhone; o scaffold inicial tinha vindo no SDK 57).

## Esclarecimentos (refinamento 2026-08-22)

### React Native vs Expo — o Expo não substitui o React Native

| Camada | Web (já feito) | Mobile (esta spec) |
|--------|----------------|---------------------|
| O que a Parte 1 cita | React | **React Native** |
| Como criamos/rodamos o projeto | **Vite** (`npm run dev`) | **Expo** (`npx expo start`) |
| Onde o app aparece | Chrome | Celular (Expo Go) e emulador Android |

- Escrevemos **React Native**: telas com `View`/`Text`, estilo com `StyleSheet`, JavaScript.
- O **Expo** é o ambiente: gera o projeto, o bundler, o QR Code e o app **Expo Go** (instala na Play Store). Você aponta o celular para o QR e o app AdoPet abre **dentro** do Expo Go, sem gerar APK a cada mudança.
- Sem Expo (React Native CLI “puro”): o código ainda é RN, mas para ver no celular precisa Android Studio, USB/`adb` e um build nativo. Não existe Expo Go. Mais pesado para o TCC.

Conclusão para a banca: o trabalho **é React Native**. O Expo é só o jeito de executar, como o Vite no painel web.

### React Navigation vs Expo Router

Os dois servem para **ir de uma tela para outra** (login → listagem → detalhe).

| | **React Navigation** (proposta) | **Expo Router** |
|--|----------------------------------|-----------------|
| Como declara a tela | Arquivo JS + uma lista de rotas no código (`RootNavigator.js`), parecido com `App.jsx` do web | Cada arquivo numa pasta `app/` vira uma rota sozinho |
| Dependência do Expo | Biblioteca padrão de RN; funciona com ou sem Expo | Feito para Expo; é o padrão do template `default` |
| Quando brilha | App com poucas telas, fluxo explícito (auth vs logado) | Apps grandes, deep links, web no mesmo projeto |

No AdoPet as telas são poucas e o web já usa rotas declaradas no `App.jsx`. **React Navigation** deixa o mesmo modelo: um arquivo lista as telas. O Expo Router não é obrigatório e misturaria outro jeito de organizar pastas (`app/` na raiz).

Nesta 001 só entra um stack com a tela placeholder. Login/cadastro ligam as rotas de verdade na 002.

### O que é o template `blank`

Ao criar o projeto, o Expo oferece um **esqueleto inicial** (como escolher “React + JS” no Vite):

| Template | O que vem |
|----------|-----------|
| **`blank`** (proposta) | Um `App.js` vazio, **JavaScript**, sem navegação pronta |
| `default` / `tabs` | Várias pastas, em geral **TypeScript** e **Expo Router** já ligados |

`blank` = começamos do zero organizado do nosso jeito (`src/screens`, `src/services`), sem apagar código gerado que não vamos usar.

## Decisões técnicas

Fechadas em 2026-08-22 pela autora:

| Item | Escolha |
|------|---------|
| Linguagem | **JavaScript** |
| Como executar | **Expo** (código **React Native**; Expo Go no celular + emulador Android) |
| Navegação | **React Navigation** (`native-stack`; sem Expo Router) |
| Template | **`blank`** |
| Spec 002 | Login + cadastro + **esqueci senha** (não fica para spec futura) |
| Prints Fig. 13 e 15 | Anexar **nas specs das telas**, não nesta 001 |
| HTTP | `fetch` + helper `api.js` (sem Axios) |
| Estilo | `StyleSheet` + `src/theme/colors.js` |
| Alias `@/` | não nesta fatia |
| JWT / SecureStore | **não** nesta fatia (spec 002) |
| Pasta `context/` | **não** nesta fatia; `AuthContext` na 002 |
| Chamada `/health` na UI | não |

## Pontos abertos para refinamento

Nenhum. Segunda rodada fechada em 2026-08-22.

## Contratos

### Variáveis de ambiente

`.env.example`:

```
# URL da API (sem barra no final).
# Simulador iOS / Expo no PC:        http://127.0.0.1:3000
# Emulador Android:                  http://10.0.2.2:3000
# Expo Go no celular (mesma Wi-Fi):  http://<IP-LAN-do-PC>:3000
EXPO_PUBLIC_API_URL=http://127.0.0.1:3000
```

- Nunca commitar `.env`
- O helper HTTP prefixa todas as chamadas com `EXPO_PUBLIC_API_URL`
- Celular físico **não** alcança `localhost` do PC — usar o IP da máquina (ex.: `http://192.168.0.10:3000`) e liberar o firewall da porta 3000
- HTTP em claro é aceitável no **dev** (Expo Go). Produção/EAS fica para fase posterior

### Navegação nesta fatia

| Tela | Comportamento |
|------|----------------|
| `Home` | Placeholder: título “AdoPet”, subtítulo “App do usuário”, texto de que login entra na spec 002 |
| `*` | — |

Um único stack (`RootNavigator`). **Não** há stack autenticado vs público ainda — isso entra na spec 002 (`AuthContext`).

A tela **não** precisa chamar `/health` na UI. O helper `api.js` só precisa existir e exportar `apiUrl()` / `request()` / `requestJson()`, no mesmo espírito do web.

### Fumaça da API (manual, fora do app)

Com a API no ar:

```bash
curl http://127.0.0.1:3000/health
# { "status": "ok" }
```

Envelope de erro a tratar no helper (já usado no web):

```json
{ "error": { "message": "..." } }
```

## Arquitetura de pastas

```
adopet-mobile/
├── docs/
├── specs/
├── src/
│   ├── screens/         # telas (Login entra na 002)
│   │   └── HomeScreen.js
│   ├── components/      # pedaços reutilizáveis
│   ├── navigation/
│   │   └── RootNavigator.js
│   ├── services/        # api.js agora; authService na 002
│   ├── hooks/           # auth na 002
│   └── theme/
│       └── colors.js    # paleta mínima (placeholder)
├── App.js
├── app.json             # name/slug: adopet
├── index.js             # entry Expo
├── .env.example
├── .gitignore
├── README.md
└── package.json
```

Manter `docs/`, `specs/` e `.cursor/` intactos ao rodar o `create-expo-app` (criar no diretório do repo, sem apagar o que já existe).

Scripts: `npx expo start` (dev). Android/iOS via Expo Go ou emulador.

## Critérios de pronto

- [x] Spec aprovada (pontos 1–4 da segunda rodada fechados)
- [x] `npm install` e `npx expo start` sobem o app
- [x] Pastas `screens`, `components`, `services`, `hooks`, `navigation`, `theme` existem
- [x] Tela placeholder “AdoPet — app do usuário” visível no Expo Go **e** no emulador Android
- [x] `.env.example` documenta `EXPO_PUBLIC_API_URL` (incluindo emulador Android e IP LAN)
- [x] `src/services/api.js` exporta `apiUrl` / `request` / `requestJson` e lê o envelope `{ error: { message } }`
- [x] Sem secrets commitados
- [x] `docs/CONTEXTO-PROJETO.md` atualizado (stack mobile = React Native executado com Expo + JS; decisão na tabela §8)
- [ ] Card Trello 50 pode ir para a coluna de andamento/concluído após a implementação

## Como validar (após implementação)

Pré-requisito: API no ar (`cd D:\adopet-backend && npm run dev`).

```bash
cd D:\adopet-mobile
# copiar .env.example → .env e ajustar a URL (emulador vs celular)
npx expo start
```

1. Abrir no Expo Go ou emulador — placeholder visível
2. Confirmar que `docs/`, `specs/` e `.cursor/` continuam no repo
3. Sem tela de login ainda (isso é a 002)

## Checklist de implementação (após aprovação)

1. `npx create-expo-app@latest` template `blank` **no repo**, sem apagar `docs/` / `specs/` / `.cursor/`
2. Pastas combinadas com esta spec
3. `RootNavigator` + `HomeScreen` placeholder
4. `src/services/api.js` + `.env.example`
5. `theme/colors.js` mínimo + `StyleSheet` na Home
6. `.gitignore` (`.env`, `node_modules`, artefatos Expo)
7. `README.md` de desenvolvimento (como rodar + nota do IP LAN)
8. CONTEXTO (stack mobile + decisão Expo na tabela §8; checklist mobile ainda desmarcado até a 002)
