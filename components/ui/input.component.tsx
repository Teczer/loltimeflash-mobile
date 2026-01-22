import { memo } from 'react';
import { TextInput, type TextInputProps } from 'react-native';

import { colors } from '@/lib/colors';
import { cn } from '@/lib/utils';

interface IInputProps extends TextInputProps {
  className?: string;
}

const InputComponent = (props: IInputProps) => {
  const { className, ...rest } = props;

  return (
    <TextInput
      className={cn(
        'rounded-lg border border-input bg-background px-4 pb-4 pt-2 text-base text-foreground',
        className
      )}
      placeholderTextColor={colors.mutedForeground}
      cursorColor={colors.border}
      selectionColor={colors.border}
      {...rest}
    />
  );
};

export const Input = memo(InputComponent);
