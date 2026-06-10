import { motion } from 'framer-motion'
import Logo from '../components/Logo'

export default function CTA() {
  return (
    <section className="px-5 sm:px-10 lg:px-16 py-16">
      <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: .7 }}
        className="max-w-[1100px] mx-auto rounded-[32px] relative overflow-hidden text-center px-6 py-16"
        style={{ background: '#3A2A1A' }}>
        <div className="absolute" style={{ width: 360, height: 360, borderRadius: '50%', top: -120, right: -80, background: 'radial-gradient(circle,rgba(217,108,59,.4),transparent 70%)' }} />
        <div className="absolute" style={{ width: 300, height: 300, borderRadius: '50%', bottom: -120, left: -60, background: 'radial-gradient(circle,rgba(242,184,75,.25),transparent 70%)' }} />
        <div className="relative">
          <div className="flex justify-center mb-5"><Logo size={40} withWord={false} /></div>
          <h2 className="font-head font-extrabold text-cream mb-3" style={{ fontSize: 'clamp(28px,4vw,44px)', letterSpacing: '-1px' }}>Prêt à savourer ?</h2>
          <p className="mx-auto mb-8" style={{ color: '#D9C7B4', maxWidth: 460, fontSize: 16 }}>Téléchargez OKLA et découvrez la restauration marocaine, réinventée.</p>
          <div className="flex gap-3.5 justify-center flex-wrap">
            <button className="font-head font-semibold rounded-xl text-white" style={{ fontSize: 15, background: '#6F8F45', padding: '15px 28px', boxShadow: '0 12px 28px -10px rgba(111,143,69,.8)' }}>App Store</button>
            <button className="font-head font-semibold rounded-xl" style={{ fontSize: 15, color: '#FFF4E6', border: '1.5px solid rgba(255,244,230,.35)', padding: '14px 26px' }}>Google Play</button>
          </div>
          <div className="font-head mt-8" style={{ fontSize: 11, letterSpacing: 4, color: '#D96C3B' }}>RÉSERVEZ · DÉGUSTEZ · PROFITEZ</div>
        </div>
      </motion.div>
    </section>
  )
}
