import { memo, useState, useMemo, useCallback } from 'react';
import {
  View,
  Text,
  Image,
  Pressable,
  Modal,
  FlatList,
  TextInput,
  Dimensions,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { useBackgroundStore } from '@/stores/background.store';
import { CHAMPIONS, getBaseSkin, type IChampion, type ISkin } from '@/assets/champions';
import { colors } from '@/lib/colors';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const SKIN_SIZE = 100;
const SKIN_MARGIN = 6;

interface ISkinItemProps {
  skin: ISkin;
  championName: string;
  isSelected: boolean;
  onPress: () => void;
}

// Memoized skin item
const SkinItem = memo(({ skin, isSelected, onPress }: ISkinItemProps) => (
  <Pressable onPress={onPress} style={styles.skinItem}>
    <Image source={skin.source} style={styles.skinImage} resizeMode="cover" />
    {isSelected && (
      <View style={styles.selectedOverlay}>
        <Ionicons name="checkmark-circle" size={24} color={colors.success} />
      </View>
    )}
  </Pressable>
));

SkinItem.displayName = 'SkinItem';

interface IChampionRowProps {
  champion: IChampion;
  selectedChampion: string;
  selectedSkinIndex: number;
  onSelectSkin: (championName: string, skinIndex: number) => void;
}

// Memoized champion row with horizontal skin scroll
const ChampionRow = memo(({ champion, selectedChampion, selectedSkinIndex, onSelectSkin }: IChampionRowProps) => {
  const renderSkin = useCallback(({ item }: { item: ISkin }) => (
    <SkinItem
      skin={item}
      championName={champion.name}
      isSelected={selectedChampion === champion.name && selectedSkinIndex === item.index}
      onPress={() => onSelectSkin(champion.name, item.index)}
    />
  ), [champion.name, selectedChampion, selectedSkinIndex, onSelectSkin]);

  const keyExtractor = useCallback((item: ISkin) => `${champion.name}-${item.index}`, [champion.name]);

  return (
    <View style={styles.championRow}>
      <Text style={styles.championName}>{champion.name}</Text>
      <FlatList
        data={champion.skins}
        renderItem={renderSkin}
        keyExtractor={keyExtractor}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.skinsContainer}
        removeClippedSubviews
        maxToRenderPerBatch={5}
        windowSize={3}
      />
    </View>
  );
});

ChampionRow.displayName = 'ChampionRow';

const BackgroundPickerComponent = () => {
  const { championName, skinIndex, setBackground, reset } = useBackgroundStore();
  const currentImage = getBaseSkin(championName);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredChampions = useMemo(() => {
    if (!searchQuery) return CHAMPIONS;
    const query = searchQuery.toLowerCase();
    return CHAMPIONS.filter((champ) => champ.name.toLowerCase().includes(query));
  }, [searchQuery]);

  const handleSelectSkin = useCallback((champName: string, skinIdx: number) => {
    setBackground(champName, skinIdx);
    setIsModalVisible(false);
  }, [setBackground]);

  const handleReset = useCallback(() => {
    reset();
    setIsModalVisible(false);
  }, [reset]);

  const renderChampion = useCallback(({ item }: { item: IChampion }) => (
    <ChampionRow
      champion={item}
      selectedChampion={championName}
      selectedSkinIndex={skinIndex}
      onSelectSkin={handleSelectSkin}
    />
  ), [championName, skinIndex, handleSelectSkin]);

  const keyExtractor = useCallback((item: IChampion) => item.name, []);

  return (
    <>
      {/* Current Background Preview */}
      <Pressable
        onPress={() => setIsModalVisible(true)}
        className="overflow-hidden rounded-lg border border-border"
      >
        {currentImage && (
          <Image source={currentImage} className="h-32 w-full" resizeMode="cover" />
        )}
        <View className="absolute inset-0 items-center justify-center bg-black/30">
          <Ionicons name="image-outline" size={32} color="white" />
          <Text className="mt-2 text-sm font-semibold text-white">Change Background</Text>
        </View>
      </Pressable>

      {/* Background Picker Modal */}
      <Modal
        visible={isModalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View className="flex-1 bg-background">
          {/* Modal Header */}
          <View className="flex-row items-center justify-between border-b border-border px-4 py-4">
            <Pressable onPress={() => setIsModalVisible(false)} className="p-2">
              <Ionicons name="close" size={24} color={colors.foreground} />
            </Pressable>
            <Text className="text-lg font-semibold text-foreground">Choose Background</Text>
            <Pressable onPress={handleReset} className="p-2">
              <Text className="text-sm text-border">Reset</Text>
            </Pressable>
          </View>

          {/* Search */}
          <View className="px-4 py-3">
            <View className="flex-row items-center rounded-lg border border-border bg-input px-3 py-2">
              <Ionicons name="search" size={20} color={colors.mutedForeground} />
              <TextInput
                className="ml-2 flex-1 text-foreground"
                placeholder="Search champions..."
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

          {/* Champion List (vertical) with Skins (horizontal) */}
          <FlatList
            data={filteredChampions}
            renderItem={renderChampion}
            keyExtractor={keyExtractor}
            showsVerticalScrollIndicator={false}
            removeClippedSubviews
            maxToRenderPerBatch={8}
            windowSize={5}
            initialNumToRender={8}
            ListEmptyComponent={
              <View className="flex-1 items-center justify-center py-20">
                <Text className="text-muted-foreground">No champions found</Text>
              </View>
            }
          />
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  championRow: {
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  championName: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.foreground,
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  skinsContainer: {
    paddingHorizontal: 12,
  },
  skinItem: {
    width: SKIN_SIZE,
    height: SKIN_SIZE * 0.6,
    marginHorizontal: SKIN_MARGIN,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: colors.card,
  },
  skinImage: {
    width: '100%',
    height: '100%',
  },
  selectedOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export const BackgroundPicker = memo(BackgroundPickerComponent);
