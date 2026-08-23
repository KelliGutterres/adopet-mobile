# Specs (SDD)

Especificações obrigatórias **antes** de implementar (Spec-Driven Development).

## Regras

- Uma spec por feature/fatia relevante.
- Nome sugerido: `NNN-nome-curto.md` (ex.: `001-estrutura-inicial-mobile.md`).
- Conteúdo mínimo: objetivo, escopo, RF/RNF, contratos (API/UI), critérios de pronto, fora de escopo.
- Atualizar a spec se a decisão mudar durante a implementação.
- **Não implementar** enquanto a spec estiver em refinamento / aguardando aprovação.

Ver `docs/CONTEXTO-PROJETO.md` (seção SDD).

O mobile é o canal do **usuário** (`papel: "usuario"`). A ONG permanece no `adopet-web`.

## Índice

| Spec | Tema | Status |
|------|------|--------|
| [001](./001-estrutura-inicial-mobile.md) | Scaffold React Native (executado com Expo) | aprovada e implementada |
| [002](./002-login-usuario.md) | Tela de login do usuário + JWT | aprovada e implementada |
| [003](./003-cadastro-usuario.md) | Cadastro de usuário | aprovada e implementada |
| 004 | Listagem de animais (A / P / E) | planejada (antes era 003) |
| 005 | Detalhe do animal | planejada |
| 006 | CRUD de animal pelo usuário | planejada |
| 007 | Filtros de busca (RF0005) | planejada — fase 2 |
| 008 | Perfil / editar conta | planejada — depende de API |

Roadmap detalhado: spec 001. Auth: login na 002, cadastro nesta 003 (card 51). Esqueci senha continua spec futura.

A listagem saiu do número 003 porque a 002 adiou o cadastro; a autora pediu o cadastro como próxima fatia.
