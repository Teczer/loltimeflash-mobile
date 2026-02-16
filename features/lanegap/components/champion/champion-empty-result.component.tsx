import { Ionicons } from '@expo/vector-icons'
import { Text, View } from 'react-native'

import { useTranslation } from '@/hooks/use-translation.hook'
import { colors } from '@/lib/colors'

import { ICON_SIZES } from '@/features/lanegap/constants'

export const ChampionEmptyResult = () => {
  const { t } = useTranslation()

  return (
    <View className="items-center justify-center py-12">
      <Ionicons name="search-outline" size={ICON_SIZES['2xl']} color={colors.mutedForeground} />
      <Text className="mt-3 font-sans text-muted-foreground">
        {t.laneGap.noChampionsFound}
      </Text>
    </View>
  )
}
