import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import PhoneTracking from '../components/PhoneTracking'
import Dish from '../components/Dish'
import { restaurants } from '../data'

const up = { hidden: { opacity: 0, y: 26 }, show: i => ({ opacity: 1, y: 0, transition: { delay: .05 + i * .12, duration: .8, ease: [.2,.7,.2,1] } }) }
const float = (d, y) => ({ y: [0, y, 0], transition: { duration: d, repeat: Infinity, ease: 'easeInOut' } })

export default function Hero() {
  return (
    <section className="max-w-[1240px] mx-auto px-5 sm:px-10 lg:px-16 pt-28 sm:pt-32 lg:pt-36 pb-16 grid lg:grid-cols-[1.05fr_.95fr] gap-10 items-center">
      <div className="text-center lg:text-left">
        <motion.div custom={0} variants={up} initial="hidden" animate="show"
          className="inline-flex items-center gap-2.5 font-head font-semibold rounded-full px-3.5 py-2 mb-6"
          style={{ fontSize: 12.5, letterSpacing: '2.5px', color: '#D96C3B', background: 'rgba(217,108,59,.10)' }}>
          <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#6F8F45', boxShadow: '0 0 0 4px rgba(111,143,69,.18)' }} />
          PLATEFORME MAROCAINE DE RESTAURATION
        </motion.div>
        <motion.h1 custom={1} variants={up} initial="hidden" animate="show"
          className="font-head font-extrabold text-cacao mb-5"
          style={{ fontSize: 'clamp(38px,5.4vw,62px)', lineHeight: 1.02, letterSpacing: '-1.5px' }}>
          Toute la gastronomie<br />marocaine, <span style={{ color: '#D96C3B' }}>en un geste.</span>
        </motion.h1>
        <motion.p custom={2} variants={up} initial="hidden" animate="show"
          className="mx-auto lg:mx-0 mb-8" style={{ fontSize: 'clamp(15px,1.6vw,18px)', lineHeight: 1.6, color: '#5A4838', maxWidth: 480 }}>
          Découvrez les meilleurs restaurants, réservez votre table, commandez en ligne et suivez votre livraison en temps réel — le tout dans une seule application.
        </motion.p>
        <motion.div custom={3} variants={up} initial="hidden" animate="show" className="flex gap-3.5 flex-wrap items-center justify-center lg:justify-start">
          <Link to="/reservation" className="font-head font-semibold text-white rounded-xl transition-all hover:-translate-y-0.5 inline-block"
            style={{ fontSize: 15, background: '#6F8F45', padding: '15px 26px', boxShadow: '0 12px 28px -10px rgba(111,143,69,.7)' }}>
            Réserver une table
          </Link>
          <Link to="/app" className="font-head font-semibold rounded-xl transition-all hover:bg-terracotta/5"
            style={{ fontSize: 15, color: '#D96C3B', border: '1.5px solid rgba(217,108,59,.4)', padding: '14px 24px' }}>
            Voir l’app
          </Link>
        </motion.div>
        <motion.div custom={4} variants={up} initial="hidden" animate="show" className="flex items-center gap-3 mt-8 justify-center lg:justify-start" style={{ fontSize: 13.5, color: '#8B7A68' }}>
          <div className="flex">
            {['linear-gradient(135deg,#D96C3B,#F2B84B)','linear-gradient(135deg,#6F8F45,#9bbf6a)','linear-gradient(135deg,#3A2A1A,#6b4f37)'].map((b,i)=>(
              <span key={i} style={{ width: 32, height: 32, borderRadius: '50%', border: '2.5px solid #FFF4E6', marginLeft: i?-10:0, background: b }} />
            ))}
          </div>
          <div><span style={{ color: '#F2B84B', letterSpacing: 2 }}>★★★★★</span> <b className="text-cacao">4.6</b> · des milliers de plats près de chez vous</div>
        </motion.div>
      </div>

      <motion.div initial={{ opacity: 0, y: 40, scale: .97 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ delay: .35, duration: 1.1, ease: [.2,.7,.2,1] }}
        className="relative h-[560px] flex items-center justify-center">
        <div className="absolute" style={{ width: 380, height: 380, borderRadius: '50%', background: 'radial-gradient(circle,rgba(217,108,59,.32),transparent 70%)', filter: 'blur(20px)' }} />

        <motion.div animate={float(7, -16)} className="absolute z-20 overflow-hidden bg-card rounded-2xl shadow-soft"
          style={{ width: 208, top: 46, left: -10, border: '1px solid rgba(58,42,26,.05)' }}>
          <Dish src={restaurants[0].img} from="#c9622f" to="#8f4a2a" style={{ height: 84 }} />
          <div className="p-3">
            <div className="font-head" style={{ fontWeight: 700, fontSize: 13.5, color: '#3A2A1A' }}>Le Jardin Marrakech</div>
            <div style={{ fontSize: 11, color: '#8B7A68', margin: '2px 0 8px' }}>Marocaine · Traditionnelle</div>
            <div className="flex items-center justify-between">
              <div style={{ fontSize: 11.5, fontWeight: 600, color: '#3A2A1A' }}><span style={{ color: '#F2B84B' }}>★</span> 4.6 (128)</div>
              <div className="font-head text-white" style={{ fontWeight: 600, fontSize: 11, background: '#D96C3B', padding: '6px 11px', borderRadius: 9 }}>Réserver</div>
            </div>
          </div>
        </motion.div>

        <motion.div animate={float(6, 13)} className="absolute z-20 bg-card rounded-2xl shadow-soft flex gap-2.5 items-center"
          style={{ top: 18, right: -10, padding: '11px 15px', border: '1px solid rgba(58,42,26,.05)' }}>
          <div className="font-head" style={{ fontWeight: 800, fontSize: 20, color: '#3A2A1A' }}>4.6</div>
          <div><div style={{ fontSize: 11, color: '#F2B84B', letterSpacing: 1 }}>★★★★★</div><div style={{ fontSize: 10, color: '#8B7A68' }}>128 avis</div></div>
        </motion.div>

        <motion.div animate={float(8, -12)} className="absolute z-20 bg-card rounded-2xl shadow-soft flex gap-2.5 items-start"
          style={{ bottom: 86, right: -14, maxWidth: 210, padding: '12px 14px', border: '1px solid rgba(58,42,26,.05)' }}>
          <div style={{ width: 30, height: 30, borderRadius: 9, background: '#6F8F45', flex: 'none', display: 'grid', placeItems: 'center' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="#fff"><path d="M12 2a2 2 0 0 1 2 2v1h3a3 3 0 0 1 3 3v8a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3V8a3 3 0 0 1 3-3h3V4a2 2 0 0 1 2-2zM8.5 11a1.3 1.3 0 1 0 0 2.6 1.3 1.3 0 0 0 0-2.6zm7 0a1.3 1.3 0 1 0 0 2.6 1.3 1.3 0 0 0 0-2.6z"/></svg>
          </div>
          <div style={{ fontSize: 12, lineHeight: 1.4, color: '#3A2A1A' }}>
            <b className="font-head" style={{ color: '#6F8F45', display: 'block', fontSize: 10.5, letterSpacing: .5, marginBottom: 2 }}>ASSISTANT OKLA</b>
            Envie de tajine ce soir ? J’ai 3 adresses parfaites près de vous.
          </div>
        </motion.div>

        <div className="relative z-10"><PhoneTracking /></div>
      </motion.div>
    </section>
  )
}
