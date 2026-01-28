import { Text, View } from 'react-native'

import { TitleText } from '@/components/ui'
import config from '@/lib/config'

interface ILaneGapHeaderProps {
  championCount: number
}

export const LaneGapHeader = ({ championCount }: ILaneGapHeaderProps) => (
  <View className="items-center gap-1">
    <View className="flex-row items-center justify-center">
      <TitleText size="xl">LANE</TitleText>
      <TitleText size="xl" variant="gold">
        GAP
      </TitleText>
    </View>
    <Text className="font-sans-medium text-sm text-foreground">
      Select the enemy champion you are facing
    </Text>
    <Text className="text-center text-xs text-muted-foreground">
      {championCount} champions · Patch {config.patchVersion}
    </Text>
  </View>
)
