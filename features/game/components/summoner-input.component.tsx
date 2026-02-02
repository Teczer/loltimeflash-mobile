import { Ionicons } from '@expo/vector-icons'
import { useState } from 'react'
import {
  ActivityIndicator,
  Pressable,
  Text,
  TextInput,
  View,
} from 'react-native'

import { colors } from '@/lib/colors'
import { cn } from '@/lib/utils'

import { useFetchLiveGame } from '@/features/game/hooks/use-fetch-live-game.hook'
import type {
  ILiveGameData,
  TRiotRegion,
} from '@/features/game/types/riot.types'
import { RIOT_REGIONS } from '@/features/game/types/riot.types'

interface ISummonerInputProps {
  onGameDataFetched: (data: ILiveGameData) => void
}

export const SummonerInput = (props: ISummonerInputProps) => {
  const { onGameDataFetched } = props
  const [summonerName, setSummonerName] = useState('')
  const [region, setRegion] = useState<TRiotRegion>('euw1')
  const [showRegionPicker, setShowRegionPicker] = useState(false)

  const { mutateAsync: fetchLiveGame, isPending } = useFetchLiveGame({
    onSuccess: onGameDataFetched,
  })

  const handleFetch = async () => {
    if (!summonerName.trim()) return
    await fetchLiveGame({ summonerName, region })
  }

  const selectedRegion = RIOT_REGIONS.find((r) => r.value === region)

  return (
    <View className="gap-3">
      {/* Summoner Name Input */}
      <View className="flex-row items-center gap-2">
        <TextInput
          className="text-foreground border-border bg-background/50 font-sans-bold flex-1 rounded-lg border px-4 py-3"
          placeholder="Summoner Name"
          placeholderTextColor={colors.mutedForeground}
          value={summonerName}
          onChangeText={setSummonerName}
          editable={!isPending}
          autoCapitalize="none"
          autoCorrect={false}
          returnKeyType="search"
          onSubmitEditing={handleFetch}
        />

        {/* Region Selector */}
        <Pressable
          onPress={() => setShowRegionPicker(!showRegionPicker)}
          className="border-border bg-background/50 rounded-lg border px-4 py-3"
          disabled={isPending}
        >
          <Text className="text-foreground font-sans-bold">
            {selectedRegion?.label || 'EUW'}
          </Text>
        </Pressable>
      </View>

      {/* Region Picker Dropdown */}
      {showRegionPicker && (
        <View className="border-border bg-background/90 flex-row flex-wrap gap-2 rounded-lg border p-3">
          {RIOT_REGIONS.map((r) => (
            <Pressable
              key={r.value}
              onPress={() => {
                setRegion(r.value)
                setShowRegionPicker(false)
              }}
              className={cn(
                'rounded-md px-3 py-2',
                region === r.value ? 'bg-gold' : 'bg-white/10'
              )}
            >
              <Text
                className={cn(
                  'font-sans-bold text-sm',
                  region === r.value ? 'text-background' : 'text-foreground'
                )}
              >
                {r.label}
              </Text>
            </Pressable>
          ))}
        </View>
      )}

      {/* Fetch Button */}
      <Pressable
        onPress={handleFetch}
        disabled={isPending || !summonerName.trim()}
        className={cn(
          'flex-row items-center justify-center gap-2 rounded-lg px-4 py-3',
          isPending || !summonerName.trim() ? 'bg-white/10' : 'bg-gold'
        )}
      >
        {isPending ? (
          <>
            <ActivityIndicator size="small" color={colors.foreground} />
            <Text className="text-foreground font-sans-bold">Fetching...</Text>
          </>
        ) : (
          <>
            <Ionicons
              name="game-controller"
              size={20}
              color={
                summonerName.trim() ? colors.background : colors.foreground
              }
            />
            <Text
              className={cn(
                'font-sans-bold',
                summonerName.trim() ? 'text-background' : 'text-foreground'
              )}
            >
              Fetch Live Game
            </Text>
          </>
        )}
      </Pressable>
    </View>
  )
}
