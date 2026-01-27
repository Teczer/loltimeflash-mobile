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
| **Animations** | React Native Reanimated | 3.x |
| **Navigation** | Expo Router | 6.0 |
| **State Management** | Zustand | 5.0 |
| **Server State** | TanStack Query | 5.90 |
| **Storage** | MMKV | 4.0 |
| **Real-time** | Socket.IO Client | 4.8 |
| **Package Manager** | Bun | Latest |

---

## Coding Guidelines

### 1. Naming Conventions

Les composants doivent avoir des noms **explicites et contextuels** :

```tsx
// ✅ BON - Nom explicite
TextInput, ChampionEmptyResult, SettingsCard, ConnectionIndicator

// ❌ MAUVAIS - Nom générique
Input, EmptyState, Card, Indicator
```

Le nom doit indiquer clairement ce que fait le composant.

### 2. Performance Hooks

**Éviter les `memo`, `useMemo`, `useCallback` inutiles** - les utiliser uniquement quand il y a un réel bénéfice de performance :

```tsx
// ❌ ÉVITER - memo inutile sur composant simple
export const SimpleCard = memo(({ title }: IProps) => (
  <View><Text>{title}</Text></View>
))

// ✅ BON - Pas de memo, le composant est simple
export const SimpleCard = ({ title }: IProps) => (
  <View><Text>{title}</Text></View>
)

// ✅ BON - memo justifié pour liste avec beaucoup d'items
export const HeavyListItem = memo(({ data, onPress }: IProps) => {
  // Composant lourd avec calculs complexes
})
```

### 3. Animations (react-native-reanimated)

**Pas d'effets "bouncy"** - utiliser `withTiming` avec `Easing` au lieu de `withSpring` :

```tsx
// ❌ ÉVITER - Effet rebond
const animatedStyle = useAnimatedStyle(() => ({
  transform: [{ scale: withSpring(value ? 1.1 : 1) }]
}))

// ✅ BON - Transition smooth
const animatedStyle = useAnimatedStyle(() => ({
  transform: [{ 
    scale: withTiming(value ? 1.1 : 1, { 
      duration: 200, 
      easing: Easing.out(Easing.ease) 
    }) 
  }]
}))
```

Pour les indicateurs de connexion : animation pulse avec drop shadow lumineux.

### 4. Styling & Tokens

Utiliser `bg-white/XX` et `border-white/XX` (semi-transparent) pour les overlays :

```tsx
// ✅ BON - Semi-transparent cohérent
<View className="bg-white/5 border border-white/10 rounded-xl" />

// ❌ ÉVITER - Tokens solides pour overlays
<View className="bg-card border-border rounded-xl" />
```

### 5. Inputs/Forms

- Placeholder **aligné à gauche** (pas centré)
- Hauteur et padding **cohérents** sur tous les inputs
- Curseur bien centré verticalement (`textAlignVertical="center"`)

### 6. Platform Handling (iOS/Android)

```tsx
// Gérer les SafeArea sur Android
import { useSafeAreaInsets } from 'react-native-safe-area-context'

const insets = useSafeAreaInsets()

// Modal avec presentationStyle conditionnel
<Modal
  presentationStyle={Platform.OS === 'ios' ? 'pageSheet' : 'fullScreen'}
  // Sur Android, ajouter paddingTop: insets.top
/>
```

### 7. Architecture Composants

Créer des **composants réutilisables avec variants** :

```tsx
// Supporter leftElement/rightElement pour contenu personnalisable
interface ISettingsCardProps {
  icon?: keyof typeof Ionicons.glyphMap
  leftElement?: ReactNode  // Alternative au icon
  title: string
  subtitle?: string
  variant?: 'gold' | 'info' | 'success' | 'muted'
  rightElement?: ReactNode
  onPress?: () => void
}
```

**Splitter** les gros fichiers en composants séparés et réutilisables.

---

## Uniwind - Guide Complet

### Règle d'Or

> **Uniwind transforme les composants React Native natifs pour supporter `className`.**
> Les composants third-party nécessitent `withUniwind`.

### Composants React Native Natifs

`className` fonctionne directement - **PAS besoin de wrapper** :

```tsx
import { View, Text, Pressable, ScrollView, Image, TextInput } from 'react-native'

// ✅ Utilisation directe
<View className="flex-1 items-center justify-center bg-background">
  <Text className="text-lg font-bold text-foreground">Hello</Text>
  <Pressable className="px-4 py-2 rounded-lg bg-gold active:bg-gold/80">
    <Text className="text-white">Press me</Text>
  </Pressable>
</View>
```

### Composants Third-Party

Utiliser `withUniwind` pour les bibliothèques externes :

```tsx
import { SafeAreaView } from 'react-native-safe-area-context'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { withUniwind } from 'uniwind'

// Créer les wrappers (dans components/styled.ts)
export const StyledSafeAreaView = withUniwind(SafeAreaView)
export const StyledGestureHandlerRootView = withUniwind(GestureHandlerRootView)

// Usage
<StyledSafeAreaView className="flex-1 bg-background" edges={['top']}>
  {children}
</StyledSafeAreaView>
```

### Composants Reanimated

`Animated.View` ne supporte **PAS** `className` directement :

```tsx
import Animated, { useAnimatedStyle, withTiming } from 'react-native-reanimated'

// ❌ NE FONCTIONNE PAS
<Animated.View className="bg-gold" style={animatedStyle} />

// ✅ Option 1: Style inline pour tout
<Animated.View style={[styles.container, animatedStyle]} />

// ✅ Option 2: Wrapper avec withUniwind (si besoin de className)
import { withUniwind } from 'uniwind'
const StyledAnimatedView = withUniwind(Animated.View)

<StyledAnimatedView className="rounded-xl bg-white/10" style={animatedStyle} />
```

### Gradients Built-in

**PRÉFÉRER** les gradients Uniwind à `expo-linear-gradient` :

```tsx
// ✅ BON - Gradient Uniwind natif
<View className="bg-gradient-to-b from-transparent to-background" />

// Avec via pour point intermédiaire
<View className="bg-gradient-to-b from-transparent via-background/90 to-background" />

// Contrôler la position du via avec pourcentage
<View className="bg-gradient-to-b from-transparent via-background/90 via-[30%] to-background" />

// Directions disponibles
<View className="bg-gradient-to-t ..." />  // bottom to top
<View className="bg-gradient-to-r ..." />  // left to right
<View className="bg-gradient-to-br ..." /> // top-left to bottom-right
```

### expo-linear-gradient (si nécessaire)

Si `expo-linear-gradient` est vraiment nécessaire, utiliser `useCSSVariable` :

```tsx
import { LinearGradient } from 'expo-linear-gradient'
import { useCSSVariable } from 'uniwind'

// ❌ NE FONCTIONNE PAS - withUniwind ne mappe pas les arrays
const StyledLinearGradient = withUniwind(LinearGradient)

// ✅ BON - useCSSVariable pour les couleurs
export const GradientComponent = () => {
  const startColor = useCSSVariable('--color-transparent')
  const midColor = useCSSVariable('--color-background')
  const endColor = useCSSVariable('--color-background')

  return (
    <LinearGradient
      colors={[startColor, midColor, endColor]}
      locations={[0, 0.3, 1]}
      style={StyleSheet.absoluteFill}
    />
  )
}
```

### Variables CSS Dynamiques

Pour accéder aux couleurs du thème dynamiquement :

```tsx
import { useCSSVariable } from 'uniwind'

const MyComponent = () => {
  const gold = useCSSVariable('--color-gold')
  const background = useCSSVariable('--color-background')
  const foreground = useCSSVariable('--color-foreground')

  return (
    <SomeThirdPartyComponent 
      color={gold}
      backgroundColor={background}
    />
  )
}
```

### Récapitulatif Uniwind

| Composant | Méthode |
|-----------|---------|
| `View`, `Text`, `Pressable`, `ScrollView`, `Image` | `className` direct |
| `SafeAreaView`, `GestureHandlerRootView` | `withUniwind` wrapper |
| `Animated.View`, `Animated.Text` | `withUniwind` ou `style={}` |
| `LinearGradient` | `useCSSVariable` pour les couleurs |
| Gradients simples | Classes built-in `bg-gradient-to-*` |

---

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
│   │   ├── bottom-sheet.component.tsx
│   │   ├── button.component.tsx
│   │   ├── glass-button.component.tsx
│   │   ├── text-input.component.tsx
│   │   ├── title-text.component.tsx
│   │   └── index.ts
│   ├── background-image.component.tsx
│   └── styled.ts                 # withUniwind wrappers
│
├── features/
│   ├── game/
│   │   ├── components/           # RoleCard, FlashButton, TimerControls, etc.
│   │   ├── contexts/             # GameContext, GameProvider
│   │   ├── hooks/                # useFlashCooldown, useAudio, etc.
│   │   ├── constants/
│   │   └── types/
│   ├── lanegap/
│   │   └── components/           # ChampionItem, CounterPickCard, etc.
│   ├── lobby/
│   │   └── components/           # CreateLobbyForm, JoinLobbyForm
│   └── settings/
│       └── components/           # BackgroundPicker, UsernameForm, etc.
│
├── hooks/                        # Global hooks
│   └── use-socket.hook.ts
│
├── lib/
│   ├── colors.ts                 # Theme colors (exported JS object)
│   ├── config.ts                 # App configuration
│   ├── constants.ts              # App constants
│   └── utils.ts                  # Utility functions (cn, generateLobbyCode)
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

## Theme Colors

Définies dans `lib/colors.ts` et `app/global.css` :

| Color | Hex | Usage |
|-------|-----|-------|
| `background` | `#021022` | App background |
| `foreground` | `#EEEFF0` | Primary text |
| `card` | `#232225` | Card backgrounds |
| `border` | `#A38566` | Borders (gold/bronze) |
| `gold` | `#C4A15B` | Primary accent |
| `goldLight` | `#D4AF37` | Light gold accent |
| `mutedForeground` | `#A3A3A3` | Secondary text |
| `success` | `#22C55E` | Success states |
| `warning` | `#F59E0B` | Warning states |
| `info` | `#3B82F6` | Info states |
| `danger` | `#EF4444` | Error/danger states |

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

// Usage - sélection granulaire pour éviter re-renders
const username = useUserStore((s) => s.username);
const setUsername = useUserStore((s) => s.setUsername);
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

### Usage

```typescript
import { CHAMPIONS, getChampion, getChampionIcon, DEFAULT_SPLASH } from '@/assets/champions';

// Get all champions
CHAMPIONS.map(champ => champ.name);

// Get specific champion
const aatrox = getChampion('Aatrox');

// Get skin image source
const source = aatrox?.skins[0].source;

// Get champion icon
const icon = getChampionIcon('Aatrox');
```

---

## iOS Liquid Glass

### Requirements

Pour activer l'effet Liquid Glass natif :
1. **iOS 26+** sur le device
2. **Xcode 26** pour compiler l'app
3. Plugin `expo-glass-effect` dans `app.json`

### Components avec Glass Support

```tsx
// GlassButton - Bouton avec Liquid Glass
import { GlassButton } from '@/components/ui';

<GlassButton onPress={handlePress}>
  <Ionicons name="settings-outline" size={22} color={colors.foreground} />
</GlassButton>

// TextInput - Input avec variant glass
import { TextInput } from '@/components/ui';

<TextInput variant="glass" placeholder="Search..." clearable />
```

### Check Availability

```typescript
import { isLiquidGlassAvailable } from 'expo-glass-effect';

const canUseGlass = Platform.OS === 'ios' && isLiquidGlassAvailable();
```

---

## Git Workflow

1. Create feature branch from `main`
2. Commit with descriptive messages
3. Test locally before pushing
4. Submit PR with description of changes

### Commit Message Convention

**Format**: `<gitmoji> <type>(<scope>): <description>`

**Rules**:

- ✅ Use gitmoji in **text format** (`:art:` `:recycle:` `:sparkles:` etc.), NOT emoji unicode
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
:memo: docs: update AGENTS.md
:zap: perf(game): optimize heavy components with memo
```

**Gitmojis courants :**
- `:sparkles:` - New feature
- `:bug:` - Bug fix
- `:recycle:` - Refactor
- `:art:` - UI/Style
- `:memo:` - Documentation
- `:zap:` - Performance

---

## File Naming Conventions

| Type | Convention | Example |
|------|------------|---------|
| Components | `kebab-case.component.tsx` | `glass-button.component.tsx` |
| Hooks | `use-name.hook.ts` | `use-socket.hook.ts` |
| Stores | `name.store.ts` | `user.store.ts` |
| Types | `name.types.ts` | `game.types.ts` |
| Utils | `name.util.ts` | `format.util.ts` |
| Constants | `name.constants.ts` | `game.constants.ts` |

### TypeScript Conventions

- **Interfaces** : `I` prefix (`IUserData`, `IGameState`)
- **Types** : `T` prefix (`TRole`, `TSocketEvent`)
- **Props** : `IComponentNameProps`

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

## Related Projects

- **LolTimeFlash Web** : https://github.com/Teczer/LolTimeFlash
- **LaneGap** : https://github.com/Teczer/LaneGap (Backend PocketBase)

---

## Resources

- [Expo Documentation](https://docs.expo.dev/)
- [Expo Router](https://docs.expo.dev/router/introduction/)
- [Native Tabs](https://docs.expo.dev/router/advanced/native-tabs/)
- [expo-glass-effect](https://docs.expo.dev/versions/latest/sdk/glass-effect/)
- [Uniwind Documentation](https://docs.uniwind.dev/)
- [React Native Reanimated](https://docs.swmansion.com/react-native-reanimated/)
- [Zustand](https://docs.pmnd.rs/zustand)
- [TanStack Query](https://tanstack.com/query)

---

**Last Updated:** January 27, 2026
**Version:** 1.1.0
**Status:** ✅ Production Ready
