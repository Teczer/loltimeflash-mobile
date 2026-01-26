import { LinearGradient } from 'expo-linear-gradient'
import { memo, useMemo } from 'react'
import { Image, StyleSheet, View } from 'react-native'

import { getChampion } from '@/assets/champions'

interface IChampionBackgroundProps {
  championId: string
}

/**
 * Champion splash art background with gradient overlays
 * Lighter version - splash art more visible
 */
const ChampionBackgroundComponent = ({
  championId,
}: IChampionBackgroundProps) => {
  const splashSource = useMemo(() => {
    const champion = getChampion(championId)
    return champion?.skins[0]?.source
  }, [championId])

  if (!splashSource) return null

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      {/* Splash Art - more visible */}
      <Image
        source={splashSource}
        resizeMode="cover"
        blurRadius={6}
        className="h-full w-full opacity-40"
      />

      {/* Bottom fade - starts late, fades to solid for content */}
      <LinearGradient
        colors={['transparent', 'rgba(2, 16, 34, 0.9)', 'rgba(2, 16, 34, 1)']}
        locations={[0, 0.3, 1]}
        style={styles.bottomGradient}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  bottomGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '65%',
  },
})

export const ChampionBackground = memo(ChampionBackgroundComponent)
