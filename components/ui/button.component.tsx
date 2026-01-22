import { memo } from 'react';
import { Pressable, Text, View, type PressableProps } from 'react-native';
import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';

import { cn } from '@/lib/utils';

type TButtonVariant = 'default' | 'outline' | 'ghost' | 'destructive';
type TButtonSize = 'default' | 'sm' | 'lg' | 'icon';

interface IButtonProps extends Omit<PressableProps, 'children'> {
  children?: React.ReactNode;
  variant?: TButtonVariant;
  size?: TButtonSize;
  className?: string;
  textClassName?: string;
  icon?: React.ReactNode;
}

const variantStyles: Record<TButtonVariant, string> = {
  default: 'bg-primary',
  outline: 'border border-border bg-transparent',
  ghost: 'bg-transparent',
  destructive: 'bg-destructive',
};

const variantTextStyles: Record<TButtonVariant, string> = {
  default: 'text-background',
  outline: 'text-foreground',
  ghost: 'text-foreground',
  destructive: 'text-foreground',
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

  const handlePress = (e: any) => {
    if (Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    onPress?.(e);
  };

  return (
    <Pressable
      className={cn(
        'items-center justify-center rounded-lg',
        variantStyles[variant],
        sizeStyles[size],
        disabled && 'opacity-50',
        className
      )}
      onPress={handlePress}
      disabled={disabled}
      {...rest}
    >
      {({ pressed }) => (
        <View className={cn('flex-row items-center gap-2', pressed && 'opacity-70')}>
          {icon}
          {typeof children === 'string' ? (
            <Text
              className={cn(
                'font-semibold',
                variantTextStyles[variant],
                sizeTextStyles[size],
                textClassName
              )}
            >
              {children}
            </Text>
          ) : (
            children
          )}
        </View>
      )}
    </Pressable>
  );
};

export const Button = memo(ButtonComponent);
