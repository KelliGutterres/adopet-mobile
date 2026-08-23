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
| [004](./004-esqueci-senha.md) | Esqueci a senha do usuário | aprovada e implementada |
| 005 | Listagem de animais (A / P / E) | planejada (antes era 004 nesta 003) |
| 006 | Detalhe do animal | planejada |
| 007 | CRUD de animal pelo usuário | planejada |
| 008 | Filtros de busca (RF0005) | planejada — fase 2 |
| 009 | Perfil / editar conta | planejada — depende de API |

Roadmap detalhado: spec 001. Auth: login na 002, cadastro na 003, esqueci senha nesta 004. Listagem A/P/E fica para a 005.

A 003 tinha reservado 004 para a listagem; a autora pediu o esqueci senha como próxima fatia, então a listagem deslocou.
