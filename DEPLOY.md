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

### 2. Deploy on Render

1. Go to https://render.com and sign up/login
2. Click "New +" → "Blueprint"
3. Connect your GitHub repository
4. Render will automatically detect `render.yaml` and create:
   - Backend service (Python/FastAPI)
   - Frontend service (Static site)

### 3. Update Backend URL

After deployment, Render will give you a backend URL like:
`https://golf-trainer-backend.onrender.com`

Update these files with your actual backend URL:
- `frontend/.env.production`
- `frontend/vite.config.js`
- `frontend/src/config.js`

Then commit and push:
```bash
git add .
git commit -m "Update backend URL"
git push
```

Render will auto-redeploy.

### 4. Access Your App

- Frontend: `https://golf-trainer-frontend.onrender.com`
- Backend API: `https://golf-trainer-backend.onrender.com`

### 5. Install on iPhone

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
- Verify API_URL in frontend config files
- Check browser console for errors
