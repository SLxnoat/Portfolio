export default function renderHero(profile) {
    return `
        <section id="home" class="section" style="display: flex; flex-direction: column; align-items: center; text-align: center; min-height: 80vh; justify-content: center;">
            <div class="avatar reveal" style="transition-delay: 0.1s;">
                <div class="avatar-inner">
                    <i class="fas fa-user-astronaut"></i>
                </div>
            </div>
            
            <h1 class="reveal" style="transition-delay: 0.2s;">
                Hi, I'm <span class="gradient-text">${profile.name}</span>
            </h1>
            
            <h2 class="reveal" style="transition-delay: 0.3s; justify-content: center; font-weight: 500;">
                <i class="fas fa-sparkles" style="color: var(--accent-2); font-size: 1.5rem;"></i>
                ${profile.title}
            </h2>
            
            <p class="reveal" style="transition-delay: 0.4s; max-width: 700px; margin: 1.5rem auto 3rem auto; font-size: var(--step-1);">
                ${profile.summary}
            </p>
            
            <div class="reveal" style="transition-delay: 0.5s; display: flex; gap: 1rem; flex-wrap: wrap; justify-content: center;">
                <a href="#contact" class="btn btn-primary"><i class="fas fa-paper-plane"></i> Get in Touch</a>
                <a href="https://${profile.github}" target="_blank" class="btn btn-outline"><i class="fab fa-github"></i> GitHub</a>
            </div>
        </section>
    `;
}
