// Bloc squelette animé (pulsation) pour les états de chargement.
export default function Skeleton({ className = '', style = {} }) {
  return (
    <div className={`okla-skeleton ${className}`}
      style={{ background: 'rgba(58,42,26,.08)', borderRadius: 12, ...style }} />
  )
}
