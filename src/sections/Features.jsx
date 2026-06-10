import { motion } from 'framer-motion'
import { Utensils, MapPin, Bike, Bot } from 'lucide-react'
import { features } from '../data'
const icons = { Utensils, MapPin, Bike, Bot }

export default function Features() {
  return (
    <section className="max-w-[1240px] mx-auto px-5 sm:px-10 lg:px-16 py-20">
      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: .6 }} className="text-center mb-12">
        <h2 className="font-head font-extrabold text-cacao" style={{ fontSize: 'clamp(28px,3.5vw,40px)', letterSpacing: '-1px' }}>Pourquoi OKLA ?</h2>
        <p className="text-muted mt-2.5" style={{ fontSize: 15 }}>Une expérience unifiée, locale et intelligente.</p>
      </motion.div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {features.map((f, i) => {
          const Ic = icons[f.icon]
          return (
            <motion.div key={f.title} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              transition={{ duration: .6, delay: i * .1 }} whileHover={{ y: -6 }}
              className="bg-card rounded-[20px] p-6" style={{ border: '1px solid rgba(58,42,26,.06)' }}>
              <div className="mb-4 grid place-items-center" style={{ width: 50, height: 50, borderRadius: 14, background: f.bg }}>
                <Ic size={24} color={f.color} />
              </div>
              <h3 className="font-head font-bold text-cacao mb-2" style={{ fontSize: 16 }}>{f.title}</h3>
              <p style={{ fontSize: 13, lineHeight: 1.55, color: '#6A5746' }}>{f.desc}</p>
            </motion.div>
          )
        })}
      </div>
    </section>
  )
}
