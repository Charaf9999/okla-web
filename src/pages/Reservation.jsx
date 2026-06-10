import { useState, useEffect, useMemo, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MapPin, Star, Clock, Users, CalendarCheck, Check, Sparkles, Send, X, Minus, Plus, Search, CalendarRange, Tag } from 'lucide-react'
import { reservationScript } from '../data'
import { getTangier, createReservation, getReservations } from '../api'
import Dish from '../components/Dish'
import Skeleton from '../components/Skeleton'
import StatusPill from '../components/StatusPill'
import RestaurantDetail from '../components/reservation/RestaurantDetail'
import BookingFlow from '../components/reservation/BookingFlow'

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
        {/* sea */}
        <path d="M0 0 H640 V118 C560 150 520 104 440 150 C360 192 300 138 220 172 C150 202 90 156 0 182 Z" fill={SEA} />
        <path d="M0 182 C90 156 150 202 220 172 C300 138 360 192 440 150 C520 104 560 150 640 118" fill="none" stroke="#8FB3B9" strokeWidth="2" opacity=".6" />
        {/* gentle waves */}
        {[40, 70, 100].map((y, i) => (
          <path key={i} d={`M${40 + i * 30} ${y} q 16 -7 32 0 t 32 0 t 32 0`} fill="none" stroke="#ffffff" strokeWidth="2" opacity=".35" />
        ))}
        {/* port */}
        <rect x="352" y="150" width="46" height="20" rx="3" fill="#cfc2ac" />
        <line x1="362" y1="150" x2="362" y2="132" stroke="#b9a98e" strokeWidth="3" />
        <line x1="378" y1="150" x2="378" y2="130" stroke="#b9a98e" strokeWidth="3" />
        {/* roads */}
        {[['M120 230 C 220 250 340 300 360 360','9'],['M150 235 C 250 210 330 210 492 258','7'],['M340 345 C 300 280 280 230 252 182','6']].map(([d, w], i) => (
          <path key={i} d={d} fill="none" stroke="#E0D4BE" strokeWidth={w} strokeLinecap="round" />
        ))}
        {/* district labels */}
        {[['Marshan', 110, 195], ['Kasbah', 250, 150], ['Médina', 340, 235], ['Centre-ville', 345, 405], ['Malabata', 505, 305]].map(([t, x, y]) => (
          <text key={t} x={x} y={y} fontFamily="Poppins, sans-serif" fontSize="13" fontWeight="600" fill="#9C8B79" textAnchor="middle">{t}</text>
        ))}
        <text x="470" y="70" fontFamily="Poppins, sans-serif" fontSize="13" fontWeight="600" fill="#6f9aa1" textAnchor="middle">Baie de Tanger</text>

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
              <path d="M0 0 C-9 -10 -14 -16 -14 -24 a14 14 0 0 1 28 0 c0 8 -5 14 -14 24 Z" fill={color} stroke="#fff" strokeWidth="2" transform={scale} style={{ transition: 'transform .18s' }} />
              <circle cx="0" cy="-24" r="5" fill="#fff" transform={scale} style={{ transition: 'transform .18s' }} />
              {/* badge offre sur le pin */}
              {r.offer && (
                <g transform={`translate(12,-34) ${active ? 'scale(1.05)' : ''}`}>
                  <rect x="0" y="0" width="34" height="17" rx="8.5" fill={TER} />
                  <text x="17" y="12" fontFamily="Poppins, sans-serif" fontSize="10" fontWeight="700" fill="#fff" textAnchor="middle">{r.offer}</text>
                </g>
              )}
            </g>
          )
        })}

        {/* mini-carte au survol d'un pin */}
        {mini && (
          <foreignObject x={Math.min(Math.max(mini.x - 95, 6), 640 - 196)} y={Math.max(mini.y - 150, 6)} width="190" height="138">
            <div xmlns="http://www.w3.org/1999/xhtml" style={{ background: '#fff', borderRadius: 14, overflow: 'hidden', boxShadow: '0 16px 36px -12px rgba(58,42,26,.5)', border: '1px solid rgba(58,42,26,.08)', fontFamily: 'Inter, sans-serif' }}>
              <div style={{ position: 'relative', height: 56, background: `radial-gradient(circle at 30% 35%, rgba(242,184,75,.5), transparent 55%), linear-gradient(135deg,${mini.from},${mini.to})` }}>
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

/* ---------------- Scripted assistant ---------------- */
function Assistant({ onAction }) {
  const [open, setOpen] = useState(false)
  const [asked, setAsked] = useState([])
  const [msgs, setMsgs] = useState([{ role: 'bot', text: 'Bonjour ! Je suis l’assistant OKLA. Je peux vous aider à choisir et réserver. Posez-moi une question 👇' }])

  const ask = (item, i) => {
    setAsked(a => [...a, i])
    setMsgs(m => [...m, { role: 'user', text: item.q }])
    setTimeout(() => {
      setMsgs(m => [...m, { role: 'bot', text: item.a }])
      onAction(item.action)
    }, 650)
  }

  return (
    <>
      <motion.button initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: .4, type: 'spring' }}
        onClick={() => setOpen(o => !o)} className="fixed z-50 grid place-items-center rounded-full text-white"
        style={{ bottom: 26, right: 26, width: 60, height: 60, background: OLIVE, boxShadow: '0 16px 34px -10px rgba(111,143,69,.7)' }}>
        <AnimatePresence mode="wait">
          {open ? <motion.span key="x" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ opacity: 0 }}><X size={24} /></motion.span>
                : <motion.span key="s" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ opacity: 0 }}><Sparkles size={24} /></motion.span>}
        </AnimatePresence>
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0, y: 20, scale: .96 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 20, scale: .96 }}
            transition={{ duration: .25 }} className="fixed z-50 flex flex-col bg-card rounded-3xl overflow-hidden"
            style={{ bottom: 100, right: 26, width: 360, maxWidth: 'calc(100vw - 40px)', height: 480, boxShadow: '0 30px 70px -20px rgba(58,42,26,.5)', border: '1px solid rgba(58,42,26,.08)' }}>
            <div className="flex items-center gap-2.5 px-4 py-3.5" style={{ background: OLIVE }}>
              <div className="grid place-items-center rounded-xl bg-white/20" style={{ width: 34, height: 34 }}><Sparkles size={18} color="#fff" /></div>
              <div><div className="font-head font-bold text-white" style={{ fontSize: 14 }}>Assistant OKLA</div>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,.8)' }}>● en ligne</div></div>
            </div>
            <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-2.5">
              {msgs.map((m, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className={m.role === 'user' ? 'self-end' : 'self-start'}
                  style={{ maxWidth: '85%', padding: '10px 13px', borderRadius: 15, fontSize: 13.5, lineHeight: 1.45,
                    background: m.role === 'user' ? TER : '#F1E7D6', color: m.role === 'user' ? '#fff' : CACAO,
                    borderBottomRightRadius: m.role === 'user' ? 4 : 15, borderBottomLeftRadius: m.role === 'user' ? 15 : 4 }}>
                  {m.text}
                </motion.div>
              ))}
            </div>
            <div className="p-3 flex flex-wrap gap-2" style={{ borderTop: '1px solid rgba(58,42,26,.08)' }}>
              {reservationScript.map((it, i) => !asked.includes(i) && (
                <button key={i} onClick={() => ask(it, i)} className="font-head rounded-full px-3 py-1.5 transition-colors"
                  style={{ fontSize: 11.5, fontWeight: 600, color: OLIVE_D, background: 'rgba(111,143,69,.12)' }}>{it.q}</button>
              ))}
              <div className="flex items-center gap-2 w-full mt-1">
                <div className="flex-1 rounded-full px-3.5 py-2 text-muted" style={{ fontSize: 12.5, background: '#fff', border: '1px solid rgba(58,42,26,.1)' }}>Écrire un message…</div>
                <button className="grid place-items-center rounded-full" style={{ width: 36, height: 36, background: OLIVE }}><Send size={15} color="#fff" /></button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
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

  // Liste filtrée + triée (recherche, cuisine, prix, note, offres, dispo, tri).
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    let r = list.filter(x => {
      const okCuisine = cuisine === 'Toutes' || family(x.cuisine) === cuisine
      const okPrice = prices.length === 0 || prices.includes(x.priceLevel)
      const okRating = x.rating >= minRating
      const okOffer = !offersOnly || !!x.offer
      const okTonight = !tonightOnly || x.availableTonight
      const okQ = !q || x.name.toLowerCase().includes(q) || x.cuisine.toLowerCase().includes(q)
        || x.area.toLowerCase().includes(q) || (x.tags || []).some(t => t.toLowerCase().includes(q))
      return okCuisine && okPrice && okRating && okOffer && okTonight && okQ
    })
    if (sortBy === 'Note') r = [...r].sort((a, b) => b.rating - a.rating)
    else if (sortBy === 'Prix') r = [...r].sort((a, b) => a.priceLevel - b.priceLevel)
    else r = [...r].sort((a, b) => (b.offer ? 1 : 0) - (a.offer ? 1 : 0) || b.rating - a.rating) // Recommandés
    return r
  }, [list, query, cuisine, prices, minRating, offersOnly, tonightOnly, sortBy])

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

  // Persiste une réservation (API + repli) et met à jour la liste « Mes réservations ».
  const persistReservation = useCallback(async (payload) => {
    const res = await createReservation(payload)
    setReservations(prev => [res.data, ...prev.filter(r => r.id !== res.data.id)])
    return res
  }, [])

  const onAction = (a) => {
    if (!a) return
    if (a.type === 'select') select(a.id)
    if (a.type === 'highlight') { setHighlight(a.ids) }
    if (a.type === 'prefill') { setSelectedId('t1'); setTime(a.time); setParty(a.party); setHighlight([]) }
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
            <h1 className="font-head font-extrabold text-cacao" style={{ fontSize: 'clamp(30px,4vw,46px)', letterSpacing: '-1px' }}>Réservez une table à Tanger</h1>
            <p className="text-muted mt-2" style={{ fontSize: 15 }}>Choisissez un restaurant sur la carte, sélectionnez votre créneau, c’est réservé.</p>
          </div>
          <div className="flex items-center gap-3">
            <StatusPill />
            <button onClick={openDrawer} className="inline-flex items-center gap-2 font-head font-semibold rounded-xl px-4 py-2.5 text-white transition-all hover:-translate-y-0.5"
              style={{ fontSize: 13.5, background: OLIVE, boxShadow: '0 12px 26px -12px rgba(111,143,69,.7)' }}>
              <CalendarRange size={16} /> Mes réservations{reservations.length ? ` (${reservations.length})` : ''}
            </button>
          </div>
        </div>

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
        </div>

        {/* compteur de résultats */}
        <div className="flex items-center justify-between mb-4">
          <div className="font-head font-semibold text-cacao" style={{ fontSize: 14 }}>
            {loading ? 'Chargement…' : `${filtered.length} restaurant${filtered.length > 1 ? 's' : ''}`}
            <span className="text-muted font-normal"> à Tanger</span>
          </div>
          {(cuisine !== 'Toutes' || prices.length || minRating || offersOnly || tonightOnly || query) ? (
            <button onClick={() => { setQuery(''); setCuisine('Toutes'); setPrices([]); setMinRating(0); setOffersOnly(false); setTonightOnly(false) }}
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
                        <Dish src={r.img} from={r.from} to={r.to} className="rounded-xl flex-none relative" style={{ width: 74, height: 74 }}>
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
                <button onClick={() => { setQuery(''); setCuisine('Toutes'); setPrices([]); setMinRating(0); setOffersOnly(false); setTonightOnly(false) }}
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

      <Assistant onAction={onAction} />

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
