import FontAwesome from '@expo/vector-icons/FontAwesome'
import MaterialIcons from '@expo/vector-icons/MaterialIcons'
import { isLiquidGlassAvailable } from 'expo-glass-effect'
import { Tabs } from 'expo-router'
import {
  Icon,
  Label,
  NativeTabs,
  VectorIcon,
} from 'expo-router/unstable-native-tabs'
import { Platform } from 'react-native'

import LanegapLogo from '@/assets/images/lanegap.svg'
import {
  ProfileTabIcon,
  ProfileTabIconNative,
} from '@/components/profile-tab-icon.component'
import { useTranslation } from '@/hooks/use-translation.hook'
import { colors } from '@/lib/colors'

const isGlassEnabled = isLiquidGlassAvailable()

export default function TabLayout() {
  const { t } = useTranslation()

  // Fallback to JavaScript Tabs if liquid glass is not available
  if (!isGlassEnabled) {
    return (
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: 'white',
          tabBarInactiveTintColor: colors.mutedForeground,
          tabBarStyle: {
            backgroundColor: colors.background,
            borderTopColor: '#666666',
            borderTopWidth: 0.2,
            paddingTop: 8,
          },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: t.tabs.solo,
            tabBarIcon: ({ color }) => (
              <FontAwesome name="user" size={24} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="multiplayer"
          options={{
            title: t.tabs.multi,
            tabBarIcon: ({ color }) => (
              <FontAwesome name="users" size={24} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="lanegap"
          options={{
            title: t.tabs.laneGap,
            tabBarIcon: ({ color }) => (
              <LanegapLogo width={24} height={24} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: t.tabs.profile,
            tabBarIcon: ({ color, focused }) => (
              <ProfileTabIcon color={color} focused={focused} />
            ),
          }}
        />
      </Tabs>
    )
  }

  // NativeTabs with liquid glass effect
  return (
    <NativeTabs tintColor="white">
      <NativeTabs.Trigger name="index">
        <Label>{t.tabs.solo}</Label>
        {Platform.select({
          ios: <Icon sf={{ default: 'person', selected: 'person.fill' }} />,
          android: (
            <Icon src={<VectorIcon family={MaterialIcons} name="flash-on" />} />
          ),
        })}
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="multiplayer">
        <Label>{t.tabs.multi}</Label>
        {Platform.select({
          ios: <Icon sf={{ default: 'person.3', selected: 'person.3.fill' }} />,
          android: (
            <Icon src={<VectorIcon family={MaterialIcons} name="people" />} />
          ),
        })}
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="lanegap">
        <Label>{t.tabs.laneGap}</Label>
        {Platform.select({
          ios: (
            <Icon
              sf={{
                default: 'book.pages',
                selected: 'book.pages.fill',
              }}
            />
          ),
          android: (
            <Icon
              src={<VectorIcon family={MaterialIcons} name="library-books" />}
            />
          ),
        })}
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="profile">
        <Label>{t.tabs.profile}</Label>
        <ProfileTabIconNative />
      </NativeTabs.Trigger>
    </NativeTabs>
  )
}
