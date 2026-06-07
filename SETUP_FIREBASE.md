# Firebase Setup Guide for Portfolio Sync

## Problem Solved
Your portfolio now syncs **automatically across all devices and browsers** using Firebase Realtime Database.

## Setup Steps

### 1. Create Firebase Project
- Go to [Firebase Console](https://console.firebase.google.com/)
- Click **"Create a project"** (or use existing)
- Enter project name (e.g., "portfolio-sync")
- Click **Create project**

### 2. Enable Realtime Database
1. In Firebase Console, go to **Build** (left sidebar) → **Realtime Database**
2. Click **Create Database**
3. Choose **Start in test mode** (for development)
4. Select location closest to you
5. Click **Enable**

### 3. Get Your Firebase Config
1. Go to **Project Settings** (gear icon, top-left)
2. Scroll to **Your apps** section
3. Click the **Web** app icon (or create one if needed)
4. Copy the entire config object

Example config:
```javascript
{
  apiKey: "AIzaSyD...",
  authDomain: "my-project.firebaseapp.com",
  databaseURL: "https://my-project.firebaseio.com",
  projectId: "my-project",
  storageBucket: "my-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123def456"
}
```

### 4. Update FirebaseConfig.js
1. Open `js/models/FirebaseConfig.js`
2. Replace the placeholder values with your Firebase config:

```javascript
export const firebaseConfig = {
    apiKey: "AIzaSyD...",           // Your API Key
    authDomain: "my-project.firebaseapp.com",
    databaseURL: "https://my-project.firebaseio.com",
    projectId: "my-project",
    storageBucket: "my-project.appspot.com",
    messagingSenderId: "123456789",
    appId: "1:123456789:web:abc123def456"
};
```

3. **Save the file**

### 5. Set Firebase Security Rules (Important!)
1. In Firebase Console → **Realtime Database** → **Rules** tab
2. Replace the default rules with:

```json
{
  "rules": {
    "portfolio": {
      ".read": true,
      ".write": "auth.uid != null",
      "profile": {
        ".write": "auth.uid != null"
      },
      "projects": {
        ".write": "auth.uid != null"
      },
      "skills": {
        ".write": "auth.uid != null"
      },
      "experience": {
        ".write": "auth.uid != null"
      },
      "education": {
        ".write": "auth.uid != null"
      },
      "messages": {
        ".write": "auth.uid != null"
      },
      "settings": {
        ".write": "auth.uid != null"
      },
      "analytics": {
        ".write": "auth.uid != null"
      }
    }
  }
}
```

3. Click **Publish**

### 6. Enable Anonymous Authentication (Required)
1. Go to **Build** → **Authentication**
2. Click **Get started**
3. Go to **Sign-in method** tab
4. Click **Anonymous** and enable it
5. Click **Save**

> This is required because the portfolio code signs in anonymously before writing data to Firebase. Without it, the app will be blocked by Realtime Database rules.

### 7. Test It!
1. Open your portfolio on Device A (e.g., laptop)
2. Go to Admin Dashboard
3. Add or edit a project
4. **Open the same portfolio on Device B** (e.g., phone or tablet)
5. Changes appear **instantly** on Device B! 🎉

## How It Works
- **Firebase Realtime Database** stores all your data in the cloud
- **Real-time listeners** push updates to all devices automatically
- **No backend server needed** - Firebase handles it all
- **Offline support** - Data is cached locally and syncs when back online

## Troubleshooting

### "CORS Error" or "Invalid API Key"
- Make sure you copied the correct config from Firebase Console
- Check that `databaseURL` is correct

### "Permission denied" when saving
- Verify security rules are published correctly
- Check that Anonymous authentication is enabled
- Make sure the Realtime Database path is `portfolio/` and your rules allow authenticated write access for the profile/projects/settings branches

### Changes not syncing
1. Open browser console (F12)
2. Check for errors
3. Refresh the page
4. Verify Firebase config is correct

## Files Modified
- `js/models/Database.js` - Now uses Firebase instead of IndexedDB
- `js/models/FirebaseConfig.js` - **Update with your Firebase credentials**
- No changes needed to other files!

## Next Steps (Optional)
- Add user authentication so only you can edit
- Set up automated backups
- Add analytics
- Deploy to GitHub Pages / Firebase Hosting

