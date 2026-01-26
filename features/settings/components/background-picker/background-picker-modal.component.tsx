import { Ionicons } from '@expo/vector-icons'
import { memo, useCallback, useMemo, useState } from 'react'
import { FlatList, Keyboard, Modal, Pressable, Text, View } from 'react-native'

import { CHAMPIONS, type IChampion } from '@/assets/champions'
import { Button, Input } from '@/components/ui'
import { colors } from '@/lib/colors'

import { ChampionRow } from './champion-row.component'
import type { IBackgroundPickerModalProps } from './types'

const BackgroundPickerModalComponent = ({
  visible,
  onClose,
  championName,
  skinIndex,
  onSelectSkin,
  onReset,
}: IBackgroundPickerModalProps) => {
  const [searchQuery, setSearchQuery] = useState('')

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
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View className="bg-background flex-1">
        {/* Header */}
        <View className="border-border flex-row items-center justify-between border-b px-4 py-4">
          <Pressable onPress={onClose} className="p-2">
            <Ionicons name="close" size={24} color={colors.foreground} />
          </Pressable>

          <Text className="font-sans-bold text-foreground text-lg">
            Choose Background
          </Text>

          <Button variant="outline" size="sm" onPress={handleReset}>
            Reset
          </Button>
        </View>

        {/* Search */}
        <View className="flex-row items-center gap-2 px-4 py-3">
          <Input
            placeholder="Search champions..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoCapitalize="none"
            autoCorrect={false}
            clearable
            returnKeyType="search"
            onSubmitEditing={Keyboard.dismiss}
            className="flex-1"
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
          ListEmptyComponent={
            <View className="flex-1 items-center justify-center py-20">
              <Text className="text-muted-foreground font-sans">
                No champions found
              </Text>
            </View>
          }
        />
      </View>
    </Modal>
  )
}

export const BackgroundPickerModal = memo(BackgroundPickerModalComponent)
