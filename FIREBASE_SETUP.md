# Firebase Setup Guide

## Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project" or "Add project"
3. Enter project name: `realtime-bidding-a07c4`
4. Follow the setup wizard

## Step 2: Enable Authentication

1. In Firebase Console, go to "Authentication"
2. Click "Get started"
3. Go to "Sign-in method" tab
4. Enable "Email/Password" provider
5. Save

## Step 3: Enable Firestore Database

1. In Firebase Console, go to "Firestore Database"
2. Click "Create database"
3. Choose "Start in test mode" (for development)
4. Select a location (choose closest to your users)
5. Click "Done"

## Step 4: Get Web App Configuration

1. In Firebase Console, go to "Project settings" (gear icon)
2. Scroll down to "Your apps" section
3. Click "Add app" and select "Web"
4. Register app with name: "Realtime Bidding Web"
5. Copy the configuration object

## Step 5: Update Configuration

Replace the configuration in `frontend/src/lib/firebase.js` with your actual values:

```javascript
const firebaseConfig = {
  apiKey: "your-actual-api-key",
  authDomain: "realtime-bidding-a07c4.firebaseapp.com",
  projectId: "realtime-bidding-a07c4",
  storageBucket: "realtime-bidding-a07c4.appspot.com",
  messagingSenderId: "your-actual-sender-id",
  appId: "your-actual-app-id",
};
```

## Step 6: Set Firestore Rules

In Firebase Console, go to Firestore Database > Rules and set:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    match /auctions/{auctionId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    match /bids/{bidId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

## Step 7: Environment Variables

Update `frontend/.env` with your actual Firebase config values.

## Step 8: Test the Setup

1. Start the frontend: `cd frontend && npm run dev`
2. Try to register a new user
3. Check Firebase Console to see if user was created
4. Try to login with the created user
