export default class AdminView {
    constructor() {
        this.appDiv = null;
    }

    render(appDiv, data, onSaveProfile) {
        this.appDiv = appDiv;
        const { profile } = data;

        this.appDiv.innerHTML = `
            <nav class="navbar reveal">
                <a href="#/admin" class="nav-brand">Admin Console</a>
                <div class="nav-links">
                    <a href="#/">View Website <i class="fas fa-external-link-alt" style="margin-left: 0.5rem; font-size: 0.8rem;"></i></a>
                    <a href="#/admin" style="color: var(--accent-3);">Settings</a>
                </div>
            </nav>

            <div class="glass reveal" style="max-width: 900px; margin: 4rem auto;">
                <h2 style="margin-bottom: 2rem;"><i class="fas fa-sliders-h" style="color: var(--accent-2);"></i> Global Settings</h2>
                <form id="profileForm">
                    <div class="bento-grid">
                        <div class="form-group">
                            <label class="form-label">Full Name</label>
                            <input type="text" id="name" class="form-control" value="${profile.name}" required>
                        </div>
                        <div class="form-group">
                            <label class="form-label">Professional Title</label>
                            <input type="text" id="title" class="form-control" value="${profile.title}" required>
                        </div>
                        <div class="form-group">
                            <label class="form-label">Email Address</label>
                            <input type="email" id="email" class="form-control" value="${profile.email}" required>
                        </div>
                        <div class="form-group">
                            <label class="form-label">Phone Number</label>
                            <input type="text" id="phone" class="form-control" value="${profile.phone}">
                        </div>
                        <div class="form-group">
                            <label class="form-label">GitHub Profile</label>
                            <input type="text" id="github" class="form-control" value="${profile.github}">
                        </div>
                        <div class="form-group">
                            <label class="form-label">LinkedIn Profile</label>
                            <input type="text" id="linkedin" class="form-control" value="${profile.linkedin}">
                        </div>
                    </div>
                    
                    <div class="form-group" style="margin-top: 1.5rem;">
                        <label class="form-label">Address</label>
                        <input type="text" id="address" class="form-control" value="${profile.address}">
                    </div>
                    <div class="form-group" style="margin-top: 1.5rem;">
                        <label class="form-label">Professional Summary</label>
                        <textarea id="summary" class="form-control" required>${profile.summary}</textarea>
                    </div>
                    
                    <button type="submit" class="btn btn-primary" style="margin-top: 2rem; width: 100%; font-size: 1.1rem; padding: 1.25rem;">
                        <i class="fas fa-save margin-right: 0.5rem"></i> Commit Changes
                    </button>
                </form>
            </div>
            
            <!-- Toast Container -->
            <div id="toast-container" style="position: fixed; bottom: 2rem; right: 2rem; z-index: 9999; display: flex; flex-direction: column; gap: 1rem;"></div>
        `;

        const form = document.getElementById('profileForm');
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            this._showToast('Committing changes to store...');
            
            const updatedProfile = {
                name: document.getElementById('name').value,
                title: document.getElementById('title').value,
                email: document.getElementById('email').value,
                phone: document.getElementById('phone').value,
                github: document.getElementById('github').value,
                linkedin: document.getElementById('linkedin').value,
                address: document.getElementById('address').value,
                summary: document.getElementById('summary').value
            };
            
            onSaveProfile(updatedProfile);
            
            setTimeout(() => {
                this._showToast('Changes deployed successfully!', 'success');
            }, 600);
        });
        
        // Add dynamic CSS needed for toasts
        if(!document.getElementById('toast-styles')) {
            const style = document.createElement('style');
            style.id = 'toast-styles';
            style.innerHTML = `
                .toast {
                    min-width: 300px;
                    padding: 1rem 1.5rem;
                    background: rgba(10,10,10,0.9);
                    backdrop-filter: blur(10px);
                    border: 1px solid var(--glass-border);
                    border-left: 4px solid var(--accent-1);
                    color: white;
                    border-radius: 8px;
                    box-shadow: 0 10px 40px rgba(0,0,0,0.5);
                    transform: translateX(120%);
                    opacity: 0;
                    transition: all 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                }
                .toast.show {
                    transform: translateX(0);
                    opacity: 1;
                }
                .toast.success { border-left-color: #10b981; }
            `;
            document.head.appendChild(style);
        }
    }

    _showToast(message, type = 'info') {
        const container = document.getElementById('toast-container');
        const toast = document.createElement('div');
        toast.className = \`toast \${type}\`;
        
        const icon = type === 'success' ? 'fa-check-circle' : 'fa-info-circle';
        
        toast.innerHTML = \`<i class="fas \${icon}" style="color: \${type === 'success' ? '#10b981' : 'var(--accent-1)'}"></i> \${message}\`;
        container.appendChild(toast);
        
        // Trigger animation
        requestAnimationFrame(() => toast.classList.add('show'));
        
        // Remove after 3s
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 400); // Wait for exit transition
        }, 3000);
    }
}
