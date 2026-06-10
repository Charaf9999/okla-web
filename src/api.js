// Client API OKLA.
//
// Chaque appel tente le backend (proxy Vite -> http://localhost:3001) et
// RETOMBE automatiquement sur les données simulées de src/data.js si le serveur
// est injoignable. Le site reste donc 100 % fonctionnel, backend allumé ou non.

import { restaurants as mockRestaurants, tangier as mockTangier } from './data'

const TIMEOUT = 2500

// fetch avec délai d'expiration (pour ne jamais bloquer l'UI).
async function fetchJSON(url, options = {}) {
  const ctrl = new AbortController()
  const t = setTimeout(() => ctrl.abort(), TIMEOUT)
  try {
    const res = await fetch(url, { ...options, signal: ctrl.signal })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    return await res.json()
  } finally {
    clearTimeout(t)
  }
}

// Indicateur d'état de connexion partagé (lu par la pastille de statut).
let online = false
const listeners = new Set()
function setOnline(v) {
  if (online === v) return
  online = v
  listeners.forEach(fn => fn(online))
}
export function isOnline() { return online }
export function onStatusChange(fn) {
  listeners.add(fn)
  fn(online)
  return () => listeners.delete(fn)
}

// --- Restaurants -----------------------------------------------------------
export async function getRestaurants() {
  try {
    const data = await fetchJSON('/api/restaurants')
    setOnline(true)
    return { data, source: 'api' }
  } catch {
    setOnline(false)
    return { data: mockRestaurants, source: 'mock' }
  }
}

export async function getTangier() {
  try {
    const data = await fetchJSON('/api/restaurants?list=tangier')
    setOnline(true)
    return { data, source: 'api' }
  } catch {
    setOnline(false)
    return { data: mockTangier, source: 'mock' }
  }
}

// --- Réservations ----------------------------------------------------------
export async function getReservations() {
  try {
    const data = await fetchJSON('/api/reservations')
    setOnline(true)
    return { data, source: 'api' }
  } catch {
    setOnline(false)
    return { data: [], source: 'mock' }
  }
}

export async function createReservation(payload) {
  try {
    const data = await fetchJSON('/api/reservations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    setOnline(true)
    return { data, source: 'api' }
  } catch {
    // Repli : on fabrique une réservation locale pour que l'UI reste cohérente.
    setOnline(false)
    const data = {
      id: `local_${Date.now()}`,
      status: 'confirmée',
      restaurantName: payload.restaurantName || 'Restaurant',
      date: payload.date,
      time: payload.time,
      party: payload.party,
      createdAt: new Date().toISOString(),
    }
    return { data, source: 'mock' }
  }
}

// --- WebSocket suivi livraison --------------------------------------------
// Ouvre la connexion et appelle onMessage({ progress, etaMin }) à chaque trame.
// Retourne une fonction de fermeture. Si la connexion échoue, onStatus(false)
// est appelé et l'appelant garde son animation SMIL de secours.
export function connectCourier({ onMessage, onStatus } = {}) {
  let ws
  let closed = false
  try {
    const proto = location.protocol === 'https:' ? 'wss' : 'ws'
    ws = new WebSocket(`${proto}://${location.host}/ws`)
  } catch {
    onStatus?.(false)
    return () => {}
  }

  ws.onopen = () => { if (!closed) { setOnline(true); onStatus?.(true) } }
  ws.onmessage = (ev) => {
    try {
      const msg = JSON.parse(ev.data)
      if (msg.type === 'courier') onMessage?.(msg)
    } catch { /* ignore */ }
  }
  ws.onerror = () => { onStatus?.(false) }
  ws.onclose = () => { if (!closed) onStatus?.(false) }

  return () => { closed = true; try { ws.close() } catch { /* ignore */ } }
}
