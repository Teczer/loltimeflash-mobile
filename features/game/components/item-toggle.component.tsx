import { memo } from 'react';
import { Pressable, Image, View, StyleSheet } from 'react-native';

import { cn } from '@/lib/utils';

interface IItemToggleProps {
  itemName: string;
  iconUrl: string;
  isActive: boolean;
  onPress: () => void;
}

const ItemToggleComponent = (props: IItemToggleProps) => {
  const { itemName, iconUrl, isActive, onPress } = props;

  return (
    <Pressable onPress={onPress}>
      {({ pressed }) => (
        <View className={cn(pressed && 'opacity-80')}>
          <Image
            source={{ uri: iconUrl }}
            className="h-12 w-12 rounded-full"
            resizeMode="cover"
            style={isActive ? undefined : styles.inactive}
            accessibilityLabel={itemName}
          />
        </View>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  inactive: {
    opacity: 0.4,
  },
});

export const ItemToggle = memo(ItemToggleComponent, (prev, next) => {
  return prev.isActive === next.isActive;
});
