import { Ionicons } from '@expo/vector-icons';
import { memo } from 'react';
import { Text, View } from 'react-native';

const VALIDATION_COLORS = {
  valid: '#22c55e',
  invalid: '#b91c1c',
} as const;

const VALIDATION_TEXT_CLASSES = {
  valid: 'text-green-500',
  invalid: 'text-red-700',
} as const;

interface IValidationRuleProps {
  isValid: boolean;
  message: string;
}

const ValidationRuleComponent = (props: IValidationRuleProps) => {
  const { isValid, message } = props;
  const status = isValid ? 'valid' : 'invalid';

  return (
    <View className="flex-row items-center gap-2">
      <Ionicons
        name={isValid ? 'checkmark' : 'close'}
        size={16}
        color={VALIDATION_COLORS[status]}
      />
      <Text className={`font-sans-medium text-sm ${VALIDATION_TEXT_CLASSES[status]}`}>
        {message}
      </Text>
    </View>
  );
};

export const ValidationRule = memo(ValidationRuleComponent);
