// Couche "service" OKLA — logique métier isolée des routes HTTP.
//
// Tout est stocké EN MÉMOIRE (pas de base de données à installer pour la démo).
// La structure imite un dépôt (repository) : on pourrait remplacer les tableaux
// ci-dessous par des appels MongoDB/Mongoose (architecture MEAN) sans toucher aux
// routes — il suffirait de réimplémenter ces fonctions en async vers la base.

import { restaurants, tangier } from './data.js'

// "Collections" en mémoire (réinitialisées à chaque démarrage du serveur).
const db = {
  restaurants: [...restaurants],
  tangier: [...tangier],
  reservations: [], // rempli pendant la session
}

let reservationSeq = 1

// --- Restaurants -----------------------------------------------------------
export function listRestaurants(list = 'marketing') {
  return list === 'tangier' ? db.tangier : db.restaurants
}

export function getRestaurant(id) {
  return db.restaurants.find(r => r.id === id) || db.tangier.find(r => r.id === id) || null
}

export function getSlots(id) {
  const r = getRestaurant(id)
  if (!r) return null
  // Les restaurants de Tanger portent leurs créneaux ; sinon créneaux par défaut.
  return r.slots || ['19:00', '19:30', '20:00', '20:30', '21:00']
}

// --- Réservations ----------------------------------------------------------
export function createReservation({ restaurantId, date, time, party }) {
  const r = getRestaurant(restaurantId)
  const reservation = {
    id: `res_${reservationSeq++}`,
    status: 'confirmée',
    restaurantId: restaurantId || null,
    restaurantName: r ? r.name : 'Restaurant',
    date: date || 'Auj.',
    time: time || '20:00',
    party: party || 2,
    createdAt: new Date().toISOString(),
  }
  db.reservations.unshift(reservation) // plus récente en tête
  return reservation
}

export function listReservations() {
  return db.reservations
}

// --- Suivi livraison (simulateur GPS) -------------------------------------
// Renvoie une position { progress: 0..1, etaMin } qui avance puis reboucle.
// Le serveur appelle ceci en boucle et diffuse le résultat par WebSocket.
export function makeCourierSimulator({ totalSeconds = 24 } = {}) {
  const stepMs = 800
  const totalSteps = (totalSeconds * 1000) / stepMs
  let step = 0
  return function next() {
    const progress = (step % totalSteps) / totalSteps
    const etaMin = Math.max(1, Math.round((1 - progress) * totalSeconds * 0.5)) // ETA décroissant
    step++
    return { progress, etaMin }
  }
}
