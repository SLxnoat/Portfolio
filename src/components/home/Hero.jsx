import { motion } from 'framer-motion';
import usePortfolioStore from '../../store/usePortfolioStore';

const Hero = () => {
  const { profile } = usePortfolioStore();

  if (!profile) return null;

  return (
    <section className="hero-section position-relative vh-100 d-flex align-items-center overflow-hidden">
      {/* Background Glows */}
      <div className="position-absolute top-20 start-10 bg-primary blur-3xl opacity-20 rounded-circle" style={{ width: '300px', height: '300px', filter: 'blur(150px)' }}></div>
      <div className="position-absolute bottom-10 end-5 bg-secondary blur-3xl opacity-15 rounded-circle" style={{ width: '400px', height: '400px', filter: 'blur(150px)' }}></div>

      <div className="container position-relative z-10">
        <div className="row align-items-center">
          <div className="col-lg-7">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="d-flex align-items-center gap-2 mb-3">
                <span className="text-primary small fw-bold tracking-widest">{profile.ui_hero_status}</span>
                <div className="bg-primary opacity-20 h-px flex-grow-1"></div>
              </div>

              <h1 className="display-1 fw-black mb-2 text-white">
                {profile.name.split(' ').map((word, i) => (
                  <span key={i} className={i === 0 ? '' : 'gradient-text'}>{word} </span>
                ))}
              </h1>

              <h2 className="display-6 fw-light text-secondary mb-4">
                {profile.role}
              </h2>

              <p className="lead text-secondary-50 mb-5 max-w-md">
                {profile.tagline}
              </p>

              <div className="d-flex gap-3">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="btn btn-primary px-4 py-2 fw-bold text-dark glow-primary"
                >
                  Explore Portfolio
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="btn btn-outline-secondary px-4 py-2 fw-bold glass"
                >
                  Get In Touch
                </motion.button>
              </div>
            </motion.div>
          </div>

          <div className="col-lg-5 d-none d-lg-block">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.2 }}
              className="position-relative"
            >
              <div className="glass-card p-2 floating" style={{ borderRadius: '30px' }}>
                <img 
                  src={profile.photo} 
                  alt={profile.name}
                  className="img-fluid"
                  style={{ borderRadius: '24px', filter: 'grayscale(0.5) contrast(1.1)' }}
                  onError={(e) => {
                    e.target.src = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1000&auto=format&fit=crop';
                  }}
                />
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
