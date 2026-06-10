import { useState } from 'react'
import { motion } from 'framer-motion'
import { X, Star, MapPin, Minus, Plus, Tag } from 'lucide-react'
import Dish from '../Dish'

const OLIVE = '#6F8F45', OLIVE_D = '#5E7A39', TER = '#D96C3B', CACAO = '#3A2A1A', SAFFRON = '#F2B84B'

// Couleur d'avatar déterministe à partir du nom.
const AV_COLORS = ['#6F8F45', '#D96C3B', '#3f7d86', '#b9682f', '#6f5a3a', '#cf7b3a']
const avatarColor = (name) => AV_COLORS[(name.charCodeAt(0) + (name.charCodeAt(1) || 0)) % AV_COLORS.length]

// Répartition de notes plausible dérivée de la note moyenne (pour les barres).
function distribution(rating) {
  const five = Math.min(95, Math.max(50, Math.round((rating - 3) / 2 * 100)))
  const four = Math.round((100 - five) * 0.6)
  const three = Math.round((100 - five - four) * 0.6)
  const two = Math.round((100 - five - four - three) * 0.6)
  const one = Math.max(0, 100 - five - four - three - two)
  return [five, four, three, two, one]
}

export default function RestaurantDetail({ restaurant, dates, dateIdx, setDateIdx, onClose, onReserve }) {
  const r = restaurant
  const [mainIdx, setMainIdx] = useState(0)
  const [party, setParty] = useState(2)
  const [time, setTime] = useState(null)
  const photos = (r.photos && r.photos.length ? r.photos : [r.img])
  const dist = distribution(r.rating)

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}
      className="fixed inset-0 z-[75] grid place-items-center p-4" style={{ background: 'rgba(58,42,26,.55)', backdropFilter: 'blur(4px)' }}>
      <motion.div initial={{ scale: .95, y: 20, opacity: 0 }} animate={{ scale: 1, y: 0, opacity: 1 }} exit={{ scale: .95, opacity: 0 }}
        transition={{ type: 'spring', damping: 26, stiffness: 240 }} onClick={e => e.stopPropagation()}
        className="bg-card rounded-3xl overflow-hidden flex flex-col" style={{ width: 880, maxWidth: '100%', maxHeight: '92vh', boxShadow: '0 40px 90px -24px rgba(58,42,26,.6)' }}>

        {/* en-tête fermeture */}
        <button onClick={onClose} className="absolute z-10 grid place-items-center bg-white rounded-full" style={{ top: 16, right: 16, width: 38, height: 38, boxShadow: '0 6px 16px -6px rgba(58,42,26,.5)' }}>
          <X size={18} color={CACAO} />
        </button>

        <div className="grid md:grid-cols-[1fr_290px] overflow-hidden" style={{ maxHeight: '92vh' }}>
          {/* colonne contenu (défile) */}
          <div className="overflow-y-auto" style={{ maxHeight: '92vh' }}>
            {/* galerie */}
            <Dish src={photos[mainIdx]} from={r.from} to={r.to} className="relative" style={{ height: 240 }}>
              {r.offer && <span className="absolute font-head font-bold text-white flex items-center gap-1" style={{ top: 16, left: 16, fontSize: 13, background: TER, padding: '5px 11px', borderRadius: 9, zIndex: 1 }}><Tag size={13} /> {r.offer}</span>}
            </Dish>
            <div className="flex gap-2 px-5 pt-3">
              {photos.map((p, i) => (
                <button key={i} onClick={() => setMainIdx(i)} className="rounded-lg overflow-hidden transition-all" style={{ border: i === mainIdx ? `2px solid ${OLIVE}` : '2px solid transparent' }}>
                  <Dish src={p} from={r.from} to={r.to} style={{ width: 64, height: 48 }} />
                </button>
              ))}
            </div>

            <div className="p-5">
              <div className="font-head font-extrabold text-cacao" style={{ fontSize: 24, letterSpacing: '-.5px' }}>{r.name}</div>
              <div className="flex items-center gap-2 flex-wrap text-muted mt-1" style={{ fontSize: 13.5 }}>
                <span>{r.cuisine}</span>
                <span className="flex items-center gap-1"><MapPin size={13} color={OLIVE} />{r.area}</span>
                <span>· {r.price}</span>
              </div>

              {/* tags */}
              <div className="flex flex-wrap gap-2 mt-3">
                {(r.tags || []).map(t => (
                  <span key={t} className="font-head font-semibold rounded-full px-3 py-1" style={{ fontSize: 11.5, color: OLIVE_D, background: 'rgba(111,143,69,.12)' }}>{t}</span>
                ))}
              </div>

              {/* description */}
              <p className="mt-4" style={{ fontSize: 14, lineHeight: 1.6, color: '#5A4838' }}>{r.description}</p>

              {/* note + répartition */}
              <div className="mt-6 grid grid-cols-[auto_1fr] gap-5 items-center bg-white rounded-2xl p-4" style={{ border: '1px solid rgba(58,42,26,.07)' }}>
                <div className="text-center">
                  <div className="font-head font-extrabold text-cacao" style={{ fontSize: 34, lineHeight: 1 }}>{r.rating}</div>
                  <div className="flex gap-0.5 justify-center my-1">
                    {[0, 1, 2, 3, 4].map(i => <Star key={i} size={12} fill={i < Math.round(r.rating) ? SAFFRON : '#E8E2D8'} color={i < Math.round(r.rating) ? SAFFRON : '#E8E2D8'} />)}
                  </div>
                  <div className="text-muted" style={{ fontSize: 11 }}>{r.reviews} avis</div>
                </div>
                <div className="flex flex-col gap-1.5">
                  {dist.map((pct, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <span className="text-muted" style={{ fontSize: 10.5, width: 10 }}>{5 - i}</span>
                      <div className="flex-1 rounded-full overflow-hidden" style={{ height: 6, background: '#EFE6D6' }}>
                        <div style={{ width: `${pct}%`, height: '100%', background: SAFFRON, borderRadius: 6 }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* avis */}
              <div className="font-head font-bold text-cacao mt-6 mb-3" style={{ fontSize: 16 }}>Avis des clients</div>
              <div className="flex flex-col gap-3">
                {(r.reviewList || []).map((rev, i) => (
                  <div key={i} className="bg-white rounded-2xl p-4" style={{ border: '1px solid rgba(58,42,26,.07)' }}>
                    <div className="flex items-center gap-2.5 mb-2">
                      <span className="grid place-items-center rounded-full text-white font-head font-bold" style={{ width: 34, height: 34, fontSize: 14, background: avatarColor(rev.name) }}>{rev.name[0]}</span>
                      <div className="flex-1">
                        <div className="font-head font-semibold text-cacao" style={{ fontSize: 13.5 }}>{rev.name}</div>
                        <div className="text-muted" style={{ fontSize: 11 }}>{rev.date}</div>
                      </div>
                      <span className="flex items-center gap-1 font-semibold" style={{ fontSize: 12.5, color: CACAO }}><Star size={12} fill={SAFFRON} color={SAFFRON} />{rev.rating}</span>
                    </div>
                    <p style={{ fontSize: 13, lineHeight: 1.5, color: '#5A4838' }}>{rev.text}</p>
                  </div>
                ))}
              </div>

              {/* menu */}
              <div className="font-head font-bold text-cacao mt-6 mb-3" style={{ fontSize: 16 }}>Au menu</div>
              <div className="flex flex-col gap-2">
                {(r.menu || []).map(([name, price]) => (
                  <div key={name} className="flex items-center justify-between bg-white rounded-xl px-4 py-3" style={{ border: '1px solid rgba(58,42,26,.07)' }}>
                    <span className="text-cacao" style={{ fontSize: 13.5 }}>{name}</span>
                    <span className="font-head font-semibold" style={{ fontSize: 13, color: TER }}>{price}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* widget de réservation (sticky) */}
          <div className="bg-white md:border-l p-5 flex flex-col" style={{ borderColor: 'rgba(58,42,26,.08)' }}>
            <div className="font-head font-bold text-cacao mb-3" style={{ fontSize: 15 }}>Réserver une table</div>

            <div className="font-head font-semibold text-muted mb-1.5" style={{ fontSize: 12 }}>Date</div>
            <div className="flex flex-wrap gap-1.5 mb-4">
              {dates.map((d, i) => (
                <button key={d} onClick={() => setDateIdx(i)} className="font-head rounded-lg px-2.5 py-1.5 transition-colors"
                  style={{ fontSize: 12, fontWeight: 600, background: dateIdx === i ? OLIVE : '#fff', color: dateIdx === i ? '#fff' : '#6A5746', border: dateIdx === i ? 'none' : '1px solid rgba(58,42,26,.12)' }}>{d}</button>
              ))}
            </div>

            <div className="font-head font-semibold text-muted mb-1.5" style={{ fontSize: 12 }}>Convives</div>
            <div className="flex items-center gap-2 mb-4">
              <button onClick={() => setParty(p => Math.max(1, p - 1))} className="grid place-items-center rounded-lg" style={{ width: 32, height: 32, background: 'rgba(111,143,69,.12)' }}><Minus size={14} color={OLIVE_D} /></button>
              <span className="font-head font-semibold text-cacao flex-1 text-center" style={{ fontSize: 14 }}>{party} pers.</span>
              <button onClick={() => setParty(p => Math.min(10, p + 1))} className="grid place-items-center rounded-lg" style={{ width: 32, height: 32, background: 'rgba(111,143,69,.12)' }}><Plus size={14} color={OLIVE_D} /></button>
            </div>

            <div className="font-head font-semibold text-muted mb-1.5" style={{ fontSize: 12 }}>Créneau</div>
            <div className="flex flex-wrap gap-1.5 mb-5">
              {(r.slots || []).map(s => (
                <button key={s} onClick={() => setTime(s)} className="font-head rounded-lg px-3 py-2 transition-all"
                  style={{ fontSize: 12.5, fontWeight: 600, background: time === s ? OLIVE : '#fff', color: time === s ? '#fff' : '#6A5746', border: time === s ? 'none' : '1px solid rgba(58,42,26,.12)' }}>{s}</button>
              ))}
            </div>

            <button onClick={() => onReserve({ time: time || r.slots[0], party })}
              className="mt-auto w-full font-head font-semibold rounded-xl py-3.5 text-white transition-all hover:-translate-y-0.5"
              style={{ fontSize: 15, background: OLIVE, boxShadow: '0 14px 28px -12px rgba(111,143,69,.7)' }}>
              Réserver{time ? ` · ${time}` : ''}
            </button>
            {r.offer && <div className="text-center mt-2.5 font-head font-semibold" style={{ fontSize: 12, color: TER }}>Offre {r.offer} appliquée 🎉</div>}
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}
