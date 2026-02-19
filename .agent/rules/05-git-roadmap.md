---
trigger: after completing any task, or when asked about project status
description: Gestione git commit, tag milestone, e aggiornamento ROADMAP.md
---

# Regole Git e Tracking Progetto

## Dopo OGNI task completato

1. **Commit** con formato strutturato:
```bash
git add .
git commit -m "tipo(scope): descrizione in italiano"
```

Tipi ammessi: `feat`, `fix`, `refactor`, `docs`, `style`, `chore`, `test`
Scope ammessi: `ui`, `forms`, `hooks`, `api`, `db`, `auth`, `ai`, `config`, `layout`, `setup`

2. **Aggiorna ROADMAP.md**:
- Cambia stato task da `⬜` a `✅`
- Aggiungi hash commit nella colonna Commit

## Dopo OGNI blocco completato

1. **Tag** la milestone:
```bash
git tag -a v0.X.0 -m "Blocco X: [nome blocco] completato"
git push origin v0.X.0
```

2. **Aggiorna "Stato Attuale"** in ROADMAP.md:
```markdown
BLOCCO CORRENTE: [prossimo blocco]
ULTIMA MILESTONE: v0.X.0 — [nome blocco]
ULTIMO COMMIT: [hash]
```

3. **Commit l'aggiornamento**:
```bash
git add ROADMAP.md
git commit -m "docs(roadmap): completato blocco X — [nome blocco]"
```

## Prima di iniziare un nuovo task

1. Leggi ROADMAP.md per sapere a che blocco siamo
2. Identifica il prossimo task `⬜` nel blocco corrente
3. Se tutti i task del blocco sono `✅`, fai il tag e passa al blocco successivo
