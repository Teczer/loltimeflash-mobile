# LolTimeFlash Mobile - Migration Plan

> Migration from Next.js Web to React Native Expo - **COMPLETED**

---

## 📋 Overview

Successfully ported the complete LolTimeFlash web application to React Native Expo with:
- **Uniwind** (Tailwind CSS for React Native)
- **MMKV** (fast key-value storage)
- **Zustand** (state management)
- **React Query** (server state)
- **Socket.IO** (real-time multiplayer)
- **expo-av** (audio playback)
- **expo-haptics** (haptic feedback)

---

## ✅ Completed Phases

### Phase 1: Theme & Styling ✅
- [x] Removed multi-theme system (light/dark/premium)
- [x] Implemented single LolTimeFlash dark theme
- [x] Ported CSS colors from web's `globals.css` to Uniwind

### Phase 2: Types & Constants ✅
- [x] Created `features/game/types/game.types.ts`
- [x] Created `features/game/constants/game.constants.ts`
- [x] Created `lib/config.ts`

### Phase 3: Core Hooks ✅
- [x] Ported `use-flash-cooldown.hook.ts`
- [x] Ported `use-game-timer.hook.ts`
- [x] Created `use-audio.hook.ts` with expo-av

### Phase 4: Game Context ✅
- [x] Created `features/game/contexts/game.context.tsx`
- [x] Added haptic feedback on Flash actions

### Phase 5: UI Components ✅
- [x] Created `flash-button.component.tsx`
- [x] Created `item-toggle.component.tsx`
- [x] Created `timer-controls.component.tsx`
- [x] Created `role-card.component.tsx`
- [x] Created UI primitives (Button, Input)

### Phase 6: Screens ✅
- [x] Updated Home screen with LolTimeFlash branding
- [x] Created Lobby screen (create/join)
- [x] Created Solo Game screen
- [x] Created Multiplayer Game screen (with room code display)

### Phase 7: Socket.IO ✅
- [x] Created `hooks/use-socket.hook.ts`
- [x] Typed socket events matching backend

### Phase 8: Settings ✅
- [x] Username management with MMKV persistence
- [x] Volume toggle with Zustand store
- [x] Created user and audio stores

---

## 📁 Final Project Structure

```
mobile/loltimeflash-mobile/
├── app/                          # Expo Router pages
│   ├── _layout.tsx               # Root layout
│   ├── (tabs)/
│   │   ├── _layout.tsx           # Tab layout
│   │   ├── index.tsx             # Home screen
│   │   └── settings.tsx          # Settings screen
│   ├── lobby/
│   │   └── index.tsx             # Lobby screen
│   ├── game/
│   │   ├── index.tsx             # Solo game
│   │   └── [roomId].tsx          # Multiplayer game
│   └── global.css                # Uniwind theme
├── assets/
│   ├── audio/
│   │   └── flash-song.mp3
│   └── images/
│       └── roles/                # Role & item icons
├── components/
│   └── ui/
│       ├── button.component.tsx
│       └── input.component.tsx
├── constants/
│   └── theme.ts                  # LolTimeFlash colors
├── features/
│   ├── game/
│   │   ├── components/
│   │   │   ├── flash-button.component.tsx
│   │   │   ├── item-toggle.component.tsx
│   │   │   ├── role-card.component.tsx
│   │   │   └── timer-controls.component.tsx
│   │   ├── constants/
│   │   │   └── game.constants.ts
│   │   ├── contexts/
│   │   │   └── game.context.tsx
│   │   ├── hooks/
│   │   │   ├── use-audio.hook.ts
│   │   │   ├── use-flash-cooldown.hook.ts
│   │   │   └── use-game-timer.hook.ts
│   │   └── types/
│   │       └── game.types.ts
│   └── lobby/
│       └── components/
│           ├── create-lobby-form.component.tsx
│           └── join-lobby-form.component.tsx
├── hooks/
│   └── use-socket.hook.ts
├── lib/
│   ├── config.ts
│   ├── mmkvStorage.ts
│   ├── use-theme.ts
│   └── utils.ts
├── stores/
│   ├── audio.store.ts
│   └── user.store.ts
└── providers/
    └── query-provider.tsx
```

---

## 🎨 Theme Colors

```typescript
// LolTimeFlash Dark Theme
background: '#021022'     // Dark blue
foreground: '#EEEFF0'     // Light gray
card: '#232225'           // Dark gray
border: '#A38566'         // Gold/Bronze
input: '#46434D'          // Purple gray
primary: '#FAFAFA'        // Almost white
destructive: '#812525'    // Dark red
success: '#22C55E'        // Green
```

---

## 🚀 Running the App

```bash
cd mobile/loltimeflash-mobile

# Install dependencies
bun install

# Start development
bun run dev

# iOS simulator
bun run ios

# Android emulator
bun run android
```

---

## 📝 Key Differences from Web

| Feature | Web (Next.js) | Mobile (Expo) |
|---------|--------------|---------------|
| Styling | Tailwind CSS | Uniwind |
| Storage | localStorage | MMKV |
| Audio | HTML5 Audio | expo-av |
| Images | next/image | React Native Image |
| Feedback | CSS hover | Haptics |
| Navigation | Next Router | Expo Router |

---

## 🔮 Future Enhancements

- [ ] Background image selection (champion splash arts)
- [ ] Push notifications for Flash ready
- [ ] Widget support (iOS 14+/Android)
- [ ] Deep linking for room invites
- [ ] Riot API live game integration

---

*Completed: January 19, 2026*
