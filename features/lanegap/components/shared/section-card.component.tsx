import { Ionicons } from '@expo/vector-icons'
import type { ReactNode } from 'react'
import { Text, View } from 'react-native'

import { colors } from '@/lib/colors'
import { cn } from '@/lib/utils'

interface ISectionCardProps {
  title: string
  icon: keyof typeof Ionicons.glyphMap
  iconColor: string
  children: ReactNode
  emptyText?: string
  isEmpty?: boolean
  headerRight?: ReactNode
  className?: string
}

export const SectionCard = ({
  title,
  icon,
  iconColor,
  children,
  emptyText = 'Coming soon...',
  isEmpty = false,
  headerRight,
  className,
}: ISectionCardProps) => (
  <View
    className={cn('bg-white/3 border-white/6 rounded-xl border p-4', className)}
  >
    <View className="mb-3 flex-row items-center justify-between">
      <View className="flex-row items-center gap-2">
        <Ionicons name={icon} size={16} color={iconColor} />
        <Text className="font-sans-bold text-base uppercase text-white">
          {title}
        </Text>
      </View>
      {headerRight}
    </View>

    {isEmpty ? (
      <View className="items-center justify-center rounded-lg bg-white/5 py-8">
        <Ionicons name="sparkles-outline" size={24} color={colors.goldLight} />
        <Text className="mt-2 text-sm text-white/50">{emptyText}</Text>
      </View>
    ) : (
      children
    )}
  </View>
)
