export default function Dish({ src, from, to, className = '', style = {}, children }) {
  const grad = `radial-gradient(circle at 30% 35%, rgba(242,184,75,.5), transparent 55%), linear-gradient(135deg,${from},${to})`
  return (
    <div className={className} style={{ background: grad, position: 'relative', overflow: 'hidden', ...style }}>
      {src && <img src={src} alt="" loading="lazy"
        onError={(e) => { e.currentTarget.style.display = 'none' }}
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />}
      {children}
    </div>
  )
}
