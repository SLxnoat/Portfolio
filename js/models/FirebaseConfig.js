// Firebase Configuration
// Get these values from your Firebase Console: https://console.firebase.google.com/
// 1. Create a new Firebase project
// 2. Enable Realtime Database (test mode)
// 3. Copy your config from Project Settings

<script type="module">
  // Import the functions you need from the SDKs you need
  import { initializeApp } from "https://www.gstatic.com/firebasejs/12.14.0/firebase-app.js";
  import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.14.0/firebase-analytics.js";
  // TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries

  // Your web app's Firebase configuration
  // For Firebase JS SDK v7.20.0 and later, measurementId is optional
  const firebaseConfig = {
    apiKey: "AIzaSyBKCDeeOolfqs3oA5kZhtM--nllQ22RcbE",
    authDomain: "portfolio-sync-2efaf.firebaseapp.com",
    databaseURL: "https://portfolio-sync-2efaf-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "portfolio-sync-2efaf",
    storageBucket: "portfolio-sync-2efaf.firebasestorage.app",
    messagingSenderId: "794966578973",
    appId: "1:794966578973:web:f2a8fe7e73dd3e5d4d73f4",
    measurementId: "G-XN5YM2LPHQ"
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const analytics = getAnalytics(app);
</script>

// Replace the above with your Firebase config from:
// Firebase Console > Project Settings > Your apps > Web app > Firestore/Database details
//
// SETUP INSTRUCTIONS:
// 1. Visit https://console.firebase.google.com/
// 2. Click "Create a project" or select existing project
// 3. In left sidebar: Build > Realtime Database
// 4. Click "Create Database"
// 5. Choose "Start in test mode" (for development)
// 6. Copy config from: Project Settings (gear icon) > Your apps > Web app
// 7. Replace the values above
//
// SECURITY RULES (Paste into Database > Rules tab):
// {
//   "rules": {
//     "portfolio": {
//       ".read": true,
//       ".write": false,
//       "profile": {
//         ".write": "auth.uid != null"
//       },
//       "projects": {
//         ".write": "auth.uid != null"
//       },
//       "skills": {
//         ".write": "auth.uid != null"
//       },
//       "experience": {
//         ".write": "auth.uid != null"
//       },
//       "education": {
//         ".write": "auth.uid != null"
//       },
//       "messages": {
//         ".write": "auth.uid != null"
//       },
//       "settings": {
//         ".write": "auth.uid != null"
//       },
//       "analytics": {
//         ".write": true
//       }
//     }
//   }
// }
