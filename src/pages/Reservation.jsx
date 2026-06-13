import { useState, useEffect, useMemo, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MapPin, Star, Clock, Users, CalendarCheck, Check, X, Minus, Plus, Search, CalendarRange, Tag, Award, Flame } from 'lucide-react'
import { getTangier, createReservation, getReservations } from '../api'
import Dish, { cuisineEmoji } from '../components/Dish'
import Skeleton from '../components/Skeleton'
import StatusPill from '../components/StatusPill'
import RestaurantDetail from '../components/reservation/RestaurantDetail'
import BookingFlow from '../components/reservation/BookingFlow'
import Assistant from '../components/reservation/Assistant'
import PickYourPlate, { matchesPlate } from '../components/reservation/PickYourPlate'

const DATES = ['Auj.', 'Dem.', 'Ven.', 'Sam.', 'Dim.']
const OLIVE = '#6F8F45', OLIVE_D = '#5E7A39', TER = '#D96C3B', CACAO = '#3A2A1A', SEA = '#A9C7CC', SAFFRON = '#F2B84B'
const SORTS = ['Recommandés', 'Note', 'Prix']

// Famille de cuisine = premier mot avant « · ».
const family = (c) => c.split('·')[0].trim()

/* ---------------- Stylised Tangier map ---------------- */
function TangierMap({ restaurants, selectedId, highlight, hoveredId, onSelect, onHover, onOpen, onReserve }) {
  const mini = restaurants.find(r => r.id === hoveredId)
  return (
    <div className="relative w-full h-full overflow-hidden rounded-2xl" style={{ background: '#EFE6D6', border: '1px solid rgba(58,42,26,.08)' }}>
      <svg viewBox="0 0 640 520" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 w-full h-full">
        <defs>
          <linearGradient id="okla-sea" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#7FAEB6" />
            <stop offset="100%" stopColor={SEA} />
          </linearGradient>
          <radialGradient id="okla-sun" cx="78%" cy="6%" r="46%">
            <stop offset="0%" stopColor="rgba(242,184,75,.30)" />
            <stop offset="100%" stopColor="rgba(242,184,75,0)" />
          </radialGradient>
          <filter id="okla-pinshadow" x="-60%" y="-60%" width="220%" height="220%">
            <feDropShadow dx="0" dy="3" stdDeviation="2.5" floodColor="#3A2A1A" floodOpacity=".35" />
          </filter>
        </defs>
        {/* sea */}
        <path d="M0 0 H640 V118 C560 150 520 104 440 150 C360 192 300 138 220 172 C150 202 90 156 0 182 Z" fill="url(#okla-sea)" />
        <rect x="0" y="0" width="640" height="240" fill="url(#okla-sun)" />
        {/* beach strip along the coastline */}
        <path d="M0 182 C90 156 150 202 220 172 C300 138 360 192 440 150 C520 104 560 150 640 118" fill="none" stroke="#F0E3C8" strokeWidth="7" opacity=".9" />
        <path d="M0 182 C90 156 150 202 220 172 C300 138 360 192 440 150 C520 104 560 150 640 118" fill="none" stroke="#8FB3B9" strokeWidth="1.5" opacity=".5" />
        {/* gentle waves */}
        {[44, 74, 104].map((y, i) => (
          <path key={i} d={`M${36 + i * 34} ${y} q 16 -7 32 0 t 32 0 t 32 0`} fill="none" stroke="#ffffff" strokeWidth="2" opacity=".35">
            <animate attributeName="opacity" values=".2;.45;.2" dur={`${3 + i}s`} repeatCount="indefinite" />
          </path>
        ))}
        {/* ferry crossing the bay (SMIL animateMotion + mpath) */}
        <path id="okla-ferry-path" d="M600 52 C 470 96 330 70 220 116 C 330 80 470 110 600 52" fill="none" />
        <g opacity=".9">
          <g>
            <path d="M-11 0 L11 0 L7 6 L-7 6 Z" fill="#fff" />
            <rect x="-5" y="-6" width="10" height="6" rx="1.5" fill="#D96C3B" />
            <path d="M-16 7 q 8 -4 16 0 t 16 0" fill="none" stroke="#fff" strokeWidth="1.5" opacity=".55" />
            <animateMotion dur="26s" repeatCount="indefinite" rotate="auto">
              <mpath href="#okla-ferry-path" />
            </animateMotion>
          </g>
        </g>
        {/* port */}
        <rect x="352" y="150" width="46" height="20" rx="3" fill="#cfc2ac" />
        <line x1="362" y1="150" x2="362" y2="132" stroke="#b9a98e" strokeWidth="3" />
        <line x1="378" y1="150" x2="378" y2="130" stroke="#b9a98e" strokeWidth="3" />
        {/* phare (Cap Malabata) */}
        <g transform="translate(596,128)">
          <rect x="-3.5" y="-18" width="7" height="18" fill="#fff" stroke="#C9BBA2" strokeWidth="1" />
          <rect x="-3.5" y="-12" width="7" height="4" fill="#C94C3D" />
          <circle cx="0" cy="-20" r="3" fill="#F2B84B">
            <animate attributeName="opacity" values="1;.25;1" dur="2.4s" repeatCount="indefinite" />
          </circle>
        </g>
        {/* parcs et collines */}
        <ellipse cx="96" cy="318" rx="62" ry="34" fill="rgba(111,143,69,.16)" />
        <ellipse cx="118" cy="306" rx="34" ry="18" fill="rgba(111,143,69,.14)" />
        <ellipse cx="540" cy="400" rx="74" ry="40" fill="rgba(111,143,69,.13)" />
        <ellipse cx="252" cy="430" rx="50" ry="26" fill="rgba(111,143,69,.10)" />
        {/* arbres ponctuels */}
        {[[70, 308], [104, 330], [136, 300], [520, 392], [556, 412], [262, 426]].map(([x, y], i) => (
          <g key={i} transform={`translate(${x},${y})`}>
            <circle r="4.5" fill="#88A45C" /><rect x="-1" y="3" width="2" height="5" fill="#9C8B79" />
          </g>
        ))}
        {/* trame bâtie de la Médina */}
        {[[298, 218], [312, 226], [326, 214], [340, 224], [306, 240], [322, 244], [336, 238], [292, 232]].map(([x, y], i) => (
          <rect key={i} x={x} y={y} width="11" height="8" rx="1.5" fill="#fff" stroke="#E0D4BE" strokeWidth="1" />
        ))}
        {/* roads */}
        {[['M120 230 C 220 250 340 300 360 360','9'],['M150 235 C 250 210 330 210 492 258','7'],['M340 345 C 300 280 280 230 252 182','6'],['M360 360 C 420 330 460 295 492 258','6']].map(([d, w], i) => (
          <path key={i} d={d} fill="none" stroke="#E0D4BE" strokeWidth={w} strokeLinecap="round" />
        ))}
        {[['M120 230 C 220 250 340 300 360 360'],['M150 235 C 250 210 330 210 492 258']].map(([d], i) => (
          <path key={i} d={d} fill="none" stroke="#fff" strokeWidth="1.4" strokeDasharray="7 8" opacity=".7" />
        ))}
        {/* district labels */}
        {[['Marshan', 110, 195], ['Kasbah', 250, 150], ['Médina', 340, 268], ['Centre-ville', 345, 405], ['Malabata', 505, 305], ['Iberia', 165, 328]].map(([t, x, y]) => (
          <text key={t} x={x} y={y} fontFamily="Poppins, sans-serif" fontSize="13" fontWeight="600" fill="#9C8B79" textAnchor="middle" style={{ letterSpacing: 1.5, textTransform: 'uppercase' }} opacity=".85">{t}</text>
        ))}
        <text x="470" y="70" fontFamily="Poppins, sans-serif" fontSize="13" fontWeight="600" fill="#5d8d95" textAnchor="middle" style={{ letterSpacing: 2 }}>BAIE DE TANGER</text>
        {/* rose des vents */}
        <g transform="translate(38,470)" opacity=".75">
          <circle r="15" fill="#fff" stroke="#D8CCB6" strokeWidth="1.5" />
          <path d="M0 -10 L3.5 3 L0 0.5 L-3.5 3 Z" fill={OLIVE_D} />
          <text y="-19" fontFamily="Poppins, sans-serif" fontSize="9" fontWeight="700" fill="#9C8B79" textAnchor="middle">N</text>
        </g>

        {/* pins */}
        {restaurants.map(r => {
          const sel = r.id === selectedId
          const hov = r.id === hoveredId
          const hl = highlight.includes(r.id)
          const active = sel || hov
          const color = sel ? TER : (hov ? OLIVE_D : OLIVE)
          const scale = active ? 'scale(1.3)' : 'scale(1)'
          return (
            <g key={r.id} transform={`translate(${r.x},${r.y})`} style={{ cursor: 'pointer' }}
              onClick={() => onOpen ? onOpen(r.id) : onSelect(r.id)}
              onMouseEnter={() => onHover?.(r.id)} onMouseLeave={() => onHover?.(null)}>
              {(active || hl) && <circle cx="0" cy="-14" r={active ? 22 : 18} fill={sel ? TER : (hov ? OLIVE : SAFFRON)} opacity=".22">
                <animate attributeName="r" values={`${active ? 18 : 15};${active ? 24 : 20};${active ? 18 : 15}`} dur="1.8s" repeatCount="indefinite" />
              </circle>}
              <g filter="url(#okla-pinshadow)">
                <path d="M0 0 C-9 -10 -14 -16 -14 -24 a14 14 0 0 1 28 0 c0 8 -5 14 -14 24 Z" fill={color} stroke="#fff" strokeWidth="2" transform={scale} style={{ transition: 'transform .18s' }} />
                <circle cx="0" cy="-24" r="5" fill="#fff" transform={scale} style={{ transition: 'transform .18s' }} />
              </g>
              {/* nom du restaurant sous le pin (halo blanc pour la lisibilité) */}
              <text x="0" y="16" fontFamily="Poppins, sans-serif" fontSize="10.5" fontWeight={active ? 700 : 600}
                fill={active ? CACAO : '#6A5746'} textAnchor="middle"
                style={{ paintOrder: 'stroke', stroke: '#FFFDF6', strokeWidth: 3.5, strokeLinejoin: 'round' }}>
                {r.name}
              </text>
              {/* badge offre sur le pin (largeur adaptée au texte) */}
              {r.offer && (() => {
                const bw = Math.max(34, 12 + r.offer.length * 6.4)
                return (
                  <g transform={`translate(12,-34) ${active ? 'scale(1.05)' : ''}`}>
                    <rect x="0" y="0" width={bw} height="17" rx="8.5" fill={TER} />
                    <text x={bw / 2} y="12" fontFamily="Poppins, sans-serif" fontSize="10" fontWeight="700" fill="#fff" textAnchor="middle">{r.offer}</text>
                  </g>
                )
              })()}
            </g>
          )
        })}

        {/* mini-carte au survol d'un pin */}
        {mini && (
          <foreignObject x={Math.min(Math.max(mini.x - 95, 6), 640 - 196)} y={Math.max(mini.y - 150, 6)} width="190" height="138">
            <div xmlns="http://www.w3.org/1999/xhtml" style={{ background: '#fff', borderRadius: 14, overflow: 'hidden', boxShadow: '0 16px 36px -12px rgba(58,42,26,.5)', border: '1px solid rgba(58,42,26,.08)', fontFamily: 'Inter, sans-serif' }}>
              <div style={{ position: 'relative', height: 56, background: `radial-gradient(circle at 30% 35%, rgba(242,184,75,.5), transparent 55%), linear-gradient(135deg,${mini.from},${mini.to})` }}>
                <span style={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center', fontSize: 22 }}>{cuisineEmoji(mini.cuisine)}</span>
                {mini.img && <img src={mini.img} alt="" onError={e => { e.currentTarget.style.display = 'none' }} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />}
                {mini.offer && <span style={{ position: 'absolute', top: 6, left: 6, background: TER, color: '#fff', fontSize: 9.5, fontWeight: 700, padding: '2px 6px', borderRadius: 6 }}>{mini.offer}</span>}
              </div>
              <div style={{ padding: '7px 9px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 4 }}>
                  <span className="font-head" style={{ fontWeight: 700, fontSize: 12, color: CACAO, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{mini.name}</span>
                  <span style={{ fontSize: 11, fontWeight: 700, color: CACAO, whiteSpace: 'nowrap' }}>★ {mini.rating}</span>
                </div>
                <div style={{ fontSize: 10, color: '#8B7A68', margin: '1px 0 6px' }}>{mini.price} · {mini.area}</div>
                <div style={{ display: 'flex', gap: 5, alignItems: 'center' }}>
                  <button onClick={() => onReserve?.(mini.id, mini.slots[0])} className="font-head"
                    style={{ flex: 1, background: OLIVE, color: '#fff', border: 'none', borderRadius: 8, padding: '6px 0', fontSize: 11, fontWeight: 600, cursor: 'pointer' }}>
                    Réserver · {mini.slots[0]}
                  </button>
                </div>
              </div>
            </div>
          </foreignObject>
        )}
      </svg>
      <div className="absolute top-3 left-3 font-head font-semibold rounded-full px-3 py-1.5 bg-white/90 backdrop-blur" style={{ fontSize: 12, color: CACAO, boxShadow: '0 4px 14px -6px rgba(58,42,26,.4)' }}>
        <MapPin size={12} className="inline -mt-0.5 mr-1" color={OLIVE} /> Tanger · {restaurants.length} restaurants
      </div>
    </div>
  )
}

/* ---------------- Compteur animé (points OKLA) ---------------- */
function CountUp({ value }) {
  const [shown, setShown] = useState(value)
  useEffect(() => {
    if (shown === value) return
    const from = shown, diff = value - from, t0 = performance.now(), dur = 900
    let raf
    const tick = (t) => {
      const p = Math.min(1, (t - t0) / dur)
      const eased = 1 - Math.pow(1 - p, 3)
      setShown(Math.round(from + diff * eased))
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value])
  return <span>{shown.toLocaleString('fr-FR')}</span>
}

/* ---------------- Page ---------------- */
export default function Reservation() {
  const [list, setList] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedId, setSelectedId] = useState('t1')
  const [hoveredId, setHoveredId] = useState(null)
  const [highlight, setHighlight] = useState([])
  const [dateIdx, setDateIdx] = useState(0)
  const [time, setTime] = useState(null)
  const [party, setParty] = useState(2)
  const [detailId, setDetailId] = useState(null)   // fiche détaillée ouverte
  const [booking, setBooking] = useState(null)      // tunnel de réservation { restaurant, dateIdx, party, time, autoConfirm }
  const [query, setQuery] = useState('')
  const [cuisine, setCuisine] = useState('Toutes')
  const [prices, setPrices] = useState([])      // niveaux de prix sélectionnés (1,2,3)
  const [minRating, setMinRating] = useState(0) // note minimale
  const [offersOnly, setOffersOnly] = useState(false)
  const [tonightOnly, setTonightOnly] = useState(false)
  const [sortBy, setSortBy] = useState('Recommandés')
  const [area, setArea] = useState('Tous')           // filtre quartier
  const [tagsSel, setTagsSel] = useState([])         // filtre ambiance (tags)
  const [plate, setPlate] = useState(null)           // catégorie « À chacun son plat »
  const resultsRef = useRef(null)
  const [points, setPoints] = useState(450)          // points OKLA (fidélité, mock)
  const [pointsFlash, setPointsFlash] = useState(false)
  const [toast, setToast] = useState(null)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [reservations, setReservations] = useState([])

  // Charge la liste de Tanger depuis le backend (repli sur les données mock).
  useEffect(() => {
    let alive = true
    getTangier().then(({ data }) => {
      if (!alive) return
      setList(data)
      setLoading(false)
    })
    return () => { alive = false }
  }, [])

  // Familles de cuisine (premier mot avant « · ») pour le filtre.
  const cuisines = useMemo(() => ['Toutes', ...Array.from(new Set(list.map(r => family(r.cuisine))))], [list])
  // Quartiers (premier segment de `area`) et tags d'ambiance disponibles.
  const areas = useMemo(() => ['Tous', ...Array.from(new Set(list.map(r => r.area.split('·')[0].trim())))], [list])
  // Tous les tags d'ambiance présents dans les données (chacun couvre ≥ 2 restaurants).
  const allTags = useMemo(() => Array.from(new Set(list.flatMap(r => r.tags || []))), [list])
  const toggleTag = (t) => setTagsSel(ts => ts.includes(t) ? ts.filter(x => x !== t) : [...ts, t])
  // Restaurants en promotion (bandeau « Offres du moment »).
  const offers = useMemo(() => list.filter(r => r.offer), [list])

  // Liste filtrée + triée (recherche, cuisine, prix, note, offres, dispo, quartier, ambiance, tri).
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    let r = list.filter(x => {
      const okCuisine = cuisine === 'Toutes' || family(x.cuisine) === cuisine
      const okPrice = prices.length === 0 || prices.includes(x.priceLevel)
      const okRating = x.rating >= minRating
      const okOffer = !offersOnly || !!x.offer
      const okTonight = !tonightOnly || x.availableTonight
      const okArea = area === 'Tous' || x.area.split('·')[0].trim() === area
      const okTags = tagsSel.length === 0 || tagsSel.every(t => (x.tags || []).includes(t))
      const okPlate = !plate || matchesPlate(x, plate)
      const okQ = !q || x.name.toLowerCase().includes(q) || x.cuisine.toLowerCase().includes(q)
        || x.area.toLowerCase().includes(q) || (x.tags || []).some(t => t.toLowerCase().includes(q))
      return okCuisine && okPrice && okRating && okOffer && okTonight && okArea && okTags && okPlate && okQ
    })
    if (sortBy === 'Note') r = [...r].sort((a, b) => b.rating - a.rating)
    else if (sortBy === 'Prix') r = [...r].sort((a, b) => a.priceLevel - b.priceLevel)
    else r = [...r].sort((a, b) => (b.offer ? 1 : 0) - (a.offer ? 1 : 0) || b.rating - a.rating) // Recommandés
    return r
  }, [list, query, cuisine, prices, minRating, offersOnly, tonightOnly, area, tagsSel, plate, sortBy])

  const resetFilters = () => { setQuery(''); setCuisine('Toutes'); setPrices([]); setMinRating(0); setOffersOnly(false); setTonightOnly(false); setArea('Tous'); setTagsSel([]); setPlate(null) }
  const hasFilters = cuisine !== 'Toutes' || prices.length || minRating || offersOnly || tonightOnly || query || area !== 'Tous' || tagsSel.length || plate

  // Sélection d'une catégorie « À chacun son plat » : re-clic = désactivation.
  const choosePlate = (id) => {
    const next = plate === id ? null : id
    setPlate(next)
    if (next) requestAnimationFrame(() => resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }))
  }

  const togglePrice = (lvl) => setPrices(p => p.includes(lvl) ? p.filter(x => x !== lvl) : [...p, lvl])

  const select = (id) => { setSelectedId(id); setTime(null); setHighlight([]) }

  // Ouvre la fiche détaillée riche (modale).
  const openDetail = (id) => { setSelectedId(id); setHighlight([]); setDetailId(id) }

  // Démarre le tunnel de réservation (3 étapes) sur un créneau préselectionné.
  const startBooking = (id, slot) => {
    const cur = list.find(r => r.id === id)
    if (!cur) return
    setSelectedId(id); setHighlight([]); setDetailId(null)
    setBooking({ restaurant: cur, dateIdx, party, time: slot || null, autoConfirm: false })
  }

  const loadReservations = useCallback(() => {
    getReservations().then(({ data }) => setReservations(data))
  }, [])

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(null), 3000) }

  // Persiste une réservation (API + repli), met à jour « Mes réservations »
  // et crédite +150 points OKLA (fidélité, façon Yums de TheFork).
  const persistReservation = useCallback(async (payload) => {
    const res = await createReservation(payload)
    setReservations(prev => [res.data, ...prev.filter(r => r.id !== res.data.id)])
    setPoints(p => p + 150)
    setPointsFlash(true); setTimeout(() => setPointsFlash(false), 1600)
    return res
  }, [])

  const onAction = (a) => {
    if (!a) return
    if (a.type === 'select') select(a.id)
    if (a.type === 'highlight') { setHighlight(a.ids) }
    if (a.type === 'prefill') { setSelectedId(a.id || 't1'); setTime(a.time); setParty(a.party); setHighlight([]) }
    // L'assistant active le filtre Offres et met les adresses en avant.
    if (a.type === 'offers') { setOffersOnly(true); setHighlight(a.ids || []) }
    // L'assistant active un tag d'ambiance (ex. « Vue mer ») et surligne les pins.
    if (a.type === 'tag') { setTagsSel([a.tag]); setHighlight(a.ids || []) }
    // Petit budget : tri par prix + mise en avant des adresses abordables.
    if (a.type === 'budget') { setSortBy('Prix'); setHighlight(a.ids || []) }
    // Ouvre la fiche détaillée d'un restaurant.
    if (a.type === 'detail') openDetail(a.id || selectedId)
    // Ouvre le tiroir « Mes réservations ».
    if (a.type === 'drawer') openDrawer()
    // L'assistant confirme de bout en bout : ouvre le tunnel en auto-confirmation.
    if (a.type === 'confirm') {
      const cur = list.find(r => r.id === selectedId) || list[0]
      if (cur) setBooking({ restaurant: cur, dateIdx, party, time: time || cur.slots?.[0], autoConfirm: true })
    }
  }

  const openDrawer = () => { setDrawerOpen(true); loadReservations() }

  return (
    <main className="min-h-screen pt-24 pb-16 px-5 sm:px-10 lg:px-16">
      <div className="max-w-[1240px] mx-auto">
        <div className="mb-6 flex items-start justify-between gap-4 flex-wrap">
          <div>
            <div className="inline-flex items-center gap-2 font-head font-semibold rounded-full px-3.5 py-1.5 mb-3"
              style={{ fontSize: 12, letterSpacing: 2, color: OLIVE_D, background: 'rgba(111,143,69,.14)' }}>
              <CalendarCheck size={14} /> RÉSERVATION
            </div>
            <h1 className="font-head font-extrabold text-cacao" style={{ fontSize: 'clamp(30px,4vw,46px)', letterSpacing: '-1px' }}>
              {'Réservez une table à'.split(' ').map((w, i) => (
                <motion.span key={i} initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: .08 * i, duration: .5, ease: [0.21, 0.8, 0.32, 1] }}
                  style={{ display: 'inline-block', marginRight: '0.28em' }}>{w}</motion.span>
              ))}
              <motion.span initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: .4, duration: .5, ease: [0.21, 0.8, 0.32, 1] }}
                style={{ display: 'inline-block', position: 'relative' }}>
                Tanger
                <motion.svg viewBox="0 0 140 14" style={{ position: 'absolute', left: 0, bottom: -8, width: '100%', height: 14 }} aria-hidden="true">
                  <motion.path d="M4 9 C 36 3 76 11 136 5" fill="none" stroke="#F2B84B" strokeWidth="5" strokeLinecap="round"
                    initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: .75, duration: .55, ease: 'easeOut' }} />
                </motion.svg>
              </motion.span>
            </h1>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: .7, duration: .6 }}
              className="text-muted mt-3" style={{ fontSize: 15 }}>
              Choisissez un restaurant sur la carte, sélectionnez votre créneau, c’est réservé.
            </motion.p>
          </div>
          <div className="flex items-center gap-3">
            <StatusPill />
            {/* points OKLA (fidélité) */}
            <motion.div animate={pointsFlash ? { scale: [1, 1.18, 1] } : {}} transition={{ duration: .5 }}
              className="relative inline-flex items-center gap-2 font-head font-bold rounded-xl px-4 py-2.5"
              style={{ fontSize: 13.5, color: '#9C6B12', background: 'rgba(242,184,75,.2)', border: '1px solid rgba(242,184,75,.45)' }}>
              <Award size={16} color="#C98A1B" />
              <CountUp value={points} /> pts
              <AnimatePresence>
                {pointsFlash && (
                  <motion.span initial={{ opacity: 0, y: 0 }} animate={{ opacity: 1, y: -26 }} exit={{ opacity: 0 }}
                    transition={{ duration: .9 }} className="absolute left-1/2 -translate-x-1/2 font-head font-bold"
                    style={{ top: -4, fontSize: 13, color: '#C98A1B', whiteSpace: 'nowrap' }}>
                    +150
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.div>
            <button onClick={openDrawer} className="inline-flex items-center gap-2 font-head font-semibold rounded-xl px-4 py-2.5 text-white transition-all hover:-translate-y-0.5"
              style={{ fontSize: 13.5, background: OLIVE, boxShadow: '0 12px 26px -12px rgba(111,143,69,.7)' }}>
              <CalendarRange size={16} /> Mes réservations{reservations.length ? ` (${reservations.length})` : ''}
            </button>
          </div>
        </div>

        {/* « À chacun son plat » — filtres par plat emblématique */}
        <PickYourPlate active={plate} onPick={choosePlate} />

        {/* filter bar */}
        <div className="flex flex-wrap items-center gap-3 mb-6 p-3 bg-card rounded-2xl" style={{ border: '1px solid rgba(58,42,26,.08)' }}>
          <span className="font-head font-semibold text-muted px-2" style={{ fontSize: 12.5 }}>Date</span>
          {DATES.map((d, i) => (
            <button key={d} onClick={() => setDateIdx(i)} className="font-head rounded-xl px-3.5 py-2 transition-colors"
              style={{ fontSize: 13, fontWeight: 600, background: dateIdx === i ? OLIVE : '#fff', color: dateIdx === i ? '#fff' : '#6A5746', border: dateIdx === i ? 'none' : '1px solid rgba(58,42,26,.1)' }}>{d}</button>
          ))}
          <div className="flex items-center gap-2 ml-auto bg-white rounded-xl px-3 py-1.5" style={{ border: '1px solid rgba(58,42,26,.1)' }}>
            <Users size={15} color={OLIVE} />
            <button onClick={() => setParty(p => Math.max(1, p - 1))} className="grid place-items-center rounded-md" style={{ width: 24, height: 24, background: 'rgba(111,143,69,.12)' }}><Minus size={13} color={OLIVE_D} /></button>
            <span className="font-head font-semibold text-cacao" style={{ fontSize: 13, minWidth: 64, textAlign: 'center' }}>{party} pers.</span>
            <button onClick={() => setParty(p => Math.min(8, p + 1))} className="grid place-items-center rounded-md" style={{ width: 24, height: 24, background: 'rgba(111,143,69,.12)' }}><Plus size={13} color={OLIVE_D} /></button>
          </div>
        </div>

        {/* barre de filtres + tri (style TheFork) */}
        <div className="bg-card rounded-2xl p-3 mb-3" style={{ border: '1px solid rgba(58,42,26,.08)' }}>
          <div className="flex flex-wrap items-center gap-3">
            {/* recherche */}
            <div className="flex items-center gap-2 bg-white rounded-xl px-3.5 py-2.5" style={{ border: '1px solid rgba(58,42,26,.1)', minWidth: 220, flex: '1 1 220px' }}>
              <Search size={16} color="#9C8B79" />
              <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Rechercher un restaurant, une cuisine, un tag…"
                className="bg-transparent outline-none flex-1 text-cacao" style={{ fontSize: 13.5 }} />
            </div>
            {/* cuisine */}
            <select value={cuisine} onChange={e => setCuisine(e.target.value)} className="font-head rounded-xl px-3 py-2.5 bg-white text-cacao outline-none"
              style={{ fontSize: 13, fontWeight: 600, border: '1px solid rgba(58,42,26,.1)' }}>
              {cuisines.map(c => <option key={c} value={c}>{c === 'Toutes' ? 'Toutes cuisines' : c}</option>)}
            </select>
            {/* prix */}
            <div className="flex items-center gap-1 bg-white rounded-xl px-1.5 py-1.5" style={{ border: '1px solid rgba(58,42,26,.1)' }}>
              {[1, 2, 3].map(lvl => (
                <button key={lvl} onClick={() => togglePrice(lvl)} className="font-head rounded-lg px-2.5 py-1.5 transition-colors"
                  style={{ fontSize: 12.5, fontWeight: 700, background: prices.includes(lvl) ? OLIVE : 'transparent', color: prices.includes(lvl) ? '#fff' : '#6A5746' }}>
                  {'€'.repeat(lvl)}
                </button>
              ))}
            </div>
            {/* note minimale */}
            <button onClick={() => setMinRating(r => (r >= 4.5 ? 0 : Math.round((r + 0.5) * 10) / 10))}
              className="flex items-center gap-1.5 font-head rounded-xl px-3 py-2.5 bg-white transition-colors"
              style={{ fontSize: 13, fontWeight: 600, color: minRating ? OLIVE_D : '#6A5746', border: `1px solid ${minRating ? OLIVE : 'rgba(58,42,26,.1)'}` }}>
              <Star size={14} fill={SAFFRON} color={SAFFRON} />
              {minRating ? `${minRating}+` : 'Note'}
            </button>
            {/* offres */}
            <button onClick={() => setOffersOnly(v => !v)} className="flex items-center gap-1.5 font-head rounded-xl px-3 py-2.5 transition-colors"
              style={{ fontSize: 13, fontWeight: 600, background: offersOnly ? TER : '#fff', color: offersOnly ? '#fff' : '#6A5746', border: offersOnly ? 'none' : '1px solid rgba(58,42,26,.1)' }}>
              <Tag size={14} /> Offres
            </button>
            {/* dispo ce soir */}
            <button onClick={() => setTonightOnly(v => !v)} className="flex items-center gap-1.5 font-head rounded-xl px-3 py-2.5 transition-colors"
              style={{ fontSize: 13, fontWeight: 600, background: tonightOnly ? OLIVE : '#fff', color: tonightOnly ? '#fff' : '#6A5746', border: tonightOnly ? 'none' : '1px solid rgba(58,42,26,.1)' }}>
              <Clock size={14} /> Disponible ce soir
            </button>
            {/* tri */}
            <div className="flex items-center gap-2 ml-auto">
              <span className="font-head text-muted" style={{ fontSize: 12.5 }}>Trier par</span>
              <select value={sortBy} onChange={e => setSortBy(e.target.value)} className="font-head rounded-xl px-3 py-2.5 bg-white text-cacao outline-none"
                style={{ fontSize: 13, fontWeight: 600, border: '1px solid rgba(58,42,26,.1)' }}>
                {SORTS.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>
          {/* rangée 2 : quartier + ambiance */}
          <div className="flex flex-wrap items-center gap-2 mt-2.5 pt-2.5" style={{ borderTop: '1px dashed rgba(58,42,26,.1)' }}>
            <select value={area} onChange={e => setArea(e.target.value)} className="font-head rounded-xl px-3 py-2 bg-white text-cacao outline-none"
              style={{ fontSize: 12.5, fontWeight: 600, border: `1px solid ${area !== 'Tous' ? OLIVE : 'rgba(58,42,26,.1)'}` }}>
              {areas.map(a => <option key={a} value={a}>{a === 'Tous' ? 'Tous quartiers' : a}</option>)}
            </select>
            <span className="font-head text-muted px-1" style={{ fontSize: 12 }}>Ambiance</span>
            {allTags.map(t => {
              const on = tagsSel.includes(t)
              return (
                <button key={t} onClick={() => toggleTag(t)} className="font-head rounded-full px-3 py-1.5 transition-colors"
                  style={{ fontSize: 11.5, fontWeight: 600, background: on ? OLIVE : '#fff', color: on ? '#fff' : '#6A5746', border: on ? 'none' : '1px solid rgba(58,42,26,.12)' }}>
                  {t}
                </button>
              )
            })}
          </div>
        </div>

        {/* bandeau « Offres du moment » (façon Bons plans TheFork) */}
        {!loading && offers.length > 0 && (
          <div className="mb-5">
            <div className="flex items-center gap-2 mb-2.5">
              <span className="grid place-items-center rounded-lg" style={{ width: 26, height: 26, background: 'rgba(217,108,59,.14)' }}>
                <Flame size={14} color={TER} />
              </span>
              <span className="font-head font-bold text-cacao" style={{ fontSize: 15 }}>Offres du moment</span>
              <span className="font-head font-semibold rounded-full px-2 py-0.5" style={{ fontSize: 10.5, color: TER, background: 'rgba(217,108,59,.12)' }}>{offers.length}</span>
            </div>
            <div className="flex gap-3 overflow-x-auto pb-2" style={{ scrollbarWidth: 'thin' }}>
              {offers.map((r, i) => (
                <motion.button key={r.id} initial={{ opacity: 0, x: 18 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: .06 * i }}
                  whileHover={{ y: -3 }} onClick={() => openDetail(r.id)}
                  className="flex-none text-left bg-card rounded-2xl overflow-hidden"
                  style={{ width: 215, border: '1px solid rgba(58,42,26,.08)', boxShadow: '0 10px 24px -16px rgba(58,42,26,.45)' }}>
                  <Dish src={r.img} from={r.from} to={r.to} label={cuisineEmoji(r.cuisine)} labelSize={30} className="relative" style={{ height: 92 }}>
                    <span className="absolute font-head font-bold text-white" style={{ top: 8, left: 8, fontSize: 11.5, background: TER, padding: '3px 9px', borderRadius: 8, zIndex: 1 }}>{r.offer}</span>
                    <span className="absolute flex items-center gap-1 font-head font-bold rounded-lg bg-white/95" style={{ bottom: 8, right: 8, fontSize: 11, color: CACAO, padding: '3px 7px', zIndex: 1 }}>
                      <Star size={10} fill={SAFFRON} color={SAFFRON} />{r.rating}
                    </span>
                  </Dish>
                  <div className="px-3 py-2.5">
                    <div className="font-head font-bold text-cacao truncate" style={{ fontSize: 13 }}>{r.name}</div>
                    {r.offerDesc && <div className="truncate font-head font-semibold" style={{ fontSize: 10.5, color: TER, marginTop: 1 }}>{r.offerDesc}</div>}
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-muted truncate" style={{ fontSize: 11 }}>{r.area}</span>
                      <span className="font-head font-semibold flex-none" style={{ fontSize: 11, color: OLIVE_D }}>Dès {r.slots[0]} →</span>
                    </div>
                  </div>
                </motion.button>
              ))}
            </div>
          </div>
        )}

        {/* compteur de résultats */}
        <div ref={resultsRef} className="flex items-center justify-between mb-4" style={{ scrollMarginTop: 92 }}>
          <div className="font-head font-semibold text-cacao" style={{ fontSize: 14 }}>
            {loading ? 'Chargement…' : `${filtered.length} restaurant${filtered.length > 1 ? 's' : ''}`}
            <span className="text-muted font-normal"> à Tanger</span>
          </div>
          {hasFilters ? (
            <button onClick={resetFilters}
              className="font-head font-semibold transition-colors hover:opacity-80" style={{ fontSize: 12.5, color: TER }}>
              Réinitialiser
            </button>
          ) : null}
        </div>

        <div className="grid lg:grid-cols-[420px_1fr] gap-5">
          {/* list */}
          <div className="flex flex-col gap-3 lg:max-h-[640px] lg:overflow-y-auto lg:pr-1">
            {loading
              ? Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="bg-card rounded-2xl p-3 flex gap-3" style={{ border: '1px solid rgba(58,42,26,.08)' }}>
                    <Skeleton style={{ width: 74, height: 74, flex: 'none' }} />
                    <div className="flex-1">
                      <Skeleton style={{ height: 14, width: '70%', marginBottom: 8 }} />
                      <Skeleton style={{ height: 11, width: '50%', marginBottom: 12 }} />
                      <Skeleton style={{ height: 11, width: '40%' }} />
                    </div>
                  </div>
                ))
              : filtered.map(r => {
                  const sel = r.id === selectedId
                  const hov = r.id === hoveredId
                  const active = sel || hov
                  return (
                    <motion.div key={r.id} layout onMouseEnter={() => setHoveredId(r.id)} onMouseLeave={() => setHoveredId(null)}
                      whileHover={{ y: -2 }} onClick={() => openDetail(r.id)} role="button"
                      className="text-left bg-card rounded-2xl overflow-hidden transition-all cursor-pointer"
                      style={{ border: active ? `2px solid ${OLIVE}` : '1px solid rgba(58,42,26,.08)', boxShadow: active ? '0 14px 34px -16px rgba(111,143,69,.6)' : '0 8px 22px -16px rgba(58,42,26,.4)' }}>
                      <div className="flex gap-3 p-3">
                        <Dish src={r.img} from={r.from} to={r.to} label={cuisineEmoji(r.cuisine)} labelSize={26} className="rounded-xl flex-none relative" style={{ width: 74, height: 74 }}>
                          {r.offer && <span className="absolute font-head font-bold text-white" style={{ top: 5, left: 5, fontSize: 10, background: TER, padding: '2px 6px', borderRadius: 7, zIndex: 1 }}>{r.offer}</span>}
                        </Dish>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2">
                            <div className="font-head font-bold text-cacao truncate" style={{ fontSize: 14.5 }}>{r.name}</div>
                            <span className="flex items-center gap-1 font-semibold flex-none" style={{ fontSize: 12, color: CACAO }}><Star size={12} fill={SAFFRON} color={SAFFRON} />{r.rating}</span>
                          </div>
                          <div className="text-muted truncate" style={{ fontSize: 11.5, margin: '2px 0 6px' }}>{r.cuisine}</div>
                          <div className="flex items-center gap-2" style={{ fontSize: 11, color: '#6A5746' }}>
                            <span className="flex items-center gap-1"><MapPin size={11} color={OLIVE} />{r.area}</span>
                            <span>· {r.price}</span>
                            <span className="ml-auto" style={{ color: r.availableTonight ? OLIVE_D : '#B08968', fontWeight: 600 }}>{r.availableTonight ? 'Dispo ce soir' : 'Complet ce soir'}</span>
                          </div>
                        </div>
                      </div>
                      {/* créneaux réservables directement (style TheFork) */}
                      <div className="flex flex-wrap items-center gap-1.5 px-3 pb-3">
                        {(r.slots || []).slice(0, 4).map(s => (
                          <button key={s} onClick={e => { e.stopPropagation(); startBooking(r.id, s) }}
                            className="font-head rounded-lg transition-colors hover:text-white"
                            style={{ fontSize: 12, fontWeight: 600, color: OLIVE_D, background: 'rgba(111,143,69,.12)', padding: '5px 10px' }}
                            onMouseEnter={e => { e.currentTarget.style.background = OLIVE }}
                            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(111,143,69,.12)' }}>
                            {s}
                          </button>
                        ))}
                        <span className="font-head ml-auto" style={{ fontSize: 11, color: TER, fontWeight: 600 }}>Voir la fiche →</span>
                      </div>
                    </motion.div>
                  )
                })}
            {!loading && filtered.length === 0 && (
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                className="text-center bg-card rounded-2xl py-12 px-6" style={{ border: '1px dashed rgba(58,42,26,.18)' }}>
                <div className="mx-auto grid place-items-center rounded-full mb-3" style={{ width: 52, height: 52, background: 'rgba(111,143,69,.12)' }}>
                  <Search size={22} color={OLIVE} />
                </div>
                <div className="font-head font-bold text-cacao mb-1" style={{ fontSize: 15 }}>Aucun restaurant ne correspond</div>
                <p className="text-muted mb-4" style={{ fontSize: 13 }}>Élargissez vos critères pour voir plus d’adresses.</p>
                <button onClick={resetFilters}
                  className="font-head font-semibold rounded-xl px-4 py-2.5 text-white" style={{ fontSize: 13, background: OLIVE }}>
                  Réinitialiser les filtres
                </button>
              </motion.div>
            )}
          </div>

          {/* map (synchronisée avec la liste) */}
          <div className="lg:sticky lg:top-24" style={{ height: 560 }}>
            {loading
              ? <Skeleton style={{ height: '100%', borderRadius: 16 }} />
              : <TangierMap restaurants={filtered} selectedId={selectedId} highlight={highlight} hoveredId={hoveredId}
                  onSelect={select} onHover={setHoveredId} onOpen={openDetail} onReserve={startBooking} />}
          </div>
        </div>
      </div>

      <Assistant list={list} selectedId={selectedId} party={party} time={time} points={points} onAction={onAction} />

      {/* fiche détaillée riche */}
      <AnimatePresence>
        {detailId && (() => {
          const r = list.find(x => x.id === detailId)
          return r ? (
            <RestaurantDetail restaurant={r} dates={DATES} dateIdx={dateIdx} setDateIdx={setDateIdx}
              onClose={() => setDetailId(null)}
              onReserve={({ time: t, party: p }) => { setParty(p); setDetailId(null); setBooking({ restaurant: r, dateIdx, party: p, time: t, autoConfirm: false }) }} />
          ) : null
        })()}
      </AnimatePresence>

      {/* tunnel de réservation (3 étapes) */}
      <AnimatePresence>
        {booking && (
          <BookingFlow restaurant={booking.restaurant} dates={DATES} autoConfirm={booking.autoConfirm}
            initial={{ dateIdx: booking.dateIdx, party: booking.party, time: booking.time }}
            onClose={() => setBooking(null)} onPersist={persistReservation} onToast={showToast} />
        )}
      </AnimatePresence>

      {/* toast */}
      <AnimatePresence>
        {toast && (
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 24 }}
            className="fixed z-[70] flex items-center gap-2.5 font-head font-semibold text-white rounded-2xl"
            style={{ bottom: 26, left: '50%', transform: 'translateX(-50%)', background: OLIVE, padding: '13px 20px', fontSize: 14, boxShadow: '0 18px 40px -14px rgba(111,143,69,.8)' }}>
            <span className="grid place-items-center rounded-full bg-white/25" style={{ width: 22, height: 22 }}><Check size={14} color="#fff" /></span>
            {toast}
          </motion.div>
        )}
      </AnimatePresence>

      {/* tiroir « Mes réservations » */}
      <AnimatePresence>
        {drawerOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setDrawerOpen(false)}
              className="fixed inset-0 z-[80]" style={{ background: 'rgba(58,42,26,.4)', backdropFilter: 'blur(2px)' }} />
            <motion.aside initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', damping: 28, stiffness: 260 }}
              className="fixed top-0 right-0 z-[81] h-full bg-card flex flex-col" style={{ width: 380, maxWidth: '92vw', boxShadow: '-20px 0 60px -20px rgba(58,42,26,.5)' }}>
              <div className="flex items-center justify-between px-5 py-4" style={{ background: OLIVE }}>
                <div className="flex items-center gap-2 font-head font-bold text-white" style={{ fontSize: 16 }}>
                  <CalendarRange size={18} /> Mes réservations
                </div>
                <button onClick={() => setDrawerOpen(false)} className="grid place-items-center rounded-full bg-white/20" style={{ width: 32, height: 32 }}><X size={18} color="#fff" /></button>
              </div>
              <div className="flex items-center gap-2 px-5 py-3" style={{ borderBottom: '1px solid rgba(58,42,26,.08)' }}>
                <StatusPill />
                <span className="text-muted" style={{ fontSize: 12 }}>· session en cours</span>
              </div>
              <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
                {/* carte fidélité */}
                <div className="rounded-2xl p-4" style={{ background: 'linear-gradient(135deg, rgba(242,184,75,.22), rgba(242,184,75,.08))', border: '1px solid rgba(242,184,75,.4)' }}>
                  <div className="flex items-center gap-2.5 mb-2">
                    <span className="grid place-items-center rounded-xl" style={{ width: 36, height: 36, background: 'rgba(242,184,75,.3)' }}>
                      <Award size={18} color="#C98A1B" />
                    </span>
                    <div className="flex-1">
                      <div className="font-head font-bold text-cacao" style={{ fontSize: 14 }}>Vos points OKLA</div>
                      <div className="text-muted" style={{ fontSize: 11 }}>+150 points par réservation honorée</div>
                    </div>
                    <span className="font-head font-extrabold" style={{ fontSize: 20, color: '#9C6B12' }}><CountUp value={points} /></span>
                  </div>
                  <div className="rounded-full overflow-hidden" style={{ height: 7, background: 'rgba(58,42,26,.1)' }}>
                    <motion.div animate={{ width: `${Math.min(100, (points % 1000) / 10)}%` }} transition={{ duration: .8, ease: 'easeOut' }}
                      style={{ height: '100%', background: 'linear-gradient(90deg, #F2B84B, #C98A1B)', borderRadius: 7 }} />
                  </div>
                  <div className="flex justify-between mt-1.5" style={{ fontSize: 10.5 }}>
                    <span className="text-muted">{points % 1000} / 1000 pts</span>
                    <span className="font-head font-semibold" style={{ color: '#9C6B12' }}>1000 pts = −100 DH offerts</span>
                  </div>
                </div>
                {reservations.length === 0 ? (
                  <div className="text-center text-muted py-16 px-6" style={{ fontSize: 13.5, lineHeight: 1.5 }}>
                    Aucune réservation pour l’instant.<br />Confirmez une table pour la voir apparaître ici.
                  </div>
                ) : reservations.map(r => (
                  <motion.div key={r.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                    className="rounded-2xl p-4" style={{ background: '#fff', border: '1px solid rgba(58,42,26,.08)' }}>
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <div className="font-head font-bold text-cacao" style={{ fontSize: 14.5 }}>{r.restaurantName}</div>
                      <span className="font-head font-semibold rounded-full px-2.5 py-1" style={{ fontSize: 10.5, color: OLIVE_D, background: 'rgba(111,143,69,.14)' }}>{r.status}</span>
                    </div>
                    <div className="flex items-center gap-3 text-muted" style={{ fontSize: 12.5 }}>
                      <span className="flex items-center gap-1"><CalendarCheck size={13} color={OLIVE} />{r.date} · {r.time}</span>
                      <span className="flex items-center gap-1"><Users size={13} color={OLIVE} />{r.party} pers.</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </main>
  )
}
