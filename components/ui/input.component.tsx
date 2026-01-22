import { memo } from 'react';
import { TextInput, type TextInputProps } from 'react-native';

import { cn } from '@/lib/utils';
import { colors } from '@/lib/colors';

interface IInputProps extends TextInputProps {
  className?: string;
}

const InputComponent = (props: IInputProps) => {
  const { className, ...rest } = props;

  return (
    <TextInput
      className={cn(
        'rounded-lg border border-border bg-input px-4 py-3 text-base text-foreground',
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
