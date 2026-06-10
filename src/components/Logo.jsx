export default function Logo({ size = 32, withWord = true, wordColor = '#3A2A1A' }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 11 }}>
      <svg width={size} height={size * 1.2} viewBox="0 0 100 122" aria-label="OKLA">
        <path d="M50 5 C26 5 7 23 7 47 C7 74 50 116 50 116 C50 116 93 74 93 47 C93 23 74 5 50 5 Z" fill="#D96C3B" />
        <circle cx="50" cy="25" r="3.6" fill="#FFF4E6" />
        <path d="M27 51 A23 19 0 0 1 73 51 Z" fill="#FFF4E6" />
        <rect x="23" y="52" width="54" height="4.4" rx="2.2" fill="#FFF4E6" />
        <g transform="rotate(-12 50 76)" fill="#FFF4E6">
          <rect x="46" y="60" width="2.6" height="26" rx="1.3" />
          <rect x="49.6" y="60" width="2.6" height="26" rx="1.3" />
          <rect x="53.2" y="60" width="2.6" height="26" rx="1.3" />
          <path d="M44.5 78 h13 v2.5 a6.5 6.5 0 0 1 -13 0 Z" />
          <rect x="49.3" y="80" width="3.2" height="22" rx="1.6" />
        </g>
      </svg>
      {withWord && (
        <span className="font-head" style={{ fontWeight: 800, fontSize: size * 0.78, letterSpacing: '-.5px', color: wordColor }}>
          <span style={{ color: '#D96C3B' }}>O</span>KLA
        </span>
      )}
    </div>
  )
}
