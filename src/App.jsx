import { Routes, Route } from 'react-router-dom'
import Nav from './components/Nav'
import Marketing from './pages/Marketing'
import AppDemo from './pages/AppDemo'
import Reservation from './pages/Reservation'
import ScrollToHash from './components/ScrollToHash'

export default function App() {
  return (
    <>
      <Nav />
      <ScrollToHash />
      <Routes>
        <Route path="/" element={<Marketing />} />
        <Route path="/reservation" element={<Reservation />} />
        <Route path="/app" element={<AppDemo />} />
      </Routes>
    </>
  )
}
