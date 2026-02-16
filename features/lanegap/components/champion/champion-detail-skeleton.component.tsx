import { ScrollView, View } from 'react-native'

import { Skeleton, SkeletonCard } from '@/components/ui'

export const ChampionDetailSkeleton = () => {
  return (
    <ScrollView
      className="flex-1"
      contentContainerClassName="px-4 pb-8 gap-4"
      showsVerticalScrollIndicator={false}
    >
      {/* Counter Picks Section */}
      <SkeletonCard>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          scrollEnabled={false}
          contentContainerClassName="gap-2"
        >
          {[1, 2, 3, 4].map((i) => (
            <View
              key={i}
              className="items-center gap-2 rounded-xl bg-white/5 p-3"
            >
              <Skeleton className="size-14 rounded-xl" />
              <Skeleton className="h-3 w-12" />
              <Skeleton className="h-5 w-8 rounded-full" />
            </View>
          ))}
        </ScrollView>
      </SkeletonCard>

      {/* Tips Section */}
      <SkeletonCard>
        <View className="gap-3">
          {[1, 2, 3].map((i) => (
            <View key={i} className="flex-row gap-3">
              <Skeleton className="size-6 rounded-full" />
              <View className="flex-1 gap-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </View>
            </View>
          ))}
        </View>
      </SkeletonCard>

      {/* Level Spikes Section */}
      <SkeletonCard>
        <View className="gap-4">
          {[1, 2].map((i) => (
            <View key={i} className="flex-row items-start gap-3">
              <Skeleton className="size-10 rounded-lg" />
              <View className="flex-1 gap-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-3 w-2/3" />
              </View>
            </View>
          ))}
        </View>
      </SkeletonCard>

      {/* Item Spikes Section */}
      <SkeletonCard>
        <View className="gap-4">
          {[1, 2].map((i) => (
            <View key={i} className="flex-row items-start gap-3">
              <Skeleton className="size-12 rounded-lg" />
              <View className="flex-1 gap-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-3 w-1/2" />
              </View>
            </View>
          ))}
        </View>
      </SkeletonCard>
    </ScrollView>
  )
}
