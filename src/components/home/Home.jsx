import { motion } from 'framer-motion';
import Hero from './Hero';
import About from './About';
import Skills from './Skills';
import Projects from './Projects';
import Experience from './Experience';
import Contact from './Contact';

const Home = () => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="home-page"
    >
      <Hero />
      <About />
      <Skills />
      <Projects />
      <Experience />
      <Contact />
      
      <section className="section-padding text-center border-top border-secondary border-opacity-10">
        <h2 className="gradient-text mb-4">SYSTEMS REBUILT</h2>
        <p className="text-secondary opacity-50">OS.PRIME / REACT_EVOLUTION v3.5</p>
      </section>
    </div>
  );
};

export default Home;
