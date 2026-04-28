import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import ResearchDomain from '@/components/ResearchDomain';
import Timeline from '@/components/Timeline';
import Downloads from '@/components/Downloads';
import AboutUs from '@/components/AboutUs';
import Contact, { Footer } from '@/components/Contact';

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <Hero />
      <ResearchDomain />
      <Timeline />
      <Downloads />
      <AboutUs />
      <Contact />
      <Footer />
    </main>
  );
}
