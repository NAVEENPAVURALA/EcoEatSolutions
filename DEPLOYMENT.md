# Deployment Guide for EcoEatSolutions

Your application is built with **Vite + React + TypeScript** and uses **Firebase** for the backend. This guide covers how to deploy it to production.

## 1. Prerequisites
-   **GitHub Repository**: Ensure your code is pushed to GitHub (already done).
-   **Vercel Account**: We recommend [Vercel](https://vercel.com) for the easiest hosting experience with Vite apps.
-   **Firebase Project**: You already have this connected.

## 2. Environment Variables
When deploying, you must add your environment variables to your hosting provider. DO NOT commit `.env` to GitHub.

Go to your Vercel Project Settings > **Environment Variables** and add the following (copy values from your local `.env`):

```bash
VITE_FIREBASE_API_KEY=your_value
VITE_FIREBASE_AUTH_DOMAIN=your_value
VITE_FIREBASE_PROJECT_ID=your_value
VITE_FIREBASE_STORAGE_BUCKET=your_value
VITE_FIREBASE_MESSAGING_SENDER_ID=your_value
VITE_FIREBASE_APP_ID=your_value
```

## 3. Deployment Steps (Vercel)

1.  **Login** to Vercel (https://vercel.com).
2.  **Add New...** > **Project**.
3.  **Import** your `EcoEatSolutions` repository.
4.  **Framework Preset**: Select **Vite**.
5.  **Build Command**: `npm run build` (default).
6.  **Output Directory**: `dist` (default).
7.  **Environment Variables**: Paste the values from Step 2.
8.  Click **Deploy**.

## 4. Firebase Security Rules (Important)
For production security, ensure your Firestore rules are strict. Go to Firebase Console > Firestore Database > Rules.

**Recommended Rules:**
```firestore
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Users: Users can read/write their own profile
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Donations: Anyone can read, only auth users can create
    match /donations/{donationId} {
      allow read: if true;
      allow create: if request.auth != null;
      // Only the creator or the claimer can update
      allow update: if request.auth != null && (resource.data.userId == request.auth.uid || resource.data.status == "available");
    }
    
    // Requests: Similar to donations
    match /requests/{requestId} {
      allow read: if true;
      allow create: if request.auth != null;
      allow update: if request.auth != null && resource.data.userId == request.auth.uid;
    }
  }
}
```

## 5. Post-Deployment Checks
-   Visit your live URL.
-   Test the **Login/Signup** flow (ensure Google Auth works - you may need to add your Vercel domain to "Authorized Domains" in Firebase Authentication settings).
-   Verify **Browse Page** loads images correctly.
-   Make a test donation.

🍏 **Enjoy your new Apple-Standard application!**
