import { Ionicons } from '@expo/vector-icons'
import { memo, useCallback, useMemo, useState } from 'react'
import { FlatList, Keyboard, Modal, Platform, Pressable, Text, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { CHAMPIONS, type IChampion } from '@/assets/champions'
import { Button, TextInput } from '@/components/ui'
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
  const insets = useSafeAreaInsets()

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
        className="flex-1 bg-background"
        style={{ paddingTop: Platform.OS === 'android' ? insets.top : 0 }}
      >
        {/* Header */}
        <View className="flex-row items-center justify-between border-b border-border px-4 py-4">
          <Pressable 
            onPress={onClose} 
            className="size-10 items-center justify-center rounded-full active:bg-white/10"
          >
            <Ionicons name="close" size={24} color={colors.foreground} />
          </Pressable>

          <Text className="font-sans-bold text-lg text-foreground">
            Choose Background
          </Text>

          <Button variant="outline" size="sm" onPress={handleReset}>
            Reset
          </Button>
        </View>

        {/* Search */}
        <View className="px-4 py-3">
          <TextInput
            placeholder="Search champions..."
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
              <Text className="font-sans text-muted-foreground">
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
