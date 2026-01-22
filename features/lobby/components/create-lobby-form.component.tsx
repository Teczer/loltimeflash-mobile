import { memo, useState } from 'react';
import { View, Text, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { Button, Input } from '@/components/ui';
import { generateLobbyCode } from '@/lib/utils';
import { colors } from '@/lib/colors';

// Dynamically import expo-clipboard
let Clipboard: typeof import('expo-clipboard') | null = null;
try {
  Clipboard = require('expo-clipboard');
} catch (e) {
  console.warn('expo-clipboard not available');
}

const CreateLobbyFormComponent = () => {
  const router = useRouter();
  const [lobbyCode, setLobbyCode] = useState<string>('');
  const [copied, setCopied] = useState(false);

  const handleCreateLobby = () => {
    const code = generateLobbyCode(10);
    setLobbyCode(code);
  };

  const handleCopyCode = async () => {
    if (lobbyCode) {
      if (Clipboard) {
        await Clipboard.setStringAsync(lobbyCode);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } else {
        Alert.alert('Lobby Code', lobbyCode, [{ text: 'OK' }]);
      }
    }
  };

  const handleJoinLobby = () => {
    router.push(`/game/${lobbyCode}`);
  };

  return (
    <View className="w-full items-center gap-6">
      <Text className="text-xl font-semibold text-foreground">
        Create a Lobby
      </Text>

      {!lobbyCode ? (
        <Button variant="outline" onPress={handleCreateLobby}>
          Create Lobby
        </Button>
      ) : (
        <View className="w-full items-center gap-4">
          <Text className="text-muted-foreground">Your lobby code is:</Text>

          <View className="w-full flex-row items-center gap-2">
            <View className="flex-1">
              <Input value={lobbyCode} editable={false} className="text-center font-mono" />
            </View>
            <Button
              variant="outline"
              size="icon"
              onPress={handleCopyCode}
              icon={
                <Ionicons
                  name={copied ? 'checkmark' : 'copy'}
                  size={18}
                  color={colors.foreground}
                />
              }
            />
          </View>

          <Button
            variant="outline"
            onPress={handleJoinLobby}
            icon={<Ionicons name="arrow-forward" size={18} color={colors.foreground} />}
          >
            Join Lobby
          </Button>
        </View>
      )}
    </View>
  );
};

export const CreateLobbyForm = memo(CreateLobbyFormComponent);
