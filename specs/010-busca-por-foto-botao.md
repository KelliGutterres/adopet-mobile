# Spec 010 — Botão “buscar por foto” (placeholder)

> **Status:** aprovada e implementada.  
> Pontos 1–3 fechados em 2026-08-23: posição A; toque desabilitado; só ícone.  
> Depende de: spec 005 (listagem A/P/E + `SearchBar`).  
> **Não altera** o `adopet-backend`.  
> Recorte: **só o botão na UI**. Sem câmera, sem galeria, sem Storage, sem IA, **sem nenhuma rota**.

A comparação inteligente (RF0008) continua **fase 2**. Esta fatia só reserva o ponto de entrada nas listas de **perdidos** e **encontrados**, alinhado à decisão de **não** criar aba Similaridade.

O detalhe do animal permanece a spec **006**. Esta 010 não empurra números: 006–009 ficam como estão.

## Objetivo

Exibir um botão com **ícone de câmera** nas listagens de Encontrados (`E`) e Perdidos (`P`), no mesmo espírito dos controles “Em breve” da spec 005 (Filtros, FAB, sino). Cobre o início visual do **RF0008** e usabilidade (**RNF0001**), sem executar o fluxo.

## Por que não uma aba

A barra já tem cinco slots (Perdidos · Encontrados · + · Adoção · Perfil). Similaridade competiria com Perfil. A busca por foto entra **no contexto** das listas P/E, que é exatamente o recorte da IA (perdidos × encontrados), não adoção.

## Escopo (esta tarefa)

1. Botão visível só nas telas **Encontrados** e **Perdidos**
2. Ícone de **câmera** (SVG local, padrão `ListIcons.js` — sem biblioteca extra)
3. Sem `onPress` útil: **desabilitado**, acessibilidade “Em breve”
4. **Não** chamar `GET`/`POST` extra, **não** navegar, **não** pedir permissão de câmera
5. Adoção (`A`) **não** mostra o botão (layout da busca permanece o da 005)
6. Atualizar `docs/CONTEXTO-PROJETO.md` após implementação (decisão na tabela §8)

## Fora de escopo

- Abrir câmera ou galeria (RF0007)
- Upload / Supabase Storage
- Serviço Python / similaridade / qualquer endpoint novo
- Tela de resultados de candidatos
- Nova aba na barra inferior
- Aba Perfil / avatar no header / Sair (spec 009)
- Filtros funcionais (spec 008)
- Detalhe do animal (spec 006)
- Alterar o `adopet-backend`
- TypeScript, NativeWind, Expo Router, `expo-image-picker` / `expo-camera`
- Testes automatizados

## RF/RNF relacionados

| ID | Cobertura nesta spec |
|----|----------------------|
| RF0008 | **Só o ponto de entrada visual** — sem comparação |
| RF0007 | **Não** — sem captura |
| RF0004 | Listagens P/E ganham um controle a mais; Adoção inalterada |
| RNF0001 | Botão reconhecível (câmera); hint “Em breve” |

## O que já existe (não reinventar)

| Já pronto | Onde |
|-----------|------|
| `AnimalListScreen` parametrizado por `status` | spec 005 |
| `SearchBar` (campo + Filtros desabilitado) | spec 005 |
| `ListIcons.js` (SVG) | spec 005 |
| Controles “Em breve”: Filtros, FAB, sino, Perfil | spec 005 |

Nenhuma chamada além do `GET /animais?status=` já existente.

## Decisões desta rodada (2026-08-23)

| # | Tema | Decisão |
|---|------|---------|
| 1 | Posição | **A:** `[ busca ] [ câmera 44×44 ] [ Filtros ]` em P/E. Adoção sem câmera |
| 2 | Toque | Desabilitado, hint “Em breve”, sem Alert e sem navegação |
| 3 | Rótulo | **Só o ícone.** `accessibilityLabel="Buscar por foto"` |

## Contrato de UI

- Telas: `Encontrados` (`E`) e `Perdidos` (`P`).
- Cor do ícone: `colors.text`.
- Área de toque 44×44, mesmo visual do Filtros (fundo branco, borda, opacidade reduzida).
- Ícone: câmera (corpo + lente), stroke, `CameraIcon` em `ListIcons.js`.

Não há tela nova. Não há rota React Navigation nova.

## Arquitetura de código

```
src/components/ListIcons.js     # CameraIcon
src/components/SearchBar.js     # prop showPhotoSearch
src/screens/AnimalListScreen.js # showPhotoSearch={status === 'E' || status === 'P'}
```

Sem `animaisService` novo. Sem stack extra.

## Regras

1. Zero fetch extra.
2. Zero `navigation.navigate`.
3. Adoção sem o botão.
4. Não instalar pacote de câmera.

## Decisões técnicas

| Item | Escolha |
|------|---------|
| Canal | Mobile |
| Backend | intocado |
| Abas | inalteradas |
| Onde | P e E, na linha da busca (opção A) |
| Visual | ícone câmera, 44×44, estilo Filtros |
| Ação | desabilitado, “Em breve” |
| Adoção | sem botão |

## Critérios de pronto

- [x] Spec aprovada (pontos 1–3 fechados)
- [x] Encontrados e Perdidos mostram o botão câmera
- [x] Adoção **não** mostra
- [x] Toque não navega e não chama API
- [x] Filtros / busca textual inalterados na Adoção
- [x] Sem `expo-camera` / `expo-image-picker` / rota nova
- [x] Backend intocado
- [x] CONTEXTO atualizado (decisão: entrada de RF0008 nas listas P/E, sem aba Similaridade)

## Como validar (após implementação)

1. Login → Adoção: só busca + Filtros
2. Aba Encontrados e Perdidos: botão câmera visível, inativo
3. Toque no botão não dispara request nem troca de tela

## Checklist de implementação (após aprovação)

1. [x] `CameraIcon` em `ListIcons.js`
2. [x] `SearchBar` com botão opcional
3. [x] `AnimalListScreen` liga o botão só em `E` e `P`
4. [x] CONTEXTO (tabela §8 + nota de que RF0008 entra por esse botão, não por aba)
