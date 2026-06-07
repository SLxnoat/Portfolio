export default class ClientView {
    constructor() {
        this.appContainer = document.getElementById('client-app');
        this.onSendMessage = null;
        this.onTrackEvent = null; // New analytics callback
    }

    async generateSalt() {
        const saltBytes = crypto.getRandomValues(new Uint8Array(16));
        return Array.from(saltBytes).map(b => b.toString(16).padStart(2, '0')).join('');
    }

    arrayBufferToBase64(buffer) {
        const bytes = new Uint8Array(buffer);
        let binary = '';
        const chunkSize = 0x8000;
        for (let i = 0; i < bytes.length; i += chunkSize) {
            binary += String.fromCharCode(...bytes.subarray(i, i + chunkSize));
        }
        return btoa(binary);
    }

    async hashPassword(password, salt) {
        const encoder = new TextEncoder();
        const keyMaterial = await crypto.subtle.importKey(
            'raw',
            encoder.encode(password),
            { name: 'PBKDF2' },
            false,
            ['deriveBits']
        );
        const derivedBits = await crypto.subtle.deriveBits(
            {
                name: 'PBKDF2',
                salt: encoder.encode(salt),
                iterations: 150000,
                hash: 'SHA-256'
            },
            keyMaterial,
            256
        );
        return this.arrayBufferToBase64(derivedBits);
    }

    renderHeader(profile, sections) {
        const labels = {
            'about': profile.ui_nav_about || 'About',
            'skills': profile.ui_nav_skills || 'Skills',
            'projects': profile.ui_nav_projects || 'Projects',
            'experience': profile.ui_nav_experience || 'Experience',
            'contact': profile.ui_nav_contact || 'Contact'
        };

        const navLinks = sections.map(sec => `<li class="nav-item"><a class="nav-link text-uppercase" style="letter-spacing:1px; font-size:0.9rem;" href="#${sec}">${labels[sec]}</a></li>`).join('');

        return `
        <nav class="navbar navbar-expand-lg navbar-dark cyber-navbar fixed-top">
            <div class="container">
                <a class="navbar-brand fw-bold" href="#"><span class="gradient-text">${profile.name}</span></a>
                <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                    <span class="navbar-toggler-icon"></span>
                </button>
                <div class="collapse navbar-collapse justify-content-end" id="navbarNav">
                    <ul class="navbar-nav gap-3">
                        ${navLinks}
                    </ul>
                </div>
            </div>
        </nav>`;
    }

    renderHero(data) {
        const profile = this.currentProfile;
        return `
        <section class="hero-section position-relative d-flex align-items-center" style="min-height: 100vh; overflow: hidden; padding-top: 80px;">
            <div class="position-absolute fw-bolder text-uppercase" style="font-size: 20vw; color: rgba(255,255,255,0.015); top: 10%; left: -5%; z-index: 0; user-select: none; pointer-events: none; white-space: nowrap;">${profile.ui_hero_bg || 'HELLO'}</div>
            <div class="hero-glow" style="width: 50vw; height: 50vw; background: radial-gradient(circle, rgba(0, 240, 255, 0.1) 0%, transparent 70%); top: -20%; left: -10%;"></div>
            <div class="hero-glow-2" style="width: 40vw; height: 40vw; background: radial-gradient(circle, rgba(185, 0, 255, 0.1) 0%, transparent 70%); bottom: -10%; right: -10%;"></div>
            
            <div class="container position-relative z-1 py-5">
                <div class="row align-items-center g-5">
                    <div class="col-lg-7 text-center text-lg-start pe-lg-5">
                        <div class="d-flex flex-wrap justify-content-center justify-content-lg-start align-items-center mb-3 gap-3 animate-user-intro">
                            <div class="d-inline-flex align-items-center glass-card px-3 py-2 rounded-pill shadow-sm" style="border-left: 2px solid var(--accent-primary); background: rgba(0, 240, 255, 0.05);">
                                <span class="spinner-grow spinner-grow-sm me-2" style="color: var(--accent-primary);" role="status"></span>
                                <span class="font-monospace text-uppercase small fw-bold" style="letter-spacing: 2px; color: var(--accent-primary);">${profile.ui_hero_status || 'System Online // User Identified'}</span>
                            </div>
                            ${profile.openToWork ? `
                            <div class="d-inline-flex align-items-center glass-card px-3 py-2 rounded-pill shadow-sm" style="border-left: 2px solid #28a745; background: rgba(40, 167, 69, 0.05);">
                                <span class="spinner-grow spinner-grow-sm me-2" style="color: #28a745;" role="status"></span>
                                <span class="font-monospace text-uppercase small fw-bold" style="letter-spacing: 2px; color: #28a745;">OPEN TO WORK</span>
                            </div>` : ''}
                        </div>
                        <h1 class="display-2 fw-bolder mb-3 animate-name text-white" style="text-shadow: 0 10px 30px rgba(0,0,0,0.5);">${profile.name}</h1>
                        <h2 class="h2 mb-4 animate-role font-monospace">
                            <span class="text-secondary">&gt; </span>
                            <div class="typing-container">
                                <span class="gradient-text fw-bold typing-text">${profile.role}</span>
                            </div>
                        </h2>
                        <p class="lead text-secondary mb-5 max-w-lg mx-auto mx-lg-0 animate-tagline" style="line-height: 1.8;">${profile.tagline}</p>
                        
                        <div class="d-flex gap-3 justify-content-center justify-content-lg-start flex-wrap animate-actions mb-5">
                            <a href="#projects" class="btn btn-lg rounded-pill px-5 py-3 fw-bold shadow-lg position-relative overflow-hidden group hover-lift analytics-track" data-event="EXPLORE_CLICK" style="background: linear-gradient(90deg, var(--accent-primary), var(--accent-secondary)); color: #000; border: none; transition: transform 0.3s ease;">
                                <span class="position-relative z-1">${profile.ui_hero_btn || 'Explore Arsenal'} <i class="fas fa-arrow-right ms-2 transition-transform"></i></span>
                            </a>
                            ${profile.cv ? `<a href="${profile.cv}" download="${profile.name.replace(/\s+/g, '_')}_CV.pdf" class="btn btn-lg rounded-pill px-5 py-3 fw-bold shadow-lg position-relative overflow-hidden group hover-lift analytics-track" data-event="CV_DOWNLOAD" style="background: linear-gradient(90deg, var(--accent-primary), var(--accent-secondary)); color: #000; border: none; transition: transform 0.3s ease;"><i class="fas fa-file-download me-2"></i>Download CV</a>` : `<button type="button" class="btn btn-lg rounded-pill px-5 py-3 fw-bold shadow-lg position-relative overflow-hidden group" style="background: rgba(255,255,255,0.08); color: rgba(255,255,255,0.75); border: none; cursor: default;">
                                    <i class="fas fa-file-upload me-2"></i>Upload CV in Admin
                                </button>`}
                        </div>
                        
                        <div class="animate-socials d-flex align-items-center gap-4 justify-content-center justify-content-lg-start border-top border-secondary pt-4 mt-4" style="border-color: rgba(255,255,255,0.05) !important;">
                            <span class="text-secondary small text-uppercase fw-bold letter-spacing-2">Connect:</span>
                            <a href="https://${profile.github}" target="_blank" class="text-secondary fs-4 hover-white" aria-label="GitHub Repository Link" style="transition: all 0.3s" onmouseover="this.style.transform='translateY(-3px)'" onmouseout="this.style.transform='translateY(0)'"><i class="fab fa-github"></i></a>
                            <a href="https://${profile.linkedin}" target="_blank" class="text-secondary fs-4 hover-white" aria-label="LinkedIn Professional Link" style="transition: all 0.3s" onmouseover="this.style.transform='translateY(-3px)'" onmouseout="this.style.transform='translateY(0)'"><i class="fab fa-linkedin"></i></a>
                            <a href="mailto:${profile.email}" class="text-secondary fs-4 hover-white" aria-label="Direct Email Link" style="transition: all 0.3s" onmouseover="this.style.transform='translateY(-3px)'" onmouseout="this.style.transform='translateY(0)'"><i class="fas fa-envelope"></i></a>
                        </div>
                    </div>
                    
                    <div class="col-lg-5 text-center position-relative mt-5 mt-lg-0 animate-name">
                        <div class="hero-portal mx-auto" style="width: 380px; height: 500px; max-width: 100%;">
                            <div class="hero-portal-inner">
                                <img src="${profile.photo || 'avatar/profile.jpg'}" alt="Profile Photo" 
                                     onerror="this.onerror=null; this.src='https://ui-avatars.com/api/?name=${encodeURIComponent(profile.name)}&background=random&color=fff&size=256';"
                                     class="w-100 h-100 object-fit-cover opacity-75" 
                                     style="object-position: center top; transition: transform 0.5s, opacity 0.5s; cursor: pointer;" 
                                     loading="lazy" 
                                     onmouseover="this.style.transform='scale(1.05)'; this.style.opacity='1';" 
                                     onmouseout="this.style.transform='scale(1)'; this.style.opacity='0.75';">
                            </div>
                        </div>
                        
                        <!-- Floating decorative elements -->
                        <div class="position-absolute glass-card p-3 rounded-3 shadow-lg floating-element" style="top: 10%; left: -20px; border-left: 2px solid var(--accent-primary);">
                            <div class="d-flex align-items-center gap-3">
                                <i class="fas fa-bolt text-warning fa-2x"></i>
                                <div class="text-start">
                                    <h6 class="text-white m-0 fw-bold" style="font-size:0.9rem;">Performance</h6>
                                    <small class="text-secondary" style="font-size:0.75rem;">Optimized</small>
                                </div>
                            </div>
                        </div>
                        <div class="position-absolute glass-card p-3 rounded-3 shadow-lg floating-element" style="bottom: 15%; right: -20px; border-right: 2px solid var(--accent-secondary); animation-delay: 1.5s;">
                            <div class="d-flex align-items-center gap-3">
                                <div class="text-end">
                                    <h6 class="text-white m-0 fw-bold" style="font-size:0.9rem;">Design</h6>
                                    <small class="text-secondary" style="font-size:0.75rem;">Premium</small>
                                </div>
                                <i class="fas fa-paint-brush text-info fa-2x"></i>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="position-absolute bottom-0 start-50 translate-middle-x mb-4 z-1 text-center animate-socials" style="animation-delay: 1.5s;">
                <p class="text-secondary small font-monospace text-uppercase mb-2" style="letter-spacing: 2px; font-size: 0.7rem;">${profile.ui_hero_deploy || 'Deploying Modules'}</p>
                <div class="mx-auto border border-secondary rounded-pill d-flex justify-content-center pt-1" style="width: 24px; height: 38px;">
                    <div class="bg-white rounded-circle scroll-indicator-dot" style="width: 4px; height: 8px;"></div>
                </div>
            </div>
        </section>`;
    }

    renderAbout() {
        const profile = this.currentProfile;
        return `
        <section id="about" class="py-5 position-relative mt-5 reveal">
            <div class="position-absolute fw-bolder text-uppercase" style="font-size: 16vw; color: rgba(255,255,255,0.02); top: -80px; left: -20px; z-index: 0; user-select: none; pointer-events: none; overflow: hidden; white-space: nowrap;">${profile.ui_about_bg || 'ABOUT'}</div>
            <div class="container position-relative z-1">
                <div class="d-flex align-items-center mb-5">
                    <div class="flex-grow-1 me-4 rounded-pill" style="height: 3px; background: linear-gradient(90deg, transparent, var(--accent-primary)); opacity: 0.5;"></div>
                    <h2 class="m-0 gradient-text d-inline-block display-5 fw-bold font-monospace">&lt;About /&gt;</h2>
                    <div class="flex-grow-1 ms-4 rounded-pill" style="height: 3px; background: linear-gradient(270deg, transparent, var(--accent-secondary)); opacity: 0.5;"></div>
                </div>
                <div class="row align-items-center g-5">
                    <div class="col-lg-7">
                        <div class="glass-card h-100 position-relative overflow-hidden p-4 p-md-5" style="border-left: 4px solid var(--accent-secondary);">
                            <div class="position-absolute" style="top: -50px; right: -50px; width: 200px; height: 200px; background: var(--accent-secondary); filter: blur(100px); opacity: 0.15; border-radius: 50%;"></div>
                            <div class="position-absolute" style="bottom: -50px; left: -50px; width: 200px; height: 200px; background: var(--accent-primary); filter: blur(100px); opacity: 0.1; border-radius: 50%;"></div>
                            <i class="fas fa-quote-left fa-3x mb-4" style="color: var(--accent-secondary); opacity: 0.3;"></i>
                            <p style="white-space: pre-line; font-size: 1.15rem; line-height: 1.9; font-weight: 300;" class="text-light m-0 position-relative z-1">${profile.summary}</p>
                        </div>
                    </div>
                    <div class="col-lg-5">
                        <div class="glass-card h-100 p-0 overflow-hidden" style="background: rgba(5,5,8,0.8); border: 1px solid rgba(0, 240, 255, 0.15); box-shadow: 0 15px 35px rgba(0,0,0,0.5);">
                            <div class="d-flex align-items-center px-4 py-3 border-bottom" style="background: rgba(255,255,255,0.03); border-color: rgba(255,255,255,0.05) !important;">
                                <div class="rounded-circle me-2 shadow-sm" style="width: 14px; height: 14px; background: #ff5f56;"></div>
                                <div class="rounded-circle me-2 shadow-sm" style="width: 14px; height: 14px; background: #ffbd2e;"></div>
                                <div class="rounded-circle shadow-sm" style="width: 14px; height: 14px; background: #27c93f;"></div>
                                <div class="ms-4 text-secondary font-monospace small">${profile.ui_terminal_prompt || 'sys_admin@portfolio:~'}</div>
                            </div>
                            <div class="p-4 p-md-5 font-monospace fs-6">
                                <p class="mb-4"><span style="color: var(--accent-primary);">${profile.ui_terminal_prompt || 'sys_admin@portfolio:~$'}</span> whoami<br><span class="text-white ms-3 d-block mt-2 fw-bold" style="color: var(--accent-secondary) !important;">${profile.name}</span></p>
                                <p class="mb-4"><span style="color: var(--accent-primary);">${profile.ui_terminal_prompt || 'sys_admin@portfolio:~$'}</span> locate<br><span class="text-white ms-3 d-block mt-2"><i class="fas fa-map-marker-alt text-danger me-2"></i>${profile.location}</span></p>
                                <p class="mb-4"><span style="color: var(--accent-primary);">${profile.ui_terminal_prompt || 'sys_admin@portfolio:~$'}</span> contact --email<br><span class="text-white ms-3 d-block mt-2"><i class="fas fa-envelope text-warning me-2"></i>${profile.email}</span></p>
                                <p class="mb-0"><span style="color: var(--accent-primary);">${profile.ui_terminal_prompt || 'sys_admin@portfolio:~$'}</span> contact --phone<br><span class="text-white ms-3 d-block mt-2"><i class="fas fa-phone text-success me-2"></i>${profile.phone}</span></p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>`;
    }

    renderSkills(skills) {
        const profile = this.currentProfile;
        return `
        <section id="skills" class="py-5 position-relative mt-5 reveal">
            <div class="position-absolute fw-bolder text-uppercase w-100 text-end pe-4" style="font-size: 16vw; color: rgba(255,255,255,0.02); top: -60px; right: 0; z-index: 0; user-select: none; pointer-events: none; overflow: hidden; white-space: nowrap;">${profile.ui_skills_bg || 'SKILLS'}</div>
            <div class="container position-relative z-1">
                <div class="text-center mb-5">
                    <h2 class="gradient-text d-inline-block display-5 fw-bold font-monospace mb-3">&lt;Technical_Arsenal /&gt;</h2>
                    <p class="text-secondary lead max-w-lg mx-auto">Core technologies and intelligent frameworks I utilize to architect and deploy state-of-the-art AI solutions.</p>
                </div>
                <div class="row g-4 justify-content-center">
                    ${skills.map((skill, index) => {
            const icons = ['fa-brain', 'fa-code', 'fa-database', 'fa-laptop-code', 'fa-server', 'fa-microchip', 'fa-network-wired'];
            const icon = icons[index % icons.length];
            return `
                        <div class="col-lg-4 col-md-6">
                            <div class="glass-card skill-card h-100 text-center p-4" style="transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275); border-top: 4px solid rgba(0, 240, 255, 0.3);">
                                <div class="icon-wrapper mx-auto mb-4 d-flex align-items-center justify-content-center shadow" style="width: 80px; height: 80px; background: rgba(0, 240, 255, 0.05); border-radius: 50%; border: 1px solid rgba(0,240,255,0.2); transition: all 0.3s ease;">
                                    <i class="fas ${icon} fa-2x" style="color: var(--accent-primary);"></i>
                                </div>
                                <h4 class="h5 mb-4 text-white fw-bold tracking-wide text-uppercase">${skill.category}</h4>
                                <div class="d-flex flex-wrap justify-content-center gap-2">
                                    ${skill.items.split(',').map(item => `<span class="skill-pill">${item.trim()}</span>`).join('')}
                                </div>
                            </div>
                        </div>`;
        }).join('')}
                </div>
            </div>
        </section>`;
    }

    renderProjects(projects) {
        const profile = this.currentProfile;
        return `
        <section id="projects" class="py-5 position-relative mt-5 reveal">
            <div class="position-absolute fw-bolder text-uppercase w-100" style="font-size: 16vw; color: rgba(255,255,255,0.02); top: -60px; left: -20px; z-index: 0; user-select: none; pointer-events: none; overflow: hidden; white-space: nowrap;">${profile.ui_projects_bg || 'PROJECTS'}</div>
            <div class="container position-relative z-1">
                <div class="d-flex align-items-center mb-5">
                    <div class="flex-grow-1 me-4 rounded-pill" style="height: 3px; background: linear-gradient(90deg, transparent, var(--accent-secondary)); opacity: 0.5;"></div>
                    <h2 class="m-0 gradient-text d-inline-block display-5 fw-bold font-monospace">&lt;Innovations /&gt;</h2>
                    <div class="flex-grow-1 ms-4 rounded-pill" style="height: 3px; background: linear-gradient(270deg, transparent, var(--accent-primary)); opacity: 0.5;"></div>
                </div>
                <div class="row g-4">
                    ${projects.map((proj, i) => `
                    <div class="col-lg-4 col-md-6" style="animation: fadeInScale 0.6s ease ${i * 0.1}s backwards;">
                        <div class="glass-card project-card h-100 d-flex flex-column p-4 p-xl-5 position-relative overflow-hidden">
                            <div class="position-absolute" style="top: -20px; right: -20px; color: rgba(255,255,255,0.02);">
                                <i class="fas fa-folder fa-10x"></i>
                            </div>
                            <div class="d-flex justify-content-between align-items-center mb-4 position-relative z-1">
                                <div class="rounded-circle d-flex align-items-center justify-content-center" style="width: 50px; height: 50px; background: rgba(185, 0, 255, 0.1); border: 1px solid rgba(185, 0, 255, 0.3);">
                                    <i class="fas fa-rocket fs-5" style="color: var(--accent-secondary);"></i>
                                </div>
                                <a href="#" class="text-secondary hover-white"><i class="fas fa-external-link-alt fs-5"></i></a>
                            </div>
                            <h4 class="h5 mb-3 text-white fw-bold position-relative z-1">${proj.title}</h4>
                            <div class="mb-4 position-relative z-1">
                                ${proj.tech.split(',').map(t => `<span class="project-tech-pill font-monospace">${t.trim()}</span>`).join('')}
                            </div>
                            <p class="text-secondary small mb-4 flex-grow-1 position-relative z-1" style="line-height: 1.7;">${proj.description}</p>
                            ${proj.results ? `
                            <div class="p-3 mb-3 rounded position-relative z-1" style="background: rgba(0, 240, 255, 0.03); border-left: 2px solid var(--accent-primary);">
                                <small class="text-light"><i class="fas fa-chart-line me-2" style="color: var(--accent-primary);"></i>${proj.results}</small>
                            </div>` : ''}
                            ${proj.features ? `<p class="small text-muted mb-0 position-relative z-1"><i class="fas fa-star me-2" style="color: var(--accent-secondary);"></i>${proj.features}</p>` : ''}
                        </div>
                    </div>`).join('')}
                </div>
            </div>
        </section>`;
    }

    renderExperience(exp, edu) {
        const profile = this.currentProfile;
        return `
        <section id="experience" class="py-5 position-relative mt-5 mb-5 reveal">
            <div class="position-absolute fw-bolder text-uppercase w-100 text-end pe-4" style="font-size: 16vw; color: rgba(255,255,255,0.02); top: -40px; right: 0; z-index: 0; user-select: none; pointer-events: none; overflow: hidden; white-space: nowrap;">${profile.ui_timeline_bg || 'TIMELINE'}</div>
            <div class="container position-relative z-1">
                <div class="row g-5">
                    <div class="col-lg-6">
                        <div class="d-flex align-items-center mb-5">
                            <h2 class="m-0 gradient-text d-inline-block display-6 fw-bold font-monospace">&lt;Experience /&gt;</h2>
                        </div>
                        <div class="timeline-container ps-4 mt-4">
                            ${exp.map(e => `
                            <div class="timeline-node mb-5">
                                <div class="timeline-dot"></div>
                                <div class="timeline-card">
                                    <div class="d-flex justify-content-between align-items-start mb-2 flex-wrap">
                                        <h5 class="mb-1 text-white fw-bold me-3">${e.title}</h5>
                                        <span class="badge rounded-pill bg-dark border font-monospace text-light px-3 py-2 mt-2 mt-sm-0" style="border-color: var(--accent-primary) !important;">${e.date}</span>
                                    </div>
                                    <h6 class="text-secondary mb-3"><i class="fas fa-building me-2" style="color: var(--accent-primary);"></i>${e.company}</h6>
                                    <p class="mb-0 small text-secondary" style="line-height: 1.8;">${e.desc}</p>
                                </div>
                            </div>`).join('')}
                        </div>
                    </div>
                    
                    <div class="col-lg-6">
                        <div class="d-flex align-items-center mb-5">
                            <h2 class="m-0 gradient-text d-inline-block display-6 fw-bold font-monospace">&lt;Education /&gt;</h2>
                        </div>
                        <div class="timeline-container ps-4 mt-4" style="border-left-color: rgba(185, 0, 255, 0.3);">
                            ${edu.map(e => `
                            <div class="timeline-node edu-node mb-5">
                                <div class="timeline-dot"></div>
                                <div class="timeline-card">
                                    <div class="d-flex justify-content-between align-items-start mb-2 flex-wrap">
                                        <h5 class="mb-1 text-white fw-bold lh-base me-3">${e.degree}</h5>
                                        <span class="badge rounded-pill bg-dark border font-monospace text-light px-3 py-2 mt-2 mt-sm-0" style="border-color: var(--accent-secondary) !important;">${e.date}</span>
                                    </div>
                                    <h6 class="text-secondary mb-0"><i class="fas fa-university me-2" style="color: var(--accent-secondary);"></i>${e.inst}</h6>
                                </div>
                            </div>`).join('')}
                        </div>
                    </div>
                </div>
            </div>
        </section>`;
    }

    renderContact() {
        const profile = this.currentProfile;
        return `
        <section id="contact" class="py-5 position-relative mt-5 reveal">
            <div class="position-absolute fw-bolder text-uppercase" style="font-size: 16vw; color: rgba(255,255,255,0.02); top: -40px; left: -20px; z-index: 0; user-select: none; pointer-events: none; overflow: hidden; white-space: nowrap;">${profile.ui_contact_bg || 'CONTACT'}</div>
            <div class="container position-relative z-1">
                <div class="row justify-content-center mb-5 text-center">
                    <div class="col-lg-8">
                        <h2 class="mb-4 gradient-text display-5 fw-bold font-monospace">&lt;Get_In_Touch /&gt;</h2>
                        <p class="text-secondary lead">Interested in building intelligent AI systems together? Send a transmission to my secure inbox.</p>
                    </div>
                </div>
                <div class="row justify-content-center g-4 mb-5">
                    <div class="col-md-5">
                        <div class="glass-card h-100 text-center d-flex flex-column justify-content-center p-5 hover-lift" style="border-top: 3px solid var(--accent-primary); transition: transform 0.3s ease;">
                            <div class="rounded-circle mx-auto mb-4 d-flex align-items-center justify-content-center shadow-lg" style="width: 80px; height: 80px; background: rgba(0, 240, 255, 0.1);">
                                <i class="fas fa-envelope fa-2x" style="color: var(--accent-primary);"></i>
                            </div>
                            <h4 class="text-white mb-3 fw-bold">Email</h4>
                            <p class="text-secondary mb-0"><a href="mailto:${profile.email}" class="text-decoration-none text-secondary hover-white fs-5">${profile.email}</a></p>
                        </div>
                    </div>
                    <div class="col-md-5">
                        <div class="glass-card h-100 text-center d-flex flex-column justify-content-center p-5 hover-lift" style="border-top: 3px solid var(--accent-secondary); transition: transform 0.3s ease;">
                            <div class="rounded-circle mx-auto mb-4 d-flex align-items-center justify-content-center shadow-lg" style="width: 80px; height: 80px; background: rgba(185, 0, 255, 0.1);">
                                <i class="fas fa-phone-alt fa-2x" style="color: var(--accent-secondary);"></i>
                            </div>
                            <h4 class="text-white mb-3 fw-bold">Phone</h4>
                            <p class="text-secondary mb-0 fs-5">${profile.phone}</p>
                        </div>
                    </div>
                </div>
                <div class="row justify-content-center">
                    <div class="col-lg-10">
                        <div class="glass-card p-4 p-md-5" id="contact-form-container" style="box-shadow: 0 15px 35px rgba(0,0,0,0.5);">
                            <form id="contactForm">
                                <div class="row g-4">
                                    <div class="col-md-6">
                                        <label class="form-label text-secondary small text-uppercase fw-bold">Name</label>
                                        <input type="text" name="name" class="form-control bg-dark text-white border-secondary py-3" placeholder="John Doe" required>
                                    </div>
                                    <div class="col-md-6">
                                        <label class="form-label text-secondary small text-uppercase fw-bold">Email</label>
                                        <input type="email" name="email" class="form-control bg-dark text-white border-secondary py-3" placeholder="john@example.com" required>
                                    </div>
                                    <div class="col-12">
                                        <label class="form-label text-secondary small text-uppercase fw-bold">Subject</label>
                                        <input type="text" name="subject" class="form-control bg-dark text-white border-secondary py-3" placeholder="Project Inquiry" required>
                                    </div>
                                    <div class="col-12">
                                        <label class="form-label text-secondary small text-uppercase fw-bold">Message</label>
                                        <textarea name="message" class="form-control bg-dark text-white border-secondary py-3" rows="6" placeholder="Transmission contents..." required></textarea>
                                    </div>
                                    <div class="col-12 text-center mt-5">
                                        <button type="submit" class="btn btn-lg rounded-pill px-5 py-3 fw-bold w-100 shadow-lg" style="background: linear-gradient(90deg, var(--accent-primary), var(--accent-secondary)); color:#000; border:none; font-size: 1.1rem; letter-spacing: 1px;">
                                            Send Transmission <i class="fas fa-paper-plane ms-2"></i>
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </section>`;
    }

    showContactSuccess() {
        const container = document.getElementById('contact-form-container');
        if (container) {
            container.innerHTML = `
                <div class="text-center py-5">
                    <div class="d-inline-flex align-items-center justify-content-center rounded-circle mb-4 shadow-lg" style="width: 100px; height: 100px; background: rgba(0, 240, 255, 0.1); border: 2px solid var(--accent-primary);">
                        <i class="fas fa-check fa-3x" style="color: var(--accent-primary);"></i>
                    </div>
                    <h3 class="text-white fw-bold mb-3">Transmission Successful</h3>
                    <p class="text-secondary fs-5">Your message has been saved locally and your email client has been opened so you can send it immediately.</p>
                </div>
            `;
        }
    }

    renderFooter() {
        const profile = this.currentProfile;
        return `
        <footer class="py-5 mt-5 position-relative" style="border-top: 1px solid rgba(255, 255, 255, 0.05); background: rgba(5,5,8,0.8);">
            <div class="container text-center position-relative z-1">
                <div class="mb-4 d-flex justify-content-center gap-4 text-center mx-auto">
                    <a href="https://${profile.github}" target="_blank" aria-label="GitHub" class="text-secondary hover-white fs-4" style="transition: all 0.3s;" onmouseover="this.style.color='var(--accent-primary)'; this.style.transform='translateY(-3px)';" onmouseout="this.style.color=''; this.style.transform='translateY(0)';"><i class="fab fa-github"></i></a>
                    <a href="https://${profile.linkedin}" target="_blank" aria-label="LinkedIn" class="text-secondary hover-white fs-4" style="transition: all 0.3s;" onmouseover="this.style.color='var(--accent-primary)'; this.style.transform='translateY(-3px)';" onmouseout="this.style.color=''; this.style.transform='translateY(0)';"><i class="fab fa-linkedin"></i></a>
                    <a href="mailto:${profile.email}" aria-label="Email" class="text-secondary hover-white fs-4" style="transition: all 0.3s;" onmouseover="this.style.color='var(--accent-primary)'; this.style.transform='translateY(-3px)';" onmouseout="this.style.color=''; this.style.transform='translateY(0)';"><i class="fas fa-envelope"></i></a>
                </div>
                <p class="text-secondary font-monospace small mb-1"><span id="copyright-gateway" style="user-select:none; cursor:default;">© ${new Date().getFullYear()} ${profile.name}.</span> All rights reserved.</p>
                <div class="d-flex justify-content-center align-items-center gap-3 mt-2">
                    <p class="text-secondary small opacity-50 font-monospace mb-0" style="font-size: 0.65rem;"><i class="fas fa-code me-2"></i>${profile.version || 'OS.PRIME_V3.2RC'}</p>
                    <span class="text-secondary opacity-25">|</span>
                    <p class="text-secondary small opacity-50 font-monospace mb-0" style="font-size: 0.65rem;"><i class="fas fa-sync-alt me-2"></i>SYNC_OK: ${new Date().toLocaleTimeString()}</p>
                </div>
            </div>
            <!-- Hidden Sysadmin trigger zone -->
            <div id="sys-gateway" class="position-absolute" style="bottom: 0px; right: 0px; width: 60px; height: 60px; cursor: default; z-index: 100;"></div>
        </footer>`;
    }

    syncMeta(profile) {
        // Documentation & Social Protocol Sync
        document.title = `${profile.name} | ${profile.role}`;
        
        const updateMeta = (selector, content) => {
            const el = document.querySelector(selector);
            if(el) el.setAttribute('content', content);
        };

        const updateText = (selector, content) => {
            const el = document.querySelector(selector);
            if(el) el.innerText = content;
        };

        updateText('#page-title', `${profile.name} | ${profile.role}`);
        updateMeta('#meta-description', profile.tagline);
        updateMeta('#meta-keywords', profile.keywords);
        
        updateMeta('#meta-og-url', profile.url);
        updateMeta('#meta-og-title', `${profile.name} | ${profile.role}`);
        updateMeta('#meta-og-description', profile.tagline);
        if(profile.photo) updateMeta('#meta-og-image', profile.photo);
        
        updateMeta('#meta-tw-title', `${profile.name} | ${profile.role}`);
        updateMeta('#meta-tw-description', profile.tagline);
        updateMeta('#meta-author', profile.name);
        
        const canonical = document.querySelector('#link-canonical');
        if(canonical) canonical.setAttribute('href', profile.url);

        // JSON-LD Update
        const schemaJson = document.querySelector('#schema-json');
        if(schemaJson) {
            const schema = {
                "@context": "https://schema.org/",
                "@type": "Person",
                "name": profile.name,
                "jobTitle": profile.role,
                "url": profile.url,
                "sameAs": [
                    `https://${profile.linkedin}`,
                    `https://${profile.github}`
                ],
                "description": profile.tagline
            };
            schemaJson.text = JSON.stringify(schema, null, 2);
        }
    }

    render(data) {
        const { profile, projects, skills, experience, education, layout } = data;
        // Bug #1: null-guard — if profile is missing every template literal throws
        if (!profile) {
            this.appContainer.innerHTML = `
                <div class="vw-100 vh-100 d-flex justify-content-center align-items-center bg-dark text-white">
                    <div class="text-center">
                        <i class="fas fa-exclamation-triangle fa-3x text-danger mb-4"></i>
                        <h2 class="text-danger fw-bold">Profile Not Found</h2>
                        <p class="text-secondary">The local database returned no profile. Try clearing site data and reloading.</p>
                    </div>
                </div>`;
            return;
        }
        this.currentProfile = profile;
        let html = '';
        const sections = layout && layout.sections ? layout.sections : ['about', 'skills', 'projects', 'experience', 'contact'];

        html += this.renderHeader(profile, sections);
        html += `<main style="padding-top: 60px;">`;
        html += this.renderHero();

        sections.forEach(sec => {
            if (sec === 'about') html += this.renderAbout();
            if (sec === 'skills') html += this.renderSkills(skills);
            if (sec === 'projects') html += this.renderProjects(projects);
            if (sec === 'experience') html += this.renderExperience(experience, education);
            if (sec === 'contact') html += this.renderContact();
        });

        html += `</main>`;
        html += this.renderFooter();

        this.appContainer.innerHTML = html + `
            <div id="os-assistant" class="os-assistant-container">
                <div id="assistant-trigger" class="assistant-trigger">
                    <i class="fas fa-robot"></i>
                </div>
                <div id="assistant-terminal" class="assistant-terminal d-none">
                    <div class="terminal-header">
                        <span><i class="fas fa-terminal me-2"></i>${profile.ui_assistant_name || 'PRIME_AGENT'} ${profile.ui_assistant_ver || 'v1.0'}</span>
                        <button id="close-terminal" style="background:none; border:none; color:rgba(255,255,255,0.5); cursor:pointer; font-size:1.5rem;">×</button>
                    </div>
                    <div id="terminal-output" class="terminal-body">
                        <div class="terminal-log-entry text-secondary-terminal">[SYSTEM_INITIALIZED]</div>
                        <div class="terminal-log-entry">${profile.ui_assistant_welcome || 'WELCOME, VISITOR.'} <span class="text-prime fw-bold">I AM ${profile.ui_assistant_name || 'PRIME_AGENT'}.</span></div>
                        <div class="terminal-log-entry">TYPE <span class="text-command">'HELP'</span> TO VIEW AVAILABLE SECTORS.</div>
                    </div>
                    <div class="terminal-input-line">
                        <span>></span>
                        <input type="text" id="terminal-input" placeholder="Enter Command..." autocomplete="off">
                    </div>
                </div>
            </div>
        `;

        this.syncMeta(profile);

        // Contact Form event listener
        const contactForm = document.getElementById('contactForm');
        if (contactForm) {
            contactForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const formData = new FormData(contactForm);
                const msgData = Object.fromEntries(formData.entries());
                if (this.onSendMessage) {
                    this.onSendMessage(msgData);
                }
            });
        }

        // Update local reference to profile for auth triggers
        this.currentProfile = profile;
        // Attach listeners once
        this.attachAdminTriggers();

        // Analytics Tracking for dynamic buttons
        this.appContainer.querySelectorAll('.analytics-track').forEach(btn => {
            btn.addEventListener('click', () => {
                if(this.onTrackEvent) {
                    this.onTrackEvent(btn.dataset.event, { text: btn.innerText.trim() });
                }
            });
        });

        this.initOSAssistant(profile);
    }

    initOSAssistant(profile) {
        const trigger = document.getElementById('assistant-trigger');
        const terminal = document.getElementById('assistant-terminal');
        const closeBtn = document.getElementById('close-terminal');
        const input = document.getElementById('terminal-input');
        const output = document.getElementById('terminal-output');
        const sessionStart = Date.now();
        let hasBooted = false;

        const log = (text, type = '', delay = 0) => {
            const entry = document.createElement('div');
            entry.className = `terminal-log-entry ${type}`;
            entry.innerHTML = text;
            if(delay) {
                setTimeout(() => {
                    output.appendChild(entry);
                    output.scrollTop = output.scrollHeight;
                }, delay);
            } else {
                output.appendChild(entry);
                output.scrollTop = output.scrollHeight;
            }
        };

        const bootSequence = () => {
            if(hasBooted) return;
            hasBooted = true;
            output.innerHTML = '';
            log(profile.ui_assistant_boot || "PRIME_AGENT BOOT SEQUENCE INITIATED...", "text-prime", 0);
            log("[SCANNING MEMORY CORE] ............ OK", "text-secondary-terminal", 300);
            log("[VERIFYING DATABASE SYNC] ......... OK", "text-secondary-terminal", 600);
            log("[ESTABLISHING NEURAL LINK] ........ OK", "text-secondary-terminal", 900);
            log(profile.ui_assistant_ready || "SYSTEM_READY. WELCOME, OPERATOR.", "text-prime fw-bold", 1200);
            log("TYPE <span class='text-command'>'HELP'</span> FOR PROTOCOLS.", "", 1400);
        };

        const processCommand = (cmd) => {
            cmd = cmd.toLowerCase().trim();
            log(`<span class="text-secondary-terminal">> ${cmd}</span>`);

            if (cmd === 'help') {
                log(`ACTIVE PROTOCOLS:<br>
                    <span class="text-command">WHOAMI</span> - IDENTITY PROFILE<br>
                    <span class="text-command">SURPRISE</span> - RANDOM INNOVATION<br>
                    <span class="text-command">PROJECTS</span> - INNOVATION LIST<br>
                    <span class="text-command">STATUS</span> - SYSTEM METRICS<br>
                    <span class="text-command">CV</span> - DOWNLOAD PAYLOAD<br>
                    <span class="text-command">CLEAR</span> - RESET BUFFER`);
            } else if (cmd === 'status') {
                const uptime = Math.floor((Date.now() - sessionStart) / 1000);
                log(`SYSTEM_STATUS: <span class="text-prime">OPTIMAL</span><br>
                    UPTIME: ${uptime}s<br>
                    DATABASE: IndexedDB_STABLE<br>
                    AGENTS: 1_ACTIVE (${profile.ui_assistant_name || 'PRIME_AGENT'})`);
            } else if (cmd === 'surprise') {
                log(`SELECTING RANDOM SECTOR...`);
                const projects = document.querySelectorAll('.project-card');
                if(projects.length > 0) {
                    const random = projects[Math.floor(Math.random() * projects.length)];
                    random.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    random.style.borderColor = 'var(--accent-primary)';
                    setTimeout(() => random.style.borderColor = '', 2000);
                }
            } else if (cmd === 'whoami') {
                log(`IDENTITY: ${profile.name}<br>ROLE: ${profile.role}<br>OBJECTIVE: ${profile.tagline}`);
            } else if (cmd === 'projects') {
                log(`LOCATING INNOVATIONS... ACCESSING SUB-SECTOR.`);
                document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' });
            } else if (cmd === 'cv') {
                if (profile.cv) {
                    log(`ACCESSING ENCRYPTED STORAGE... CV PAYLOAD DISPATCHED.`);
                    const a = document.createElement('a');
                    a.href = profile.cv;
                    a.download = `${profile.name}_CV.pdf`;
                    a.click();
                } else {
                    log(`ERROR: CV_PAYLOAD_NOT_FOUND.`, 'text-error');
                }
            } else if (cmd === 'clear') {
                output.innerHTML = '';
                log(`BUFFER RESET.`, 'text-secondary-terminal');
            } else if (cmd === 'sudo') {
                log(`SYSTEM OVERRIDE DETECTED... AUTHORIZATION REQUIRED.`, 'text-error text-prime fw-bold');
                this.initiateAdminLogin();
            } else {
                log(`COMMAND NOT RECOGNIZED: '${cmd}'. TYPE 'HELP' FOR OPTIONS.`, 'text-error');
            }
        };

        trigger.addEventListener('click', () => {
            terminal.classList.toggle('d-none');
            if(!terminal.classList.contains('d-none')) {
                input.focus();
                if(!hasBooted) bootSequence();
            }
        });

        closeBtn.addEventListener('click', () => terminal.classList.add('d-none'));

        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && input.value) {
                processCommand(input.value);
                input.value = '';
            }
        });
    }

    initiateAdminLogin() {
        // Shared login routine
        const overlayHTML = `
            <div style="position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.9);backdrop-filter:blur(10px);z-index:9999;display:flex;align-items:center;justify-content:center;font-family:monospace;">
                <div style="background:rgba(10,10,15,1); border:1px solid var(--accent-primary); padding:3rem; border-radius:10px; width:400px; max-width:90%; box-shadow:0 0 30px rgba(0,240,255,0.2);">
                    <h4 style="color:var(--accent-primary); margin-bottom:2rem;"><i class="fas fa-terminal me-2"></i> SYS_ADMIN AUTH</h4>
                    <input type="password" id="sys-pwd" style="width:100%;background:rgba(0,0,0,0.5);border:1px solid rgba(255,255,255,0.2);color:#fff;padding:1rem;font-size:1.2rem;margin-bottom:1.5rem;outline:none;letter-spacing:5px;" placeholder="***">
                    <div class="d-flex justify-content-end gap-3">
                        <button id="sys-cancel" style="background:transparent;border:1px solid rgba(255,255,255,0.2);color:#fff;padding:0.5rem 1.5rem;cursor:pointer;border-radius:5px;" onmouseover="this.style.background='rgba(255,255,255,0.1)'" onmouseout="this.style.background='transparent'">ABORT</button>
                        <button id="sys-auth" style="background:var(--accent-primary);border:1px solid var(--accent-primary);color:#000;padding:0.5rem 1.5rem;font-weight:bold;cursor:pointer;border-radius:5px;">AUTHORIZE</button>
                    </div>
                </div>
            </div>
        `;
        let existing = document.getElementById('admin-login-overlay');
        if(existing) existing.remove();
        
        const overlay = document.createElement('div');
        overlay.id = 'admin-login-overlay';
        overlay.innerHTML = overlayHTML;
        document.body.appendChild(overlay);

        const pwdInput = document.getElementById('sys-pwd');
        pwdInput.focus();

const checkAuth = async () => {
            const val = pwdInput.value.trim();
            const profile = this.currentProfile || {};
            const storedHash = profile.adminPasswordHash;
            const storedSalt = profile.adminPasswordSalt;
            let isValid = false;

            // Brute force protection
            this.loginAttempts = (this.loginAttempts || 0) + 1;
            if (this.loginAttempts >= 5) {
                overlay.innerHTML = '<div style="position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(255,0,0,0.9);z-index:9999;display:flex;align-items:center;justify-content:center;color:#fff;font-size:1.5rem;font-family:monospace;text-align:center;padding:2rem;">[CRITICAL_SECURITY_LOCKOUT]<br>TOO MANY FAILED ATTEMPTS. RELOAD SYSTEM.</div>';
                return;
            }

            if (storedHash && storedSalt) {
                const hashedAttempt = await this.hashPassword(val, storedSalt);
                isValid = hashedAttempt === storedHash;
            } else {
                const validPass = (profile && profile.adminPassword) || 'admin';
                isValid = val === validPass;
            }

            if (isValid) {
                let tokenSaved = false;
                try { sessionStorage.setItem('sys_auth_token', Date.now()); tokenSaved = true; } catch (e) { }
                if (!tokenSaved) {
                    try { localStorage.setItem('sys_auth_token', Date.now()); tokenSaved = true; } catch (e) { }
                }
                if (!tokenSaved) {
                    overlay.innerHTML = '<div style="position:fixed;top:0;left:0;width:100%;height:100%;background:#000;z-index:9999;display:flex;align-items:center;justify-content:center;color:#f77;font-size:1rem;font-family:monospace;text-align:center;padding:2rem;">Unable to save auth token because browser storage is blocked. Please allow site storage or try a different browser.</div>';
                    return;
                }
                overlay.innerHTML = '<div style="position:fixed;top:0;left:0;width:100%;height:100%;background:#000;z-index:9999;display:flex;align-items:center;justify-content:center;color:#0f0;font-size:1.5rem;font-family:monospace;"><i class="fas fa-unlock me-3"></i> PERMISSION GRANTED... REDIRECTING</div>';
                setTimeout(() => window.location.href = 'admin.html', 1200);
            } else {
                pwdInput.style.borderColor = 'red';
                pwdInput.value = '';
                setTimeout(() => pwdInput.style.borderColor = 'rgba(255,255,255,0.2)', 500);
            }
        };

        document.getElementById('sys-auth').addEventListener('click', checkAuth);
        document.getElementById('sys-cancel').addEventListener('click', () => overlay.remove());
        pwdInput.addEventListener('keypress', (e) => { if(e.key === 'Enter') checkAuth(); });
    }

    initiateAdminReset() {
        if (document.getElementById('admin-reset-overlay')) return;

        const overlay = document.createElement('div');
        overlay.id = 'admin-reset-overlay';
        overlay.style = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.9);backdrop-filter:blur(10px);z-index:99999;display:flex;align-items:center;justify-content:center;font-family:monospace;';
        overlay.innerHTML = `
            <div style="background:rgba(10,10,15,1); border:1px solid var(--accent-primary); padding:2rem; border-radius:10px; width:420px; max-width:92%; box-shadow:0 0 30px rgba(0,240,255,0.2); color:#fff;">
                <h4 style="color:var(--accent-primary); margin-bottom:1rem;"><i class="fas fa-key me-2"></i> Emergency Admin Reset</h4>
                <input id="reset-new" type="password" placeholder="New passphrase" style="width:100%;padding:.75rem;margin-bottom:.5rem;border-radius:6px;background:rgba(0,0,0,0.5);border:1px solid rgba(255,255,255,0.06);color:#fff;">
                <input id="reset-confirm" type="password" placeholder="Confirm passphrase" style="width:100%;padding:.75rem;margin-bottom:.75rem;border-radius:6px;background:rgba(0,0,0,0.5);border:1px solid rgba(255,255,255,0.06);color:#fff;">
                <div style="display:flex;gap:.5rem;justify-content:flex-end;">
                    <button id="reset-cancel" style="background:transparent;border:1px solid rgba(255,255,255,0.12);color:#fff;padding:.5rem 1rem;border-radius:6px;">Cancel</button>
                    <button id="reset-apply" style="background:linear-gradient(90deg,#00f0ff,#b900ff);color:#000;border:none;padding:.5rem 1rem;border-radius:6px;font-weight:700;">Apply</button>
                </div>
                <div id="reset-status" style="margin-top:.75rem;color:rgba(255,255,255,0.7);font-size:.9rem;"></div>
            </div>
        `;
        document.body.appendChild(overlay);

        const statusEl = overlay.querySelector('#reset-status');
        overlay.querySelector('#reset-cancel').addEventListener('click', () => overlay.remove());

        overlay.querySelector('#reset-apply').addEventListener('click', async () => {
            const newPwd = overlay.querySelector('#reset-new').value.trim();
            const confirmPwd = overlay.querySelector('#reset-confirm').value.trim();
            if (!newPwd) { statusEl.textContent = 'Enter a non-empty passphrase.'; return; }
            if (newPwd !== confirmPwd) { statusEl.textContent = 'Passphrases do not match.'; return; }
            statusEl.textContent = 'Updating local credential store...';

            try {
                const salt = await this.generateSalt();
                const hash = await this.hashPassword(newPwd, salt);
                const req = indexedDB.open('OS_PRIME_DataStore');
                req.onsuccess = function() {
                    const db = req.result;
                    const tx = db.transaction('profile', 'readwrite');
                    const store = tx.objectStore('profile');
                    const getReq = store.get('main');
                    getReq.onsuccess = function() {
                        const profile = getReq.result || { id: 'main' };
                        profile.adminPasswordSalt = salt;
                        profile.adminPasswordHash = hash;
                        delete profile.adminPassword;
                        const putReq = store.put(profile);
                        putReq.onsuccess = function() {
                            let tokenSaved = false;
                try { sessionStorage.setItem('sys_auth_token', Date.now()); tokenSaved = true; } catch (e) { }
                if (!tokenSaved) {
                    try { localStorage.setItem('sys_auth_token', Date.now()); tokenSaved = true; } catch (e) { }
                }
                if (!tokenSaved) {
                    statusEl.textContent = 'Unable to save auth token; browser storage is blocked. Please allow site storage or try another browser.';
                    return;
                }
                            statusEl.textContent = 'Passphrase updated. Redirecting...';
                            setTimeout(() => window.location.href = 'admin.html', 900);
                        };
                        putReq.onerror = function(e) { statusEl.textContent = 'Write failed: ' + (e.target && e.target.error && e.target.error.message || e.message); };
                    };
                    getReq.onerror = function(e) { statusEl.textContent = 'Read failed: ' + (e.target && e.target.error && e.target.error.message || e.message); };
                };
                req.onerror = function(e) { statusEl.textContent = 'IndexedDB open error: ' + (e.target && e.target.error && e.target.error.message || e.message); };
            } catch (err) {
                statusEl.textContent = 'Security error: ' + (err && err.message || err);
            }
        });
    }

    attachAdminTriggers() {
        if (window.adminTriggersAttached) return;

        const initiateAdminLogin = () => {
            this.initiateAdminLogin();
        };

        // Hidden Sysadmin Gateway - Method 1: 5 rapid clicks on bottom right
        document.body.addEventListener('click', (e) => {
            // Check if clicking in the bottom-right gateway zone
            // We use a broader check on the body or use a specific selector if it's always rendered
            const gateway = document.getElementById('sys-gateway');
            if (gateway && gateway.contains(e.target)) {
                this.clickCount = (this.clickCount || 0) + 1;
                clearTimeout(this.clickTimer);
                this.clickTimer = setTimeout(() => { this.clickCount = 0; }, 1500);
                
                if (this.clickCount >= 5) {
                    this.clickCount = 0;
                    initiateAdminLogin();
                }
            }
        });

        // Hidden Sysadmin Gateway - Method 3: 5 rapid clicks on the copyright © text
        document.body.addEventListener('click', (e) => {
            const c = document.getElementById('copyright-gateway');
            if (c && c.contains(e.target)) {
                this.copyrightClicks = (this.copyrightClicks || 0) + 1;
                clearTimeout(this.copyrightTimer);
                this.copyrightTimer = setTimeout(() => { this.copyrightClicks = 0; }, 1500);
                if (this.copyrightClicks >= 5) {
                    this.copyrightClicks = 0;
                    try { this.initiateAdminReset(); } catch (err) { console.error('Failed to open reset overlay', err); }
                }
            }
        });

        // Hidden Sysadmin Gateway - Method 2: Typing 'sudo' anywhere
        let typed = '';
        window.addEventListener('keydown', (e) => {
            if(e.key.length === 1) { // Normal keys only
                typed += e.key.toLowerCase();
                if (typed.length > 4) typed = typed.slice(-4);
                if (typed === 'sudo') {
                    initiateAdminLogin();
                    typed = '';
                }
            }
        });
        
        window.adminTriggersAttached = true;
    }
}
