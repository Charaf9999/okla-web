export const restaurants = [
  { name: 'Le Jardin Marrakech', cuisine: 'Marocaine · Traditionnelle', rating: 4.6, reviews: 128, time: '25–35 min', price: '€€', tag: 'Populaire', from: '#c9622f', to: '#8f4a2a', img: '/images/jardin-marrakech.jpg' },
  { name: 'Dar Tajine', cuisine: 'Marocaine · Cuisine du terroir', rating: 4.8, reviews: 212, time: '30–40 min', price: '€€', tag: 'Nouveau', from: '#b9682f', to: '#7d4a26', img: '/images/dar-tajine.jpg' },
  { name: 'Riad Saveurs', cuisine: 'Méditerranéenne', rating: 4.5, reviews: 96, time: '20–30 min', price: '€€€', tag: '', from: '#cf7b3a', to: '#955a2e', img: '/images/riad-saveurs.jpg' },
  { name: 'Atlas Grill', cuisine: 'Grillades · Internationale', rating: 4.7, reviews: 154, time: '25–35 min', price: '€€', tag: 'Top noté', from: '#c2632c', to: '#854524', img: '/images/atlas-grill.jpg' },
]

export const features = [
  { icon: 'Utensils', color: '#D96C3B', bg: 'rgba(217,108,59,.12)', title: 'Cuisine marocaine', desc: 'Le patrimoine culinaire local valorisé, aux côtés des cuisines internationales.' },
  { icon: 'MapPin', color: '#6F8F45', bg: 'rgba(111,143,69,.14)', title: 'Suivi temps réel', desc: 'La position de votre livreur en direct, sur une carte interactive.' },
  { icon: 'Bike', color: '#E0A22E', bg: 'rgba(242,184,75,.18)', title: 'Dispatching auto', desc: 'Le meilleur livreur assigné selon distance et disponibilité.' },
  { icon: 'Bot', color: '#3A2A1A', bg: 'rgba(58,42,26,.1)', title: 'Assistant IA', desc: 'Un chatbot qui recommande, réserve et répond, 24h/24.' },
]

export const steps = [
  { n: '01', title: 'Découvrez', desc: 'Parcourez les restaurants près de chez vous, filtrés par cuisine, prix et avis.' },
  { n: '02', title: 'Réservez ou commandez', desc: 'Réservez une table ou composez votre panier en quelques gestes.' },
  { n: '03', title: 'Suivez en direct', desc: 'Visualisez votre livreur sur la carte jusqu’à votre porte.' },
]

export const chatThread = [
  { from: 'bot', text: 'Bonjour ! Envie de quoi ce soir ?' },
  { from: 'user', text: 'Un bon tajine, pas trop loin.' },
  { from: 'bot', text: 'Parfait. Le Jardin Marrakech (4.6★) est à 1,2 km et ouvert. Je réserve une table ou je lance une commande ?' },
  { from: 'user', text: 'Commande, pour 2.' },
  { from: 'bot', text: 'C’est noté — tajine poulet & légumes ×2 ajoutés au panier. Livraison estimée 25 min.' },
]

// --- Réservation : restaurants de Tanger (coordonnées sur la carte stylisée 640x520) ---
// Repli hors-ligne : doit rester identique au tableau `tangier` de server/data.js.
export const tangier = [
  {
    id: 't1', name: 'Le Jardin Marrakech', cuisine: 'Marocaine · Traditionnelle', area: 'Médina',
    rating: 4.8, reviews: 212, price: '€€', priceLevel: 2, offer: '-20%', availableTonight: true,
    slots: ['19:30','20:00','20:30','21:00'], x: 300, y: 255, from: '#c9622f', to: '#8f4a2a',
    img: '/images/jardin-marrakech.jpg',
    photos: ['/images/jardin-marrakech.jpg'],
    description: 'Un patio verdoyant au cœur de la Médina, où les tajines mijotent selon les recettes de la grand-mère. Ambiance feutrée et thé à la menthe à volonté.',
    tags: ['Terrasse', 'Romantique', 'Cuisine locale'],
    menu: [['Tajine d’agneau aux pruneaux', '90 DH'], ['Pastilla au poulet', '75 DH'], ['Couscous royal', '110 DH'], ['Thé à la menthe', '25 DH']],
    reviewList: [
      { name: 'Yasmine B.', rating: 5, text: 'Cadre magnifique et tajine d’agneau fondant. On se croirait à Marrakech.', date: 'il y a 2 j' },
      { name: 'Omar T.', rating: 4, text: 'Service attentionné, un peu d’attente mais ça valait le coup.', date: 'il y a 1 sem.' },
      { name: 'Claire D.', rating: 5, text: 'La pastilla était divine, adresse à retenir.', date: 'il y a 3 sem.' },
    ],
  },
  {
    id: 't2', name: 'Dar Tajine', cuisine: 'Marocaine · Terroir', area: 'Marshan',
    rating: 4.6, reviews: 128, price: '€€', priceLevel: 2, offer: null, availableTonight: false,
    slots: ['19:00','20:00','21:30'], x: 150, y: 235, from: '#b9682f', to: '#7d4a26',
    img: '/images/dar-tajine.jpg',
    photos: ['/images/dar-tajine.jpg'],
    description: 'Maison de famille perchée à Marshan, spécialiste des tajines du terroir cuits au feu de bois. Vue dégagée et accueil chaleureux.',
    tags: ['Vue mer', 'Familial', 'Authentique'],
    menu: [['Tajine kefta aux œufs', '70 DH'], ['Tajine poulet citron confit', '80 DH'], ['Harira maison', '30 DH'], ['Cornes de gazelle', '35 DH']],
    reviewList: [
      { name: 'Hicham A.', rating: 5, text: 'Le meilleur tajine kefta de Tanger, sans hésiter.', date: 'il y a 4 j' },
      { name: 'Sofia L.', rating: 4, text: 'Portions généreuses et prix tout doux.', date: 'il y a 2 sem.' },
    ],
  },
  {
    id: 't3', name: 'Saveur de Poisson', cuisine: 'Poisson · Méditerranéenne', area: 'Médina · Port',
    rating: 4.7, reviews: 340, price: '€€', priceLevel: 2, offer: '-30%', availableTonight: true,
    slots: ['19:30','20:30','21:00'], x: 372, y: 200, from: '#3f7d86', to: '#2d5a61',
    img: '/images/saveur-poisson.jpg',
    photos: ['/images/saveur-poisson.jpg'],
    description: 'Institution du port : un menu unique de poissons frais du jour servi en cinq services. Décor de bois flotté et jus de fruits maison.',
    tags: ['Poisson frais', 'Menu unique', 'Convivial'],
    menu: [['Soupe de poisson', '40 DH'], ['Bar grillé du jour', '120 DH'], ['Brochettes de crevettes', '95 DH'], ['Salade de fruits', '30 DH']],
    reviewList: [
      { name: 'Mehdi R.', rating: 5, text: 'Expérience inoubliable, tout est frais et copieux.', date: 'il y a 1 j' },
      { name: 'Anaïs P.', rating: 5, text: 'Le bar grillé était parfait. On reviendra !', date: 'il y a 5 j' },
      { name: 'Karim S.', rating: 4, text: 'Cadre simple mais cuisine excellente.', date: 'il y a 2 sem.' },
    ],
  },
  {
    id: 't4', name: 'El Morocco Club', cuisine: 'Internationale · Lounge', area: 'Kasbah',
    rating: 4.5, reviews: 96, price: '€€€', priceLevel: 3, offer: null, availableTonight: true,
    slots: ['20:00','20:30','21:30','22:00'], x: 252, y: 182, from: '#6f5a3a', to: '#4a3b25',
    img: '/images/el-morocco.jpg',
    photos: ['/images/el-morocco.jpg'],
    description: 'Élégant lounge de la Kasbah mêlant cuisine internationale et piano-bar. Cocktails signature et terrasse sous les bougainvilliers.',
    tags: ['Lounge', 'Chic', 'Cocktails'],
    menu: [['Tartare de thon', '130 DH'], ['Risotto aux gambas', '150 DH'], ['Filet de bœuf', '180 DH'], ['Cheesecake', '60 DH']],
    reviewList: [
      { name: 'Leïla M.', rating: 5, text: 'Ambiance raffinée, idéal pour une soirée spéciale.', date: 'il y a 3 j' },
      { name: 'Thomas V.', rating: 4, text: 'Cocktails superbes, cuisine soignée.', date: 'il y a 1 sem.' },
    ],
  },
  {
    id: 't5', name: 'Riad Saveurs', cuisine: 'Méditerranéenne', area: 'Centre-ville',
    rating: 4.5, reviews: 110, price: '€€', priceLevel: 2, offer: '-20%', availableTonight: true,
    slots: ['12:30','13:00','19:30','20:00'], x: 340, y: 345, from: '#cf7b3a', to: '#955a2e',
    img: '/images/riad-saveurs.jpg',
    photos: ['/images/riad-saveurs.jpg'],
    description: 'Riad lumineux au centre-ville proposant une carte méditerranéenne fraîche et colorée. Parfait pour un déjeuner ensoleillé.',
    tags: ['Terrasse', 'Healthy', 'Déjeuner'],
    menu: [['Mezze méditerranéen', '65 DH'], ['Linguine aux fruits de mer', '105 DH'], ['Salade César', '55 DH'], ['Tiramisu', '45 DH']],
    reviewList: [
      { name: 'Nadia E.', rating: 4, text: 'Salades créatives et personnel adorable.', date: 'il y a 6 j' },
      { name: 'Paul G.', rating: 5, text: 'Le menu du midi est une excellente affaire.', date: 'il y a 2 sem.' },
    ],
  },
  {
    id: 't6', name: 'Atlas Grill', cuisine: 'Grillades · Internationale', area: 'Malabata',
    rating: 4.7, reviews: 154, price: '€€', priceLevel: 2, offer: null, availableTonight: false,
    slots: ['19:00','19:30','20:30'], x: 492, y: 258, from: '#7a8a3e', to: '#566127',
    img: '/images/atlas-grill.jpg',
    photos: ['/images/atlas-grill.jpg'],
    description: 'Grillades généreuses face à la baie de Malabata : viandes maturées, brochettes et poissons au charbon de bois.',
    tags: ['Grillades', 'Vue mer', 'Familial'],
    menu: [['Brochettes mixtes', '90 DH'], ['Côte de bœuf (400g)', '170 DH'], ['Poulet grillé fermier', '85 DH'], ['Crème caramel', '35 DH']],
    reviewList: [
      { name: 'Rachid B.', rating: 5, text: 'Viande tendre et bien assaisonnée, top.', date: 'il y a 2 j' },
      { name: 'Inès F.', rating: 4, text: 'Cadre agréable au bord de l’eau.', date: 'il y a 10 j' },
    ],
  },
]

// Assistant scénarisé pour la démo (questions pré-écrites + réponses + actions)
export const reservationScript = [
  { q: 'Recommande-moi un restaurant marocain', a: 'Je vous conseille Le Jardin Marrakech (4.8★), dans la Médina — cuisine marocaine traditionnelle. Je l’affiche sur la carte.', action: { type: 'select', id: 't1' } },
  { q: 'Une table pour 2 ce soir à 20h ?', a: 'Oui — Le Jardin Marrakech a de la disponibilité ce soir à 20:00 pour 2 personnes. J’ai pré-rempli votre réservation.', action: { type: 'prefill', time: '20:00', party: 2 } },
  { q: 'Des adresses près de la Kasbah ?', a: 'Près de la Kasbah : El Morocco Club (lounge, 4.5★) et Saveur de Poisson (poisson, 4.7★). Les deux sont mis en avant sur la carte.', action: { type: 'highlight', ids: ['t4','t3'] } },
  { q: 'Confirme ma réservation', a: 'C’est confirmé ✓ — votre table est réservée. Vous recevrez un rappel avant l’heure. Bon appétit !', action: { type: 'confirm' } },
]
