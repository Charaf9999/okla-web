import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import Logo from './Logo'

export default function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const loc = useLocation()
  useEffect(() => {
    const f = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', f)
    return () => window.removeEventListener('scroll', f)
  }, [])
  const onApp = loc.pathname === '/app'
  return (
    <motion.nav
      initial={{ y: -60, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: .6, ease: [.2,.7,.2,1] }}
      className="fixed top-0 inset-x-0 z-50 flex items-center justify-between px-5 sm:px-10 lg:px-16 py-4 backdrop-blur-md transition-colors"
      style={{ background: scrolled ? 'rgba(255,244,230,.85)' : 'rgba(255,244,230,.4)', borderBottom: scrolled ? '1px solid rgba(58,42,26,.07)' : '1px solid transparent' }}>
      <Link to="/"><Logo /></Link>
      <div className="hidden md:flex items-center gap-8 font-head text-sm">
        <Link to="/#restaurants" className="text-cacao/75 hover:text-olive transition-colors">Restaurants</Link>
        <Link to="/reservation" className="text-cacao/75 hover:text-olive transition-colors">Réserver</Link>
        <Link to="/#livraison" className="text-cacao/75 hover:text-terracotta transition-colors">Livraison</Link>
        <Link to="/#footer" className="text-cacao/75 hover:text-terracotta transition-colors">À propos</Link>
      </div>
      <Link to={onApp ? '/' : '/app'}
        className="font-head font-semibold text-sm text-cream px-5 py-2.5 rounded-xl transition-all hover:-translate-y-0.5"
        style={{ background: '#3A2A1A' }}>
        {onApp ? '\u2190 Le site' : 'Ouvrir l\u2019app'}
      </Link>
    </motion.nav>
  )
}
