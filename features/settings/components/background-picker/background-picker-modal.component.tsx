import { memo, useCallback, useMemo, useState } from 'react'
import { FlatList, Keyboard, Text, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { CHAMPIONS, type IChampion } from '@/assets/champions'
import { BottomSheet, TextInput } from '@/components/ui'
import { useTranslation } from '@/hooks/use-translation.hook'

import { ChampionRow } from '@/features/settings/components/background-picker/champion-row.component'
import type { IBackgroundPickerModalProps } from '@/features/settings/components/background-picker/types'

const BackgroundPickerModalComponent = ({
  visible,
  onClose,
  championName,
  skinIndex,
  onSelectSkin,
}: IBackgroundPickerModalProps) => {
  const [searchQuery, setSearchQuery] = useState('')
  const insets = useSafeAreaInsets()
  const { t } = useTranslation()

  const filteredChampions = useMemo(() => {
    if (!searchQuery) return CHAMPIONS
    const query = searchQuery.toLowerCase()
    return CHAMPIONS.filter((champ) => champ.name.toLowerCase().includes(query))
  }, [searchQuery])

  const handleSelectSkin = useCallback(
    (champName: string, skinIdx: number) => {
      onSelectSkin(champName, skinIdx)
      onClose()
    },
    [onSelectSkin, onClose]
  )

  const renderChampion = useCallback(
    ({ item }: { item: IChampion }) => (
      <ChampionRow
        champion={item}
        selectedChampion={championName}
        selectedSkinIndex={skinIndex}
        onSelectSkin={handleSelectSkin}
      />
    ),
    [championName, skinIndex, handleSelectSkin]
  )

  const keyExtractor = useCallback((item: IChampion) => item.name, [])

  return (
    <BottomSheet
      isOpen={visible}
      onClose={onClose}
      title={t.settings.chooseBackground}
      snapPoints={['90%', '50%']}
      showHandle
      disableScroll
    >
      <View className="flex-1 gap-3">
        <TextInput
          placeholder={t.settings.searchChampions}
          value={searchQuery}
          onChangeText={setSearchQuery}
          autoCapitalize="none"
          autoCorrect={false}
          clearable
          returnKeyType="search"
          onSubmitEditing={Keyboard.dismiss}
        />

        <FlatList
          data={filteredChampions}
          style={{ flex: 1 }}
          renderItem={renderChampion}
          keyExtractor={keyExtractor}
          showsVerticalScrollIndicator={false}
          removeClippedSubviews
          maxToRenderPerBatch={8}
          windowSize={5}
          initialNumToRender={8}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
          onScrollBeginDrag={Keyboard.dismiss}
          contentContainerStyle={{ paddingBottom: insets.bottom + 16 }}
          ListEmptyComponent={
            <View className="flex-1 items-center justify-center py-20">
              <Text className="text-muted-foreground font-sans">
                {t.settings.noChampionsFound}
              </Text>
            </View>
          }
        />
      </View>
    </BottomSheet>
  )
}

export const BackgroundPickerModal = memo(BackgroundPickerModalComponent)
