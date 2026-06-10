import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Home, CalendarCheck, MapPin, MessageCircle, Search, Star, ArrowLeft, Clock, Plus, Sparkles, Send, Check } from 'lucide-react'
import { restaurants, chatThread } from '../data'
import { getRestaurants } from '../api'
import { useCourier } from '../components/useCourier'
import Dish from '../components/Dish'
import Skeleton from '../components/Skeleton'
import StatusPill from '../components/StatusPill'

const cats = ['Tout', 'Marocaine', 'Grillades', 'Méditerranéenne', 'Healthy']

function Screen({ children, k }) {
  return (
    <motion.div key={k} initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -24 }}
      transition={{ duration: .28, ease: [.2,.7,.2,1] }} className="absolute inset-0 overflow-y-auto" style={{ paddingBottom: 70 }}>
      {children}
    </motion.div>
  )
}

// Écran « Suivi » — marqueur piloté par le WebSocket (repli SMIL si hors-ligne).
function TrackScreen() {
  const pathRef = useRef(null)
  const { connected, etaMin, point } = useCourier(pathRef)
  return (
    <Screen k="track">
      <div style={{ padding: '44px 18px 10px' }} className="flex items-center justify-between">
        <span className="font-head font-bold text-cacao">Suivi en temps réel</span>
        <StatusPill />
      </div>
      <div className="mx-[18px] relative overflow-hidden rounded-2xl" style={{ height: 340, background: '#f3ead9', border: '1px solid rgba(58,42,26,.06)' }}>
        <span className="absolute z-10 flex items-center gap-1.5 font-head font-semibold rounded-full" style={{ top: 12, left: 12, fontSize: 11, color: '#fff', background: '#C94C3D', padding: '5px 11px' }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#fff' }} /> EN DIRECT
        </span>
        <svg viewBox="0 0 300 340" preserveAspectRatio="none" className="absolute inset-0 w-full h-full">
          <path ref={pathRef} id="aroute" d="M50 290 C 110 250, 95 180, 160 150 S 250 110, 255 50" fill="none" stroke="#6F8F45" strokeWidth="4.5" strokeDasharray="3 11" strokeLinecap="round" opacity=".9" />
          <circle cx="50" cy="290" r="16" fill="#6F8F45" opacity=".2" /><circle cx="50" cy="290" r="8" fill="#6F8F45" />
          <circle cx="255" cy="50" r="16" fill="#3A2A1A" opacity=".15" /><circle cx="255" cy="50" r="8" fill="#3A2A1A" />
          {connected && point ? (
            <g style={{ transition: 'transform .7s linear' }} transform={`translate(${point.x},${point.y})`}>
              <circle r="19" fill="#D96C3B" opacity=".2" /><circle r="12" fill="#D96C3B" />
            </g>
          ) : (
            <g><circle r="19" fill="#D96C3B" opacity=".2" /><circle r="12" fill="#D96C3B" />
              <animateMotion dur="6s" repeatCount="indefinite" calcMode="linear"><mpath href="#aroute" /></animateMotion></g>
          )}
        </svg>
      </div>
      <div className="mx-[18px] mt-3 bg-white rounded-2xl px-4 py-3.5 flex items-center gap-3" style={{ border: '1px solid rgba(58,42,26,.07)' }}>
        <div style={{ width: 40, height: 40, borderRadius: 12, background: 'rgba(111,143,69,.14)', display: 'grid', placeItems: 'center' }}><MapPin size={19} color="#6F8F45" /></div>
        <div><div className="font-head font-semibold text-cacao" style={{ fontSize: 14 }}>Votre commande arrive</div><div className="text-muted" style={{ fontSize: 12 }}>Karim · OKLA Express</div></div>
        <div className="font-head ml-auto" style={{ fontWeight: 800, color: '#6F8F45', fontSize: 17 }}>{connected && etaMin != null ? etaMin : 9} min</div>
      </div>
    </Screen>
  )
}

export default function AppDemo() {
  const [screen, setScreen] = useState('home')
  const [sel, setSel] = useState(restaurants[0])
  const [list, setList] = useState([])
  const [loading, setLoading] = useState(true)
  const go = (s, r) => { if (r) setSel(r); setScreen(s) }

  useEffect(() => {
    let alive = true
    getRestaurants().then(({ data }) => {
      if (!alive) return
      setList(data)
      setSel(s => s || data[0])
      setLoading(false)
    })
    return () => { alive = false }
  }, [])

  const Tab = ({ id, icon: Ic, label }) => (
    <button onClick={() => setScreen(id)} className="flex flex-col items-center gap-1 flex-1 py-1" style={{ color: screen === id ? '#6F8F45' : '#9C8B79' }}>
      <Ic size={21} /><span className="font-head" style={{ fontSize: 10, fontWeight: 600 }}>{label}</span>
    </button>
  )

  return (
    <main className="min-h-screen flex flex-col items-center justify-center pt-28 pb-16 px-4">
      <p className="text-muted text-center mb-6 font-head" style={{ fontSize: 13, letterSpacing: 1 }}>APERÇU DE L’APPLICATION — cliquez pour naviguer</p>
      <div style={{ width: 340, height: 690, borderRadius: 46, background: '#1f150d', padding: 12, boxShadow: '0 50px 90px -30px rgba(58,42,26,.6)' }}>
        <div className="relative overflow-hidden" style={{ width: '100%', height: '100%', borderRadius: 35, background: '#FFF4E6' }}>
          <div style={{ position: 'absolute', top: 12, left: '50%', transform: 'translateX(-50%)', width: 104, height: 24, background: '#1f150d', borderRadius: '0 0 16px 16px', zIndex: 40 }} />

          <AnimatePresence mode="wait">
            {screen === 'home' && (
              <Screen k="home">
                <div style={{ padding: '40px 18px 8px' }}>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-muted" style={{ fontSize: 11 }}>Livrer à</div>
                      <div className="font-head font-bold text-cacao flex items-center gap-1" style={{ fontSize: 16 }}><MapPin size={15} color="#6F8F45" /> Tanger · Marshan</div>
                    </div>
                    <StatusPill />
                  </div>
                </div>
                <div style={{ padding: '6px 18px' }}>
                  <div className="flex items-center gap-2 bg-white rounded-2xl px-3.5 py-3" style={{ border: '1px solid rgba(58,42,26,.08)' }}>
                    <Search size={17} color="#9C8B79" /><span className="text-muted" style={{ fontSize: 13 }}>Rechercher un plat, un restaurant…</span>
                  </div>
                </div>
                <div className="flex gap-2 overflow-x-auto px-[18px] py-3" style={{ scrollbarWidth: 'none' }}>
                  {cats.map((c, i) => (
                    <span key={c} className="font-head whitespace-nowrap rounded-full px-3.5 py-1.5" style={{ fontSize: 12, fontWeight: 600,
                      background: i === 0 ? '#6F8F45' : '#fff', color: i === 0 ? '#fff' : '#6A5746', border: i === 0 ? 'none' : '1px solid rgba(58,42,26,.1)' }}>{c}</span>
                  ))}
                </div>
                <div className="font-head font-bold text-cacao" style={{ padding: '6px 18px', fontSize: 15 }}>Populaires près de vous</div>
                <div style={{ padding: '4px 18px' }}>
                  {loading
                    ? Array.from({ length: 3 }).map((_, i) => (
                        <div key={i} className="mb-3 bg-white rounded-2xl overflow-hidden" style={{ border: '1px solid rgba(58,42,26,.07)' }}>
                          <Skeleton style={{ height: 96, borderRadius: 0 }} />
                          <div style={{ padding: '10px 12px' }}>
                            <Skeleton style={{ height: 13, width: '65%', marginBottom: 7 }} />
                            <Skeleton style={{ height: 11, width: '45%' }} />
                          </div>
                        </div>
                      ))
                    : list.map(r => (
                        <button key={r.id || r.name} onClick={() => go('detail', r)} className="w-full text-left mb-3 bg-white rounded-2xl overflow-hidden block" style={{ border: '1px solid rgba(58,42,26,.07)' }}>
                          <Dish src={r.img} from={r.from} to={r.to} style={{ height: 96 }} />
                          <div style={{ padding: '10px 12px' }}>
                            <div className="font-head font-bold text-cacao" style={{ fontSize: 14 }}>{r.name}</div>
                            <div className="text-muted" style={{ fontSize: 11, margin: '2px 0 7px' }}>{r.cuisine}</div>
                            <div className="flex items-center gap-3" style={{ fontSize: 11.5, color: '#6A5746' }}>
                              <span className="flex items-center gap-1 font-semibold text-cacao"><Star size={12} fill="#F2B84B" color="#F2B84B" />{r.rating}</span>
                              <span className="flex items-center gap-1"><Clock size={11} />{r.time}</span>
                              <span style={{ marginLeft: 'auto', color: '#6F8F45', fontWeight: 600 }}>Ouvert</span>
                            </div>
                          </div>
                        </button>
                      ))}
                </div>
              </Screen>
            )}

            {screen === 'detail' && (
              <Screen k="detail">
                <Dish src={sel.img} from={sel.from} to={sel.to} className="relative" style={{ height: 180 }}>
                  <button onClick={() => setScreen('home')} className="absolute grid place-items-center bg-white rounded-full" style={{ top: 44, left: 16, width: 38, height: 38, zIndex: 1 }}><ArrowLeft size={18} color="#3A2A1A" /></button>
                </Dish>
                <div style={{ padding: '16px 18px' }}>
                  <div className="font-head font-extrabold text-cacao" style={{ fontSize: 21 }}>{sel.name}</div>
                  <div className="text-muted" style={{ fontSize: 12.5, margin: '4px 0 10px' }}>{sel.cuisine}</div>
                  <div className="flex items-center gap-4" style={{ fontSize: 12.5, color: '#6A5746' }}>
                    <span className="flex items-center gap-1 font-semibold text-cacao"><Star size={13} fill="#F2B84B" color="#F2B84B" />{sel.rating} ({sel.reviews})</span>
                    <span className="flex items-center gap-1"><Clock size={12} />{sel.time}</span>
                    <span style={{ color: '#6F8F45', fontWeight: 600 }}>● Ouvert</span>
                  </div>
                  <div className="flex gap-2.5 my-5">
                    <button onClick={() => setScreen('reserve')} className="flex-1 font-head font-semibold rounded-xl py-3 text-white" style={{ fontSize: 14, background: '#6F8F45' }}>Réserver</button>
                    <button onClick={() => setScreen('track')} className="flex-1 font-head font-semibold rounded-xl py-3 text-white" style={{ fontSize: 14, background: '#D96C3B' }}>Commander</button>
                  </div>
                  <div className="font-head font-bold text-cacao mb-2" style={{ fontSize: 15 }}>Au menu</div>
                  {[['Tajine poulet & citron confit', '78 DH'], ['Couscous royal', '95 DH'], ['Pastilla au poulet', '65 DH']].map(([n, p]) => (
                    <div key={n} className="flex items-center justify-between bg-white rounded-xl px-3.5 py-3 mb-2.5" style={{ border: '1px solid rgba(58,42,26,.07)' }}>
                      <div><div className="text-cacao" style={{ fontSize: 13.5, fontWeight: 500 }}>{n}</div><div style={{ fontSize: 12, color: '#D96C3B', fontWeight: 600 }}>{p}</div></div>
                      <button className="grid place-items-center rounded-lg" style={{ width: 30, height: 30, background: 'rgba(217,108,59,.12)' }}><Plus size={16} color="#D96C3B" /></button>
                    </div>
                  ))}
                </div>
              </Screen>
            )}

            {screen === 'reserve' && (
              <Screen k="reserve">
                <div style={{ padding: '44px 18px 8px' }} className="flex items-center gap-2">
                  <button onClick={() => setScreen('detail')} className="grid place-items-center bg-white rounded-full" style={{ width: 36, height: 36, border: '1px solid rgba(58,42,26,.08)' }}><ArrowLeft size={17} color="#3A2A1A" /></button>
                  <div className="font-head font-bold text-cacao" style={{ fontSize: 17 }}>Réserver une table</div>
                </div>
                <div style={{ padding: '10px 18px' }}>
                  <div className="text-muted mb-4" style={{ fontSize: 12.5 }}>{sel.name}</div>
                  {[['Date', 'Ven. 12 juin'], ['Heure', '20:00'], ['Personnes', '2 personnes']].map(([l, v]) => (
                    <div key={l} className="flex items-center justify-between bg-white rounded-xl px-4 py-3.5 mb-3" style={{ border: '1px solid rgba(58,42,26,.08)' }}>
                      <span className="text-muted" style={{ fontSize: 12.5 }}>{l}</span>
                      <span className="font-head font-semibold text-cacao" style={{ fontSize: 14 }}>{v}</span>
                    </div>
                  ))}
                  <div className="grid grid-cols-4 gap-2 my-4">
                    {['19:00', '19:30', '20:00', '20:30'].map((t, i) => (
                      <span key={t} className="font-head text-center rounded-lg py-2" style={{ fontSize: 12, fontWeight: 600,
                        background: i === 2 ? '#6F8F45' : '#fff', color: i === 2 ? '#fff' : '#6A5746', border: i === 2 ? 'none' : '1px solid rgba(58,42,26,.1)' }}>{t}</span>
                    ))}
                  </div>
                  <button onClick={() => setScreen('reserved')} className="w-full font-head font-semibold rounded-xl py-3.5 text-white mt-2" style={{ fontSize: 15, background: '#6F8F45', boxShadow: '0 12px 26px -12px rgba(111,143,69,.7)' }}>Confirmer la réservation</button>
                </div>
              </Screen>
            )}

            {screen === 'reserved' && (
              <Screen k="reserved">
                <div className="flex flex-col items-center justify-center h-full text-center px-6 pb-10">
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', delay: .1 }}
                    className="grid place-items-center rounded-full mb-5" style={{ width: 80, height: 80, background: 'rgba(111,143,69,.15)' }}>
                    <div className="grid place-items-center rounded-full" style={{ width: 58, height: 58, background: '#6F8F45' }}><Check size={28} color="#fff" /></div>
                  </motion.div>
                  <div className="font-head font-extrabold text-cacao mb-2" style={{ fontSize: 20 }}>Réservation confirmée !</div>
                  <div className="text-muted mb-1" style={{ fontSize: 13 }}>{sel.name}</div>
                  <div className="text-muted mb-6" style={{ fontSize: 13 }}>Ven. 12 juin · 20:00 · 2 personnes</div>
                  <div className="rounded-2xl p-3.5 mb-6 flex items-center gap-2 justify-center w-full" style={{ background: 'rgba(111,143,69,.1)' }}>
                    <Clock size={14} color="#6F8F45" /><span style={{ fontSize: 12, color: '#5E7A39', fontWeight: 600 }}>Un rappel vous sera envoyé avant l'heure.</span>
                  </div>
                  <button onClick={() => setScreen('home')} className="w-full font-head font-semibold rounded-xl py-3 text-white" style={{ fontSize: 15, background: '#3A2A1A' }}>Retour à l'accueil</button>
                </div>
              </Screen>
            )}

            {screen === 'track' && <TrackScreen />}

            {screen === 'chat' && (
              <Screen k="chat">
                <div style={{ padding: '44px 18px 12px' }} className="flex items-center gap-2.5" >
                  <div style={{ width: 34, height: 34, borderRadius: 10, background: '#6F8F45', display: 'grid', placeItems: 'center' }}><Sparkles size={17} color="#fff" /></div>
                  <div><div className="font-head font-bold text-cacao" style={{ fontSize: 15 }}>Assistant OKLA</div><div style={{ fontSize: 11, color: '#6F8F45' }}>● en ligne</div></div>
                </div>
                <div className="flex flex-col gap-2.5" style={{ padding: '4px 18px' }}>
                  {chatThread.map((m, i) => (
                    <div key={i} className={m.from === 'user' ? 'self-end' : 'self-start'} style={{ maxWidth: '84%', padding: '10px 14px', borderRadius: 15, fontSize: 13.5, lineHeight: 1.45,
                      background: m.from === 'user' ? '#D96C3B' : '#F3EAD9', color: m.from === 'user' ? '#fff' : '#3A2A1A',
                      borderBottomRightRadius: m.from === 'user' ? 4 : 15, borderBottomLeftRadius: m.from === 'user' ? 15 : 4 }}>{m.text}</div>
                  ))}
                </div>
                <div className="absolute left-0 right-0 flex items-center gap-2 px-[18px]" style={{ bottom: 72 }}>
                  <div className="flex-1 bg-white rounded-full px-4 py-2.5 text-muted" style={{ fontSize: 13, border: '1px solid rgba(58,42,26,.1)' }}>Écrire un message…</div>
                  <button className="grid place-items-center rounded-full" style={{ width: 40, height: 40, background: '#6F8F45' }}><Send size={17} color="#fff" /></button>
                </div>
              </Screen>
            )}
          </AnimatePresence>

          <div className="absolute bottom-0 inset-x-0 flex bg-white px-3 pt-2 pb-3" style={{ borderTop: '1px solid rgba(58,42,26,.08)' }}>
            <Tab id="home" icon={Home} label="Accueil" />
            <Tab id="reserve" icon={CalendarCheck} label="Réserver" />
            <Tab id="track" icon={MapPin} label="Suivi" />
            <Tab id="chat" icon={MessageCircle} label="Assistant" />
          </div>
        </div>
      </div>
    </main>
  )
}
