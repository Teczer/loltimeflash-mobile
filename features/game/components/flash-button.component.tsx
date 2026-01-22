import { memo, useEffect, useState } from 'react';
import { Pressable, Text, View, Image, ImageSourcePropType, StyleSheet } from 'react-native';

import { cn } from '@/lib/utils';
import { formatCooldown, getRemainingTime } from '../hooks/use-flash-cooldown.hook';
import type { TRole } from '../types/game.types';

interface IFlashButtonProps {
  role: TRole;
  iconSource: ImageSourcePropType | { uri: string };
  cooldown: number | false;
  onPress: () => void;
  summonerName?: string;
  className?: string;
}

const FlashButtonComponent = (props: IFlashButtonProps) => {
  const { role, iconSource, cooldown, onPress, summonerName } = props;

  const [, setTick] = useState(0);

  useEffect(() => {
    if (typeof cooldown === 'number') {
      const interval = setInterval(() => setTick((prev) => prev + 1), 1000);
      return () => clearInterval(interval);
    }
  }, [cooldown]);

  const remainingSeconds = getRemainingTime(cooldown);
  const isOnCooldown = remainingSeconds > 0;
  const isUri = typeof iconSource === 'object' && 'uri' in iconSource;

  return (
    <View className="items-center gap-2">
      <Pressable
        onPress={onPress}
        className="relative h-24 w-24 items-center justify-center"
      >
        {({ pressed }) => (
          <View className={cn('h-full w-full', pressed && 'opacity-80')}>
            {/* Timer overlay */}
            {isOnCooldown && (
              <View className="absolute inset-0 z-20 items-center justify-center">
                <Text style={styles.timerText}>
                  {formatCooldown(remainingSeconds)}
                </Text>
              </View>
            )}

            {/* Icon */}
            <Image
              source={isUri ? { uri: (iconSource as { uri: string }).uri } : iconSource}
              className="h-full w-full rounded-xl"
              resizeMode="cover"
              style={isOnCooldown ? styles.dimmed : undefined}
            />
          </View>
        )}
      </Pressable>

      <Text className="max-w-24 text-center text-sm font-semibold text-foreground" numberOfLines={1}>
        {summonerName || role}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  timerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    textShadowColor: '#000',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  dimmed: {
    opacity: 0.4,
  },
});

export const FlashButton = memo(FlashButtonComponent, (prev, next) => {
  return prev.cooldown === next.cooldown && prev.iconSource === next.iconSource;
});
