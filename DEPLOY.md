# Deployment Guide - Render.com

## Prerequisites
1. GitHub account
2. Render.com account (free)

## Steps

### 1. Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin YOUR_GITHUB_REPO_URL
git push -u origin main
```

### 2. Deploy Backend on Render

1. Go to https://render.com and sign up/login
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Configure:
   - **Name**: golf-trainer-backend
   - **Runtime**: Python 3
   - **Build Command**: `pip install -r backend/requirements.txt`
   - **Start Command**: `cd backend && uvicorn main:app --host 0.0.0.0 --port $PORT`
   - **Plan**: Free
5. Click "Create Web Service"
6. **Copy the backend URL** (e.g., `https://golf-trainer-backend.onrender.com`)

### 3. Deploy Frontend on Render

1. Click "New +" → "Static Site"
2. Connect the same GitHub repository
3. Configure:
   - **Name**: golf-trainer-frontend
   - **Build Command**: `cd frontend && npm install && npm run build`
   - **Publish Directory**: `frontend/dist`
   - **Plan**: Free
4. **Before creating**, add Environment Variable:
   - Key: `VITE_API_URL`
   - Value: Your backend URL from step 2
5. Click "Create Static Site"

### 4. Update Frontend Config (Important!)

Update `frontend/src/config.js` with your actual backend URL:

```javascript
const API_URL = import.meta.env.PROD 
  ? 'https://YOUR-ACTUAL-BACKEND-URL.onrender.com'
  : '/api'

export default API_URL
```

Then commit and push:
```bash
git add .
git commit -m "Update backend URL"
git push
```

Render will auto-redeploy the frontend.

### 5. Access Your App

- Frontend: `https://golf-trainer-frontend.onrender.com`
- Backend API: `https://golf-trainer-backend.onrender.com`

### 6. Install on iPhone

1. Open Safari on iPhone
2. Navigate to your frontend URL
3. Tap Share button
4. Select "Add to Home Screen"
5. Tap "Add"

## Notes

- **Free tier**: Backend sleeps after 15 min of inactivity (first request takes ~30s to wake)
- **Database**: SQLite persists on Render's disk (backed up automatically)
- **Auto-deploy**: Every git push triggers a new deployment
- **Upgrade**: $7/month removes sleep and adds more resources

## Troubleshooting

If backend doesn't start:
- Check Render logs in dashboard
- Verify `requirements.txt` has all dependencies
- Ensure Python version is 3.11+

If frontend can't reach backend:
- Check CORS settings in `backend/main.py`
- Verify API_URL in `frontend/src/config.js`
- Check browser console for errors
- Make sure backend URL doesn't have trailing slash
