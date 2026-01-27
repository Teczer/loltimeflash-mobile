import { Image, StyleSheet, View } from 'react-native'

import { getChampion } from '@/assets/champions'

interface IChampionBackgroundProps {
  championId: string
}

export const ChampionBackground = ({ championId }: IChampionBackgroundProps) => {
  const champion = getChampion(championId)
  const splashSource = champion?.skins[0]?.source

  if (!splashSource) return null

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      <Image
        source={splashSource}
        resizeMode="cover"
        blurRadius={4}
        className="h-full w-full opacity-60"
      />

      <View className="via-background/90 to-background bg-linear-to-b absolute bottom-0 left-0 right-0 h-[65%] from-transparent via-30%" />
    </View>
  )
}
