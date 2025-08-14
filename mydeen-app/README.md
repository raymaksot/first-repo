# MyDeen Mobile (Expo)

New features:
- Comments and likes for articles and Q&A answers
- Reading groups (khatma circles): create/join groups, assignments/progress, simple chat
- Events: list, details, RSVP/cancel, local reminders
- Admin dashboard placeholder (requires `admin` role)
- Notification preferences (events, articles, group milestones)
- Accessibility: font scaling toggle, high-contrast toggle

Configuration:
- Set `EXPO_PUBLIC_API_BASE_URL` in `.env` pointing to backend (default `http://10.0.2.2:3000` for Android emulator)

Running:
- Install deps: `npm install`
- Start: `npx expo start`

Notes:
- Comments UI is reusable component at `src/components/CommentsThread.tsx`
- New screens: `src/screens/groups/*`, `src/screens/events/*`, `src/screens/admin/AdminDashboardScreen.tsx`