import { motion } from 'framer-motion'
import { steps } from '../data'

export default function HowItWorks() {
  return (
    <section className="max-w-[1240px] mx-auto px-5 sm:px-10 lg:px-16 py-16">
      <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: .6 }}
        className="font-head font-extrabold text-cacao text-center mb-14" style={{ fontSize: 'clamp(28px,3.5vw,40px)', letterSpacing: '-1px' }}>
        Comment ça marche
      </motion.h2>
      <div className="grid md:grid-cols-3 gap-6 relative">
        {steps.map((s, i) => (
          <motion.div key={s.n} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: .6, delay: i * .15 }}
            className="relative">
            <div className="font-head font-extrabold" style={{ fontSize: 56, color: 'rgba(111,143,69,.22)', lineHeight: 1 }}>{s.n}</div>
            <h3 className="font-head font-bold text-cacao mt-2 mb-2" style={{ fontSize: 20 }}>{s.title}</h3>
            <p style={{ color: '#6A5746', fontSize: 14, lineHeight: 1.6, maxWidth: 280 }}>{s.desc}</p>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
