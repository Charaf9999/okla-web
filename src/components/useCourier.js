import { useEffect, useRef, useState } from 'react'
import { connectCourier } from '../api'

// Hook de suivi livraison.
// - Ouvre le WebSocket et expose { connected, progress, etaMin, point }.
// - `point` {x,y} est calculé le long du tracé SVG via getPointAtLength.
// - Si le serveur est absent, `connected` reste false : l'appelant affiche
//   alors son animation SMIL de secours.
//
// pathRef : ref vers l'élément <path> du tracé.
export function useCourier(pathRef) {
  const [connected, setConnected] = useState(false)
  const [etaMin, setEtaMin] = useState(null)
  const [point, setPoint] = useState(null)
  const progressRef = useRef(0)

  useEffect(() => {
    const disconnect = connectCourier({
      onStatus: setConnected,
      onMessage: ({ progress, etaMin }) => {
        progressRef.current = progress
        setEtaMin(etaMin)
        const path = pathRef.current
        if (path && typeof path.getTotalLength === 'function') {
          try {
            const len = path.getTotalLength()
            const p = path.getPointAtLength(progress * len)
            setPoint({ x: p.x, y: p.y })
          } catch { /* ignore */ }
        }
      },
    })
    return disconnect
  }, [pathRef])

  return { connected, etaMin, point }
}
