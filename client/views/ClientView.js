import { Store } from '../../core/Store.js';
import { initScrollReveals } from '../utils/animations.js';
import renderHero from '../components/Hero.js';
import { renderSkillsGrid, renderProjectsGrid } from '../components/BentoGrid.js';

export default class ClientView {
    constructor() {
        this.appDiv = null;
    }

    render(appDiv) {
        this.appDiv = appDiv;
        
        // Fetch reactive state directly from the centralized World-Class Store
        const { portfolioData } = Store.getState();
        const { profile, skills, projects, experience, education, gallery } = portfolioData;

        this.appDiv.innerHTML = `
            ${this._renderNav(profile)}
            ${renderHero(profile)}
            ${renderSkillsGrid(skills)}
            ${renderProjectsGrid(projects)}
            ${this._renderGallery(gallery)}
            ${this._renderExperience(experience, education)}
            ${this._renderContact()}
            ${this._renderFooter(profile)}
        `;

        // Initialize world-class IntersectionObserver scroll reveals
        initScrollReveals();
        
        // Bind forms
        this._bindEvents();
    }

    _renderNav(profile) {
        return `
            <nav class="navbar reveal">
                <a href="#/" class="nav-brand">${profile.name.split(' ')[0]}.</a>
                <div class="nav-links">
                    <a href="#projects">Work</a>
                    <a href="#skills">Skills</a>
                    <a href="#contact">Contact</a>
                    <a href="#/admin" style="margin-left: 2rem; color: var(--accent-3);">Admin</a>
                </div>
            </nav>
        `;
    }

    _renderGallery(gallery) {
        if (!gallery || gallery.length === 0) return '';
        return `
            <section id="gallery" class="section">
                <h2 class="reveal"><i class="fas fa-paint-brush" style="color: var(--accent-3);"></i> Creative Gallery</h2>
                <div class="bento-grid" style="margin-top: 3rem; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));">
                    ${gallery.map((item, index) => `
                        <div class="glass reveal" style="padding: 1rem; transition-delay: ${0.1 * (index % 3)}s;">
                            <div style="border-radius: 12px; overflow: hidden; height: 250px; position: relative;" class="gallery-item">
                                <img src="${item.image}" alt="${item.title}" style="width: 100%; height: 100%; object-fit: cover; transition: transform 0.6s ease;">
                            </div>
                            <div style="padding-top: 1.5rem;">
                                <h4>${item.title}</h4>
                                <p style="font-size: 0.85rem; color: var(--accent-3); margin:0;">${item.category}</p>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </section>
        `;
    }

    _renderExperience(experience, education) {
        return `
            <section id="resume" class="section">
                <h2 class="reveal"><i class="fas fa-history" style="color: var(--accent-1);"></i> Journey</h2>
                <div class="bento-grid" style="margin-top: 3rem;">
                    <div class="glass reveal">
                        <h3 style="color: var(--accent-1); margin-bottom: 2rem;">Experience</h3>
                        ${experience.map(exp => `
                            <div style="margin-bottom: 2rem; position: relative; padding-left: 2rem; border-left: 2px solid var(--glass-border);">
                                <div style="position: absolute; left: -7px; top: 0; width: 12px; height: 12px; border-radius: 50%; background: var(--accent-1);"></div>
                                <h4>${exp.role}</h4>
                                <p style="color: var(--accent-1); font-size: 0.9rem; margin-bottom: 0.5rem;">${exp.company} | ${exp.period}</p>
                                <p style="font-size: 0.95rem;">${exp.description}</p>
                            </div>
                        `).join('')}
                    </div>
                    <div class="glass reveal" style="transition-delay: 0.2s;">
                        <h3 style="color: var(--accent-2); margin-bottom: 2rem;">Education</h3>
                        ${education.map(edu => `
                            <div style="margin-bottom: 2rem; position: relative; padding-left: 2rem; border-left: 2px solid var(--glass-border);">
                                <div style="position: absolute; left: -7px; top: 0; width: 12px; height: 12px; border-radius: 50%; background: var(--accent-2);"></div>
                                <h4>${edu.degree}</h4>
                                <p style="color: var(--accent-2); font-size: 0.9rem; margin-bottom: 0.5rem;">${edu.institution} | ${edu.period}</p>
                                <p style="font-size: 0.95rem;">${edu.focus}</p>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </section>
        `;
    }

    _renderContact() {
        return `
            <section id="contact" class="section" style="max-width: 800px; margin: 0 auto;">
                <div class="glass reveal" style="padding: 4rem 3rem;">
                    <h2 style="text-align: center; justify-content: center; margin-bottom: 3rem;">
                        <i class="fas fa-envelope-open-text" style="color: var(--accent-3);"></i> Let's Build Something
                    </h2>
                    <form id="contactForm">
                        <div class="bento-grid" style="gap: 1.5rem; margin-bottom: 1.5rem;">
                            <div class="form-group" style="margin: 0;">
                                <label class="form-label">Name</label>
                                <input type="text" class="form-control" placeholder="John Doe" required>
                            </div>
                            <div class="form-group" style="margin: 0;">
                                <label class="form-label">Email</label>
                                <input type="email" class="form-control" placeholder="john@example.com" required>
                            </div>
                        </div>
                        <div class="form-group">
                            <label class="form-label">Message</label>
                            <textarea class="form-control" placeholder="Share your vision..." required></textarea>
                        </div>
                        <button type="submit" class="btn btn-primary" style="width: 100%; margin-top: 1rem; font-size: 1.1rem; padding: 1.25rem;">
                            Send Transmission
                        </button>
                    </form>
                </div>
            </section>
        `;
    }

    _renderFooter(profile) {
        return `
            <footer class="footer reveal">
                <div style="font-size: 2rem; margin-bottom: 1.5rem; display: flex; justify-content: center; gap: 1.5rem;">
                    <a href="mailto:${profile.email}" style="color: var(--text-secondary); transition: 0.3s; padding: 1rem;"><i class="fas fa-envelope"></i></a>
                    <a href="https://${profile.github}" target="_blank" style="color: var(--text-secondary); transition: 0.3s; padding: 1rem;"><i class="fab fa-github"></i></a>
                    <a href="https://${profile.linkedin}" target="_blank" style="color: var(--text-secondary); transition: 0.3s; padding: 1rem;"><i class="fab fa-linkedin"></i></a>
                </div>
                <p>&copy; ${new Date().getFullYear()} ${profile.name}. Code meticulously crafted by hand.</p>
                <div style="display: flex; justify-content: center; gap: 0.5rem; margin-top: 1rem;">
                    <span class="badge" style="font-size: 0.7rem;">Vanilla JS</span>
                    <span class="badge" style="font-size: 0.7rem;">MVC Core</span>
                    <span class="badge" style="font-size: 0.7rem;">Pub/Sub Architecture</span>
                </div>
            </footer>
        `;
    }

    _bindEvents() {
        const cForm = document.getElementById('contactForm');
        if(cForm) {
            cForm.addEventListener('submit', (e) => {
                e.preventDefault();
                cForm.innerHTML = `
                    <div style="text-align:center; padding: 3rem 0; animation: fadeIn 0.5s ease;">
                        <i class="fas fa-check-circle" style="font-size: 4rem; color: var(--accent-1); margin-bottom: 1.5rem;"></i>
                        <h3 style="font-size: 2rem;">Transmission Received</h3>
                        <p style="font-size: 1.1rem;">I'll be in touch with you shortly to discuss your vision.</p>
                    </div>
                `;
            });
        }
    }
}
