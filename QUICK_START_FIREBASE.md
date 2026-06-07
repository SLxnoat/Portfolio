# Quick Start - Firebase Setup (5 minutes)

## Copy-Paste Instructions

### Step 1: Create Firebase Project
1. Go to https://console.firebase.google.com/
2. Click **Create project** → name it `portfolio-sync` → click **Create**
3. Wait for it to finish

### Step 2: Add Realtime Database
1. Click **Build** (left side) → **Realtime Database**
2. Click **Create Database**
3. Choose **Test mode** → Select location → **Enable**

### Step 3: Get Your Config
1. Click **⚙ Settings** (gear icon, top-left)
2. Go to **Project Settings** tab
3. Scroll to **Your apps** 
4. Copy the config from the web app (looks like below)

### Step 4: Paste into Code
1. Open `js/models/FirebaseConfig.js`
2. Replace the placeholder values with your copied config
3. **Save the file**

### Step 5: Copy Security Rules
In Firebase Console:
1. Go to **Realtime Database** → **Rules** tab
2. Delete everything and paste this:

```json
{
  "rules": {
    "portfolio": {
      ".read": true,
      ".write": false,
      "profile": { ".write": "auth.uid != null" },
      "projects": { ".write": "auth.uid != null" },
      "skills": { ".write": "auth.uid != null" },
      "experience": { ".write": "auth.uid != null" },
      "education": { ".write": "auth.uid != null" },
      "messages": { ".write": "auth.uid != null" },
      "settings": { ".write": "auth.uid != null" },
      "analytics": { ".write": true }
    }
  }
}
```

3. Click **Publish**

### Step 6: Enable Anonymous Login
1. Go to **Authentication** (Build section)
2. Click **Get started**
3. Find **Anonymous** → toggle **Enable** → **Save**

### Step 7: Test
1. Add a project in Admin on your laptop
2. Open portfolio on your phone
3. Check - the new project appears instantly! ✅

---

## What Changed in Your Code?
- ✅ `Database.js` now uses Firebase (automatic cross-device sync)
- ✅ `FirebaseConfig.js` holds your Firebase credentials
- ✅ Everything else works the same way

## Done! 🎉
Your portfolio now syncs across all devices in real-time.

**Questions?** Check `SETUP_FIREBASE.md` for detailed troubleshooting.
