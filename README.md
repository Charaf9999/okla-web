# OKLA — site marketing animé + démo app + backend temps réel

Site vitrine animé (React + Vite + Tailwind + Framer Motion), démo d'application
mobile cliquable, et un **petit backend Node/Express + WebSocket** (architecture
de type MEAN, données en mémoire) pour la soutenance PFE.

Le frontend **retombe automatiquement sur des données simulées** (`src/data.js`)
si le backend est éteint — le site reste donc 100 % fonctionnel dans tous les cas.

## Lancer en local

```bash
npm install
npm run dev:all      # lance le frontend (Vite) ET le backend (Express/WS) ensemble
```

Puis ouvrez http://localhost:5173.

Pour lancer séparément :

```bash
npm run dev          # frontend seul (port 5173)
npm run server       # backend seul (port 3001, via nodemon)
```

- `/`            → le site marketing animé (à scroller / enregistrer)
- `/reservation` → réservation : carte de Tanger, recherche/filtre, assistant scénarisé, « Mes réservations »
- `/app`         → la démo de l'application mobile (cliquable)

## Le backend (port 3001)

Données **en mémoire** (aucune base à installer). La couche `server/service.js`
est structurée comme un dépôt et pourrait être remplacée par MongoDB plus tard.

### API REST

| Méthode | Route | Description |
|--------|-------|-------------|
| GET  | `/api/restaurants` | Tous les restaurants (`?list=tangier` pour la liste de Tanger) |
| GET  | `/api/restaurants/:id` | Un restaurant |
| GET  | `/api/restaurants/:id/slots` | Créneaux disponibles |
| POST | `/api/reservations` | Crée une réservation `{ restaurantId, date, time, party }` |
| GET  | `/api/reservations` | Réservations créées pendant la session |

### WebSocket

- `ws://localhost:3001/ws` — diffuse la position d'un livreur simulé toutes les
  ~800 ms : `{ type:'courier', progress: 0..1, etaMin }`. C'est ce flux qui fait
  bouger le marqueur sur les cartes de suivi (section *Suivi temps réel* et écran
  *Suivi* de l'app). Si la connexion échoue, l'animation SMIL d'origine prend le relais.

Le `vite.config.js` proxifie `/api` et `/ws` vers le port 3001 (appels same-origin).

## Repli hors-ligne

Tous les appels (`src/api.js`) ont un délai d'expiration et **retombent sur les
mock** de `src/data.js` en cas d'échec. Une pastille **« ● API connectée »**
(olive) / **« ● Mode hors-ligne »** (gris) indique l'état en direct. Coupez le
backend : le site continue de fonctionner, les cartes restent animées.

## Démonstration (jour de la soutenance)
1. `npm run dev:all`, ouvrir http://localhost:5173 en plein écran.
2. Montrer la pastille **« ● API connectée »**, le squelette de chargement puis
   les restaurants chargés depuis le serveur.
3. Taper dans la recherche / cliquer un filtre → la liste se réduit en direct.
4. Réserver une table → **toast** « Réservation enregistrée ✓ » + la réservation
   apparaît dans **« Mes réservations »** (preuve de persistance côté serveur).
5. Section *Suivi temps réel* : le marqueur bouge car le serveur **diffuse les
   positions par WebSocket** et l'ETA décompte.
6. Couper le backend (Ctrl+C) → bascule fluide en **Mode hors-ligne**, rien ne casse.

## Structure
- `server/`         → backend Express + WebSocket (`index.js`, `service.js`, `data.js`)
- `src/api.js`      → client API + WebSocket avec **repli automatique** sur les mock
- `src/sections/`   → sections du site (Hero, Features, LiveTracking, Chatbot…)
- `src/pages/`      → Marketing, AppDemo, Reservation
- `src/components/` → Logo, Nav, Dish, Skeleton, StatusPill, useCourier…
- `src/data.js`     → données simulées (utilisées comme repli hors-ligne)

## Personnaliser
- Couleurs & polices : `tailwind.config.js`
- Données d'amorçage : `server/data.js` (backend) et `src/data.js` (repli)
- Photos de plats : déposer les fichiers dans `public/images/` (voir le README dedans)
