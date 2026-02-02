import { Ionicons } from '@expo/vector-icons'
import { zodResolver } from '@hookform/resolvers/zod'
import { memo, useCallback, useRef } from 'react'
import { Controller, useForm, useWatch } from 'react-hook-form'
import { Text, View, type LayoutChangeEvent } from 'react-native'
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated'

import { Button, TextInput, TitleText } from '@/components/ui'
import { colors } from '@/lib/colors'
import { MAX_USERNAME_LENGTH, MIN_USERNAME_LENGTH } from '@/lib/constants'
import { useUserStore } from '@/stores'

import { usernameSchema, type TUsernameFormData } from '../schemas'
import { ValidationRule } from './validation-rule.component'

interface IUsernameFormProps {
  withHeightAnimation?: boolean
}

const UsernameFormComponent = (props: IUsernameFormProps) => {
  const { withHeightAnimation = true } = props
  const { username, setUsername } = useUserStore()
  const contentHeight = useSharedValue(0)
  const hasMeasured = useRef(false)

  const { control, handleSubmit, reset } = useForm<TUsernameFormData>({
    resolver: zodResolver(usernameSchema),
    defaultValues: {
      username: '',
    },
  })

  const inputValue = useWatch({ control, name: 'username' })

  const onSubmit = (data: TUsernameFormData) => {
    setUsername(data.username)
    reset()
  }

  const isShowValidationRules = inputValue.length > 0

  const heightAnimatedStyle = useAnimatedStyle(() => ({
    height: withTiming(isShowValidationRules ? contentHeight.value : 0, {
      duration: 200,
    }),
    opacity: withTiming(isShowValidationRules ? 1 : 0, { duration: 150 }),
    overflow: 'hidden',
  }))

  const opacityAnimatedStyle = useAnimatedStyle(() => ({
    opacity: withTiming(isShowValidationRules ? 1 : 0, { duration: 150 }),
  }))

  const handleContentLayout = useCallback(
    (event: LayoutChangeEvent) => {
      const height = event.nativeEvent.layout.height
      if (!hasMeasured.current && height > 0) {
        contentHeight.value = height
        hasMeasured.current = true
      }
    },
    [contentHeight]
  )

  const minLengthMessage = `Must be at least ${MIN_USERNAME_LENGTH} characters`
  const maxLengthMessage = `Must not exceed ${MAX_USERNAME_LENGTH} characters`

  const validationRulesContent = (
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
  )

  return (
    <View className="items-center gap-y-4">
      <TitleText size="sm">Change or set your username</TitleText>

      {username && (
        <Text className="font-sans-medium text-foreground text-sm">
          Your username is :{' '}
          <Text className="font-sans-bold text-lg text-[#C89B3C]">
            {username}
          </Text>
        </Text>
      )}

      <View className="w-full flex-row items-center justify-center gap-2">
        <Controller
          control={control}
          name="username"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              placeholder="Enter your username"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              autoCapitalize="none"
              autoCorrect={false}
              maxLength={MAX_USERNAME_LENGTH}
              returnKeyType="done"
              onSubmitEditing={handleSubmit(onSubmit)}
              className="flex-1"
            />
          )}
        />
        <Button
          variant="outline"
          size="icon"
          onPress={handleSubmit(onSubmit)}
          icon={
            <Ionicons
              name="arrow-forward"
              size={18}
              color={colors.foreground}
            />
          }
        />
      </View>

      {/* Validation rules */}
      {withHeightAnimation ? (
        <View>
          {/* Invisible layer for height measurement */}
          <View
            style={{ position: 'absolute', opacity: 0 }}
            onLayout={handleContentLayout}
            pointerEvents="none"
          >
            {validationRulesContent}
          </View>

          {/* Animated with height + opacity */}
          <Animated.View style={heightAnimatedStyle}>
            {validationRulesContent}
          </Animated.View>
        </View>
      ) : (
        <Animated.View style={opacityAnimatedStyle}>
          {validationRulesContent}
        </Animated.View>
      )}
    </View>
  )
}

export const UsernameForm = memo(UsernameFormComponent)
