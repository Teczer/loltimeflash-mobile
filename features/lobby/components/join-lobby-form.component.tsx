import { memo, useState } from 'react';
import { View, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { Button, Input } from '@/components/ui';
import { LOBBY_CODE_LENGTH } from '@/features/game/constants/game.constants';
import { colors } from '@/lib/colors';

const JoinLobbyFormComponent = () => {
  const router = useRouter();
  const [lobbyCode, setLobbyCode] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = () => {
    if (lobbyCode.length === LOBBY_CODE_LENGTH) {
      router.push(`/game/${lobbyCode}`);
    } else {
      setError(`Code must be ${LOBBY_CODE_LENGTH} characters (${lobbyCode.length} entered)`);
    }
  };

  const handleChange = (value: string) => {
    setLobbyCode(value);
    if (error) setError(null);
  };

  return (
    <View className="w-full items-center gap-6">
      <Text className="text-xl font-semibold text-foreground">
        Join a Lobby
      </Text>

      <View className="w-full flex-row items-center gap-2">
        <View className="flex-1">
          <Input
            placeholder="Enter lobby code"
            value={lobbyCode}
            onChangeText={handleChange}
            autoCapitalize="none"
            autoCorrect={false}
            maxLength={LOBBY_CODE_LENGTH}
            className="text-center font-mono"
          />
        </View>
        <Button
          variant="outline"
          size="icon"
          onPress={handleSubmit}
          icon={<Ionicons name="arrow-forward" size={18} color={colors.foreground} />}
        />
      </View>

      {error && (
        <Text className="text-sm text-destructive">{error}</Text>
      )}
    </View>
  );
};

export const JoinLobbyForm = memo(JoinLobbyFormComponent);
