# Spec 004 — Esqueci a senha do usuário (app mobile)

> **Status:** aprovada e implementada.  
> Depende de: spec 001 (`api.js` já trata `204`); spec 002 (login + `AuthLayout` + `AuthNavigator`); spec 003 (cadastro ativo); backend spec 006 (`PUT /auth/usuarios/senha`).  
> **Não altera** o `adopet-backend`.  
> Espelho de produto: web spec 006 (`/esqueci-senha` da ONG).  
> Pontos 1–6 fechados em 2026-08-23.

A spec 002 deixou **Esqueceu sua senha?** visível e desabilitado (“Em breve”). A 003 ativou só o cadastro. Esta fatia ativa o fluxo de redefinir senha do **usuário**.

O mobile é **somente usuário**. Recuperação de `ong` permanece no painel web (`PUT /auth/ongs/senha` **não** é chamado aqui).

A Parte 1 **não** tem RF próprio de “recuperar senha”. O contrato da API já existe (backend spec 006). Esta fatia só **entrega a UI** no canal mobile.

## Objetivo

Permitir que o **usuário** redefina a senha a partir do login, consumindo `PUT /auth/usuarios/senha` com `{ email, senha }`. Após sucesso (**204**), o app **não** autentica: volta **imediatamente** ao login para a pessoa entrar com a senha nova.

Cobre **RF0002** (voltar a autenticar), usabilidade (**RNF0001**) e senha só no body da API (**RNF0002**).

## Recorte vs roadmap anterior

A spec 001 planejou esqueci senha junto com login/cadastro na 002. A 002 fechou só login. A 003 fechou cadastro e **reservou o número 004 para a listagem** A/P/E. Esta 004 **é o esqueci senha**; a listagem passa a ser a **005**.

| Fluxo | Web (já feito) | Mobile |
|-------|----------------|--------|
| Login + JWT + sessão | spec 002 | spec 002 |
| Cadastro | spec 005 | spec 003 |
| Esqueci senha | spec 006 | **esta spec** |
| Listagem de animais | spec 003 | spec **005** (antes era 004 nesta 003) |

## Referência visual

Não há print de “esqueci senha” na Parte 1 (Figura 13 é login + cadastro). O print só mostra o **link** “Esqueceu sua senha?” no login.

| Arquivo / spec | Uso nesta spec |
|----------------|----------------|
| [login-cadastro-mobile.png](../docs/prototipos/login-cadastro-mobile.png) | Fig. 13 — identidade (marca + cartão); o print só tem o link no login |
| Spec 002 / 003 | `AuthLayout`, campos com ícone, paleta `#7C3AED`, `AuthNavigator` |
| Web spec 006 | Espelho do fluxo (um form, confirmar senha, voltar ao login, aviso de sucesso, sem JWT) |

A tela **não** inventa um layout novo: mesmo shell do login/cadastro.

## Escopo (esta tarefa)

1. Tela `ForgotPassword` no `AuthNavigator`, no mesmo `AuthLayout` do login
2. Formulário único: e-mail, nova senha, confirmar senha
3. `authService.redefinirSenhaUsuario` → `PUT /auth/usuarios/senha` com `{ email, senha }` (sem `senhaConfirmacao`)
4. Sucesso **204**: voltar **imediatamente** ao `Login` (sem tela intermediária; mensagem de confirmação no login)
5. Ativar **Esqueceu sua senha?** no login (hoje desabilitado / “Em breve”) → navega para `ForgotPassword` levando o e-mail já digitado
6. Prefill do e-mail via `route.params`; campo **editável**
7. Validação local alinhada à API (e-mail, mínimo 6, senhas iguais)
8. Atualizar `docs/CONTEXTO-PROJETO.md` após implementação

## Fora de escopo

- Alterar o `adopet-backend` (contrato, SMTP, token de reset, OTP, envelope)
- Recuperação de `ong` / `PUT /auth/ongs/senha` (web)
- Troca de senha **logada** (perfil: senha atual + nova)
- Envio real de e-mail / link mágico / código OTP
- Login automático após o `PUT` (a API **não** devolve JWT de propósito — backend spec 006)
- Invalidar JWTs já emitidos (limitação da API; fora de escopo)
- Captcha, rate limit
- Expor na UI a limitação do MVP (quem souber o e-mail redefine a senha)
- Listagem / CRUD de animais
- Edição de perfil (card 59)
- Testes automatizados
- TypeScript, NativeWind, Expo Router
- Biblioteca extra

## RF/RNF relacionados

| ID | Cobertura nesta spec |
|----|----------------------|
| RF0002 | Usuário volta a autenticar no app depois de redefinir a senha |
| RF0009 | **Não** — recuperação da ONG é no web |
| RF0001 | **Parcial** — só o campo senha; não é edição de perfil |
| RNF0001 | Mesmo padrão das outras telas de auth; erros em PT-BR |
| RNF0002 | Senha só no body; nunca persistida; hash continua no backend |

## O que já existe (não reinventar)

O mobile **consome** a API; não duplica regras de negócio.

| Já pronto | Onde |
|-----------|------|
| `PUT /auth/usuarios/senha` (público, 204 / 400 / 404) | backend spec 006 |
| `requestJson` trata `204` e devolve `null` | `src/services/api.js` (spec 001) |
| Envelope `{ error: { message } }` | spec 001 |
| `AuthLayout` / `TextField` / `PasswordField` / `LockIcon` / paleta | specs 002 e 003 |
| `AuthNavigator` com `Login` + `Register` | spec 003 |
| Link “Esqueceu sua senha?” visível e desabilitado | spec 002 / `LoginScreen.js` |
| Quem já está autenticado **não** vê o stack público | `RootNavigator` (spec 002) — equivalente ao `PublicOnlyRoute` do web |
| Fluxo equivalente no painel da ONG | `adopet-web` spec 006 |

O app chama **somente** `/auth/usuarios/*` + `GET /auth/me`. Nunca `/auth/ongs/*`.

Não precisa passar pelo `AuthContext`: este fluxo **não** grava sessão.

## Contexto técnico (API já pronta)

Base: `EXPO_PUBLIC_API_URL`.  
Envelope de erro: `{ "error": { "message": "..." } }`.  
CORS aberto. Rota **pública** (sem JWT).

### `PUT /auth/usuarios/senha`

Contrato vigente (backend spec 006). **Não** enviar `senhaConfirmacao`.

**Body**

```json
{
  "email": "usuario@adopet.local",
  "senha": "novaSenha123"
}
```

| Campo | Regra da API |
|-------|----------------|
| `email` | obrigatório; trim + lowercase no backend |
| `senha` | obrigatória; mínimo **6** caracteres |
| `senhaConfirmacao` | **não** existe na API — só no cliente |

**204** No Content — corpo vazio; hash atualizado. `requestJson` já retorna `null`.

| Status | Quando | `error.message` (hoje) |
|--------|--------|-------------------------|
| `400` | validação | E-mail inválido / Senha deve ter no mínimo 6 caracteres |
| `404` | e-mail não encontrado em `Usuario` | E-mail não encontrado |

E-mail de **ONG** **não** redefine o usuário: unique é por tabela. `ong@adopet.local` no app → **404**. Comportamento correto; o mobile não tenta adivinhar o papel.

**Limitação herdada (MVP TCC):** quem souber o e-mail do usuário redefine a senha. Sem SMTP. **Não** expor isso na UI.

Seed local: `usuario@adopet.local` / `senha123` (nome “Usuario Demo”). A senha da seed muda depois do `PUT` até um novo seed.

JWTs antigos desse usuário continuam válidos até expirar (`JWT_EXPIRES_IN`, hoje `7d`). Fora de escopo invalidá-los.

## Fluxo

```
Usuário                     App                         API
 |                           |                           |
 |  Login (e-mail preenchido)|                           |
 |  Esqueceu sua senha?      |                           |
 |  ForgotPassword { email } |                           |
 |  e-mail (editável)        |                           |
 |  + senha + confirm        |                           |
 |-------------------------->|  PUT /auth/usuarios/senha |
 |                           |-------------------------->|
 |                           |  204 (vazio)              |
 |                           |<--------------------------|
 |  volta imediato ao Login  |                           |
 |  (aviso de senha ok)      |                           |
 |  POST /auth/usuarios/login|                           |
 |  (e-mail + senha nova)    |                           |
```

Não há tela intermediária de “senha atualizada”: o `204` navega na hora para o `Login`. A confirmação aparece no login (`route.params`), para o usuário não ficar sem feedback.

Após o `PUT`, **não** chamar `saveSession` / `login`. A pessoa precisa autenticar de novo — isso valida o fluxo ponta a ponta (critério da backend spec 006).

Quem já está autenticado **não** vê esta tela: o `RootNavigator` só monta o `AuthNavigator` sem sessão (inalterado). Troca de senha logada é outra spec.

## Contrato de UI

Idioma: **PT-BR**. Identificadores de código em inglês.

### Navegação (React Navigation)

O `AuthNavigator` ganha a tela `ForgotPassword`. O `RootNavigator` e o stack autenticado **não** mudam.

| Tela | Auth | Comportamento |
|------|------|----------------|
| `Login` | pública; se já logado → stack autenticado | Esqueceu sua senha? **ativo** → `ForgotPassword` (com `params.email` se houver e-mail digitado) |
| `Register` | pública | inalterada |
| `ForgotPassword` | pública; se já logado → stack autenticado | Redefinir senha; Voltar ao login → `Login` |
| `Home` | exige sessão `usuario` | inalterada |

`headerShown: false` (o layout traz a marca). Sem header nativo de “voltar”: o link do form faz o papel.

React Navigation **não** tem query string. O equivalente ao `?email=` do web é `route.params`.

### Login — delta desta spec

Só o link **Esqueceu sua senha?** e o aviso de sucesso mudam. Cadastre-se permanece ativo (spec 003).

| Elemento | Hoje (spec 003) | Nesta spec |
|----------|-----------------|------------|
| Esqueceu sua senha? | visível, desabilitado, hint “Em breve” | **ativo**; `navigation.navigate('ForgotPassword', { email })` |
| Aviso pós-reset | não existe | se `route.params.senhaAtualizada` → “Senha atualizada. Faça login com a nova senha.” |
| E-mail após reset | inalterado | pré-preenchido com o e-mail do `PUT` (via `params.email`); senha do login **vazia** |

O texto do link permanece **“Esqueceu sua senha?”** (Fig. 13 / `LoginScreen` atual). Não mudar o copy.

### Esqueci senha — campos e copy

Copy de **erro / loading / validação**: desta spec.  
Título/subtítulo: desta spec (não há print; alinhado ao web 006, canal **usuário**).

| Elemento | Copy |
|----------|------|
| Marca / slogan | iguais ao login (via `AuthLayout`) |
| Título | Esqueceu a senha? |
| Subtítulo | Informe o e-mail da conta e escolha uma nova senha |
| E-mail | label “E-mail”; placeholder “Digite seu e-mail”; mesmo `TextField` do login; **pré-preenchido** se vier `params.email`; **editável** |
| Nova senha | label “Nova senha”; placeholder “Digite a nova senha”; `PasswordField` + olho; `textContentType="newPassword"` |
| Confirmar senha | label “Confirmar senha”; placeholder “Confirme a nova senha”; `PasswordField` + olho; `textContentType="newPassword"` |
| Submit | Redefinir senha (+ `LockIcon` com `color={colors.surface}`); loading: botão desabilitado; texto “Redefinindo…” |
| Link extra | **Voltar ao login** — ativo → `Login` (devolve o e-mail atual nos params) |
| Sucesso | volta imediata ao Login; aviso “Senha atualizada. Faça login com a nova senha.” |
| Erro 404 | E-mail não encontrado |
| Erro 400 | `error.message` da API |
| Erro de rede | Não foi possível conectar à API. Verifique se o backend está no ar. |
| Validação local | ver tabela abaixo |

### Prefill do e-mail

Espelho do web (`?email=`), com params do React Navigation.

- No login, o link navega `ForgotPassword` com `{ email: email.trim() }` se houver texto no campo; senão `{ }` (campo vazio).
- `ForgotPasswordScreen` inicia o estado com `route.params?.email` (trim).
- O usuário **pode alterar** o e-mail antes do `PUT`.
- “Voltar ao login” devolve `{ email }` atual, para não perder o que já estava no campo.
- Após o `204`, o login recebe `{ senhaAtualizada: true, email }` (pré-preenche o e-mail; senha vazia).
- Usar `navigation.navigate('Login', params)` — o `Login` já está na pilha; isso volta para ele e atualiza os params. **Não** empilhar outro Login.

O `LoginScreen` lê `route.params` quando a tela ganha foco (`useEffect` / `useFocusEffect`): se `senhaAtualizada`, mostra o aviso (`accessibilityRole="status"`) e aplica o e-mail. Limpar o param depois de ler evita o aviso reaparecer se a pessoa só voltar do cadastro.

### Validação no cliente (antes do PUT)

| Condição | Mensagem |
|----------|----------|
| E-mail inválido | Informe um e-mail válido |
| Senha &lt; 6 | A senha deve ter no mínimo 6 caracteres |
| Senhas diferentes | As senhas não coincidem |

A API continua sendo a fonte da verdade. Senhas diferentes **não** disparam o `PUT`. Reusar `isEmailValid` e `MIN_SENHA` de `authService.js`.

### Layout

- Reutilizar `AuthLayout` (fundo lavanda, patas, logo, cartão branco ~28px, silhuetas).
- Um único form com três campos empilhados; o cartão **rola** (`KeyboardAvoidingView` + `ScrollView`, igual ao login). Sem scroll horizontal.
- Primária `#7C3AED`. Ícones já existentes em `AuthIcons.js`: `MailIcon`, `LockIcon` (submit com `colors.surface`, igual `LogInIcon` / `UserPlusIcon`). Sem lib nova.
- **Sem** botões Google/Apple e **sem** divisor “ou”.
- **Sem** `Alert` nativo para sucesso ou erro — texto visível na tela, igual login/cadastro.

### Acessibilidade mínima

- `TextInput` com `accessibilityLabel` por campo
- Erro da API em texto visível (`accessibilityRole="alert"`)
- Aviso de sucesso no login com `accessibilityRole="status"`
- Toggle da senha com `accessibilityLabel` (“Mostrar senha” / “Ocultar senha”)
- Botão Redefinir senha com `accessibilityState={{ disabled, busy }}` no loading
- Esqueceu sua senha? (login) e Voltar ao login (esqueci senha) com área de toque ≥ 44px
- Área de toque ≥ 44px no olho

## Persistência e sessão

**Não** gravar `adopet.token` nem `adopet.usuario` neste fluxo.

- Logout, bootstrap `GET /auth/me` e recusa de `papel !== "usuario"` **inalterados**.
- `AuthContext` **não** ganha método `redefinirSenha` — a tela chama `authService.redefinirSenhaUsuario` direto (igual o web: a página não passa pelo context).

## Arquitetura de código

Camadas mobile: **screens / components / services / hooks / navigation / context**. Arquivos em **`.js`**.

```
src/
  screens/
    LoginScreen.js              # link ativo + aviso/prefill via route.params
    ForgotPasswordScreen.js     # nova
    RegisterScreen.js           # inalterada
    HomeScreen.js               # inalterada
  components/
    AuthLayout.js               # inalterado (reuso)
    AuthIcons.js                # reutilizar LockIcon no submit (cor surface)
    PasswordField.js            # inalterado (já aceita label / placeholder / textContentType)
    TextField.js                # inalterado
  navigation/
    AuthNavigator.js            # + ForgotPassword
  services/
    authService.js              # + redefinirSenhaUsuario
  context/
    AuthContext.js              # inalterado
```

Fluxo: `ForgotPasswordScreen` → `authService.redefinirSenhaUsuario` → `api.js` (`requestJson`) → `PUT /auth/usuarios/senha`.

O body enviado **não** inclui `senhaConfirmacao`. Telas não chamam `fetch` direto.

### `redefinirSenhaUsuario`

```js
export function redefinirSenhaUsuario({ email, senha }) {
  return requestJson('/auth/usuarios/senha', {
    method: 'PUT',
    body: { email, senha },
  });
}
```

Reaproveita `isEmailValid` e `MIN_SENHA` já existentes em `authService.js`.

## Regras de negócio (cliente)

1. Chamar **somente** `PUT /auth/usuarios/senha` (além das rotas de auth já usadas).
2. Validar no cliente **antes** do PUT; a API valida de novo.
3. Exibir `error.message` da API; fallback genérico se o JSON não vier (`ApiError` da spec 001).
4. Não logar senha nem JWT.
5. Após 204, **não** autenticar — voltar imediato ao login; o usuário entra com a senha nova.
6. E-mail da seed (`usuario@adopet.local`) redefine a senha do usuário demo; e-mail de ONG (`ong@adopet.local`) → 404.
7. JWTs antigos desse usuário continuam válidos até expirar (limitação da API; fora de escopo).
8. Não mencionar SMTP, “e-mail enviado” nem “código” — o fluxo é só e-mail + senha nova.

## Decisões técnicas (fechadas em 2026-08-23)

Herdadas do web spec 006 e da API (backend spec 006), adaptadas ao React Navigation. Ponto 6 divergiu do cadastro mobile de propósito: o link de volta é o do web.

| Item | Decisão |
|------|---------|
| Número da spec | **004** esqueci senha; listagem vira **005** |
| Tela | `ForgotPassword` no `AuthNavigator` (`ForgotPasswordScreen.js`) |
| Layout | mesmo `AuthLayout` das specs 002/003 |
| Copy título | “Esqueceu a senha?” |
| Copy subtítulo | “Informe o e-mail da conta e escolha uma nova senha” |
| Passos | **um único formulário** (e-mail + nova senha + confirmar) |
| Pós-sucesso | volta imediata ao `Login` (aviso no login; **sem JWT**) |
| Confirmar senha | sim, só no cliente |
| Prefill e-mail | sim (`route.params.email` a partir do login); campo **editável** |
| Link no login | ativo; texto inalterado (“Esqueceu sua senha?”) |
| Link de volta | **Voltar ao login** (igual web; não “Já lembrou a senha?”) |
| Ícone no submit | sim (`LockIcon` com `colors.surface`) |
| Feedback de sucesso | texto na tela de login (não `Alert`) |
| SMTP / token / OTP | não (API opção A) |
| AuthContext | intocado |
| Backend | intocado |

## Pontos abertos

Nenhum. Fechados em 2026-08-23:

1. Número da spec — **004** esqueci senha; listagem A/P/E na **005**.
2. Passos — **um único form**.
3. Pós-sucesso — **voltar ao login** imediatamente, sem autenticar.
4. Prefill do e-mail — **sim**, campo editável.
5. Subtítulo — “Informe o e-mail da conta e escolha uma nova senha”.
6. Link de volta — **Voltar ao login**.

## Critérios de pronto

- [x] Spec aprovada (pontos 1–6 fechados em 2026-08-23)
- [x] Specs 001, 002 e 003 já implementadas
- [x] `ForgotPassword` no mesmo shell do login (marca + cartão + silhuetas)
- [x] Esqueceu sua senha? no login navega para a tela (não está mais “Em breve”) e leva o e-mail digitado; o campo continua editável
- [x] `PUT` 204 → volta imediata ao Login com aviso; login posterior com a senha nova entra na Home
- [x] Login com a senha antiga falha após o `PUT` (“Credenciais inválidas”)
- [x] E-mail de ONG (`ong@adopet.local`) → “E-mail não encontrado”, permanece na tela
- [x] Senhas diferentes → não chama a API
- [x] Senha nunca no SecureStore neste fluxo (`saveSession` não é chamado)
- [x] Sem botões Google/Apple, sem “ou”, sem `Alert` nativo de sucesso
- [x] Teclado não cobre os campos; formulário usável no Expo Go **e** no emulador Android
- [x] Backend intocado
- [x] CONTEXTO atualizado (checklist mobile; decisão na tabela §8)
- [x] `specs/README.md` — status aprovada e implementada

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

1. Login → digitar um e-mail → Esqueceu sua senha? → tela “Esqueceu a senha?” com o e-mail preenchido (editável)
2. Redefinir `usuario@adopet.local` para uma senha nova (≥ 6) → cai no Login na hora, com aviso
3. Entrar com a senha **antiga** (`senha123`) → “Credenciais inválidas”
4. Entrar com a senha **nova** → Home “Olá, Usuario Demo”
5. Repetir o fluxo com `ong@adopet.local` na tela de esqueci senha → 404 (permanece na tela)
6. Senhas diferentes → mensagem local; sem PUT na rede
7. No esqueci senha, Voltar ao login volta ao login com o e-mail preservado
8. Parar o backend e clicar Redefinir senha → mensagem de falha de rede
9. Usuário já logado não alcança `ForgotPassword` (stack autenticado)

> Depois do teste, se quiser a seed de volta: `npm run prisma:seed` no backend.

## Checklist de implementação (após aprovação)

1. Spec 004 aprovada + índice em `specs/README.md` (status em implementação)
2. `redefinirSenhaUsuario` em `authService.js`
3. `ForgotPasswordScreen.js`: copy, prefill `params.email`, PUT, navigate de volta ao Login
4. `AuthNavigator.js`: tela `ForgotPassword`
5. `LoginScreen.js`: link ativo com e-mail; aviso + prefill via `route.params`
6. CONTEXTO (checklist mobile; decisão na tabela §8)
7. `specs/README.md` — status aprovada e implementada
