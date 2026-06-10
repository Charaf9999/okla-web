import { motion } from 'framer-motion'

export default function PhoneTracking({ width = 286 }) {
  return (
    <div style={{ width, height: width * 2.03, borderRadius: 42, background: '#1f150d', padding: 11,
      boxShadow: '0 40px 80px -24px rgba(58,42,26,.55), inset 0 0 0 2px rgba(255,255,255,.06)' }}>
      <div style={{ width: '100%', height: '100%', borderRadius: 32, background: '#FFF4E6', overflow: 'hidden', position: 'relative' }}>
        <div style={{ position: 'absolute', top: 10, left: '50%', transform: 'translateX(-50%)', width: 96, height: 22, background: '#1f150d', borderRadius: '0 0 16px 16px', zIndex: 5 }} />
        <div className="flex items-center justify-between" style={{ padding: '30px 18px 14px' }}>
          <div>
            <div className="font-head" style={{ fontWeight: 700, fontSize: 16, color: '#3A2A1A' }}>Livraison en cours</div>
            <div style={{ fontSize: 11, color: '#8B7A68' }}>Tanger · Quartier Marshan</div>
          </div>
          <div style={{ width: 34, height: 34, borderRadius: 11, background: 'rgba(217,108,59,.12)', display: 'grid', placeItems: 'center' }}>
            <svg width="17" height="17" viewBox="0 0 24 24" fill="#D96C3B"><path d="M12 2C7.6 2 4 5.6 4 10c0 5.2 8 12 8 12s8-6.8 8-12c0-4.4-3.6-8-8-8zm0 11a3 3 0 1 1 0-6 3 3 0 0 1 0 6z"/></svg>
          </div>
        </div>
        <div style={{ margin: '6px 14px 0', height: width * 1.05, borderRadius: 20, background: '#f3ead9', position: 'relative', overflow: 'hidden', boxShadow: 'inset 0 0 0 1px rgba(58,42,26,.06)' }}>
          {[['200%','14px','70px','-20%','-8deg'],['200%','12px','180px','-30%','6deg']].map((r,i)=>(
            <div key={i} style={{ position:'absolute', background:'rgba(58,42,26,.06)', borderRadius:6, width:r[0], height:r[1], top:r[2], left:r[3], transform:`rotate(${r[4]})` }}/>
          ))}
          <svg viewBox="0 0 258 300" preserveAspectRatio="none" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
            <path id="rt" d="M40 250 C 80 210, 70 160, 120 140 S 200 110, 215 55" fill="none" stroke="#6F8F45" strokeWidth="4" strokeDasharray="3 9" strokeLinecap="round" opacity=".85" />
            <circle cx="40" cy="250" r="13" fill="#6F8F45" opacity=".2" /><circle cx="40" cy="250" r="7" fill="#6F8F45" />
            <circle cx="215" cy="55" r="7" fill="#3A2A1A" />
            <g>
              <circle r="17" fill="#D96C3B" opacity=".22" /><circle r="11" fill="#D96C3B" />
              <animateMotion dur="5.5s" repeatCount="indefinite" calcMode="linear"><mpath href="#rt" /></animateMotion>
            </g>
          </svg>
        </div>
        <div style={{ position: 'absolute', left: 10, right: 10, bottom: 10, background: '#fff', borderRadius: 18, padding: '13px 14px', boxShadow: '0 10px 30px -12px rgba(58,42,26,.4)' }}>
          <div className="flex items-center gap-2.5">
            <div style={{ width: 38, height: 38, borderRadius: 12, background: '#D96C3B', display: 'grid', placeItems: 'center', flex: 'none' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="#fff"><path d="M5 16a3 3 0 1 0 0 6 3 3 0 0 0 0-6zm14 0a3 3 0 1 0 0 6 3 3 0 0 0 0-6zM4 6h9v7H8.8A4 4 0 0 0 5 16H4a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2zm11 2h3l3 4v3h-1a4 4 0 0 0-5-3.9V8z"/></svg>
            </div>
            <div><div className="font-head" style={{ fontWeight: 600, fontSize: 13, color: '#3A2A1A' }}>Votre commande arrive</div>
              <div style={{ fontSize: 11, color: '#8B7A68' }}>Karim · OKLA Express</div></div>
            <div className="font-head ml-auto" style={{ fontWeight: 700, color: '#6F8F45', fontSize: 15 }}>12 min</div>
          </div>
          <div style={{ height: 6, borderRadius: 6, background: '#E8E2D8', marginTop: 11, overflow: 'hidden' }}>
            <motion.div initial={{ width: '40%' }} animate={{ width: ['42%','84%','42%'] }} transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              style={{ height: '100%', borderRadius: 6, background: 'linear-gradient(90deg,#F2B84B,#D96C3B)' }} />
          </div>
        </div>
      </div>
    </div>
  )
}
