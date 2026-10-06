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
| [006](./006-busca-por-foto-botao.md) | Botão buscar por foto (entrada P/E; fluxo na 016) | aprovada e implementada |
| [007](./007-cadastro-animal.md) | Cadastro de animal perdido/encontrado (usuário) | aprovada e implementada |
| [008](./008-detalhe-animal.md) | Detalhe do animal (A / P / E) | aprovada e implementada |
| [009](./009-perfil-usuario.md) | Perfil (consulta + logout) + aba Similaridade | aprovada e implementada |
| [010](./010-edicao-perfil.md) | Edição persistida da conta (RF0001) | aprovada e implementada |
| [011](./011-meus-animais.md) | Meus animais (listar / editar / excluir P/E) | aprovada e implementada |
| [012](./012-upload-captura-imagem.md) | Upload e captura de imagem do animal (galeria/câmera) | aprovada e implementada |
| [013](./013-upgrade-expo-sdk-57.md) | Upgrade Expo SDK 54 → 57 (Expo Go iOS) | aprovada e implementada |
| [014](./014-contato-whatsapp-animal.md) | WhatsApp no detalhe (contato do responsável) | aprovada e implementada |
| [015](./015-proxy-api-metro-expo-go.md) | Proxy da API pelo Metro (Expo Go / túnel) | aprovada e implementada |
| [016](./016-busca-por-foto-similaridade.md) | Busca por foto / similaridade (RF0008) | aprovada e implementada |
| [017](./017-notificacoes.md) | Sino de notificações (cadastro de animal) | aprovada e implementada |
| — | Filtros de busca (RF0005) | cancelada — fora de escopo (2026-10-05) |
| — | Upload de foto no painel web | planejada — consome backend spec 010 |

Auth: login na 002, cadastro na 003, esqueci senha na 004. Listagem A/P/E é a 005. Cadastro P/E pelo usuário é a 007 (adoção só a ONG no web). Detalhe nas três listas é a 008. Entrada visual de busca por foto (P/E) é a 006 — o fluxo real (RF0008) é a **016** (consome backend spec 012). Perfil no header + aba Similaridade (placeholder na 009; ativada na 016). Edição persistida do perfil é a 010 (lápis da 009; API já existe). Meus animais (listar / editar / excluir os P/E do usuário) é a 011 — fecha o RF0003 no mobile. Upload/captura da foto do animal (RF0007) é a **012** (consome backend spec 010; sem mudar a API). Upgrade da stack Expo para o Go 57 do iPhone é a **013** (sem feature nova). WhatsApp no detalhe (contato do responsável) é a **014** (consome backend spec 011; ícone só no detalhe). Proxy da API pelo Metro no Expo Go (túnel de campus) é a **015** (também encaminha `/notificacoes`). Notificações de cadastro de animal (sino do header) são a **017**.
