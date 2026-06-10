import { motion } from 'framer-motion'
import { Sparkles } from 'lucide-react'
import { chatThread } from '../data'

const container = { hidden: {}, show: { transition: { staggerChildren: .7 } } }
const bubble = { hidden: { opacity: 0, y: 14, scale: .96 }, show: { opacity: 1, y: 0, scale: 1, transition: { duration: .45, ease: [.2,.7,.2,1] } } }

export default function Chatbot() {
  return (
    <section className="max-w-[1240px] mx-auto px-5 sm:px-10 lg:px-16 py-20 grid lg:grid-cols-2 gap-12 items-center">
      <motion.div initial="hidden" whileInView="show" viewport={{ once: true, amount: .4 }} variants={container}
        className="order-2 lg:order-1 rounded-[28px] p-5 sm:p-7" style={{ background: '#FFFCF6', border: '1px solid rgba(58,42,26,.07)', boxShadow: '0 24px 60px -26px rgba(58,42,26,.4)' }}>
        <div className="flex items-center gap-2.5 mb-5 pb-4" style={{ borderBottom: '1px solid rgba(58,42,26,.07)' }}>
          <div style={{ width: 34, height: 34, borderRadius: 10, background: '#6F8F45', display: 'grid', placeItems: 'center' }}>
            <Sparkles size={18} color="#fff" />
          </div>
          <div><div className="font-head font-bold text-cacao" style={{ fontSize: 14 }}>Assistant OKLA</div>
            <div style={{ fontSize: 11, color: '#6F8F45' }}>● en ligne</div></div>
        </div>
        <div className="flex flex-col gap-3">
          {chatThread.map((m, i) => (
            <motion.div key={i} variants={bubble} className={m.from === 'user' ? 'self-end' : 'self-start'}
              style={{ maxWidth: '82%', padding: '11px 15px', borderRadius: 16, fontSize: 14, lineHeight: 1.45,
                background: m.from === 'user' ? '#D96C3B' : '#F3EAD9',
                color: m.from === 'user' ? '#fff' : '#3A2A1A',
                borderBottomRightRadius: m.from === 'user' ? 5 : 16, borderBottomLeftRadius: m.from === 'user' ? 16 : 5 }}>
              {m.text}
            </motion.div>
          ))}
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: .7 }} className="order-1 lg:order-2">
        <div className="inline-flex items-center gap-2 font-head font-semibold rounded-full px-3.5 py-1.5 mb-5"
          style={{ fontSize: 12, letterSpacing: 2, color: '#D96C3B', background: 'rgba(217,108,59,.10)' }}>
          <Sparkles size={14} /> INTELLIGENCE ARTIFICIELLE
        </div>
        <h2 className="font-head font-extrabold text-cacao mb-4" style={{ fontSize: 'clamp(28px,3.5vw,40px)', letterSpacing: '-1px', lineHeight: 1.08 }}>
          Un assistant qui<br />vous comprend.
        </h2>
        <p style={{ color: '#5A4838', fontSize: 16, lineHeight: 1.6, maxWidth: 440 }} className="mb-6">
          Propulsé par un modèle de langage couplé à une architecture <b>RAG</b>, l’assistant recommande des plats, réserve une table et suit vos commandes — à partir de données réelles et actualisées, sans réponses inventées.
        </p>
        <div className="rounded-2xl p-4 flex items-start gap-3" style={{ background: 'rgba(111,143,69,.12)' }}>
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#6F8F45', marginTop: 6, flex: 'none' }} />
          <p style={{ fontSize: 13, color: '#4f6a2e', lineHeight: 1.5 }}>
            <b className="font-head">Cadre PFE</b> — l’assistant est entièrement conçu et modélisé (architecture RAG) ; sa réalisation logicielle dépasse le périmètre du projet.
          </p>
        </div>
      </motion.div>
    </section>
  )
}
