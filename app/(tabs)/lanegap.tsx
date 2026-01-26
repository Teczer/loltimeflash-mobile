import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import { useCallback, useMemo, useState } from 'react'
import { Keyboard, Platform, ScrollView, Text, View } from 'react-native'

import { CHAMPIONS, type IChampion } from '@/assets/champions'
import { BackgroundImage } from '@/components/background-image.component'
import { StyledSafeAreaView } from '@/components/styled'
import { GlassButton } from '@/components/ui'
import {
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
  const [selectedLane, setSelectedLane] = useState<TLane>('mid')

  const { favoriteChampions, recentChampions, addRecent } = useLaneGapStore()

  // Filter champions by search and lane
  const filteredChampions = useMemo(() => {
    let result = CHAMPIONS

    // Filter by lane
    result = result.filter((c) => championPlaysLane(c.name, selectedLane))

    // Filter by search
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      result = result.filter((c) => c.name.toLowerCase().includes(query))
    }

    return result
  }, [searchQuery, selectedLane])

  // Favorite champions filtered by lane
  const favoriteChampionsList = useMemo(() => {
    return CHAMPIONS.filter(
      (c) =>
        favoriteChampions.includes(c.name) &&
        championPlaysLane(c.name, selectedLane)
    )
  }, [favoriteChampions, selectedLane])

  // Recent champions filtered by lane
  const recentChampionsList = useMemo(() => {
    return recentChampions
      .map((name) => CHAMPIONS.find((c) => c.name === name))
      .filter(
        (c): c is IChampion =>
          c !== undefined && championPlaysLane(c.name, selectedLane)
      )
      .slice(0, 5)
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
    <BackgroundImage>
      <StyledSafeAreaView className="flex-1" edges={['top']}>
        {/* Floating Glass Settings Button */}
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

          {/* Favorites Section - hide when searching */}
          {!isSearching && favoriteChampionsList.length > 0 && (
            <ChampionSection
              type="favorites"
              champions={favoriteChampionsList}
              onChampionPress={handleChampionPress}
              horizontal
            />
          )}

          {/* Recent Section - hide when searching */}
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
            <Ionicons name="locate" size={14} color="#ef4444" />
            <Text className="font-sans-bold text-foreground/80 text-sm">
              {isSearching
                ? `${filteredChampions.length} results`
                : 'Enemy Champions'}
            </Text>
          </View>

          {/* Champions Grid */}
          {filteredChampions.length === 0 ? (
            <View className="items-center justify-center py-12">
              <Text className="text-muted-foreground font-sans">
                No champions found
              </Text>
            </View>
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
