import { Ionicons } from '@expo/vector-icons';
import { zodResolver } from '@hookform/resolvers/zod';
import { memo } from 'react';
import { Controller, useForm, useWatch } from 'react-hook-form';
import { Text, View } from 'react-native';

import { Button, Input, TitleText } from '@/components/ui';
import { colors } from '@/lib/colors';
import { MAX_USERNAME_LENGTH, MIN_USERNAME_LENGTH } from '@/lib/constants';
import { useUserStore } from '@/stores';

import { usernameSchema, type TUsernameFormData } from '../schemas';
import { ValidationRule } from './validation-rule.component';

const UsernameFormComponent = () => {
  const { username, setUsername } = useUserStore();

  const {
    control,
    handleSubmit,
    reset,
  } = useForm<TUsernameFormData>({
    resolver: zodResolver(usernameSchema),
    defaultValues: {
      username: '',
    },
  });

  const inputValue = useWatch({ control, name: 'username' });

  const onSubmit = (data: TUsernameFormData) => {
    setUsername(data.username);
    reset();
  };

  const isShowValidationRules = inputValue.length > 0;

  const minLengthMessage = `Must be at least ${MIN_USERNAME_LENGTH} characters`;
  const maxLengthMessage = `Must not exceed ${MAX_USERNAME_LENGTH} characters`;

  return (
    <View className="items-center gap-4">
      <TitleText size="sm">Change or set your username</TitleText>

      {username && (
        <Text className="font-sans-medium text-sm text-foreground">
          Your username is :{' '}
          <Text className="font-sans-bold text-lg text-[#C89B3C]">{username}</Text>
        </Text>
      )}

      <View className="w-full flex-row items-center justify-center gap-2">
        <Controller
          control={control}
          name="username"
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              placeholder="Enter your username"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              autoCapitalize="none"
              autoCorrect={false}
              maxLength={MAX_USERNAME_LENGTH}
              className="flex-1 text-center"
            />
          )}
        />
        <Button
          variant="outline"
          size="icon"
          onPress={handleSubmit(onSubmit)}
          icon={<Ionicons name="arrow-forward" size={18} color={colors.foreground} />}
        />
      </View>

     

      {isShowValidationRules && (
        <View className="gap-1">
          <ValidationRule
            isValid={inputValue.length >= MIN_USERNAME_LENGTH}
            message={minLengthMessage}
          />
          <ValidationRule
            isValid={inputValue.length <= MAX_USERNAME_LENGTH}
            message={maxLengthMessage}
          />
        </View>
      )}
    </View>
  );
};

export const UsernameForm = memo(UsernameFormComponent);
