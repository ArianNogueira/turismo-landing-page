import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { Benefits } from "@/components/Benefits";
import { Tours } from "@/components/Tours";
import { About } from "@/components/About";
import { Testimonials } from "@/components/Testimonials";
import { CTA } from "@/components/CTA";
import { Footer } from "@/components/Footer";
import { WhatsAppButton } from "@/components/WhatsAppButton";

export default function Home() {
  return (
    <>
      <Navbar/>
      <main>
        <Hero/>
        <Benefits/>
        <Tours/>
        <About/>
        <Testimonials/>
        <CTA/>
      </main>
      <Footer/>
      <WhatsAppButton/>
    </>
  )
}
