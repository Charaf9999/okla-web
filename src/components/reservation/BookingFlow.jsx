import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Check, Minus, Plus, User, Phone, MessageSquare, CalendarPlus, Award, ChevronLeft } from 'lucide-react'

const OLIVE = '#6F8F45', OLIVE_D = '#5E7A39', TER = '#D96C3B', CACAO = '#3A2A1A'
const STEPS = ['Créneau', 'Vos informations', 'Confirmation']

export default function BookingFlow({ restaurant, dates, initial = {}, autoConfirm = false, onClose, onPersist, onToast }) {
  const r = restaurant
  const [step, setStep] = useState(1)
  const [dateIdx, setDateIdx] = useState(initial.dateIdx ?? 0)
  const [party, setParty] = useState(initial.party ?? 2)
  const [time, setTime] = useState(initial.time ?? null)
  const [saved, setSaved] = useState(null)
  // Champs pré-remplis (démo, non validés).
  const [name, setName] = useState('Sara El Amrani')
  const [phone, setPhone] = useState('+212 6 12 34 56 78')
  const [note, setNote] = useState('')
  const persistedRef = useRef(false)

  const persist = async (t = time) => {
    if (persistedRef.current) return
    persistedRef.current = true
    const { data } = await onPersist({
      restaurantId: r.id, restaurantName: r.name, date: dates[dateIdx], time: t || r.slots[0], party,
      name, phone, note,
    })
    setSaved(data)
    onToast?.('Réservation enregistrée ✓')
  }

  // Assistant : confirmation automatique de bout en bout.
  useEffect(() => {
    if (autoConfirm) {
      const t = initial.time || r.slots[0]
      setTime(t)
      persist(t).then(() => setStep(3))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const goConfirm = async () => { await persist(); setStep(3) }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}
      className="fixed inset-0 z-[85] grid place-items-center p-4" style={{ background: 'rgba(58,42,26,.6)', backdropFilter: 'blur(5px)' }}>
      <motion.div initial={{ scale: .95, y: 20, opacity: 0 }} animate={{ scale: 1, y: 0, opacity: 1 }} exit={{ scale: .95, opacity: 0 }}
        transition={{ type: 'spring', damping: 26, stiffness: 240 }} onClick={e => e.stopPropagation()}
        className="bg-card rounded-3xl overflow-hidden flex flex-col" style={{ width: 440, maxWidth: '100%', maxHeight: '92vh', boxShadow: '0 40px 90px -24px rgba(58,42,26,.6)' }}>

        {/* en-tête + progression */}
        <div className="px-5 pt-5 pb-4" style={{ background: OLIVE }}>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              {step > 1 && step < 3 && (
                <button onClick={() => setStep(s => s - 1)} className="grid place-items-center rounded-full bg-white/20" style={{ width: 28, height: 28 }}><ChevronLeft size={16} color="#fff" /></button>
              )}
              <div className="font-head font-bold text-white" style={{ fontSize: 16 }}>{r.name}</div>
            </div>
            <button onClick={onClose} className="grid place-items-center rounded-full bg-white/20" style={{ width: 30, height: 30 }}><X size={16} color="#fff" /></button>
          </div>
          <div className="flex items-center gap-2">
            {STEPS.map((label, i) => {
              const n = i + 1
              const done = step > n, cur = step === n
              return (
                <div key={label} className="flex items-center gap-2 flex-1">
                  <div className="flex items-center gap-1.5">
                    <span className="grid place-items-center rounded-full font-head font-bold" style={{ width: 22, height: 22, fontSize: 11, background: done || cur ? '#fff' : 'rgba(255,255,255,.25)', color: done || cur ? OLIVE_D : '#fff' }}>
                      {done ? <Check size={13} /> : n}
                    </span>
                    <span className="font-head" style={{ fontSize: 11, fontWeight: 600, color: cur ? '#fff' : 'rgba(255,255,255,.7)' }}>{label}</span>
                  </div>
                  {n < STEPS.length && <div className="flex-1 rounded-full" style={{ height: 2, background: step > n ? '#fff' : 'rgba(255,255,255,.25)' }} />}
                </div>
              )
            })}
          </div>
        </div>

        <div className="overflow-y-auto p-5">
          <AnimatePresence mode="wait">
            {/* ÉTAPE 1 — Créneau */}
            {step === 1 && (
              <motion.div key="s1" initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }} transition={{ duration: .22 }}>
                <div className="font-head font-semibold text-muted mb-1.5" style={{ fontSize: 12 }}>Date</div>
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {dates.map((d, i) => (
                    <button key={d} onClick={() => setDateIdx(i)} className="font-head rounded-lg px-3 py-2 transition-colors"
                      style={{ fontSize: 12.5, fontWeight: 600, background: dateIdx === i ? OLIVE : '#fff', color: dateIdx === i ? '#fff' : '#6A5746', border: dateIdx === i ? 'none' : '1px solid rgba(58,42,26,.12)' }}>{d}</button>
                  ))}
                </div>
                <div className="font-head font-semibold text-muted mb-1.5" style={{ fontSize: 12 }}>Convives</div>
                <div className="flex items-center gap-2 mb-4">
                  <button onClick={() => setParty(p => Math.max(1, p - 1))} className="grid place-items-center rounded-lg" style={{ width: 34, height: 34, background: 'rgba(111,143,69,.12)' }}><Minus size={15} color={OLIVE_D} /></button>
                  <span className="font-head font-semibold text-cacao flex-1 text-center" style={{ fontSize: 15 }}>{party} personne{party > 1 ? 's' : ''}</span>
                  <button onClick={() => setParty(p => Math.min(10, p + 1))} className="grid place-items-center rounded-lg" style={{ width: 34, height: 34, background: 'rgba(111,143,69,.12)' }}><Plus size={15} color={OLIVE_D} /></button>
                </div>
                <div className="font-head font-semibold text-muted mb-1.5" style={{ fontSize: 12 }}>Créneau</div>
                <div className="flex flex-wrap gap-2 mb-6">
                  {[...(r.slots || []).map(s => ({ s, full: false })), ...(r.slotsFull || []).map(s => ({ s, full: true }))]
                    .sort((a, b) => a.s.localeCompare(b.s))
                    .map(({ s, full }) => full ? (
                      <span key={s} title="Complet" className="font-head rounded-xl px-4 py-2.5"
                        style={{ fontSize: 13.5, fontWeight: 600, color: '#B8A893', background: '#F4EDE0', border: '1px dashed rgba(58,42,26,.16)', textDecoration: 'line-through', cursor: 'not-allowed' }}>{s}</span>
                    ) : (
                      <button key={s} onClick={() => setTime(s)} className="font-head rounded-xl px-4 py-2.5 transition-all"
                        style={{ fontSize: 13.5, fontWeight: 600, background: time === s ? OLIVE : '#fff', color: time === s ? '#fff' : '#6A5746', border: time === s ? 'none' : '1px solid rgba(58,42,26,.12)' }}>{s}</button>
                    ))}
                </div>
                <button onClick={() => time && setStep(2)} disabled={!time} className="w-full font-head font-semibold rounded-xl py-3.5 text-white transition-all"
                  style={{ fontSize: 15, background: time ? OLIVE : '#cdbfa8', cursor: time ? 'pointer' : 'not-allowed', boxShadow: time ? '0 14px 28px -12px rgba(111,143,69,.7)' : 'none' }}>
                  {time ? 'Continuer' : 'Choisissez un créneau'}
                </button>
              </motion.div>
            )}

            {/* ÉTAPE 2 — Vos informations */}
            {step === 2 && (
              <motion.div key="s2" initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }} transition={{ duration: .22 }}>
                <div className="rounded-xl p-3 mb-4 flex items-center gap-2 font-head" style={{ background: 'rgba(111,143,69,.1)', fontSize: 12.5, color: OLIVE_D, fontWeight: 600 }}>
                  {dates[dateIdx]} · {time} · {party} pers.
                </div>
                {[
                  { label: 'Nom', icon: User, val: name, set: setName, ph: 'Votre nom' },
                  { label: 'Téléphone', icon: Phone, val: phone, set: setPhone, ph: '+212 …' },
                ].map(f => (
                  <div key={f.label} className="mb-3">
                    <div className="font-head font-semibold text-muted mb-1.5" style={{ fontSize: 12 }}>{f.label}</div>
                    <div className="flex items-center gap-2 bg-white rounded-xl px-3.5 py-3" style={{ border: '1px solid rgba(58,42,26,.12)' }}>
                      <f.icon size={16} color={OLIVE} />
                      <input value={f.val} onChange={e => f.set(e.target.value)} placeholder={f.ph} className="bg-transparent outline-none flex-1 text-cacao" style={{ fontSize: 14 }} />
                    </div>
                  </div>
                ))}
                <div className="mb-6">
                  <div className="font-head font-semibold text-muted mb-1.5" style={{ fontSize: 12 }}>Demande spéciale (facultatif)</div>
                  <div className="flex items-start gap-2 bg-white rounded-xl px-3.5 py-3" style={{ border: '1px solid rgba(58,42,26,.12)' }}>
                    <MessageSquare size={16} color={OLIVE} style={{ marginTop: 2 }} />
                    <textarea value={note} onChange={e => setNote(e.target.value)} rows={2} placeholder="Allergie, table en terrasse, occasion…" className="bg-transparent outline-none flex-1 text-cacao resize-none" style={{ fontSize: 14 }} />
                  </div>
                </div>
                <button onClick={goConfirm} className="w-full font-head font-semibold rounded-xl py-3.5 text-white transition-all hover:-translate-y-0.5"
                  style={{ fontSize: 15, background: OLIVE, boxShadow: '0 14px 28px -12px rgba(111,143,69,.7)' }}>
                  Confirmer la réservation
                </button>
              </motion.div>
            )}

            {/* ÉTAPE 3 — Confirmation */}
            {step === 3 && (
              <motion.div key="s3" initial={{ opacity: 0, scale: .96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: .25 }} className="text-center">
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', delay: .1 }}
                  className="mx-auto grid place-items-center rounded-full mb-4" style={{ width: 72, height: 72, background: 'rgba(111,143,69,.15)' }}>
                  <div className="grid place-items-center rounded-full" style={{ width: 52, height: 52, background: OLIVE }}><Check size={28} color="#fff" /></div>
                </motion.div>
                <div className="font-head font-extrabold text-cacao mb-1" style={{ fontSize: 22 }}>Réservation confirmée</div>
                <p className="text-muted mb-4" style={{ fontSize: 14, lineHeight: 1.5 }}>
                  <b className="text-cacao">{r.name}</b><br />{(saved?.date) || dates[dateIdx]} à {(saved?.time) || time} · {(saved?.party) || party} personne{((saved?.party) || party) > 1 ? 's' : ''}
                </p>
                <div className="rounded-2xl p-3.5 mb-3 flex items-center justify-center gap-2" style={{ background: 'rgba(242,184,75,.18)' }}>
                  <Award size={18} color="#C98A1B" />
                  <span className="font-head font-bold" style={{ fontSize: 14, color: '#9C6B12' }}>+150 points OKLA</span>
                </div>
                <div className="rounded-xl p-3 mb-5 font-head" style={{ background: 'rgba(111,143,69,.1)', fontSize: 12.5, color: OLIVE_D, fontWeight: 600 }}>
                  Un rappel vous sera envoyé avant l’heure.
                </div>
                <div className="flex gap-2.5">
                  <button onClick={() => onToast?.('Ajouté à votre calendrier 📅')} className="flex-1 flex items-center justify-center gap-2 font-head font-semibold rounded-xl py-3 transition-colors"
                    style={{ fontSize: 13.5, color: OLIVE_D, background: '#fff', border: `1.5px solid ${OLIVE}` }}>
                    <CalendarPlus size={16} /> Calendrier
                  </button>
                  <button onClick={onClose} className="flex-1 font-head font-semibold rounded-xl py-3 text-white" style={{ fontSize: 14, background: CACAO }}>Terminé</button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>
  )
}
