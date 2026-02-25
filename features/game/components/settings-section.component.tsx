import { Ionicons } from '@expo/vector-icons'
import type { ReactNode } from 'react'
import { Text, View } from 'react-native'

interface ISettingsSectionProps {
  icon: keyof typeof Ionicons.glyphMap
  iconColor: string
  title: string
  children: ReactNode
  className?: string
}

export const SettingsSection = ({
  icon,
  iconColor,
  title,
  children,
  className = 'mb-6',
}: ISettingsSectionProps) => (
  <View className={className}>
    <View className="mb-3 flex-row items-center gap-2">
      <Ionicons name={icon} size={16} color={iconColor} />
      <Text className="text-foreground font-sans-bold text-sm">{title}</Text>
    </View>
    {children}
  </View>
)
