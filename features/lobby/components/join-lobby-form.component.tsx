import { zodResolver } from '@hookform/resolvers/zod';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { memo } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Text, View } from 'react-native';

import { Button, Input } from '@/components/ui';
import { LOBBY_CODE_LENGTH } from '@/features/game/constants/game.constants';
import { colors } from '@/lib/colors';

import { joinLobbySchema, type TJoinLobbyFormData } from '../schemas';

const JoinLobbyFormComponent = () => {
  const router = useRouter();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<TJoinLobbyFormData>({
    resolver: zodResolver(joinLobbySchema),
    defaultValues: {
      lobbyCode: '',
    },
  });

  const onSubmit = (data: TJoinLobbyFormData) => {
    router.push(`/game/${data.lobbyCode}`);
  };

  return (
    <View className="w-full items-center gap-6">
      <Text className="font-sans-bold text-xl text-foreground">Join a Lobby</Text>

      <View className="w-full flex-row items-center gap-2">
        <View className="flex-1">
          <Controller
            control={control}
            name="lobbyCode"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                placeholder="Enter lobby code"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                autoCapitalize="none"
                autoCorrect={false}
                maxLength={LOBBY_CODE_LENGTH}
                returnKeyType="join"
                onSubmitEditing={handleSubmit(onSubmit)}
                className="text-center font-mono"
              />
            )}
          />
        </View>
        <Button
          variant="outline"
          size="icon"
          onPress={handleSubmit(onSubmit)}
          icon={<Ionicons name="arrow-forward" size={18} color={colors.foreground} />}
        />
      </View>

      {errors.lobbyCode && (
        <Text className="text-sm text-destructive">{errors.lobbyCode.message}</Text>
      )}
    </View>
  );
};

export const JoinLobbyForm = memo(JoinLobbyFormComponent);
