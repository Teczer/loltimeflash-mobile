import { Link, Stack } from 'expo-router';
import { View, Text, Pressable } from 'react-native';
import { withUniwind } from 'uniwind';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useTranslation } from '@/hooks/use-translation.hook';

const StyledSafeAreaView = withUniwind(SafeAreaView);

export default function NotFoundScreen() {
  const { t } = useTranslation();

  return (
    <>
      <Stack.Screen options={{ title: t.notFound.oops }} />
      <StyledSafeAreaView className="flex-1 items-center justify-center p-5 bg-background">
        <Text className="text-xl font-bold text-foreground">
          {t.notFound.screenNotExist}
        </Text>
        <Link href="/" asChild>
          <Pressable className="mt-4 py-4">
            <Text className="text-base text-primary">{t.notFound.goHome}</Text>
          </Pressable>
        </Link>
      </StyledSafeAreaView>
    </>
  );
}
