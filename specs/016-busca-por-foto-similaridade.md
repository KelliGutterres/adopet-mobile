# Spec 016 — Busca por foto / similaridade (RF0008)

> **Status:** aprovada e implementada (2026-09-15).  
> **Atualização (2026-09-30):** o rótulo visível da aba e o título da tela passaram de **Similaridade** para **Busca por Foto**. A rota interna continua `Similaridade`. O botão segue **Buscar por foto**.  
> **Atualização (2026-10-05):** aba e título passam a **Busca por Imagem**. A rota interna continua `Similaridade`. O botão segue **Buscar por foto**.  
> Depende de: spec 006 (botão câmera P/E); spec 009 (aba Similaridade); spec 012 (`expo-image-picker` + JPEG); spec 008 (detalhe); spec 015 (proxy Metro); **backend spec 012** (`POST /animais/comparar`).  
> **Não altera** o `adopet-backend` nesta fatia (contrato já na API 012).  
> **Não altera** o `adopet-web` (painel da ONG não busca por foto nesta fase).  
> Fecha **RF0008** no canal mobile.

O mobile é **somente usuário**. A comparação roda no **Node + Python**; o app só envia a foto e mostra os candidatos.

---

## Objetivo

Permitir que o usuário **envie uma foto** (câmera ou galeria) e veja **animais perdidos/encontrados visualmente semelhantes**, com score. Ativa o botão das listas P/E (spec 006) e a aba **Similaridade** (spec 009).

Cobre **RF0008** no app e usabilidade (**RNF0001**). Sem secret do Python no cliente (**RNF0002**).

---

## Recorte vs o que já existe

| Fluxo | Onde está | Nesta spec |
|-------|-----------|------------|
| Botão câmera P/E desabilitado | spec 006 | **ativar** — abre picker e vai à aba Similaridade |
| Aba Similaridade disabled | spec 009 | **ativar** — vira `Tab.Screen` com a tela de busca/resultados |
| Câmera/galeria + JPEG | spec 012 (`imagePicker.js`) | **reusar** (não é upload de cadastro) |
| `POST /animais/:id/imagem` | spec 012 | **inalterado** — foto da busca **não** grava no Storage |
| `POST /animais/comparar` | backend spec 012 | **consumir** |
| Detalhe A/P/E | spec 008 | toque no candidato navega para o detalhe já existente |
| Adoção (`A`) | spec 005 / backend 012 | **sem** botão câmera; **não** entra no ranking (API) |
| Painel web | — | **fora** |

---

## Referência visual

Não há print de similaridade na Parte 1 (Fig. 13 = auth; Fig. 15 = listagem). Espelhar o idioma das listas (spec 005): header da marca, cards, estados vazio/loading/erro.

| Fonte | Uso |
|-------|------|
| Spec 005 (`AnimalListScreen`) | Header + lista de `AnimalCard` |
| Spec 006 | Mesmo botão 44×44 na linha da busca (agora habilitado) |
| Spec 009 | Slot da barra **Similaridade**; ícone dos dois círculos |
| Spec 012 | Alert Tirar foto / Galeria / Cancelar |
| Backend 012 | Envelope `{ candidatos: [{ scoreSimilarity, animal }] }` |

```
[header AdoPet]                    [sino] [avatar]
Similaridade
Envie uma foto para encontrar animais
perdidos ou encontrados parecidos

[ Buscar por foto ]

── após a busca ──
[foto enviada]   Nova busca
2 animais semelhantes

[card] 91%  Encontrado  Cão  Médio  >
[card] 74%  Perdido     Gato Pequeno >
```

---

## Escopo (esta tarefa)

1. `Tab.Screen` **Similaridade** com `SimilarityScreen` (vazia → picker → loading → resultados)
2. Botão câmera das listas **Perdidos** e **Encontrados** habilitado: picker → mesma tela
3. `animaisService.compararAnimais(uri)` → `POST /animais/comparar` (multipart `imagem`, JWT)
4. Timeout de **90 s** só nesta rota (ResNet50 em CPU)
5. Cards com chip de score (%) + situação (P/E); toque → `AnimalDetail`
6. Estados: loading, vazio (ninguém no corte), erro (400/503/rede), 401 → logout
7. Atualizar `docs/CONTEXTO-PROJETO.md` após implementação

---

## Fora de escopo

- Alterar o `adopet-backend` (limiar, limite, modelo, `Transacao`, embedding)
- Guardar a foto da busca no Storage
- Comparar animais de **adoção**
- Query `limite` / `minScore` / `statusAlvo` na UI (usar **padrão da API**: 5, 0,6, `P,E`)
- Filtros avançados (RF0005)
- Ajustar o limiar no app
- Histórico de buscas / lista de `Transacao`
- Painel web
- `expo-camera` com UI própria
- TypeScript, NativeWind, Expo Router
- Testes automatizados
- Role `admin`

---

## RF/RNF relacionados

| ID | Cobertura nesta spec |
|----|----------------------|
| RF0008 | **Sim** — enviar foto e receber candidatos semelhantes |
| RF0007 | Reusa câmera/galeria já da spec 012; **não** é o upload do cadastro |
| RF0004 / RF0006 | Resultado usa card + detalhe já existentes |
| RNF0001 | Entrada óbvia (aba + câmera P/E); loading e vazio explícitos |
| RNF0002 | JWT no multipart; Python só o Node chama |

---

## O que já existe (não reinventar)

| Já pronto | Onde |
|-----------|------|
| `POST /animais/comparar` JWT + campo `imagem`; 200 `{ candidatos }`; 503 se Python fora | backend spec 012 |
| Padrão: `limite=5`, `minScore=0.6`, `statusAlvo=P,E`; lista vazia ainda 200 | backend spec 012 |
| `animal` no candidato = mesmo formato do `GET /animais/:id` (sem `embedding`) | backend spec 012 |
| `pickAnimalJpeg` + `showPhotoSourceAlert` | spec 012 |
| `requestForm` (multipart, sem `Content-Type: application/json`) | spec 012 / `api.js` |
| `AnimalCard` / `AnimalDetail` | specs 005 / 008 |
| Botão câmera (disabled) e aba Similaridade (disabled) | specs 006 / 009 |
| Proxy Metro `/animais` | spec 015 |

O app **não** chama o FastAPI. Nunca `X-AI-Service-Secret`.

---

## Contrato de API (consumo)

`POST /animais/comparar`  
Auth: Bearer JWT `usuario`  
Body: `multipart/form-data`, campo **`imagem`** (JPEG, como a spec 012).  
Query: **omitida** (padrão do servidor).

**200**

```json
{
  "candidatos": [
    {
      "scoreSimilarity": 0.9123,
      "animal": { }
    }
  ]
}
```

**400** arquivo inválido · **401** sem JWT → logout · **503** `{ error: { message } }` (IA fora)

A foto da busca **não** é persistida. Cada busca bem-sucedida grava `Transacao` no servidor (o app não lê essa tabela).

---

## Decisões desta rodada (2026-09-15)

| # | Tema | Decisão |
|---|------|---------|
| 1 | Entrada | **Aba + botão P/E** — um fluxo, uma tela |
| 2 | Picker | Câmera **e** galeria (mesmo Alert da 012); título “Buscar por foto” |
| 3 | Catálogo | Padrão da API (`P` e `E`); **sem** `statusAlvo` cruzado na UI |
| 4 | Score | Chip inteiro `91%` (`Math.round(score * 100)`); a11y “91% semelhante” |
| 5 | Timeout | **90 s** em `/animais/comparar` **e** em `POST /animais/:id/imagem` (demais rotas continuam 20 s) |
| 6 | Cor da aba | Roxo da marca `#7C3AED` (não é A/P/E) |
| 7 | Foto enviada | Preview local no topo dos resultados; **não** sobe ao Storage |

Cancelar o picker **não** troca de tela. Filtros da listagem e Adoção **inalterados**.

---

## Contrato de UI

Idioma: **PT-BR**. Identificadores de código em inglês.

### Barra inferior

| Slot | Hoje (009) | Nesta spec |
|------|------------|------------|
| Similaridade | disabled, “Em breve” | **habilitada**; `Tab.Screen` `Similaridade` |

Adoção / Perdidos / Encontrados / FAB **inalterados**.

### Botão câmera (listas P/E)

- Habilitado; opacidade normal (não mais 0,7 de disabled).
- `accessibilityLabel="Buscar por foto"`; **sem** hint “Em breve”.
- Toque → Alert câmera/galeria → JPEG → `navigate('Similaridade', { photoUri })`.
- Adoção **não** mostra o botão.

### Tela `SimilarityScreen`

Header: `AppHeader` roxo + título **Similaridade**.

| Estado | Copy |
|--------|------|
| Inicial | subtítulo “Envie uma foto para encontrar animais perdidos ou encontrados parecidos”; botão “Buscar por foto” |
| Loading | “Comparando imagens… Pode levar alguns segundos.” |
| Vazio após busca | “Nenhum animal semelhante encontrado.” |
| Erro | mensagem da API (`error.message`) ou rede; “Tentar novamente” |
| Resultados | “N animal semelhante” / “N animais semelhantes”; cards com score + situação |
| Nova busca | “Nova busca” (reabre o picker) |

Toque no card → `AnimalDetail` (`idAnimal` + `status`), só leitura, como nas listas públicas.

401 em qualquer passo → `logout()` (igual às outras telas).

### Copy compartilhada

| Elemento | Texto |
|----------|--------|
| Aba / título | Similaridade |
| Botão | Buscar por foto |
| Alert picker | Buscar por foto |
| Loading | Comparando imagens… Pode levar alguns segundos. |
| Vazio | Nenhum animal semelhante encontrado. |
| Timeout | A comparação demorou demais. Tente novamente. |
| 503 | Serviço de comparação indisponível (texto da API) |

### Acessibilidade mínima

- Área de toque ≥ 44px no botão câmera, CTA e Nova busca
- Card: título + score + situação no `accessibilityLabel`
- Loading com `accessibilityLiveRegion="polite"`

---

## Arquitetura de código

```
src/
  navigation/
    MainTabNavigator.js     # + Tab.Screen Similaridade
  components/
    BottomTabBar.js         # Similaridade habilitada; tema roxo
    SearchBar.js            # onPhotoSearch; botão ativo
    AnimalCard.js           # chip opcional scoreSimilarity
  screens/
    SimilarityScreen.js     # nova
    AnimalListScreen.js     # câmera P/E → picker → aba
  services/
    api.js                  # timeout opcional no requestForm
    animaisService.js       # compararAnimais + enviarImagem (timeout 90 s)
    animalLabels.js         # labelScoreSimilarity
    imagePicker.js          # título do Alert + startPhotoSearch
```

Fluxo: picker JPEG → `compararAnimais(uri)` → lista `candidatos` → detalhe.

Sem Context novo. Sem persistir a URI da busca. Sem chamar `/embed`.

---

## Regras de negócio (cliente)

1. Não chamar o Python. Não enviar `embedding` no body.
2. Não persistir a foto da busca; não chamar `POST /animais/:id/imagem` neste fluxo.
3. Não comparar adoção no cliente (a API já exclui `A`).
4. Não inventar query `limite` / `minScore` / `statusAlvo`.
5. 401 → logout. 503 / timeout → mensagem na tela, sessão preservada.
6. Cancelar o picker não dispara POST.
7. Não logar JWT nem o vetor.

---

## Critérios de pronto

- [x] Pontos 1–7 fechados nesta spec
- [x] Aba Similaridade abre a tela e **não** está mais “Em breve”
- [x] Perdidos e Encontrados: câmera habilitada; Adoção sem o botão
- [x] Picker câmera/galeria → `POST /animais/comparar` → cards com % e situação
- [x] Lista vazia 200 mostra o empty state (não é erro)
- [x] Toque no candidato abre o detalhe (008)
- [x] 401 desloga; 503 mostra a mensagem da API
- [x] Foto da busca não aparece nas listas (não gravou Storage)
- [x] Backend e web intocados
- [x] CONTEXTO + `specs/README.md` atualizados

---

## Como validar (após implementação)

Pré-requisito: API Node **e** serviço Python (`ai/`) no ar; animais P/E **com foto** (embedding gerado no upload).

```bash
# terminal 1 — API
cd D:\adopet-backend
npm run dev

# terminal 2 — IA
cd D:\adopet-backend\ai
# venv + uvicorn na porta 8000 (README em ai/)

# terminal 3 — app
cd D:\adopet-mobile
npx expo start
```

1. Login `usuario@adopet.local` / `senha123`
2. Aba Similaridade → “Buscar por foto” → galeria ou câmera → loading → cards ou vazio
3. Conferir % e chip Perdido/Encontrado; abrir um detalhe; voltar preserva a aba
4. Listas P/E: botão câmera faz o mesmo fluxo; Adoção **sem** o botão
5. Cancelar o Alert não navega e não chama a API
6. Parar o Python → 503 na tela, usuário continua logado

Seed sem foto **não** entra no ranking (sem embedding). Para ver score > 0, usar animais cadastrados com imagem (spec 012).

---

## Checklist de implementação (após aprovação)

1. Spec (este arquivo) + índice no `specs/README.md`
2. `compararAnimais` + `enviarImagem` com timeout 90 s
3. `SimilarityScreen` + tab + tema roxo
4. Ativar botão câmera P/E
5. Chip de score no `AnimalCard`
6. CONTEXTO (RF0008; decisão §8; aba e botão ativos)
