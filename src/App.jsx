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

export default function App() {
  return (
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
  );
}
