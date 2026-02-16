import { Ionicons } from '@expo/vector-icons'
import { Text, View } from 'react-native'

import { colors } from '@/lib/colors'

import { ICON_SIZES } from '@/features/lanegap/constants'

export const ChampionEmptyResult = () => (
  <View className="items-center justify-center py-12">
    <Ionicons name="search-outline" size={ICON_SIZES['2xl']} color={colors.mutedForeground} />
    <Text className="mt-3 font-sans text-muted-foreground">
      No champions found
    </Text>
  </View>
)
