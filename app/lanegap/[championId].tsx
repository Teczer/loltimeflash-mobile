import { Ionicons } from '@expo/vector-icons'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { Image, Pressable, ScrollView, Text, View } from 'react-native'

import { getChampion, getChampionIcon } from '@/assets/champions'
import { StyledSafeAreaView } from '@/components/styled'
import { GlassButton } from '@/components/ui'
import {
  ChampionBackground,
  ChampionDetailSkeleton,
  CounterPickCard,
  ItemSpikeItem,
  LevelSpikeItem,
  SectionCard,
  TierLegend,
  TipItem,
} from '@/features/lanegap/components'
import { useEnemyChampion } from '@/features/lanegap/hooks'
import { useLaneGapStore } from '@/features/lanegap/stores'
import { colors } from '@/lib/colors'

export default function ChampionDetailScreen() {
  const router = useRouter()
  const { championId } = useLocalSearchParams<{ championId: string }>()

  const { data: enemyData, isLoading } = useEnemyChampion(championId || '')

  const { favoriteChampions, toggleFavorite } = useLaneGapStore()
  const isFavorite = championId ? favoriteChampions.includes(championId) : false

  const champion = championId ? getChampion(championId) : undefined
  const championIcon = championId ? getChampionIcon(championId) : null

  if (!champion) {
    return (
      <View className="bg-background flex-1">
        <StyledSafeAreaView className="flex-1 items-center justify-center">
          <Text className="text-foreground font-sans">Champion not found</Text>
          <GlassButton onPress={() => router.back()} className="mt-4">
            <Text className="text-foreground font-sans">Go back</Text>
          </GlassButton>
        </StyledSafeAreaView>
      </View>
    )
  }

  return (
    <View className="flex-1 bg-transparent">
      {/* Champion Splash Background */}
      <ChampionBackground championId={championId || ''} />

      <StyledSafeAreaView className="flex-1" edges={['top']}>
        {/* Header */}
        <View className="flex-row items-center justify-between px-4 py-3">
          <View className="flex-row items-center gap-3">
            <Pressable
              onPress={() => router.back()}
              className="size-9 items-center justify-center rounded-full transition-all active:scale-95 active:bg-white/15"
            >
              <Ionicons name="arrow-back" size={20} color={colors.foreground} />
            </Pressable>

            {championIcon && (
              <Image
                source={championIcon}
                className="size-14 rounded-xl border-2 border-white/20"
                resizeMode="cover"
              />
            )}

            <View>
              <Text className="font-sans-medium text-danger text-xs uppercase tracking-wider">
                Facing Enemy
              </Text>
              <Text className="font-sans-bold text-foreground text-2xl uppercase">
                {champion.name}
              </Text>
              {enemyData?.dateEdited && (
                <Text className="text-muted-foreground text-xs">
                  Updated: {enemyData.dateEdited}
                </Text>
              )}
            </View>
          </View>

          {/* Favorite Button */}
          <GlassButton
            size={36}
            onPress={() => championId && toggleFavorite(championId)}
          >
            <Ionicons
              name={isFavorite ? 'star' : 'star-outline'}
              size={16}
              color={isFavorite ? colors.goldLight : colors.foreground}
            />
          </GlassButton>
        </View>

        {isLoading ? (
          <ChampionDetailSkeleton />
        ) : (
          <ScrollView
            className="flex-1"
            contentContainerClassName="px-4 pb-8 gap-4"
            contentInsetAdjustmentBehavior="automatic"
            showsVerticalScrollIndicator={false}
          >
            {/* Counter Picks */}
            <SectionCard
              title={`Best picks against ${champion.name}`}
              icon="shield-outline"
              iconColor={colors.success}
              isEmpty={!enemyData?.counters?.length}
              emptyText="Counter picks coming soon..."
              headerRight={<TierLegend />}
            >
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerClassName="gap-2"
              >
                {enemyData?.counters?.map((counter) => (
                  <CounterPickCard
                    key={counter.championId}
                    championId={counter.championId}
                    championName={counter.championId}
                    tier={counter.tier}
                    onPress={() =>
                      router.push(`/lanegap/${counter.championId}`)
                    }
                  />
                ))}
              </ScrollView>
            </SectionCard>

            {/* Tips */}
            <SectionCard
              title={`How to play against ${champion.name}`}
              icon="locate"
              iconColor={colors.danger}
              isEmpty={!enemyData?.tips?.length}
              emptyText="Tips coming soon..."
            >
              <View className="gap-3">
                {enemyData?.tips?.map((tip, index) => (
                  <TipItem key={index} tip={tip} index={index} />
                ))}
              </View>
            </SectionCard>

            {/* Level Spikes */}
            <SectionCard
              title={`${champion.name} Power Spikes`}
              icon="trending-up-outline"
              iconColor={colors.info}
              isEmpty={!enemyData?.levelSpikes?.length}
              emptyText="Power spikes coming soon..."
            >
              <View className="gap-4">
                {enemyData?.levelSpikes?.map((spike) => (
                  <LevelSpikeItem key={spike.level} spike={spike} />
                ))}
              </View>
            </SectionCard>

            {/* Item Spikes */}
            <SectionCard
              title={`${champion.name} Item Spikes`}
              icon="cube-outline"
              iconColor={colors.goldLight}
              isEmpty={!enemyData?.itemSpikes?.length}
              emptyText="Item spikes coming soon..."
            >
              <View className="gap-4">
                {enemyData?.itemSpikes?.map((spike) => (
                  <ItemSpikeItem key={spike.itemId} spike={spike} />
                ))}
              </View>
            </SectionCard>

            {/* Notes Section - Coming Soon */}
            <SectionCard
              title={`My notes vs ${champion.name}`}
              icon="document-text-outline"
              iconColor={colors.mutedForeground}
              isEmpty={true}
              emptyText="Auth feature incoming soon..."
            >
              <View />
            </SectionCard>
          </ScrollView>
        )}
      </StyledSafeAreaView>
    </View>
  )
}
