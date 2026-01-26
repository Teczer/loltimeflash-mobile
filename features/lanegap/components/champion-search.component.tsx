import { memo } from 'react'
import { Keyboard, View } from 'react-native'

import { Input } from '@/components/ui'

interface IChampionSearchProps {
  value: string
  onChangeText: (text: string) => void
}

const ChampionSearchComponent = ({ value, onChangeText }: IChampionSearchProps) => (
  <View className="mx-4 mb-4">
    <Input
      placeholder="Search enemy champion..."
      value={value}
      onChangeText={onChangeText}
      autoCapitalize="none"
      autoCorrect={false}
      clearable
      returnKeyType="search"
      onSubmitEditing={Keyboard.dismiss}
    />
  </View>
)

export const ChampionSearch = memo(ChampionSearchComponent)
