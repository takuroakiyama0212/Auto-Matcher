# Google Authentication Setup Guide

This guide explains how to enable actual Google login functionality in the CarSwipe application.

## Step 1: Create a Project in Google Cloud Console

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing project
3. Enter a project name (e.g., "CarSwipe") and click "Create"

## Step 2: Configure OAuth Consent Screen

1. From the left menu, select **APIs & Services** → **OAuth consent screen**
2. Choose the user type:
   - **External**: For apps used by general users
   - **Internal**: For use only within Google Workspace (usually select "External")
3. Enter app information:
   - **App name**: CarSwipe (or any name you prefer)
   - **User support email**: Your email address
   - **App logo**: Optional
   - **App home page**: `http://localhost:8081` (for development environment)
   - **Privacy policy link**: Optional
   - **Terms of service link**: Optional
4. **Add scopes**:
   - Click "Add or remove scopes"
   - Add the following scopes:
     - `openid`
     - `https://www.googleapis.com/auth/userinfo.profile`
     - `https://www.googleapis.com/auth/userinfo.email`
5. **Add test users** (for development):
   - Add email addresses of Google accounts you want to use as test users
6. Click "Save and continue" to complete

## Step 3: Create OAuth 2.0 Client ID

1. From the left menu, select **APIs & Services** → **Credentials**
2. Click **+ Create Credentials** → **OAuth 2.0 Client ID** at the top of the page
3. Select **Application type**:
   - **Web application** (for web environment)
4. Enter a **name** (e.g., "CarSwipe Web Client")
5. **Add authorized redirect URIs**:
   - For web environment:
     - `http://localhost:8081/auth`
     - `http://localhost:8081`
   - For production environment, add your actual domain:
     - `https://yourdomain.com/auth`
     - `https://yourdomain.com`
6. Click "Create"
7. The **Client ID** will be displayed - copy and save it

## Step 4: Set Environment Variables

1. Create a `.env` file in the project root (copy from `.env.example` if available)
2. Set it up as follows:

```env
EXPO_PUBLIC_GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
```

**Example:**
```env
EXPO_PUBLIC_GOOGLE_CLIENT_ID=123456789-abcdefghijklmnop.apps.googleusercontent.com
```

## Step 5: Restart the Application

After changing environment variables, you need to restart the development server:

```bash
# Stop the development server (Ctrl+C)
# Then restart
npm run expo:dev
# or
npx expo start --localhost
```

## Step 6: Verify the Setup

1. Open the app in your browser (`http://localhost:8081`)
2. Navigate to the Profile screen
3. Click the "Sign in with Google" button
4. Select a Google account to log in
5. After logging in, verify that your username and email address are displayed on the Profile screen

## Troubleshooting

### Error: "redirect_uri_mismatch"
- Verify that the redirect URI set in Google Cloud Console matches the URI used in the app
- For web environment, ensure `http://localhost:8081/auth` is correctly configured

### Error: "access_denied"
- Verify that you are logging in with an account added as a test user in the OAuth consent screen
- If the app is in "Testing" status, only test users can log in

### Error: "invalid_client"
- Verify that `EXPO_PUBLIC_GOOGLE_CLIENT_ID` in the `.env` file is correctly set
- Check that there are no extra spaces or line breaks in the client ID
- Verify that you have restarted the development server

### Moving to Production Environment

1. Change the OAuth consent screen to "Published" (for production environment)
2. Add your production domain to the authorized redirect URIs
3. If needed, also create a client ID for mobile applications

## Firebase Integration

This app uses Firebase Authentication for Google Sign-In. Make sure you have:

1. **Firebase Project**: Created at [Firebase Console](https://console.firebase.google.com/)
2. **Google Sign-In Enabled**: In Firebase Console → Authentication → Sign-in method
3. **Firebase Config**: Updated in `client/lib/firebase.ts`

The Firebase configuration should include:
- `apiKey`
- `authDomain`
- `projectId`
- `storageBucket`
- `messagingSenderId`
- `appId`
- `measurementId`

## Reference Links

- [Google OAuth 2.0 Documentation](https://developers.google.com/identity/protocols/oauth2)
- [Firebase Authentication Documentation](https://firebase.google.com/docs/auth)
- [Expo AuthSession Documentation](https://docs.expo.dev/guides/authentication/#google)

---

**Note**: For mobile platforms, additional setup may be required. The current implementation uses Firebase Authentication which works seamlessly on web. For native mobile apps, you may need to configure additional OAuth client IDs for iOS and Android platforms.
