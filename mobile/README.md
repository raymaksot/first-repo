# Islamic App Mobile (Expo + TypeScript)

## Setup

- Node.js 18+
- Install deps:

```
cd mobile
npm install
```

- Configure environment (development): create `.env` with:

```
API_BASE_URL=http://localhost:3000
STRIPE_PUBLISHABLE_KEY=pk_test_...
```

## Run

```
npm start
```

- Android: `npm run android`
- iOS: `npm run ios`

## Features

- Hijri calendar and events via `/api/events/hijri`
- Zakat calculator + donations via `/api/zakat/donate` with Stripe/PayPal
- Offline datasets (Qur'an, Duas, Hadith) persisted to SQLite
- Client-side search with language and collection filters
- Redux Toolkit store, i18n, theming via system scheme

## Testing

```
npm test
```

### Integration Tests
- Calendar loading
- Zakat payment flow (mocked)
- Offline toggle behavior

## EAS Build

```
# Login once
npx expo login

# Development build
npx expo run:android

# EAS (recommended)
npm i -g eas-cli
eas build -p android --profile development
eas build -p ios --profile development
```

Configure `eas.json` and environment variables (secrets) in EAS dashboard for production:
- `API_BASE_URL`
- `STRIPE_PUBLISHABLE_KEY`

## Donation Flow (Dev)

- Use Stripe test key in `.env`
- Backend endpoint `/api/zakat/donate` should create a PaymentIntent and return `{ status, clientSecret, receiptUrl }`
- To simulate SCA: return `requires_action` + `clientSecret` and the app will call `handleNextAction`
- For PayPal: backend should complete the capture server-side and return `{ status: 'succeeded', receiptUrl }`

## Offline Mode (Dev)

- Toggle “Download for offline use” on Home to fetch and persist Qur'an, Duas, Hadith
- Disable network (Airplane mode) to see `Offline` status and data served from cache in Search

## Notes

- Ensure push notification keys and credentials are configured for production.
- For iOS payments, add required capabilities in EAS config if using Apple Pay.