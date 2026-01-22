import { GlassView, isLiquidGlassAvailable } from 'expo-glass-effect';
import { forwardRef, ReactNode } from 'react';
import { Platform, Pressable, PressableProps, View } from 'react-native';

import { cn } from '@/lib/utils';

interface IGlassButtonProps extends PressableProps {
  children: ReactNode;
  size?: number;
}

const baseStyles = 'items-center justify-center border';

const glassStyles = {
  normal: 'bg-white/15 border-white/10',
  pressed: 'bg-white/30 border-white/20',
};

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

  return (
    <Pressable ref={ref} onPress={onPress} style={style} {...pressableProps}>
      {({ pressed }) => (
        <View
          className={cn(baseStyles, pressed ? glassStyles.pressed : glassStyles.normal)}
          style={buttonSize}
        >
          {children}
        </View>
      )}
    </Pressable>
  );
});

GlassButton.displayName = 'GlassButton';
