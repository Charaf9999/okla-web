# 🎬 Assistant OKLA — Questions pour l'enregistrement vidéo

L'assistant comprend le **français** et la **darija marocaine** (en lettres latines).
Il répond **dans la langue de la question**, affiche ses **sources (RAG)** sous chaque
réponse, et **agit sur la page** (carte, filtres, réservation) pendant qu'il écrit.

> ⚠️ Tout est scénarisé (`src/assistant/engine.js`) — aucun vrai LLM, conformément
> à la directive de Pr. Azmani (architecture LLM+RAG modélisée, non codée).

---

## 🎥 Scénario recommandé (ordre de tournage)

Tapez les questions **lentement** (ça rend mieux à l'écran). L'effet « le bot écrit »
+ le streaming mot-à-mot + l'action déclenchée sur la carte font tout le réalisme.

| # | Tapez ceci | Langue | Ce qui se passe à l'écran |
|---|---|---|---|
| 1 | `Salam, chno ahsan restaurant maghribi f Tanja ?` | Darija | Répond **en darija**, sélectionne Le Jardin Marrakech sur la carte 🗺️ |
| 2 | `Une table pour 2 ce soir à 20h` | Français | Pré-remplit la réservation (20:00, 2 pers.) ✅ |
| 3 | `Wach kaynin chi promotions lyouma ?` | Darija | Active le filtre **Offres**, liste les -20% / -30% 🏷️ |
| 4 | `Des adresses près de la Kasbah ?` | Français | Met en avant El Morocco Club + Saveur de Poisson (pulsation saffron) ✨ |
| 5 | `Fin nakol l7out mzyan ?` | Darija | Sélectionne Saveur de Poisson près du port 🐟 |
| 6 | `Confirme ma réservation` | Français | Lance le tunnel de réservation en auto-confirmation → toast + « Mes réservations » 🎉 |
| 7 | `Ch7al 3andi dyal points ?` | Darija | Annonce le solde de points et ouvre l'espace fidélité 🏆 |
| 8 | `Choukran bzaf !` | Darija | Remerciement chaleureux en darija 🌿 |

Durée estimée : ~90 secondes — parfait pour la section assistant de la vidéo.

---

## 📋 Toutes les questions reconnues

### Recommandation
- `Recommande-moi un restaurant marocain`
- `Quel est le meilleur restaurant ?`
- `Salam, chno ahsan restaurant maghribi f Tanja ?`
- `Bghit nakol tajine, nsa7ni b chi blassa`
→ sélectionne le restaurant marocain le mieux noté sur la carte

### Réserver une table (l'heure et le nombre de personnes sont **détectés dans la phrase**)
- `Une table pour 2 ce soir à 20h`
- `Réserver pour 4 personnes à 21h`
- `Bghit tabla l jouj had lila m3a 8h` *(« 8h » + « lila » → compris comme 20:00)*
- `Bghit tabla l tlata had lila` *(tlata → 3 personnes)*
→ pré-remplit date / heure / personnes

### Quartier
- `Des adresses près de la Kasbah ?`
- `Wach kayn chi restaurant 9rib mn la Kasbah ?`
→ met en avant les restaurants de la Kasbah et du port

### Poisson
- `Où manger du bon poisson ?`
- `Fin nakol l7out mzyan ?`
→ sélectionne Saveur de Poisson

### Offres / promotions
- `Quelles sont les offres du jour ?`
- `Wach kaynin chi promotions lyouma ?`
→ active le filtre « Offres » + liste les réductions

### Romantique / vue mer
- `Un endroit romantique pour un anniversaire`
- `Bghit chi blassa romansiya`
- `Un restaurant avec vue sur la mer`
- `Chi blassa 3andha vue 3la lb7er`
→ met en avant les adresses selon l'ambiance demandée

### Petit budget
- `Quelque chose de pas cher, petit budget`
- `3tini chi haja rkhisa 3afak`
→ trie par prix + met en avant le meilleur rapport qualité-prix

### Menu
- `Montre-moi le menu`
- `Chno kayn f lmenu ?`
→ ouvre la fiche détaillée du restaurant sélectionné

### Confirmer
- `Confirme ma réservation`
- `Akkad liya réservation dyali`
→ ouvre le tunnel en auto-confirmation → toast de succès

### Points de fidélité OKLA 🆕
- `Combien de points OKLA j'ai ?`
- `Ch7al 3andi dyal points ?`
→ annonce votre solde, le barème (+150/réservation, 1000 pts = −100 DH) et ouvre l'espace fidélité

### Mes réservations
- `Montre-moi mes réservations`
- `Warrini réservations dyali`
→ ouvre le tiroir « Mes réservations »

### Politesse
- `Bonjour` / `Salam` → accueil
- `Merci beaucoup !` / `Choukran bzaf !` → remerciement

### Question inconnue
N'importe quoi d'autre → réponse de repli polie qui suggère des exemples
(utile à montrer 2 secondes : ça prouve que le bot « réfléchit »).

---

## 💡 Astuces tournage

1. **Montrez le badge « LLM + RAG »** dans l'en-tête du chat (zoom léger au montage).
2. **Laissez les sources s'afficher** sous chaque réponse avant de taper la suivante —
   c'est la preuve visuelle de la couche RAG du rapport.
3. Alternez français / darija : c'est l'argument « marché marocain » du projet.
4. Question 6 (`Confirme ma réservation`) : laissez la confirmation se dérouler
   jusqu'au toast « +150 points OKLA » sans toucher la souris.
5. Si vous vous trompez en tapant, pas grave : le moteur tolère les fautes de
   ponctuation et d'accents (`reserve`, `réserve`, `RESERVE` → pareil).

## ➕ Ajouter une question

Ouvrir `src/assistant/engine.js`, ajouter une entrée dans `INTENTS`
(mots-clés FR + darija, réponse `fr` + `da`, `action`, `sources`). C'est tout.
