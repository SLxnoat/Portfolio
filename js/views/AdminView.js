export default class AdminView {
    constructor() {
        this.adminContainer = document.getElementById('admin-root');
        this.onSaveProfile = null;
        this.onSaveItem = null;
        this.onDeleteItem = null;
        this.onReorderItems = null; // (collection, idOrderArray)
        this.onReorderSections = null;
        this.onMarkMessageRead = null;
        this.onExportData = null; // Export callback
        this.onImportData = null; // Import callback
        this.sortables = {}; // To store Sortable instances
        this.activeTabId = 'v-pills-hub'; // Default tab
        this.openModalId = null; // Track currently open modal
    }

    generateFormFields(fields, data = {}) {
        return fields.map(f => {
            if (f.type === 'textarea') {
                return `
                <div class="col-12 mb-4 admin-input-group">
                    <label class="form-label text-secondary small text-uppercase fw-bold"><i class="fas fa-caret-right me-2 text-info"></i>${f.label}</label>
                    <textarea class="form-control bg-dark text-white rounded-3 py-3 px-4 outline-none" name="${f.name}" rows="${f.rows || 3}" required style="border: 1px solid rgba(255,255,255,0.05); box-shadow: inset 0 4px 10px rgba(0,0,0,0.5);">${data[f.name] || ''}</textarea>
                </div>`;
            } else {
                return `
                <div class="${f.colClass || 'col-md-6'} mb-4 admin-input-group">
                    <label class="form-label text-secondary small text-uppercase fw-bold"><i class="fas fa-caret-right me-2 text-info"></i>${f.label}</label>
                    <input type="${f.type || 'text'}" class="form-control bg-dark text-white rounded-3 py-3 px-4 outline-none" name="${f.name}" value="${data[f.name] || ''}" required style="border: 1px solid rgba(255,255,255,0.05); box-shadow: inset 0 4px 10px rgba(0,0,0,0.5);">
                </div>`;
            }
        }).join('');
    }

    render(data) {
        const { profile, projects, skills, experience, education } = data;
        
        const schemas = {
            projects: [
                { name: 'title', label: 'Title', colClass: 'col-md-6' },
                { name: 'tech', label: 'Tech Stack (Comma Separated)', colClass: 'col-md-6' },
                { name: 'description', label: 'Description', type: 'textarea' },
                { name: 'results', label: 'Results / Metrics', colClass: 'col-md-6', required: false },
                { name: 'features', label: 'Key Features / Tags', colClass: 'col-md-6', required: false }
            ],
            skills: [
                { name: 'category', label: 'Category', colClass: 'col-12' },
                { name: 'items', label: 'Skills (Comma separated)', type: 'textarea' }
            ],
            experience: [
                { name: 'title', label: 'Job Title', colClass: 'col-md-4' },
                { name: 'company', label: 'Company', colClass: 'col-md-4' },
                { name: 'date', label: 'Date Range', colClass: 'col-md-4' },
                { name: 'desc', label: 'Description', type: 'textarea' }
            ],
            education: [
                { name: 'degree', label: 'Degree / Certificate', colClass: 'col-md-6' },
                { name: 'inst', label: 'Institution', colClass: 'col-md-3' },
                { name: 'date', label: 'Date / Year', colClass: 'col-md-3' }
            ]
        };

        let html = `
        <div class="d-flex min-vh-100 admin-layout-container" style="background: #07070a; font-family: 'Inter', sans-serif; position: relative;">
            <!-- OS Ambient FX -->
            <div style="position: fixed; inset: 0; background: 
                radial-gradient(circle at 10% 10%, rgba(0, 240, 255, 0.05) 0%, transparent 30%),
                radial-gradient(circle at 90% 90%, rgba(185, 0, 255, 0.05) 0%, transparent 30%),
                linear-gradient(rgba(255,255,255,0.01) 1px, transparent 1px),
                linear-gradient(90deg, rgba(255,255,255,0.01) 1px, transparent 1px);
                background-size: 100% 100%, 100% 100%, 40px 40px, 40px 40px; pointer-events: none; z-index: 0;"></div>

            <!-- Sidebar -->
            <div class="admin-sidebar flex-shrink-0 p-4 d-flex flex-column shadow-lg" style="background: rgba(10,10,15,0.95); backdrop-filter: blur(40px); border-right: 1px solid rgba(255,255,255,0.05); z-index: 10;">
                <div class="d-flex align-items-center mb-5 mt-2 px-2 pb-4 border-bottom border-secondary" style="border-color: rgba(255,255,255,0.05) !important;">
                    <div class="rounded-4 d-flex justify-content-center align-items-center me-3 shadow-sm" style="width: 50px; height: 50px; background: linear-gradient(135deg, var(--accent-primary), var(--accent-secondary)); box-shadow: 0 0 20px rgba(0, 240, 255, 0.3);">
                        <i class="fas fa-microchip text-black fs-4"></i>
                    </div>
                    <div>
                        <h4 class="text-white fw-bolder m-0 font-monospace" style="letter-spacing: 2px; font-size: 1.1rem;">OS<span style="color: var(--accent-primary);">.PRIME</span></h4>
                        <small class="text-secondary font-monospace" style="font-size: 0.6rem; letter-spacing: 1px; color: rgba(255,255,255,0.4) !important;">ADMINISTRATOR v3.0</small>
                    </div>
                </div>

                <div class="nav flex-column nav-pills mt-2 gap-2" id="v-pills-tab" role="tablist" aria-orientation="vertical">
                    <p class="text-secondary font-monospace text-uppercase small px-3 mb-2 fw-bold" style="font-size: 0.65rem; letter-spacing: 2px; opacity: 0.4;">Mainframe</p>
                    <button class="nav-link admin-nav-btn ${this.activeTabId === 'v-pills-hub' ? 'active' : ''}" id="v-pills-hub-tab" data-bs-toggle="pill" data-bs-target="#v-pills-hub" type="button" role="tab"><i class="fas fa-th-large me-3 text-center" style="width:20px;"></i>System Monitor</button>
                    <button class="nav-link admin-nav-btn ${this.activeTabId === 'v-pills-profile' ? 'active' : ''}" id="v-pills-profile-tab" data-bs-toggle="pill" data-bs-target="#v-pills-profile" type="button" role="tab"><i class="fas fa-fingerprint me-3 text-center" style="width:20px;"></i>Identity Core</button>
                    
                    <p class="text-secondary font-monospace text-uppercase small px-3 mt-4 mb-2 fw-bold" style="font-size: 0.65rem; letter-spacing: 2px; opacity: 0.4;">Assets</p>
                    <button class="nav-link admin-nav-btn ${this.activeTabId === 'v-pills-projects' ? 'active' : ''}" id="v-pills-projects-tab" data-bs-toggle="pill" data-bs-target="#v-pills-projects" type="button" role="tab"><i class="fas fa-layer-group me-3 text-center" style="width:20px;"></i>Innovations</button>
                    <button class="nav-link admin-nav-btn ${this.activeTabId === 'v-pills-skills' ? 'active' : ''}" id="v-pills-skills-tab" data-bs-toggle="pill" data-bs-target="#v-pills-skills" type="button" role="tab"><i class="fas fa-atom me-3 text-center" style="width:20px;"></i>Tech Arsenal</button>
                    <button class="nav-link admin-nav-btn ${this.activeTabId === 'v-pills-experience' ? 'active' : ''}" id="v-pills-experience-tab" data-bs-toggle="pill" data-bs-target="#v-pills-experience" type="button" role="tab"><i class="fas fa-terminal me-3 text-center" style="width:20px;"></i>Timeline</button>
                    
                    <p class="text-secondary font-monospace text-uppercase small px-3 mt-4 mb-2 fw-bold" style="font-size: 0.65rem; letter-spacing: 2px; opacity: 0.4;">Comms</p>
                    ${(() => {
                        const unread = (data.messages || []).filter(m => !m.read).length;
                        return `
                        <button class="nav-link admin-nav-btn ${this.activeTabId === 'v-pills-messages' ? 'active' : ''} d-flex justify-content-between align-items-center" id="v-pills-messages-tab" data-bs-toggle="pill" data-bs-target="#v-pills-messages" type="button" role="tab">
                            <span><i class="fas fa-envelope-open-text me-3 text-center" style="width:20px;"></i>Transmissions</span>
                            ${unread > 0 ? `<span class="badge rounded-pill text-black px-2 pb-1" style="background: var(--accent-primary); box-shadow: 0 0 10px rgba(0, 240, 255, 0.5);">${unread}</span>` : ''}
                        </button>`;
                    })()}

                    <p class="text-secondary font-monospace text-uppercase small px-3 mt-4 mb-2 fw-bold" style="font-size: 0.65rem; letter-spacing: 2px; opacity: 0.4;">Config</p>
                    <button class="nav-link admin-nav-btn ${this.activeTabId === 'v-pills-layout' ? 'active' : ''}" id="v-pills-layout-tab" data-bs-toggle="pill" data-bs-target="#v-pills-layout" type="button" role="tab"><i class="fas fa-sliders-h me-3 text-center" style="width:20px;"></i>Runtime Engine</button>
                    <button class="nav-link admin-nav-btn ${this.activeTabId === 'v-pills-ambient' ? 'active' : ''}" id="v-pills-ambient-tab" data-bs-toggle="pill" data-bs-target="#v-pills-ambient" type="button" role="tab"><i class="fas fa-magic me-3 text-center" style="width:20px;"></i>Ambient UI & SEO</button>
                </div>
                
                <div class="mt-auto pt-5">
                    <a href="index.html" onclick="sessionStorage.removeItem('sys_auth_token');" class="btn btn-outline-danger w-100 rounded-4 py-3 fw-bold d-flex align-items-center justify-content-center gap-2" style="border: 1px solid rgba(255, 95, 86, 0.1) !important; background: rgba(255, 95, 86, 0.02); color: #ff5f56;"><i class="fas fa-power-off"></i> DEACTIVATE TERMINAL</a>
                </div>
            </div>

            <!-- Content Area -->
            <div class="flex-grow-1 p-4 p-xl-5 position-relative overflow-auto" style="height: 100vh; z-index: 1;">
                <style>
                    /* Premium Admin Custom CSS Refactor */
                    .admin-nav-btn { text-align: left; padding: 0.8rem 1.25rem; color: rgba(255,255,255,0.6); border: 0; background: transparent; border-radius: 12px; transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); position: relative; overflow: hidden; font-weight: 500; font-size: 0.95rem; }
                    .admin-nav-btn:hover { background: rgba(255,255,255,0.04) !important; color: #fff !important; }
                    .admin-nav-btn.active {
                        background: rgba(0, 240, 255, 0.1) !important;
                        color: var(--accent-primary) !important;
                        font-weight: 700;
                        box-shadow: inset 2px 0 0 var(--accent-primary);
                    }
                    .admin-card {
                        background: rgba(15, 15, 20, 0.5);
                        backdrop-filter: blur(30px);
                        border: 1px solid rgba(255,255,255,0.05);
                        border-radius: 24px;
                        box-shadow: 0 20px 40px rgba(0,0,0,0.3);
                        transition: all 0.3s ease;
                    }
                    .admin-card:hover { border-color: rgba(255,255,255,0.1); }
                    .admin-table { margin: 0; width: 100%; border-collapse: separate; border-spacing: 0; }
                    .admin-table th { background: rgba(255,255,255,0.02); border-bottom: 1px solid rgba(255,255,255,0.05); padding: 1.5rem 1rem; color: rgba(255,255,255,0.4); font-size: 0.75rem; text-transform: uppercase; letter-spacing: 2px; }
                    .admin-table td { padding: 1.5rem 1rem; border-bottom: 1px solid rgba(255,255,255,0.02); vertical-align: middle; color: #fff; }
                    .admin-table tr:hover td { background: rgba(255,255,255,0.02); }
                    .stat-card { background: linear-gradient(145deg, rgba(255,255,255,0.03), rgba(255,255,255,0.01)); border: 1px solid rgba(255,255,255,0.05); border-radius: 20px; transition: all 0.3s ease; }
                    .stat-card:hover { transform: translateY(-5px); border-color: var(--accent-primary); box-shadow: 0 10px 30px rgba(0, 240, 255, 0.1); }
                    
                    @keyframes pulse { 0% { opacity: 0.1; } 50% { opacity: 0.3; } 100% { opacity: 0.1; } }
                    .bg-pulse { animation: pulse 4s infinite ease-in-out; }
                </style>
                
                <div class="tab-content position-relative z-1 w-100 max-w-6xl mx-auto" id="v-pills-tabContent" style="max-width: 1200px;">
                    
                    <!-- System Hub Tab (Surprise!) -->
                    <div class="tab-pane fade ${this.activeTabId === 'v-pills-hub' ? 'show active' : ''}" id="v-pills-hub" role="tabpanel">
                        <div class="d-flex align-items-center mb-5 gap-4">
                            <i class="fas fa-tachometer-alt fa-3x gradient-text opacity-75"></i>
                            <div>
                                <h1 class="fw-bolder m-0 text-white font-monospace display-6">&lt;System_Hub /&gt;</h1>
                                <p class="text-secondary m-0">Project Architecture & Environment Status Monitor</p>
                            </div>
                        </div>

                        <div class="row g-4 mb-5">
                            <div class="col-md-3">
                                <div class="stat-card p-4 text-center">
                                    <div class="text-secondary small font-monospace text-uppercase mb-2">System Traffic</div>
                                    <div class="display-5 fw-bold text-white mb-2 font-monospace">${data.analytics.totalViews}</div>
                                    <div class="badge rounded-pill bg-info text-dark">TOTAL_VIEWS</div>
                                </div>
                            </div>
                            <div class="col-md-3">
                                <div class="stat-card p-4 text-center">
                                    <div class="text-secondary small font-monospace text-uppercase mb-2">CV Payload Sync</div>
                                    <div class="display-5 fw-bold text-white mb-2 font-monospace">${data.analytics.cvDownloads}</div>
                                    <div class="badge rounded-pill bg-primary">DOWNLOADS</div>
                                </div>
                            </div>
                            <div class="col-md-3">
                                <div class="stat-card p-4 text-center">
                                    <div class="text-secondary small font-monospace text-uppercase mb-2">Transmissions</div>
                                    <div class="display-5 fw-bold text-white mb-2 font-monospace">${(data.messages || []).length}</div>
                                    <div class="badge rounded-pill ${(data.messages || []).some(m => !m.read) ? 'bg-danger' : 'bg-success'}">
                                        ${(data.messages || []).filter(m => !m.read).length} UNREAD
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-3">
                                <div class="stat-card p-4 text-center">
                                    <div class="text-secondary small font-monospace text-uppercase mb-2">Total Engagements</div>
                                    <div class="display-5 fw-bold text-white mb-2 font-monospace">${data.analytics.interactions}</div>
                                    <div class="badge rounded-pill bg-warning text-dark">SYSTEM_IDLE</div>
                                </div>
                            </div>
                        </div>

                        <div class="row g-4">
                            <div class="col-lg-8">
                                <div class="admin-card p-5 overflow-hidden position-relative h-100" style="background: linear-gradient(165deg, rgba(15,15,20,0.8), rgba(5,5,10,0.9));">
                                    <div class="position-absolute bottom-0 end-0 p-4 opacity-10">
                                        <i class="fas fa-microchip fa-6x text-info"></i>
                                    </div>
                                    <h4 class="text-white fw-bold mb-5 d-flex align-items-center gap-3 font-monospace">
                                        <i class="fas fa-project-diagram text-info"></i> OS_PERFORMANCE_MATRIX
                                    </h4>
                                    <div class="row align-items-center g-5">
                                        <div class="col-md-8">
                                            <div class="mb-4">
                                                <div class="d-flex justify-content-between mb-2">
                                                    <span class="text-secondary font-monospace small">Portfolio Integrity</span>
                                                    <span class="text-info font-monospace small">98.4%</span>
                                                </div>
                                                <div class="progress bg-dark overflow-visible" style="height: 6px;">
                                                    <div class="progress-bar bg-info shadow" style="width: 98%; box-shadow: 0 0 15px rgba(0, 240, 255, 0.4) !important;"></div>
                                                </div>
                                            </div>
                                            <div class="mb-5">
                                                <div class="d-flex justify-content-between mb-2">
                                                    <span class="text-secondary font-monospace small">DB Synchronization (IndexedDB)</span>
                                                    <span class="text-success font-monospace small">STABLE</span>
                                                </div>
                                                <div class="progress bg-dark overflow-visible" style="height: 6px;">
                                                    <div class="progress-bar bg-success shadow" style="width: 100%; box-shadow: 0 0 15px rgba(40, 167, 69, 0.4) !important;"></div>
                                                </div>
                                            </div>
                                            <div class="mb-0">
                                                <div class="d-flex justify-content-between mb-2">
                                                    <span class="text-secondary font-monospace small">UI Responsive Vectors</span>
                                                    <span class="text-warning font-monospace small">OPTIMAL</span>
                                                </div>
                                                <div class="progress bg-dark overflow-visible" style="height: 6px;">
                                                    <div class="progress-bar bg-warning shadow" style="width: 92%; box-shadow: 0 0 15px rgba(255, 193, 7, 0.4) !important;"></div>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="col-md-4 text-center">
                                            <div class="rounded-circle border border-info border-3 p-5 d-inline-block shadow" style="box-shadow: 0 0 30px rgba(0, 240, 255, 0.2) !important;">
                                                <div class="display-6 fw-bold text-white font-monospace">100</div>
                                                <div class="text-secondary small">SECURE</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="col-lg-4">
                                <div class="admin-card p-4 h-100" style="background: #000; border: 1px solid rgba(0,255,100,0.15);">
                                    <div class="d-flex justify-content-between align-items-center mb-4 pb-2 border-bottom border-dark">
                                        <h6 class="text-success fw-bold font-monospace m-0"><i class="fas fa-stream me-2"></i>LIVE_INTELLIGENCE_FEED</h6>
                                        <span class="spinner-grow spinner-grow-sm text-success" role="status"></span>
                                    </div>
                                    <div class="font-monospace small overflow-auto" style="max-height: 400px; line-height: 1.6;">
                                        ${data.analytics.recentLogs.length === 0 ? '<div class="text-secondary opacity-50">[WAITING_FOR_TRAFFIC...]</div>' : data.analytics.recentLogs.map(log => `
                                            <div class="mb-2">
                                                <span class="text-secondary">[${new Date(log.timestamp).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit', second:'2-digit'})}]</span>
                                                <span class="${log.type === 'PAGE_LOAD' ? 'text-info' : log.type === 'CV_DOWNLOAD' ? 'text-warning' : 'text-success'} fw-bold">${log.type}</span>
                                                <span class="text-white opacity-75 d-block" style="font-size: 0.7rem;">${log.metadata.screen ? `RES: ${log.metadata.screen}` : log.metadata.text || ''}</span>
                                            </div>
                                        `).join('')}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Identity Core Tab -->
                    <div class="tab-pane fade ${this.activeTabId === 'v-pills-profile' ? 'show active' : ''}" id="v-pills-profile" role="tabpanel">
                        <div class="d-flex align-items-center mb-5 gap-4 border-bottom border-dark pb-3">
                            <i class="fas fa-fingerprint fa-2x text-secondary opacity-50"></i>
                            <div>
                                <h1 class="fw-bolder m-0 text-white font-monospace display-6">&lt;Identity_Core /&gt;</h1>
                                <p class="text-secondary m-0">Synchronize your base personality matrix and hiring availability.</p>
                            </div>
                        </div>
                        <div class="admin-card p-4 p-xl-5">
                            <form id="form-profile">
                                <div class="row g-4">
                                    <div class="col-md-6 mb-2">
                                        <div class="p-4 rounded-4 h-100" style="background: rgba(0,0,0,0.3); border: 1px solid rgba(255,255,255,0.03);">
                                            <div class="d-flex align-items-center gap-4">
                                                <div class="position-relative">
                                                    <img src="${profile.photo}" id="profile-preview-img" alt="Profile" class="rounded-circle object-fit-cover shadow-lg" style="width: 100px; height: 100px; border: 2px solid var(--accent-primary);">
                                                    <div class="position-absolute bottom-0 end-0 bg-dark rounded-circle p-1 border border-secondary shadow"><i class="fas fa-camera text-secondary small"></i></div>
                                                </div>
                                                <div class="flex-grow-1 custom-file-upload position-relative" style="cursor: pointer;">
                                                    <h6 class="text-white mb-1"><i class="fas fa-upload me-2 text-info"></i>Upload Portrait</h6>
                                                    <small class="text-secondary d-block">JPG, PNG under 5MB</small>
                                                    <input type="file" accept="image/*" class="position-absolute top-0 start-0 w-100 h-100 opacity-0" id="photoUpload" style="cursor:pointer;">
                                                    <input type="hidden" name="photo" id="photoBase64" value="${profile.photo || ''}">
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="col-md-6 mb-2">
                                        <div class="p-4 rounded-4 h-100 d-flex flex-column justify-content-center custom-file-upload position-relative" style="cursor:pointer;">
                                            <div class="d-flex align-items-center justify-content-center gap-3">
                                                <div class="rounded-circle d-flex align-items-center justify-content-center shadow-lg" style="width: 60px; height: 60px; background: rgba(185, 0, 255, 0.1); border: 1px solid rgba(185, 0, 255, 0.3);">
                                                    <i class="fas fa-file-pdf fs-4 text-secondary" style="color: var(--accent-secondary) !important;"></i>
                                                </div>
                                                <div class="text-start">
                                                    <h6 class="text-white mb-1">Career Document (CV)</h6>
                                                    ${profile.cv ? `<span class="badge bg-success rounded-pill px-2 pb-1" style="font-size:0.7rem;"><i class="fas fa-check-circle me-1"></i>Active</span>` : `<span class="badge bg-danger rounded-pill px-2">Missing PDF</span>`}
                                                </div>
                                            </div>
                                            <input type="file" accept=".pdf" class="position-absolute top-0 start-0 w-100 h-100 opacity-0" id="cvUpload" style="cursor:pointer;">
                                            <input type="hidden" name="cv" id="cvBase64" value="${profile.cv || ''}">
                                        </div>
                                    </div>

                                    <div class="col-12 mt-4">
                                        <div class="form-check form-switch fs-5 d-flex align-items-center p-4 rounded-4" style="background: linear-gradient(90deg, rgba(40, 167, 69, 0.1), transparent); border-left: 3px solid #28a745;">
                                            <input class="form-check-input ms-0 me-3" type="checkbox" role="switch" id="openToWorkToggle" name="openToWork" value="true" ${profile.openToWork ? 'checked' : ''} style="cursor:pointer; transform: scale(1.2);">
                                            <label class="form-check-label text-white m-0 d-flex flex-column" for="openToWorkToggle" style="cursor:pointer;">
                                                <span class="fw-bold" style="letter-spacing:1px; color: #28a745;">OPEN TO WORK BROADCAST</span>
                                                <span class="text-secondary small fs-6">Activating this will display a highly visible recruitment badge across the public interface.</span>
                                            </label>
                                        </div>
                                    </div>

                                    <div class="col-12"><hr class="border-secondary opacity-25 my-1"></div>

                                    <div class="col-md-6 mb-3 admin-input-group">
                                        <label class="form-label text-secondary small text-uppercase fw-bold"><i class="fas fa-id-badge me-2 text-info"></i>Full Name</label>
                                        <input type="text" class="form-control bg-dark text-white rounded-3 py-3 px-4" name="name" value="${profile.name}" required style="border: 1px solid rgba(255,255,255,0.05); box-shadow: inset 0 4px 10px rgba(0,0,0,0.5);">
                                    </div>
                                    <div class="col-md-6 mb-3 admin-input-group">
                                        <label class="form-label text-secondary small text-uppercase fw-bold"><i class="fas fa-briefcase me-2 text-info"></i>Primary Role</label>
                                        <input type="text" class="form-control bg-dark text-white rounded-3 py-3 px-4" name="role" value="${profile.role}" required style="border: 1px solid rgba(255,255,255,0.05); box-shadow: inset 0 4px 10px rgba(0,0,0,0.5);">
                                    </div>
                                    <div class="col-12 mb-3 admin-input-group">
                                        <label class="form-label text-secondary small text-uppercase fw-bold"><i class="fas fa-quote-right me-2 text-info"></i>Tagline</label>
                                        <input type="text" class="form-control bg-dark text-white rounded-3 py-3 px-4" name="tagline" value="${profile.tagline}" required style="border: 1px solid rgba(255,255,255,0.05); box-shadow: inset 0 4px 10px rgba(0,0,0,0.5);">
                                    </div>
                                    <div class="col-md-4 mb-3 admin-input-group">
                                        <label class="form-label text-secondary small text-uppercase fw-bold"><i class="fas fa-envelope me-2 text-warning"></i>Email Address</label>
                                        <input type="email" class="form-control bg-dark text-white rounded-3 py-3 px-4" name="email" value="${profile.email}" required style="border: 1px solid rgba(255,255,255,0.05); box-shadow: inset 0 4px 10px rgba(0,0,0,0.5);">
                                    </div>
                                    <div class="col-md-4 mb-3 admin-input-group">
                                        <label class="form-label text-secondary small text-uppercase fw-bold"><i class="fas fa-phone-alt me-2 text-success"></i>Phone Number</label>
                                        <input type="text" class="form-control bg-dark text-white rounded-3 py-3 px-4" name="phone" value="${profile.phone}" required style="border: 1px solid rgba(255,255,255,0.05); box-shadow: inset 0 4px 10px rgba(0,0,0,0.5);">
                                    </div>
                                    <div class="col-md-4 mb-3 admin-input-group">
                                        <label class="form-label text-secondary small text-uppercase fw-bold"><i class="fas fa-map-marker-alt me-2 text-danger"></i>Geo Location</label>
                                        <input type="text" class="form-control bg-dark text-white rounded-3 py-3 px-4" name="location" value="${profile.location}" required style="border: 1px solid rgba(255,255,255,0.05); box-shadow: inset 0 4px 10px rgba(0,0,0,0.5);">
                                    </div>
                                    <div class="col-md-6 mb-3 admin-input-group">
                                        <label class="form-label text-secondary small text-uppercase fw-bold"><i class="fab fa-github me-2 text-light"></i>GitHub URL</label>
                                        <input type="text" class="form-control bg-dark text-white rounded-3 py-3 px-4" name="github" value="${profile.github}" required style="border: 1px solid rgba(255,255,255,0.05); box-shadow: inset 0 4px 10px rgba(0,0,0,0.5);">
                                    </div>
                                    <div class="col-md-6 mb-3 admin-input-group">
                                        <label class="form-label text-secondary small text-uppercase fw-bold"><i class="fab fa-linkedin me-2 text-primary"></i>LinkedIn URL</label>
                                        <input type="text" class="form-control bg-dark text-white rounded-3 py-3 px-4" name="linkedin" value="${profile.linkedin}" required style="border: 1px solid rgba(255,255,255,0.05); box-shadow: inset 0 4px 10px rgba(0,0,0,0.5);">
                                    </div>
                                    <div class="col-12 mb-3 admin-input-group">
                                        <label class="form-label text-secondary small text-uppercase fw-bold"><i class="fas fa-align-left me-2 text-info"></i>Terminal Biography / Summary</label>
                                        <textarea class="form-control bg-dark text-white rounded-3 py-3 px-4 font-monospace" name="summary" rows="6" required style="border: 1px solid rgba(255,255,255,0.05); box-shadow: inset 0 4px 10px rgba(0,0,0,0.5); font-size: 0.9rem;">${profile.summary}</textarea>
                                    </div>
                                    <div class="col-12"><hr class="border-secondary opacity-25 my-1"></div>
                                    <div class="col-md-6 mt-4 admin-input-group">
                                        <label class="form-label text-secondary small text-uppercase fw-bold"><i class="fas fa-key me-2 text-danger"></i>Admin Override Passphrase</label>
                                        <input type="password" class="form-control bg-dark text-danger font-monospace rounded-3 py-3 px-4 fw-bold" name="adminPassword" placeholder="Enter new passphrase (leave blank to keep current)" style="border: 1px solid rgba(255,50,50,0.2); box-shadow: inset 0 4px 10px rgba(0,0,0,0.5); letter-spacing: 2px;">
                                        <div class="form-text text-secondary mt-2 small"><i class="fas fa-exclamation-triangle me-1 text-warning"></i>This passcode is required to bypass the hidden public gateway.</div>
                                    </div>
                                </div>
                                <div class="text-end mt-5 pt-4 border-top border-dark">
                                    <button type="submit" class="btn btn-lg rounded-pill px-5 py-3 fw-bold text-black" style="background: linear-gradient(90deg, var(--accent-primary), var(--accent-secondary)); border:none; box-shadow: 0 0 20px rgba(0,240,255,0.3); letter-spacing: 1px;">
                                        <i class="fas fa-sync-alt me-2"></i> SYNC PROFILE DATA
                                    </button>
                                </div>
                            </form>
                            
                            <!-- DATA VAULT CARD -->
                            <div class="row g-4 mt-5">
                                <div class="col-12">
                                    <div class="admin-card p-5" style="border: 1px solid rgba(255,255,255,0.05); background: rgba(0,0,0,0.4);">
                                        <div class="d-flex align-items-center justify-content-between flex-wrap gap-4">
                                            <div>
                                                <h4 class="text-white fw-bold mb-1 font-monospace"><i class="fas fa-shield-alt text-warning me-3"></i>Data Vault v1.0</h4>
                                                <p class="text-secondary m-0">Generate a localized system archive (.json) or restore from an existing payload.</p>
                                            </div>
                                            <div class="d-flex gap-3">
                                                <button class="btn btn-outline-warning rounded-pill px-4 py-2 font-monospace fw-bold" id="btn-export-vault">
                                                    <i class="fas fa-file-export me-2"></i> EXPORT_SYSTEM_PAYLOAD
                                                </button>
                                                <div class="position-relative">
                                                    <input type="file" id="input-import-vault" class="position-absolute opacity-0 w-100 h-100" style="cursor:pointer;" accept=".json">
                                                    <button class="btn btn-outline-danger rounded-pill px-4 py-2 font-monospace fw-bold">
                                                        <i class="fas fa-file-import me-2"></i> RESTORE_FROM_ARCHIVE
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Ambient UI & SEO Tab -->
                    <div class="tab-pane fade ${this.activeTabId === 'v-pills-ambient' ? 'show active' : ''}" id="v-pills-ambient" role="tabpanel">
                        <div class="d-flex align-items-center mb-5 gap-4 border-bottom border-dark pb-3">
                            <i class="fas fa-magic fa-2x text-secondary opacity-50"></i>
                            <div>
                                <h1 class="fw-bolder m-0 text-white font-monospace display-6">&lt;Ambient_Parameters /&gt;</h1>
                                <p class="text-secondary m-0">Synchronize the subconscious UI elements and SEO protocols.</p>
                            </div>
                        </div>
                        <div class="admin-card p-4 p-xl-5">
                            <form id="form-ambient">
                                <h5 class="text-info font-monospace mb-4 border-bottom border-secondary pb-2" style="border-color: rgba(255,255,255,0.05) !important;"># S_E_O Protocols</h5>
                                <div class="row g-4 mb-5">
                                    <div class="col-md-8 mb-3 admin-input-group">
                                        <label class="form-label text-secondary small text-uppercase fw-bold"><i class="fas fa-search me-2 text-info"></i>Global Keywords</label>
                                        <input type="text" class="form-control bg-dark text-white rounded-3 py-3 px-4" name="keywords" value="${profile.keywords || ''}" required style="border: 1px solid rgba(255,255,255,0.05);">
                                    </div>
                                    <div class="col-md-4 mb-3 admin-input-group">
                                        <label class="form-label text-secondary small text-uppercase fw-bold"><i class="fas fa-link me-2 text-info"></i>Canonical URL</label>
                                        <input type="url" class="form-control bg-dark text-white rounded-3 py-3 px-4" name="url" value="${profile.url || ''}" required style="border: 1px solid rgba(255,255,255,0.05);">
                                    </div>
                                </div>

                                <h5 class="text-info font-monospace mb-4 border-bottom border-secondary pb-2" style="border-color: rgba(255,255,255,0.05) !important;"># U_I Background Vectors</h5>
                                <div class="row g-4 mb-5">
                                    <div class="col-md-4 mb-3 admin-input-group">
                                        <label class="form-label text-secondary small text-uppercase fw-bold">Hero Ambient</label>
                                        <input type="text" class="form-control bg-dark text-white rounded-3 py-3 px-4" name="ui_hero_bg" value="${profile.ui_hero_bg || ''}" required style="border: 1px solid rgba(255,255,255,0.05);">
                                    </div>
                                    <div class="col-md-4 mb-3 admin-input-group">
                                        <label class="form-label text-secondary small text-uppercase fw-bold">About Ambient</label>
                                        <input type="text" class="form-control bg-dark text-white rounded-3 py-3 px-4" name="ui_about_bg" value="${profile.ui_about_bg || ''}" required style="border: 1px solid rgba(255,255,255,0.05);">
                                    </div>
                                    <div class="col-md-4 mb-3 admin-input-group">
                                        <label class="form-label text-secondary small text-uppercase fw-bold">Skills Ambient</label>
                                        <input type="text" class="form-control bg-dark text-white rounded-3 py-3 px-4" name="ui_skills_bg" value="${profile.ui_skills_bg || ''}" required style="border: 1px solid rgba(255,255,255,0.05);">
                                    </div>
                                    <div class="col-md-4 mb-3 admin-input-group">
                                        <label class="form-label text-secondary small text-uppercase fw-bold">Projects Ambient</label>
                                        <input type="text" class="form-control bg-dark text-white rounded-3 py-3 px-4" name="ui_projects_bg" value="${profile.ui_projects_bg || ''}" required style="border: 1px solid rgba(255,255,255,0.05);">
                                    </div>
                                    <div class="col-md-4 mb-3 admin-input-group">
                                        <label class="form-label text-secondary small text-uppercase fw-bold">Timeline Ambient</label>
                                        <input type="text" class="form-control bg-dark text-white rounded-3 py-3 px-4" name="ui_timeline_bg" value="${profile.ui_timeline_bg || ''}" required style="border: 1px solid rgba(255,255,255,0.05);">
                                    </div>
                                    <div class="col-md-4 mb-3 admin-input-group">
                                        <label class="form-label text-secondary small text-uppercase fw-bold">Hero Deployment</label>
                                        <input type="text" class="form-control bg-dark text-white rounded-3 py-3 px-4" name="ui_hero_deploy" value="${profile.ui_hero_deploy || ''}" required style="border: 1px solid rgba(255,255,255,0.05);">
                                    </div>
                                    <div class="col-md-4 mb-3 admin-input-group">
                                        <label class="form-label text-secondary small text-uppercase fw-bold">Contact Ambient</label>
                                        <input type="text" class="form-control bg-dark text-white rounded-3 py-3 px-4" name="ui_contact_bg" value="${profile.ui_contact_bg || ''}" required style="border: 1px solid rgba(255,255,255,0.05);">
                                    </div>
                                </div>

                                <h5 class="text-info font-monospace mb-4 border-bottom border-secondary pb-2" style="border-color: rgba(255,255,255,0.05) !important;"># Terminal & Assistant</h5>
                                <div class="row g-4 mb-5">
                                    <div class="col-md-6 mb-3 admin-input-group">
                                        <label class="form-label text-secondary small text-uppercase fw-bold">Terminal Prompt</label>
                                        <input type="text" class="form-control bg-dark text-white rounded-3 py-3 px-4" name="ui_terminal_prompt" value="${profile.ui_terminal_prompt || ''}" required style="border: 1px solid rgba(255,255,255,0.05);">
                                    </div>
                                    <div class="col-md-6 mb-3 admin-input-group">
                                        <label class="form-label text-secondary small text-uppercase fw-bold">Assistant Ready Msg</label>
                                        <input type="text" class="form-control bg-dark text-white rounded-3 py-3 px-4" name="ui_assistant_ready" value="${profile.ui_assistant_ready || ''}" required style="border: 1px solid rgba(255,255,255,0.05);">
                                    </div>
                                    <div class="col-md-3 mb-3 admin-input-group">
                                        <label class="form-label text-secondary small text-uppercase fw-bold">Assistant Name</label>
                                        <input type="text" class="form-control bg-dark text-white rounded-3 py-3 px-4" name="ui_assistant_name" value="${profile.ui_assistant_name || ''}" required style="border: 1px solid rgba(255,255,255,0.05);">
                                    </div>
                                    <div class="col-md-3 mb-3 admin-input-group">
                                        <label class="form-label text-secondary small text-uppercase fw-bold">System Version</label>
                                        <input type="text" class="form-control bg-dark text-white rounded-3 py-3 px-4" name="version" value="${profile.version || ''}" required style="border: 1px solid rgba(255,255,255,0.05);">
                                    </div>
                                </div>

                                <h5 class="text-info font-monospace mb-4 border-bottom border-secondary pb-2" style="border-color: rgba(255,255,255,0.05) !important;"># Nav Labels</h5>
                                <div class="row g-4 mb-5">
                                    <div class="col mb-3 admin-input-group">
                                        <label class="form-label text-secondary small text-uppercase fw-bold">About</label>
                                        <input type="text" class="form-control bg-dark text-white rounded-3 py-2 px-3" name="ui_nav_about" value="${profile.ui_nav_about || ''}" required style="border: 1px solid rgba(255,255,255,0.05);">
                                    </div>
                                    <div class="col mb-3 admin-input-group">
                                        <label class="form-label text-secondary small text-uppercase fw-bold">Skills</label>
                                        <input type="text" class="form-control bg-dark text-white rounded-3 py-2 px-3" name="ui_nav_skills" value="${profile.ui_nav_skills || ''}" required style="border: 1px solid rgba(255,255,255,0.05);">
                                    </div>
                                    <div class="col mb-3 admin-input-group">
                                        <label class="form-label text-secondary small text-uppercase fw-bold">Projects</label>
                                        <input type="text" class="form-control bg-dark text-white rounded-3 py-2 px-3" name="ui_nav_projects" value="${profile.ui_nav_projects || ''}" required style="border: 1px solid rgba(255,255,255,0.05);">
                                    </div>
                                    <div class="col mb-3 admin-input-group">
                                        <label class="form-label text-secondary small text-uppercase fw-bold">Experience</label>
                                        <input type="text" class="form-control bg-dark text-white rounded-3 py-2 px-3" name="ui_nav_experience" value="${profile.ui_nav_experience || ''}" required style="border: 1px solid rgba(255,255,255,0.05);">
                                    </div>
                                    <div class="col mb-3 admin-input-group">
                                        <label class="form-label text-secondary small text-uppercase fw-bold">Contact</label>
                                        <input type="text" class="form-control bg-dark text-white rounded-3 py-2 px-3" name="ui_nav_contact" value="${profile.ui_nav_contact || ''}" required style="border: 1px solid rgba(255,255,255,0.05);">
                                    </div>
                                </div>

                                <div class="text-end mt-5 pt-4 border-top border-dark">
                                    <button type="submit" class="btn btn-lg rounded-pill px-5 py-3 fw-bold text-black" style="background: linear-gradient(90deg, var(--accent-primary), var(--accent-secondary)); border:none; box-shadow: 0 0 20px rgba(0,240,255,0.3);">
                                        <i class="fas fa-sync-alt me-2"></i> SYNC AMBIENT CONFIG
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                `;

        ['projects', 'skills', 'experience', 'education'].forEach(collection => {
            const items = data[collection];
            const schema = schemas[collection];
            const collectionTitle = collection.charAt(0).toUpperCase() + collection.slice(1);
            
            html += `
            <div class="tab-pane fade ${this.activeTabId === 'v-pills-' + collection ? 'show active' : ''}" id="v-pills-${collection}" role="tabpanel">
                <div class="d-flex flex-wrap justify-content-between align-items-center mb-5 gap-3 border-bottom border-dark pb-3">
                    <div class="d-flex align-items-center gap-4">
                        <i class="fas fa-database fa-2x text-secondary opacity-50"></i>
                        <div>
                            <h2 class="fw-bolder m-0 text-white font-monospace display-6">&lt;Manage_${collectionTitle} /&gt;</h2>
                            <p class="text-secondary m-0 small font-monospace opacity-75">REORDER_MODE_ENABLED | TOTAL_OBJECTS: ${items.length}</p>
                        </div>
                    </div>
                    <button class="btn btn-lg rounded-4 px-4 py-3 fw-bold shadow-lg d-flex align-items-center gap-3" style="background: rgba(0, 240, 255, 0.1); border: 1px solid var(--accent-primary); color: var(--accent-primary);" data-action="add" data-collection="${collection}">
                        <i class="fas fa-plus"></i> NEW_ENTRY
                    </button>
                </div>
                
                <div id="sortable-${collection}" data-collection="${collection}" class="row g-4 mb-5">
                    ${items.map(item => `
                        <div class="col-xl-4 col-md-6" data-id="${item.id}">
                            <div class="admin-card p-4 h-100 d-flex flex-column position-relative overflow-hidden" style="border-left: 4px solid var(--accent-primary); background: rgba(255,255,255,0.02);">
                                <div class="position-absolute drag-handle top-0 end-0 p-3 fs-5 opacity-25" style="cursor: grab;">
                                    <i class="fas fa-grip-vertical"></i>
                                </div>
                                <div class="mb-3 d-flex align-items-start pe-4">
                                    <div>
                                        <h5 class="text-white fw-bold mb-1">${item[schema[0].name]}</h5>
                                        <div class="font-monospace text-secondary" style="font-size: 0.65rem; letter-spacing:1px;">HASH: ${item.id}</div>
                                    </div>
                                </div>
                                <div class="text-secondary small mb-4 flex-grow-1 opacity-75">
                                    ${item[schema[1].name] ? (item[schema[1].name].length > 100 ? item[schema[1].name].substring(0, 100) + '...' : item[schema[1].name]) : 'NO_DATA'}
                                </div>
                                <div class="d-flex gap-2 border-top border-secondary pt-3 mt-3" style="border-color: rgba(255,255,255,0.05) !important;">
                                    <button class="btn btn-sm rounded-3 py-2 px-3 fw-bold flex-grow-1" style="background: rgba(255,255,255,0.05); color: #fff; border: 1px solid rgba(255,255,255,0.1);" data-action="edit" data-collection="${collection}" data-id="${item.id}">
                                        <i class="fas fa-edit me-1"></i> MODIFY
                                    </button>
                                    <button class="btn btn-sm rounded-3 py-2 px-3 fw-bold" style="background: rgba(255, 95, 86, 0.1); color: #ff5f56; border: 1px solid rgba(255, 95, 86, 0.2);" data-action="delete" data-collection="${collection}" data-id="${item.id}">
                                        <i class="fas fa-trash"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                    `).join('')}
                    ${items.length === 0 ? `<div class="col-12 py-5 text-center"><div class="admin-card p-5 text-secondary font-monospace opacity-50"><i class="fas fa-inbox fa-3x mb-3 d-block"></i>EMPTY_DATA_MODEL</div></div>` : ''}
                </div>
                
                <!-- Overlay Form Terminal -->
                <div id="form-container-${collection}" class="d-none animate-terminal" style="position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.85); backdrop-filter:blur(10px); z-index:9999; display:flex; align-items:center; justify-content:center; padding:1.5rem;">
                    <div class="admin-card p-4 p-xl-5 w-100 shadow-2xl overflow-auto" style="max-width: 900px; max-height: 90vh; border: 1px solid var(--accent-primary) !important; background: rgba(10,10,15,1);">
                        <div class="d-flex justify-content-between align-items-center mb-5 border-bottom border-secondary pb-4" style="border-color: rgba(255,255,255,0.1) !important;">
                            <div class="d-flex align-items-center gap-3">
                                <div class="rounded-pill p-2 px-3" style="background: var(--accent-primary); color: #000; font-weight: 800; font-size: 0.7rem; letter-spacing: 2px;">LIVE_EDITOR</div>
                                <h4 id="form-title-${collection}" class="m-0 text-white fw-bold font-monospace">&lt;EDITOR_v3.2 /&gt;</h4>
                            </div>
                            <button class="btn text-secondary hover-white fs-4" data-action="cancel"><i class="fas fa-times"></i></button>
                        </div>
                        <form id="form-${collection}" data-collection="${collection}">
                            <input type="hidden" name="id">
                            <input type="hidden" name="order">
                            <div class="row g-4">
                                ${this.generateFormFields(schema)}
                            </div>
                            <div class="text-end mt-5 pt-4 border-top border-dark" style="border-color: rgba(255,255,255,0.05) !important;">
                                <button type="button" class="btn btn-lg rounded-4 px-4 py-3 fw-bold text-secondary me-3" style="background: transparent; border: 1px solid rgba(255,255,255,0.1);" data-action="cancel">TERMINATE_PROCESS</button>
                                <button type="submit" class="btn btn-lg rounded-4 px-5 py-3 fw-bold text-black d-inline-flex align-items-center gap-3" style="background: var(--accent-primary); border:none; box-shadow: 0 0 30px rgba(0,240,255,0.4);">
                                    <i class="fas fa-cloud-upload-alt"></i> COMMIT_CHANGES
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>`;
        });

        html += `
            <!-- Transmission Logs (Inbox) -->
            <div class="tab-pane fade ${this.activeTabId === 'v-pills-messages' ? 'show active' : ''}" id="v-pills-messages" role="tabpanel">
                <div class="d-flex align-items-center mb-5 gap-4 border-bottom border-dark pb-3" style="border-color: rgba(255,255,255,0.05) !important;">
                    <i class="fas fa-satellite-dish fa-2x text-secondary opacity-50"></i>
                    <div>
                        <h2 class="fw-bolder m-0 text-white font-monospace display-6">&lt;Transmission_Logs /&gt;</h2>
                        <p class="text-secondary m-0">Decrypted payloads from high-priority public vectors.</p>
                    </div>
                </div>
                
                <div class="d-flex flex-column gap-3 mb-5">
                    ${(data.messages || []).map(msg => `
                        <div class="admin-card p-4 d-flex align-items-center gap-4 position-relative overflow-hidden" style="${!msg.read ? 'border-left: 4px solid var(--accent-primary); background: rgba(0, 240, 255, 0.03);' : 'border-left: 4px solid rgba(255,255,255,0.1); background: rgba(255,255,255,0.01);'} transition:all 0.3s ease;">
                            <div class="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0" style="width: 55px; height: 55px; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1);">
                                <i class="fas fa-user-secret fs-4 ${!msg.read ? 'text-info' : 'text-secondary'}"></i>
                            </div>
                            <div class="flex-grow-1 min-width-0">
                                <div class="d-flex justify-content-between align-items-start mb-1">
                                    <div>
                                        <h6 class="text-white fw-bold m-0 d-flex align-items-center gap-2">
                                            ${msg.name} 
                                            ${!msg.read ? '<span class="badge bg-info text-black rounded-pill" style="font-size:0.6rem;">NEW_DATA</span>' : ''}
                                        </h6>
                                        <div class="text-info small font-monospace">${msg.email}</div>
                                    </div>
                                    <div class="text-secondary font-monospace" style="font-size: 0.7rem; opacity: 0.5;">${new Date(msg.timestamp).toLocaleString()}</div>
                                </div>
                                <div class="text-secondary text-truncate small opacity-75 mt-2" style="max-width: 800px;">${msg.message}</div>
                            </div>
                            <div class="flex-shrink-0 ps-3">
                                <button class="btn btn-sm rounded-3 px-4 py-2 fw-bold" style="background: rgba(255,255,255,0.05); color: #fff; border: 1px solid rgba(255,255,255,0.1);" data-bs-toggle="modal" data-bs-target="#msgModal-${msg.id}" data-action="markRead" data-id="${msg.id}">
                                    ACCESS_DATA
                                </button>
                                <button class="btn btn-sm text-danger ms-2" data-action="delete" data-collection="messages" data-id="${msg.id}"><i class="fas fa-trash-alt"></i></button>
                            </div>
                        </div>

                        <!-- Enhanced Message Modal -->
                        <div class="modal fade" id="msgModal-${msg.id}" tabindex="-1" aria-hidden="true">
                            <div class="modal-dialog modal-dialog-centered">
                                <div class="modal-content border-0 admin-card shadow-2xl" style="background: #0a0a0f !important; border: 1px solid rgba(255,255,255,0.1) !important;">
                                    <div class="modal-header border-0 p-4 pb-0">
                                        <h5 class="modal-title font-monospace text-info opacity-75 small">TRACE_ID: ${msg.id.toString().substring(0,12)}</h5>
                                        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
                                    </div>
                                    <div class="modal-body p-4 p-xl-5 pt-3">
                                        <div class="mb-4 d-flex align-items-center gap-3">
                                            <div class="rounded-circle bg-info p-2" style="width:10px; height:10px; box-shadow: 0 0 15px var(--accent-primary);"></div>
                                            <div class="text-white h5 fw-bold m-0">${msg.name}</div>
                                        </div>
                                        <div class="p-4 rounded-4 bg-dark font-monospace text-secondary shadow-inner position-relative overflow-hidden" style="border: 1px solid rgba(255,255,255,0.05); font-size: 0.9rem; line-height: 1.6;">
                                            <div class="position-absolute top-0 start-0 w-100 h-100 bg-pulse opacity-5 pointer-events-none" style="background: repeating-linear-gradient(0deg, transparent, transparent 1px, rgba(0,240,255,0.1) 2px); background-size: 100% 3px;"></div>
                                            ${msg.message}
                                        </div>
                                        <div class="mt-4 d-flex justify-content-between align-items-end">
                                            <div class="text-secondary small font-monospace">SOURCE_IP: ENCRYPTED<br>CHANNEL: CONTACT_FORM</div>
                                            <a href="mailto:${msg.email}" class="btn btn-info rounded-pill px-5 fw-bold shadow-lg">RELAY_RESPONSE</a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    `).join('')}
                    ${(data.messages || []).length === 0 ? `<div class="py-5 text-center text-secondary font-monospace opacity-25"><i class="fas fa-ghost fa-3x mb-3 d-block"></i>ZERO_TRANSMISSIONS_INCOMING</div>` : ''}
                </div>
            </div>

            <!-- Layout Engine Tab -->
            <div class="tab-pane fade ${this.activeTabId === 'v-pills-layout' ? 'show active' : ''}" id="v-pills-layout" role="tabpanel">
                <div class="d-flex align-items-center mb-5 gap-4 border-bottom border-dark pb-3" style="border-color: rgba(255,255,255,0.05) !important;">
                    <i class="fas fa-stream fa-2x text-secondary opacity-50"></i>
                    <div>
                        <h2 class="fw-bolder m-0 text-white font-monospace display-6">&lt;Runtime_Protocol /&gt;</h2>
                        <p class="text-secondary m-0">Synchronize the physical hierarchy of your environment nodes.</p>
                    </div>
                </div>
                <div class="admin-card p-4 p-xl-5">
                    <div id="sortable-sections" class="d-flex flex-column gap-3">
                        ${data.layout.sections.map((sec, i) => `
                            <div class="admin-card py-4 px-4 d-flex align-items-center justify-content-between drag-handle" data-id="${sec}" style="cursor: grab; border-left: 4px solid var(--accent-secondary); background: rgba(255,255,255,0.02);">
                                <div class="d-flex align-items-center gap-4">
                                    <div class="text-secondary font-monospace fs-5 opacity-25">#0${i+1}</div>
                                    <h5 class="fw-bolder text-uppercase m-0 text-white font-monospace" style="letter-spacing: 4px;">Node_${sec.toUpperCase()}</h5>
                                </div>
                                <div class="d-flex align-items-center gap-3">
                                    <span class="badge bg-dark border border-secondary text-secondary small font-monospace">ACTIVE</span>
                                    <i class="fas fa-grip-lines text-secondary opacity-50"></i>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;

        html += `
                </div>
            </div>
        </div>`;

        this.adminContainer.innerHTML = html;
        this.attachEventListeners(schemas, data);
        this.initSortable();

        // Restore modal state if needed
        if (this.openModalId) {
            const modalEl = document.getElementById(this.openModalId);
            if (modalEl) {
                const modal = new bootstrap.Modal(modalEl);
                modal.show();
            }
        }
    }

    initSortable() {
        ['projects', 'skills', 'experience', 'education'].forEach(col => {
            const el = document.getElementById(`sortable-${col}`);
            if (el) {
                // Destroy old instance if re-rendering
                if (this.sortables[col]) {
                    this.sortables[col].destroy();
                }
                
                this.sortables[col] = Sortable.create(el, {
                    handle: '.drag-handle',
                    animation: 150,
                    ghostClass: 'sortable-ghost',
                    onEnd: (evt) => {
                        const newOrderIds = Array.from(el.querySelectorAll(':scope > [data-id]')).map(node => parseInt(node.dataset.id));
                        const orderMapping = newOrderIds.map((id, index) => ({ id, order: index }));
                        
                        if (this.onReorderItems) {
                            this.onReorderItems(col, orderMapping);
                        }
                    }
                });
            }
        });

        const sectionsEl = document.getElementById('sortable-sections');
        if (sectionsEl) {
            if (this.sortables['sections']) this.sortables['sections'].destroy();
            this.sortables['sections'] = Sortable.create(sectionsEl, {
                handle: '.drag-handle',
                animation: 150,
                ghostClass: 'sortable-ghost',
                onEnd: (evt) => {
                    const newSections = Array.from(sectionsEl.children).map(div => div.dataset.id);
                    if (this.onReorderSections) {
                        this.onReorderSections(newSections);
                    }
                }
            });
        }
    }

    attachEventListeners(schemas, data) {
        // Handle file uploads to Base64 strings
        const handleFileUpload = (inputId, hiddenId) => {
            const fileInput = document.getElementById(inputId);
            if(fileInput) {
                fileInput.addEventListener('change', (e) => {
                    const file = e.target.files[0];
                    if (file) {
                        if(file.size > 5 * 1024 * 1024) { // over 5MB warning
                            alert("File is larger than 5MB. Since the database is entirely local, large files work, but may slow down initial load times.");
                        }
                        const reader = new FileReader();
                        reader.onload = (event) => {
                            document.getElementById(hiddenId).value = event.target.result;
                            if(inputId === 'photoUpload') {
                                document.getElementById('profile-preview-img').src = event.target.result;
                            }
                        };
                        reader.readAsDataURL(file);
                    }
                });
            }
        };

        handleFileUpload('photoUpload', 'photoBase64');
        handleFileUpload('cvUpload', 'cvBase64');

        // Ambient Form
        const ambientForm = document.getElementById('form-ambient');
        if(ambientForm) {
            ambientForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const formData = new FormData(ambientForm);
                const ambientData = Object.fromEntries(formData.entries());
                // Merge with profile data (since it's all in the profile store)
                const fullProfile = { ...data.profile, ...ambientData };
                if(this.onSaveProfile) this.onSaveProfile(fullProfile);
            });
        }

        // Profile Form
        const profileForm = document.getElementById('form-profile');
        profileForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const formData = new FormData(profileForm);
            const profileData = Object.fromEntries(formData.entries());
            
            // Only update password if not empty
            if (!profileData.adminPassword) delete profileData.adminPassword;
            
            profileData.openToWork = formData.has('openToWork');
            // Merge with existing profile to preserve fields not in this form (ambient/SEO/etc.)
            const fullProfile = { ...data.profile, ...profileData };
            if(this.onSaveProfile) this.onSaveProfile(fullProfile);
        });

        // Real-time toggle for Open To Work — also merges to avoid field loss
        const o2wToggle = document.getElementById('openToWorkToggle');
        if(o2wToggle) {
            o2wToggle.addEventListener('change', () => {
                const formData = new FormData(profileForm);
                const profileData = Object.fromEntries(formData.entries());
                
                // Only update password if not empty
                if (!profileData.adminPassword) delete profileData.adminPassword;
                
                profileData.openToWork = o2wToggle.checked;
                const fullProfile = { ...data.profile, ...profileData };
                if(this.onSaveProfile) this.onSaveProfile(fullProfile);
            });
        }

        // Backup & Restore
        const btnExport = document.getElementById('btn-export-vault');
        if(btnExport) {
            btnExport.addEventListener('click', () => {
                if(this.onExportData) this.onExportData();
            });
        }
        
        const inputImport = document.getElementById('input-import-vault');
        if(inputImport) {
            inputImport.addEventListener('change', (e) => {
                const file = e.target.files[0];
                if(!file) return;
                
                const reader = new FileReader();
                reader.onload = (event) => {
                    if(this.onImportData) this.onImportData(event.target.result);
                };
                reader.readAsText(file);
            });
        }

        this.adminContainer.querySelectorAll('.admin-nav-btn').forEach(btn => {
            btn.addEventListener('shown.bs.tab', (e) => {
                this.activeTabId = e.target.id.replace('-tab', '');
            });
        });

        this.adminContainer.addEventListener('show.bs.modal', (e) => {
            this.openModalId = e.target.id;
        });

        this.adminContainer.addEventListener('hidden.bs.modal', (e) => {
            // Only clear if the modal being hidden is the one we think is open
            if (this.openModalId === e.target.id) {
                this.openModalId = null;
            }
        });

        // Actions for lists
        this.adminContainer.querySelectorAll('button[data-action]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const button = e.target.closest('button');
                const action = button.dataset.action;
                const collection = button.dataset.collection;
                
                if (action === 'cancel') {
                    // Search for the terminal overlay container and hide it
                    const terminal = button.closest('.animate-terminal');
                    if (terminal) terminal.classList.add('d-none');
                    return;
                }

                if (action === 'delete') {
                    const id = parseInt(button.dataset.id);
                    if (confirm(`CRITICAL WARNING: Are you sure you want to permanently delete this record?`)) {
                        if(this.onDeleteItem) this.onDeleteItem(collection, id);
                    }
                    return;
                }
                
                if (action === 'markRead') {
                    const id = parseInt(button.dataset.id);
                    if(this.onMarkMessageRead) this.onMarkMessageRead(id);
                    return;
                }

                const formContainer = document.getElementById(`form-container-${collection}`);
                const form = document.getElementById(`form-${collection}`);
                const title = document.getElementById(`form-title-${collection}`);

                if (action === 'add') {
                    form.reset();
                    form.elements['id'].value = '';
                    form.elements['order'].value = '';
                    title.innerHTML = `<span style="color: var(--accent-primary);" class="fs-4"><i class="fas fa-plus-circle me-3"></i>Create New ${collection}</span>`;
                    formContainer.classList.remove('d-none');
                    formContainer.scrollIntoView({ behavior: 'smooth' });
                } else if (action === 'edit') {
                    const id = parseInt(button.dataset.id);
                    const item = data[collection].find(i => i.id === id);
                    if (item) {
                        form.reset();
                        form.elements['id'].value = item.id;
                        form.elements['order'].value = item.order !== undefined ? item.order : '';
                        schemas[collection].forEach(field => {
                            if (form.elements[field.name]) {
                                form.elements[field.name].value = item[field.name] || '';
                            }
                        });
                        title.innerHTML = `<span style="color: var(--accent-primary);" class="fs-4"><i class="fas fa-pen-square me-3"></i>Edit Record #${item.id}</span>`;
                        formContainer.classList.remove('d-none');
                        formContainer.scrollIntoView({ behavior: 'smooth' });
                    }
                }
            });
        });

        // Save Forms
        ['projects', 'skills', 'experience', 'education'].forEach(col => {
            const form = document.getElementById(`form-${col}`);
            if (form) {
                form.addEventListener('submit', (e) => {
                    e.preventDefault();
                    const formData = new FormData(form);
                    const itemData = Object.fromEntries(formData.entries());
                    itemData.id = itemData.id ? parseInt(itemData.id) : null;
                    itemData.order = itemData.order !== "" ? parseInt(itemData.order) : null;
                    
                    if(this.onSaveItem) this.onSaveItem(col, itemData);
                });
            }
        });
    }

    show() { } // Unused in discrete page
    hide() { } // Unused in discrete page
}
