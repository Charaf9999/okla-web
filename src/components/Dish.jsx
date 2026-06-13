// Emoji de repli selon la cuisine (affiché quand la photo manque).
export const cuisineEmoji = (c = '') => {
  const s = c.toLowerCase()
  if (s.includes('couscous')) return '🥘'
  if (s.includes('poisson') || s.includes('fruits de mer')) return '🐟'
  if (s.includes('pâtisserie') || s.includes('salon de thé')) return '🍰'
  if (s.includes('café') || s.includes('brunch')) return '☕'
  if (s.includes('italienne') || s.includes('pizzeria')) return '🍕'
  if (s.includes('asiatique') || s.includes('fusion')) return '🍣'
  if (s.includes('grillades')) return '🍖'
  if (s.includes('marocaine')) return '🍲'
  if (s.includes('méditerranéenne')) return '🥗'
  return '🍽️'
}

// Visuel de plat/restaurant : dégradé de marque + photo si elle existe.
// `label` (emoji ou initiale) reste visible derrière — il apparaît quand
// l'image manque ou échoue, donc jamais d'image cassée à l'écran.
export default function Dish({ src, from, to, label, labelSize = 26, className = '', style = {}, children }) {
  const grad = `radial-gradient(circle at 30% 35%, rgba(242,184,75,.5), transparent 55%), linear-gradient(135deg,${from},${to})`
  return (
    <div className={className} style={{ background: grad, position: 'relative', overflow: 'hidden', ...style }}>
      {label && (
        <span aria-hidden="true" style={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center', fontSize: labelSize, textShadow: '0 2px 10px rgba(58,42,26,.35)' }}>
          {label}
        </span>
      )}
      {src && <img src={src} alt="" loading="lazy"
        onError={(e) => { e.currentTarget.style.display = 'none' }}
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />}
      {children}
    </div>
  )
}
