import { Ionicons } from '@expo/vector-icons'
import { memo, useCallback, useMemo, useState } from 'react'
import {
  FlatList,
  Keyboard,
  Modal,
  Platform,
  Pressable,
  Text,
  View,
} from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { CHAMPIONS, type IChampion } from '@/assets/champions'
import { Button, TextInput } from '@/components/ui'
import { useTranslation } from '@/hooks/use-translation.hook'
import { colors } from '@/lib/colors'

import { ChampionRow } from '@/features/settings/components/background-picker/champion-row.component'
import type { IBackgroundPickerModalProps } from '@/features/settings/components/background-picker/types'

const BackgroundPickerModalComponent = ({
  visible,
  onClose,
  championName,
  skinIndex,
  onSelectSkin,
  onReset,
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

  const handleReset = useCallback(() => {
    onReset()
    onClose()
  }, [onReset, onClose])

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
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle={Platform.OS === 'ios' ? 'pageSheet' : 'fullScreen'}
      onRequestClose={onClose}
    >
      <View
        className="bg-background flex-1"
        style={{ paddingTop: Platform.OS === 'android' ? insets.top : 0 }}
      >
        {/* Header */}
        <View className="border-border flex-row items-center justify-between border-b px-4 py-4">
          <Pressable
            onPress={onClose}
            className="size-10 items-center justify-center rounded-full active:bg-white/10"
          >
            <Ionicons name="close" size={24} color={colors.foreground} />
          </Pressable>

          <Text className="font-sans-bold text-foreground text-lg">
            {t.settings.chooseBackground}
          </Text>

          <Button variant="outline" size="sm" onPress={handleReset}>
            {t.common.reset}
          </Button>
        </View>

        {/* Search */}
        <View className="px-4 py-3">
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
        </View>

        {/* Champion List */}
        <FlatList
          data={filteredChampions}
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
    </Modal>
  )
}

export const BackgroundPickerModal = memo(BackgroundPickerModalComponent)
