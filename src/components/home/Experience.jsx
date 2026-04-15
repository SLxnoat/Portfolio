import { motion } from 'framer-motion';
import usePortfolioStore from '../../store/usePortfolioStore';
import { Calendar, Briefcase, GraduationCap } from 'lucide-react';

const Experience = () => {
  const { experience, education } = usePortfolioStore();

  return (
    <section id="experience" className="section-padding">
      <div className="container">
        <div className="d-flex align-items-center gap-3 mb-5">
          <h2 className="display-4 fw-bold mb-0">EXP<span className="gradient-text">ERIENCE</span></h2>
          <div className="bg-primary opacity-20 h-px flex-grow-1"></div>
        </div>

        <div className="row g-5">
          {/* Experience Column */}
          <div className="col-lg-6">
            <h3 className="d-flex align-items-center gap-2 text-primary h4 mb-4">
              <Briefcase size={20} /> Work History
            </h3>
            
            <div className="timeline-container ms-3">
              {experience.map((item, index) => (
                <motion.div 
                  key={item.id || index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.2 }}
                  className="timeline-node mb-5"
                >
                  <div className="timeline-dot"></div>
                  <div className="timeline-card glass-card">
                    <div className="d-flex justify-content-between align-items-start mb-2">
                      <h4 className="text-white h5 mb-0">{item.title}</h4>
                      <span className="badge glass text-primary">{item.date}</span>
                    </div>
                    <div className="text-primary small fw-bold mb-3">{item.company}</div>
                    <p className="text-secondary small mb-0">{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Education Column */}
          <div className="col-lg-6">
            <h3 className="d-flex align-items-center gap-2 text-secondary h4 mb-4">
              <GraduationCap size={20} /> Education
            </h3>

            <div className="timeline-container ms-3">
              {education.map((item, index) => (
                <motion.div 
                  key={item.id || index}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.2 }}
                  className="timeline-node edu-node mb-5"
                >
                  <div className="timeline-dot"></div>
                  <div className="timeline-card glass-card" style={{ borderLeft: '2px solid var(--accent-secondary)' }}>
                    <div className="d-flex justify-content-between align-items-start mb-2">
                      <h4 className="text-white h5 mb-0">{item.degree}</h4>
                      <span className="badge glass text-secondary">{item.date}</span>
                    </div>
                    <div className="text-secondary small fw-bold mb-3">{item.inst}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Experience;
