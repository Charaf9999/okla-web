// Serveur OKLA — Express (API REST) + WebSocket (suivi livraison temps réel).
// Démarre sur le port 3001. Données en mémoire (voir service.js).

import express from 'express'
import http from 'http'
import { WebSocketServer } from 'ws'
import {
  listRestaurants,
  getRestaurant,
  getSlots,
  createReservation,
  listReservations,
  makeCourierSimulator,
} from './service.js'

const PORT = 3001
const app = express()
app.use(express.json())

// CORS simple (utile si on appelle le serveur directement, hors proxy Vite).
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Methods', 'GET,POST,OPTIONS')
  res.header('Access-Control-Allow-Headers', 'Content-Type')
  if (req.method === 'OPTIONS') return res.sendStatus(204)
  next()
})

// --- Routes REST -----------------------------------------------------------
// GET /api/restaurants            -> liste (par défaut marketing ; ?list=tangier)
app.get('/api/restaurants', (req, res) => {
  res.json(listRestaurants(req.query.list))
})

// GET /api/restaurants/:id        -> un restaurant
app.get('/api/restaurants/:id', (req, res) => {
  const r = getRestaurant(req.params.id)
  if (!r) return res.status(404).json({ error: 'Restaurant introuvable' })
  res.json(r)
})

// GET /api/restaurants/:id/slots  -> créneaux disponibles
app.get('/api/restaurants/:id/slots', (req, res) => {
  const slots = getSlots(req.params.id)
  if (!slots) return res.status(404).json({ error: 'Restaurant introuvable' })
  res.json({ slots })
})

// POST /api/reservations          -> crée + renvoie la réservation
app.post('/api/reservations', (req, res) => {
  const { restaurantId, date, time, party } = req.body || {}
  const reservation = createReservation({ restaurantId, date, time, party })
  res.status(201).json(reservation)
})

// GET /api/reservations           -> réservations de la session
app.get('/api/reservations', (_req, res) => {
  res.json(listReservations())
})

app.get('/api/health', (_req, res) => res.json({ ok: true }))

// --- WebSocket : suivi livraison temps réel --------------------------------
const server = http.createServer(app)
const wss = new WebSocketServer({ server, path: '/ws' })

wss.on('connection', (ws) => {
  const sim = makeCourierSimulator({ totalSeconds: 24 })
  // Position immédiate puis toutes les ~800 ms.
  const send = () => {
    if (ws.readyState !== ws.OPEN) return
    ws.send(JSON.stringify({ type: 'courier', ...sim() }))
  }
  send()
  const interval = setInterval(send, 800)
  ws.on('close', () => clearInterval(interval))
  ws.on('error', () => clearInterval(interval))
})

server.listen(PORT, () => {
  console.log(`OKLA backend ▶ http://localhost:${PORT}`)
  console.log(`  REST : /api/restaurants  /api/reservations  /api/restaurants/:id/slots`)
  console.log(`  WS   : ws://localhost:${PORT}/ws  (suivi livraison)`)
})
