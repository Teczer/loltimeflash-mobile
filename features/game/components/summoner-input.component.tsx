import { Ionicons } from '@expo/vector-icons'
import { useState } from 'react'
import { Pressable, Text, View } from 'react-native'

import { DynamicButton, TextInput } from '@/components/ui'
import { useTranslation } from '@/hooks/use-translation.hook'
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
  const { t } = useTranslation()
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
    <View className="gap-4">
      <View className="gap-1">
        <Text className="text-muted-foreground font-sans text-xs">
          {t.game.summonerName}
        </Text>
        <View className="flex-row gap-2">
          <TextInput
            className="flex-1"
            placeholder={t.game.summonerName}
            value={summonerName}
            onChangeText={setSummonerName}
            editable={!isPending}
            autoCapitalize="none"
            autoCorrect={false}
            returnKeyType="search"
            onSubmitEditing={handleFetch}
          />
          <Pressable
            onPress={() => setShowRegionPicker(!showRegionPicker)}
            className="border-input bg-background h-12 min-w-[72px] items-center justify-center rounded-xl border px-4"
            disabled={isPending}
          >
            <Text className="text-foreground font-sans-bold">
              {selectedRegion?.label || 'EUW'}
            </Text>
          </Pressable>
        </View>
      </View>

      {showRegionPicker && (
        <View className="border-input bg-background/90 flex-row flex-wrap gap-2 rounded-xl border p-3">
          {RIOT_REGIONS.map((r) => (
            <Pressable
              key={r.value}
              onPress={() => {
                setRegion(r.value)
                setShowRegionPicker(false)
              }}
              className={cn(
                'rounded-lg px-3 py-2',
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

      <DynamicButton
        variant="primary"
        onPress={handleFetch}
        disabled={!summonerName.trim()}
        isLoading={isPending}
        loadingText={t.game.fetching}
        icon={
          <Ionicons
            name="game-controller"
            size={20}
            color={colors.goldLight}
          />
        }
      >
        {t.game.fetchLiveGame}
      </DynamicButton>
    </View>
  )
}
