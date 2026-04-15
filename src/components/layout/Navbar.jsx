import { motion } from 'framer-motion';
import { Terminal, Briefcase, Cpu, Send, Info } from 'lucide-react';

const Navbar = () => {
  const navLinks = [
    { name: 'About', href: '#about', icon: Info },
    { name: 'Skills', href: '#skills', icon: Cpu },
    { name: 'Projects', href: '#projects', icon: Briefcase },
    { name: 'Contact', href: '#contact', icon: Send },
  ];

  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="glass position-fixed top-0 start-0 end-0 z-50 py-3"
      style={{ height: 'var(--header-height)', display: 'flex', alignItems: 'center' }}
    >
      <div className="container d-flex justify-content-between align-items-center">
        <a href="/" className="d-flex align-items-center gap-2">
          <Terminal className="text-primary" />
          <span className="fw-bold gradient-text" style={{ fontSize: '1.25rem' }}>OS.PRIME</span>
        </a>

        <div className="d-none d-md-flex gap-4">
          {navLinks.map((link) => (
            <a 
              key={link.name} 
              href={link.href}
              className="d-flex align-items-center gap-1 text-secondary hover-text-primary small fw-semibold"
            >
              <link.icon size={16} />
              {link.name}
            </a>
          ))}
        </div>

        <div className="d-flex align-items-center gap-3">
          <div className="d-flex align-items-center gap-2">
            <div className="rounded-circle bg-success glow-primary" style={{ width: 8, height: 8 }}></div>
            <span className="text-success small fw-bold" style={{ fontSize: '0.7rem' }}>SYSTEM ONLINE</span>
          </div>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;
