# Google OAuth2 Setup for Xpecto

## Backend Setup

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Get Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable Google+ API
4. Go to "Credentials" → "Create Credentials" → "OAuth 2.0 Client ID"
5. Configure OAuth consent screen if not already done
6. For Application type, select "Web application"
7. Add authorized redirect URIs:
   - `http://localhost:5000/api/auth/google/callback`
   - Add production URL when deploying
8. Copy the Client ID and Client Secret

### 3. Configure Environment Variables

Create a `.env` file in the backend directory:

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/xpecto

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here
GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback

# JWT
JWT_SECRET=your_random_secret_key_here
SESSION_SECRET=your_random_session_secret_here

# Frontend URL
FRONTEND_URL=http://localhost:3000
```

### 4. Start MongoDB
Make sure MongoDB is running locally or update `MONGODB_URI` with your MongoDB connection string.

### 5. Start Backend Server
```bash
npm run dev
```

## Frontend Setup

### 1. Install Dependencies
```bash
cd frontend
npm install
```

### 2. Configure Environment Variables

Create a `.env` file in the frontend directory:

```env
REACT_APP_API_URL=http://localhost:5000
```

### 3. Start Frontend
```bash
npm start
```

## Testing the OAuth Flow

1. Make sure both backend and frontend servers are running
2. Open `http://localhost:3000` in your browser
3. Click the "Sign in with Google" button in the navigation
4. A popup window will open with Google login
5. Select your Google account
6. After successful authentication, the popup closes and you'll be logged in
7. Your profile picture and name will appear in the navigation

## How It Works

### Backend Flow:
1. User clicks "Sign in with Google" button
2. Frontend opens popup to `http://localhost:5000/api/auth/google`
3. User authenticates with Google
4. Google redirects to callback URL with auth code
5. Backend exchanges code for user profile
6. Backend creates/finds user in database
7. Backend generates JWT token
8. Backend redirects to frontend success page with token

### Frontend Flow:
1. Success page receives token from URL
2. Posts message to parent window with token
3. Parent window stores token in localStorage
4. Popup closes automatically
5. Page reloads to update authentication state
6. AuthContext fetches user data with token

## API Endpoints

- `GET /api/auth/google` - Initiates Google OAuth
- `GET /api/auth/google/callback` - Google OAuth callback
- `GET /api/auth/me` - Get current user (requires auth)
- `POST /api/auth/logout` - Logout user

## Security Notes

- Never commit `.env` files to version control
- Use strong, random values for JWT_SECRET and SESSION_SECRET
- In production, set `NODE_ENV=production`
- Update CORS settings for production domains
- Use HTTPS in production
- Set secure cookie flags in production
