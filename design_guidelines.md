# Design Guidelines: Tinder for Cars

## Authentication & User Profile
**No authentication required** - This is a single-user browsing experience with local data persistence.

**Profile Screen Required:**
- User-customizable avatar (generate 3 preset car-themed avatars: sports car silhouette, classic car, SUV)
- Display name field
- App preferences:
  - Preferred car types filter (sedan, SUV, sports, electric, classic)
  - Price range filter
  - Year range filter
  - Swipe sensitivity settings

## Navigation Architecture
**Tab Navigation (3 tabs):**
1. **Browse** (center/core) - Main swipe interface
2. **Favorites** (right) - Liked cars collection  
3. **Profile** (left) - User preferences and filters

Use Feather icons: "search" for Browse, "heart" for Favorites, "user" for Profile

## Screen Specifications

### 1. Browse Screen (Main Tab)
**Purpose:** Swipe through cars with Tinder-style interactions

**Layout:**
- Transparent header with app logo/title centered
- Left button: Filter icon to adjust preferences
- Right button: Info icon for app instructions
- Main content: Full-screen swipeable card stack
- Floating action buttons overlay (bottom center)

**Components:**
- Card stack showing 2-3 cards with depth effect
- Top card displays:
  - Large car image (fills 60% of card)
  - Make & model (bold, large typography)
  - Year and mileage
  - Price (prominent, accent color)
  - Quick specs: transmission, fuel type, condition
- Bottom floating buttons:
  - Dislike button (left, red/coral, X icon)
  - Super like button (center, blue, star icon) 
  - Like button (right, green, heart icon)
- Swipe gestures with visual feedback (card rotation, color overlays)

**Safe Area Insets:**
- Top: headerHeight + Spacing.xl
- Bottom: tabBarHeight + Spacing.xl (for floating buttons)

### 2. Favorites Screen (Tab)
**Purpose:** View all liked cars in a browsable grid

**Layout:**
- Default navigation header with title "Your Matches"
- Right button: Sort/filter icon
- Scrollable grid view (2 columns)

**Components:**
- Car cards in grid layout
- Each card shows:
  - Car thumbnail image
  - Make/model (truncated)
  - Price
  - Small heart icon indicator
- Empty state: "No matches yet! Start swiping to find your dream car"
- Pull-to-refresh functionality

**Safe Area Insets:**
- Top: Spacing.xl (default header is not transparent)
- Bottom: tabBarHeight + Spacing.xl

### 3. Profile Screen (Tab)
**Purpose:** Manage preferences and view app settings

**Layout:**
- Default navigation header with title "Profile"
- Scrollable form layout

**Components:**
- Avatar selection (3 car-themed presets)
- Display name input
- Preference sections:
  - Car type toggles (multi-select chips)
  - Price range slider
  - Year range slider
- App info (version, about)

**Safe Area Insets:**
- Top: Spacing.xl
- Bottom: tabBarHeight + Spacing.xl

### 4. Car Detail Modal (Native Modal)
**Purpose:** View comprehensive car specifications

**Trigger:** Tap on any car card in Browse or Favorites

**Layout:**
- Full-screen modal with close button (top right)
- Scrollable content

**Components:**
- Image carousel (swipeable, 3-5 car photos)
- Detailed specifications list
- Description text
- Action buttons at bottom:
  - If from Browse: Like/Dislike buttons
  - If from Favorites: Remove from favorites, Share

**Safe Area Insets:**
- Top: insets.top + Spacing.xl
- Bottom: insets.bottom + Spacing.xl

## Design System

### Color Palette
**Primary Colors:**
- Brand Red/Coral: #FF6B6B (dislike action)
- Brand Green: #51CF66 (like action)
- Brand Blue: #339AF0 (super like action)
- Background: #FAFAFA (light mode), #1A1A1A (dark mode)

**Accent Colors:**
- Card Background: #FFFFFF (light), #2C2C2C (dark)
- Text Primary: #212529 (light), #F8F9FA (dark)
- Text Secondary: #868E96
- Border/Divider: #E9ECEF (light), #3A3A3A (dark)

### Typography
- **Headings:** SF Pro Display (iOS) / Roboto Bold (Android)
  - H1: 28px, bold
  - H2: 22px, semibold
  - H3: 18px, semibold
- **Body:** SF Pro Text (iOS) / Roboto Regular (Android)
  - Body: 16px, regular
  - Caption: 14px, regular
  - Price: 20px, bold

### Visual Design
- Use Feather icons from @expo/vector-icons for all UI elements
- Floating action buttons (like/dislike) require subtle drop shadows:
  - shadowOffset: {width: 0, height: 2}
  - shadowOpacity: 0.10
  - shadowRadius: 2
- Card shadows for depth:
  - shadowOffset: {width: 0, height: 4}
  - shadowOpacity: 0.12
  - shadowRadius: 8
- All touchable elements have press feedback (opacity: 0.7 or scale: 0.95)
- Swipe animations: cards rotate ±15° and translate based on swipe direction
- Color overlays on swipe: green tint for right swipe, red tint for left swipe

### Critical Assets
**Car Placeholder Images** (12-15 diverse vehicles):
- Sports cars: Ferrari, Porsche, Corvette
- Luxury sedans: Mercedes S-Class, BMW 7 Series
- SUVs: Range Rover, Tesla Model X
- Electric: Tesla Model 3, Rivian R1T
- Classic: '67 Mustang, VW Beetle

**Profile Avatars** (3 presets):
1. Sports car silhouette (sleek, red gradient)
2. Classic car outline (vintage, gold/brown gradient)
3. SUV silhouette (bold, blue gradient)

**App Icon:** Stylized heart with car wheel design

### Accessibility
- Minimum touch target: 44x44pt
- Color contrast ratio 4.5:1 for text
- VoiceOver labels for all interactive elements
- Alternative to swipe gestures via floating buttons
- Haptic feedback on swipe decisions