import { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, Mail, MapPin, Phone, Github, Linkedin, CheckCircle } from 'lucide-react';
import usePortfolioStore from '../../store/usePortfolioStore';

const Contact = () => {
  const { profile } = usePortfolioStore();
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real app, we'd sync this to MongoDB or IndexedDB
    setIsSubmitted(true);
    setTimeout(() => setIsSubmitted(false), 5000);
  };

  if (!profile) return null;

  return (
    <section id="contact" className="section-padding bg-darker">
      <div className="container">
        <div className="d-flex align-items-center gap-3 mb-5">
          <h2 className="display-4 fw-bold mb-0">CONT<span className="gradient-text">ACT</span></h2>
          <div className="bg-primary opacity-20 h-px flex-grow-1"></div>
        </div>

        <div className="row g-5">
          <div className="col-lg-5">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h3 className="h3 text-white mb-4">Let's build something intelligent.</h3>
              <p className="text-secondary mb-5">
                Whether you have a question about AI/ML implementation or want to discuss a potential project, feel free to reach out.
              </p>

              <div className="d-flex flex-column gap-4">
                <div className="d-flex align-items-center gap-3 text-secondary">
                  <div className="p-3 rounded-circle glass text-primary"><Mail size={20} /></div>
                  <div>
                    <div className="small fw-bold text-white">Email</div>
                    <div className="small">{profile.email}</div>
                  </div>
                </div>
                <div className="col-sm-6">
                  <div className="d-flex align-items-center gap-3 text-secondary">
                    <div className="p-3 rounded-circle glass text-primary"><Phone size={20} /></div>
                    <div>
                      <div className="small fw-bold text-white">Phone</div>
                      <div className="small">{profile.phone}</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-5 pt-5 border-top border-secondary border-opacity-10">
                <div className="d-flex gap-3">
                  <a href={`https://${profile.github}`} className="p-3 rounded-circle glass text-secondary hover-text-primary transition-all"><Github size={20} /></a>
                  <a href={`https://${profile.linkedin}`} className="p-3 rounded-circle glass text-secondary hover-text-primary transition-all"><Linkedin size={20} /></a>
                </div>
              </div>
            </motion.div>
          </div>

          <div className="col-lg-7">
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="glass-card p-4 p-md-5"
            >
              {isSubmitted ? (
                <div className="text-center py-5">
                  <CheckCircle size={64} className="text-success mb-4" />
                  <h4 className="text-white h3 mb-2">Message Sent!</h4>
                  <p className="text-secondary">System has received your transmission. Return to core shortly.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <div className="row g-4">
                    <div className="col-md-6">
                      <label className="form-label text-secondary small fw-bold">Name</label>
                      <input type="text" className="form-control" placeholder="Identify yourself..." required />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label text-secondary small fw-bold">Email</label>
                      <input type="email" className="form-control" placeholder="Return address..." required />
                    </div>
                    <div className="col-12">
                      <label className="form-label text-secondary small fw-bold">Message</label>
                      <textarea className="form-control" rows="5" placeholder="Details of your request..." required></textarea>
                    </div>
                    <div className="col-12 mt-4">
                      <button type="submit" className="btn btn-primary px-5 py-3 w-100 fw-bold text-dark d-flex align-items-center justify-content-center gap-2">
                        <Send size={18} />
                        Transmit Message
                      </button>
                    </div>
                  </div>
                </form>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
