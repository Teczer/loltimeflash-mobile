import { Ionicons } from '@expo/vector-icons'
import type { ReactNode } from 'react'
import { Pressable, Text, View } from 'react-native'

import { colors } from '@/lib/colors'

type TCardVariant = 'gold' | 'info' | 'success' | 'warning' | 'muted'

interface ISettingsCardProps {
  icon?: keyof typeof Ionicons.glyphMap
  leftElement?: ReactNode
  title: string
  subtitle?: string
  variant?: TCardVariant
  rightElement?: ReactNode
  onPress?: () => void
}

const VARIANT_CONFIG: Record<TCardVariant, { bg: string; color: string }> = {
  gold: { bg: 'bg-gold/20', color: colors.gold },
  info: { bg: 'bg-info/20', color: colors.info },
  success: { bg: 'bg-success/20', color: colors.success },
  warning: { bg: 'bg-warning/20', color: colors.warning },
  muted: { bg: 'bg-white/10', color: colors.mutedForeground },
}

export const SettingsCard = ({
  icon,
  leftElement,
  title,
  subtitle,
  variant = 'gold',
  rightElement,
  onPress,
}: ISettingsCardProps) => {
  const config = VARIANT_CONFIG[variant]

  const content = (
    <View className="border-input min-h-[72px] flex-row items-center justify-between rounded-xl border bg-white/5 p-4">
      <View className="flex-row items-center gap-3">
        {leftElement || (
          icon && (
            <View className={`size-10 items-center justify-center rounded-full ${config.bg}`}>
              <Ionicons name={icon} size={20} color={config.color} />
            </View>
          )
        )}
        <View>
          <Text className="text-foreground font-sans font-medium">{title}</Text>
          {subtitle && (
            <Text className="text-muted-foreground font-sans text-xs">
              {subtitle}
            </Text>
          )}
        </View>
      </View>
      {rightElement}
    </View>
  )

  if (onPress) {
    return (
      <Pressable onPress={onPress} className="active:opacity-80">
        {content}
      </Pressable>
    )
  }

  return content
}
