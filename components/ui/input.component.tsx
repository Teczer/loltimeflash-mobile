import { Ionicons } from '@expo/vector-icons'
import { memo } from 'react'
import { Pressable, TextInput, View, type TextInputProps } from 'react-native'

import { colors } from '@/lib/colors'
import { cn } from '@/lib/utils'

interface IInputProps extends TextInputProps {
  className?: string
  clearable?: boolean
}

const InputComponent = (props: IInputProps) => {
  const { className, clearable = false, value, onChangeText, ...rest } = props

  const showClearButton = clearable && value && value.length > 0

  if (clearable) {
    return (
      <View className={cn('relative', className)}>
        <TextInput
          className="w-full rounded-lg border border-input bg-background px-4 pb-4 pr-10 pt-2 text-base text-foreground"
          placeholderTextColor={colors.mutedForeground}
          cursorColor={colors.border}
          selectionColor={colors.border}
          value={value}
          onChangeText={onChangeText}
          {...rest}
        />
        {showClearButton && (
          <Pressable
            onPress={() => onChangeText?.('')}
            className="absolute right-3 top-1/2 -translate-y-1/2"
            hitSlop={8}
          >
            <Ionicons name="close-circle" size={20} color={colors.mutedForeground} />
          </Pressable>
        )}
      </View>
    )
  }

  return (
    <TextInput
      className={cn(
        'rounded-lg border border-input bg-background px-4 pb-4 pt-2 text-base text-foreground',
        className
      )}
      placeholderTextColor={colors.mutedForeground}
      cursorColor={colors.border}
      selectionColor={colors.border}
      value={value}
      onChangeText={onChangeText}
      {...rest}
    />
  )
}

export const Input = memo(InputComponent)
