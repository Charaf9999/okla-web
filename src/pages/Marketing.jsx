import Hero from '../sections/Hero'
import Features from '../sections/Features'
import HowItWorks from '../sections/HowItWorks'
import LiveTracking from '../sections/LiveTracking'
import Chatbot from '../sections/Chatbot'
import Restaurants from '../sections/Restaurants'
import CTA from '../sections/CTA'
import Footer from '../sections/Footer'

export default function Marketing() {
  return (
    <main>
      <Hero />
      <Features />
      <HowItWorks />
      <LiveTracking />
      <Chatbot />
      <Restaurants />
      <CTA />
      <Footer />
    </main>
  )
}
