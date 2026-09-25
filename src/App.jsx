import { LazyMotion } from 'motion/react';
import SiteHeader from './components/SiteHeader.jsx';
import Hero from './components/Hero.jsx';
import Services from './components/Services.jsx';
import Process from './components/Process.jsx';
import OperationsComparison from './components/OperationsComparison.jsx';
import About from './components/About.jsx';
import Faq from './components/Faq.jsx';
import Contact from './components/Contact.jsx';
import Footer from './components/Footer.jsx';
import SocialGooeyMenu from './components/SocialGooeyMenu.jsx';
import { ContactProvider } from './context/ContactContext.jsx';
import { ServiceProvider } from './context/ServiceContext.jsx';
import { usePauseOffscreen } from './hooks/usePauseOffscreen.js';
import { useScrollReveal } from './hooks/useScrollReveal.js';

// Os recursos de animação chegam num chunk à parte, depois do primeiro render.
const loadMotionFeatures = () => import('./lib/motionFeatures.js').then((module) => module.default);

// Seções com animação contínua: pausadas quando saem da tela.
const ANIMATED_SECTIONS = ['.hero', '#processo', '.about-section'];

export default function App() {
  useScrollReveal();
  usePauseOffscreen(ANIMATED_SECTIONS);

  return (
    <LazyMotion features={loadMotionFeatures} strict>
      <ContactProvider>
        <ServiceProvider>
          <SiteHeader />
          <Hero />
          <Services />
          <Process />
          <OperationsComparison />
          <About />
          <Faq />
          <Contact />
          <Footer />
          <SocialGooeyMenu />
        </ServiceProvider>
      </ContactProvider>
    </LazyMotion>
  );
}
