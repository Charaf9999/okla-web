import { useEffect, useState } from 'react'
import { onStatusChange } from '../api'

// Pastille discrète : « ● API connectée » (olive) / « ● Mode hors-ligne » (muted).
export default function StatusPill({ style = {}, className = '' }) {
  const [online, setOnline] = useState(false)
  useEffect(() => onStatusChange(setOnline), [])

  const color = online ? '#6F8F45' : '#8B7A68'
  const bg = online ? 'rgba(111,143,69,.12)' : 'rgba(139,122,104,.12)'
  return (
    <span className={`inline-flex items-center gap-2 font-head font-semibold rounded-full ${className}`}
      style={{ fontSize: 11.5, color, background: bg, padding: '5px 11px', ...style }}>
      <span style={{ width: 7, height: 7, borderRadius: '50%', background: color,
        boxShadow: online ? '0 0 0 3px rgba(111,143,69,.18)' : 'none' }} />
      {online ? 'API connectée' : 'Mode hors-ligne'}
    </span>
  )
}
