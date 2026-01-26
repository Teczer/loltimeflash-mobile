import { colors } from '@/lib/colors'
import { Ionicons } from '@expo/vector-icons'
import { memo, type ReactNode } from 'react'
import { Text, View } from 'react-native'

interface ISectionCardProps {
  title: string
  icon: keyof typeof Ionicons.glyphMap
  iconColor: string
  children: ReactNode
  emptyText?: string
  isEmpty?: boolean
  headerRight?: ReactNode
}

/**
 * Section card matching web's Card component
 * Web: bg-white/[0.03] border border-white/[0.06] rounded-xl p-4
 */
const SectionCardComponent = ({
  title,
  icon,
  iconColor,
  children,
  emptyText = 'Coming soon...',
  isEmpty = false,
  headerRight,
}: ISectionCardProps) => (
  <View className="bg-white/3 border-white/6 rounded-xl border p-4">
    {/* CardHeader */}
    <View className="mb-3 flex-row items-center justify-between">
      <View className="flex-row items-center gap-2">
        <Ionicons name={icon} size={16} color={iconColor} />
        {/* CardTitle: text-base font-semibold text-white */}
        <Text className="font-sans-bold text-base uppercase text-white">
          {title}
        </Text>
      </View>
      {headerRight}
    </View>

    {/* CardContent */}
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

export const SectionCard = memo(SectionCardComponent)
