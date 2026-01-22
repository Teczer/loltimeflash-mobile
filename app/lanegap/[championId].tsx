import { useMemo } from 'react';
import { View, Text, ScrollView, Image, Pressable, StyleSheet } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { BackgroundImage } from '@/components/background-image.component';
import { StyledSafeAreaView } from '@/components/styled';
import { getChampion } from '@/assets/champions';
import { colors } from '@/lib/colors';

export default function ChampionDetailScreen() {
  const router = useRouter();
  const { championId } = useLocalSearchParams<{ championId: string }>();
  
  const champion = useMemo(() => {
    return championId ? getChampion(championId) : undefined;
  }, [championId]);

  if (!champion) {
    return (
      <BackgroundImage>
        <StyledSafeAreaView className="flex-1 items-center justify-center">
          <Text className="text-foreground">Champion not found</Text>
          <Pressable onPress={() => router.back()} className="mt-4">
            <Text className="text-primary">Go back</Text>
          </Pressable>
        </StyledSafeAreaView>
      </BackgroundImage>
    );
  }

  return (
    <BackgroundImage>
      <StyledSafeAreaView className="flex-1" edges={['top']}>
        {/* Header */}
        <View className="flex-row items-center px-4 py-3">
          <Pressable onPress={() => router.back()} className="p-2">
            <Ionicons name="arrow-back" size={24} color={colors.foreground} />
          </Pressable>
          <Text className="ml-2 text-xl font-bold text-foreground">
            {champion.name}
          </Text>
        </View>

        <ScrollView className="flex-1" contentContainerStyle={styles.scrollContent}>
          {/* Champion Splash */}
          <View className="mx-4 overflow-hidden rounded-xl">
            <Image
              source={champion.skins[0].source}
              style={styles.splashImage}
              resizeMode="cover"
            />
          </View>

          {/* Coming Soon Section */}
          <View className="mx-4 mt-6 rounded-xl border border-border bg-card/50 p-6">
            <View className="flex-row items-center gap-3">
              <Ionicons name="construct-outline" size={24} color={colors.primary} />
              <Text className="text-lg font-semibold text-foreground">
                Coming Soon
              </Text>
            </View>
            <Text className="mt-3 text-muted-foreground">
              LaneGap integration is in progress. Soon you'll be able to see:
            </Text>
            <View className="mt-4 gap-2">
              <View className="flex-row items-center gap-2">
                <Ionicons name="checkmark-circle" size={18} color={colors.success} />
                <Text className="text-foreground">Counter picks</Text>
              </View>
              <View className="flex-row items-center gap-2">
                <Ionicons name="checkmark-circle" size={18} color={colors.success} />
                <Text className="text-foreground">Matchup tips</Text>
              </View>
              <View className="flex-row items-center gap-2">
                <Ionicons name="checkmark-circle" size={18} color={colors.success} />
                <Text className="text-foreground">Power spikes (levels & items)</Text>
              </View>
              <View className="flex-row items-center gap-2">
                <Ionicons name="checkmark-circle" size={18} color={colors.success} />
                <Text className="text-foreground">Personal notes</Text>
              </View>
            </View>
          </View>

          {/* All Skins */}
          <View className="mx-4 mt-6">
            <Text className="mb-3 text-lg font-semibold text-foreground">
              All Skins ({champion.skins.length})
            </Text>
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.skinsContainer}
            >
              {champion.skins.map((skin) => (
                <View key={skin.index} style={styles.skinItem}>
                  <Image
                    source={skin.source}
                    style={styles.skinImage}
                    resizeMode="cover"
                  />
                </View>
              ))}
            </ScrollView>
          </View>
        </ScrollView>
      </StyledSafeAreaView>
    </BackgroundImage>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: 40,
  },
  splashImage: {
    width: '100%',
    height: 200,
  },
  skinsContainer: {
    gap: 12,
  },
  skinItem: {
    width: 140,
    height: 80,
    borderRadius: 8,
    overflow: 'hidden',
  },
  skinImage: {
    width: '100%',
    height: '100%',
  },
});
