import { Header } from "@/components/landing/Header"
import Hero from "@/components/landing/Hero"
import { Services } from "@/components/landing/Services"
import { About } from "@/components/landing/About"
import { Contact } from "@/components/landing/Contact"
import { Footer } from "@/components/landing/Footer"

export default function Component() {
  return (
    <div className="min-h-screen">
      <Header />
      <Hero />
      <Services />
      <About />
      <Contact />
      <Footer />
    </div>
  )
}
