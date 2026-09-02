# Spec 012 — Upload e captura de imagem do animal (app mobile)

> **Status:** aprovada e implementada.  
> Pontos 1–7 fechados em 2026-09-01 (7-B: conversão JPEG).  
> Depende de: spec 007 (`AnimalForm` criar); spec 008 (`AnimalDetail` + placeholder); spec 011 (`AnimalForm` editar + Meus animais); backend spec 010 (`POST`/`DELETE /animais/:id/imagem`, `urlImagem`).  
> **Não altera** o `adopet-backend` nesta fatia (contrato já pronto).  
> **Não altera** o `adopet-web` (card Fotos do painel fica para spec web futura).  
> Fecha **RF0007** no canal mobile e a parte de **fotos** do **RF0006** (exibir a URL que a API já devolve).

O mobile é **somente usuário**. A ONG continua enviando foto pelo painel web (fatia separada). O usuário **só muta a foto do animal que ele cadastrou** (`assertPodeMutar` já na API). Listas e detalhe **públicos** só **mostram** a foto.

O botão de câmera das listas P/E (spec 006) é **busca por foto / RF0008**. Esta spec **não** o ativa.

---

## Objetivo

Permitir que o usuário **escolha uma foto da galeria ou tire uma com a câmera**, anexe **uma** imagem ao animal perdido/encontrado e veja essa foto nas listas e no detalhe.

Cobre **RF0007** (galeria ou câmera do dispositivo) e completa **RF0006** / **RF0004** no app (hoje o placeholder de iniciais). Armazenamento continua no **Supabase via Node** (**RNF0004**); o app **não** recebe chave do Storage.

A API já existe (backend spec 010). Esta fatia é **cliente**: picker + multipart + exibir `urlImagem`.

---

## Recorte vs o que já existe

| Fluxo | Onde está | Nesta spec |
|-------|-----------|------------|
| `POST /animais` JSON (sem arquivo) | spec 007 / backend 005 | **inalterado na API** — o app, no cadastro, **sempre** manda a foto em seguida |
| `PATCH /animais/:id` JSON | spec 011 | **inalterado** — **não** enviar `urlImagem` no body |
| `POST` / `DELETE /animais/:id/imagem` | backend spec 010 | **consumir** |
| `GET` lista/detalhe com `urlImagem` | backend spec 010 | **exibir** (hoje o app ignora o campo) |
| Placeholder de iniciais no card/detalhe | specs 005 / 008 / 011 | **fallback** se `urlImagem` for `null` ou a imagem falhar |
| Cadastro P/E + edição Meus animais | 007 / 011 | **acrescentar** bloco de foto no `AnimalForm` |
| Botão câmera “buscar por foto” | spec 006 | **inalterado** (desabilitado; RF0008) |
| Upload no painel web | web spec 007 (card omitido) | **fora** |
| IA / similaridade | RF0008 | **fora** |

Duas etapas no servidor (cadastro JSON + foto), **uma** ação “Salvar animal” na UI — igual a backend spec 010 já previa.

---

## Referência visual

Não há print mobile de câmera/galeria na Parte 1 (Fig. 13 = auth; Fig. 15 = listagem com placeholder de foto). Esta fatia **substitui o placeholder** pela foto real e acrescenta um bloco no form, no idioma já do app (card branco, tema P/E, área ≥ 44px).

| Fonte | Uso |
|-------|------|
| [listagem-animais-mobile.png](../docs/prototipos/listagem-animais-mobile.png) | Slot quadrado do card (hoje iniciais) passa a `Image` |
| Spec 008 (hero do detalhe) | Quadrado grande: foto ou iniciais |
| Spec 007 / 011 (`AnimalForm`) | Nova seção **Foto** acima de Informações básicas |
| Backend spec 010 | MIME, 8 MB, campo `imagem`, JWT |

---

## Escopo (esta tarefa)

1. Bloco **Foto** no `AnimalForm` (criar **e** editar): preview, **Tirar foto**, **Galeria**, remover (edição / se já escolheu)
2. `expo-image-picker` (SDK 54): câmera + biblioteca; permissões no toque, não no boot
3. `animaisService.enviarImagem` / `removerImagem` + `requestMultipart` no `api.js` (sem `Content-Type: application/json`)
4. Cadastro: foto **obrigatória no app** → sempre `POST /animais` **e** `POST /animais/:id/imagem` (API continua aceitando animal sem foto)
5. Edição: `PATCH` dos campos (se dirty) **e/ou** `POST` imagem nova **e/ou** `DELETE` se o usuário removeu a foto
6. Exibir `urlImagem` em `AnimalCard` (listas A/P/E + Meus animais) e no hero de `AnimalDetail`; fallback iniciais
7. Permissões e copy PT-BR; HEIC/arquivo inválido/8 MB tratados no cliente
8. Atualizar `docs/CONTEXTO-PROJETO.md` após implementação

---

## Fora de escopo

- Alterar o `adopet-backend` (MIME, limite, envelope, várias fotos, thumbnail no servidor)
- Várias fotos por animal / carrossel / tabela `Imagem`
- Foto de perfil do usuário
- Upload direto ao Supabase (Publishable key)
- Painel web (card Fotos)
- Ativar o botão “buscar por foto” (spec 006 / RF0008)
- Serviço Python / `Transacao`
- `expo-camera` com UI própria (preview custom, flash, etc.)
- Cadastro/edição de adoção (`status=A`) no mobile
- Recategorizar P ↔ E
- Compressão avançada com worker / lib de codec
- TypeScript, NativeWind, Expo Router
- Testes automatizados
- Role `admin` no JWT

---

## RF/RNF relacionados

| ID | Cobertura nesta spec |
|----|----------------------|
| RF0007 | **Sim** — galeria **e** câmera no form do animal |
| RF0003 | Foto entra no cadastro/edição P/E do usuário |
| RF0004 | Card da lista mostra a foto quando houver URL |
| RF0006 | Detalhe mostra a foto quando houver URL |
| RF0008 | **Não** — botão das listas P/E permanece placeholder |
| RNF0001 | Escolha câmera/galeria óbvia; permissão negada em texto; fallback se a URL falhar |
| RNF0002 | Multipart com JWT; Secret do Storage continua só no Node |
| RNF0004 | Blob no Storage; app só envia arquivo e lê URL |

---

## O que já existe (não reinventar)

| Já pronto | Onde |
|-----------|------|
| `POST /animais/:id/imagem` multipart campo **`imagem`**; JPEG/PNG/WebP; **8 MB** | backend spec 010 |
| `DELETE /animais/:id/imagem` → **204** (idempotente) | backend spec 010 |
| `GET` devolve `urlImagem` (`null` ou URL pública) | backend spec 010 |
| JSON create/update **recusa** `urlImagem` (**400**) | backend spec 010 |
| Usuário só muta o próprio animal; ONG qualquer um | backend spec 008 |
| `AnimalForm` criar + editar; dirty; 401 → logout | specs 007 / 011 |
| Placeholder iniciais no card e no detalhe | `AnimalCard` / `AnimalDetailScreen` / `iniciaisNome` |
| `requestJson` sempre `JSON.stringify` | `api.js` — **não serve** para arquivo |
| Expo SDK **54**, JS, Expo Go | spec 001 |
| Seed: Mel sem foto (`urlImagem` null) | backend spec 010 |

O app passa a chamar `POST`/`DELETE .../imagem` além do JSON já existente. Nunca `/auth/ongs/*`. Nunca mutar foto de animal `A` ou de outro tutor.

---

## Refinamento técnico

### Papéis (inalterados)

```
App (RN)  --JWT+multipart-->  Node  --service_role-->  Supabase Storage
App (RN)  <-- urlImagem -----  GET /animais
```

O cliente **não** conhece `SUPABASE_URL` / Secret. Só a URL pública que o GET já traz.

### Duas etapas (cadastro) — sempre as duas rotas

No **cadastro** o app exige foto **só no front** (ponto 3). A API **não muda**: `POST /animais` ainda aceita animal sem `urlImagem`. O form recusa Salvar sem preview local.

1. Validar form (spec 007) **e** foto presente (MIME/tamanho no cliente).
2. `POST /animais` → **201** `{ animal }`.
3. **Sempre** `POST /animais/:id/imagem` com o mesmo JWT (não há cadastro mobile sem este segundo passo).
4. Sucesso das duas → aba da situação + recarregar lista (spec 007).
5. JSON 201 e imagem falha → ponto 4-A (animal existe sem foto; aviso).

Na UI continua um único **Salvar animal**.

Na **edição** as duas rotas **não** são sempre chamadas: PATCH só se os campos sujaram; POST/DELETE de imagem só se a foto mudou.

### Edição (Meus animais)

Estados da foto no form:

| Estado | Ação no save |
|--------|----------------|
| Sem mudança (`urlImagem` igual + sem arquivo local) | não chama imagem; PATCH só se campos dirty |
| Arquivo local novo | `POST .../imagem` (substitui no servidor) |
| Tinha URL e o usuário tocou **Remover foto** | `DELETE .../imagem` |
| Campos dirty **e** foto mudou | PATCH e depois POST/DELETE (nessa ordem) |
| Só foto mudou, form de texto limpo | **não** PATCH (evita 400 `Nenhum campo para atualizar`); só imagem |

Dirty da edição passa a incluir a foto (arquivo local ou flag de remoção).

### Lib e permissões (Expo 54)

**`expo-image-picker`** cobre galeria **e** câmera (`launchImageLibraryAsync` / `launchCameraAsync`). Não usar `expo-camera` nesta fatia (UI nativa do sistema basta).

Plugin em `app.json` (além do `expo-secure-store`):

```json
[
  "expo-image-picker",
  {
    "photosPermission": "O AdoPet acessa suas fotos para escolher a imagem do animal.",
    "cameraPermission": "O AdoPet usa a câmera para fotografar o animal.",
    "microphonePermission": false
  }
]
```

Permissão pedida **no toque** do botão correspondente (`requestCameraPermissionsAsync` / `requestMediaLibraryPermissionsAsync`). Negada ou indisponível → Alert PT-BR; não crashar.

Expo Go (SDK 54) já inclui o módulo. Dev build futuro herda o plugin.

### MIME, HEIC e 8 MB (ponto 7-B)

A API só aceita `image/jpeg`, `image/png`, `image/webp`. Depois do picker, o app **sempre** regrava em JPEG com `expo-image-manipulator` (`SaveFormat.JPEG`, `compress` 0.7). HEIC da câmera/galeria do iPhone vira JPEG **antes** do `POST`.

Picker: `mediaTypes: ['images']`, `allowsMultipleSelection: false`, `allowsEditing: true`, `aspect: [1, 1]`, `quality: 0.7`.  
Se o arquivo convertido > 8 MB → mensagem no form, sem upload.  
`FormData`: campo **`imagem`**, `name` `foto.jpg`, `type` `image/jpeg`.

Não enviar `base64` no body JSON. Não inventar `urlImagem` no PATCH.

### Exibir a foto

`Image` do React Native (`source={{ uri }}`). Sem `expo-image` nesta fatia.

- Card: 72×72, `cover`, `borderRadius` 12 (igual ao slot atual).
- Detalhe: quadrado grande atual, `cover`.
- Form: preview ~160×160, `cover`.
- `onError` ou `urlImagem` null → iniciais (mesmo `iniciaisNome`).

Listas **públicas** (incluindo Adoção / animais da ONG) **mostram** a foto se a URL existir. Só o **dono** (jornada Meus animais / form) **envia** ou **apaga**.

### Multipart no `api.js`

`request()` hoje força `Content-Type: application/json` e `JSON.stringify`. Upload precisa de helper novo, por exemplo `requestForm(path, formData)`, que:

- injeta `Authorization: Bearer`
- **não** seta `Content-Type` (o runtime coloca o boundary)
- reusa parse de envelope `{ error: { message } }`, 204 e `ApiError`

### Emulador / Expo Go

- Galeria: funciona no emulador Android e no dispositivo.
- Câmera: emulador sem webcam pode falhar — copy de permissão/indisponível; validar câmera no **aparelho** ou Expo Go.

---

## Contexto técnico (API já pronta)

Base: `EXPO_PUBLIC_API_URL`. Envelope: `{ "error": { "message": "..." } }`.

### `POST /animais/:id/imagem`

**Content-Type:** `multipart/form-data`  
**Campo:** `imagem` (um arquivo)  
**Auth:** JWT `usuario` + dono do animal

| HTTP | UI |
|------|-----|
| **200** `{ animal }` com `urlImagem` | segue o fluxo de sucesso |
| **400** | `error.message` no form (sem arquivo, MIME, 8 MB) |
| **401** | logout → Login |
| **403** | `error.message`; sessão permanece |
| **404** | “Animal não encontrado.” |
| **503** | “Serviço de imagens indisponível” |

### `DELETE /animais/:id/imagem`

**204**. Animal já sem foto também **204**. 401 / 403 / 404 iguais ao POST.

### `GET /animais` e `GET /animais/:id`

Públicos. Campo `urlImagem`: `null` ou URL `https://…`. O app **não** cacheia além do estado da tela; `useFocusEffect` das listas já recarrega.

---

## Pontos fechados (2026-09-01)

| # | Tema | Decisão |
|---|------|---------|
| 1 | Onde escolher/tirar a foto | **A** — no `AnimalForm` ao **cadastrar** um animal novo. O mesmo bloco existe na **edição** (Meus animais) para trocar/remover (ponto 6). Sem foto no detalhe nem tela extra |
| 2 | Câmera e galeria | **A** — os dois (`Alert`: Tirar foto / Galeria / Cancelar) |
| 3 | Foto obrigatória? | **A na API** (continua opcional no servidor) **+ obrigatoriedade só no front no cadastro.** Salvar animal novo **sem** foto é recusado no app. Sempre as **duas** rotas: `POST /animais` e `POST /animais/:id/imagem`. Edição **não** chama as duas sempre |
| 4 | POST JSON ok, POST imagem falha | **A** — animal permanece; aviso + ir à lista; completar em Meus animais |
| 5 | Onde **mostrar** a foto | **A** — card (A/P/E + Meus animais) + detalhe + preview do form |
| 6 | Remover foto | **A** — no form de edição (e no criar, se já escolheu local, para trocar). Sem foto no cadastro → não salva (ponto 3) |
| 7 | HEIC / iOS | **B** — `expo-image-manipulator` converte **sempre** para JPEG antes do upload |

### Ponto 1

Captura no form de **cadastro**. Edição reusa o form (já é a tela de mutação da 011): trocar ou remover foto, sem abrir câmera no detalhe.

### Ponto 2

RF0007 pede galeria **ou** câmera. `Alert` nativo, sem lib extra.

### Ponto 3 — obrigatoriedade só no app

A API **não** ganha campo obrigatório. O mobile, no cadastro P/E:

- Validação local: sem foto → “Adicione uma foto” (ou equivalente); **não** chama nenhuma rota.
- Com foto → **sempre** `POST /animais` e em seguida `POST /animais/:id/imagem`.

Na edição: foto não é obrigatória (Mel do seed não tem foto; o usuário pode adicionar). Remover (ponto 6) deixa `urlImagem` null de novo.

### Ponto 4

Animal já gravado. 4-A: “Animal salvo, mas a foto não foi enviada. Você pode adicioná-la em Meus animais.” Reset da spec 007 (aba da situação). Edição: PATCH ok + imagem falha → permanece no form.

### Ponto 5

RF0004/RF0006: foto na listagem e no detalhe. Placeholder só sem URL ou se o `Image` falhar.

### Ponto 6

`DELETE` idempotente. Remover no form, junto do Salvar. No cadastro, Remover só limpa o preview local — aí o Salvar volta a exigir foto.

### Ponto 7 — B

O iPhone grava HEIC; a API recusa. Conversão JPEG no cliente garante câmera e galeria no iOS. Dependência extra (`expo-image-manipulator`), SDK 54.

---

## Fluxos (pontos 1–6)

### Cadastrar (sempre com foto; duas rotas)

```
Usuário                     App                           API
 |  form + Tirar foto/Galeria|                             |
 |  preview local            |                             |
 |  Salvar animal            |                             |
 |-------------------------->|  POST /animais              |
 |                           |---------------------------->|
 |                           |  201 { animal }             |
 |                           |  POST /animais/:id/imagem   |
 |                           |---------------------------->|
 |                           |  200 { animal, urlImagem }  |
 |  aba P/E + GET            |<----------------------------|
```

Cancelar o picker → form inalterado, sem POST.  
Salvar **sem** foto → validação local; **nenhuma** rota.

### Editar foto

Meus animais → detalhe → lápis → form com preview da URL (ou iniciais) → Galeria/Câmera ou Remover → Salvar.

### Falha

| Situação | UI |
|----------|-----|
| Permissão câmera/galeria negada | Alert: “Permissão necessária” + texto para ativar nas configurações do aparelho |
| Picker cancelado | nada |
| Cadastro sem foto | “Adicione uma foto”; sem HTTP |
| MIME inválido / > 8 MB (cliente) | mensagem no topo do form; sem HTTP de imagem |
| 400 / 503 no POST imagem (criar, JSON já 201) | ponto 4 |
| 400 / 503 no POST/DELETE imagem (editar) | erro no form; não volta |
| 401 | logout |
| 403 | `error.message` |
| URL da lista/detalhe falha ao carregar | iniciais |

---

## Contrato de UI

Idioma: **PT-BR**. Identificadores em inglês.

### Formulário — seção Foto

Nova seção **antes** de Informações básicas (mesmo card branco, raio ~12).

| Elemento | Texto / regra |
|----------|----------------|
| Título da seção | Foto |
| Apoio (cadastro) | Obrigatória. Uma foto; a nova substitui a anterior. |
| Apoio (edição) | Uma foto; a nova substitui a anterior. Pode remover. |
| Preview | imagem local **ou** `urlImagem` **ou** placeholder (ícone câmera + iniciais) |
| Botão 1 | Tirar foto |
| Botão 2 | Galeria |
| Remover | visível se houver preview (local ou URL); “Remover foto” |
| A11y preview | “Foto do animal” |
| A11y Tirar foto | “Tirar foto do animal” |
| A11y Galeria | “Escolher foto da galeria” |
| A11y Remover | “Remover foto do animal” |

Toque no preview: o mesmo `Alert` dos botões (Tirar foto / Galeria / Cancelar), para área grande.

`Alert` ao escolher origem:

| Botão | Ação |
|-------|------|
| Tirar foto | permissão câmera → `launchCameraAsync` |
| Galeria | permissão biblioteca → `launchImageLibraryAsync` |
| Cancelar | fecha |

Copy do Alert título: **Foto do animal**.

### Listas e detalhe (ponto 5-A)

| Superfície | Com `urlImagem` | Sem URL / erro |
|------------|-----------------|----------------|
| `AnimalCard` (A, P, E, Meus animais) | `Image` 72×72 | iniciais |
| `AnimalDetail` hero | `Image` no quadrado atual | iniciais |

Sem botão de foto nas listas. Sem overlay de câmera no card.

### Permissões (Alert)

| Situação | Título | Corpo |
|----------|--------|-------|
| Câmera negada | Câmera indisponível | Permita o acesso à câmera nas configurações para fotografar o animal. |
| Galeria negada | Galeria indisponível | Permita o acesso às fotos nas configurações para escolher a imagem do animal. |

### Loading do Salvar

Inalterado: **Salvando…** cobre JSON + imagem. Não segundo spinner.

### Navegação

**Nenhuma rota nova.** `AnimalForm` / `AnimalDetail` / listas inalterados em params.

```
AppNavigator (stack) — igual 011
  MainTabs / ChooseAnimalStatus / AnimalForm / AnimalDetail / Profile / MyAnimals
```

---

## Arquitetura de código

```
app.json                         # plugin expo-image-picker + copy de permissão
package.json                     # + expo-image-picker + expo-image-manipulator (SDK 54)

src/
  services/
    api.js                       # + requestForm (multipart)
    animaisService.js            # + enviarImagem(id, asset) + removerImagem(id)
    imagePicker.js               # permissões, launch camera/library, validar MIME/tamanho
  screens/
    AnimalFormScreen.js          # seção Foto; dirty inclui foto; save em duas etapas
    AnimalDetailScreen.js        # Image no hero
  components/
    AnimalCard.js                # Image ou iniciais
    AnimalPhoto.js               # opcional: preview compartilhado (form + card + detalhe)
```

Sem Context de imagens. Sem persistir arquivo local além do estado do form.

`enviarImagem` recusa id inválido e asset sem `uri`. Monta `FormData` com campo `imagem`.

`AnimalPhoto`: um componente pequeno evita três cópias de `onError` → iniciais.

---

## Regras de negócio (cliente)

1. Nunca enviar `urlImagem` / `keyImagem` no JSON.
2. Nunca mutar foto de animal `A` ou que não seja do usuário logado.
3. Uma foto; POST novo substitui (servidor).
4. Cadastro mobile: foto obrigatória no form; API continua opcional. Sempre duas rotas no create.
5. Validar MIME e 8 MB **antes** do multipart.
6. 401 → logout. 403 → mensagem, sessão permanece.
7. Não logar JWT nem o `FormData`.
8. Listas públicas só leem `urlImagem`; não pedem permissão de câmera.
9. Spec 006 (buscar por foto) não muda.

---

## Decisões técnicas

| Item | Escolha |
|------|---------|
| Canal | Mobile (usuário) |
| Backend / web | **intocados** |
| HTTP cadastro | **sempre** `POST /animais` + `POST /animais/:id/imagem` |
| HTTP edição | PATCH e/ou POST/DELETE imagem, conforme dirty |
| Foto no cadastro | obrigatória **só no app** |
| Lib picker | `expo-image-picker` (SDK 54) |
| Conversão JPEG | **7-B** `expo-image-manipulator` (`SaveFormat.JPEG`, 0.7) |
| Câmera custom | não |
| Recorte | 1:1, `allowsEditing` |
| Qualidade | 0.7 |
| Exibição | `Image` RN; fallback iniciais |
| Rota nova | não |
| RF0008 | fora |

---

## Critérios de pronto (após aprovação + implementação)

- [x] Pontos 1–7 fechados nesta spec
- [x] Login `usuario@adopet.local` → FAB → cadastrar P/E **com** foto da galeria → as duas rotas → card na aba correspondente **mostra a foto**
- [x] Mesmo fluxo **Tirar foto** (iPhone / Expo Go) → 200 e foto no detalhe
- [x] Cadastro **sem** foto → “Adicione uma foto”; **nenhum** POST
- [x] Meus animais → editar Mel → adicionar foto → PATCH/POST conforme dirty → detalhe e lista Encontrados mostram a foto
- [x] Editar → Remover foto → `DELETE` → volta o placeholder
- [x] Segundo POST de imagem no mesmo animal → foto nova no card (substituição)
- [x] Arquivo recusado no cliente (se testável) ou PDF via galeria se o SO permitir → 400 / mensagem no form
- [x] Permissão negada → Alert PT-BR, sem crash
- [x] Thor (ONG) na aba Adoção: se a ONG tiver foto (web futuro), o card **mostra**; o usuário **não** edita a foto pelas listas públicas
- [x] Usuário **não** consegue anexar foto a Thor pelo app (sem lápis no detalhe público)
- [x] POST JSON ok + Storage fora (503) → ponto 4 (animal na lista, aviso de foto)
- [x] 401 no POST imagem → login
- [x] Botão câmera das listas P/E (006) continua **Em breve**
- [x] Backend intocado; web intocado
- [x] CONTEXTO: checklist RF0007; RF0006 foto real; decisão §8; spec 012 no texto das specs
- [x] `specs/README.md` — status aprovada e implementada (só depois de codar)

## Como validar (após implementação)

Pré-requisito: API + seed + `.env` de Storage no backend (bucket `animais` público). JWT usuário.

```bash
# terminal 1
cd D:\adopet-backend
npm run dev

# terminal 2
cd D:\adopet-mobile
npx expo start
```

1. Login usuário → FAB → Perdi um animal → preencher form → **Galeria** → Salvar → aba Perdidos com a foto no card
2. Abrir o detalhe → hero com a mesma foto (não iniciais)
3. Perfil → Meus animais → o animal novo → lápis → **Remover foto** → Salvar → placeholder
4. De novo: **Tirar foto** (aparelho) → Salvar → foto nova
5. Cadastro sem foto → mensagem local; conferir no backend que **não** nasceu animal
6. Adoção → Thor (sem foto no seed) → iniciais; detalhe **sem** Tirar foto
7. Listas P/E: botão câmera da busca continua desabilitado
8. Parar o Storage / env (se reproduzível) no segundo passo do cadastro com foto → aviso do ponto 4; animal na lista sem foto

## Checklist de implementação (após a autora pedir)

1. [x] Fechar pontos 1–7 nesta spec + índice no `specs/README.md`
2. [x] Dependência `expo-image-picker` + `expo-image-manipulator` + plugin `app.json`
3. [x] `requestForm` + `enviarImagem` / `removerImagem`
4. [x] `imagePicker.js` (permissões, validação, JPEG)
5. [x] Seção Foto no `AnimalForm` (criar/editar, dirty, ponto 4)
6. [x] `AnimalCard` + `AnimalDetail` com `Image` e fallback
7. [x] CONTEXTO

## Relação com as specs 006, 007, 008 e 011

A 006 reservou o **ícone de câmera na lista** para RF0008 e deixou explícito “sem câmera/galeria”. Esta 012 é o **RF0007** no **form do animal**, outro ponto de entrada. A 007/011 omitiram o bloco de fotos. A 008 usou placeholder. Esta fatia **não** reabre cadastro de adoção, mutação nas listas públicas, nem busca por similaridade.
