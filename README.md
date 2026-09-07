# AdoPet Mobile — app do usuário

App em **React Native**, executado com **Expo SDK 57** (`expo@57.0.20`). O canal **mobile é exclusivo do usuário**; a ONG usa o painel web.

## Pré-requisitos

- Node.js **22.13+** (requisito oficial do SDK 57)
- [Expo Go](https://expo.dev/go) no celular **e/ou** emulador Android (SDK 57)
- Conta Expo **no PC e no Expo Go** (mesmo e-mail). No SDK 57 o Go recusa o projeto se o CLI não estiver logado. Conta grátis: [expo.dev/signup](https://expo.dev/signup)
- API `adopet-backend` em `http://127.0.0.1:3000` (seed: `usuario@adopet.local` / `senha123`)

## Como rodar

```bash
npx expo login --browser
npx expo start --lan
```

`npx expo whoami` confirma se o PC está logado. Depois do login, **reinicie** o Metro (`Ctrl+C` e `npx expo start --lan`) e leia o QR de novo.

- **Expo Go (celular, mesma Wi-Fi):** leia o **QR desta sessão**. Em `.env`, use o IP da máquina, por exemplo `EXPO_PUBLIC_API_URL=http://192.168.0.10:3000` (o celular não alcança `localhost` do PC). Libere as portas **8081** (Metro) e **3000** (API) no firewall.
- **Não use `--offline` no iPhone.** Com essa flag o manifesto manda o app buscar o JS em `127.0.0.1`, que no celular é o próprio aparelho — o Go mostra *There was a problem running the requested project*.
- **Emulador Android:** `EXPO_PUBLIC_API_URL=http://10.0.2.2:3000`, depois `a` no terminal do Expo ou `npm run android`.

Não commitar `.env`.

| Script | Uso |
|--------|-----|
| `npm start` / `npx expo start --lan` | Metro + QR Code (Expo Go na rede local) |
| `npm run android` | abre no emulador/dispositivo Android |

Login com e-mail e senha (spec 002). Cadastro (spec 003), esqueci senha (spec 004) e listagem A/P/E (spec 005) já entram no app autenticado. Seed: `usuario@adopet.local` / `senha123`.

## Specs

Ver `specs/`. Scaffold: spec 001. Login: spec 002. Cadastro: spec 003. Esqueci senha: spec 004. Listagem: spec 005.
