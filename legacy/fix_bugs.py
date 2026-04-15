import re

# ─── AdminView.js fixes ──────────────────────────────────────────────────────
with open('js/views/AdminView.js', 'r', encoding='utf-8') as f:
    av = f.read()

# Bug #14 – adminPassword: type="text" → type="password" (mask it)
av = re.sub(
    r'type="text" (class="form-control bg-dark text-danger font-monospace[^"]*" name="adminPassword") value="\$\{profile\.adminPassword \|\| \'admin\'\}"',
    r'type="password" \1 placeholder="••••••"',
    av
)

with open('js/views/AdminView.js', 'w', encoding='utf-8') as f:
    f.write(av)

print("[AdminView.js] done")

# ─── ClientView.js fixes ─────────────────────────────────────────────────────
with open('js/views/ClientView.js', 'r', encoding='utf-8') as f:
    cv = f.read()

# Bug #1 – null-guard at top of render()
old_render_start = '''    render(data) {
        const { profile, projects, skills, experience, education, layout } = data;
        this.currentProfile = profile;'''
new_render_start = '''    render(data) {
        const { profile, projects, skills, experience, education, layout } = data;
        // Bug #1 guard: if profile is missing the whole UI would crash with null-refs
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
        this.currentProfile = profile;'''
cv = cv.replace(old_render_start, new_render_start)

# Bug #3 – remove redundant attachAdminTriggers() call inside 'sudo' command handler
old_sudo = '''            } else if (cmd === 'sudo') {
                log(`SYSTEM OVERRIDE DETECTED... AUTHORIZATION REQUIRED.`, 'text-error text-prime fw-bold');
                // Trigger hidden admin modal from attachAdminTriggers context
                const initiate = this.attachAdminTriggers(); // This is a bit tricky since it's a closure
                // Instead, we dispatch the sudo keyboard event or call the login method if accessible
                this.initiateAdminLogin(); '''
new_sudo = '''            } else if (cmd === 'sudo') {
                log(`SYSTEM OVERRIDE DETECTED... AUTHORIZATION REQUIRED.`, 'text-error text-prime fw-bold');
                this.initiateAdminLogin();'''
cv = cv.replace(old_sudo, new_sudo)

# Bug #7 – double-domain URLs in JSON-LD schema (linkedin.com/in/ stored value already contains it)
old_schema_sameAs = '''                "sameAs": [
                    `https://linkedin.com/in/${profile.linkedin}`,
                    `https://github.com/${profile.github}`
                ],'''
new_schema_sameAs = '''                "sameAs": [
                    `https://${profile.linkedin}`,
                    `https://${profile.github}`
                ],'''
cv = cv.replace(old_schema_sameAs, new_schema_sameAs)

# Bug #8 – footer social links are dead href="#"  
# Replace footer icon links with real profile data
old_footer_socials = '''                <div class="mb-4 d-flex justify-content-center gap-4 text-center mx-auto">
                    <a href="#" class="text-secondary hover-white fs-4" style="transition: all 0.3s;" onmouseover="this.style.color=\'var(--accent-primary)\'; this.style.transform=\'translateY(-3px)\';" onmouseout="this.style.color=\'\'; this.style.transform=\'translateY(0)\';"><i class="fab fa-github"></i></a>
                    <a href="#" class="text-secondary hover-white fs-4" style="transition: all 0.3s;" onmouseover="this.style.color=\'var(--accent-primary)\'; this.style.transform=\'translateY(-3px)\';" onmouseout="this.style.color=\'\'; this.style.transform=\'translateY(0)\';"><i class="fab fa-linkedin"></i></a>
                    <a href="#" class="text-secondary hover-white fs-4" style="transition: all 0.3s;" onmouseover="this.style.color=\'var(--accent-primary)\'; this.style.transform=\'translateY(-3px)\';" onmouseout="this.style.color=\'\'; this.style.transform=\'translateY(0)\';"><i class="fas fa-envelope"></i></a>
                </div>'''
new_footer_socials = '''                <div class="mb-4 d-flex justify-content-center gap-4 text-center mx-auto">
                    <a href="https://${profile.github}" target="_blank" aria-label="GitHub" class="text-secondary hover-white fs-4" style="transition: all 0.3s;" onmouseover="this.style.color=\'var(--accent-primary)\'; this.style.transform=\'translateY(-3px)\';" onmouseout="this.style.color=\'\'; this.style.transform=\'translateY(0)\';"><i class="fab fa-github"></i></a>
                    <a href="https://${profile.linkedin}" target="_blank" aria-label="LinkedIn" class="text-secondary hover-white fs-4" style="transition: all 0.3s;" onmouseover="this.style.color=\'var(--accent-primary)\'; this.style.transform=\'translateY(-3px)\';" onmouseout="this.style.color=\'\'; this.style.transform=\'translateY(0)\';"><i class="fab fa-linkedin"></i></a>
                    <a href="mailto:${profile.email}" aria-label="Email" class="text-secondary hover-white fs-4" style="transition: all 0.3s;" onmouseover="this.style.color=\'var(--accent-primary)\'; this.style.transform=\'translateY(-3px)\';" onmouseout="this.style.color=\'\'; this.style.transform=\'translateY(0)\';"><i class="fas fa-envelope"></i></a>
                </div>'''
cv = cv.replace(old_footer_socials, new_footer_socials)

# Bug #2 – remove duplicate window.adminTriggersAttached = true; (line ~714)
# Keep the first assignment (line ~700), remove the 2nd one at end of function
cv = cv.replace(
    "        window.adminTriggersAttached = true;\n        // Hidden Sysadmin Gateway - Method 2: Typing 'sudo' anywhere",
    "        // Hidden Sysadmin Gateway - Method 2: Typing 'sudo' anywhere"
)

with open('js/views/ClientView.js', 'w', encoding='utf-8') as f:
    f.write(cv)

print("[ClientView.js] done")

# ─── admin.html – add defer to SortableJS ────────────────────────────────────
with open('admin.html', 'r', encoding='utf-8') as f:
    ah = f.read()

ah = ah.replace(
    '<script src="https://cdn.jsdelivr.net/npm/sortablejs@latest/Sortable.min.js"></script>',
    '<script src="https://cdn.jsdelivr.net/npm/sortablejs@latest/Sortable.min.js" defer></script>'
)

with open('admin.html', 'w', encoding='utf-8') as f:
    f.write(ah)

print("[admin.html] done")

# ─── app.js – remove dead `originalRender` assignment ───────────────────────
with open('js/app.js', 'r', encoding='utf-8') as f:
    aj = f.read()

aj = aj.replace(
    "    const originalRender = AppPresenter.prototype.init; // This is a bit rough, but let's see\n    // Better: let the presenter call this or use a MutationObserver\n",
    "    // Use MutationObserver to re-observe .reveal elements injected dynamically\n"
)

with open('js/app.js', 'w', encoding='utf-8') as f:
    f.write(aj)

print("[app.js] done")

print("\nAll fixes applied successfully.")
