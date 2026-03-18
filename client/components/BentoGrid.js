export function renderSkillsGrid(skills) {
    return `
        <section id="skills" class="section">
            <h2 class="reveal"><i class="fas fa-layer-group" style="color: var(--accent-1);"></i> Technical Arsenal</h2>
            <div class="bento-grid" style="margin-top: 3rem;">
                ${skills.map((skill, index) => `
                    <div class="glass reveal" style="transition-delay: ${0.1 * (index % 4)}s;">
                        <h3 style="color: var(--accent-1); margin-bottom: 1.5rem;">${skill.category}</h3>
                        <div>
                            ${skill.items.split(', ').map(item => `<span class="badge">${item}</span>`).join('')}
                        </div>
                    </div>
                `).join('')}
            </div>
        </section>
    `;
}

export function renderProjectsGrid(projects) {
    return `
        <section id="projects" class="section">
            <h2 class="reveal"><i class="fas fa-rocket" style="color: var(--accent-2);"></i> Featured Projects</h2>
            <div class="bento-grid" style="margin-top: 3rem;">
                ${projects.map((project, index) => `
                    <div class="glass reveal" style="transition-delay: ${0.1 * (index % 4)}s; display: flex; flex-direction: column;">
                        <h3 style="margin-bottom: 0.5rem; background: linear-gradient(135deg, #fff, var(--text-secondary)); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">${project.title}</h3>
                        <p style="font-size: 0.85rem; padding: 0.5rem 0; border-bottom: 1px solid var(--glass-border); margin-bottom: 1rem; color: var(--accent-1); font-weight: 500;">
                            ${project.stack}
                        </p>
                        <p style="flex-grow: 1;">${project.description}</p>
                        <div style="margin-top: 1.5rem;">
                            <a href="https://${project.github}" target="_blank" class="btn btn-outline" style="width: 100%;">
                                <i class="fab fa-github"></i> Dive into Code
                            </a>
                        </div>
                    </div>
                `).join('')}
            </div>
        </section>
    `;
}
