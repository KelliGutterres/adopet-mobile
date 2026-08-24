# Spec 007 — Cadastro de animal perdido/encontrado (app mobile)

> **Status:** aprovada e implementada.  
> Pontos 1–6 fechados em 2026-08-23.  
> Depende de: spec 005 (listagem + FAB); spec 002 (JWT); backend specs 005 (`POST /animais`) e 007 (`cidade`/`raca` inline).  
> **Não altera** o `adopet-backend`.  
> Card Trello: [Cadastro e edição de animal pelo usuário](https://trello.com/c/znr44dFV/56-cadastro-e-edi%C3%A7%C3%A3o-de-animal-pelo-usu%C3%A1rio) — **esta fatia cobre só o cadastro**.  
> Espelho de produto: web spec 007 (campos do formulário da ONG), com recorte de situação.

O mobile é **somente usuário**. Cadastro de **adoção** permanece no painel web da ONG.

## Objetivo

Ativar o FAB **+** para o usuário registrar um animal **perdido** (`P`) ou **encontrado** (`E`), consumindo `POST /animais` com JWT. Cobre a parte de **cadastro** do **RF0003** no canal mobile, com usabilidade (**RNF0001**) e mutação autenticada (**RNF0002**).

Regra de negócio (autora, 2026-08-23):

> O usuário só cadastra animais **perdidos** ou **encontrados**. Animais de **adoção** só a ONG cadastra (painel web).

No app isso se resolve **na navegação**: depois do `+` existe uma tela só com duas escolhas. **Não há** opção Adoção. O body do `POST` só leva `P` ou `E`.

## Recorte vs roadmap

A spec 005 deixou o FAB visível e **desabilitado** (“Em breve”). Esta 007 ativa o cadastro. O detalhe do animal continua a spec **006**. Edição/exclusão no app ficam para fatia seguinte (precisam da tela de detalhe).

| Fluxo | Web (ONG) | Mobile (usuário) |
|-------|-----------|------------------|
| Listagem A / P / E | spec 003 | spec 005 |
| Cadastro **adoção** (`A`) | spec 007 | **não** — só ONG |
| Cadastro **perdido / encontrado** | spec 007 (as três listas) | **esta spec** |
| Edição / exclusão | spec 007 | futura (após detalhe 006) |
| Detalhe | — | spec 006 |
| Foto / Storage | fase 2 | fase 2 |

## Referência visual

Não há print mobile de cadastro de animal na Parte 1 (Fig. 16 é **web**, adoção). Esta fatia adapta o formulário do painel ao app e acrescenta uma tela de escolha que o print web **não** tem (no web a situação vem da lista da sidebar).

| Fonte | Uso |
|-------|-----|
| [listagem-animais-mobile.png](../docs/prototipos/listagem-animais-mobile.png) | Shell da listagem; FAB passa a navegar |
| Web `cadastro-animal-adocao.png` / web spec 007 | Campos, labels, obrigatoriedade, seções Informações básicas + Localização |
| Spec 003 mobile (`TextField`, validação, erro em texto) | Padrão de form nativo (sem `AuthLayout`) |

## Escopo (esta tarefa)

1. Ativar o FAB **+** em **qualquer** aba (Perdidos, Encontrados **e** Adoção)
2. Tela intermediária **Escolher situação** com dois botões: **Encontrei um animal** (`E`) e **Perdi um animal** (`P`)
3. Tela de formulário (mesmos campos da API usados no web: sem fotos, sem gênero, sem bairro, **sem** select de situação)
4. `animaisService.criarAnimal` → `POST /animais` com Bearer e `status` `P` ou `E`
5. Sucesso: ir à **aba da situação gravada** e recarregar o `GET`
6. Validação local; erro de API/rede em PT-BR; 401 → logout
7. Prefill cidade/UF da sessão (`usuario.cidade` do login/cadastro), editável
8. Atualizar `docs/CONTEXTO-PROJETO.md` após implementação

## Fora de escopo

- Cadastro com `status=A` no mobile (ADOÇÃO = ONG / web)
- Alterar o `adopet-backend` (autorização extra, envelope, novos campos)
- Edição e exclusão de animal (card 56 parcial — volta depois do detalhe)
- Tela de detalhe (spec 006); toque no card permanece sem navegação
- Upload / câmera / galeria / card de fotos (RF0007 — fase 2)
- Gênero, bairro, data de perda/encontro, vacinado, vermifugado, cor, rich text
- Campo **Situação** no formulário (a escolha já foi feita na tela anterior)
- Autocomplete cidade/raça (`GET /cidades`)
- Filtros (spec 008), Perfil/Sair (spec 009), busca por foto real (RF0008)
- Alterar telas de auth (002–004)
- TypeScript, NativeWind, Expo Router, lib de form/picker
- Testes automatizados
- Role `admin` no JWT

## RF/RNF relacionados

| ID | Cobertura nesta spec |
|----|----------------------|
| RF0003 | **Parcial** — cadastro P/E pelo usuário. Sem edição/exclusão. Sem adoção |
| RF0004 | Lista recarrega após o POST (aba da situação gravada) |
| RF0006 | **Não** |
| RF0007 | **Não** — sem fotos |
| RNF0001 | Tela de escolha clara; form no tema da situação; erros em PT-BR; Cancelar sem POST |
| RNF0002 | JWT obrigatório; senha/token não logados |

## O que já existe (não reinventar)

| Já pronto | Onde |
|-----------|------|
| `POST /animais` → **201** `{ animal }` (JWT `ong` \| `usuario`) | backend spec 005 |
| Body `cidade: { nome, uf }`, `raca: { nome }` | backend spec 007 |
| Dono no create: `idUsuario = auth.id` (não vem do body) | backend spec 005 |
| ONG cadastra A/P/E no web | web spec 007 |
| FAB central desabilitado | mobile spec 005 / `BottomTabBar` |
| `GET /animais?status=` + `animaisService.listarAnimais` | mobile spec 005 |
| `usuario.cidade` no retorno de login/cadastro | backend auth + sessão mobile |
| Envelope `{ error: { message } }` | `api.js` |
| `TextField`, paleta por situação | specs 002 / 005 |

O app chama **somente** `POST /animais` (além do `GET` já existente). Nunca `/auth/ongs/*`.

A API **hoje** ainda aceitaria `status=A` com JWT de usuário. Esta fatia **não** muda o servidor: o app simplesmente **não oferece** essa escolha. Defesa no cliente: nunca montar o body com `A`.

## Contexto técnico (API)

Base: `EXPO_PUBLIC_API_URL`. Mutação: JWT `usuario`.

### `POST /animais`

```json
{
  "nome": "Luna",
  "status": "P",
  "descricao": "Golden clara, coleira vermelha, vista no centro.",
  "especie": "CAO",
  "idade": 2,
  "porte": "M",
  "cidade": { "nome": "Lajeado", "uf": "RS" },
  "raca": { "nome": "Golden Retriever" }
}
```

| Campo | Obrigatório na API | No form mobile |
|-------|--------------------|----------------|
| `nome` | sim, 1–80 | sim (também em Encontrados; placeholder “Ex: sem nome conhecido”) |
| `status` | sim, `A`\|`P`\|`E` | **não aparece no form**; vem da tela de escolha (`P` ou `E`) |
| `descricao` | sim, 1–200 | sim (textarea + contador) |
| `especie` | sim, `CAO`\|`GATO` | sim |
| `idade` | não; anos ≥ 0 | opcional (0–20) |
| `porte` | não na API | **obrigatório no form** (igual web) |
| `cidade.nome` | sim, 1–60 | sim; prefill da sessão |
| `cidade.uf` | sim, 2 letras | sim; prefill da sessão |
| `raca.nome` | sim, 1–60 | sim |

Não enviar `idCidade`, `idRaca`, `idUsuario`, `idInstituicao`.

**201** `{ animal }`. **400** validação. **401** token. Rede: mensagem já usada no `api.js`.

### Print/web × modelo (formulário)

Mesma disciplina da web spec 007: **não inventar campo**.

| Controle | Na API? | Nesta fatia |
|----------|---------|-------------|
| Tela “Encontrei / Perdi” | — | **sim** (não existe no web; no web a lista define a situação) |
| Nome do animal `*` | `nome` | sim |
| Espécie `*` | `especie` | Cão / Gato |
| Raça `*` | `raca.nome` | texto |
| Idade | `idade` | select 0–20 + vazio; **sem meses** |
| Porte `*` | `porte` | Pequeno / Médio / Grande |
| Gênero | **não existe** | **omitir** |
| Descrição `*` | `descricao` | textarea 200 + `{n}/200` |
| Fotos | Storage futuro | **omitir** |
| Cidade `*` + UF `*` | `cidade` | sim; prefill da sessão |
| Bairro | **não existe** | **omitir** |
| Situação no form | `status` | **não**; já escolhida na tela anterior |
| Tutor | JWT | **não** editável |

## Pontos fechados (2026-08-23)

| # | Tema | Decisão |
|---|------|---------|
| 1 | Como o FAB escolhe P vs E | **Tela intermediária sempre.** `+` (qualquer aba) → tela com dois botões → form. A aba atual **não** define a situação. |
| 2 | Escopo vs card 56 | **Só cadastro.** Edição/exclusão depois do detalhe (006). |
| 3 | Prefill cidade/UF | **Da sessão** (`usuario.cidade` do login/cadastro), editável. `/auth/me` não traz cidade. |
| 4 | Nome em Encontrados | **Obrigatório** (API). Placeholder “Ex: sem nome conhecido”. Card da lista E continua genérico. |
| 5 | Depois de salvar | Ir à **aba da situação gravada** e recarregar (`P` → Perdidos, `E` → Encontrados). |
| 6 | Recusar adoção | **Só no front.** Sem opção Adoção na tela de escolha. Sem spec de backend nesta fatia. |

### Ponto 1 — o que a tela de escolha faz

O FAB **não** abre o formulário direto e **não** herda Perdidos/Encontrados/Adoção da barra.

```
Qualquer aba  →  FAB +  →  tela “o que aconteceu?”  →  formulário
                                   │
                    Encontrei um animal  →  status = E
                    Perdi um animal      →  status = P
```

Essa tela existe **só para usabilidade**: o usuário declara a situação antes de preencher os dados. Os dois caminhos usam **o mesmo** formulário; só muda o `status` oculto (e o tema/copy P vs E).

Não é um `Alert` nativo nem um modal por cima da lista. É uma **tela de stack** (voltar = lista, sem POST).

## Fluxos

### Cadastrar

```
Usuário                     App                           API
 |  qualquer aba             |                             |
 |  FAB +                    |                             |
 |  tela Encontrei / Perdi   |                             |
 |  (ex.: Perdi um animal)   |                             |
 |  form (status oculto = P) |                             |
 |-------------------------->|  POST /animais  status=P    |
 |                           |---------------------------->|
 |                           |  201 { animal }             |
 |  aba Perdidos + GET P     |<----------------------------|
 |  animal na lista          |                             |
```

1. Toque no FAB (Perdidos, Encontrados ou Adoção — o mesmo fluxo).
2. Tela de escolha: **Encontrei um animal** ou **Perdi um animal**. Cancelar/voltar → lista, sem POST.
3. Formulário, `status` só em memória/`route.params` (`E` ou `P`). Cidade/UF pré-preenchidas.
4. Validar → `POST`.
5. Sucesso → aba da situação gravada + novo `GET` dessa aba.
6. Cancelar no form → volta para a tela de escolha (ou para as tabs — ver contrato de nav); **sem** POST.

### Falha

| Situação | UI |
|----------|----|
| Validação local | mensagem no topo do form; sem POST |
| 400 | `error.message` da API |
| 401 | logout → Login (spec 002) |
| Rede | mensagem do `api.js` |
| `status` inválido na rota (`A` ou vazio) | não postar; voltar à tela de escolha |

## Contrato de UI

Idioma: **PT-BR**. Identificadores em inglês.

### Navegação

O autenticado deixa de ser **só** tabs. Padrão stack + tabs:

```
AppNavigator (native-stack)
  MainTabs              # Perdidos / Encontrados / FAB / Adoção / Perfil (spec 005)
  ChooseAnimalStatus    # dois botões; sem params
  AnimalForm            # params: { status: 'P' | 'E' }
```

FAB → `navigate('ChooseAnimalStatus')`.  
Botão da escolha → `navigate('AnimalForm', { status })`.  
`status` diferente de `P`/`E` → não renderizar o form; voltar à escolha.

| Tela | Auth | Comportamento |
|------|------|----------------|
| `ChooseAnimalStatus` | JWT usuário | só P / E |
| `AnimalForm` | JWT usuário | criar com o `status` recebido |
| Tabs | inalteradas | FAB **ativo** em qualquer aba |
| Perfil / sino / card / Filtros / câmera | inalterados | ainda “Em breve” |

Após 201: `navigate` para a tab `Perdidos` ou `Encontrados` (reset do stack de cadastro, para o Voltar da lista **não** reabrir o form). Depois `GET` daquela aba.

### Tela de escolha

| Elemento | Texto |
|----------|--------|
| Título | Cadastrar animal |
| Subtítulo | O animal foi encontrado ou está perdido? |
| Botão E | Encontrei um animal |
| Apoio E (opcional, uma linha) | Alguém pode estar procurando |
| Botão P | Perdi um animal |
| Apoio P (opcional, uma linha) | Ajude a encontrar |
| Voltar (header) | volta às tabs |
| Adoção | **não existe** nesta tela |

Layout: fundo `listBackground`; header simples (voltar + título), **sem** sino. Dois botões grandes (área de toque ≥ 44px, preferir cartões altos, um abaixo do outro). Visual: botão E na cor Encontrados (`#7C3AED`); botão P na cor Perdidos (`#C2784A`). Sem terceiro botão.

### Formulário — copy

| Situação | Título | Subtítulo |
|----------|--------|-----------|
| `P` | Cadastrar animal perdido | Preencha as informações do animal que você perdeu. |
| `E` | Cadastrar animal encontrado | Preencha as informações do animal que você encontrou. |

| Elemento | Texto |
|----------|--------|
| Submit | Salvar animal |
| Loading submit | Salvando… |
| Cancelar | Cancelar (volta à tela de escolha, sem POST) |
| FAB (a11y) | Cadastrar animal |

### Campos (labels iguais ao web)

| Campo | Label | Controle |
|-------|-------|----------|
| Nome | Nome do animal `*` | texto, máx. 80; P: “Ex: Luna”; E: “Ex: sem nome conhecido” |
| Espécie | Espécie `*` | Cão / Gato (chips ou select nativo simples, **sem** lib extra) |
| Raça | Raça `*` | texto, máx. 60; “Ex: SRD, Labrador” |
| Idade | Idade | 0–20 anos + vazio (“Selecione”) |
| Porte | Porte `*` | Pequeno / Médio / Grande |
| Descrição | Descrição `*` | textarea, máx. 200; placeholder do web |
| Cidade | Cidade `*` | texto, máx. 60; “Ex: Lajeado” |
| UF | UF `*` | 2 letras; “Ex: RS” |

Asteriscos só nos obrigatórios do form.

### Validação no cliente (antes do POST)

| Condição | Mensagem |
|----------|----------|
| Nome vazio | Informe o nome |
| Espécie vazia | Selecione a espécie |
| Raça vazia | Informe a raça |
| Porte vazio | Selecione o porte |
| Idade preenchida e inválida | Informe a idade em anos (0 ou mais) |
| Cidade vazia | Informe a cidade |
| UF inválida | Informe a UF (2 letras, ex.: RS) |
| Descrição vazia | Informe a descrição |
| Descrição > 200 | A descrição deve ter no máximo 200 caracteres |

Reusar `isUfValid` do `authService`.

### Layout do form

- **Não** usar `AuthLayout`. Fundo `listBackground`; header na cor do tema da situação (`P` terracota / `E` roxo).
- Header: voltar + título. Sem sino.
- Scroll + teclado (`KeyboardAvoidingView`).
- Seções **Informações básicas** e **Localização** (cards brancos, raio ~12).
- Rodapé: Cancelar (contorno) + Salvar animal (preenchido na cor do tema).
- Área de toque ≥ 44px.

### Acessibilidade mínima

- Tela de escolha: cada botão com `accessibilityRole="button"` e o texto visível como label
- Form: label via `TextField` / `accessibilityLabel`; `*` também em texto
- Erro visível em texto (`accessibilityLiveRegion`)
- Submit `accessibilityState.busy` enquanto envia
- FAB deixa de ter hint “Em breve”

## Arquitetura de código

```
src/
  navigation/
    AppNavigator.js            # stack (MainTabs + ChooseAnimalStatus + AnimalForm)
    MainTabNavigator.js        # tabs atuais (extraídas do AppNavigator)
  screens/
    AnimalListScreen.js        # useFocusEffect para recarregar ao voltar
    ChooseAnimalStatusScreen.js
    AnimalFormScreen.js
  components/
    BottomTabBar.js            # FAB ativo → navigate ChooseAnimalStatus
    TextField.js               # reusar; textarea = variant ou TextInput multiline
  services/
    animaisService.js          # + criarAnimal(body)
    animalForm.js              # validação + buildBody (espelho do web)
  context/AuthContext.js       # inalterado (cidade já vem no usuario da sessão)
```

Sem `AnimaisContext`. Sem persistir rascunho.

Lista: ao ganhar foco, novo `GET` da aba (barato: lista inteira sem paginação). Evita animal novo “sumir” até o pull-to-refresh.

`criarAnimal` **recusa** no cliente se `status` não for `P` ou `E` (não chama a API).

## Regras de negócio (cliente)

1. `POST /animais` só com `status` `P` ou `E`.
2. Nunca enviar `A`, IDs de cidade/raça/dono.
3. Porte sempre `P`\|`M`\|`G`. Idade vazia → omitir `idade`.
4. Validar no cliente; a API valida de novo.
5. Não logar o JWT.
6. Labels PT-BR; códigos só no body.
7. Após 201, ir à lista da situação gravada e recarregar.
8. Hard-create; sem rascunho local.

## Decisões técnicas

| Item | Escolha |
|------|---------|
| Canal | Mobile (usuário) |
| Adoção no app | **não cadastra**; sem botão na tela de escolha |
| ONG | inalterada (web cadastra A/P/E) |
| Backend | **intocado** nesta fatia |
| Escolha P/E | tela de stack, sempre após o FAB |
| Layout do form | autenticado no tema P/E; campos do web |
| Foto / gênero / bairro | omitir |
| HTTP | só `POST` |
| Update | `PATCH` **não** entra |
| Cidade | prefill da sessão, editável |
| Libs novas | nenhuma (`@react-native-picker` **não**) |
| Nav | stack sobre as tabs já existentes |

## Critérios de pronto

- [x] Spec aprovada (pontos 1–6 fechados em 2026-08-23)
- [x] Login usuário → FAB ativo em qualquer aba
- [x] FAB → tela com **apenas** “Encontrei um animal” e “Perdi um animal” (sem Adoção)
- [x] Encontrei → form → salvar → animal na aba **Encontrados** (card sem o nome no título)
- [x] Perdi → form → salvar → animal na aba **Perdidos** (card com o nome)
- [x] Aba Adoção + FAB **não** gera animal na lista Adoção
- [x] Cidade/UF pré-preenchidas da sessão e editáveis
- [x] Cancelar na escolha ou no form não chama POST
- [x] Validação local impede salvar sem nome
- [x] Backend parado → erro de rede no salvar
- [x] 401 → login
- [x] Sem fotos, gênero, bairro, select de situação no form
- [x] Auth / busca por foto / Filtros / Perfil **não** reescritos além do FAB
- [x] Backend intocado
- [x] CONTEXTO atualizado (mobile + decisão na tabela §8)

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

1. Login usuário (qualquer aba) → FAB → tela com dois botões, **sem** Adoção
2. **Perdi um animal** → cadastrar “Bidu”, Cão, SRD, porte médio → lista **Perdidos** com Bidu
3. FAB de novo → **Encontrei um animal** → salvar → aba **Encontrados**, card “Cachorro encontrado” / “Gato encontrado”
4. Cancelar na escolha e no form → volta sem POST
5. Conferir cidade/UF já preenchidas (ex.: Lajeado / RS no seed)
6. Parar o backend → erro de rede no salvar

## Checklist de implementação (após a autora pedir)

1. Spec 007 no índice mobile
2. Stack `AppNavigator` + extrair tabs
3. `ChooseAnimalStatusScreen`
4. `criarAnimal` no `animaisService` (guarda: só P/E)
5. `AnimalFormScreen` (campos do web, tema P/E, prefill cidade)
6. FAB ativo → tela de escolha
7. Após 201: tab da situação + `useFocusEffect` na lista
8. CONTEXTO
