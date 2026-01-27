import { Ionicons } from '@expo/vector-icons'
import { GlassView, isLiquidGlassAvailable } from 'expo-glass-effect'
import {
  Platform,
  Pressable,
  TextInput as RNTextInput,
  StyleSheet,
  View,
  type TextInputProps,
} from 'react-native'

import { colors } from '@/lib/colors'
import { cn } from '@/lib/utils'

type TTextInputVariant = 'default' | 'glass'

interface ITextInputProps extends TextInputProps {
  className?: string
  clearable?: boolean
  variant?: TTextInputVariant
}

const INPUT_HEIGHT = 48

export const TextInput = (props: ITextInputProps) => {
  const {
    className,
    clearable = false,
    variant = 'default',
    value,
    onChangeText,
    editable = true,
    ...rest
  } = props

  const showClearButton = clearable && value && value.length > 0 && editable
  const canUseGlass =
    Platform.OS === 'ios' && isLiquidGlassAvailable() && variant === 'glass'

  const clearButton = showClearButton && (
    <Pressable
      onPress={() => onChangeText?.('')}
      className="absolute right-3 top-1/2 -translate-y-1/2"
      hitSlop={8}
    >
      <Ionicons name="close-circle" size={20} color={colors.mutedForeground} />
    </Pressable>
  )

  // Glass variant with Liquid Glass effect
  if (canUseGlass) {
    return (
      <View className={cn('relative', className)}>
        <GlassView
          style={styles.glassContainer}
          glassEffectStyle="regular"
          isInteractive
        >
          <RNTextInput
            style={styles.glassInput}
            placeholderTextColor={colors.mutedForeground}
            cursorColor={colors.gold}
            selectionColor={colors.gold}
            value={value}
            onChangeText={onChangeText}
            editable={editable}
            {...rest}
          />
        </GlassView>
        {clearButton}
      </View>
    )
  }

  // Clearable variant with wrapper
  if (clearable) {
    return (
      <View className={cn('relative', className)}>
        <View className="border-input bg-background h-12 justify-center rounded-xl border">
          <RNTextInput
            className={cn(
              'text-foreground px-4 text-base',
              showClearButton && 'pr-10',
              !editable && 'opacity-70'
            )}
            placeholderTextColor={colors.mutedForeground}
            cursorColor={colors.gold}
            selectionColor={colors.gold}
            value={value}
            onChangeText={onChangeText}
            editable={editable}
            textAlignVertical="center"
            {...rest}
          />
        </View>
        {clearButton}
      </View>
    )
  }

  // Default variant
  return (
    <View
      className={cn(
        'border-input bg-background h-12 justify-center rounded-xl border',
        !editable && 'opacity-70',
        className
      )}
    >
      <RNTextInput
        className="text-foreground px-4 text-base"
        placeholderTextColor={colors.mutedForeground}
        cursorColor={colors.gold}
        selectionColor={colors.gold}
        value={value}
        onChangeText={onChangeText}
        editable={editable}
        textAlignVertical="center"
        {...rest}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  glassContainer: {
    height: INPUT_HEIGHT,
    borderRadius: 12,
    justifyContent: 'center',
  },
  glassInput: {
    paddingHorizontal: 16,
    fontSize: 16,
    color: colors.foreground,
  },
})
