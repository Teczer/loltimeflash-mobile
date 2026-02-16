import { Ionicons } from '@expo/vector-icons'
import * as Linking from 'expo-linking'
import * as WebBrowser from 'expo-web-browser'
import { Alert, Pressable, Text, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { useTranslation } from '@/hooks/use-translation.hook'
import { colors } from '@/lib/colors'

const APP_VERSION = '1.0.0'
const PRIVACY_POLICY_URL = 'https://lanegap.loltimeflash.com/privacy'
const SUPPORT_EMAIL = 'mehdi.hattou1@gmail.com'

const handleOpenPrivacyPolicy = async () => {
  await WebBrowser.openBrowserAsync(PRIVACY_POLICY_URL)
}

export const AppInfo = () => {
  const insets = useSafeAreaInsets()
  const { t } = useTranslation()

  const handleContactSupport = async () => {
    const mailtoUrl = `mailto:${SUPPORT_EMAIL}`

    try {
      const canOpen = await Linking.canOpenURL(mailtoUrl)

      if (canOpen) {
        await Linking.openURL(mailtoUrl)
      } else {
        Alert.alert(
          t.appInfo.contactSupport,
          t.appInfo.sendEmail.replace('{email}', SUPPORT_EMAIL),
          [{ text: t.common.ok }]
        )
      }
    } catch {
      Alert.alert(
        t.appInfo.contactSupport,
        t.appInfo.sendEmail.replace('{email}', SUPPORT_EMAIL),
        [{ text: t.common.ok }]
      )
    }
  }

  return (
    <View
      className="items-center gap-3 border-t border-white/10 px-6 pt-4"
      style={{ paddingBottom: Math.max(insets.bottom, 16) }}
    >
      <View className="flex-row items-center gap-4">
        <Pressable
          onPress={handleOpenPrivacyPolicy}
          className="flex-row items-center gap-1.5 active:opacity-70"
        >
          <Ionicons
            name="document-text-outline"
            size={14}
            color={colors.mutedForeground}
          />
          <Text className="text-muted-foreground font-sans text-xs">
            {t.appInfo.privacyPolicy}
          </Text>
        </Pressable>

        <View className="h-3 w-px bg-white/20" />

        <Pressable
          onPress={handleContactSupport}
          className="flex-row items-center gap-1.5 active:opacity-70"
        >
          <Ionicons
            name="mail-outline"
            size={14}
            color={colors.mutedForeground}
          />
          <Text className="text-muted-foreground font-sans text-xs">
            {t.appInfo.contact}
          </Text>
        </Pressable>
      </View>

      <View className="items-center gap-1">
        <Text className="text-foreground text-center font-sans text-sm">
          LolTimeFlash v{APP_VERSION}
        </Text>
        <Text className="text-center font-sans text-[10px] leading-relaxed text-white/40">
          {t.appInfo.disclaimer}
        </Text>
      </View>
    </View>
  )
}
