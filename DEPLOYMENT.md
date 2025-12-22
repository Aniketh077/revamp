# Railway Deployment Guide

## Prerequisites
- Railway account
- MongoDB database (MongoDB Atlas recommended)
- Mailgun account for email functionality

## Environment Variables

### Frontend (.env in project root)
```
VITE_API_URL=https://your-app.railway.app
VITE_CAL_LINK=https://cal.com/me-aniketh/30min
```

### Backend (Set in Railway dashboard)
```
PORT=3001
NODE_ENV=production
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/?appName=Flownetics-inventory
MAILGUN_API_KEY=your-mailgun-api-key
MAILGUN_DOMAIN=your-mailgun-domain.mailgun.org
```

## Deployment Steps

1. **Connect Repository to Railway**
   - Go to Railway dashboard
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your repository

2. **Set Environment Variables**
   - In Railway project settings, add all backend environment variables
   - Make sure `NODE_ENV=production` is set

3. **Configure Build**
   - Railway will automatically detect the build configuration
   - The `nixpacks.toml` file will be used for build process

4. **Deploy**
   - Railway will automatically build and deploy
   - The server will serve both API and static files

## Project Structure
```
project/
├── server/          # Express backend
│   ├── index.js     # Main server file
│   └── package.json
├── src/             # React frontend
├── dist/            # Built frontend (generated)
├── public/           # Static assets
└── package.json     # Frontend dependencies
```

## Notes
- The server serves static files from `dist/` folder in production
- All API routes are prefixed with `/api`
- Blog images are stored in MongoDB GridFS
- Make sure MongoDB connection string is correct

