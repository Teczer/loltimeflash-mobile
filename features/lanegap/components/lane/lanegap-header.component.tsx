import { Text, View } from 'react-native'

import { TitleText } from '@/components/ui'
import { useTranslation } from '@/hooks/use-translation.hook'
import config from '@/lib/config'

interface ILaneGapHeaderProps {
  championCount: number
}

export const LaneGapHeader = ({ championCount }: ILaneGapHeaderProps) => {
  const { t } = useTranslation()

  return (
    <View className="items-center gap-1">
      <View className="flex-row items-center justify-center">
        <TitleText size="xl">LANE</TitleText>
        <TitleText size="xl" variant="gold">
          GAP
        </TitleText>
      </View>
      <Text className="font-sans-medium text-sm text-foreground">
        {t.laneGap.selectEnemy}
      </Text>
      <Text className="text-center text-xs text-muted-foreground">
        {t.laneGap.championsCount
          .replace('{count}', String(championCount))
          .replace('{patch}', config.patchVersion)}
      </Text>
    </View>
  )
}
