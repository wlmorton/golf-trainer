# Deployment Guide - Render.com

## Prerequisites
1. GitHub account
2. Render.com account (free)

## Steps

### 1. Push to GitHub

```bash
git add .
git commit -m "Add PostgreSQL support for persistent data"
git push origin main
```

### 2. Create PostgreSQL Database on Render

1. Go to https://dashboard.render.com
2. Click **"New +"** → **"PostgreSQL"**
3. Configure:
   - **Name**: golf-trainer-db
   - **Database**: golf_trainer
   - **User**: (auto-generated)
   - **Region**: Same as your backend
   - **Plan**: **Free**
4. Click **"Create Database"**
5. **IMPORTANT**: Copy the **"Internal Database URL"** (starts with `postgres://`)

### 3. Update Backend Service

1. Go to your backend service in Render
2. Click **"Environment"** tab
3. Add environment variable:
   - **Key**: `DATABASE_URL`
   - **Value**: Paste the Internal Database URL from step 2
4. Click **"Save Changes"**
5. Service will auto-redeploy

### 4. Deploy Frontend (if not already deployed)

1. Click "New +" → "Static Site"
2. Connect the same GitHub repository
3. Configure:
   - **Name**: golf-trainer-frontend
   - **Build Command**: `cd frontend && npm install && npm run build`
   - **Publish Directory**: `frontend/dist`
   - **Plan**: Free
4. Click "Create Static Site"

### 5. Update Frontend Config

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

## Why PostgreSQL?

**Problem with SQLite on Render:**
- Free tier services sleep after 15 min of inactivity
- When they wake up, the filesystem can be reset
- **Your data gets deleted** 😱

**PostgreSQL Solution:**
- Separate database service that never sleeps
- Data persists forever (even on free tier)
- Your training data is safe! ✅

## Verify It's Working

1. Complete a drill and save it
2. Wait a few hours (let the service sleep)
3. Come back and check - your data should still be there!

## Local Development

The app automatically uses SQLite when running locally (no DATABASE_URL set), so you don't need PostgreSQL installed on your computer.

## Notes

- **Free tier**: Backend sleeps after 15 min of inactivity (first request takes ~30s to wake)
- **Database**: PostgreSQL free tier = 1GB storage (plenty for training data)
- **Auto-deploy**: Every git push triggers a new deployment
- **Upgrade**: $7/month removes sleep and adds more resources
