# Auto-Matcher
# CarSwipe - Car Matching Application

A modern, swipe-based car browsing application built with React Native and Expo. Inspired by dating apps like Tinder, CarSwipe allows users to discover and match with their dream cars through an intuitive swipe interface.

## 📱 Features

### Core Functionality
- **Swipe Interface**: Swipe right to like, left to pass on cars
- **Car Gallery**: Browse through multiple high-quality images per car with horizontal scrolling
- **Car Details**: View comprehensive information including specifications, pricing, and descriptions
- **Favorites System**: Save liked cars to a favorites list
- **User Authentication**: Google Sign-In integration using Firebase Authentication
- **Share Functionality**: Share car images and details with car model and price information
- **User Profiles**: Customizable profiles with statistics and preferences

### Key Highlights
- **Multi-image Support**: Each car has 2-3 images that can be scrolled horizontally
- **Authentication-Required Favorites**: Users must sign in to save favorites
- **User-Specific Data**: Favorites are stored per user and restored upon login
- **Cross-Platform**: Works on Web, iOS, and Android
- **Modern UI/UX**: Smooth animations, haptic feedback, and intuitive gestures

## 🛠️ Technology Stack

### Frontend Framework
- **React Native** (0.81.5) - Cross-platform mobile framework
- **Expo** (^54.0.23) - Development platform and toolchain
- **React** (19.1.0) - UI library
- **TypeScript** - Type-safe development

### Navigation & Routing
- **React Navigation** - Native stack and bottom tab navigation
  - `@react-navigation/native` (^7.1.8)
  - `@react-navigation/native-stack` (^7.3.16)
  - `@react-navigation/bottom-tabs` (^7.4.0)

### UI & Styling
- **React Native Reanimated** (^4.1.1) - Smooth animations
- **React Native Gesture Handler** (^2.28.0) - Gesture recognition
- **Expo Image** (^3.0.10) - Optimized image loading
- **Expo Vector Icons** (^15.0.2) - Icon library (Feather icons)

### Authentication & Backend
- **Firebase** (^12.7.0) - Authentication and analytics
  - Firebase Authentication (Google Sign-In)
  - Firebase Analytics
- **Expo Secure Store** (^15.0.8) - Secure local storage for mobile
- **Expo Auth Session** (^7.0.10) - OAuth session management

### Data Management
- **TanStack React Query** (^5.90.7) - Server state management
- **Drizzle ORM** (^0.39.3) - Type-safe ORM
- **Zod** (^3.24.2) - Schema validation

### Sharing & Media
- **html2canvas** (^1.4.1) - Web screenshot capture
- **react-native-view-shot** (^4.0.3) - Mobile screenshot capture
- **React Native Share API** - Native sharing functionality

### Development Tools
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **TypeScript** - Static type checking

## 🏗️ Project Structure

```
Auto-Matcher 2/
├── client/                 # Frontend application
│   ├── components/        # Reusable UI components
│   ├── screens/           # Screen components
│   ├── hooks/             # Custom React hooks
│   ├── navigation/        # Navigation configuration
│   ├── data/              # Static data (cars)
│   ├── lib/               # Utilities (Firebase, query client)
│   └── constants/         # Theme and styling constants
├── server/                # Backend server (Express)
├── assets/                # Images and static assets
│   └── images/
│       └── cars/          # Car images organized by model
├── shared/                # Shared types and schemas
└── scripts/              # Build scripts
```

## 🚀 Development Process

### Phase 1: Initial Setup & Core Features
1. **Project Initialization**
   - Set up Expo project with TypeScript
   - Configure navigation (Stack + Bottom Tabs)
   - Implement theme system with light/dark mode support

2. **Swipe Interface**
   - Implement card swipe gestures using Reanimated
   - Add like/dislike animations with overlays
   - Create action buttons for manual interactions

3. **Car Data & Display**
   - Create car data structure with specifications
   - Implement SwipeCard component
   - Add car detail modal with comprehensive information

### Phase 2: Image Gallery & Enhancements
1. **Multi-Image Support**
   - Migrate from single `imageUrl` to `imageUrls` array
   - Implement horizontal scrolling gallery with FlatList
   - Add pagination dots indicator
   - Support multiple image formats (JPG, AVIF, WebP)

2. **UI Refinements**
   - Optimize card sizing for 100% browser zoom
   - Adjust image positioning and aspect ratios
   - Improve responsive layout for different screen sizes

### Phase 3: Authentication & User Management
1. **Firebase Integration**
   - Set up Firebase project and configuration
   - Implement Firebase Authentication
   - Create Google Sign-In flow with popup authentication

2. **User-Specific Favorites**
   - Implement per-user favorites storage
   - Add authentication requirement for favorites
   - Create favorites restoration on login
   - Clear favorites on logout

### Phase 4: Sharing & Additional Features
1. **Share Functionality**
   - Implement image capture using html2canvas (web)
   - Add react-native-view-shot for mobile
   - Create share content with car image, model, and price
   - Support Web Share API and native sharing

2. **Profile Screen**
   - Add user statistics (viewed, liked, match rate)
   - Implement car type preferences
   - Create Google Sign-In/Sign-Out buttons

## 📦 Installation & Setup

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- Expo CLI (optional, for development)

### Installation Steps

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd "Auto-Matcher 2"
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Firebase**
   - Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
   - Enable Google Authentication in Firebase Console
   - Copy your Firebase configuration
   - Update `client/lib/firebase.ts` with your Firebase config

4. **Set up environment variables** (optional)
   Create a `.env` file in the root directory:
   ```env
   EXPO_PUBLIC_GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
   ```

5. **Start the development server**
   ```bash
   npm run expo:dev
   # or
   npx expo start --localhost
   ```

### Firebase Setup
See [GOOGLE_AUTH_SETUP.md](./GOOGLE_AUTH_SETUP.md) for detailed Firebase configuration instructions.

## 🎯 Usage

### For Users
1. **Browse Cars**: Swipe through cars on the Browse screen
2. **View Details**: Tap on a car card to see full details and image gallery
3. **Like Cars**: Swipe right or tap the heart button to add to favorites
4. **Sign In**: Go to Profile screen to sign in with Google
5. **Manage Favorites**: View all liked cars in the Favorites tab
6. **Share Cars**: Use the Share button in car details to share with others

### For Developers
- **Development**: `npm run expo:dev`
- **Linting**: `npm run lint`
- **Type Checking**: `npm run check:types`
- **Formatting**: `npm run format`

## 🔧 Key Implementation Details

### Authentication Flow
- Uses Firebase Authentication for Google Sign-In
- Web: Popup-based authentication
- Mobile: Demo mode (full Firebase Auth setup required)
- User state persists across sessions

### Favorites Management
- **Storage**: User-specific favorites stored in localStorage (web) or SecureStore (mobile)
- **Key Format**: `favorites_{userId}`
- **Authentication Required**: Users must be logged in to add favorites
- **Auto-Restore**: Favorites automatically restored when user logs in
- **Auto-Clear**: Favorites cleared when user logs out

### Image Handling
- Supports multiple image formats (JPG, AVIF, WebP)
- Images loaded using `expo-image` for optimal performance
- Horizontal scrolling gallery with pagination
- Active image indicator with dots

### Sharing Implementation
- **Web**: Uses html2canvas to capture car images, Web Share API for sharing
- **Mobile**: Uses react-native-view-shot for screenshots, native Share API
- **Content**: Includes car image, model name, and price
- **Fallback**: Text-only sharing if image capture fails

## 🎨 Design Decisions

### UI/UX
- **Swipe Interface**: Familiar interaction pattern from dating apps
- **Card-Based Design**: Clean, modern card layout
- **Smooth Animations**: Reanimated for 60fps animations
- **Haptic Feedback**: Enhanced user experience on mobile devices
- **Responsive Layout**: Adapts to different screen sizes

### State Management
- **Local State**: React hooks for component-level state
- **Global State**: Custom hooks (useFavorites, useGoogleAuth) with global listeners
- **Server State**: TanStack React Query for API data (if needed)

### Performance Optimizations
- **Image Optimization**: Expo Image with caching
- **Lazy Loading**: Images loaded on demand
- **Memoization**: useCallback and useMemo for expensive operations
- **Code Splitting**: Modular component structure

## 🐛 Known Issues & Limitations

1. **Mobile Firebase Auth**: Currently uses demo mode on mobile; full Firebase Auth setup required
2. **Image Sharing**: Some browsers may not support Web Share API with files
3. **Offline Support**: Limited offline functionality
4. **Image Loading**: Large images may take time to load on slow connections

## 🔮 Future Improvements

### High Priority
1. **Backend Integration**
   - Connect to real car database API
   - Implement server-side favorites storage
   - Add car search and filtering

2. **Enhanced Authentication**
   - Complete Firebase Auth mobile setup
   - Add email/password authentication
   - Implement social media logins (Facebook, Apple)

3. **Performance**
   - Implement image lazy loading
   - Add pagination for car listings
   - Optimize bundle size

### Medium Priority
4. **Features**
   - Car comparison functionality
   - Advanced filtering (price range, year, fuel type)
   - Car recommendations based on preferences
   - Save search criteria

5. **User Experience**
   - Push notifications for new matches
   - In-app messaging with dealers
   - Car history tracking
   - Export favorites list

6. **Analytics**
   - User behavior tracking
   - Popular cars analytics
   - Conversion tracking

### Low Priority
7. **Additional Platforms**
   - Desktop web application
   - Progressive Web App (PWA) support
   - Apple Watch companion app

8. **Advanced Features**
   - AR car preview
   - Virtual test drive
   - Integration with car dealerships
   - Financing calculator

## 📝 Code Quality

### Best Practices Implemented
- TypeScript for type safety
- Component-based architecture
- Custom hooks for reusable logic
- Consistent naming conventions
- Error boundaries for error handling
- Responsive design principles

### Areas for Improvement
- **Testing**: Add unit tests and integration tests
- **Documentation**: Expand inline code documentation
- **Error Handling**: More comprehensive error messages
- **Accessibility**: Improve screen reader support
- **Internationalization**: Add multi-language support

## 🤝 Contributing

This is a personal project, but suggestions and feedback are welcome!

## 📄 License

This project is private and not licensed for public use.

## 🙏 Acknowledgments

- **Expo Team** - For the excellent development platform
- **React Navigation** - For robust navigation solutions
- **Firebase** - For authentication and backend services
- **React Native Community** - For amazing libraries and tools

## 📞 Contact

For questions or suggestions, please open an issue in the repository.

---

**Version**: 1.0.0  
**Last Updated**: 2024  
**Status**: Active Development
