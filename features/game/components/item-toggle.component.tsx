import { memo } from 'react';
import { Image, ImageSourcePropType, Pressable, StyleSheet, View } from 'react-native';

import { cn } from '@/lib/utils';

interface IItemToggleProps {
  itemName: string;
  iconSource: ImageSourcePropType;
  isActive: boolean;
  onPress: () => void;
}

const ItemToggleComponent = (props: IItemToggleProps) => {
  const { itemName, iconSource, isActive, onPress } = props;

  return (
    <Pressable onPress={onPress}>
      {({ pressed }) => (
        <View className={cn(pressed && 'opacity-80')}>
          <Image
            source={iconSource}
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
