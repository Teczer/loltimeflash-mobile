# AGENTS.md - LolTimeFlash Mobile Documentation

> **Pour les agents/développeurs :**
> Toute la documentation doit rester centralisée dans ce fichier AGENTS.md et README.md uniquement.

---

## Project Overview

**LolTimeFlash Mobile** est l'application mobile React Native/Expo du projet LolTimeFlash. Elle permet aux joueurs de League of Legends de tracker les cooldowns des sorts d'invocateur (notamment Flash) en temps réel pendant leurs parties.

### Features

- ⏰ Tracking des cooldowns Flash pour les 5 rôles ennemis
- 🎯 Calcul automatique basé sur les Bottes Lucidité et Cosmic Insight
- 🔄 Synchronisation temps réel via WebSocket (mode multiplayer)
- 🎨 Backgrounds personnalisables avec splash arts des champions
- 📱 UI native avec support iOS Liquid Glass (iOS 26+)
- 🎮 Intégration LaneGap pour l'aide en phase de lane

---

## Tech Stack

| Category | Technology | Version |
|----------|------------|---------|
| **Framework** | Expo SDK | 54 |
| **Language** | TypeScript | 5.9 |
| **UI Framework** | React Native | 0.81 |
| **Styling** | Uniwind (Tailwind CSS) | 1.2.4 |
| **Navigation** | Expo Router | 6.0 |
| **State Management** | Zustand | 5.0 |
| **Server State** | TanStack Query | 5.90 |
| **Storage** | MMKV | 4.0 |
| **Real-time** | Socket.IO Client | 4.8 |
| **Package Manager** | Bun | Latest |

---

### Git Workflow

1. Create feature branch from `main`
2. Commit with descriptive messages
3. Test locally before pushing
4. Submit PR with description of changes

### Commit Message Convention

**Format**: `<gitmoji> <type>(<scope>): <description>`

**Rules**:

- ✅ Use gitmoji in **text format** (`:art:` `:recycle:` `:sparkles:` etc.), NOT emoji unicode (🎨 ♻️ ✨)
- ✅ Max 72 characters for the title
- ✅ **NO body** (no line breaks, title only)
- ✅ Use imperative mood ("add", "fix", "refactor", not "added", "fixed")
- ✅ Lowercase after colon

**Examples**:

```bash
:recycle: refactor(game): migrate to timestamp-based timers
:sparkles: feat(socket): add connection status indicator
:bug: fix(timer): prevent reset on user join
:art: style(ui): apply kebab-case naming convention
:memo: docs: update AGENTS.md with Phase 3.5 changes
:zap: perf(game): optimize components with React.memo
```

## Project Structure

```
loltimeflash-mobile/
├── app/                          # Expo Router (file-based routing)
│   ├── (tabs)/                   # Tab navigation group
│   │   ├── _layout.tsx           # NativeTabs layout
│   │   ├── index.tsx             # Solo (Home) tab
│   │   ├── multiplayer.tsx       # Multiplayer lobby tab
│   │   └── lanegap.tsx           # LaneGap champions tab
│   ├── game/
│   │   ├── solo.tsx              # Solo game screen
│   │   └── [roomId].tsx          # Multiplayer game room
│   ├── lanegap/
│   │   └── [championId].tsx      # Champion detail screen
│   ├── settings.tsx              # Settings screen (not in tabs)
│   ├── _layout.tsx               # Root Stack layout
│   └── global.css                # Tailwind CSS theme
│
├── assets/
│   ├── champions/                # Champion splash arts
│   │   ├── splash/               # 2000+ optimized .webp files
│   │   └── index.ts              # Auto-generated mappings
│   ├── images/
│   │   ├── roles/                # Role icons (TOP, JG, MID, ADC, SUP)
│   │   ├── icon.png              # App icon
│   │   ├── splash.png            # Splash screen
│   │   └── adaptive-icon.png     # Android adaptive icon
│   └── fonts/
│
├── components/
│   ├── ui/                       # Reusable UI components
│   │   ├── button.component.tsx
│   │   ├── input.component.tsx
│   │   ├── glass-button.component.tsx
│   │   └── index.ts
│   ├── background-image.component.tsx
│   └── styled.ts                 # withUniwind wrappers
│
├── features/
│   ├── game/
│   │   ├── components/           # Game-specific components
│   │   ├── hooks/                # useFlashCooldown, useAudio, etc.
│   │   └── types/
│   ├── lobby/
│   │   └── components/           # CreateLobbyForm, JoinLobbyForm
│   └── settings/
│       └── components/           # BackgroundPicker, etc.
│
├── hooks/                        # Global hooks
│   └── use-socket.hook.ts
│
├── lib/
│   ├── colors.ts                 # Theme colors
│   ├── config.ts                 # App configuration
│   └── utils.ts                  # Utility functions
│
├── providers/
│   └── query-provider.tsx        # TanStack Query provider
│
├── stores/                       # Zustand stores
│   ├── user.store.ts
│   ├── audio.store.ts
│   ├── background.store.ts
│   └── index.ts
│
├── scripts/
│   └── optimize-champions.ts     # Image optimization script
│
├── app.json                      # Expo config
├── package.json
├── tsconfig.json
└── bun.lock
```

---

## Navigation Architecture

```
Stack (Root)
├── (tabs)/                       # Tab Navigator
│   ├── index        → Solo       # Home + Start Game button
│   ├── multiplayer  → Multi      # Create/Join lobby
│   └── lanegap      → LaneGap    # Champion list
├── settings                      # Settings (floating button access)
├── game/solo                     # Solo game screen
├── game/[roomId]                 # Multiplayer room
└── lanegap/[championId]          # Champion detail
```

**Navigation Notes:**
- `NativeTabs` utilisé sur iOS ET Android pour l'effet natif
- Settings accessible via `GlassButton` flottant (pas dans les tabs)
- Liquid Glass disponible sur iOS 26+ (compilé avec Xcode 26)

---

## Styling Guidelines

### Uniwind (Tailwind for React Native)

**Composants React Native natifs** → `className` direct :
```tsx
import { View, Text } from 'react-native';

<View className="flex-1 items-center justify-center bg-background">
  <Text className="text-lg font-bold text-foreground">Hello</Text>
</View>
```

**Composants third-party** → `withUniwind` wrapper :
```tsx
import { SafeAreaView } from 'react-native-safe-area-context';
import { withUniwind } from 'uniwind';

export const StyledSafeAreaView = withUniwind(SafeAreaView);

// Usage
<StyledSafeAreaView className="flex-1" edges={['top']}>
```

### Theme Colors

Définies dans `lib/colors.ts` et `app/global.css` :

| Color | Hex | Usage |
|-------|-----|-------|
| `background` | `#021022` | App background |
| `foreground` | `#EEEFF0` | Primary text |
| `card` | `#232225` | Card backgrounds |
| `border` | `#A38566` | Borders (gold/bronze) |
| `gold` | `#C4A15B` | LaneGap accent |
| `mutedForeground` | `#A3A3A3` | Secondary text |

---

## State Management

### Zustand Stores

```typescript
// stores/user.store.ts
interface IUserState {
  username: string | null;
  setUsername: (name: string) => void;
  clearUsername: () => void;
}

// Usage
const username = useUserStore((s) => s.username);
```

**Stores disponibles :**
- `useUserStore` - Username management
- `useAudioStore` - Volume on/off
- `useBackgroundStore` - Selected background (championName + skinIndex)

### MMKV Persistence

Zustand stores persistent via MMKV :
```typescript
import { zustandStorage } from '@/lib/mmkv';

persist(
  (set) => ({ ... }),
  { name: 'store-name', storage: createJSONStorage(() => zustandStorage) }
)
```

---

## Real-time Communication

### Socket.IO Integration

```typescript
// hooks/use-socket.hook.ts
import { io } from 'socket.io-client';
import { config } from '@/lib/config';

const socket = io(config.socketUrl, {
  autoConnect: false,
  reconnection: true,
  reconnectionAttempts: 5,
});
```

### Socket Events

| Event | Direction | Description |
|-------|-----------|-------------|
| `join-room` | Client → Server | Join multiplayer room |
| `flash-action` | Client → Server | Flash button pressed |
| `room-state` | Server → Client | Full game state sync |
| `flash-notification` | Server → Client | Someone flashed |

---

## Champion Assets System

### Static Assets (Bundled)

Tous les splash arts sont **bundlés statiquement** (pas de CDN) pour des performances optimales.

**Location :** `assets/champions/`
- `splash/*.webp` - 2000+ images optimisées (114 MB total)
- `index.ts` - Auto-generated mappings

### Optimization Script

```bash
bun run optimize:champions
```

Le script :
1. Copie les images depuis `apps/web/public/champions/splash`
2. Compresse avec Sharp (quality 75, max 1280x720)
3. Génère `assets/champions/index.ts` avec tous les `require()`

### Usage

```typescript
import { CHAMPIONS, getChampion, DEFAULT_SPLASH } from '@/assets/champions';

// Get all champions
CHAMPIONS.map(champ => champ.name);

// Get specific champion
const aatrox = getChampion('Aatrox');

// Get skin image source
const source = aatrox?.skins[0].source;
```

---

## iOS Liquid Glass

### Requirements

Pour activer l'effet Liquid Glass natif :
1. **iOS 26+** sur le device
2. **Xcode 26** pour compiler l'app
3. Plugin `expo-glass-effect` dans `app.json`

### GlassButton Component

```tsx
import { GlassButton } from '@/components/ui';

<GlassButton onPress={handlePress}>
  <Ionicons name="settings-outline" size={22} color={colors.foreground} />
</GlassButton>
```

- iOS 26+ avec Xcode 26 → Liquid Glass natif
- Autres → Fallback semi-transparent stylé

### Check Availability

```typescript
import { isLiquidGlassAvailable } from 'expo-glass-effect';

const canUseGlass = isLiquidGlassAvailable();
```

---

## Development

### Setup

```bash
# Clone
git clone https://github.com/Teczer/loltimeflash-mobile.git
cd loltimeflash-mobile

# Install dependencies
bun install

# Copy environment
cp .env.example .env

# Start development
bun run start
```

### Scripts

| Command | Description |
|---------|-------------|
| `bun run start` | Start Metro bundler |
| `bun run dev` | Start with dev-client |
| `bun run ios` | Run on iOS simulator |
| `bun run android` | Run on Android emulator |
| `bun run prebuild` | Generate native projects |
| `bun run prebuild:clean` | Clean + regenerate native |
| `bun run optimize:champions` | Optimize champion images |
| `bun run format` | Format with Prettier |
| `bun run lint` | Lint with ESLint |
| `bun run clean` | Clean all caches |

### Running on Device

```bash
# iOS (requires Xcode)
bun run ios --device

# Android (requires adb)
bun run android --device
```

### Multiple Xcode Versions

Pour avoir Xcode 16 (taff) et Xcode 26 (Liquid Glass) :

```bash
# Switch to Xcode 16
sudo xcode-select -s /Applications/Xcode-16.app

# Switch to Xcode 26
sudo xcode-select -s /Applications/Xcode-26.app
```

---

## Environment Variables

```env
# .env.example
EXPO_PUBLIC_SOCKET_URL=https://lolsocket.loltimeflash.com
EXPO_PUBLIC_API_URL=https://lolsocket.loltimeflash.com
EXPO_PUBLIC_POCKETBASE_URL=https://backlanegap.loltimeflash.com
EXPO_PUBLIC_PATCH_VERSION=15.1.1
```

---

## File Naming Conventions

| Type | Convention | Example |
|------|------------|---------|
| Components | `kebab-case.component.tsx` | `glass-button.component.tsx` |
| Hooks | `use-name.hook.ts` | `use-socket.hook.ts` |
| Stores | `name.store.ts` | `user.store.ts` |
| Types | `name.types.ts` | `game.types.ts` |
| Utils | `name.util.ts` | `format.util.ts` |

### TypeScript Conventions

- **Interfaces** : `I` prefix (`IUserData`, `IGameState`)
- **Types** : `T` prefix (`TRole`, `TSocketEvent`)
- **Props** : `IComponentNameProps`

---

## Commit Convention

**Format :** `<gitmoji> <type>(<scope>): <description>`

```bash
:sparkles: feat(game): add timer calibration
:bug: fix(socket): handle reconnection
:recycle: refactor(ui): migrate to GlassButton
:art: style(tabs): update NativeTabs icons
```

**Gitmojis courants :**
- `:sparkles:` - New feature
- `:bug:` - Bug fix
- `:recycle:` - Refactor
- `:art:` - UI/Style
- `:memo:` - Documentation
- `:zap:` - Performance

---

## Related Projects

- **LolTimeFlash Web** : https://github.com/Teczer/LolTimeFlash
- **LaneGap** : https://github.com/Teczer/LaneGap (Backend PocketBase)

---

## Resources

- [Expo Documentation](https://docs.expo.dev/)
- [Expo Router](https://docs.expo.dev/router/introduction/)
- [Native Tabs](https://docs.expo.dev/router/advanced/native-tabs/)
- [expo-glass-effect](https://docs.expo.dev/versions/latest/sdk/glass-effect/)
- [Uniwind](https://docs.uniwind.dev/)
- [Zustand](https://docs.pmnd.rs/zustand)
- [TanStack Query](https://tanstack.com/query)

---

**Last Updated:** January 22, 2026
**Version:** 1.0.0
**Status:** ✅ Production Ready
