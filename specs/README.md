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
| 002 | Login + cadastro + esqueci senha do usuário + JWT | planejada (após 001) |
| 003 | Listagem de animais (A / P / E) | planejada |
| 004 | Detalhe do animal | planejada |
| 005 | CRUD de animal pelo usuário | planejada |
| 006 | Filtros de busca (RF0005) | planejada — fase 2 |
| 007 | Perfil / editar conta | planejada — depende de API |

Roadmap detalhado e pontos em aberto: spec 001.
