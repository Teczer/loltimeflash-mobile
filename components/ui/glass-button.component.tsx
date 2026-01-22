import { GlassView, isLiquidGlassAvailable } from 'expo-glass-effect';
import { forwardRef, ReactNode } from 'react';
import { Platform, Pressable, PressableProps, View } from 'react-native';

import { colors } from '@/lib/colors';

interface IGlassButtonProps extends PressableProps {
  children: ReactNode;
  size?: number;
}

/**
 * A button with native iOS Liquid Glass effect
 * Falls back to a semi-transparent view on Android or older iOS
 */
export const GlassButton = forwardRef<View, IGlassButtonProps>((props, ref) => {
  const { children, size = 44, style, onPress, ...pressableProps } = props;

  // Check if Glass effect is available (iOS 26+)
  const canUseGlass = Platform.OS === 'ios' && isLiquidGlassAvailable();

  const buttonSize = {
    width: size,
    height: size,
    borderRadius: size / 2,
  };

  if (canUseGlass) {
    return (
      <Pressable ref={ref} onPress={onPress} style={style} {...pressableProps}>
        <GlassView
          style={[buttonSize, { alignItems: 'center', justifyContent: 'center' }]}
          glassEffectStyle="regular"
          isInteractive
        >
          {children}
        </GlassView>
      </Pressable>
    );
  }

  // Fallback for Android and older iOS
  return (
    <Pressable ref={ref} onPress={onPress} style={style} {...pressableProps}>
      <View
        className="items-center justify-center"
        style={[
          buttonSize,
          {
            backgroundColor: Platform.OS === 'ios'
              ? 'rgba(255, 255, 255, 0.15)'
              : colors.card,
            // iOS shadow
            ...(Platform.OS === 'ios' && {
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.25,
              shadowRadius: 8,
            }),
            // Android elevation
            ...(Platform.OS === 'android' && {
              elevation: 4,
            }),
          },
        ]}
      >
        {children}
      </View>
    </Pressable>
  );
});

GlassButton.displayName = 'GlassButton';
