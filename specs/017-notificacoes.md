# Spec 017 — Notificações no app

> **Status:** aprovada e implementada (2026-10-05).  
> Depende de: backend spec 015 (`GET/PATCH /notificacoes`).  
> O app é o canal do usuário (`papel: "usuario"`). O sino do header (spec 005) deixa de ser “Em breve”.

---

## Objetivo

Avisar o usuário quando outra conta cadastrar um animal para adoção, perdido ou encontrado, usando o sino que já está no header das listas.

---

## Decisões

1. O sino do `AppHeader` fica habilitado. O badge usa `naoLidas` (acima de 9, mostra `9+`).
2. O toque abre a tela **Notificações** (stack, sem tab nova).
3. A lista mostra título, mensagem e data. Vazia: “Nenhuma notificação ainda.”
4. O app consulta `GET /notificacoes` enquanto o usuário está logado, ao focar a tela e a cada 30 segundos.
5. Tocar num aviso marca `PATCH /notificacoes/:id/lida` e, se `animal` existir, abre o detalhe (`AnimalDetail` com `idAnimal` e `status`).
6. Se `animal` for `null`, o texto permanece e não abre detalhe.
7. “Marcar todas como lidas” chama `PATCH /notificacoes/lidas` e fica no canto do header quando há não lidas.
8. 401 faz logout. O proxy do Metro (spec 015) passa a encaminhar `/notificacoes`.
9. O próprio cadastro do usuário não aparece na lista dele — a API já exclui o autor.

---

## Fora de escopo

- Push nativo (Expo Notifications).
- Aviso no cadastro do próprio animal além do fluxo que a tela de form já mostra.
- Dashboard.

---

## Critérios de pronto

- [ ] O sino abre a lista e mostra a contagem de não lidas.
- [ ] Cadastro feito pela ONG (ou por outro usuário) aparece para o usuário logado.
- [ ] O cadastro feito pelo próprio usuário não aparece para ele.
- [ ] Tocar no aviso abre o detalhe do animal e marca como lido.
- [ ] “Marcar todas como lidas” zera o badge.
