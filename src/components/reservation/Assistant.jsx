import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, Send, X, FileText, Zap } from 'lucide-react'
import { answer, SUGGESTIONS } from '../../assistant/engine'

const OLIVE = '#6F8F45', OLIVE_D = '#5E7A39', TER = '#D96C3B', CACAO = '#3A2A1A'

/* Bulle bot : révélation mot-à-mot façon LLM, puis puces « sources » (RAG). */
function BotBubble({ text, sources, onDone }) {
  const words = useRef(text.split(' '))
  const [n, setN] = useState(0)
  const done = n >= words.current.length

  useEffect(() => {
    if (done) { onDone?.(); return }
    const t = setTimeout(() => setN(v => v + 1), 34 + Math.random() * 40)
    return () => clearTimeout(t)
  }, [n, done, onDone])

  return (
    <div className="self-start flex gap-2 max-w-[88%]">
      <div className="grid place-items-center rounded-full flex-none mt-0.5"
        style={{ width: 26, height: 26, background: 'rgba(111,143,69,.15)' }}>
        <Sparkles size={13} color={OLIVE_D} />
      </div>
      <div>
        <div style={{ background: '#F1E7D6', color: CACAO, padding: '10px 13px', borderRadius: 15, borderTopLeftRadius: 4, fontSize: 13.5, lineHeight: 1.5 }}>
          {words.current.slice(0, n).join(' ')}
          {!done && <span className="okla-caret" />}
        </div>
        {done && sources && (
          <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}
            className="flex flex-wrap gap-1.5 mt-1.5 pl-1">
            <span className="font-head" style={{ fontSize: 9.5, fontWeight: 700, color: '#A89884', letterSpacing: 1, alignSelf: 'center' }}>SOURCES</span>
            {sources.map((s, i) => (
              <span key={i} className="inline-flex items-center gap-1 rounded-full"
                style={{ fontSize: 10, fontWeight: 600, color: OLIVE_D, background: 'rgba(111,143,69,.1)', border: '1px solid rgba(111,143,69,.22)', padding: '2.5px 8px' }}>
                <FileText size={9} /> {s}
              </span>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  )
}

function TypingDots() {
  return (
    <div className="self-start flex gap-2 max-w-[88%]">
      <div className="grid place-items-center rounded-full flex-none mt-0.5"
        style={{ width: 26, height: 26, background: 'rgba(111,143,69,.15)' }}>
        <Sparkles size={13} color={OLIVE_D} />
      </div>
      <div className="flex items-center gap-1.5" style={{ background: '#F1E7D6', padding: '13px 15px', borderRadius: 15, borderTopLeftRadius: 4 }}>
        {[0, 1, 2].map(i => <span key={i} className="okla-dot" style={{ animationDelay: `${i * 0.16}s` }} />)}
      </div>
    </div>
  )
}

/* ───────────────────────── Assistant conversationnel (scénarisé) ─────────
   On peut TAPER une question en français ou en darija : le moteur (engine.js)
   la reconnaît, répond dans la même langue, affiche ses « sources » (RAG)
   et déclenche l'action correspondante sur la page. Aucun vrai LLM. */
export default function Assistant({ list, selectedId, party, time, points, onAction }) {
  const [open, setOpen] = useState(false)
  const [input, setInput] = useState('')
  const [typing, setTyping] = useState(false)
  const [busy, setBusy] = useState(false)
  const [msgs, setMsgs] = useState([{
    role: 'bot', done: true, sources: null,
    text: "Bonjour ! 👋 Je suis l'assistant OKLA. Posez-moi une question en français ou en darija — je peux recommander, vérifier les disponibilités et réserver pour vous.",
  }])
  const [hint, setHint] = useState(0)
  const scrollRef = useRef(null)
  const pendingAction = useRef(null)

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: 9e6, behavior: 'smooth' })
  }, [msgs, typing])

  // Fait tourner doucement les suggestions visibles.
  useEffect(() => {
    if (!open) return
    const t = setInterval(() => setHint(h => h + 1), 6000)
    return () => clearInterval(t)
  }, [open])

  const send = (raw) => {
    const text = (raw ?? input).trim()
    if (!text || busy) return
    setInput('')
    setBusy(true)
    setMsgs(m => [...m, { role: 'user', text, done: true }])
    setTyping(true)
    const res = answer(text, { list, selectedId, party, time, points })
    pendingAction.current = res.action
    // Délai « réflexion » puis streaming de la réponse.
    setTimeout(() => {
      setTyping(false)
      setMsgs(m => [...m, { role: 'bot', text: res.reply, sources: res.sources, done: false }])
      // L'action visuelle part pendant que le bot « écrit » — effet vivant.
      setTimeout(() => { onAction(pendingAction.current); pendingAction.current = null }, 500)
    }, 750 + Math.random() * 450)
  }

  const visible = [SUGGESTIONS[hint % SUGGESTIONS.length], SUGGESTIONS[(hint + 1) % SUGGESTIONS.length], SUGGESTIONS[(hint + 2) % SUGGESTIONS.length]]

  return (
    <>
      {/* bouton flottant */}
      <motion.button initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: .4, type: 'spring' }}
        whileHover={{ scale: 1.06 }} whileTap={{ scale: .94 }}
        onClick={() => setOpen(o => !o)} className="fixed z-50 grid place-items-center rounded-full text-white"
        style={{ bottom: 26, right: 26, width: 62, height: 62, background: `linear-gradient(140deg, ${OLIVE} 0%, ${OLIVE_D} 100%)`, boxShadow: '0 16px 38px -10px rgba(111,143,69,.75)' }}
        aria-label="Assistant OKLA">
        {!open && <span className="okla-ping" style={{ position: 'absolute', inset: 0, borderRadius: '50%', border: `2px solid ${OLIVE}` }} />}
        <AnimatePresence mode="wait">
          {open
            ? <motion.span key="x" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ opacity: 0 }}><X size={25} /></motion.span>
            : <motion.span key="s" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ opacity: 0 }}><Sparkles size={25} /></motion.span>}
        </AnimatePresence>
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0, y: 24, scale: .96 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 24, scale: .96 }}
            transition={{ duration: .28, ease: [0.21, 0.8, 0.32, 1] }}
            className="fixed z-50 flex flex-col bg-card rounded-3xl overflow-hidden"
            style={{ bottom: 102, right: 26, width: 392, maxWidth: 'calc(100vw - 40px)', height: 560, maxHeight: 'calc(100vh - 140px)', boxShadow: '0 34px 80px -22px rgba(58,42,26,.55)', border: '1px solid rgba(58,42,26,.08)' }}>

            {/* en-tête */}
            <div className="relative px-4 py-3.5 overflow-hidden" style={{ background: `linear-gradient(135deg, ${OLIVE} 0%, ${OLIVE_D} 70%)` }}>
              <div style={{ position: 'absolute', top: -34, right: -22, width: 110, height: 110, borderRadius: '50%', background: 'rgba(255,255,255,.08)' }} />
              <div style={{ position: 'absolute', bottom: -44, right: 48, width: 90, height: 90, borderRadius: '50%', background: 'rgba(255,255,255,.06)' }} />
              <div className="relative flex items-center gap-2.5">
                <div className="grid place-items-center rounded-xl bg-white/20" style={{ width: 38, height: 38 }}>
                  <Sparkles size={19} color="#fff" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-head font-bold text-white" style={{ fontSize: 14.5 }}>Assistant OKLA</span>
                    <span className="inline-flex items-center gap-1 font-head rounded-full bg-white/20 text-white" style={{ fontSize: 9, fontWeight: 700, padding: '2px 7px', letterSpacing: .6 }}>
                      <Zap size={8} /> LLM + RAG
                    </span>
                  </div>
                  <div style={{ fontSize: 11, color: 'rgba(255,255,255,.85)' }}>
                    <span style={{ display: 'inline-block', width: 6, height: 6, borderRadius: '50%', background: '#CFE7A8', marginRight: 5, boxShadow: '0 0 6px #CFE7A8' }} />
                    en ligne · français & darija
                  </div>
                </div>
              </div>
            </div>

            {/* fil de discussion */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
              {msgs.map((m, i) => m.role === 'user' ? (
                <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="self-end"
                  style={{ maxWidth: '85%', padding: '10px 13px', borderRadius: 15, borderBottomRightRadius: 4, fontSize: 13.5, lineHeight: 1.5, background: TER, color: '#fff' }}>
                  {m.text}
                </motion.div>
              ) : m.done ? (
                <div key={i} className="self-start flex gap-2 max-w-[88%]">
                  <div className="grid place-items-center rounded-full flex-none mt-0.5" style={{ width: 26, height: 26, background: 'rgba(111,143,69,.15)' }}>
                    <Sparkles size={13} color={OLIVE_D} />
                  </div>
                  <div>
                    <div style={{ background: '#F1E7D6', color: CACAO, padding: '10px 13px', borderRadius: 15, borderTopLeftRadius: 4, fontSize: 13.5, lineHeight: 1.5 }}>{m.text}</div>
                    {m.sources && (
                      <div className="flex flex-wrap gap-1.5 mt-1.5 pl-1">
                        <span className="font-head" style={{ fontSize: 9.5, fontWeight: 700, color: '#A89884', letterSpacing: 1, alignSelf: 'center' }}>SOURCES</span>
                        {m.sources.map((s, j) => (
                          <span key={j} className="inline-flex items-center gap-1 rounded-full"
                            style={{ fontSize: 10, fontWeight: 600, color: OLIVE_D, background: 'rgba(111,143,69,.1)', border: '1px solid rgba(111,143,69,.22)', padding: '2.5px 8px' }}>
                            <FileText size={9} /> {s}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <BotBubble key={i} text={m.text} sources={m.sources}
                  onDone={() => { setMsgs(ms => ms.map((x, j) => j === i ? { ...x, done: true } : x)); setBusy(false) }} />
              ))}
              {typing && <TypingDots />}
            </div>

            {/* suggestions + saisie */}
            <div className="p-3" style={{ borderTop: '1px solid rgba(58,42,26,.08)', background: 'rgba(255,255,255,.6)' }}>
              <div className="flex flex-wrap gap-1.5 mb-2.5">
                <AnimatePresence mode="popLayout">
                  {visible.map(s => (
                    <motion.button key={s} layout initial={{ opacity: 0, scale: .9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: .9 }}
                      onClick={() => send(s)} disabled={busy}
                      className="font-head rounded-full transition-colors hover:bg-olive hover:text-white"
                      style={{ fontSize: 11, fontWeight: 600, color: OLIVE_D, background: 'rgba(111,143,69,.1)', border: '1px solid rgba(111,143,69,.2)', padding: '5px 11px', opacity: busy ? .5 : 1 }}>
                      {s}
                    </motion.button>
                  ))}
                </AnimatePresence>
              </div>
              <div className="flex items-center gap-2">
                <input value={input} onChange={e => setInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && send()}
                  placeholder="Écrivez en français ou en darija…"
                  className="flex-1 rounded-full px-4 py-2.5 text-cacao outline-none"
                  style={{ fontSize: 13, background: '#fff', border: '1.5px solid rgba(58,42,26,.12)' }}
                  onFocus={e => e.currentTarget.style.borderColor = OLIVE}
                  onBlur={e => e.currentTarget.style.borderColor = 'rgba(58,42,26,.12)'} />
                <motion.button whileTap={{ scale: .9 }} onClick={() => send()} disabled={busy}
                  className="grid place-items-center rounded-full flex-none"
                  style={{ width: 40, height: 40, background: input.trim() && !busy ? OLIVE : 'rgba(111,143,69,.35)', transition: 'background .2s' }}
                  aria-label="Envoyer">
                  <Send size={16} color="#fff" />
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
