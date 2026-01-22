/**
 * Third-party components wrapped with Uniwind
 * Only third-party libraries need withUniwind wrapper
 * Native React Native components (View, Text, etc.) work with className directly
 */
import { withUniwind } from 'uniwind';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

// react-native-safe-area-context
export const StyledSafeAreaView = withUniwind(SafeAreaView);

// react-native-gesture-handler
export const StyledGestureHandlerRootView = withUniwind(GestureHandlerRootView);
