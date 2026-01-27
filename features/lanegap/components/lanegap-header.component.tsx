import { Text, View } from 'react-native'

import { TitleText } from '@/components/ui'
import config from '@/lib/config'

interface ILaneGapHeaderProps {
  championCount: number
}

export const LaneGapHeader = ({ championCount }: ILaneGapHeaderProps) => (
  <View className="px-4 py-4">
    <View className="flex-row items-center justify-center">
      <TitleText size="xl">LANE</TitleText>
      <TitleText size="xl" variant="gold">
        GAP
      </TitleText>
    </View>
    <View className="items-center justify-center">
      <Text className="text-foreground font-sans-medium text-sm">
        Select the enemy champion you are facing
      </Text>
    </View>

    <Text className="text-muted-foreground mt-1 text-center text-xs">
      {championCount} champions · Patch {config.patchVersion}
    </Text>
  </View>
)
