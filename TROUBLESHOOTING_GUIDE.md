# 🔧 Backend Server Troubleshooting Guide

## 🚨 Common Issues and Solutions

### 1. **Environment Variables (.env file)**

**Problem:** Server can't find or load environment variables

**Solution:**
1. Create a `.env` file in the `backend` directory with this content:
```env
MONGO_URI=mongodb://localhost:27017/eventsync
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
PORT=5000
```

2. Make sure the `.env` file is in the correct location:
```
backend/
├── .env          ← Should be here
├── server.js
├── package.json
└── ...
```

### 2. **MongoDB Connection Issues**

**Problem:** "MongoDB connection failed" or "MongoDB not running"

**Solutions:**
1. **Install MongoDB:**
   - Download from: https://www.mongodb.com/try/download/community
   - Or use MongoDB Atlas (cloud): https://www.mongodb.com/atlas

2. **Start MongoDB locally:**
   ```bash
   # Windows
   net start MongoDB
   
   # macOS/Linux
   sudo systemctl start mongod
   ```

3. **Check if MongoDB is running:**
   ```bash
   # Test connection
   mongosh
   ```

### 3. **Node.js Dependencies Issues**

**Problem:** "Cannot find module" errors

**Solution:**
```bash
cd backend
rm -rf node_modules package-lock.json
npm install
```

### 4. **Port Already in Use**

**Problem:** "Port 5000 is already in use"

**Solutions:**
1. **Kill process using port 5000:**
   ```bash
   # Windows
   netstat -ano | findstr :5000
   taskkill /PID <PID_NUMBER> /F
   
   # macOS/Linux
   lsof -ti:5000 | xargs kill -9
   ```

2. **Use different port:**
   Change PORT in `.env` file:
   ```env
   PORT=5001
   ```

## 🧪 Testing Steps

### Step 1: Test Basic Server
```bash
cd backend
node test-server.js
```

**Expected Output:**
```
✅ Environment variables loaded
MONGO_URI: Set
JWT_SECRET: Set
PORT: 5000
🚀 Test server running on port 5000
📡 Test URL: http://localhost:5000
🔗 API Test URL: http://localhost:5000/api/test
```

### Step 2: Test API Endpoint
Open browser and visit: `http://localhost:5000/api/test`

**Expected Response:**
```json
{
  "success": true,
  "message": "API is working!",
  "environment": {
    "mongoUri": "Set",
    "jwtSecret": "Set",
    "port": 5000
  }
}
```

### Step 3: Test Main Server
```bash
cd backend
node server.js
```

**Expected Output:**
```
MONGO_URI: mongodb://localhost:27017/eventsync
MongoDB connected
Server running on port 5000
```

## 🐛 Debugging Commands

### Check Node.js Version
```bash
node --version
npm --version
```

### Check if Port is Available
```bash
# Windows
netstat -an | findstr :5000

# macOS/Linux
lsof -i :5000
```

### Check MongoDB Status
```bash
# Windows
sc query MongoDB

# macOS/Linux
systemctl status mongod
```

### Test MongoDB Connection
```bash
mongosh mongodb://localhost:27017/eventsync
```

## 🔄 Alternative Solutions

### Option 1: Use MongoDB Atlas (Cloud)
1. Go to https://www.mongodb.com/atlas
2. Create free account
3. Create cluster
4. Get connection string
5. Update `.env`:
```env
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/eventsync
```

### Option 2: Use Different Database
If MongoDB is problematic, you can temporarily modify the server to work without a database:

```javascript
// In server.js, comment out MongoDB connection
// mongoose.connect(process.env.MONGO_URI)
// .then(() => console.log("MongoDB connected"))
// .catch(err => console.log(err));
```

### Option 3: Use Docker
```bash
# Run MongoDB in Docker
docker run -d -p 27017:27017 --name mongodb mongo:latest

# Then run your server
cd backend
node server.js
```

## 📞 Getting Help

If you're still having issues:

1. **Run the test server first:**
   ```bash
   cd backend
   node test-server.js
   ```

2. **Check the exact error message** and share it

3. **Verify your environment:**
   - Node.js version
   - Operating system
   - MongoDB installation status

4. **Try the simplified approach:**
   - Use MongoDB Atlas (cloud)
   - Or temporarily disable database connection

## ✅ Success Indicators

You'll know everything is working when you see:
- ✅ "MongoDB connected" message
- ✅ "Server running on port 5000" message
- ✅ API test endpoint returns JSON response
- ✅ Frontend can connect to backend (check browser console)
