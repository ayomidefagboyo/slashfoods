# Google Maps API Setup for Accurate Location

To get detailed, accurate addresses for Nigerian locations, you'll need to set up a Google Maps API key:

## Steps:

1. **Go to Google Cloud Console**: https://console.cloud.google.com/
2. **Create a new project** or select an existing one
3. **Enable the Geocoding API**:
   - Go to APIs & Services → Library
   - Search for "Geocoding API"
   - Click "Enable"

4. **Create an API Key**:
   - Go to APIs & Services → Credentials
   - Click "Create Credentials" → "API Key"
   - Copy the generated key

5. **Secure your API Key** (Optional but recommended):
   - Click on your API key to edit it
   - Under "Application restrictions", select "HTTP referrers"
   - Add your domain (e.g., `localhost:5173`, `yourdomain.com`)
   - Under "API restrictions", select "Restrict key"
   - Choose "Geocoding API"

6. **Add the API key to your project**:
   - Open the `.env` file in your project root
   - Replace `your_google_maps_api_key_here` with your actual API key:
   ```
   VITE_GOOGLE_MAPS_API_KEY=AIzaSyC4R6AN7SmxxxxxxxxxxxxxxxxxxxxxxxxxxX
   ```

7. **Restart your development server**:
   ```bash
   yarn dev
   ```

## Pricing:

- Google Maps Geocoding API gives you $200 free credits per month
- That's ~40,000 geocoding requests per month
- More than enough for a food delivery app

## Fallback:

If you don't set up the Google API key, the app will still work but will use OpenStreetMap's free service, which provides less detailed addresses for Nigerian locations.

With Google Maps API, you'll get specific addresses like:
- "Victoria Island, Lagos"
- "Ikoyi, Lagos State"
- "Lekki Phase 1, Lagos"

Instead of just "Lagos" from the free service.