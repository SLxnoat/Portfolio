export default class AdminView {
    constructor() {
        this.appDiv = null;
    }

    render(appDiv, data, onSaveProfile) {
        this.appDiv = appDiv;
        const { profile } = data;

        this.appDiv.innerHTML = `
            <nav class="animate-fade-in">
                <a href="#/admin" class="nav-brand">Admin Dashboard</a>
                <div class="nav-links">
                    <a href="#/">View Portfolio <i class="fas fa-external-link-alt"></i></a>
                    <a href="#/admin" class="active">Settings</a>
                </div>
            </nav>

            <div class="glass-panel animate-fade-in" style="margin-top: 2rem;">
                <h2><i class="fas fa-user-edit"></i> Edit Profile Information</h2>
                <form id="profileForm" style="margin-top: 2rem;">
                    <div class="grid grid-2">
                        <div class="form-group">
                            <label>Full Name</label>
                            <input type="text" id="name" class="form-control" value="${profile.name}" required>
                        </div>
                        <div class="form-group">
                            <label>Professional Title</label>
                            <input type="text" id="title" class="form-control" value="${profile.title}" required>
                        </div>
                        <div class="form-group">
                            <label>Email Address</label>
                            <input type="email" id="email" class="form-control" value="${profile.email}" required>
                        </div>
                        <div class="form-group">
                            <label>Phone Number</label>
                            <input type="text" id="phone" class="form-control" value="${profile.phone}">
                        </div>
                        <div class="form-group">
                            <label>GitHub Profile</label>
                            <input type="text" id="github" class="form-control" value="${profile.github}">
                        </div>
                        <div class="form-group">
                            <label>LinkedIn Profile</label>
                            <input type="text" id="linkedin" class="form-control" value="${profile.linkedin}">
                        </div>
                    </div>
                    <div class="form-group">
                        <label>Address</label>
                        <input type="text" id="address" class="form-control" value="${profile.address}">
                    </div>
                    <div class="form-group">
                        <label>Professional Summary</label>
                        <textarea id="summary" class="form-control" required>${profile.summary}</textarea>
                    </div>
                    <button type="submit" class="btn btn-primary"><i class="fas fa-save"></i> Save Profile</button>
                    <span id="saveMessage" style="margin-left: 1rem; color: #10b981; display: none;">Saved successfully!</span>
                </form>
            </div>
        `;

        // Bind form submit
        const form = document.getElementById('profileForm');
        form.addEventListener('submit', (e) => {
            e.preventDefault();
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
            
            const msg = document.getElementById('saveMessage');
            msg.style.display = 'inline';
            setTimeout(() => msg.style.display = 'none', 3000);
        });
    }
}
