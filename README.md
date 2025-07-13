# Realtime Bidding Platform

A modern real-time bidding platform built with React, Firebase, and Node.js. Users can create auctions, place bids, and track their bidding activity in real-time.

## Features

- 🔐 **User Authentication** - Secure login/register with Firebase Auth
- 🏷️ **Auction Management** - Create, edit, and manage auctions
- 💰 **Real-time Bidding** - Place bids and see updates in real-time
- 📊 **Dashboard** - Track your auctions, bids, and won items
- 🎨 **Modern UI** - Beautiful, responsive design with Tailwind CSS
- 📱 **Mobile Responsive** - Works perfectly on all devices

## Tech Stack

### Frontend

- **React 18** - Modern React with hooks
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **React Router** - Client-side routing
- **Firebase** - Authentication and real-time database

### Backend

- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **Firebase Admin** - Server-side Firebase integration
- **Cloudinary** - Image upload and storage

## Quick Start

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Firebase account

### 1. Clone the Repository

```bash
git clone <repository-url>
cd realtime_bidding
```

### 2. Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or use existing one
3. Enable Authentication (Email/Password)
4. Create Firestore Database
5. Get your Firebase config from Project Settings

### 3. Frontend Setup

```bash
cd frontend
npm install
```

Create `.env` file in the frontend directory:

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_API_BASE_URL=http://localhost:5000
```

Update `frontend/src/lib/firebase.js` with your Firebase config.

### 4. Backend Setup

```bash
cd backend
npm install
```

Create `.env` file in the backend directory:

```env
PORT=5000
FIREBASE_PROJECT_ID=your_project_id
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_key
CLOUDINARY_API_SECRET=your_cloudinary_secret
```

### 5. Start Development Servers

**Frontend:**

```bash
cd frontend
npm run dev
```

**Backend:**

```bash
cd backend
npm start
```

The application will be available at:

- Frontend: http://localhost:5173
- Backend: http://localhost:5000

## Project Structure

```
realtime_bidding/
├── frontend/                 # React frontend
│   ├── src/
│   │   ├── components/      # Reusable components
│   │   ├── Pages/          # Page components
│   │   ├── lib/            # Firebase config & auth
│   │   ├── services/       # API services
│   │   └── assets/         # Static assets
│   ├── public/             # Public assets
│   └── package.json
├── backend/                 # Node.js backend
│   ├── src/
│   │   ├── controllers/    # Route controllers
│   │   ├── middleware/     # Custom middleware
│   │   ├── routes/         # API routes
│   │   └── services/       # Business logic
│   └── package.json
└── README.md
```

## Key Features

### Authentication

- User registration and login
- Protected routes
- User profile management
- Secure token-based authentication

### Auction Management

- Create new auctions with images
- Set starting price and end date
- Real-time bid tracking
- Auction status management

### Bidding System

- Real-time bid placement
- Automatic bid validation
- Bid history tracking
- Winner determination

### Dashboard

- Personal auction overview
- Bid history
- Won auctions tracking
- Statistics and analytics

## API Endpoints

### Authentication

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile

### Auctions

- `GET /api/auctions` - Get all auctions
- `POST /api/auctions` - Create new auction
- `GET /api/auctions/:id` - Get auction details
- `PUT /api/auctions/:id` - Update auction
- `DELETE /api/auctions/:id` - Delete auction

### Bids

- `POST /api/auctions/:id/bid` - Place a bid
- `GET /api/auctions/:id/bids` - Get auction bids

## Environment Variables

### Frontend (.env)

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_API_BASE_URL=http://localhost:5000
```

### Backend (.env)

```env
PORT=5000
FIREBASE_PROJECT_ID=your_project_id
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_key
CLOUDINARY_API_SECRET=your_cloudinary_secret
```

## Deployment

### Frontend (Vercel/Netlify)

1. Build the project: `npm run build`
2. Deploy the `dist` folder
3. Set environment variables in your hosting platform

### Backend (Heroku/Railway)

1. Set environment variables
2. Deploy using Git or CLI
3. Ensure Firebase service account is configured

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support, email support@realtimebidding.com or create an issue in the repository.
