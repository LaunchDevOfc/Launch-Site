import SiteHeader from './components/SiteHeader.jsx';
import Hero from './components/Hero.jsx';
import Services from './components/Services.jsx';
import Process from './components/Process.jsx';
import OperationsComparison from './components/OperationsComparison.jsx';
import About from './components/About.jsx';
import Contact from './components/Contact.jsx';
import Footer from './components/Footer.jsx';

export default function App() {
  return (
    <>
      <SiteHeader />
      <Hero />
      <Services />
      <Process />
      <OperationsComparison />
      <About />
      <Contact />
      <Footer />
    </>
  );
}
