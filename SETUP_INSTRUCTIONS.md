# EventSync - Setup Instructions

## 🚀 Quick Start Guide

### 1. Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create environment file:**
   Create a `.env` file in the backend directory with:
   ```env
   MONGO_URI=mongodb://localhost:27017/eventsync
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   PORT=5000
   ```

4. **Start MongoDB:**
   Make sure MongoDB is running on your system (default port 27017)

5. **Start the backend server:**
   ```bash
   npm run dev
   ```
   The server will run on `http://localhost:5000`

### 2. Frontend Setup

1. **Navigate to frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```
   The frontend will run on `http://localhost:5173` (or similar)

## 🔗 Backend-Frontend Connection Verification

### Automatic Connection Test
The frontend automatically tests the backend connection when the app starts. Check the browser console for:
- ✅ `Backend connection successful` - Connection is working
- ❌ `Backend connection failed` - Backend is not running or not accessible

### Manual Verification
1. **Backend Health Check:**
   Visit `http://localhost:5000/api/events` in your browser
   - Should return JSON with events array
   - If you see CORS errors, the backend is running but CORS is not configured

2. **Frontend API Calls:**
   - Open browser DevTools → Network tab
   - Try to sign up or log in
   - Check if API calls are being made to `http://localhost:5000/api/`

## 🎯 New Features Added

### ✅ Signup Page
- **Location:** `frontend/src/components/Auth/Signup.tsx`
- **Features:**
  - Full name, email, password, confirm password
  - Account type selection (User/Organizer)
  - Password validation (minimum 6 characters)
  - Password confirmation matching
  - Back to login option

### ✅ Updated Login Page
- **Removed:** Demo credentials section
- **Added:** "Create one here" link to signup
- **Maintained:** Role selection (User/Organizer)

### ✅ Backend Connection Test
- **Automatic:** Tests connection on app startup
- **Console Logs:** Shows connection status
- **User Notifications:** Alerts if backend is unreachable

## 🔧 Troubleshooting

### Backend Connection Issues
1. **Check if backend is running:**
   ```bash
   cd backend
   npm run dev
   ```

2. **Check MongoDB connection:**
   - Ensure MongoDB is running
   - Check if the MONGO_URI in .env is correct

3. **Check CORS configuration:**
   - Backend has `app.use(cors())` which should allow frontend requests

### Frontend Issues
1. **Check if frontend is running:**
   ```bash
   cd frontend
   npm run dev
   ```

2. **Check browser console:**
   - Look for connection test messages
   - Check for any JavaScript errors

3. **Check Network tab:**
   - Verify API calls are being made to `http://localhost:5000/api/`
   - Check for CORS errors

## 📱 Usage

1. **Start both servers** (backend and frontend)
2. **Open the frontend** in your browser
3. **Create an account** using the signup form
4. **Login** with your credentials
5. **Explore the app** - create events, check in, view leaderboard

## 🎉 Success Indicators

- ✅ Backend server shows "MongoDB connected" and "Server running on port 5000"
- ✅ Frontend shows "Backend connection successful" in console
- ✅ You can create an account and login
- ✅ You can create events and check in
- ✅ Leaderboard shows real data

Your EventSync application is now fully connected and ready to use! 🚀
