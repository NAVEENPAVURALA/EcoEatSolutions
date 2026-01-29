# Deployment Guide for EcoEatSolutions

Your application is a production-ready **Vite + React** app with a **Firebase** backend.

## 1. Prerequisites
-   **GitHub Repository**: Your code is already here.
-   **Vercel Account**: [Sign up here](https://vercel.com) (free).

## 2. Environment Variables (Critical)
You must set these in Vercel. **DO NOT** commit `.env` to GitHub.

Copy these exact values from your local `.env` file and paste them into Vercel:

| Variable | Value (Example - Use your real ones) |
| :--- | :--- |
| `VITE_FIREBASE_API_KEY` | `AIzaSyAf...` |
| `VITE_FIREBASE_AUTH_DOMAIN` | `ecoeatsolutions.firebaseapp.com` |
| `VITE_FIREBASE_PROJECT_ID` | `ecoeatsolutions` |
| `VITE_FIREBASE_STORAGE_BUCKET` | `ecoeatsolutions.firebasestorage.app` |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | `429...` |
| `VITE_FIREBASE_APP_ID` | `1:429...` |
| `VITE_HUGGING_FACE_API_KEY` | `hf_...` (If used for chat/AI) |

*(Note: Ignore the Supabase variables in your local file, they are not used.)*

## 3. One-Click Deployment (Recommended)

1.  **Go to Vercel Dashboard**: https://vercel.com/dashboard
2.  Click **Add New...** -> **Project**.
3.  **Import** your `EcoEatSolutions` repository.
4.  **Framework Preset**: Select `Vite`.
5.  **Root Directory**: leave as `./`.
6.  **Environment Variables**: Expand this section and copy-paste all variables from Step 2.
7.  Click **Deploy**.

## 4. Post-Deployment Configuration

1.  **Authorize Domain**:
    -   Once deployed, Vercel gives you a URL (e.g., `ecoeatsolutions.vercel.app`).
    -   Go to **Firebase Console** -> **Authentication** -> **Settings** -> **Authorized Domains**.
    -   Add your new Vercel domain there. **Login will fail if you skip this.**

2.  **Test**:
    -   Open your new site.
    -   Try to Log In.
    -   Try to Donate (Geolocation should ask for permission).

## 5. Troubleshooting
-   **404 on Refresh**: This is handled by `vercel.json` rewrites. If it fails, ensure `vercel.json` is in the root.
-   **Login Fails**: Check "Authorized Domains" in Firebase (Step 4).
