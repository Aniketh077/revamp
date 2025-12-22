# Flownetics Website

A modern, full-stack web application for Flownetics Engineering, featuring continuous flow chemistry solutions, ROI calculator, blog management, and admin dashboard.

## Tech Stack

- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS
- **Backend**: Node.js, Express.js
- **Database**: MongoDB (with GridFS for image storage)
- **Email**: Mailgun
- **Deployment**: Railway

## Features

- 🧮 ROI Calculator with comprehensive financial analysis
- 📝 Blog management system with image uploads
- 📧 Contact form and newsletter subscription
- 👥 Admin dashboard for managing submissions
- 📊 Interactive charts and visualizations
- 📅 Cal.com integration for consultations
- 🎨 Modern, responsive UI with brand colors

## Getting Started

### Prerequisites

- Node.js 18+ 
- MongoDB database (MongoDB Atlas recommended)
- Mailgun account for email functionality

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   cd server && npm install && cd ..
   ```

3. Set up environment variables:
   - Create `.env` in project root for frontend
   - Create `server/.env` for backend (see DEPLOYMENT.md)

4. Run development server:
   ```bash
   # Terminal 1 - Frontend
   npm run dev
   
   # Terminal 2 - Backend
   cd server && npm run dev
   ```

## Project Structure

```
project/
├── server/              # Express backend
│   ├── index.js        # Main server file
│   └── package.json
├── src/                 # React frontend
│   ├── components/     # React components
│   ├── lib/            # API client
│   └── hooks/          # Custom hooks
├── public/              # Static assets
└── dist/               # Build output (generated)
```

## Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for Railway deployment instructions.

## Environment Variables

### Frontend (.env)
- `VITE_API_URL` - Backend API URL
- `VITE_CAL_LINK` - Cal.com booking link

### Backend (server/.env)
- `PORT` - Server port (default: 3001)
- `NODE_ENV` - Environment (production/development)
- `MONGODB_URI` - MongoDB connection string
- `MAILGUN_API_KEY` - Mailgun API key
- `MAILGUN_DOMAIN` - Mailgun domain

## Admin Access

- URL: `/admin`
- Username: `flownetics`
- Password: `Flow@AV_2025`

## License

Copyright © 2024 Flownetics Engineering Private Limited. All rights reserved.

