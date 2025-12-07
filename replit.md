# CarSwipe - Tinder for Cars

## Overview

CarSwipe is a mobile application built with React Native and Expo that provides a Tinder-style swipe interface for browsing cars. Users can swipe through car listings, save favorites, and customize their browsing preferences. The app features a single-user experience with local data persistence, gesture-based interactions, and a clean, modern UI with light/dark mode support.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework & Platform**
- React Native with Expo SDK 54
- New Architecture enabled with React Compiler experiments
- Cross-platform support for iOS, Android, and Web
- React 19.1 with modern concurrent features

**Navigation Structure**
- Bottom tab navigation with three main tabs (Profile, Browse, Favorites)
- Native stack navigation for modal presentations
- Gesture-based navigation with custom swipe interactions

**UI Component Library**
- Custom themed components system (ThemedView, ThemedText, Card)
- Consistent design tokens (spacing, colors, typography, border radius)
- Reanimated 4.x for performant animations
- Gesture Handler for touch interactions
- Expo Image for optimized image loading
- Vector Icons (Feather) for consistent iconography

**State Management**
- TanStack React Query for server state
- Custom hooks for local state (useFavorites with global state pattern)
- Shared values (react-native-reanimated) for animation state

**Theming System**
- Light/dark mode support via useColorScheme hook
- Centralized theme configuration in constants/theme.ts
- Dynamic color adaptation based on system preferences
- Separate web hydration handling for SSR compatibility

**Key Features**
- Swipeable card stack with threshold-based actions
- Haptic feedback on interactions
- Pull-to-refresh and gesture animations
- Safe area handling for notched devices
- Keyboard-aware scroll views with platform-specific fallbacks

### Backend Architecture

**Server Framework**
- Express.js with TypeScript
- HTTP proxy middleware for development
- WebSocket support via ws library
- CORS configuration for Replit domain integration

**Data Layer**
- Drizzle ORM with PostgreSQL dialect
- In-memory storage fallback (MemStorage class)
- Zod schema validation
- Type-safe database operations

**API Structure**
- RESTful endpoints under /api prefix
- JSON request/response format
- Credential-based authentication support
- Error handling with status code responses

**Build System**
- tsx for development with hot reload
- esbuild for production bundling
- Separate Expo and server build processes
- Static export support for Expo web builds

### External Dependencies

**Development Platform**
- Replit hosting with environment-based configuration
- Dynamic domain resolution (REPLIT_DEV_DOMAIN, REPLIT_INTERNAL_APP_DOMAIN)
- Proxy URL configuration for Expo packager

**Database**
- PostgreSQL (configured via DATABASE_URL)
- Drizzle Kit for migrations
- Schema-first design with TypeScript types

**Third-Party Services**
- Expo services (fonts, splash screen, web browser, haptics, blur, image)
- Unsplash for car imagery (static URLs in mock data)

**Build & Development Tools**
- Babel with module resolver for path aliases (@, @shared)
- ESLint with Expo config and Prettier
- TypeScript with strict mode
- Drizzle Kit for database management

**Key Packages**
- react-native-gesture-handler: Touch and gesture system
- react-native-reanimated: Animation library
- react-native-safe-area-context: Safe area handling
- react-native-keyboard-controller: Keyboard management
- @tanstack/react-query: Server state management
- expo-image: Optimized image component