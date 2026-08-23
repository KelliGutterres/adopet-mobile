# Spec 003 — Cadastro de usuário (app mobile)

> **Status:** aprovada e implementada.  
> Depende de: spec 001 (scaffold + `api.js`); spec 002 (login JWT + `AuthContext` + `AuthLayout`); backend specs 003 (cadastro JWT) e 007 (`cidade` inline).  
> **Não altera** o `adopet-backend`.  
> Card Trello: [Tela cadastro de usuário](https://trello.com/c/UrE2dIP9/51-tela-cadastro-de-usu%C3%A1rio).

A spec 002 deixou o **Cadastre-se** visível e desabilitado (“Em breve”). Esta fatia ativa o fluxo e cobre a parte de **cadastro** do RF0001. Edição de perfil continua fora (API ainda sem endpoint; card 59 / spec futura).

O mobile é **somente usuário**. Cadastro de `ong` permanece no painel web (`POST /auth/ongs/cadastro` **não** é chamado aqui).

## Objetivo

Permitir que o **usuário** crie conta no app mobile, consumindo `POST /auth/usuarios/cadastro`. A tela usa o **mesmo shell visual** do login (spec 002 / Fig. 13). Após sucesso, o usuário entra na Home já autenticado (a API devolve JWT).

Cobre **RF0001** (cadastro), usabilidade (**RNF0001**) e senha só no body da API (**RNF0002**).

## Recorte vs roadmap anterior

A spec 001 planejou a 003 como listagem. A 002 fechou só o login e empurrou o cadastro para “spec seguinte” (card 51). Esta 003 **é o cadastro**; a listagem A/P/E passa a ser a spec 004.

| Fluxo | Web (já feito) | Mobile |
|-------|----------------|--------|
| Login + JWT + sessão | spec 002 | spec 002 |
| Layout fiel ao print | spec 004 (Fig. 14) | spec 002 (Fig. 13, login) |
| Cadastro | spec 005 | **esta spec** (Fig. 13, cadastro) |
| Esqueci senha | spec 006 | **fora** — spec futura |
| Listagem de animais | spec 003 | spec **004** (antes era 003) |

## Referência visual

| Arquivo / spec | Uso nesta spec |
|----------------|----------------|
| [login-cadastro-mobile.png](../docs/prototipos/login-cadastro-mobile.png) | Fig. 13 — cadastro à **direita**; login à esquerda já implementado |
| Spec 002 | `AuthLayout`, campos com ícone, paleta `#7C3AED`, `AuthContext` / SecureStore |
| Web spec 005 | Espelho do fluxo (campos extras da API, confirmar senha, login automático, sem OAuth) |

O print de cadastro mostra: nome, e-mail, senha, confirmar senha, checkbox de termos, divisor “ou”, Google/Apple, “Já tem uma conta? Entrar”.

O que **entra** desta fatia (alinhado à 002, ao web 005 e às decisões de 2026-08-23):

- Mesmo shell (marca + cartão + silhuetas).
- Título/subtítulo/placeholders do print.
- Confirmar senha (só no cliente).
- Link **Entrar** ativo → volta ao Login.
- Campos que a API **exige** e o print **não** mostra: **contato**, **cidade**, **UF**.
- Máscara de telefone na UI; body da API só com dígitos.

O que **não entra**:

- Google / Apple / divisor “ou” (já fechado na spec 002).
- Checkbox de termos (sem páginas legais; a API não exige).
- Hint “Mínimo de 8 caracteres” do print — senha mínima **6**, igual à API e ao web.

## Escopo (esta tarefa)

1. Tela `Register` no `AuthNavigator`, no mesmo `AuthLayout` do login
2. Formulário: nome, e-mail, contato (com máscara), cidade, UF, senha, confirmar senha
3. `authService.cadastrarUsuario` → `POST /auth/usuarios/cadastro` com `cidade: { nome, uf }` (sem `idCidade`)
4. Sucesso **201**: persistir `token` + `usuario` no SecureStore (mesmo contrato do login) e ir para a Home autenticada
5. Ativar **Cadastre-se** no login (hoje desabilitado / “Em breve”) → navega para `Register`
6. No cadastro: “Já tem uma conta? **Entrar**” → volta ao `Login`
7. Validação local alinhada à API; `senhaConfirmacao` só no cliente
8. Atualizar `docs/CONTEXTO-PROJETO.md` após implementação

## Fora de escopo

- Alterar o `adopet-backend` (contrato, validação, envelope)
- Cadastro de `ong` / `POST /auth/ongs/cadastro`
- OAuth (Google / Apple) e divisor “ou”
- Termos de Uso / Política de Privacidade (sem telas nem texto legal nesta fatia)
- Edição de perfil (RF0001 parcial — API ainda sem endpoint; card 59)
- Fluxo esqueci senha (`PUT /auth/usuarios/senha`) — spec futura; o link no **login** permanece desabilitado
- Autocomplete de cidade (`GET /cidades`) — spec futura; aqui o nome é texto livre
- Validação de DDD / operadora (só quantidade de dígitos após a máscara)
- E-mail de confirmação / SMTP
- Captcha, rate limit
- Listagem / CRUD de animais
- Testes automatizados
- TypeScript, NativeWind, Expo Router
- Biblioteca extra de máscara (implementar helpers no `authService`)

## RF/RNF relacionados

| ID | Cobertura nesta spec |
|----|----------------------|
| RF0001 | Cadastro de conta (dados pessoais, e-mail, senha). **Edição:** não |
| RF0002 | Pós-cadastro o usuário fica autenticado (JWT já existente) |
| RF0009 | **Não** — cadastro da ONG é no web |
| RNF0001 | Formulário no mesmo padrão do login; erros em PT-BR |
| RNF0002 | Senha só no body; nunca persistida; hash continua no backend |

## O que já existe (não reinventar)

O mobile **consome** a API; não duplica regras de negócio.

| Já pronto | Onde |
|-----------|------|
| `POST /auth/usuarios/cadastro` → `{ usuario, token }` (201) | backend specs 003 + 007 |
| `cidade: { nome, uf }` find-or-create; **proibido** `idCidade` | backend spec 007 |
| `contato` obrigatório no cadastro do usuário (ONG **não** tem) | backend spec 003 |
| Envelope `{ error: { message } }` | `src/services/api.js` |
| `AuthLayout` / `TextField` / `PasswordField` / paleta | spec 002 |
| `saveSession` / SecureStore / Bearer em memória | spec 002 |
| Seed: `usuario@adopet.local` / `senha123` | backend spec 004 |
| Cadastro da ONG no web (espelho de fluxo, não de campos) | `adopet-web` spec 005 |

O app chama **somente** `/auth/usuarios/*` + `GET /auth/me`. Nunca `/auth/ongs/*`.

## Contexto técnico (API já pronta)

Base: `EXPO_PUBLIC_API_URL`.  
Envelope de erro: `{ "error": { "message": "..." } }`.  
CORS aberto. Cadastro **público** (sem JWT).

### `POST /auth/usuarios/cadastro`

Contrato vigente (backend spec 003 + 007). **Não** enviar `idCidade`.

**Body**

```json
{
  "nome": "Maria Silva",
  "email": "maria@email.com",
  "senha": "senha123",
  "contato": "51999999999",
  "cidade": { "nome": "Lajeado", "uf": "RS" }
}
```

| Campo | Regra da API |
|-------|----------------|
| `nome` | obrigatório; trim; `Usuario.nome` até **150** chars |
| `email` | obrigatório; formato e-mail; gravado em minúsculas; unique na tabela `Usuario` |
| `senha` | obrigatória; mínimo **6** caracteres |
| `contato` | obrigatório; trim; `Usuario.contato` até **20** chars (sem regex de telefone) |
| `cidade.nome` | obrigatório; trim; 1–60 chars |
| `cidade.uf` | obrigatório; 2 letras; gravado maiúsculo (ex.: `RS`) |
| `senhaConfirmacao` | **não** existe na API — só no cliente |
| `idCidade` | **proibido** — 400 se enviado |
| `status` | a API grava `"A"`; o cliente **não** envia |

Find-or-create (spec 007): se a cidade já existir (`nome` case-insensitive + `uf`), reutiliza; senão cria (`pais` = `"Brasil"`, `endereco` = `"-"`).

**201**

```json
{
  "usuario": {
    "idUsuario": 2,
    "nome": "Maria Silva",
    "email": "maria@email.com",
    "contato": "51999999999",
    "status": "A",
    "idCidade": 1,
    "cidade": { "idCidade": 1, "nome": "Lajeado", "uf": "RS" }
  },
  "token": "<jwt>"
}
```

JWT igual ao login: `{ "sub": idUsuario, "papel": "usuario", "email": "..." }`.  
A resposta **nunca** inclui `senha`.

| Status | Quando | `error.message` (hoje) |
|--------|--------|-------------------------|
| `400` | validação | Nome é obrigatório / Contato é obrigatório / E-mail inválido / Senha deve ter no mínimo 6 caracteres / cidade é obrigatória / uf inválido (use 2 letras, ex.: RS) / … |
| `409` | e-mail já em `Usuario` | E-mail já cadastrado |

E-mail de **ONG** **não** colide com usuário: unique é por tabela. O mesmo endereço pode existir nos dois papéis — comportamento herdado da API; o mobile não tenta impedir.

## Fluxo

```
Usuário                     App                         API
 |                           |                           |
 |  Login → Cadastre-se      |                           |
 |  Register                 |                           |
 |  nome + email + contato   |                           |
 |  + cidade + uf            |                           |
 |  + senha + confirm        |                           |
 |-------------------------->|  POST /auth/usuarios/cadastro |
 |                           |-------------------------->|
 |                           |  201 { usuario, token }   |
 |                           |<--------------------------|
 |                           |  saveSession (igual login)|
 |  stack autenticado (Home) |                           |
 |<--------------------------|                           |
```

Não há tela intermediária de “cadastro ok, faça login”: a API já autentica. Mesmo padrão do backend spec 003 e do web spec 005.

Quem já está autenticado **não** vê o cadastro: o `RootNavigator` só monta o `AuthNavigator` sem sessão (inalterado).

## Contrato de UI

Idioma: **PT-BR**. Identificadores de código em inglês.

### Navegação (React Navigation)

O `AuthNavigator` ganha a tela `Register`. O `RootNavigator` e o stack autenticado **não** mudam.

| Tela | Auth | Comportamento |
|------|------|----------------|
| `Login` | pública; se já logado → stack autenticado | Cadastre-se **ativo** → `Register` |
| `Register` | pública; se já logado → stack autenticado | Cadastro; Entrar → `Login` |
| `Home` | exige sessão `usuario` | inalterada (placeholder + Sair) |

`headerShown: false` nas duas telas de auth (o layout traz a marca).

Não há tela `ForgotPassword` nesta spec.

### Login — delta desta spec

Só o link **Cadastre-se** muda. O restante do login (incluindo “Esqueceu sua senha?” desabilitado) permanece.

| Elemento | Hoje (spec 002) | Nesta spec |
|----------|-----------------|------------|
| Cadastre-se | visível, desabilitado, hint “Em breve” | **ativo**; `navigation.navigate('Register')` |
| Esqueceu sua senha? | visível, desabilitado | **inalterado** |

### Cadastro — campos e copy

Copy de **erro / loading / validação**: desta spec.  
Título, subtítulo e placeholders de nome/e-mail/senha: **Fig. 13** (lado direito).  
Campos que o print não tem (contato, cidade, UF): copy desta spec (mesmo espírito do web 005).

| Elemento | Copy |
|----------|------|
| Marca / slogan | iguais ao login (via `AuthLayout`) |
| Título | Crie sua conta |
| Subtítulo | Preencha os dados abaixo para se cadastrar |
| Nome | label “Nome completo”; placeholder “Digite seu nome completo”; ícone de pessoa; `autoCapitalize="words"` |
| E-mail | label “E-mail”; placeholder “Digite seu e-mail”; mesmo `TextField` do login |
| Contato | label “Contato”; placeholder “(51) 99999-9999”; `keyboardType="phone-pad"`; ícone de telefone; máscara progressiva |
| Cidade | label “Cidade”; placeholder “Ex.: Lajeado”; ícone de mapa; máx. 60 chars |
| UF | label “UF”; texto livre, 2 letras; placeholder “Ex.: RS” |
| Senha | label “Senha”; placeholder “Crie uma senha”; `PasswordField` + olho; `textContentType="newPassword"` |
| Confirmar senha | label “Confirmar senha”; placeholder “Confirme sua senha”; `PasswordField` + olho |
| Submit | Cadastrar (+ ícone user-plus); loading: botão desabilitado; texto “Cadastrando…” |
| Link extra | “Já tem uma conta? **Entrar**” — ativo → `Login` |
| Erro 409 | E-mail já cadastrado |
| Erro 400 | `error.message` da API |
| Erro de rede | Não foi possível conectar à API. Verifique se o backend está no ar. |
| Validação local | ver tabela abaixo |

**Não** mostrar o hint “Mínimo de 8 caracteres” do print.

### Máscara de contato

Helpers em `authService` (sem lib nova).

| Dígitos (só números) | Exibição |
|----------------------|----------|
| 1–2 | `(51` |
| 3–6 | `(51) 9999` |
| 7–10 | `(51) 9999-9999` (fixo) |
| 11 | `(51) 99999-9999` (celular) |

- Estado da tela guarda o valor **mascarado**.
- Body do POST envia **somente dígitos** (`51999999999`), para caber em `varchar(20)` e igualar o seed.
- Máximo 11 dígitos. Apagar um dígito remasca o restante.
- Validação local: após unmask, **10 ou 11** dígitos. A API continua sem regex de telefone.

### Validação no cliente (antes do POST)

| Condição | Mensagem |
|----------|----------|
| Nome vazio (após trim) | Informe o nome completo |
| E-mail inválido | Informe um e-mail válido |
| Contato vazio | Informe o contato |
| Contato com menos de 10 ou mais de 11 dígitos | Informe um contato válido |
| Cidade vazia | Informe a cidade |
| UF inválida | Informe a UF (2 letras, ex.: RS) |
| Senha &lt; 6 | A senha deve ter no mínimo 6 caracteres |
| Senhas diferentes | As senhas não coincidem |

A API continua sendo a fonte da verdade.

### Layout (Fig. 13 — tela de cadastro)

- Reutilizar `AuthLayout` (fundo lavanda, patas, logo, cartão branco ~28px, silhuetas).
- Mais campos que o login: o cartão **rola** (`KeyboardAvoidingView` + `ScrollView`, igual ao login). A página não ganha scroll horizontal.
- Cidade e UF na **mesma linha** (cidade flex-grow; UF estreita, ~88px) — igual web 005. Em tela estreita, podem empilhar se a linha ficar apertada.
- Primária `#7C3AED`. Ícones SVG em `AuthIcons.js` (pessoa, telefone, pin, user-plus). Sem lib nova.
- UF é **texto** (2 letras), não select. O cliente normaliza para maiúsculas antes do POST (só letras, `slice(0, 2)`).
- **Sem** botões Google/Apple e **sem** divisor “ou”.
- **Sem** checkbox de termos.

### Acessibilidade mínima

- `TextInput` com `accessibilityLabel` por campo
- Erro da API em texto visível (`accessibilityRole="alert"`)
- Toggle da senha com `accessibilityLabel` (“Mostrar senha” / “Ocultar senha”)
- Botão Cadastrar com `accessibilityState={{ disabled, busy }}` no loading
- Cadastre-se (login) e Entrar (cadastro) com área de toque ≥ 44px
- Área de toque ≥ 44px no olho

## Persistência e sessão

Reutilizar `saveSession` / `AuthContext` da spec 002.

| Chave | Valor |
|-------|--------|
| `adopet.token` | JWT do **201** |
| `adopet.usuario` | JSON do `usuario` público (inclui `cidade` e `contato`; sem senha) |

Método `cadastrar` no `AuthContext` chama o mesmo `saveSession` do `login`.

- **Não** guardar a senha.
- Logout, bootstrap `GET /auth/me` e recusa de `papel !== "usuario"` **inalterados**.

## Arquitetura de código

Camadas mobile: **screens / components / services / hooks / navigation / context**. Arquivos em **`.js`**.

```
src/
  screens/
    LoginScreen.js          # Cadastre-se passa a navegar
    RegisterScreen.js       # nova
    HomeScreen.js           # inalterada
  components/
    AuthLayout.js           # inalterado (reuso)
    AuthIcons.js            # + UserIcon, PhoneIcon, MapPinIcon, UserPlusIcon
    PasswordField.js        # + placeholder / textContentType (new-password)
    TextField.js            # generalizar autoComplete / keyboard / autoCapitalize / maxLength
  navigation/
    AuthNavigator.js        # + Register
  services/
    authService.js          # + cadastrarUsuario, isUfValid, maskPhone, unmaskPhone
  context/
    AuthContext.js          # + cadastrar (mesmo saveSession do login)
```

Fluxo: `RegisterScreen` → `useAuth().cadastrar` → `authService.cadastrarUsuario` → `api.js` (`fetch`) → `POST /auth/usuarios/cadastro`.

O body enviado **não** inclui `senhaConfirmacao` nem `idCidade`. `contato` vai só com dígitos.

Telas não chamam `fetch` direto. `AuthContext` não conhece React Navigation (o `RootNavigator` troca de stack quando `isAuthenticated` vira true).

### Ajuste pontual em `TextField`

Hoje o componente força `autoComplete="email"` e `textContentType="emailAddress"`. No cadastro isso quebra nome/contato/cidade. Nesta fatia ele passa a aceitar essas props (com default de e-mail para não regressar o login).

## Regras de negócio (cliente)

1. Chamar **somente** `POST /auth/usuarios/cadastro` (além das rotas de auth já usadas).
2. Validar no cliente **antes** do POST; a API valida de novo.
3. UF sempre em maiúsculas no body (`RS`, não `rs`).
4. Cidade: trim; a API faz find-or-create — não listar cidades do seed.
5. Contato: máscara na UI; no body, só dígitos (10 ou 11).
6. Exibir `error.message` da API; fallback genérico se o JSON não vier (`ApiError` da spec 001).
7. Não logar senha nem JWT.
8. E-mail da seed (`usuario@adopet.local`) → 409 se alguém tentar cadastrar de novo.
9. Após 201, **autenticar** (não mandar de volta ao login).
10. Credencial de ONG no cadastro de usuário: e-mail de ONG **não** gera 409 (tabelas distintas). Se a pessoa usar o mesmo e-mail depois no login do app, entra como **usuário** — comportamento da API; não tratar nesta fatia.

## Decisões técnicas (fechadas em 2026-08-23)

| Item | Decisão |
|------|---------|
| Número da spec | **003** cadastro; listagem vira **004** |
| Tela | `Register` no `AuthNavigator` |
| Layout | mesmo `AuthLayout` da spec 002 |
| Copy título/placeholders nome-email-senha | Fig. 13 |
| Copy contato / cidade / UF / erros | desta spec |
| Pós-cadastro | **login automático → Home** |
| Campos extra vs print | **sim**: contato + cidade + UF |
| Cidade + UF | mesma linha; texto livre (find-or-create) |
| UF | texto livre, 2 letras (não select) |
| Confirmar senha | sim, só no cliente |
| Senha mínima | **6** (API / web), não 8 do print |
| Termos / checkbox | **não** |
| Google / Apple / “ou” | **não** (já fechado na 002) |
| Máscara de telefone | **sim** nesta fatia (UI mascarada; API só dígitos) |
| Cadastre-se no login | ativo → `Register` |
| Esqueci senha no login | continua desabilitado |
| Backend | intocado |

## Pontos abertos

Nenhum. Fechados em 2026-08-23:

1. Pós-cadastro — **login automático** na Home.
2. Campos extra — **contato + cidade + UF**.
3. Senha mínima — **6**.
4. Termos — **não**.
5. Máscara de contato — **sim** (`(51) 99999-9999`; body com dígitos).

## Critérios de pronto

- [x] Spec aprovada (pontos 1–5 fechados)
- [x] Specs 001 e 002 já implementadas
- [x] `Register` no mesmo shell do login (marca + cartão + silhuetas)
- [x] Cadastre-se no login navega para o cadastro (não está mais “Em breve”)
- [x] Cadastro válido entra na Home autenticada com o nome informado
- [x] E-mail já usado (`usuario@adopet.local`) → “E-mail já cadastrado”, permanece no cadastro
- [x] Senhas diferentes → não chama a API
- [x] Cidade nova (ex.: “Estrela” + “RS”) cadastra e a API cria/reusa a cidade
- [x] Contato aceita máscara; POST envia só dígitos
- [x] Senha nunca no SecureStore
- [x] Sem botões Google/Apple, sem “ou”, sem checkbox de termos
- [x] Teclado não cobre os campos; formulário usável no Expo Go **e** no emulador Android
- [x] Backend intocado
- [x] CONTEXTO atualizado (checklist mobile RF0001 parcial; decisão na tabela §8)
- [x] `specs/README.md` — status aprovada e implementada (só depois de codar)

## Como validar (após implementação)

Pré-requisito: API + seed (`npm run prisma:seed` no backend).

```bash
# terminal 1
cd D:\adopet-backend && npm run dev

# terminal 2
cd D:\adopet-mobile
# .env com a URL certa (emulador vs celular)
npx expo start
```

1. Login → Cadastre-se → tela “Crie sua conta” (mesmo visual, sem OAuth, sem termos)
2. Cadastrar usuário novo (e-mail inédito, contato mascarado, cidade/UF) → Home “Olá, {nome}”
3. Fechar e reabrir o app → continua autenticado
4. Sair → cadastrar de novo o **mesmo** e-mail → 409
5. Tentar `usuario@adopet.local` → 409
6. Senhas diferentes → mensagem local, sem POST
7. Contato incompleto (ex.: 8 dígitos) → “Informe um contato válido”, sem POST
8. No cadastro, Entrar volta ao login
9. Parar o backend e clicar Cadastrar → mensagem de falha de rede

## Checklist de implementação (após aprovação)

1. Spec 003 + índice em `specs/README.md`
2. `cadastrarUsuario` + `isUfValid` + máscara de telefone no `authService`; método `cadastrar` no `AuthContext`
3. Generalizar `TextField` / `PasswordField` (props de teclado / autocomplete)
4. Ícones novos em `AuthIcons.js`
5. `RegisterScreen` + cidade/UF na mesma linha + máscara no contato
6. `AuthNavigator`: tela `Register`; `LoginScreen`: Cadastre-se navega
7. CONTEXTO (checklist mobile RF0001 cadastro; decisão na tabela §8)
