import { memo } from 'react'

import { SettingsSection } from '../settings-section.component'
import { SummonerInput } from '../summoner-input.component'
import type { ILiveGameData } from '@/features/game/types/riot.types'
import { colors } from '@/lib/colors'

interface IRoomSettingsFetchSectionProps {
  onGameDataFetched: (data: ILiveGameData) => void
  title: string
}

export const RoomSettingsFetchSection = memo(
  (props: IRoomSettingsFetchSectionProps) => {
    const { onGameDataFetched, title } = props

    return (
      <SettingsSection
        icon="game-controller"
        iconColor={colors.success}
        title={title}
      >
        <SummonerInput onGameDataFetched={onGameDataFetched} />
      </SettingsSection>
    )
  }
)
