# AdoPet Mobile — app do usuário

App em **React Native**, executado com **Expo SDK 54** (`expo@54.0.37`). O canal **mobile é exclusivo do usuário**; a ONG usa o painel web.

## Pré-requisitos

- Node.js 20+
- [Expo Go](https://expo.dev/go) no celular **e/ou** emulador Android
- API `adopet-backend` em `http://127.0.0.1:3000` (seed: `usuario@adopet.local` / `senha123`)

## Como rodar

```bash
copy .env.example .env
npm install
npx expo start
```

- **Expo Go (celular, mesma Wi-Fi):** leia o QR Code. Em `.env`, use o IP da máquina, por exemplo `EXPO_PUBLIC_API_URL=http://192.168.0.10:3000` (o celular não alcança `localhost` do PC). Libere a porta 3000 no firewall.
- **Emulador Android:** `EXPO_PUBLIC_API_URL=http://10.0.2.2:3000`, depois `a` no terminal do Expo ou `npm run android`.

Não commitar `.env`.

| Script | Uso |
|--------|-----|
| `npm start` / `npx expo start` | Metro + QR Code (Expo Go) |
| `npm run android` | abre no emulador/dispositivo Android |

Login com e-mail e senha (spec 002). Cadastro e esqueci senha entram em specs seguintes. Seed: `usuario@adopet.local` / `senha123`.

## Specs

Ver `specs/`. Scaffold: spec 001. Login: spec 002.
