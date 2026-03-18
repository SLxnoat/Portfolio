export default class AdminView {
    constructor() {
        this.appDiv = null;
        this.callbacks = null;
        this.currentTab = 'profile'; // Default tab
    }

    render(appDiv, data, callbacks) {
        this.appDiv = appDiv;
        this.callbacks = callbacks;
        
        const { profile, projects, skills, experience, education, gallery } = data;

        this.appDiv.innerHTML = `
            <nav class="navbar reveal">
                <a href="#/admin" class="nav-brand">Admin Console</a>
                <div class="nav-links">
                    <a href="#/">View Website <i class="fas fa-external-link-alt" style="margin-left: 0.5rem; font-size: 0.8rem;"></i></a>
                    <a href="#/admin" style="color: var(--accent-3);">Settings</a>
                </div>
            </nav>

            <div class="glass reveal" style="max-width: 1000px; margin: 2rem auto; padding: 3rem;">
                <h2 style="margin-bottom: 2rem;"><i class="fas fa-sliders-h" style="color: var(--accent-2);"></i> Data Dashboard</h2>
                
                <!-- Tab Headers -->
                <div class="admin-tabs">
                    <button class="admin-tab-btn \${this.currentTab === 'profile' ? 'active' : ''}" data-tab="profile">Profile</button>
                    <button class="admin-tab-btn \${this.currentTab === 'projects' ? 'active' : ''}" data-tab="projects">Projects</button>
                    <button class="admin-tab-btn \${this.currentTab === 'skills' ? 'active' : ''}" data-tab="skills">Skills</button>
                    <button class="admin-tab-btn \${this.currentTab === 'experience' ? 'active' : ''}" data-tab="experience">Experience</button>
                    <button class="admin-tab-btn \${this.currentTab === 'education' ? 'active' : ''}" data-tab="education">Education</button>
                    <button class="admin-tab-btn \${this.currentTab === 'gallery' ? 'active' : ''}" data-tab="gallery">Gallery</button>
                </div>

                <!-- Tab Contents -->
                <div id="tab-profile" class="admin-tab-content \${this.currentTab === 'profile' ? 'active' : ''}">
                    <!-- Profile Form (Existing) -->
                    <form id="profileForm">
                        <div class="bento-grid">
                            <div class="form-group"><label class="form-label">Full Name</label><input type="text" id="p_name" class="form-control" value="${profile.name}" required></div>
                            <div class="form-group"><label class="form-label">Professional Title</label><input type="text" id="p_title" class="form-control" value="${profile.title}" required></div>
                            <div class="form-group"><label class="form-label">Email</label><input type="email" id="p_email" class="form-control" value="${profile.email}" required></div>
                            <div class="form-group"><label class="form-label">Phone</label><input type="text" id="p_phone" class="form-control" value="${profile.phone}"></div>
                            <div class="form-group"><label class="form-label">GitHub</label><input type="text" id="p_github" class="form-control" value="${profile.github}"></div>
                            <div class="form-group"><label class="form-label">LinkedIn</label><input type="text" id="p_linkedin" class="form-control" value="${profile.linkedin}"></div>
                        </div>
                        <div class="form-group" style="margin-top: 1.5rem;"><label class="form-label">Address</label><input type="text" id="p_address" class="form-control" value="${profile.address}"></div>
                        <div class="form-group" style="margin-top: 1.5rem;"><label class="form-label">Professional Summary</label><textarea id="p_summary" class="form-control" required>${profile.summary}</textarea></div>
                        <button type="submit" class="btn btn-primary" style="margin-top: 2rem; width: 100%;"><i class="fas fa-save margin-right: 0.5rem"></i> Commit Profile</button>
                    </form>
                </div>

                <div id="tab-projects" class="admin-tab-content \${this.currentTab === 'projects' ? 'active' : ''}">
                    <h3>Manage Projects</h3>
                    <div id="list-projects">${this._renderList(projects, 'projects', (p) => \`<strong>\${p.title}</strong><br><span style="font-size:0.85rem;color:var(--text-secondary);">\${p.stack}</span>\`)}</div>
                    <form id="form-projects" style="margin-top: 2rem; padding-top: 2rem; border-top: 1px solid var(--glass-border);">
                        <h4>Add New Project</h4>
                        <div class="form-group"><input type="text" id="proj_title" class="form-control" placeholder="Project Title" required></div>
                        <div class="form-group"><input type="text" id="proj_stack" class="form-control" placeholder="Tech Stack (e.g. React, Node)" required></div>
                        <div class="form-group"><input type="text" id="proj_github" class="form-control" placeholder="GitHub Link (e.g. github.com/user/repo)"></div>
                        <div class="form-group"><textarea id="proj_desc" class="form-control" placeholder="Description" required style="min-height:80px;"></textarea></div>
                        <button type="submit" class="btn btn-outline"><i class="fas fa-plus"></i> Add Project</button>
                    </form>
                </div>

                <div id="tab-skills" class="admin-tab-content \${this.currentTab === 'skills' ? 'active' : ''}">
                    <h3>Manage Skills</h3>
                    <div id="list-skills">${this._renderList(skills, 'skills', (s) => \`<strong>\${s.category}</strong><br><span style="font-size:0.85rem;color:var(--text-secondary);">\${s.items}</span>\`)}</div>
                    <form id="form-skills" style="margin-top: 2rem; padding-top: 2rem; border-top: 1px solid var(--glass-border);">
                        <h4>Add Skill Category</h4>
                        <div class="form-group"><input type="text" id="skill_cat" class="form-control" placeholder="Category (e.g. Frontend)" required></div>
                        <div class="form-group"><input type="text" id="skill_items" class="form-control" placeholder="Skills (comma separated)" required></div>
                        <button type="submit" class="btn btn-outline"><i class="fas fa-plus"></i> Add Skills</button>
                    </form>
                </div>

                <div id="tab-experience" class="admin-tab-content \${this.currentTab === 'experience' ? 'active' : ''}">
                    <h3>Manage Experience</h3>
                    <div id="list-experience">${this._renderList(experience, 'experience', (e) => \`<strong>\${e.role}</strong> at \${e.company}<br><span style="font-size:0.85rem;color:var(--text-secondary);">\${e.period}</span>\`)}</div>
                    <form id="form-experience" style="margin-top: 2rem; padding-top: 2rem; border-top: 1px solid var(--glass-border);">
                        <h4>Add Experience</h4>
                        <div class="form-group"><input type="text" id="exp_role" class="form-control" placeholder="Role" required></div>
                        <div class="form-group"><input type="text" id="exp_company" class="form-control" placeholder="Company" required></div>
                        <div class="form-group"><input type="text" id="exp_period" class="form-control" placeholder="Period (e.g. 2021 - Present)" required></div>
                        <div class="form-group"><textarea id="exp_desc" class="form-control" placeholder="Description" required style="min-height:80px;"></textarea></div>
                        <button type="submit" class="btn btn-outline"><i class="fas fa-plus"></i> Add Experience</button>
                    </form>
                </div>

                <div id="tab-education" class="admin-tab-content \${this.currentTab === 'education' ? 'active' : ''}">
                    <h3>Manage Education</h3>
                    <div id="list-education">${this._renderList(education, 'education', (e) => \`<strong>\${e.degree}</strong><br><span style="font-size:0.85rem;color:var(--text-secondary);">\${e.institution}</span>\`)}</div>
                    <form id="form-education" style="margin-top: 2rem; padding-top: 2rem; border-top: 1px solid var(--glass-border);">
                        <h4>Add Education</h4>
                        <div class="form-group"><input type="text" id="edu_deg" class="form-control" placeholder="Degree" required></div>
                        <div class="form-group"><input type="text" id="edu_inst" class="form-control" placeholder="Institution" required></div>
                        <div class="form-group"><input type="text" id="edu_per" class="form-control" placeholder="Period" required></div>
                        <div class="form-group"><input type="text" id="edu_foc" class="form-control" placeholder="Focus/Major" required></div>
                        <button type="submit" class="btn btn-outline"><i class="fas fa-plus"></i> Add Education</button>
                    </form>
                </div>

                <div id="tab-gallery" class="admin-tab-content \${this.currentTab === 'gallery' ? 'active' : ''}">
                    <h3>Manage Gallery</h3>
                    <div id="list-gallery">${this._renderList(gallery || [], 'gallery', (g) => \`<strong>\${g.title}</strong> (\${g.category})<br><img src="\${g.image}" style="height:40px; border-radius:4px; margin-top:0.5rem;">\`)}</div>
                    <form id="form-gallery" style="margin-top: 2rem; padding-top: 2rem; border-top: 1px solid var(--glass-border);">
                        <h4>Add Gallery Item</h4>
                        <div class="form-group"><input type="text" id="gal_title" class="form-control" placeholder="Title" required></div>
                        <div class="form-group"><input type="text" id="gal_cat" class="form-control" placeholder="Category" required></div>
                        <div class="form-group"><input type="url" id="gal_img" class="form-control" placeholder="Image URL (e.g. https://...)" required></div>
                        <button type="submit" class="btn btn-outline"><i class="fas fa-plus"></i> Add Image</button>
                    </form>
                </div>
            </div>
            
            <div id="toast-container" style="position: fixed; bottom: 2rem; right: 2rem; z-index: 9999; display: flex; flex-direction: column; gap: 1rem;"></div>
        `;

        this._bindEvents();
    }

    _renderList(items, sectionName, renderItemHtml) {
        if (!items || items.length === 0) return '<p style="color:var(--text-secondary);">No items yet.</p>';
        return items.map((item, index) => \`
            <div class="admin-list-item">
                <div class="admin-list-item-content">\${renderItemHtml(item)}</div>
                <button class="btn btn-danger btn-sm" data-delete="\${sectionName}" data-index="\${index}">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        \`).join('');
    }

    _bindEvents() {
        // Tab Switching
        document.querySelectorAll('.admin-tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const targetTab = e.target.getAttribute('data-tab');
                this.currentTab = targetTab;
                
                document.querySelectorAll('.admin-tab-btn').forEach(b => b.classList.remove('active'));
                document.querySelectorAll('.admin-tab-content').forEach(c => c.classList.remove('active'));
                
                e.target.classList.add('active');
                document.getElementById('tab-' + targetTab).classList.add('active');
            });
        });

        // Profile Form Submit
        const profileForm = document.getElementById('profileForm');
        if(profileForm) {
            profileForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this._showToast('Saving profile...');
                this.callbacks.onSaveProfile({
                    name: document.getElementById('p_name').value,
                    title: document.getElementById('p_title').value,
                    email: document.getElementById('p_email').value,
                    phone: document.getElementById('p_phone').value,
                    github: document.getElementById('p_github').value,
                    linkedin: document.getElementById('p_linkedin').value,
                    address: document.getElementById('p_address').value,
                    summary: document.getElementById('p_summary').value
                });
                setTimeout(() => this._showToast('Profile updated!', 'success'), 500);
            });
        }

        // Delete Buttons
        document.querySelectorAll('button[data-delete]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const targetBtn = e.target.closest('button');
                const section = targetBtn.getAttribute('data-delete');
                const index = parseInt(targetBtn.getAttribute('data-index'), 10);
                this.callbacks.onDeleteItem(section, index);
                this._showToast(\`Deleted item from \${section}\`, 'success');
            });
        });

        // Add Projects Form
        document.getElementById('form-projects')?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.callbacks.onAddItem('projects', {
                title: document.getElementById('proj_title').value,
                stack: document.getElementById('proj_stack').value,
                github: document.getElementById('proj_github').value,
                description: document.getElementById('proj_desc').value
            });
            this._showToast('Project added!', 'success');
        });

        // Add Skills Form
        document.getElementById('form-skills')?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.callbacks.onAddItem('skills', {
                category: document.getElementById('skill_cat').value,
                items: document.getElementById('skill_items').value
            });
            this._showToast('Skills added!', 'success');
        });

        // Add Experience Form
        document.getElementById('form-experience')?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.callbacks.onAddItem('experience', {
                role: document.getElementById('exp_role').value,
                company: document.getElementById('exp_company').value,
                period: document.getElementById('exp_period').value,
                description: document.getElementById('exp_desc').value
            });
            this._showToast('Experience added!', 'success');
        });

        // Add Education Form
        document.getElementById('form-education')?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.callbacks.onAddItem('education', {
                degree: document.getElementById('edu_deg').value,
                institution: document.getElementById('edu_inst').value,
                period: document.getElementById('edu_per').value,
                focus: document.getElementById('edu_foc').value
            });
            this._showToast('Education added!', 'success');
        });

        // Add Gallery Form
        document.getElementById('form-gallery')?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.callbacks.onAddItem('gallery', {
                title: document.getElementById('gal_title').value,
                category: document.getElementById('gal_cat').value,
                image: document.getElementById('gal_img').value
            });
            this._showToast('Gallery item added!', 'success');
        });
    }

    _showToast(message, type = 'info') {
        const container = document.getElementById('toast-container');
        if(!container) return;
        const toast = document.createElement('div');
        toast.className = \`toast \${type}\`;
        const icon = type === 'success' ? 'fa-check-circle' : 'fa-info-circle';
        
        toast.innerHTML = \`<i class="fas \${icon}" style="color: \${type === 'success' ? '#10b981' : 'var(--accent-1)'}"></i> \${message}\`;
        container.appendChild(toast);
        
        requestAnimationFrame(() => toast.classList.add('show'));
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 400);
        }, 3000);
    }
}
