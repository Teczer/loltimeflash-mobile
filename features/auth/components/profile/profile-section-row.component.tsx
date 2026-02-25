import { FontAwesome } from '@expo/vector-icons'
import { memo } from 'react'
import { Pressable, Text, View } from 'react-native'

import { useTranslation } from '@/hooks/use-translation.hook'
import { colors } from '@/lib/colors'
import { cn } from '@/lib/utils'

type TSectionPosition = 'first' | 'middle' | 'last' | 'single'

interface IProfileSectionRowProps {
  title: string
  value: string
  isVerified?: boolean
  onEdit?: () => void
  variant?: 'default' | 'danger'
  position?: TSectionPosition
}

const POSITION_CLASSES: Record<TSectionPosition, string> = {
  first: 'rounded-t-xl',
  middle: 'border-b border-white/10',
  last: 'rounded-b-xl',
  single: 'rounded-xl',
}

export const ProfileSectionRow = memo((props: IProfileSectionRowProps) => {
  const {
    title,
    value,
    isVerified,
    onEdit,
    variant = 'default',
    position = 'single',
  } = props
  const { t } = useTranslation()

  const valueColor = variant === 'danger' ? 'text-danger' : 'text-foreground'

  return (
    <Pressable
      onPress={onEdit}
      disabled={!onEdit}
      className={cn(
        'flex-row items-start justify-between bg-white/5 px-4 py-3 active:bg-white/10',
        POSITION_CLASSES[position]
      )}
    >
      <View className="flex-1 gap-1">
        <Text className="text-muted-foreground text-xs font-semibold">
          {title}
        </Text>
        <Text
          className={cn(valueColor, 'text-xs font-semibold')}
          numberOfLines={2}
          ellipsizeMode="tail"
        >
          {value}
        </Text>
      </View>

      {isVerified && (
        <View className="ml-3 shrink-0 items-center justify-center self-center">
          <View className="bg-success/20 rounded-full px-2 py-0.5">
            <Text className="text-success text-xs font-semibold">
              {t.settings.verified}
            </Text>
          </View>
        </View>
      )}

      {variant !== 'danger' && onEdit && (
        <View className="ml-3 pt-0.5">
          <FontAwesome name={'pencil'} size={16} color={colors.info} />
        </View>
      )}
    </Pressable>
  )
})
