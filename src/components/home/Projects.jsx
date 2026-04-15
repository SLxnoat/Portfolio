import { motion } from 'framer-motion';
import usePortfolioStore from '../../store/usePortfolioStore';
import { ExternalLink, Github } from 'lucide-react';

const Projects = () => {
  const { projects } = usePortfolioStore();

  return (
    <section id="projects" className="section-padding">
      <div className="container">
        <div className="d-flex align-items-center gap-3 mb-5">
          <h2 className="display-4 fw-bold mb-0">PROJ<span className="gradient-text">ECTS</span></h2>
          <div className="bg-primary opacity-20 h-px flex-grow-1"></div>
        </div>

        <div className="row g-4">
          {projects.map((project, index) => (
            <div key={project.id || index} className="col-md-6 col-lg-4">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="glass-card p-4 h-100 d-flex flex-column"
                style={{ borderTop: '2px solid transparent' }}
                whileHover={{ borderTopColor: 'var(--accent-secondary)' }}
              >
                <div className="mb-3">
                  <h3 className="h4 text-white mb-2">{project.title}</h3>
                  <div className="d-flex flex-wrap gap-2 mb-3">
                    {project.tech.split(',').map((tech, i) => (
                      <span key={i} className="small px-2 py-1 rounded bg-primary text-primary bg-opacity-10 border border-primary border-opacity-20">
                        {tech.trim()}
                      </span>
                    ))}
                  </div>
                  <p className="text-secondary small mb-4">
                    {project.description}
                  </p>
                </div>

                <div className="mt-auto pt-3 border-top border-secondary border-opacity-10 d-flex justify-content-between align-items-center">
                  <div className="text-success small fw-bold">
                    {project.results || 'Deployment Success'}
                  </div>
                  <div className="d-flex gap-2">
                    <a href={project.github || '#'} className="text-secondary hover-text-primary"><Github size={18} /></a>
                    <a href={project.url || '#'} className="text-secondary hover-text-primary"><ExternalLink size={18} /></a>
                  </div>
                </div>
              </motion.div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;
