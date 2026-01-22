import * as Haptics from 'expo-haptics';
import { memo, useState } from 'react';
import { Platform, Pressable, Text, type PressableProps } from 'react-native';

import { cn } from '@/lib/utils';

type TButtonVariant = 'default' | 'outline' | 'ghost' | 'destructive';
type TButtonSize = 'default' | 'sm' | 'lg' | 'icon';

interface IButtonProps extends Omit<PressableProps, 'children'> {
  children: string;
  variant?: TButtonVariant;
  size?: TButtonSize;
  className?: string;
  textClassName?: string;
  icon?: React.ReactNode;
}

const variantStyles: Record<TButtonVariant, { normal: string; pressed: string }> = {
  default: {
    normal: 'bg-primary',
    pressed: 'bg-primary/80',
  },
  outline: {
    normal: 'border border-input bg-background',
    pressed: 'bg-white border-white',
  },
  ghost: {
    normal: 'bg-transparent',
    pressed: 'bg-white/10',
  },
  destructive: {
    normal: 'bg-destructive',
    pressed: 'bg-destructive/80',
  },
};

const textStyles: Record<TButtonVariant, { normal: string; pressed: string }> = {
  default: {
    normal: 'text-background',
    pressed: 'text-background',
  },
  outline: {
    normal: 'text-foreground',
    pressed: 'text-background',
  },
  ghost: {
    normal: 'text-foreground',
    pressed: 'text-foreground',
  },
  destructive: {
    normal: 'text-foreground',
    pressed: 'text-foreground',
  },
};

const sizeStyles: Record<TButtonSize, string> = {
  default: 'px-4 py-3',
  sm: 'px-3 py-2',
  lg: 'px-6 py-4',
  icon: 'p-3',
};

const sizeTextStyles: Record<TButtonSize, string> = {
  default: 'text-base',
  sm: 'text-sm',
  lg: 'text-lg',
  icon: 'text-base',
};

const ButtonComponent = (props: IButtonProps) => {
  const {
    children,
    variant = 'default',
    size = 'default',
    className,
    textClassName,
    icon,
    onPress,
    disabled,
    ...rest
  } = props;

  const [isPressed, setIsPressed] = useState(false);

  const handlePress = (e: any) => {
    if (Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    onPress?.(e);
  };

  const currentVariantStyle = isPressed
    ? variantStyles[variant].pressed
    : variantStyles[variant].normal;

  const currentTextStyle = isPressed
    ? textStyles[variant].pressed
    : textStyles[variant].normal;

  return (
    <Pressable
      className={cn(
        'flex-row items-center justify-center gap-2 rounded-lg',
        sizeStyles[size],
        currentVariantStyle,
        disabled && 'opacity-50',
        className
      )}
      onPress={handlePress}
      onPressIn={() => setIsPressed(true)}
      onPressOut={() => setIsPressed(false)}
      disabled={disabled}
      {...rest}
    >
      {icon}
      <Text
        className={cn(
          'font-sans-bold text-center',
          sizeTextStyles[size],
          currentTextStyle,
          textClassName
        )}
      >
        {children}
      </Text>
    </Pressable>
  );
};

export const Button = memo(ButtonComponent);
