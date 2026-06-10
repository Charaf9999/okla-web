import { useRef } from 'react'
import { motion } from 'framer-motion'
import { Satellite, Navigation } from 'lucide-react'
import { useCourier } from '../components/useCourier'
import StatusPill from '../components/StatusPill'

export default function LiveTracking() {
  const pathRef = useRef(null)
  const { connected, etaMin, point } = useCourier(pathRef)
  return (
    <section id="livraison" className="max-w-[1240px] mx-auto px-5 sm:px-10 lg:px-16 py-20 grid lg:grid-cols-2 gap-12 items-center">
      <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: .7 }}>
        <div className="inline-flex items-center gap-2 font-head font-semibold rounded-full px-3.5 py-1.5 mb-5"
          style={{ fontSize: 12, letterSpacing: 2, color: '#6F8F45', background: 'rgba(111,143,69,.14)' }}>
          <Satellite size={14} /> TEMPS RÉEL
        </div>
        <h2 className="font-head font-extrabold text-cacao mb-4" style={{ fontSize: 'clamp(28px,3.5vw,40px)', letterSpacing: '-1px', lineHeight: 1.08 }}>
          Suivez votre livreur,<br />kilomètre par kilomètre.
        </h2>
        <p style={{ color: '#5A4838', fontSize: 16, lineHeight: 1.6, maxWidth: 440 }} className="mb-7">
          Dès que la livraison démarre, la position GPS est diffusée en continu via WebSocket et reflétée instantanément sur votre carte. Plus d’incertitude — vous savez exactement quand votre repas arrive.
        </p>
        {[['Position GPS publiée en continu', '#D96C3B'], ['Estimation d’arrivée dynamique', '#6F8F45'], ['Dispatching automatique du meilleur livreur', '#F2B84B']].map(([t, c]) => (
          <div key={t} className="flex items-center gap-3 mb-3">
            <span style={{ width: 9, height: 9, borderRadius: '50%', background: c, flex: 'none' }} />
            <span style={{ fontSize: 14.5, color: '#3A2A1A', fontWeight: 500 }}>{t}</span>
          </div>
        ))}
      </motion.div>

      <motion.div initial={{ opacity: 0, scale: .95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: .8 }}
        className="relative rounded-[28px] overflow-hidden" style={{ height: 420, background: '#f3ead9', boxShadow: '0 30px 70px -24px rgba(58,42,26,.45)', border: '1px solid rgba(58,42,26,.06)' }}>
        {[['200%','18px','120px','-20%','-7deg'],['200%','14px','260px','-30%','5deg'],['18px','200%','30%','-30%','9deg'],['14px','200%','68%','-40%','-5deg']].map((r,i)=>(
          <div key={i} style={{ position:'absolute', background:'rgba(58,42,26,.05)', borderRadius:8, width:r[0], height:r[1], top:r[2], left:r[3], transform:`rotate(${r[4]})` }}/>
        ))}
        <span className="absolute z-10 flex items-center gap-2" style={{ top: 16, left: 16 }}>
          <span className="flex items-center gap-2 font-head font-semibold rounded-full" style={{ fontSize: 12, color: '#fff', background: '#C94C3D', padding: '6px 12px' }}>
            <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#fff' }} /> EN DIRECT
          </span>
          <StatusPill style={{ background: 'rgba(255,255,255,.85)' }} />
        </span>
        <svg viewBox="0 0 600 420" className="absolute inset-0 w-full h-full">
          <path ref={pathRef} id="bigroute" d="M70 360 C 160 320, 150 230, 250 200 S 420 150, 520 70" fill="none" stroke="#6F8F45" strokeWidth="5" strokeDasharray="4 12" strokeLinecap="round" opacity=".9" />
          <circle cx="70" cy="360" r="22" fill="#6F8F45" opacity=".18" /><circle cx="70" cy="360" r="11" fill="#6F8F45" />
          <circle cx="520" cy="70" r="22" fill="#3A2A1A" opacity=".15" /><circle cx="520" cy="70" r="11" fill="#3A2A1A" />
          {connected && point ? (
            <g style={{ transition: 'transform .7s linear' }} transform={`translate(${point.x},${point.y})`}>
              <circle r="26" fill="#D96C3B" opacity=".18" /><circle r="15" fill="#D96C3B" />
              <path d="M-6 -1 h12 v3.5 a6 6 0 0 1 -12 0 Z" fill="#fff" />
            </g>
          ) : (
            <g>
              <circle r="26" fill="#D96C3B" opacity=".18" /><circle r="15" fill="#D96C3B" />
              <path d="M-6 -1 h12 v3.5 a6 6 0 0 1 -12 0 Z" fill="#fff" />
              <animateMotion dur="7s" repeatCount="indefinite" calcMode="linear"><mpath href="#bigroute" /></animateMotion>
            </g>
          )}
        </svg>
        <div className="absolute flex items-center gap-2.5 bg-white rounded-2xl" style={{ bottom: 16, left: 16, right: 16, padding: '13px 15px', boxShadow: '0 10px 30px -12px rgba(58,42,26,.4)' }}>
          <div style={{ width: 40, height: 40, borderRadius: 12, background: 'rgba(111,143,69,.14)', display: 'grid', placeItems: 'center', flex: 'none' }}>
            <Navigation size={20} color="#6F8F45" />
          </div>
          <div><div className="font-head font-semibold text-cacao" style={{ fontSize: 14 }}>À 1,8 km de chez vous</div>
            <div className="text-muted" style={{ fontSize: 12 }}>{connected ? 'Position diffusée en temps réel' : 'Le livreur se rapproche'}</div></div>
          <div className="font-head ml-auto" style={{ fontWeight: 800, color: '#6F8F45', fontSize: 18 }}>{connected && etaMin != null ? etaMin : 8} min</div>
        </div>
      </motion.div>
    </section>
  )
}
