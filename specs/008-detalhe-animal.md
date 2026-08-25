# Spec 008 — Detalhe do animal (app mobile)

> **Status:** aprovada e implementada.  
> Pontos 1–7 fechados no refinamento de 2026-08-24.  
> Depende de: spec 005 (listagem + cards); spec 007 (stack autenticado); backend spec 005 (`GET /animais/:id`).  
> **Não altera** o `adopet-backend`.  
> Card Trello: [Tela de detalhes do animal](https://trello.com/c/AkJGJESM/54-tela-de-detalhes-do-animal).  
> Número: a listagem (005) e o cadastro (007) apontavam o detalhe como **006**. O arquivo 006 já é o botão buscar por foto. **Esta fatia é a 008** (pedido da autora). Filtros (RF0005) deixam de ocupar o 008 e ficam como spec futura.

O mobile é **somente usuário**. Painel da ONG permanece no web (sem tela de detalhe só leitura).

## Objetivo

Abrir uma tela de **consulta** ao tocar o card nas listagens de **Adoção**, **Perdidos** e **Encontrados**. Cobre **RF0006** no canal mobile (fotos, descrição, localização e demais dados **já existentes na API**), com usabilidade (**RNF0001**).

Uma tela só, parametrizada. As três listas usam o mesmo destino; o tema e o copy seguem o `status` do animal.

## Recorte vs roadmap

A spec 005 deixou o chevron visível e o toque **sem navegação**. A 007 ativou o cadastro P/E e deixou edição/exclusão para depois do detalhe. Esta 008 entrega **só a leitura**. Edição/exclusão no app continuam para fatia seguinte.

| Fluxo | Web (ONG) | Mobile (usuário) |
|-------|-----------|------------------|
| Listagem A / P / E | spec 003 | spec 005 |
| Cadastro | spec 007 (A/P/E) | spec 007 (só P/E) |
| Detalhe só leitura | **não** (edição carrega o id) | **esta spec** |
| Edição / exclusão | spec 007 | futura (depois desta) |
| Filtros (RF0005) | cliente na 003 | spec futura (fase 2) |
| Foto / Storage | fase 2 | fase 2 |

## Referência visual

Não há print mobile de detalhe na Parte 1 (Fig. 15 é **listagem**; Fig. 16–17 são **web**). Esta fatia reusa o idioma visual já no app: tema por situação, cards brancos, chips, placeholder de foto, header com voltar (padrão da tela de escolha / form — spec 007).

| Fonte | Uso |
|-------|-----|
| [listagem-animais-mobile.png](../docs/prototipos/listagem-animais-mobile.png) | Shell, paleta A/P/E, o que o card já antecipa |
| Spec 005 (`AnimalCard`, `animalLabels`) | Título E genérico vs nome em P/A; chips; cidade |
| Spec 007 (`ChooseAnimalStatus` / `AnimalForm`) | Header com voltar; fundo `listBackground`; seções em card |

## Escopo (esta tarefa)

1. Toque no card (área inteira, inclusive chevron) nas **três** abas → tela de detalhe
2. Uma tela `AnimalDetail` no stack autenticado, params `{ idAnimal }`
3. `animaisService.buscarAnimal(id)` → `GET /animais/:id`
4. Exibir somente campos da API (tabela print × modelo)
5. Tema pela situação do animal (`A` verde / `P` terracota / `E` roxo)
6. Estados: loading, erro de rede/API, 404, 401 → logout
7. Voltar (header) retorna à lista de origem
8. Atualizar `docs/CONTEXTO-PROJETO.md` após implementação

## Fora de escopo

- Alterar o `adopet-backend` (contrato, novos campos no `include`, envelope)
- Edição e exclusão no app (card 56 restante — depois desta)
- Botões Editar / Excluir / “Em breve” nesta tela (consulta pura)
- CTA “Entrar em contato”, WhatsApp, telefone, e-mail (API devolve só `id` + `nome` do tutor)
- Upload / câmera / galeria / foto real (RF0007 — fase 2)
- Gênero, bairro, data de perda/encontro, vacinado, vermifugado, cor, `createdAt`
- Filtros (RF0005), Perfil/Sair (spec 009), busca por foto real (RF0008)
- Deep link / URL compartilhada
- Tela de detalhe no web
- TypeScript, NativeWind, Expo Router
- Testes automatizados
- Role `admin` no JWT

## RF/RNF relacionados

| ID | Cobertura nesta spec |
|----|----------------------|
| RF0006 | **Sim** — detalhe com descrição, localização e dados do animal (sem fotos reais) |
| RF0004 | Lista inalterada; o card passa a navegar |
| RF0003 | **Não** — sem mutação |
| RF0007 | **Não** — placeholder de foto |
| RNF0001 | Tema da situação; loading/erro/404 em PT-BR; voltar óbvio |
| RNF0002 | GET público; Bearer já injetado; 401 → logout |

## O que já existe (não reinventar)

| Já pronto | Onde |
|-----------|------|
| `GET /animais/:id` → **200** `{ animal }` (público) | backend spec 005 |
| Mesmo `include` da listagem (cidade, raça, instituição, usuário) | `animais.service.js` |
| Envelope `{ error: { message } }`; 404 “Animal não encontrado” | `api.js` / backend |
| Cards + chevron sem `onPress` | `AnimalCard` / spec 005 |
| Stack `MainTabs` + cadastro P/E | spec 007 / `AppNavigator` |
| `tituloCard`, labels de espécie/porte/idade/cidade | `animalLabels.js` |
| Paleta por situação | `theme/colors.js` |

O app chama **somente** `GET /animais/:id` (além do `GET` de lista já existente). Nunca `PATCH`/`DELETE` nesta fatia. Nunca `/auth/ongs/*`.

## Contexto técnico (API)

Base: `EXPO_PUBLIC_API_URL`. `GET` é **público**; o cliente **mesmo assim** envia Bearer (já injetado).

### `GET /animais/:id`

**200** — `{ "animal": { ... } }`

```json
{
  "idAnimal": 1,
  "nome": "Thor",
  "status": "A",
  "descricao": "Cachorro dócil disponível para adoção",
  "especie": "CAO",
  "idade": 3,
  "porte": "M",
  "cidade": { "idCidade": 1, "nome": "Lajeado", "uf": "RS" },
  "raca": { "idRaca": 1, "nome": "Vira-lata" },
  "instituicao": { "idInstituicao": 1, "nome": "ONG AdoPet Demo" },
  "usuario": null
}
```

| HTTP | Quando | UI |
|------|--------|-----|
| 200 | ok | monta a tela |
| 400 | id inválido | erro + voltar |
| 404 | não existe (ex.: excluído no web) | “Animal não encontrado.” + voltar à lista |
| 401 | token | logout → Login (spec 002) |
| Rede | API fora | mensagem do `api.js` + Tentar novamente |

Não inventar campo. `usuario` / `instituicao` vêm só com **id + nome** — sem `contato`, sem `email`.

Seed esperado na validação:

| Animal | `status` | Tutor | Entrada |
|--------|----------|-------|---------|
| Thor | `A` | ONG AdoPet Demo | aba Adoção |
| Luna | `P` | ONG AdoPet Demo | aba Perdidos |
| Mel | `E` | Usuario Demo | aba Encontrados |

### Print × modelo (detalhe)

Mesma disciplina das specs 005/007: **não inventar campo**.

| Elemento desejável | No modelo/API? | Nesta fatia |
|--------------------|----------------|-------------|
| Foto | não (Storage futuro) | placeholder maior (iniciais do `nome`) |
| Título Adoção / Perdidos | `nome` | sim |
| Título Encontrados | rótulo genérico no card | **mesmo** do card: “Cachorro encontrado” / “Gato encontrado” |
| Nome em Encontrados | `nome` (ex.: Mel) | **sim**, como linha “Nome cadastrado” — a 005 deixou o nome para o detalhe |
| Situação | `status` | chip: Para adoção / Perdido / Encontrado |
| Descrição | `descricao` | sim |
| Localização | `cidade.nome` + `uf` | `{cidade} - {uf}` |
| Espécie / raça / idade / porte | sim | sim; omitir idade/porte se `null` |
| Gênero | **não existe** | **omitir** |
| Data | **não existe** | **omitir** |
| Vacinado / vermifugado / cor / bairro | **não existem** | **omitir** |
| Responsável Adoção | `instituicao.nome` | “ONG responsável”; fallback `usuario.nome` |
| Quem cadastrou P/E | `usuario.nome` ou `instituicao.nome` | “Cadastrado por” |
| Telefone / e-mail / WhatsApp | **não vêm no GET** | **omitir** (spec futura + backend) |
| Editar / excluir | API existe | **omitir** nesta fatia |
| Sino | — | **não** nesta tela (igual form 007) |

## Pontos fechados (2026-08-24)

| # | Tema | Decisão |
|---|------|---------|
| 1 | Número da spec | **008.** O 006 no disco é busca por foto. Filtros saem do 008. |
| 2 | Uma tela vs três | **Uma** (`AnimalDetailScreen`) para A, P e E. Tema/copy pelo `status` do animal, não pela aba. |
| 3 | Fonte dos dados | Sempre `GET /animais/:id`. A lista **não** é a fonte da verdade (pode ter sido editado/excluído no web). Param: `idAnimal`. |
| 4 | Mutação | **Só leitura.** Sem Editar/Excluir/contato. |
| 5 | Nome em Encontrados | Título genérico (igual ao card) **e** o `nome` da API numa linha própria. |
| 6 | Contato | **Omitir.** Expor telefone/e-mail exigiria mudar o `include` da API. |
| 7 | Header | Cor do tema da situação; voltar; **sem** sino. Título do header: “Detalhes”. |

### Ponto 2 — por que uma tela

As três listas já compartilham `AnimalListScreen`. O detalhe é o mesmo objeto `Animal` com `status` diferente. Três arquivos copiados quebram labels e estados. O tema (verde / terracota / roxo) já existe em `statusTheme`.

A aba de origem **não** redefine a situação: se o registro for `E`, o detalhe é Encontrados mesmo que o usuário tenha chegado por um atalho futuro.

### Ponto 3 — por que GET por id

```
Lista (GET ?status=)  →  toque  →  AnimalDetail { idAnimal }
                                      →  GET /animais/:id
                                      →  200 monta  |  404 “não encontrado”
```

Pintar com o item da lista evitaria o loading, mas mostraria dado velho se a ONG tiver editado no painel. O GET por id é barato (um registro) e é o contrato do RF0006 na API.

Não passar o objeto `animal` como fonte. Opcional na implementação: passar `status` da lista **só** para colorir o header no primeiro paint, antes do GET voltar. Se o GET divergir, o tema segue o `status` da resposta.

`idAnimal` ausente ou não numérico → não chamar a API; voltar à lista.

## Fluxos

### Abrir detalhe

```
Usuário                     App                           API
 |  aba A / P / E            |                             |
 |  toque no card            |                             |
 |-------------------------->|  GET /animais/:id           |
 |                           |---------------------------->|
 |                           |  200 { animal }             |
 |  tela detalhe             |<----------------------------|
```

1. Toque no card (qualquer uma das três abas).
2. Stack: `navigate('AnimalDetail', { idAnimal })`.
3. Loading no detalhe → `GET /animais/:id`.
4. Sucesso → seções preenchidas; tema = `animal.status`.
5. Voltar (header ou gesto) → lista de origem; **sem** resetar busca da aba.

### Falha

| Situação | UI |
|----------|----|
| Loading | “Carregando detalhes…” + header já visível |
| 404 / 400 | texto de erro + botão Voltar à lista (não Ficar numa tela vazia) |
| Rede | mensagem do `api.js` + Tentar novamente (repete o GET) |
| 401 | logout → Login |

Pull-to-refresh no detalhe: **não** nesta fatia (tela curta; Voltar + novo toque basta).

## Contrato de UI

Idioma: **PT-BR**. Identificadores em inglês.

### Navegação

O detalhe entra no **mesmo** stack da spec 007, irmão das tabs e do cadastro:

```
AppNavigator (native-stack)
  MainTabs              # Perdidos / Encontrados / FAB / Adoção / Perfil
  ChooseAnimalStatus
  AnimalForm
  AnimalDetail          # params: { idAnimal: number }
```

Da lista (tela dentro das tabs), `navigation.navigate('AnimalDetail', { idAnimal })` sobe ao stack pai (React Navigation v7).

| Tela | Auth | Comportamento |
|------|------|----------------|
| `AnimalDetail` | JWT usuário | consulta `GET /:id` |
| Tabs / cadastro | inalterados | FAB, Filtros, câmera, Perfil, sino **como hoje** |
| Card | — | deixa de ser só visual; `accessibilityRole="button"` |

Voltar do detalhe **não** passa pelo form de cadastro.

### Header

| Elemento | Texto / regra |
|----------|----------------|
| Título | Detalhes |
| Voltar | `accessibilityLabel="Voltar"`; `goBack()` |
| Fundo | `statusTheme[status].primary` (se `status` ainda não veio, cinza da lista ou a cor da aba — ver ponto 3) |
| Ícones à direita | nenhum (sem sino) |
| StatusBar | `light` sobre o header colorido |

### Hero (abaixo do header, no scroll)

1. Placeholder quadrado grande (iniciais do `nome` da API — também em Encontrados)
2. Título:
   - `A` e `P`: `nome`
   - `E`: `tituloCard` (“Cachorro encontrado” / “Gato encontrado”)
3. Chip de situação (uma linha): Para adoção / Perdido / Encontrado
4. Se `E`: linha **Nome cadastrado** + `nome` (ex.: Mel)
5. Chips espécie + porte (iguais ao card; omitir porte se `null`)

### Seções (cards brancos, raio ~12, como o form)

| Seção | Conteúdo |
|-------|----------|
| Descrição | `descricao` completa (sem truncar; wrap) |
| Informações | Espécie, raça, idade, porte — cada um numa linha label / valor; omitir idade se `null` |
| Localização | pin + `{cidade.nome} - {uf}` |
| Responsável | ver tabela abaixo |

#### Copy do responsável

| `status` | Label | Valor |
|----------|--------|-------|
| `A` | ONG responsável | `instituicao.nome`; se `null`, `usuario.nome`; se ambos `null`, omitir a seção |
| `P` / `E` | Cadastrado por | `usuario.nome` ou `instituicao.nome` (o que não for `null`) |

Não mostrar ids (`idAnimal`, `idUsuario`, …) na UI.

### Labels de campo (iguais ao form / web)

| Campo | Label |
|-------|--------|
| Nome cadastrado (só E) | Nome cadastrado |
| Espécie | Espécie |
| Raça | Raça |
| Idade | Idade (`{n} ano` / `{n} anos`) |
| Porte | Porte (Pequeno / Médio / Grande) |
| Descrição | Descrição |
| Cidade | Localização |

### Layout

- **Não** usar `AuthLayout`. Fundo `listBackground`.
- Scroll (`ScrollView`).
- Área de toque do voltar ≥ 44px.
- Card da lista: `Pressable` em volta (ou `onPress` no `AnimalCard`); ripple/opacity no toque.
- Sem rodapé de ação (não há Salvar / Contato).

### Acessibilidade mínima

- Card da lista: `accessibilityRole="button"`; label = título + cidade (já composto); hint “Ver detalhes”
- Header voltar: botão
- Loading `accessibilityLiveRegion`
- Erro visível em texto (não só cor)
- Contraste do título branco no header colorido

## Arquitetura de código

```
src/
  navigation/
    AppNavigator.js            # + screen AnimalDetail
  screens/
    AnimalListScreen.js        # toque no card → navigate
    AnimalDetailScreen.js      # GET por id + seções
  components/
    AnimalCard.js              # onPress; role button
  services/
    animaisService.js          # + buscarAnimal(id)
    animalLabels.js            # reusar; + labelStatus (Para adoção / …)
```

Sem `AnimaisContext`. Sem persistir o detalhe.

`buscarAnimal` recusa id inválido no cliente (não chama a API).

Lista: o `useFocusEffect` atual **permanece** (cadastro 007). Voltar do detalhe pode disparar um GET da aba — aceitável (lista pequena, sem paginação). Não otimizar nesta fatia.

## Regras de negócio (cliente)

1. Chamar `GET /animais/:id` ao abrir o detalhe. Não usar o item da lista como verdade.
2. Não chamar `POST` / `PATCH` / `DELETE`.
3. Não logar o JWT.
4. Labels em PT-BR; códigos `A`/`P`/`E` e `CAO`/`GATO` só no código.
5. Placeholder de foto local — sem URL e sem Storage.
6. Quem aparece no detalhe: o registro pedido, **independente** de ser do usuário logado (GET público, igual à lista).
7. Encontrados: nunca esconder o `nome` da API nesta tela.
8. Campos nulos: omitir a linha, não mostrar “—” a menos que toda a seção fique vazia (aí omitir a seção).

## Decisões técnicas

| Item | Escolha |
|------|---------|
| Canal | Mobile (usuário) |
| Backend | **intocado** |
| Telas | uma para A/P/E |
| HTTP | só `GET /animais/:id` |
| Mutação | nenhuma |
| Contato | omitir (API sem telefone/e-mail no include) |
| Foto | placeholder |
| Gênero / data / vacina / bairro | omitir |
| Nav | stack sobre as tabs (irmão do form) |
| Header | tema da situação; título “Detalhes”; sem sino |
| Libs novas | nenhuma |
| Número | **008** (não 006) |

## Critérios de pronto

- [x] Spec aprovada (pontos 1–7 fechados em 2026-08-24)
- [x] Login usuário → Adoção → toque em **Thor** → detalhe com nome, descrição, ONG, Lajeado - RS
- [x] Perdidos → **Luna** → detalhe com nome, chip Perdido, tema terracota
- [x] Encontrados → card “Cachorro encontrado” → detalhe com título genérico **e** nome cadastrado **Mel**
- [x] As três listas navegam para a **mesma** rota `AnimalDetail`
- [x] Voltar retorna à aba de origem
- [x] Backend parado → erro de rede + Tentar novamente
- [x] Id inexistente (ex.: `/animais/99999`) → “Animal não encontrado.”
- [x] 401 → login
- [x] Sem fotos reais, gênero, data, vacina, contato, Editar/Excluir
- [x] FAB / Filtros / câmera / Perfil / cadastro **não** reescritos além do toque no card
- [x] Backend intocado
- [x] CONTEXTO atualizado (checklist RF0006; decisão na tabela §8; 008 no lugar do “detalhe = 006”)

## Como validar (após implementação)

Pré-requisito: API + seed.

```bash
# terminal 1
cd D:\adopet-backend
npm run dev

# terminal 2
cd D:\adopet-mobile
npx expo start
```

1. Login → Adoção → Thor → detalhe (descrição do seed, ONG AdoPet Demo, cidade)
2. Voltar → mesma aba Adoção
3. Encontrados → Cachorro encontrado → detalhe mostra **Mel** como nome cadastrado
4. Perdidos → Luna → tema terracota, chip Perdido
5. Parar o backend → reabrir um card → erro de rede
6. Conferir que o card agora tem feedback de toque (opacity) e o chevron não é o único alvo

## Checklist de implementação (após a autora pedir)

1. [x] Spec 008 no índice mobile
2. [x] `buscarAnimal` em `animaisService`
3. [x] `AnimalDetailScreen` (header tema, seções, estados)
4. [x] `AppNavigator` + rota `AnimalDetail`
5. [x] `AnimalCard` / lista: `onPress` → navigate
6. [x] Labels de situação em `animalLabels`
7. [x] CONTEXTO
