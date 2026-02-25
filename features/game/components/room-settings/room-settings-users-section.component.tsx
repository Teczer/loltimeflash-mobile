import { memo } from 'react'
import { Text, View } from 'react-native'

import { ConnectionIndicator } from '../connection-indicator.component'
import { SettingsSection } from '../settings-section.component'
import { colors } from '@/lib/colors'

interface IRoomSettingsUsersSectionProps {
  users: string[]
  title: string
  emptyText: string
}

export const RoomSettingsUsersSection = memo(
  (props: IRoomSettingsUsersSectionProps) => {
    const { users, title, emptyText } = props

    return (
      <SettingsSection icon="people" iconColor={colors.gold} title={title}>
        {users.length > 0 ? (
          <View className="flex-row flex-wrap gap-2">
            {users.map((user) => (
              <View
                key={user}
                className="flex-row items-center gap-1 rounded-full bg-white/10 py-1.5 pl-2 pr-3"
              >
                <ConnectionIndicator
                  status="connected"
                  size="sm"
                  animate={false}
                />
                <Text className="text-foreground font-sans text-sm">{user}</Text>
              </View>
            ))}
          </View>
        ) : (
          <Text className="text-muted-foreground font-sans text-sm">
            {emptyText}
          </Text>
        )}
      </SettingsSection>
    )
  }
)
