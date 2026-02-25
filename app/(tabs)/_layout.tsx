import FontAwesome from '@expo/vector-icons/FontAwesome'
import { isLiquidGlassAvailable } from 'expo-glass-effect'
import { Tabs } from 'expo-router'
import {
  Icon,
  Label,
  NativeTabs,
  VectorIcon,
} from 'expo-router/unstable-native-tabs'

import LanegapLogo from '@/assets/images/lanegap.svg'
import {
  ProfileTabIcon,
  ProfileTabIconNative,
} from '@/components/profile-tab-icon.component'
import { useTranslation } from '@/hooks/use-translation.hook'
import { colors } from '@/lib/colors'

import { TABS_CONFIG } from './tabs.config'

const isGlassEnabled = isLiquidGlassAvailable()

const TAB_BAR_STYLE = {
  backgroundColor: colors.background,
  borderTopColor: '#666666',
  borderTopWidth: 0.2,
  paddingTop: 8,
} as const

export default function TabLayout() {
  const { t } = useTranslation()

  if (!isGlassEnabled) {
    return (
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: 'white',
          tabBarInactiveTintColor: colors.mutedForeground,
          tabBarStyle: TAB_BAR_STYLE,
        }}
      >
        <Tabs.Screen
          name={TABS_CONFIG.INDEX.name}
          options={{
            title: t.tabs[TABS_CONFIG.INDEX.titleKey],
            tabBarIcon: ({ color }) => (
              <FontAwesome name="user" size={24} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name={TABS_CONFIG.MULTIPLAYER.name}
          options={{
            title: t.tabs[TABS_CONFIG.MULTIPLAYER.titleKey],
            tabBarIcon: ({ color }) => (
              <FontAwesome name="users" size={24} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name={TABS_CONFIG.LANEGAP.name}
          options={{
            title: t.tabs[TABS_CONFIG.LANEGAP.titleKey],
            tabBarIcon: ({ color }) => (
              <LanegapLogo width={24} height={24} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name={TABS_CONFIG.PROFILE.name}
          options={{
            title: t.tabs[TABS_CONFIG.PROFILE.titleKey],
            tabBarIcon: ({ color, focused }) => (
              <ProfileTabIcon color={color} focused={focused} />
            ),
          }}
        />
      </Tabs>
    )
  }

  return (
    <NativeTabs tintColor="white">
      <NativeTabs.Trigger name={TABS_CONFIG.INDEX.name}>
        <Label>{t.tabs[TABS_CONFIG.INDEX.titleKey]}</Label>
        <Icon src={<VectorIcon family={FontAwesome} name="user" />} />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name={TABS_CONFIG.MULTIPLAYER.name}>
        <Label>{t.tabs[TABS_CONFIG.MULTIPLAYER.titleKey]}</Label>
        <Icon src={<VectorIcon family={FontAwesome} name="users" />} />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name={TABS_CONFIG.LANEGAP.name}>
        <Label>{t.tabs[TABS_CONFIG.LANEGAP.titleKey]}</Label>
        <Icon src={<VectorIcon family={FontAwesome} name="book" />} />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name={TABS_CONFIG.PROFILE.name}>
        <Label>{t.tabs[TABS_CONFIG.PROFILE.titleKey]}</Label>
        <ProfileTabIconNative />
      </NativeTabs.Trigger>
    </NativeTabs>
  )
}
