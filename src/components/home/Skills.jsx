import { motion } from 'framer-motion';
import usePortfolioStore from '../../store/usePortfolioStore';
import { Cpu, Database, Globe, Code } from 'lucide-react';

const Skills = () => {
  const { skills } = usePortfolioStore();

  const getIcon = (category) => {
    const cat = category.toLowerCase();
    if (cat.includes('ai') || cat.includes('ml')) return <Cpu size={24} />;
    if (cat.includes('framework')) return <Code size={24} />;
    if (cat.includes('data')) return <Database size={24} />;
    return <Globe size={24} />;
  };

  return (
    <section id="skills" className="section-padding bg-darker">
      <div className="container">
        <div className="d-flex align-items-center gap-3 mb-5">
          <h2 className="display-4 fw-bold mb-0">SK<span className="gradient-text">ILLS</span></h2>
          <div className="bg-primary opacity-20 h-px flex-grow-1"></div>
        </div>

        <div className="row g-4">
          {skills.map((skill, index) => (
            <div key={skill.id || index} className="col-md-6 col-lg-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="glass-card p-4 h-100 skill-card"
                whileHover={{ y: -10 }}
              >
                <div className="d-flex align-items-center gap-3 mb-4">
                  <div className="p-3 rounded-xl bg-primary bg-opacity-10 text-primary border border-primary border-opacity-20 icon-wrapper">
                    {getIcon(skill.category)}
                  </div>
                  <h3 className="h5 text-white mb-0">{skill.category}</h3>
                </div>

                <div className="d-flex flex-wrap gap-2">
                  {skill.items.split(',').map((item, i) => (
                    <motion.span 
                      key={i} 
                      className="skill-pill"
                      whileHover={{ scale: 1.05 }}
                    >
                      {item.trim()}
                    </motion.span>
                  ))}
                </div>
              </motion.div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Skills;
