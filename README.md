# MyDeen Monorepo

This workspace contains:
- Backend (Express + MongoDB/Mongoose): `/src`
- Mobile app (Expo): `/mydeen-app`

## Backend

Features added:
- Comments & Likes: `/api/comments`, `/api/comments/:id/like`, `/api/likes/toggle`
- Reading Groups: `/api/reading-groups`, join/leave, progress, messages
- Events & Registrations: `/api/events`, `/api/events/:id/register`
- Admin Dashboard: `/api/admin/dashboard`, comment moderation endpoints
- Device token registration: `/api/devices/register`

### Setup

1. Environment

Create `.env` (see `.env.example`):
```
PORT=3000
MONGODB_URI=mongodb://127.0.0.1:27017/mydeen
MONGODB_DB=mydeen
JWT_SECRET=dev_secret
```

2. Install deps
```
npm install
```

3. Migrations / ensure indexes
```
npm run migrate
```

4. Run backend
```
npm run start
```

### Basic Auth
The API expects `Authorization: Bearer <JWT>` and decodes fields `sub` (user id) and `role` (`user`|`scholar`|`admin`). Integrate with your existing auth or issue development tokens.

### Collections/Models
- `comments`: { userId, parentType: 'article'|'qaAnswer', parentId, text, likesCount, status, createdAt, updatedAt }
- `likes`: { userId, parentType: 'comment'|'article'|'qaAnswer', parentId }
- `readingGroups`: group metadata
- `groupMembers`: membership and roles
- `groupProgress`: assignments and completion
- `groupMessages`: simple chat
- `events`: community events
- `registrations`: event RSVPs
- `deviceTokens`: Expo/FCM tokens

## Mobile (Expo)
See `mydeen-app/README.md` for details. Set `EXPO_PUBLIC_API_BASE_URL` to backend URL.
