# Spec 015 — Proxy da API pelo Metro (Expo Go / túnel)

> **Status:** aprovada e implementada.  
> Depende de: spec 001 (`api.js`, `EXPO_PUBLIC_API_URL`).  
> **Não altera** o `adopet-backend`.  
> Recorte operacional: login e o restante do HTTP no celular quando o JS chega por túnel (Wi-Fi de campus).

## Objetivo

No Expo Go, o túnel entrega só o JavaScript. O celular continua chamando `EXPO_PUBLIC_API_URL` (hoje um IP que a Univates-Alunos não roteia até o PC). O login falha com timeout / “Não foi possível conectar à API”.

Esta fatia faz as rotas da API passarem **pelo mesmo host do Metro**, que o celular já alcança.

## Escopo

1. `metro.config.js`: proxy de `/health`, `/auth`, `/animais`, `/usuarios`, `/ongs` para `http://127.0.0.1:3000`
2. `api.js` no Expo Go: base URL = origem do bundler (`hostUri` / `scriptURL`), não o IP `:3000`
3. Timeout de fetch (20s) para não ficar em “Entrando…” para sempre
4. README / `.env.example` / `docs/CONTEXTO-PROJETO.md`

## Fora de escopo

- Mudar contratos, CORS ou o backend
- Túnel próprio da API (ngrok na porta 3000)
- EAS / build nativo (sem Metro não há proxy)
- Feature de produto / tela nova

## Comportamento

| Ambiente | Base HTTP |
|----------|-----------|
| Expo Go (túnel ou LAN) | origem do Metro (o proxy encaminha à API) |
| Simulador / `hostUri` localhost | `EXPO_PUBLIC_API_URL` (ex.: `http://127.0.0.1:3000`) |
| Emulador Android sem Expo Go | `http://10.0.2.2:3000` |

Envelope de erro 502 do proxy: `{ "error": { "message": "Não foi possível conectar à API. Verifique se o backend está no ar." } }` — o mesmo texto já usado no `api.js`.

## Critérios de pronto

- [x] Spec escrita
- [x] Com `npm run start:tunnel` e a API no ar, `POST /auth/usuarios/login` no Expo Go autentica o seed (`usuario@adopet.local` / `senha123`)
- [x] Sem Metro, o fallback continua `EXPO_PUBLIC_API_URL`
- [x] Contexto e README atualizados
