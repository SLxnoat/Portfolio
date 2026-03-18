export default class ClientView {
    constructor() {
        this.appDiv = null;
    }

    render(appDiv, data) {
        this.appDiv = appDiv;
        
        const { profile, skills, projects, experience, education, gallery } = data;

        this.appDiv.innerHTML = `
            <!-- Sticky Navigation -->
            <nav class="sticky animate-fade-in" style="animation-delay: 0.0s">
                <a href="#/" class="nav-brand">${profile.name}</a>
                <div class="nav-links">
                    <a href="#home">Home</a>
                    <a href="#projects">Projects</a>
                    <a href="#gallery">Gallery</a>
                    <a href="#contact">Contact</a>
                    <a href="#/admin" style="color: var(--accent-color); font-weight: 700;">Admin <i class="fas fa-lock"></i></a>
                </div>
            </nav>

            <!-- Hero Section with Photo Placeholder -->
            <section id="home" class="animate-fade-in" style="animation-delay: 0.1s; display: flex; flex-direction: column; align-items: center; text-align: center;">
                <div class="profile-photo">
                    <i class="fas fa-user-astronaut"></i>
                    <!-- Avatar placeholder. Add your image source in the DB or hardcode an <img> tag here. -->
                </div>
                <h1>${profile.name}</h1>
                <h2 style="color: var(--accent-color); margin-bottom: 1.5rem;">${profile.title}</h2>
                <p style="font-size: 1.2rem; max-width: 800px; margin-bottom: 2.5rem;">${profile.summary}</p>
                
                <div style="display: flex; gap: 1rem; flex-wrap: wrap; justify-content: center;">
                    <a href="#contact" class="btn btn-primary"><i class="fas fa-paper-plane"></i> Get in Touch</a>
                    <a href="https://${profile.github}" target="_blank" class="btn btn-outline"><i class="fab fa-github"></i> GitHub</a>
                    <a href="https://${profile.linkedin}" target="_blank" class="btn btn-outline"><i class="fab fa-linkedin"></i> LinkedIn</a>
                </div>
            </section>

            <!-- Skills Section -->
            <section id="skills" class="glass-panel animate-fade-in" style="animation-delay: 0.2s;">
                <h2><i class="fas fa-code"></i> Technical Skills</h2>
                <div class="grid grid-2" style="margin-top: 2rem;">
                    ${skills.map(skill => `
                        <div>
                            <h4 style="color: var(--text-primary); margin-bottom: 0.5rem;">${skill.category}</h4>
                            <div style="display: flex; flex-wrap: wrap;">
                                ${skill.items.split(', ').map(item => `<span class="badge">${item}</span>`).join('')}
                            </div>
                        </div>
                    `).join('')}
                </div>
            </section>

            <!-- Rebuilt My Projects -->
            <section id="projects" class="animate-fade-in" style="animation-delay: 0.3s;">
                <h2 style="margin-bottom: 2rem;"><i class="fas fa-laptop-code"></i> My Projects</h2>
                <div class="grid grid-2">
                    ${projects.map(project => `
                        <div class="glass-panel" style="display: flex; flex-direction: column;">
                            <h3 style="color: var(--accent-color);">${project.title}</h3>
                            <p style="font-size: 0.85rem; color: #fff; margin-bottom: 1.5rem; background: rgba(59, 130, 246, 0.2); padding: 0.5rem; border-radius: 6px;">
                                <i class="fas fa-layer-group"></i> ${project.stack}
                            </p>
                            <p style="flex-grow: 1;">${project.description}</p>
                            <div style="margin-top: 1.5rem;">
                                <a href="https://${project.github}" target="_blank" class="btn btn-outline" style="width: 100%; text-align: center;">
                                    <i class="fab fa-github"></i> View Source
                                </a>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </section>

            <!-- Design Gallery Section -->
            <section id="gallery" class="animate-fade-in" style="animation-delay: 0.4s;">
                <h2 style="margin-bottom: 2rem;"><i class="fas fa-palette"></i> Design Gallery</h2>
                <div class="grid grid-3">
                    ${(gallery || []).map(item => `
                        <div class="gallery-item">
                            <img src="${item.image}" alt="${item.title}">
                            <div class="gallery-content">
                                <h4>${item.title}</h4>
                                <p style="font-size: 0.8rem; margin:0; color:var(--accent-color);">${item.category}</p>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </section>

            <!-- Experience & Education -->
            <section id="resume" class="glass-panel animate-fade-in" style="animation-delay: 0.5s;">
                <h2><i class="fas fa-briefcase"></i> Experience & Education</h2>
                <div class="grid grid-2" style="margin-top: 2rem;">
                    <div>
                        <h3 style="margin-bottom: 1.5rem; color: var(--accent-color);">Experience</h3>
                        ${experience.map(exp => `
                            <div style="margin-bottom: 1.5rem; border-left: 2px solid var(--border-glass); padding-left: 1rem;">
                                <h4>${exp.role}</h4>
                                <div style="color: var(--text-secondary); font-size: 0.9rem; margin-bottom: 0.5rem;">
                                    ${exp.company} | ${exp.period}
                                </div>
                                <p style="font-size: 0.95rem;">${exp.description}</p>
                            </div>
                        `).join('')}
                    </div>
                    <div>
                        <h3 style="margin-bottom: 1.5rem; color: var(--accent-color);">Education</h3>
                        ${education.map(edu => `
                            <div style="margin-bottom: 1.5rem; border-left: 2px solid var(--border-glass); padding-left: 1rem;">
                                <h4>${edu.degree}</h4>
                                <div style="color: var(--text-secondary); font-size: 0.9rem; margin-bottom: 0.5rem;">
                                    ${edu.institution} | ${edu.period}
                                </div>
                                <p style="font-size: 0.95rem;">${edu.focus}</p>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </section>

            <!-- Contact Section -->
            <section id="contact" class="animate-fade-in" style="animation-delay: 0.6s;">
                <div class="glass-panel" style="max-width: 700px; margin: 0 auto;">
                    <h2 style="text-align: center; margin-bottom: 2rem;"><i class="fas fa-envelope-open-text"></i> Get in Touch</h2>
                    <form id="contactForm">
                        <div class="form-group">
                            <label>Name</label>
                            <input type="text" class="form-control" placeholder="Your Name" required>
                        </div>
                        <div class="form-group">
                            <label>Email</label>
                            <input type="email" class="form-control" placeholder="your@email.com" required>
                        </div>
                        <div class="form-group">
                            <label>Message</label>
                            <textarea class="form-control" placeholder="How can we work together?" required></textarea>
                        </div>
                        <button type="submit" class="btn btn-primary" style="width: 100%;"><i class="fas fa-paper-plane"></i> Send Message</button>
                    </form>
                </div>
            </section>

            <!-- Specific Rebuilt Footer -->
            <footer class="app-footer animate-fade-in" style="animation-delay: 0.7s;">
                <div style="margin-bottom: 1rem; font-size: 1.5rem;">
                    <a href="mailto:${profile.email}" style="color: var(--text-secondary); margin: 0 0.5rem; transition: color 0.3s;" onmouseover="this.style.color='#fff'" onmouseout="this.style.color='var(--text-secondary)'"><i class="fas fa-envelope"></i></a>
                    <a href="https://${profile.github}" target="_blank" style="color: var(--text-secondary); margin: 0 0.5rem; transition: color 0.3s;" onmouseover="this.style.color='#fff'" onmouseout="this.style.color='var(--text-secondary)'"><i class="fab fa-github"></i></a>
                    <a href="https://${profile.linkedin}" target="_blank" style="color: var(--text-secondary); margin: 0 0.5rem; transition: color 0.3s;" onmouseover="this.style.color='#fff'" onmouseout="this.style.color='var(--text-secondary)'"><i class="fab fa-linkedin"></i></a>
                </div>
                <p>&copy; ${new Date().getFullYear()} ${profile.name}. Designed & Built with ❤️</p>
                <p style="font-size: 0.85rem; margin-top: 0.5rem;">Vanilla JS MVC Architecture | UI Rebuilt</p>
            </footer>
        `;

        // Handle Contact Form interactive submission
        const contactForm = document.getElementById('contactForm');
        if(contactForm) {
            contactForm.addEventListener('submit', (e) => {
                e.preventDefault();
                contactForm.innerHTML = '<div style="text-align:center; padding: 2rem; animation: fadeIn 0.5s ease forwards;"><i class="fas fa-check-circle" style="font-size: 3rem; color: #10b981; margin-bottom: 1rem;"></i><h3>Message Sent!</h3><p>Thank you for reaching out. I will get back to you soon.</p></div>';
            });
        }
    }
}
