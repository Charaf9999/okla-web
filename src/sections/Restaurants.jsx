import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { Star, Clock, Search } from 'lucide-react'
import { getRestaurants } from '../api'
import Dish from '../components/Dish'
import Skeleton from '../components/Skeleton'
import StatusPill from '../components/StatusPill'

// Familles de cuisine = premier mot avant « · »
const family = (c) => c.split('·')[0].trim()

export default function Restaurants() {
  const [list, setList] = useState([])
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState('')
  const [cuisine, setCuisine] = useState('Tout')

  useEffect(() => {
    let alive = true
    getRestaurants().then(({ data }) => {
      if (!alive) return
      setList(data)
      setLoading(false)
    })
    return () => { alive = false }
  }, [])

  const cuisines = useMemo(() => ['Tout', ...Array.from(new Set(list.map(r => family(r.cuisine))))], [list])

  const filtered = useMemo(() => list.filter(r => {
    const okC = cuisine === 'Tout' || family(r.cuisine) === cuisine
    const q = query.trim().toLowerCase()
    const okQ = !q || r.name.toLowerCase().includes(q) || r.cuisine.toLowerCase().includes(q)
    return okC && okQ
  }), [list, cuisine, query])

  return (
    <section id="restaurants" className="max-w-[1240px] mx-auto px-5 sm:px-10 lg:px-16 py-20">
      <div className="flex items-end justify-between mb-6 flex-wrap gap-3">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: .6 }}>
          <div className="flex items-center gap-3 mb-2">
            <h2 className="font-head font-extrabold text-cacao" style={{ fontSize: 'clamp(28px,3.5vw,40px)', letterSpacing: '-1px' }}>Restaurants populaires</h2>
            <StatusPill />
          </div>
          <p className="text-muted" style={{ fontSize: 15 }}>Sélectionnés près de chez vous, à Tanger.</p>
        </motion.div>
        <button className="font-head font-semibold rounded-xl" style={{ fontSize: 14, color: '#D96C3B', border: '1.5px solid rgba(217,108,59,.4)', padding: '11px 20px' }}>Tout voir</button>
      </div>

      {/* recherche + filtres cuisine */}
      <div className="flex flex-wrap items-center gap-3 mb-8">
        <div className="flex items-center gap-2 bg-card rounded-xl px-3.5 py-2.5" style={{ border: '1px solid rgba(58,42,26,.1)', minWidth: 240 }}>
          <Search size={16} color="#9C8B79" />
          <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Rechercher un restaurant, une cuisine…"
            className="bg-transparent outline-none flex-1 text-cacao" style={{ fontSize: 13.5 }} />
        </div>
        <div className="flex flex-wrap gap-2">
          {cuisines.map(c => (
            <button key={c} onClick={() => setCuisine(c)} className="font-head rounded-full px-3.5 py-1.5 transition-colors"
              style={{ fontSize: 12.5, fontWeight: 600, background: cuisine === c ? '#6F8F45' : '#fff', color: cuisine === c ? '#fff' : '#6A5746', border: cuisine === c ? 'none' : '1px solid rgba(58,42,26,.1)' }}>{c}</button>
          ))}
        </div>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {loading
          ? Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="bg-card rounded-[20px] overflow-hidden" style={{ border: '1px solid rgba(58,42,26,.06)' }}>
                <Skeleton style={{ height: 130, borderRadius: 0 }} />
                <div className="p-4">
                  <Skeleton style={{ height: 15, width: '70%', marginBottom: 8 }} />
                  <Skeleton style={{ height: 12, width: '50%', marginBottom: 14 }} />
                  <Skeleton style={{ height: 12, width: '85%' }} />
                </div>
              </div>
            ))
          : filtered.map((r, i) => (
              <motion.div key={r.id || r.name} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: .55, delay: Math.min(i, 4) * .08 }}
                whileHover={{ y: -6 }} className="bg-card rounded-[20px] overflow-hidden" style={{ border: '1px solid rgba(58,42,26,.06)', boxShadow: '0 10px 30px -18px rgba(58,42,26,.4)' }}>
                <Dish src={r.img} from={r.from} to={r.to} className="relative" style={{ height: 130 }}>
                  {r.tag && <span className="absolute font-head font-semibold" style={{ top: 12, left: 12, fontSize: 11, color: '#3A2A1A', background: '#F2B84B', padding: '4px 10px', borderRadius: 8, zIndex: 1 }}>{r.tag}</span>}
                </Dish>
                <div className="p-4">
                  <div className="font-head font-bold text-cacao" style={{ fontSize: 15 }}>{r.name}</div>
                  <div className="text-muted" style={{ fontSize: 12, margin: '3px 0 10px' }}>{r.cuisine}</div>
                  <div className="flex items-center justify-between" style={{ fontSize: 12 }}>
                    <span className="flex items-center gap-1 font-semibold text-cacao"><Star size={13} fill="#F2B84B" color="#F2B84B" /> {r.rating}</span>
                    <span className="flex items-center gap-1 text-muted"><Clock size={12} /> {r.time}</span>
                    <span className="text-muted">{r.price}</span>
                  </div>
                </div>
              </motion.div>
            ))}
      </div>

      {!loading && filtered.length === 0 && (
        <div className="text-center text-muted py-12" style={{ fontSize: 14 }}>Aucun restaurant ne correspond à votre recherche.</div>
      )}
    </section>
  )
}
