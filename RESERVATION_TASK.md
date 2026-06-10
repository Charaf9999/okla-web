# OKLA — Reservation upgrade (TheFork-level) + polish

## VISION
Elevate the /reservation experience to feel like TheFork (LaFourchette): a synced map + list,
bookable time-slots right on each card, special offers, a rich restaurant detail with reviews,
and a smooth multi-step booking ending in a rewarding confirmation. This is the part I present,
so it must look polished and convincing on a screen recording.

## HARD CONSTRAINTS (do not violate)
- PRESERVE all existing work: the green-led palette, the Tangier map, the scripted assistant, the
  AppDemo screens, photo support (Dish component + /public/images), the reserved success screen,
  and any backend already added.
- UI text in FRENCH. Lead color is OLIVE GREEN (#6F8F45); terracotta (#D96C3B) is a warm ACCENT only;
  saffron (#F2B84B) for ratings/offers; brick (#C94C3D) only for errors/live badges.
- The AI assistant stays SCRIPTED (extend reservationScript / its actions if needed) — NO real LLM.
- If an Express backend exists, persist reservations via the API (extend endpoints as needed) and keep
  a graceful FALLBACK to local mock data so nothing ever breaks if the server is off. If no backend,
  use the in-memory mock.
- Work in small phases; run `npm run build` after each phase and keep it compiling. Match existing
  Framer Motion + Tailwind patterns. Don't add heavy new dependencies without need.

## DATA (extend src/data.js — author plausible FRENCH content)
For each restaurant in the `tangier` array, add:
- priceLevel: 1–3
- offer: e.g. "-20%" or "-30%" for some, null for others
- description: 1–2 warm French sentences
- tags: 2–3 short French tags (e.g. "Terrasse", "Romantique", "Vue mer", "Familial")
- reviews: 2–3 objects { name, rating (1–5), text (short French), date (e.g. "il y a 3 j") }
- photos: an array of image paths reusing the existing /images/<id>.jpg plus the gradient fallback
  (use the Dish component so missing photos degrade gracefully)

## FEATURES TO BUILD

### A. Filter & sort bar (top of /reservation)
A clean horizontal bar: cuisine filter, prix (€/€€/€€€), note minimale, a "Offres" toggle, and a
"Disponible ce soir" toggle, plus a "Trier par" (Recommandés / Note / Prix). Filtering/sorting updates
the list (and the visible map pins) live, with a smooth animation and a result count ("8 restaurants").

### B. Synced map + list (the TheFork signature)
- Hovering a restaurant CARD highlights its MAP PIN (scale + ring); hovering a PIN highlights its card
  and shows a small floating "mini-card" popover near the pin (photo, name, rating, price, first slot,
  "Réserver"). Clicking either opens the restaurant detail. Keep mobile = tap.
- Show offer badges on pins/cards that have an offer.

### C. Bookable time-slots on each list card
Each card shows its next bookable time-slot pills directly (like TheFork). Clicking a slot jumps
straight into the booking flow with that restaurant + slot preselected.

### D. Rich restaurant detail (panel or modal)
When a restaurant is selected: a photo strip/gallery, name + cuisine + area + price, rating with a
star breakdown and the 2–3 reviews (avatars = colored initials), the description + tags, a short menu
preview (3–4 dishes with prices in DH), and a sticky booking widget (date chips, party stepper, time
slots, "Réserver").

### E. Multi-step booking flow (smooth, animated)
Three steps in a modal/drawer:
1. **Créneau** — date (from the top bar), party size, time slot.
2. **Vos informations** — Nom, Téléphone, Demande spéciale (optional fields, prefilled with sample
   values, editable, NOT validated — it's a demo).
3. **Confirmation** — green check, full booking recap, a rewarding line "+150 points OKLA",
   and buttons "Ajouter au calendrier" (visual only) and "Terminé". Show a success toast too.
Persist the booking (API if present, else in-memory) and show it in a "Mes réservations" list/drawer.
Ensure the scripted assistant's "Confirme ma réservation" action still completes this flow end-to-end.

### F. General polish (smaller)
- Loading skeletons for the restaurant list.
- Tasteful empty state when filters match nothing ("Aucun restaurant ne correspond — élargissez vos critères").
- Keep all transitions smooth; respect the brand.

## ACCEPTANCE — what I must SEE at localhost
1. A working filter/sort bar with a live result count.
2. Hovering a list card highlights its map pin; hovering a pin shows a mini-card popover.
3. Time-slot pills on each card; clicking one opens the booking on that slot.
4. A rich restaurant detail with photos, reviews, menu preview, and a booking widget.
5. A 3-step booking flow ending in a confirmation with "+150 points OKLA" and a toast; the booking
   appears in "Mes réservations".
6. Offer badges ("-20%") on some restaurants.
7. The assistant still drives the flow; everything is in French, green-led, and smooth; build compiles.

When done, give me a short summary of what changed and the exact command(s) to run it.