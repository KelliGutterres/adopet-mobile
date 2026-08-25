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
| [005](./005-listagem-animais.md) | Listagem de animais (A / P / E) | aprovada e implementada |
| [006](./006-busca-por-foto-botao.md) | Botão buscar por foto (placeholder RF0008) | aprovada e implementada |
| [007](./007-cadastro-animal.md) | Cadastro de animal perdido/encontrado (usuário) | aprovada e implementada |
| [008](./008-detalhe-animal.md) | Detalhe do animal (A / P / E) | aprovada e implementada |
| 009 | Perfil / editar conta | planejada — depende de API |
| — | Filtros de busca (RF0005) | planejada — fase 2 (não usa o 008) |

Auth: login na 002, cadastro na 003, esqueci senha na 004. Listagem A/P/E é a 005. Cadastro P/E pelo usuário é a 007 (adoção só a ONG no web). Detalhe nas três listas é a 008. Entrada visual de busca por foto (P/E) é a 006.
