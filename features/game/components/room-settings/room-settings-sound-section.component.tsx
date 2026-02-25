import { memo } from 'react'

import { CustomToggle } from '../custom-toggle.component'
import { SettingsCard } from '../settings-card.component'
import { SettingsSection } from '../settings-section.component'
import { colors } from '@/lib/colors'

interface IRoomSettingsSoundSectionProps {
  title: string
  soundOnLabel: string
  soundOffLabel: string
  subtitle: string
  volume: 'on' | 'off'
  onVolumeChange: (value: boolean) => void
}

export const RoomSettingsSoundSection = memo(
  (props: IRoomSettingsSoundSectionProps) => {
    const {
      title,
      soundOnLabel,
      soundOffLabel,
      subtitle,
      volume,
      onVolumeChange,
    } = props

    const isOn = volume === 'on'

    return (
      <SettingsSection
        icon="musical-notes"
        iconColor={colors.info}
        title={title}
      >
        <SettingsCard
          icon={isOn ? 'volume-high' : 'volume-mute'}
          title={isOn ? soundOnLabel : soundOffLabel}
          subtitle={subtitle}
          variant={isOn ? 'gold' : 'muted'}
          rightElement={
            <CustomToggle value={isOn} onValueChange={onVolumeChange} />
          }
        />
      </SettingsSection>
    )
  }
)
