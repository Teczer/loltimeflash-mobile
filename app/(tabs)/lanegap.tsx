import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import { useCallback, useMemo, useState } from 'react'
import { Keyboard, Platform, ScrollView, Text, View } from 'react-native'

import { CHAMPIONS, type IChampion } from '@/assets/champions'
import { BackgroundImage } from '@/components/background-image.component'
import { StyledSafeAreaView } from '@/components/styled'
import { GlassButton } from '@/components/ui'
import {
  ChampionEmptyResult,
  ChampionItem,
  ChampionSearch,
  ChampionSection,
  LaneFilter,
  LaneGapHeader,
} from '@/features/lanegap/components'
import { championPlaysLane, type TLane } from '@/features/lanegap/data'
import { useLaneGapStore } from '@/features/lanegap/stores'
import { colors } from '@/lib/colors'

export default function LaneGapScreen() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedLane, setSelectedLane] = useState<TLane>('all')

  const { favoriteChampions, recentChampions, addRecent } = useLaneGapStore()

  const filteredChampions = useMemo(() => {
    let result = CHAMPIONS

    result = result.filter((c) => championPlaysLane(c.name, selectedLane))

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      result = result.filter((c) => c.name.toLowerCase().includes(query))
    }

    return result
  }, [searchQuery, selectedLane])

  const favoriteChampionsList = useMemo(() => {
    return CHAMPIONS.filter(
      (c) =>
        favoriteChampions.includes(c.name) &&
        championPlaysLane(c.name, selectedLane)
    )
  }, [favoriteChampions, selectedLane])

  const recentChampionsList = useMemo(() => {
    return recentChampions
      .map((name) => CHAMPIONS.find((c) => c.name === name))
      .filter(
        (c): c is IChampion =>
          c !== undefined && championPlaysLane(c.name, selectedLane)
      )
      .slice(0, 4)
  }, [recentChampions, selectedLane])

  const handleChampionPress = useCallback(
    (champion: IChampion) => {
      addRecent(champion.name)
      router.push(`/lanegap/${champion.name}`)
    },
    [router, addRecent]
  )

  const handleOpenSettings = () => {
    router.push('/settings')
  }

  const isSearching = searchQuery.trim().length > 0

  return (
    <BackgroundImage variant="fast">
      <StyledSafeAreaView className="flex-1" edges={['top']}>
        <GlassButton
          onPress={handleOpenSettings}
          className={`absolute right-4 z-50 ${Platform.OS === 'ios' ? 'top-14' : 'top-4'}`}
        >
          <Ionicons
            name="settings-outline"
            size={22}
            color={colors.foreground}
          />
        </GlassButton>

        <ScrollView
          className="flex-1"
          contentContainerClassName="pb-24"
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
          onScrollBeginDrag={Keyboard.dismiss}
        >
          <LaneGapHeader championCount={filteredChampions.length} />
          <ChampionSearch value={searchQuery} onChangeText={setSearchQuery} />
          <LaneFilter
            selectedLane={selectedLane}
            onSelectLane={setSelectedLane}
          />

          {!isSearching && favoriteChampionsList.length > 0 && (
            <ChampionSection
              type="favorites"
              champions={favoriteChampionsList}
              onChampionPress={handleChampionPress}
              horizontal
            />
          )}

          {!isSearching && recentChampionsList.length > 0 && (
            <ChampionSection
              type="recent"
              champions={recentChampionsList}
              onChampionPress={handleChampionPress}
              horizontal
            />
          )}

          {/* Enemy Champions Section Title */}
          <View className="mb-2 flex-row items-center gap-2 px-4">
            <Ionicons name="locate" size={14} color={colors.danger} />
            <Text className="font-sans-bold text-foreground/80 text-sm">
              {isSearching
                ? `${filteredChampions.length} results`
                : 'Enemy Champions'}
            </Text>
          </View>

          {/* Champions Grid */}
          {filteredChampions.length === 0 ? (
            <ChampionEmptyResult />
          ) : (
            <View className="flex-row flex-wrap px-3">
              {filteredChampions.map((champion) => (
                <ChampionItem
                  key={champion.name}
                  champion={champion}
                  onPress={() => handleChampionPress(champion)}
                />
              ))}
            </View>
          )}
        </ScrollView>
      </StyledSafeAreaView>
    </BackgroundImage>
  )
}
