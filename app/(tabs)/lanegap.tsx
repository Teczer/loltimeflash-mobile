import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';
import {
  Dimensions,
  FlatList,
  Image,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { CHAMPIONS, type IChampion } from '@/assets/champions';
import { BackgroundImage } from '@/components/background-image.component';
import { StyledSafeAreaView } from '@/components/styled';
import { GlassButton, TitleText } from '@/components/ui';
import { colors } from '@/lib/colors';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const NUM_COLUMNS = 4;
const ITEM_MARGIN = 6;
const ITEM_SIZE = (SCREEN_WIDTH - 32 - ITEM_MARGIN * (NUM_COLUMNS * 2)) / NUM_COLUMNS;

interface IChampionItemProps {
  champion: IChampion;
  onPress: () => void;
}

const ChampionItem = ({ champion, onPress }: IChampionItemProps) => (
  <Pressable onPress={onPress} style={styles.championItem}>
    <Image
      source={champion.skins[0].source}
      style={styles.championImage}
      resizeMode="cover"
    />
    <Text className="font-sans-medium text-center text-foreground" style={styles.championNameSize}>
      {champion.name}
    </Text>
  </Pressable>
);

export default function LaneGapScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredChampions = useMemo(() => {
    if (!searchQuery) return CHAMPIONS;
    const query = searchQuery.toLowerCase();
    return CHAMPIONS.filter((champ) =>
      champ.name.toLowerCase().includes(query)
    );
  }, [searchQuery]);

  const handleChampionPress = useCallback((champion: IChampion) => {
    router.push(`/lanegap/${champion.name}`);
  }, [router]);

  const handleOpenSettings = () => {
    router.push('/settings');
  };

  const renderItem = useCallback(({ item }: { item: IChampion }) => (
    <ChampionItem
      champion={item}
      onPress={() => handleChampionPress(item)}
    />
  ), [handleChampionPress]);

  const keyExtractor = useCallback((item: IChampion) => item.name, []);

  return (
    <BackgroundImage>
      <StyledSafeAreaView className="flex-1" edges={['top']}>
        {/* Floating Glass Settings Button */}
        <GlassButton
          onPress={handleOpenSettings}
          className={`absolute right-4 z-50 ${Platform.OS === 'ios' ? 'top-14' : 'top-4'}`}
        >
          <Ionicons name="settings-outline" size={22} color={colors.foreground} />
        </GlassButton>

        {/* Header */}
        <View className="px-4 py-4">
          <View className="flex-row items-center justify-center">
            <TitleText size="md">LANE</TitleText>
            <TitleText size="md" variant="gold">GAP</TitleText>
          </View>
          <Text className="font-sans mt-1 text-center text-sm text-muted-foreground">
            {filteredChampions.length} champions
          </Text>
        </View>

        {/* Search Bar */}
        <View className="mx-4 mb-4">
          <View className="flex-row items-center rounded-xl border border-border bg-card/50 px-4 py-3">
            <Ionicons name="search" size={20} color={colors.mutedForeground} />
            <TextInput
              className="font-sans ml-3 flex-1 text-base text-foreground"
              placeholder="Search enemy champion..."
              placeholderTextColor={colors.mutedForeground}
              value={searchQuery}
              onChangeText={setSearchQuery}
              autoCapitalize="none"
              autoCorrect={false}
            />
            {searchQuery.length > 0 && (
              <Pressable onPress={() => setSearchQuery('')}>
                <Ionicons name="close-circle" size={20} color={colors.mutedForeground} />
              </Pressable>
            )}
          </View>
        </View>

        {/* Champions Grid */}
        <FlatList
          data={filteredChampions}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          numColumns={NUM_COLUMNS}
          contentContainerStyle={styles.gridContainer}
          showsVerticalScrollIndicator={false}
          removeClippedSubviews
          maxToRenderPerBatch={20}
          windowSize={5}
          initialNumToRender={20}
          ListEmptyComponent={
            <View className="flex-1 items-center justify-center py-20">
              <Text className="font-sans text-muted-foreground">No champions found</Text>
            </View>
          }
        />
      </StyledSafeAreaView>
    </BackgroundImage>
  );
}

// StyleSheet only for dynamic sizes (can't do in Tailwind)
const styles = StyleSheet.create({
  gridContainer: {
    paddingHorizontal: 12,
    paddingBottom: 100,
  },
  championItem: {
    width: ITEM_SIZE,
    margin: ITEM_MARGIN,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: colors.card,
  },
  championImage: {
    width: ITEM_SIZE,
    height: ITEM_SIZE,
  },
  championNameSize: {
    fontSize: 10,
    paddingVertical: 4,
    paddingHorizontal: 2,
  },
});
