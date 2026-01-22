import { memo } from 'react';
import { Text, View } from 'react-native';

import { Button } from '@/components/ui';

interface ITimerControlsProps {
  isOnCooldown: boolean;
  onAdjust: (seconds: number) => void;
}

const TimerControlsComponent = (props: ITimerControlsProps) => {
  const { isOnCooldown, onAdjust } = props;

  if (!isOnCooldown) {
    return null;
  }

  return (
    <View className="flex-row items-center gap-3">
      <Button
        variant="outline"
        size="sm"
        onPress={() => onAdjust(-2)}
        className="h-8 w-10 px-0"
      >
        <Text className="text-xs font-bold text-foreground">-2s</Text>
      </Button>

      <Button
        variant="outline"
        size="sm"
        onPress={() => onAdjust(2)}
        className="h-8 w-10 px-0"
      >
        <Text className="text-xs font-bold text-foreground">+2s</Text>
      </Button>
    </View>
  );
};

export const TimerControls = memo(TimerControlsComponent, (prev, next) => {
  return prev.isOnCooldown === next.isOnCooldown;
});
