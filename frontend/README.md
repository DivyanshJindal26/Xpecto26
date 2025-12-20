# Xpecto Frontend

Frontend application for Xpecto event management platform.

## Environment Setup

Create a `.env` file in the frontend directory:

```env
REACT_APP_API_URL=http://localhost:5000
```

## Features

- **Google OAuth Authentication**: Secure login with Google accounts
- **Exhibition Management**: Create, view, edit, and delete exhibitions
- **Session Management**: Manage event sessions with scheduling details
- **Protected Routes**: Authentication required for create/edit/delete operations
- **Responsive Design**: Works on desktop and mobile devices

## Installation

```bash
npm install
```

## Running the App

```bash
npm start
```

The app will run on `http://localhost:3000`

## Available Scripts

- `npm start` - Runs the app in development mode
- `npm build` - Builds the app for production
- `npm test` - Runs the test suite

## Testing the API

### Public Endpoints (No Authentication Required)
- View all exhibitions: Navigate to the Exhibitions tab
- View all sessions: Navigate to the Sessions tab

### Protected Endpoints (Authentication Required)
1. Click "Login with Google" button
2. Complete Google OAuth login
3. After successful login, you can:
   - Create new exhibitions/sessions
   - Edit existing exhibitions/sessions
   - Delete exhibitions/sessions

### Testing CRUD Operations

**Create:**
1. Login with Google
2. Click "+ Add Exhibition" or "+ Add Session"
3. Fill in the form
4. Click "Create Exhibition" or "Create Session"

**Read:**
- No authentication required
- View all items in the grid

**Update:**
1. Login with Google
2. Click "Edit" on any card
3. Modify the form
4. Click "Update Exhibition" or "Update Session"

**Delete:**
1. Login with Google
2. Click "Delete" on any card
3. Confirm deletion

## Authentication Flow

1. User clicks "Login with Google"
2. Google OAuth popup opens
3. User selects Google account
4. Backend creates JWT token
5. Token stored in httpOnly cookie
6. User profile displayed in header
7. Protected routes now accessible

## Components

- `XpectoHome.jsx` - Main page with tab navigation
- `ExhibitionManager.jsx` - Exhibition CRUD interface
- `SessionManager.jsx` - Session CRUD interface
- `GoogleLoginButton.jsx` - OAuth login trigger
- `UserProfile.jsx` - User info and logout
- `AuthSuccess.jsx` - OAuth callback handler
- `AuthError.jsx` - OAuth error page

## API Integration

All API calls use the base URL from `.env` file:
- `GET /api/exhibitions` - Fetch all exhibitions
- `POST /api/exhibitions` - Create exhibition (auth required)
- `PUT /api/exhibitions/:id` - Update exhibition (auth required)
- `DELETE /api/exhibitions/:id` - Delete exhibition (auth required)
- `GET /api/sessions` - Fetch all sessions
- `POST /api/sessions` - Create session (auth required)
- `PUT /api/sessions/:id` - Update session (auth required)
- `DELETE /api/sessions/:id` - Delete session (auth required)
