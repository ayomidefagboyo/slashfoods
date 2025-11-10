# Supabase Setup Guide for SlashFood

Follow these steps to set up your Supabase database for SlashFood.

## 1. Create a Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Sign up or log in
3. Click "New Project"
4. Choose your organization
5. Name your project: "SlashFood"
6. Create a strong database password
7. Select a region close to Nigeria (Europe West recommended)
8. Click "Create new project"

## 2. Set up Database Schema

1. Wait for your project to be ready (1-2 minutes)
2. Go to the SQL Editor in your Supabase dashboard
3. Copy the contents of `supabase/schema.sql`
4. Paste it into the SQL Editor
5. Click "Run" to create all tables and policies

## 3. Add Sample Data

1. In the SQL Editor, create a new query
2. Copy the contents of `supabase/sample-data.sql`
3. Paste and run it to populate your database with sample deals

## 4. Get Your API Keys

1. Go to Settings → API in your Supabase dashboard
2. Copy your Project URL and Anon Public Key
3. Update your `.env` file:

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

## 5. Verify Setup

1. Restart your development server: `yarn dev`
2. Check the browser console for any Supabase errors
3. Your app should now load deals from the database!

## 6. What You Get

### Database Tables Created:
- **partners**: Restaurants, bakeries, supermarkets
- **deals**: Available food deals with pricing and timing
- **customers**: User information
- **orders**: Order history and pickup codes
- **order_items**: Individual items in each order

### Sample Data Added:
- 6 partner restaurants/stores in Lagos
- 12 active food deals for today
- Various categories: restaurant, bakery, supermarket

### Features Enabled:
- ✅ Real-time deal loading from database
- ✅ Order persistence and tracking
- ✅ Customer management
- ✅ Partner dashboard data (ready for future partner portal)
- ✅ Pickup code system
- ✅ Inventory management (deals reduce when ordered)

## 7. Next Steps

After setup:
1. Replace sample data with real partners
2. Set up partner registration/management
3. Add real-time notifications
4. Implement partner dashboard
5. Add analytics and reporting

## 8. Security Notes

- Row Level Security (RLS) is enabled
- Public can read active deals and partners
- Customers can only see their own orders
- All data is automatically secured

## 9. Backup Your Database

It's recommended to backup your database schema:
```bash
# Save your schema (after making changes)
# Go to Database → Backups in Supabase dashboard
```

Need help? Check the [Supabase documentation](https://supabase.com/docs) or the [SlashFood GitHub issues](https://github.com/your-repo/issues).