import { Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export const AppInfo = () => {
  const insets = useSafeAreaInsets();

  return (
    <View
      className="items-center pt-4"
      style={{ paddingBottom: Math.max(insets.bottom, 16) }}
    >
      <Text className="font-sans text-center text-sm text-foreground">
        LolTimeFlash Mobile v1.0.0
      </Text>
      <Text className="font-sans mt-1 text-center text-xs text-foreground">
        Not endorsed by Riot Games
      </Text>
    </View>
  );
};
