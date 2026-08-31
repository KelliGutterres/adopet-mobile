# Spec 009 — Informações do perfil do usuário (app mobile)

> **Status:** aprovada e implementada.  
> Pontos 1–3 fechados em 2026-08-31.  
> Depende de: spec 002 (`AuthContext` + `logout` + sessão no SecureStore); spec 003 (objeto `usuario` persistido); spec 005 (`AppHeader`, barra inferior).  
> **Não altera** o `adopet-backend` nesta fatia.  
> Card Trello: [Perfil do usuário -> Editar conta](https://trello.com/c/VLtmn6n5/59-perfil-do-usu%C3%A1rio-editar-conta).  
> Número: a listagem (005) já reservou o perfil como **009**. O README apontava “Perfil / editar conta — depende de API”. Esta fatia entrega a **consulta** + logout + chrome; a **edição persistida** continua dependente de endpoint que **ainda não existe**.

O mobile é **somente usuário**. Perfil da ONG permanece no web (avatar + nome no `PainelHeader`; Sair na sidebar).

## Objetivo

Tirar o Perfil da barra inferior e tratá-lo como no painel web: **ícone redondo no header**, ao lado do sino de notificações. O toque abre uma tela com os **dados da conta**, um **ícone de editar** e um **ícone de logout**.

O slot da barra que era Perfil passa a se chamar **Similaridade** — visível e **desabilitado** (“Em breve”). O fluxo real de IA (RF0008) **não** entra aqui; a autora ajusta essa aba depois.

Cobre **RF0001** (consulta da conta; edição persistida **fora** — ponto 1-A), **RF0002** (encerrar sessão) e usabilidade (**RNF0001**).

## Recorte vs roadmap

| Fluxo | Onde estava | Nesta spec |
|-------|-------------|------------|
| Aba Perfil desabilitada | spec 005 | **sai** da barra |
| Sair / logout na UI | spec 005 (omitido de propósito) | **entra** (ícone na tela de perfil) |
| Edição de conta (RF0001) | card 59 / “depende de API” | ícone lápis **disabled**; form + API ficam para spec seguinte |
| Aba Similaridade | spec 006 decidiu **não** criar (competia com Perfil) | **entra** no slot liberado; placeholder |
| Botão câmera nas listas P/E | spec 006 | **inalterado** |

A spec 006 continua válida para o botão de câmera. O que muda é só a justificativa da aba: Perfil não ocupa mais o 5º slot, então Similaridade cabe na barra sem empurrar Adoção/Perdidos/Encontrados.

## Referência visual

Não há print mobile de perfil na Parte 1 (Fig. 13 = auth; Fig. 15 = listagem). Espelhar o **idioma já no app** + o chrome do web.

| Fonte | Uso |
|-------|-----|
| Web `PainelHeader` | Avatar circular com iniciais, à direita do header |
| Mobile `AppHeader` | Marca à esquerda; sino à direita — o avatar entra **ao lado** do sino |
| Spec 008 (`AnimalDetail`) | Tela de stack com voltar; cards brancos; `InfoRow` label + valor |
| Spec 007 (`ChooseAnimalStatus`) | Header claro com voltar + título |
| Web sidebar | Ação Sair em vermelho (`#DC2626`) — só a cor/semântica, não a posição |

## Escopo (esta tarefa)

1. `AppHeader`: avatar circular com iniciais do usuário logado, à direita, **depois** do sino
2. Toque no avatar → tela `Profile` no stack autenticado
3. Tela de perfil: dados da sessão (nome, e-mail, contato, cidade/UF) + ícone editar + ícone logout
4. Logout chama `AuthContext.logout()` (já existe; **sem** endpoint — a API não tem logout)
5. Barra inferior: item **Perfil** vira **Similaridade** (disabled, “Em breve”, ícone novo)
6. Sino permanece desabilitado (“Em breve”), como na spec 005
7. Atualizar `docs/CONTEXTO-PROJETO.md` após implementação

## Fora de escopo

- Alterar o `adopet-backend` (contrato de `GET /auth/me`, novo `PUT` de usuário, envelope)
- Formulário de edição **persistida** (ponto 1-A: ícone “Em breve”; precisa de spec de API depois)
- Troca de senha logada (o `PUT /auth/usuarios/senha` é o fluxo **esqueci senha**, público, sem JWT — spec 004; não reusar aqui)
- Foto de perfil / Storage / câmera
- Notificações reais (sino)
- Fluxo de Similaridade / RF0008 (aba é só rótulo + ícone)
- Remover ou alterar o botão câmera das listas P/E (spec 006)
- Perfil da ONG no web
- TypeScript, NativeWind, Expo Router
- Testes automatizados
- Role `admin` no JWT

## RF/RNF relacionados

| ID | Cobertura nesta spec |
|----|----------------------|
| RF0001 | **Parcial** — consulta dos dados da conta. Edição: ícone “Em breve” |
| RF0002 | Encerrar sessão (logout local) |
| RF0008 | **Só o slot na barra** — sem comparação |
| RNF0001 | Avatar reconhecível; tela de perfil; voltar óbvio; Similaridade “Em breve” |
| RNF0002 | Logout limpa JWT do SecureStore; senha **nunca** na tela nem no storage |

## O que já existe (não reinventar)

| Já pronto | Onde |
|-----------|------|
| `usuario` na sessão: `idUsuario`, `nome`, `email`, `contato`, `status`, `cidade` | spec 003 — `saveSession` |
| `AuthContext.logout()` limpa token + usuário | spec 002 |
| `GET /auth/me` → `{ id, papel, email }` (fumaça do JWT) | backend spec 003 |
| `AppHeader` (logo + sino disabled) | spec 005 |
| Barra: Perdidos · Encontrados · + · Adoção · Perfil(disabled) | spec 005 / `BottomTabBar` |
| Stack autenticado (`MainTabs` + cadastro + detalhe) | specs 007 / 008 |
| `iniciaisNome` (1 letra) em `animalLabels.js` | spec 008 — **não** reusar no avatar da pessoa (web usa 1–2 letras do nome) |
| Cor perigo `#DC2626` | `theme/colors.js` |

O app **não** chama rota nova. A tela lê `useAuth().usuario`. Não há `GET /usuarios/:id` nem `PUT` de perfil.

### Por que não `GET /auth/me` para preencher a tela

O endpoint devolve só `{ id, papel, email }`. Nome, contato e cidade **já estão** no SecureStore desde o login/cadastro. Bootstrap do `AuthContext` já reusa `adopet.usuario` quando o `/me` confirma `papel === "usuario"`.

Enriquecer `/auth/me` ou criar `GET /usuarios/me` fica para quando a edição existir (precisa da API de qualquer forma).

## Contexto técnico (API — só leitura local)

Nenhuma request extra nesta fatia.

Objeto `usuario` já persistido (exemplo do seed / cadastro):

```json
{
  "idUsuario": 2,
  "nome": "Maria Silva",
  "email": "maria@email.com",
  "contato": "51999999999",
  "status": "A",
  "idCidade": 1,
  "cidade": { "idCidade": 1, "nome": "Lajeado", "uf": "RS" }
}
```

| Campo | Na tela? |
|-------|----------|
| `nome` | sim |
| `email` | sim |
| `contato` | sim, **mascarado** (`maskPhone` da spec 003) |
| `cidade.nome` + `cidade.uf` | sim, ex.: “Lajeado - RS” |
| `status` | **não** (código interno `A`) |
| `idUsuario` / `idCidade` | **não** |
| senha | **não existe** no objeto; nunca exibir |

Fallback se `cidade` vier ausente (sessão antiga/incompleta): omitir a linha. Fallback de `nome` vazio: e-mail (já usado no bootstrap da spec 002).

## Decisões desta rodada (2026-08-31)

| # | Tema | Decisão |
|---|------|---------|
| 1 | Edição | **A:** ícone lápis visível e **desabilitado** (“Em breve”). Sem form, sem PUT. Edição vira spec seguinte + API |
| 2 | Confirmar logout | **B:** sair na hora (igual ao web). Sem `Alert` |
| 3 | Cor do header da tela Perfil | **A:** roxo da marca `#7C3AED` (perfil não é A/P/E) |
| 4 | Iniciais do avatar | Duas letras (1º + 2º nome), como o web; um nome só → até 2 letras |
| 5 | Fonte dos dados | Só `AuthContext.usuario`; zero request nova |
| 6 | Similaridade | **Não é tela**; item disabled; ícone novo de “comparar” (dois círculos), ajustável depois |
| 7 | Câmera P/E (spec 006) | Permanece; não misturar com a aba |

A API **não** tem `PUT`/`PATCH` de usuário. Não dá para “editar só no app” e fingir que gravou: o próximo login traria os dados antigos da API. Logout só limpa SecureStore + estado; o `RootNavigator` volta sozinho ao `AuthNavigator`.

O **avatar no `AppHeader` das listas** continua sobre a cor da situação (inalterado). O roxo do ponto 3 é só da tela `Profile`.

## Contrato de UI

Idioma: **PT-BR**. Identificadores de código em inglês.

### Header das listas (`AppHeader`)

Antes: `[logo + AdoPet] ……………… [sino]`.  
Depois: `[logo + AdoPet] ……………… [sino] [avatar]`.

| Elemento | Comportamento |
|----------|----------------|
| Sino | **inalterado** — disabled, “Em breve”, sem badge |
| Avatar | círculo ~36px; iniciais em 2 letras; área de toque 44px |
| Fundo do círculo | branco (`colors.surface`) — o header já é colorido |
| Cor das iniciais | `primaryColor` da lista |
| Toque | `navigation.navigate('Profile')` |
| Acessibilidade | `accessibilityLabel="Perfil"` (sem hint “Em breve”) |

Sem nome por extenso no header (no web cabe; no mobile o espaço some com o sino). Só o círculo.

### Tela `Profile`

Stack autenticado, `headerShown: false` (header próprio, padrão 007/008).

```
[ ← ]     Perfil      [ lápis ] [ sair ]
────────────────────────────────────────
              (avatar grande)
              {nome}
              Usuário

  ┌─ Informações ─────────────────────┐
  │ Nome     Maria Silva              │
  │ E-mail   maria@email.com          │
  │ Contato  (51) 99999-9999          │
  │ Cidade   Lajeado - RS             │
  └───────────────────────────────────┘
```

| Elemento | Copy / regra |
|----------|----------------|
| Título | Perfil |
| Voltar | `goBack()` — lista de origem |
| Subtítulo sob o nome | Usuário (espelha o “ONG” do web; não usar “Admin”) |
| Lápis | **disabled**, hint “Em breve” (ponto 1-A) |
| Sair (ícone) | logout **imediato** (ponto 2-B); sem Alert |
| Contato | `maskPhone` (spec 003) |
| Cidade | `{cidade.nome} - {cidade.uf}`; omitir linha se não houver |
| Senha | **não** listar (nem “••••••”) |

Ícone Sair: porta/seta (mesmo espírito do web), cor `colors.danger`. Ícone lápis: stroke, `colors.surface` (header roxo, ponto 3-A), opacidade reduzida por estar disabled.

### Barra inferior (delta)

| Slot | Hoje (005) | Nesta spec |
|------|------------|------------|
| 1 | Perdidos | inalterado |
| 2 | Encontrados | inalterado |
| 3 | FAB `+` | inalterado |
| 4 | Adoção | inalterado |
| 5 | Perfil (disabled) | **Similaridade** (disabled, “Em breve”) |

`MainTabNavigator` **não** ganha `Tab.Screen` de Similaridade (igual Perfil hoje: o item não é rota). Ícone novo `SimilarityTabIcon` em `ListIcons.js` (dois círculos sobrepostos / “comparar”). A autora pode trocar o desenho depois sem mudar o contrato.

O `ProfileTabIcon` pode permanecer no arquivo (reuso no avatar fallback) ou sair se ficar órfão — detalhe de implementação.

### Navegação

```
AppNavigator (stack)
  MainTabs          # Perdidos / Encontrados / Adoção
  ChooseAnimalStatus
  AnimalForm
  AnimalDetail
  Profile           # nova — esta spec
```

`Profile` **não** é tab. Abrir pelo avatar não muda a aba selecionada ao voltar.

| Tela | Auth | Comportamento |
|------|------|----------------|
| Listas A/P/E | sessão usuário | avatar navega para `Profile` |
| `Profile` | sessão usuário | consulta + logout; voltar à lista |
| Auth | pública | **inalterada** |

### Copy compartilhada

| Elemento | Texto |
|----------|--------|
| Aba | Similaridade |
| Hint aba | Em breve |
| Avatar header | Perfil |
| Título tela | Perfil |
| Papel | Usuário |
| Sair (a11y) | Sair da conta |
| Editar (a11y) | Editar perfil, em breve |
| Loading | não há GET — a tela monta na hora |
| Sem nome | e-mail da sessão |

### Acessibilidade mínima

- Avatar e ícones: área ≥ 44px
- Aba Similaridade: `accessibilityState={{ disabled: true }}` + hint “Em breve”
- Lápis: `accessibilityState={{ disabled: true }}` + hint “Em breve”
- `InfoRow` com label + valor (não só ícone)
- Contraste: iniciais do tema sobre círculo branco no header colorido; lápis branco e sair vermelho sobre o header roxo

## Arquitetura de código

```
src/
  navigation/
    AppNavigator.js           # + screen Profile
  components/
    AppHeader.js              # + avatar (precisa de navigation + useAuth)
    BottomTabBar.js           # Perfil → Similaridade
    ListIcons.js              # + SimilarityTabIcon, PencilIcon, LogoutIcon, Avatar iniciais
  screens/
    ProfileScreen.js          # nova
  context/
    AuthContext.js            # logout inalterado; sem método novo nesta fatia (ponto 1-A)
  services/
    userLabels.js             # iniciais (2 letras) + cidade do usuário; não misturar com animalLabels
```

Fluxo: avatar → `ProfileScreen` → lê `useAuth().usuario` → Sair → `logout()`.

`AppHeader` hoje **não** usa navigation. Nesta fatia: `useNavigation()` + `useAuth()`. Continua usado só em `AnimalListScreen`.

Helpers de iniciais do **usuário** (2 letras) ficam no `ProfileScreen` ou num `userLabels.js` pequeno — **não** alterar `iniciaisNome` dos animais (1 letra, spec 008).

Telas não chamam `fetch`. Sem `UsuarioContext`. Sem persistir nada além do que o logout já apaga.

## Regras de negócio (cliente)

1. Não chamar rota nova. Não chamar `GET /auth/me` de novo só para abrir o perfil.
2. Não exibir senha, `status` nem ids.
3. Contato na UI sempre mascarado; o storage continua só com dígitos.
4. Logout: `clearSession` + estado; **sem** request.
5. 401 em outras telas continua deslogando (specs 002/008) — inalterado.
6. Aba Similaridade **não** navega e **não** chama API.
7. Não logar JWT.
8. Quem aparece no avatar/tela é o usuário da sessão, nunca a ONG.

## Critérios de pronto (após implementação)

- [x] Pontos 1–3 fechados nesta spec
- [x] Specs 001–008 já implementadas
- [x] Login `usuario@adopet.local` / `senha123` → avatar no header das três listas, iniciais **UD** (Usuario Demo)
- [x] Toque no avatar abre Perfil com nome, e-mail, contato mascarado, cidade
- [x] Sino continua “Em breve”; avatar **não**
- [x] Lápis visível e “Em breve”; **não** há form de edição
- [x] Barra: Similaridade visível, disabled; **não** há mais item Perfil
- [x] Botão câmera P/E (spec 006) intacto
- [x] Sair **imediato** (sem Alert) volta ao login; reabrir o app pede login de novo
- [x] Voltar no Perfil retorna à lista de origem, na mesma aba
- [x] Sem PUT/POST de usuário; backend intocado
- [x] Auth (login/cadastro/esqueci) **não** reescrita
- [x] CONTEXTO atualizado (checklist RF0001 parcial; decisão §8; aba Similaridade)
- [x] `specs/README.md` — status aprovada e implementada (só depois de codar)

## Como validar (após implementação)

Pré-requisito: API + seed (`npm run prisma:seed` no backend).

```bash
# terminal 1
cd D:\adopet-backend
npm run dev

# terminal 2
cd D:\adopet-mobile
npx expo start
```

1. Login do usuário → aba Adoção → círculo à direita do sino
2. Abrir Perfil → conferir dados da sessão (seed ou conta criada na spec 003)
3. Voltar → continua na Adoção
4. Repetir a partir de Perdidos e Encontrados (avatar presente; voltar preserva a aba)
5. Aba Similaridade visível e sem ação
6. Sair → login **sem** confirmar; SecureStore limpo (fechar/reabrir o app pede credencial)
7. Sino, câmera P/E e lápis ainda “Em breve”

## Checklist de implementação (após aprovação)

1. Fechar pontos 1–3 nesta spec + índice no `specs/README.md`
2. `userLabels.js` + ícones: lápis, logout, Similaridade
3. `AppHeader`: avatar + `navigate('Profile')`
4. `ProfileScreen` + rota no `AppNavigator`
5. `BottomTabBar`: Similaridade no lugar de Perfil
6. Logout imediato (ponto 2-B)
7. CONTEXTO (checklist mobile RF0001 consulta; decisão na tabela §8; aba Similaridade)

## Relação com a spec 006

A 006 escreveu: “A barra já tem cinco slots (… Perfil). Similaridade competiria com Perfil.” Esta 009 **liberta** o slot. Não reabrir o fluxo de IA; não mexer no botão câmera. Depois, uma spec de Similaridade pode **ativar** a aba (e/ou o botão) sem redesenhar a barra de novo.
