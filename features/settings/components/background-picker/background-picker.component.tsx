import { useMemo, useState } from 'react'
import { Text, View } from 'react-native'

import { getChampion } from '@/assets/champions'
import { useTranslation } from '@/hooks/use-translation.hook'
import { useBackgroundStore } from '@/stores/background.store'

import { BackgroundPickerModal } from '@/features/settings/components/background-picker/background-picker-modal.component'
import { BackgroundPreview } from '@/features/settings/components/background-picker/background-preview.component'

export const BackgroundPicker = () => {
  const { championName, skinIndex, setBackground, reset } = useBackgroundStore()
  const { t } = useTranslation()
  const [isModalVisible, setIsModalVisible] = useState(false)

  const currentImage = useMemo(() => {
    const champion = getChampion(championName)
    if (!champion) return null
    const skin = champion.skins.find((s) => s.index === skinIndex)
    return skin?.source || champion.skins[0]?.source || null
  }, [championName, skinIndex])

  return (
    <View className="gap-y-4">
      <Text className="font-sans-bold text-foreground text-lg">{t.settings.background}</Text>

      <BackgroundPreview
        image={currentImage}
        onPress={() => setIsModalVisible(true)}
      />

      <BackgroundPickerModal
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        championName={championName}
        skinIndex={skinIndex}
        onSelectSkin={setBackground}
        onReset={reset}
      />
    </View>
  )
}
