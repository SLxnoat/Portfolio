import { motion } from 'framer-motion';
import usePortfolioStore from '../../store/usePortfolioStore';
import { User, MapPin, Mail, Phone } from 'lucide-react';

const About = () => {
  const { profile } = usePortfolioStore();

  if (!profile) return null;

  return (
    <section id="about" className="section-padding overflow-hidden">
      <div className="container">
        <div className="row g-5 align-items-center">
          <div className="col-lg-6">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <div className="d-flex align-items-center gap-3 mb-4">
                <h2 className="display-4 fw-bold mb-0">AB<span className="gradient-text">OUT</span></h2>
                <div className="bg-primary opacity-20 h-px flex-grow-1"></div>
              </div>
              
              <div className="glass-card p-4 mb-4">
                <p className="lead text-primary mb-4 fw-semibold">
                  {profile.summary.split('\n\n')[0]}
                </p>
                <div className="text-secondary" style={{ whiteSpace: 'pre-line' }}>
                  {profile.summary.split('\n\n').slice(1).join('\n\n')}
                </div>
              </div>

              <div className="row g-3 mt-4">
                <div className="col-sm-6">
                  <div className="d-flex align-items-center gap-3 text-secondary">
                    <div className="p-2 rounded bg-primary bg-opacity-10 text-primary">
                      <MapPin size={20} />
                    </div>
                    <span className="small">{profile.location}</span>
                  </div>
                </div>
                <div className="col-sm-6">
                  <div className="d-flex align-items-center gap-3 text-secondary">
                    <div className="p-2 rounded bg-primary bg-opacity-10 text-primary">
                      <Mail size={20} />
                    </div>
                    <span className="small">{profile.email}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          <div className="col-lg-6">
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="position-relative"
            >
              {/* Decorative Elements */}
              <div className="position-absolute top-0 end-0 bg-secondary opacity-10 rounded-circle blur-3xl" style={{ width: '200px', height: '200px', z-index: -1 }}></div>
              
              <div className="glass-card p-5">
                <div className="d-flex flex-column gap-4">
                  <div className="d-flex justify-content-between align-items-start border-bottom border-secondary border-opacity-10 pb-3">
                    <div>
                      <h4 className="text-white mb-1">Status</h4>
                      <div className="d-flex align-items-center gap-2">
                        <div className="bg-success rounded-circle" style={{ width: 8, height: 8 }}></div>
                        <span className="text-success small fw-bold">Active Engineering</span>
                      </div>
                    </div>
                    <User className="text-primary opacity-50" size={32} />
                  </div>

                  <div>
                    <h4 className="text-white mb-3">Core Philosophy</h4>
                    <p className="text-secondary small">
                      I believe in building AI systems that are not just accurate, but interpretable and impactful. My focus lies at the intersection of Deep Learning and real-world problem solving.
                    </p>
                  </div>

                  <div className="d-flex flex-wrap gap-2">
                    <span className="badge glass border-primary border-opacity-20 text-primary p-2">96% Accuracy Model</span>
                    <span className="badge glass border-secondary border-opacity-20 text-secondary p-2">17+ Projects</span>
                    <span className="badge glass border-info border-opacity-20 text-info p-2">LLM Orchestration</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
