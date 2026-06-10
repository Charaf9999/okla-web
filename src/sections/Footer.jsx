import Logo from '../components/Logo'
export default function Footer() {
  return (
    <footer id="footer" className="px-5 sm:px-10 lg:px-16 pt-12 pb-10" style={{ borderTop: '1px solid rgba(58,42,26,.08)' }}>
      <div className="max-w-[1240px] mx-auto flex flex-wrap items-center justify-between gap-6">
        <Logo />
        <div className="flex gap-7 font-head" style={{ fontSize: 13.5, color: '#8B7A68' }}>
          <a href="#" className="hover:text-terracotta">Restaurants</a><a href="#" className="hover:text-terracotta">Devenir partenaire</a>
          <a href="#" className="hover:text-terracotta">Livreurs</a><a href="#" className="hover:text-terracotta">Contact</a>
        </div>
        <div style={{ fontSize: 12.5, color: '#8B7A68' }}>© 2026 OKLA · FSTT / KIINOV</div>
      </div>
    </footer>
  )
}
