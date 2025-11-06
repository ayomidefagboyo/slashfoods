# Slash Foods 🍲

**Too Good To Go for Nigeria** - Save Food. Save Money.

Slash Foods is a mobile app that connects users with restaurants offering surprise packs of delicious leftover food at amazing discounted prices (₦500-₦1,000). Help reduce food waste while enjoying quality meals!

## Features

### User Features ✨
- 🔐 User authentication (sign up/login)
- 🏠 Browse available food packs from local restaurants
- 🔍 Search and filter by location (Lekki, VI, Ikeja, etc.)
- 📦 View detailed information about surprise packs
- 💰 Reserve packs at 50-70% discount
- 📱 Unique pickup codes for order verification
- 📋 Order history and tracking
- 👤 User profile management

### Business Model 💼
- **Target Areas**: Lekki, VI, Ikeja, Yaba, Surulere (Lagos)
- **Price Range**: ₦500 - ₦1,000 per surprise pack
- **Pickup Window**: 7:00 PM - 9:00 PM
- **Commission**: ₦200-₦300 per pack
- **Potential Revenue**: ₦1.5M/month (20 restaurants × 10 packs/day)

## Tech Stack

- **Frontend**: React Native (Expo) + TypeScript
- **Backend**: Supabase (PostgreSQL + Auth + Real-time)
- **Navigation**: React Navigation (Stack + Bottom Tabs)
- **UI Library**: React Native Paper
- **State Management**: React Hooks

## Prerequisites

Before you begin, ensure you have:
- Node.js (v18 or higher)
- npm or yarn
- Expo CLI (`npm install -g expo-cli`)
- A Supabase account (free tier works!)

## Installation

### 1. Clone the Repository

```bash
git clone <repository-url>
cd slashfoods
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Supabase

#### a) Create a Supabase Project
1. Go to [Supabase](https://supabase.com)
2. Sign up or log in
3. Click "New Project"
4. Fill in project details and wait for setup to complete

#### b) Run Database Schema
1. Go to your Supabase project dashboard
2. Click on "SQL Editor" in the left sidebar
3. Open the `supabase-schema.sql` file from this project
4. Copy and paste the entire SQL content into the SQL Editor
5. Click "Run" to create all tables and policies

#### c) Get Your API Credentials
1. Go to Project Settings → API
2. Copy your:
   - Project URL (e.g., `https://xxxxx.supabase.co`)
   - `anon` public key

### 4. Configure Environment Variables

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Edit `.env` and add your Supabase credentials:

```env
EXPO_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
```

### 5. Run the App

```bash
# Start the development server
npm start

# Run on Android
npm run android

# Run on iOS (Mac only)
npm run ios

# Run on web
npm run web
```

## Project Structure

```
slashfoods/
├── src/
│   ├── components/          # Reusable components
│   │   └── FoodPackCard.tsx
│   ├── config/             # Configuration files
│   │   └── supabase.ts     # Supabase client setup
│   ├── navigation/         # Navigation setup
│   │   └── AppNavigator.tsx
│   ├── screens/            # App screens
│   │   ├── WelcomeScreen.tsx
│   │   ├── LoginScreen.tsx
│   │   ├── SignUpScreen.tsx
│   │   ├── HomeScreen.tsx
│   │   ├── FoodPackDetailsScreen.tsx
│   │   ├── OrdersScreen.tsx
│   │   └── ProfileScreen.tsx
│   ├── services/           # API services
│   │   ├── auth.ts
│   │   └── foodPacks.ts
│   ├── types/              # TypeScript types
│   │   └── index.ts
│   └── utils/              # Utility functions
│       └── currency.ts
├── App.tsx                 # App entry point
├── package.json
└── README.md
```

## Database Schema

### Tables

1. **users** - User profiles
2. **restaurants** - Restaurant information
3. **food_packs** - Available food packs
4. **orders** - User orders

### Key Features
- Row Level Security (RLS) enabled
- User authentication via Supabase Auth
- Real-time data synchronization
- Automatic quantity management

## Sample Data

The `supabase-schema.sql` includes sample restaurants. To add sample food packs:

1. Go to Supabase SQL Editor
2. Get restaurant IDs from the restaurants table
3. Uncomment and run the sample food packs INSERT statement (update the dates)

Or add them manually via the Supabase Table Editor.

## Usage

### For Users

1. **Sign Up**: Create an account with email and password
2. **Browse**: View available food packs on the home screen
3. **Search**: Filter by restaurant name or location
4. **Reserve**: Select a pack and confirm your reservation
5. **Pickup**: Use your unique pickup code at the restaurant

### For Restaurant Partners (Coming Soon)

Restaurant dashboard to:
- Add daily food packs
- Manage inventory
- Verify pickup codes
- Track sales

## Roadmap

- [ ] Payment integration (Paystack/Flutterwave)
- [ ] Restaurant dashboard/portal
- [ ] Push notifications
- [ ] In-app messaging
- [ ] Rating and reviews
- [ ] Referral program
- [ ] Analytics dashboard
- [ ] Multiple payment methods
- [ ] iOS App Store release
- [ ] Google Play Store release

## Business Launch Plan

### Phase 1: Validation (Month 1-2)
- Partner with 20-30 restaurants in Lekki/VI/Ikeja
- Launch on Instagram for marketing
- Manual operations and order management
- Cost: ₦200K-₦400K

### Phase 2: App Launch (Month 3)
- Release mobile app
- Automate order processing
- Expand to 50+ restaurants

### Phase 3: Scale (Month 4+)
- Expand to other Lagos areas
- Add restaurant self-service portal
- Implement payment processing
- Target: ₦1.5M+ monthly revenue

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License.

## Support

For questions or support, please contact:
- Email: support@slashfoods.ng
- Instagram: @slashfoods

## Acknowledgments

Inspired by Too Good To Go - the world's leading food waste reduction app.

---

**Built with ❤️ for Nigeria**

Save food. Save money. Save the planet. 🌍
