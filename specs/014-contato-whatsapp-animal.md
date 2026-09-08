# Spec 014 — Contato WhatsApp do responsável do animal (app mobile)

> **Status:** aprovada e implementada (2026-09-07).  
> Pontos 1–7 fechados neste documento.  
> Depende de: spec 008 (`AnimalDetailScreen` — bloco ONG responsável / Cadastrado por); spec 011 (Meus animais reusa o mesmo detalhe); **backend spec 011** (`contato` no GET de animais).  
> **Não altera** o `adopet-backend` nesta fatia (contrato já na API 011).  
> **Não altera** o `adopet-web` (ícone no painel é a web spec 012).  
> Reabre o “contato omitir” da spec 008.

O mobile é **somente usuário**. O telefone do usuário **já existe** no cadastro/perfil (specs 003 / 010). Esta fatia só **mostra o atalho** no detalhe. Contato da ONG nasce no backend 011 + painel (web 012); o app só **lê** o JSON.

## Objetivo

Na tela de detalhe, **abaixo** de “ONG responsável” / “Cadastrado por”, mostrar um ícone de WhatsApp que abre a conversa com o responsável (usuário que cadastrou **ou** ONG), usando o `contato` da conta.

Completa **RF0006** no app (contato com o tutor) e **RNF0001** (ação óbvia no card do responsável). Sem endpoint novo: o mesmo `GET /animais/:id` da spec 008, agora com `contato` no tutor (backend 011).

## Recorte vs o que já existe

| Fluxo | Onde está | Nesta spec |
|-------|-----------|------------|
| Detalhe: label + nome do tutor | spec 008 | **acrescentar** ícone WhatsApp abaixo do nome |
| `GET /animais/:id` tutor só id+nome | spec 008 / backend 005 | **consumir** `contato` (backend 011) |
| Cadastro/perfil usuário (`contato`) | 003 / 010 | **inalterados** — o número já é gravado |
| Listas A/P/E e Meus animais (cards) | 005 / 011 | **inalterados** — sem ícone no card |
| Detalhe no painel web | web 012 | **fora** |
| Cadastro/perfil da ONG | web 012 | **fora** |

O detalhe de **Meus animais** (spec 011) é a **mesma** `AnimalDetailScreen`: o ícone aparece lá também. Se o animal for do próprio usuário, o WhatsApp abre a conversa **com o próprio número** — aceitável (sem regra extra de esconder).

## Referência visual

Não há print de WhatsApp na Parte 1. Espelhar o card branco do responsável (spec 008): título da seção, nome, **depois** o atalho.

| Fonte | Uso |
|-------|------|
| Spec 008 (card Responsável) | Mesmo card; ícone abaixo do `bodyText` do nome |
| `ListIcons.js` | Novo `WhatsAppIcon` em SVG (mesmo padrão `react-native-svg`) |
| Marca WhatsApp | Glifo de balão; cor `#25D366`; **sem** pacote npm novo |

```
Cadastrado por
Kelli Gutterresssss
[ícone]  WhatsApp
```

```
ONG responsável
ONG Testeeee
[ícone]  WhatsApp
```

O **número não aparece** como texto. Acessibilidade: `accessibilityLabel` + `accessibilityRole="link"`.

## Escopo (esta tarefa)

1. Ícone + rótulo “WhatsApp” abaixo do nome no card do responsável (`AnimalDetailScreen`)
2. Helper `whatsappHref(contato, { nomeAnimal })` — **mesmo contrato** da web spec 012
3. `labelResponsavel` devolve também `contato` do mesmo tutor do nome
4. Esconder o atalho se o href for `null`
5. Toque → `Linking.openURL(href)` (https `wa.me`, não esquema `whatsapp://`)
6. Atualizar `docs/CONTEXTO-PROJETO.md` após implementação

## Fora de escopo

- Alterar o `adopet-backend` (MIME, envelope, regex de telefone)
- Cadastro/edição de `contato` do usuário (já nas 003/010)
- Campo contato da ONG no app (ONG não usa o mobile)
- Ícone no `AnimalCard` das listas
- Exibir o número em claro
- `mailto:` / `tel:` / SMS
- Mensagem via API oficial do WhatsApp
- `expo-linking` config extra / `LSApplicationQueriesSchemes` (não usamos `whatsapp://`)
- TypeScript, NativeWind, Expo Router
- Testes automatizados
- Role `admin`

## RF/RNF relacionados

| ID | Cobertura nesta spec |
|----|----------------------|
| RF0006 | **Sim** — detalhe ganha o meio de contato |
| RF0004 | Lista inalterada |
| RF0001 | **Não** — perfil/contato do usuário já existem |
| RNF0001 | Ícone no card; some se não houver número |
| RNF0002 | GET público; Bearer já injetado; não logar JWT |

## O que já existe (não reinventar)

| Já pronto | Onde |
|-----------|------|
| `labelResponsavel` | `animalLabels.js` |
| Card do responsável | `AnimalDetailScreen.js` |
| `buscarAnimal(id)` → `GET /animais/:id` | spec 008 |
| `Linking` do React Native | stdlib — usar no toque |
| `unmaskPhone` / máscara | `authService.js` (perfil) — **não** reusar para o `wa.me` (slice 11 quebraria E.164 de 12–13 dígitos) |

O app chama **somente** o GET já existente. Nenhum `PATCH` nesta fatia.

## Contexto técnico (API — backend 011)

Implementar o **backend 011 antes** desta fatia.

### `GET /animais/:id` (tutor)

```json
{
  "instituicao": { "idInstituicao": 1, "nome": "ONG AdoPet Demo", "contato": "51888888888" },
  "usuario": null
}
```

Não inventar campo. `contato` `null`/ausente → sem ícone.

Seed:

| Animal | Entrada | Tutor | Dígitos |
|--------|---------|-------|---------|
| Thor | Adoção | ONG AdoPet Demo | `51888888888` |
| Luna | Perdidos | ONG AdoPet Demo | `51888888888` |
| Mel | Encontrados | Usuario Demo | `51999999999` |

## Pontos fechados (2026-09-07)

| # | Tema | Decisão |
|---|------|---------|
| 1 | Onde o ícone entra | **Só no detalhe**, abaixo do nome, no card do responsável. Listas sem ícone. |
| 2 | Número visível? | **Não.** Ícone + “WhatsApp”. |
| 3 | URL | `https://wa.me/{e164}?text=…` via `Linking.openURL`. **Não** `whatsapp://`. |
| 4 | Prefixo 55 | Igual web 012: 10–11 dígitos → prefixar `55`; 12–13 começando em `55` → como está. DDD 55 (SC) não é país. |
| 5 | Texto pré-preenchido | `Olá! Vi o animal {nome} no AdoPet e gostaria de saber mais.` (`animal.nome`, inclusive em Encontrados — Mel, não o título genérico do card) |
| 6 | Sem contato / falha ao abrir | Sem contato → omitir. `openURL` rejeitado → `Alert` curto em PT-BR (“Não foi possível abrir o WhatsApp.”). |
| 7 | Número da spec | **014** no mobile (013 já é o upgrade Expo). Backend **011**. Web **012**. |

### Ponto 1 — por que só no detalhe

Pedido da autora: abaixo de “Cadastrado por” / “ONG responsável”. O card da lista já navega para o detalhe; duplicar o WhatsApp no card aumenta toques acidentais e não adiciona dado novo.

### Ponto 3 — por que `https://wa.me` e não `whatsapp://`

`wa.me` abre o app se estiver instalado e cai no navegador/WhatsApp Web se não estiver. Não exige `LSApplicationQueriesSchemes` no iOS. Sem dependência extra.

### Ponto 5 — nome do animal na mensagem

Em Encontrados o título da tela é “Cachorro encontrado”; o `nome` cadastrado (Mel) vai na mensagem para o destinatário identificar o registro.

### Ponto 6 — próprio animal

Não esconder o ícone se `idUsuario ===` usuário logado. Menos regra; o usuário pode testar o link. Meus animais reusa a tela.

## Fluxos

### Abrir WhatsApp

```
Usuário              App                            API
 |  detalhe           |                              |
 |------------------->|  GET /animais/:id (já 008)   |
 |                    |----------------------------->|
 |                    |  200 + tutor.contato         |
 |  toque WhatsApp    |<-----------------------------|
 |                    |  Linking.openURL(wa.me)      |
```

1. Toque no card da lista → detalhe (008).
2. GET monta o card do responsável.
3. Se `whatsappHref` existir, mostra o `Pressable`.
4. Toque → `openURL`; falha → Alert.

Sem pull-to-refresh novo. Sem persistir o clique.

## Contrato de UI

Idioma: **PT-BR**. Identificadores em inglês.

### Card responsável (delta da 008)

| Elemento | Regra |
|----------|--------|
| Título da seção | inalterado |
| Nome | inalterado |
| Atalho | `Pressable` abaixo do nome; ícone 22–24px + texto “WhatsApp”; `flexDirection: 'row'`; gap ~8 |
| Hit slop / altura | área de toque ≥ 44px |
| Cor do ícone | `#25D366` |
| Texto do rótulo | cor `colors.muted` ou o body do card (contraste sobre fundo branco) |

`labelResponsavel` → `{ label, value, contato }` com `contato` do mesmo tutor do `value` (regra A vs P/E **igual** à 008).

### Helper `whatsappHref` (`src/services/whatsapp.js`)

Contrato **idêntico** à web spec 012:

1. `digits = String(contato).replace(/\D/g, '')` — **sem** `slice(0, 11)` do `unmaskPhone`.
2. 10 ou 11 → prefixar `55`.
3. 12 ou 13 e começa com `55` → usar como está.
4. Senão `null`.
5. `https://wa.me/${e164}?text=${encodeURIComponent(mensagem)}`.

Não importar `unmaskPhone` aqui.

### Acessibilidade

- `accessibilityRole="link"`
- `accessibilityLabel="Conversar no WhatsApp com {nome}"`
- Ícone com `accessible={false}` (o Pressable fala por ambos)

## Arquitetura de código

```
src/
  screens/
    AnimalDetailScreen.js     # Pressable + Linking
  services/
    animalLabels.js           # contato no labelResponsavel
    whatsapp.js               # novo
  components/
    ListIcons.js              # WhatsAppIcon
```

`AppNavigator`, listas e perfil **não** mudam. Sem lib nova.

## Regras de negócio (cliente)

1. Só o `contato` do tutor devolvido pelo GET.
2. Não mostrar e-mail (a API não manda).
3. Não logar JWT.
4. Não chamar `PATCH`/`DELETE` por causa do ícone.
5. Encontrados: mensagem usa `animal.nome`, não `tituloCard`.

## Decisões técnicas

| Item | Escolha |
|------|---------|
| Canal | Mobile (usuário) |
| Backend | spec 011 (implementar **antes**) |
| Superfície | só detalhe |
| Número na UI | oculto |
| URL | `wa.me` + `Linking.openURL` |
| Cadastro ONG | fora (web) |
| Libs novas | nenhuma |
| Número | **014** |

## Critérios de pronto (após implementação)

- [x] Pontos 1–7 fechados nesta spec
- [ ] Backend 011 no ar + seed
- [ ] Adoção → Thor → ícone abaixo da ONG abre WhatsApp (`5551888888888`, texto com Thor)
- [ ] Encontrados → Mel → WhatsApp do Usuario Demo; mensagem cita **Mel**
- [ ] Perdidos → Luna → WhatsApp da ONG
- [x] Sem `contato` → nome permanece, ícone some
- [x] Cards das listas **sem** ícone novo
- [x] Meus animais → mesmo detalhe com o atalho
- [x] CONTEXTO atualizado
- [x] Backend e web **não** alterados nesta fatia de código

## Como validar (após implementação)

Pré-requisito: API com backend 011 + seed; Expo no device/emulador (WhatsApp instalado ou não).

```bash
cd D:\adopet-backend
npm run dev

cd D:\adopet-mobile
npx expo start
```

1. Login usuário → Adoção → Thor → ícone abaixo de ONG AdoPet Demo → abre WhatsApp/navegador no `wa.me`
2. Encontrados → Mel → mensagem com o nome Mel
3. Perdidos → Luna
4. Voltar: listas e FAB inalterados

## Checklist de implementação (após a autora pedir o código)

1. [x] Spec 014 no índice mobile
2. [x] `whatsapp.js` + `labelResponsavel.contato`
3. [x] `WhatsAppIcon` em `ListIcons.js`
4. [x] `AnimalDetailScreen`: Pressable + `Linking`
5. [x] CONTEXTO

## Relação com outras specs

- **008:** detalhe continua consulta; entra só o atalho. Editar/Excluir de Meus animais (011) **permanecem**.
- **003 / 010:** o usuário já informa o telefone; esta fatia só **lê** no GET do animal.
- **Backend 011 / web 012:** mesmo `wa.me` e mesma regra do `55`. Cada repo com o próprio `whatsapp.js`.
