const fs = require('fs');

// ── Fix 1: AdminView.js – adminPassword: type="text" → type="password" ──────
let av = fs.readFileSync('js/views/AdminView.js', 'utf8');

// Use a regex that avoids quoting issues
const pwdPattern = /name="adminPassword" value="[^"]*" required/g;
if (pwdPattern.test(av)) {
    av = av.replace(
        /type="text"([^>]*)name="adminPassword" value="[^"]*" required/,
        'type="password"$1name="adminPassword" placeholder="Enter passphrase" required'
    );
    fs.writeFileSync('js/views/AdminView.js', av, 'utf8');
    console.log('[AdminView.js] adminPassword field -> type=password  ✓');
} else {
    // Try alternate: maybe it was already changed
    if (av.includes('type="password"') && av.includes('adminPassword')) {
        console.log('[AdminView.js] adminPassword already type=password  (skipped)');
    } else {
        console.log('[AdminView.js] adminPassword pattern NOT found - dumping context:');
        const idx = av.indexOf('adminPassword');
        if (idx > -1) console.log(av.substring(idx - 20, idx + 200));
    }
}

// ── Fix 2: admin.html – add defer to SortableJS <script> ────────────────────
let ah = fs.readFileSync('admin.html', 'utf8');
if (ah.includes('Sortable.min.js"></script>')) {
    ah = ah.replace('Sortable.min.js"></script>', 'Sortable.min.js" defer></script>');
    fs.writeFileSync('admin.html', ah, 'utf8');
    console.log('[admin.html]  SortableJS defer added  ✓');
} else if (ah.includes('Sortable.min.js" defer>')) {
    console.log('[admin.html]  SortableJS defer already present  (skipped)');
} else {
    console.log('[admin.html]  SortableJS pattern not found');
}

console.log('\nDone.');
