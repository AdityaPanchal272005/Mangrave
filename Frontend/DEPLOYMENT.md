# Mangrove Watch Pro - Deployment Guide

## 🚀 Deploying to Vercel

### Prerequisites
1. Vercel account
2. GitHub repository connected to Vercel

### Steps to Deploy:

#### 1. **Connect to Vercel**
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Click "New Project"
   - Import your GitHub repository: `Ashish200528/Mangrove_frontend`

#### 2. **Configure Environment Variables**
   In Vercel Dashboard → Project Settings → Environment Variables, add:

   ```
   VITE_FIREBASE_API_KEY=AIzaSyBNeSFmYV5cI3WW6N8ZIF9J6HJDHwqCOyU
   VITE_FIREBASE_AUTH_DOMAIN=ecowatch-470604.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=ecowatch-470604
   VITE_FIREBASE_STORAGE_BUCKET=ecowatch-470604.firebasestorage.app
   VITE_FIREBASE_MESSAGING_SENDER_ID=732511249252
   VITE_FIREBASE_APP_ID=1:732511249252:web:53a7923f0137d73e20d071
   VITE_API_URL=https://your-backend-url.render.com
   ```

#### 3. **Build Settings**
   - Framework Preset: **Vite**
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

#### 4. **Deploy**
   - Click "Deploy"
   - Wait for build to complete
   - Your app will be available at: `https://your-app-name.vercel.app`

### 🔧 Firebase Authentication Setup for Production

1. **Add Authorized Domains**
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Select your project: `ecowatch-470604`
   - Go to Authentication → Settings → Authorized domains
   - Add your Vercel domain: `your-app-name.vercel.app`

2. **Update OAuth Settings** (if using Google Auth)
   - In Firebase Console → Authentication → Sign-in method
   - Click on Google
   - Add your Vercel domain to authorized domains

### 🛠️ Backend Integration

When your Node.js backend is ready and deployed to Render:

1. **Update Environment Variable**
   ```
   VITE_API_URL=https://your-backend-app.render.com
   ```

2. **CORS Configuration**
   Make sure your backend allows your Vercel domain:
   ```javascript
   // In your Node.js backend
   app.use(cors({
     origin: ['https://your-app-name.vercel.app', 'http://localhost:8080']
   }));
   ```

### 🔍 Testing Authentication

1. **Create Test Admin User**
   - Go to Firebase Console → Authentication → Users
   - Add user: `admin@ecowatch.org` with password `password123`

2. **Test Login**
   - Visit your deployed app
   - Use the credentials: `admin@ecowatch.org` / `password123`
   - Or use Google Sign-in

### 🚦 Demo Mode

The app currently works with mock data when backend is not available, perfect for demo purposes!

### 📝 Notes

- All Firebase credentials are configured for the `ecowatch-470604` project
- The app will automatically fall back to mock data if backend is unavailable
- Authentication works with Firebase even without backend
- Ready for backend integration when Node.js API is deployed
