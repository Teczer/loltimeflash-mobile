import { zodResolver } from '@hookform/resolvers/zod'
import { memo, useCallback } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { Text, View } from 'react-native'
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated'

import LanegapLogo from '@/assets/images/lanegap.svg'
import { DynamicButton, TextInput } from '@/components/ui'
import {
  pseudoSchema,
  type TPseudoForm,
} from '@/features/onboarding/schemas/onboarding.schema'
import { useTranslation } from '@/hooks/use-translation.hook'

interface IPseudoStepProps {
  onContinue: (pseudo: string) => void
  isLoading?: boolean
}

const PseudoStepComponent = (props: IPseudoStepProps) => {
  const { onContinue, isLoading = false } = props
  const { t } = useTranslation()

  const {
    control,
    handleSubmit,
    formState: { isValid },
  } = useForm<TPseudoForm>({
    resolver: zodResolver(pseudoSchema),
    defaultValues: { pseudo: '' },
    mode: 'onChange',
  })

  const onSubmit = useCallback(
    (data: TPseudoForm) => {
      onContinue(data.pseudo)
    },
    [onContinue]
  )

  return (
    <Animated.View
      entering={FadeIn.duration(300)}
      exiting={FadeOut.duration(200)}
      className="relative flex-1 justify-center px-8"
    >
      <View className="top-1/12 absolute right-1/2 z-10">
        <LanegapLogo width={64} height={64} fill="#FFFFFF" />
      </View>
      <View className="gap-8">
        <View className="items-center gap-2">
          <Text className="text-foreground font-sans-bold text-2xl">
            {t.onboarding.choosePseudo}
          </Text>
          <Text className="text-muted-foreground text-center font-sans text-base">
            {t.onboarding.pseudoSubtitle}
          </Text>
        </View>

        <View className="gap-3">
          <Controller
            control={control}
            name="pseudo"
            render={({
              field: { onChange, onBlur, value },
              fieldState: { error },
            }) => (
              <View className="gap-1.5">
                <TextInput
                  placeholder={t.onboarding.pseudoPlaceholder}
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  autoCapitalize="none"
                  autoCorrect={false}
                  maxLength={20}
                  onSubmitEditing={handleSubmit(onSubmit)}
                />
                {error && (
                  <Animated.Text
                    entering={FadeIn.duration(200)}
                    className="text-danger font-sans text-sm"
                  >
                    {error.message}
                  </Animated.Text>
                )}
                <Text className="text-muted-foreground text-right font-sans text-xs">
                  {value.length}/20
                </Text>
              </View>
            )}
          />
        </View>

        <DynamicButton
          onPress={handleSubmit(onSubmit)}
          disabled={!isValid || isLoading}
          isLoading={isLoading}
          loadingText={t.onboarding.continue}
        >
          {t.onboarding.continue}
        </DynamicButton>
      </View>
    </Animated.View>
  )
}

export const PseudoStep = memo(PseudoStepComponent)
