# Spec 013 — Upgrade Expo SDK 54 → 57

> **Status:** aprovada e implementada.  
> Pontos 1–8 fechados em 2026-09-07 (autora).  
> Depende de: spec 001 (scaffold Expo); specs 002–012 já no ar (não reabrir).  
> **Não altera** o `adopet-backend` nem o `adopet-web`.  
> Recorte: **só a stack Expo/RN** para o app voltar a abrir no Expo Go do iPhone. Sem feature nova.

O Expo Go da App Store no iPhone passou a ser **SDK 57**. O projeto ficou no **54** (commit `42221f5`, 2026-08-22) porque, na época, o Go da loja era 54. No iOS **não dá** para instalar um Go antigo. Ou o app sobe para 57, ou o teste no celular físico deixa de funcionar.

---

## Objetivo

Alinhar o `adopet-mobile` ao **Expo SDK 57** (o mesmo do Expo Go atual no iPhone), sem mudar telas, fluxos, contratos de API nem RF.

Cobre continuidade de desenvolvimento no canal mobile (**RNF0001** — o app precisa abrir de novo no aparelho). Não entrega RF novo.

---

## Por que agora (e por que pulamos 55 e 56)

| | 2026-08-22 | 2026-09-07 |
|--|------------|------------|
| **Projeto** | rebaixado para **54.0.37** | ainda **54.0.37** |
| **Expo Go no iPhone** | **54** | **57** |

O Go no iOS só existe na **última** versão da loja. Intermediários (55, 56) **não** abrem nesse aparelho. Um salto 54 → 55 → 56 → 57 só duplicaria `npm install` sem ganho de teste. A proposta é **um** salto 54 → 57, absorvendo as mudanças dos três changelogs de uma vez.

O scaffold inicial já tinha vindo no 57; esta fatia **volta** a esse alvo, agora de propósito.

---

## Escopo (esta tarefa)

1. Subir `expo` para **SDK 57** (`expo@^57.0.0`, mínimo **57.0.17** — correções de memória/startup do Hermes V1)
2. Alinhar dependências com `npx expo install --fix` (React, RN, módulos Expo e peers de navegação/SVG)
3. Rodar `npx expo-doctor@latest` e corrigir só o que o doctor apontar **e** que esta spec permitir
4. Confirmar que o app abre no **Expo Go 57** (iPhone) e que os fluxos já prontos continuam iguais
5. Atualizar `README.md`, linha de SDK na spec 001 e `docs/CONTEXTO-PROJETO.md`

---

## Fora de escopo

- Qualquer tela, copy, navegação ou regra de negócio nova
- Filtros (RF0005), busca por foto / IA (RF0008), sino
- Trocar React Navigation por Expo Router
- TypeScript, NativeWind, EAS Build, `expo-dev-client`, prebuild (`android/` / `ios/`)
- Migrar `manipulateAsync` para a API nova do manipulator **só se quebrar** (ver decisão 5)
- Opt-out de `expo/fetch` **só se** JSON/multipart quebrar (ver decisão 6)
- Alterar `adopet-backend` ou `adopet-web`
- Testes automatizados
- Publicar na App Store / Play Store

---

## RF/RNF relacionados

| ID | Cobertura nesta spec |
|----|----------------------|
| RF0001–RF0007 | **Regressão** — os fluxos já implementados têm de continuar |
| RF0008 / RF0005 | **Não** — placeholders permanecem |
| RNF0001 | App abre de novo no Expo Go do iPhone |
| RNF0002 | JWT no SecureStore; URL da API só em `.env` — **inalterados** |

---

## O que já existe (não reinventar)

| Já pronto | Onde |
|-----------|------|
| Expo managed + JS + React Navigation + `fetch` + Expo Go | spec 001 |
| JWT no SecureStore | spec 002 / `session.js` |
| Galeria/câmera + JPEG (`manipulateAsync`) | spec 012 / `imagePicker.js` |
| Plugins no `app.json`: `expo-secure-store`, `expo-image-picker` | spec 012 |
| Ícones em SVG próprio (`ListIcons`, `AuthIcons`, `PawLogo`) | specs 005+ — **não** usa `@expo/vector-icons` |
| Sem `expo-av`, `reanimated`, `expo-router`, pastas `android/`/`ios/` | repo atual |
| `package.json` pina `expo@54.0.37`, RN `0.81.5`, React `19.1.0` | **antes** desta fatia |

O código das telas **não** é o alvo. Só `package.json` / lockfile, docs e, se o runtime exigir, um ajuste pontual em `imagePicker.js` ou `api.js`.

---

## Stack hoje vs alvo

Fonte: [Expo SDK reference v57](https://docs.expo.dev/versions/v57.0.0/) e changelogs 55 / 56 / 57.

| Item | SDK 54 (hoje) | SDK 57 (alvo) |
|------|----------------|----------------|
| `expo` | `54.0.37` | `^57.0.0` (**≥ 57.0.17**) |
| React Native | 0.81.5 | **0.86.x** |
| React | 19.1.0 | **19.2.3** |
| Node.js mínimo (oficial) | 20.19.x | **22.13.x** |
| iOS mínimo | 15.1 | **16.4** |
| Arquitetura nativa | 54 ainda aceita Old Arch | **só New Architecture** (flag `newArchEnabled` removida no 55) |
| JS engine | Hermes | **Hermes V1** (padrão desde o 56; regressões de memória/startup corrigidas no 57.0.17) |
| `globalThis.fetch` | fetch do RN | **`expo/fetch`** (padrão desde o 56) |

Versões exatas de `expo-image-picker`, `expo-image-manipulator`, `expo-secure-store`, `expo-status-bar`, `react-native-screens`, `react-native-safe-area-context` e `react-native-svg` **não se chutam**: o `--fix` puxa o conjunto testado do SDK 57.

---

## O que o salto 54→57 muda — e o que isso implica aqui

Checklist contra os changelogs. Só entra no plano o que o AdoPet usa.

| Mudança | SDK | AdoPet usa? | Ação |
|---------|-----|-------------|------|
| `expo-av` removido | 55 | não | — |
| Old Architecture impossível; `newArchEnabled` some do schema | 55 | `app.json` **não** declara a flag | nada a apagar; Expo Go 57 já é New Arch |
| `edgeToEdgeEnabled` removido | 55 | não está no `app.json` | — |
| Push no Expo Go Android | 55 | sino é placeholder | — |
| Hermes V1 padrão | 56 | não usa Reanimated/Worklets | risco baixo; mesmo assim **≥ 57.0.17** |
| `@expo/vector-icons` deixa de vir no `expo` | 56 | ícones são SVG local | — |
| `expo/fetch` vira o `fetch` global | 56 | `api.js` + checagem de tamanho em `imagePicker.js` | **testar** JSON, 204 e multipart; opt-out só se quebrar |
| Expo Router separado do React Navigation | 56 | usamos **React Navigation** direto | — |
| `manipulateAsync` **deprecated** (API contextual nova) | 57 docs | `imagePicker.js` usa `manipulateAsync` | **manter** nesta fatia; migrar só se quebrar |
| RN 0.86 / React 19.2 | 57 | runtime | vem no `--fix` |

Conclusão do refinamento: o AdoPet é um app **managed + Expo Go + JS + Navigation clássica + poucos módulos Expo**. O salto é major na versão, **menor** no código. O risco real está em: New Arch no Go, `fetch` global no multipart, e JPEG via manipulator deprecated.

---

## Decisões desta rodada (2026-09-07)

| # | Tema | Proposta | Por quê |
|---|------|----------|---------|
| 1 | Caminho | **A:** um salto **54 → 57**. Sem parar em 55/56 | Go do iPhone só fala 57 |
| 2 | Como desenvolver | **Continuar Expo Go**. Sem `expo-dev-client` / EAS nesta fatia | Igual spec 001; o TCC testa no celular com QR |
| 3 | Comando | `npx expo install expo@^57.0.0 --fix` depois `npx expo-doctor@latest`. Cache: `npx expo start -c` | Guia oficial do changelog 57 |
| 4 | Piso do `expo` | **≥ 57.0.17** | Changelog 57 (27/08): memória Hermes + startup em dev |
| 5 | JPEG (spec 012) | **A:** manter `manipulateAsync` | Ainda existe; a API nova não é o motivo desta fatia. Se o doctor/runtime recusar, aí sim migrar para `ImageManipulator.manipulate` + `saveAsync` **no mesmo arquivo**, mesmo resultado JPEG 0.7 |
| 6 | HTTP | **A:** deixar o `fetch` global do SDK. Sem `EXPO_PUBLIC_USE_RN_FETCH=1` de antemão | Opt-out só se login, listagem ou `POST .../imagem` quebrarem |
| 7 | Node | README passa a pedir **Node 22.13+** (requisito oficial do SDK 57) | Hoje o README diz 20+ |
| 8 | Código de produto | Telas, `app.json` plugins, `.env` e contratos **inalterados** salvo o ponto 5/6 se o teste falhar | Upgrade de ferramenta, não de feature |

---

## Contrato (o que muda no repo)

Não há endpoint novo. Não há tela nova.

### `package.json`

- `expo`: `^57.0.0` (resolvido ≥ 57.0.17)
- `react` / `react-native` e módulos Expo: o que o `--fix` gravar
- Scripts (`start`, `android`, `ios`) inalterados

### `app.json`

- Sem `sdkVersion` (já não tem)
- Plugins `expo-secure-store` e `expo-image-picker` **ficam**
- **Não** acrescentar `newArchEnabled` (schema 55+ removeu)

### Código

Esperado: **zero** diff em `src/` e `App.js`.

Exceções permitidas só se o teste da seção “Critérios de pronto” falhar:

1. `imagePicker.js` — trocar `manipulateAsync` pela API contextual, mesmo `SaveFormat.JPEG` / `compress: 0.7`
2. `api.js` — se o `fetch` novo recusar `FormData` ou JSON, aí sim `EXPO_PUBLIC_USE_RN_FETCH=1` no `.env.example` (e documentar no README)

### Docs

- `README.md`: SDK 57; Node 22.13+
- spec 001: a linha “SDK Expo: 54.0.37…” vira ponteiro para **esta 013** (o 54 foi o alinhamento temporário com o Go antigo)
- `docs/CONTEXTO-PROJETO.md`: tabela §8 + histórico §10
- `specs/README.md`: esta 013 no índice

---

## Procedimento de implementação (depois da aprovação)

1. Parar o Metro (`Ctrl+C`)
2. Node ≥ 22.13 (`node -v`)
3. `npx expo install expo@^57.0.0 --fix`
4. `npx expo-doctor@latest` — corrigir só avisos desta spec
5. `npx expo start -c`
6. iPhone: Expo Go 57 + QR (mesma Wi-Fi; `EXPO_PUBLIC_API_URL` com o IP da máquina)
7. Percorrer o plano de teste abaixo
8. Atualizar docs listados

Não commitar `.env`. Não gerar `android/` / `ios/`.

---

## Critérios de pronto

- [x] `package.json` / lockfile no SDK 57; `expo` **57.0.20** (≥ 57.0.17)
- [x] `npx expo-doctor@latest` — 21/21 checks passed
- [ ] App **abre** no Expo Go 57 do iPhone (some o “Project is incompatible… SDK 54”) — **teste da autora**
- [ ] Login (`usuario@adopet.local` / `senha123`) + listagem A/P/E — **teste da autora**
- [ ] Detalhe com foto (se houver `urlImagem`) e sem foto (seed) — **teste da autora**
- [ ] Cadastro P/E: câmera **ou** galeria → JPEG → animal aparece com foto — **teste da autora**
- [ ] Edição de perfil (`PATCH /usuarios/me`) e logout; sessão sobrevive a fechar o Go — **teste da autora**
- [ ] Meus animais: listar / editar / excluir — **teste da autora**
- [ ] Placeholders intactos: Filtros, câmera das listas P/E, Similaridade, sino — **teste da autora**
- [x] README, spec 001 (ponteiro), CONTEXTO e índice de specs atualizados
- [x] Sem mudança de contrato da API; backend e web intocados; `src/` intocado

---

## Plano de teste (autora)

Backend no ar. `.env` com o IP da máquina. Expo Go 57 no iPhone.

1. `npx expo start -c` → QR → **abre** (não pede SDK 54)
2. Login seed → Adoção / Perdidos / Encontrados
3. Abrir um card (com foto e sem foto)
4. FAB → Encontrei ou Perdi → Tirar foto **e** Galeria → Salvar
5. Perfil → lápis → alterar um campo → Salvar; matar o Go e reabrir → continua logada
6. Meus animais → editar / remover foto / excluir
7. Conferir “Em breve”: Filtros, câmera P/E da busca, Similaridade, sino

Android (emulador ou aparelho com Go 57): smoke de login + uma lista, se houver tempo. O critério de pronto desta fatia é o **iPhone**, que é quem quebrou.

---

## Riscos

| Risco | Mitigação |
|-------|-----------|
| Node 20 no PC | SDK 57 pede 22.13+; instalar/atualizar Node antes do `expo install` |
| New Architecture no Go | app não usa Reanimated; se uma tela nativa quebrar, reportar — não voltar para 54 (Go 54 não volta no iOS) |
| `fetch` + `FormData` | teste do upload; opt-out documentado na decisão 6 |
| `manipulateAsync` some de fato | decisão 5-B no mesmo arquivo |
| Expo Doctor barulho irrelevante | não “consertar” com TypeScript, Router ou EAS |

---

## Arquivos previstos

| Arquivo | Papel |
|---------|--------|
| `package.json` / `package-lock.json` | SDK 57 + peers — **feito** (`expo@57.0.20`) |
| `app.json` | plugin `expo-status-bar` acrescentado pelo CLI |
| `README.md` | SDK 57, Node 22.13+ — **feito** |
| `specs/001-estrutura-inicial-mobile.md` | ponteiro para esta 013 — **feito** |
| `specs/README.md` | índice — **feito** |
| `docs/CONTEXTO-PROJETO.md` | decisão + histórico — **feito** |
| `src/services/imagePicker.js` | **não precisou** (manipulateAsync segue) |
| `src/services/api.js` / `.env.example` | **não precisou** |

---

## Relação com as specs anteriores

A **001** escolheu Expo + Go no celular. O rebaixamento a 54 foi um alinhamento **temporário** com a loja. Esta 013 **atualiza esse alinhamento** para o Go atual (57). Não reabre 002–012.

A linha da 012 que cita “`expo-image-picker` (SDK 54)” passa a significar “módulo Expo do SDK corrente”; não reescrever a 012 inteira — o comportamento da foto continua o da 012.

---

## Por que não é a 001 de novo

A 001 criou o repo. Esta fatia **não** mexe em pastas, navegação nem `api.js` por padrão. É manutenção de ferramenta para o mesmo app continuar rodando no aparelho da autora.

---

## Notas da implementação (2026-09-07)

- Comando: `npx expo install expo@^57.0.0 --fix` → `expo@57.0.20`, RN `0.86.3`, React `19.2.3`.
- Módulos alinhados: `expo-image-manipulator` / `expo-image-picker` `~57.0.16`, `expo-secure-store` `~57.0.3`, `expo-status-bar` `~57.0.1`, `react-native-screens` `~4.26.0`, `react-native-safe-area-context` `~5.7.0`, `react-native-svg` `15.15.4`.
- `npx expo-doctor@latest`: 21/21.
- O CLI acrescentou o plugin `"expo-status-bar"` em `app.json` (sem opções). Não mexe em `src/`.
- `manipulateAsync` e o `fetch` global **não** foram alterados (decisões 5-A e 6-A). Validar JPEG e multipart no iPhone.
- Sem pastas `android/` / `ios/`. Sem mudança em `imagePicker.js` / `api.js`.
- Expo Go 57 exige **CLI logado** (`npx expo login --browser`). Sem isso o Go pede login e recusa o projeto. `--offline` não serve no iPhone (`hostUri` vira `127.0.0.1`). Depois do login: `npx expo start --lan`. Mesma conta no Expo Go do celular.
