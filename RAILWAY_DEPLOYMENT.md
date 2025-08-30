# Railway Deployment Guide for Socket.IO Backend

## Why Railway?
- ✅ Supports WebSocket connections (required for Socket.IO)
- ✅ Persistent server instances
- ✅ Easy deployment from GitHub
- ✅ Free tier available

## Step 1: Deploy Backend to Railway

1. **Sign up at Railway**: https://railway.app
2. **Connect GitHub**: Link your GitHub account
3. **Create New Project**: 
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your repository
   - Select the `backend` folder as root directory

4. **Environment Variables** (Add in Railway dashboard):
   ```
   NODE_ENV=production
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   PORT=5000
   ```

5. **Deploy**: Railway will automatically deploy your backend

## Step 2: Update Frontend Environment

After deployment, Railway will provide a URL like: `https://your-app-name.railway.app`

Update your `.env.production`:
```
VITE_API_URL=https://your-app-name.railway.app/api
VITE_SOCKET_URL=https://your-app-name.railway.app
```

## Step 3: Update CORS Settings

The backend will automatically allow your Netlify frontend URL in CORS settings.

## Alternative: Render.com
If Railway doesn't work, try Render.com (also supports WebSockets):
1. Sign up at https://render.com
2. Create "Web Service" from GitHub
3. Set build command: `npm install`
4. Set start command: `node index.js`
5. Add environment variables

## Testing
1. Deploy backend to Railway/Render
2. Update frontend environment variables
3. Redeploy frontend to Netlify
4. Test WebSocket connection
