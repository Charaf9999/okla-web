import { useState } from 'react'
import { motion } from 'framer-motion'

const OLIVE = '#6F8F45', OLIVE_D = '#5E7A39', CACAO = '#3A2A1A'

// Catégories de plats (façon « Pick your plate » de TheFork).
// `kw` : mots-clés cherchés dans le nom, la cuisine, les tags et la carte du restaurant.
export const PLATES = [
  { id: 'tajine', label: 'Tajine', emoji: '🍲', img: '/images/plates/tajine.jpeg', kw: ['tajine'] },
  { id: 'couscous', label: 'Couscous', emoji: '🥘', img: '/images/plates/couscous.jpeg', kw: ['couscous'] },
  { id: 'pastilla', label: 'Pastilla', emoji: '🥧', img: '/images/plates/pastilla.jpeg', kw: ['pastilla'] },
  { id: 'poisson', label: 'Poisson & fruits de mer', emoji: '🐟', img: '/images/plates/poisson.jpeg', kw: ['poisson', 'fruits de mer', 'crevette', 'gambas', 'thon', 'bar grillé'] },
  { id: 'harira', label: 'Harira & soupes', emoji: '🍜', img: '/images/plates/harira.jpeg', kw: ['harira', 'soupe'] },
  { id: 'briouates', label: 'Briouates', emoji: '🥟', img: '/images/plates/briouates.jpeg', kw: ['briouate'] },
]

export function matchesPlate(r, plateId) {
  const p = PLATES.find(x => x.id === plateId)
  if (!p) return true
  const hay = [r.name, r.cuisine, ...(r.tags || []), ...(r.menu || []).map(m => m.name)].join(' ').toLowerCase()
  return p.kw.some(k => hay.includes(k))
}

// Photo ronde de l'assiette ; si le fichier manque, repli sur un disque dégradé + emoji.
function PlateVisual({ plate }) {
  const [err, setErr] = useState(false)
  if (err) {
    return (
      <div className="w-full h-full rounded-full grid place-items-center"
        style={{ background: 'linear-gradient(135deg, rgba(111,143,69,.28), rgba(242,184,75,.32))', fontSize: 'clamp(38px, 4vw, 52px)' }}>
        <span role="img" aria-label={plate.label}>{plate.emoji}</span>
      </div>
    )
  }
  return <img src={plate.img} alt={plate.label} onError={() => setErr(true)} className="w-full h-full rounded-full object-cover" draggable="false" />
}

const cardVariants = {
  hidden: { opacity: 0, y: 22 },
  show: { opacity: 1, y: 0, transition: { duration: .5, ease: [0.21, 0.8, 0.32, 1] } },
}

export default function PickYourPlate({ active, onPick }) {
  return (
    <motion.section initial="hidden" whileInView="show" viewport={{ once: true, margin: '-40px' }}
      variants={{ hidden: {}, show: { transition: { staggerChildren: 0.07 } } }} className="mb-7">
      <motion.h2 variants={cardVariants} className="font-head font-extrabold mb-4"
        style={{ fontSize: 'clamp(19px, 2.2vw, 24px)', letterSpacing: '-0.4px', color: CACAO }}>
        À chacun son plat
      </motion.h2>
      <div className="flex lg:grid lg:grid-cols-6 gap-3.5 overflow-x-auto lg:overflow-visible snap-x snap-mandatory no-scrollbar pb-1 -mx-5 px-5 sm:mx-0 sm:px-0">
        {PLATES.map(p => {
          const on = active === p.id
          return (
            <motion.button key={p.id} type="button"
              variants={{ ...cardVariants, lift: { y: -4, boxShadow: '0 18px 34px -16px rgba(58,42,26,.5)' } }}
              whileHover="lift" whileTap={{ scale: .97 }} onClick={() => onPick(p.id)}
              aria-pressed={on} title={on ? `Retirer le filtre ${p.label}` : `Voir les restaurants : ${p.label}`}
              className="flex-none snap-start lg:w-auto w-[152px] rounded-2xl px-3 pt-4 pb-3.5 flex flex-col items-center gap-3"
              style={{
                background: on ? '#FFFCF6' : '#FFF9F0',
                border: `1px solid ${on ? 'rgba(111,143,69,.45)' : 'rgba(58,42,26,.08)'}`,
                boxShadow: on ? '0 14px 30px -16px rgba(111,143,69,.55)' : '0 8px 22px -18px rgba(58,42,26,.35)',
              }}>
              <motion.div className="rounded-full"
                variants={{ lift: { scale: 1.06 } }} transition={{ duration: .25, ease: 'easeOut' }}
                style={{
                  width: '100%', maxWidth: 150, aspectRatio: '1 / 1',
                  boxShadow: on
                    ? `0 0 0 3px #fff, 0 0 0 6px ${OLIVE}, 0 16px 26px -12px rgba(58,42,26,.4)`
                    : '0 16px 26px -12px rgba(58,42,26,.4)',
                  transition: 'box-shadow .2s',
                }}>
                <PlateVisual plate={p} />
              </motion.div>
              <span className="font-head font-semibold text-center leading-snug transition-colors"
                style={{ fontSize: 13, color: on ? OLIVE_D : CACAO, minHeight: 34, display: 'grid', placeItems: 'center' }}>
                {p.label}
              </span>
            </motion.button>
          )
        })}
      </div>
    </motion.section>
  )
}
