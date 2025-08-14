# MyDeen Mobile (Expo + React Native + TypeScript)

Cross‑platform mobile app for MyDeen (iOS/Android) connecting to the existing Express + MongoDB backend.

## Features
- Authentication (email/password, Google OAuth)
- Prayer times and monthly calendar
- Qur'an (surah list, verse view with translation/tafsir placeholder)
- Hadith search with pagination
- Duas by category with audio playback and dhikr counter
- Q&A list and detail; scholars/admin can answer
- Places: mosque/halal locator via Google Places API or backend fallback
- Qibla compass (basic magnetometer-based)
- Zakat calculator
- Push notifications (Expo Notifications) and daily background refresh placeholder
- Theming (light/dark) and localization scaffolding

## Requirements
- Node.js 18+
- Expo CLI (`npm i -g expo-cli`) optional
- iOS: Xcode; Android: Android Studio + emulator
- Backend running and accessible (default `http://10.0.2.2:3000` for Android emulator)

## Getting Started

1. Install dependencies
```bash
cd mydeen-app
npm install
```

2. Configure environment
- Edit `app.json` `extra` or create `.env` (see `.env.example`)
  - `BACKEND_BASE_URL` e.g. `http://10.0.2.2:3000`
  - `GOOGLE_WEB_CLIENT_ID` for Google OAuth (Web client ID)
  - `GOOGLE_MAPS_API_KEY` for Places

3. Run app
```bash
npm run start
# Press a to open Android, i for iOS simulator
```

4. Building native apps
```bash
npm run android
npm run ios
```

## State Management
- Redux Toolkit with typed hooks; slices for `auth` and `preferences`.

## API Integration
- Axios client with JWT added to `Authorization: Bearer <token>`.
- Services under `src/services/*` for each feature area.

## Directory Structure
```
src/
  components/
  screens/
    auth/
    home/
    quran/
    hadith/
    duas/
    qa/
    prayer/
    places/
    calendar/
    zakat/
    settings/
  services/
  models/
  store/
  navigation/
  theme/
  i18n/
  config/
```

## Notes
- Google OAuth uses `expo-auth-session`. Set `googleWebClientId` in `app.json` `extra`.
- Push notifications use Expo Notifications; for production device tokens/APNs/FCM, configure EAS and credentials.
- The Qibla compass is approximate; for high-accuracy, integrate a Qibla calculation library using geodesic bearing from user location to Kaaba.
- Map requires proper setup of `react-native-maps` on iOS (CocoaPods) and Android (Google Maps API key in manifest if using native runs).

## Testing against backend
- Endpoints assumed (adjust if your backend differs):
  - `/api/auth/login`, `/api/auth/register`, `/api/auth/google`
  - `/api/prayer/times`, `/api/prayer/month`
  - `/api/quran/surahs`, `/api/quran/surah/:id`
  - `/api/hadith/search`
  - `/api/duas/categories`, `/api/duas/category/:id`
  - `/api/qa`, `/api/qa/:id`, `/api/qa/:id/answer`
  - `/api/places/nearby`

## Localization
- Basic `i18next` setup in `src/i18n`. Extend dictionaries as needed.

## Security
- JWT stored in `expo-secure-store`. Avoid logging tokens.