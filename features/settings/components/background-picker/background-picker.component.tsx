import { memo, useMemo, useState } from 'react'

import { getChampion } from '@/assets/champions'
import { useBackgroundStore } from '@/stores/background.store'

import { BackgroundPickerModal } from './background-picker-modal.component'
import { BackgroundPreview } from './background-preview.component'

const BackgroundPickerComponent = () => {
  const { championName, skinIndex, setBackground, reset } = useBackgroundStore()
  const [isModalVisible, setIsModalVisible] = useState(false)

  const currentImage = useMemo(() => {
    const champion = getChampion(championName)
    if (!champion) return null
    const skin = champion.skins.find((s) => s.index === skinIndex)
    return skin?.source || champion.skins[0]?.source || null
  }, [championName, skinIndex])

  return (
    <>
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
    </>
  )
}

export const BackgroundPicker = memo(BackgroundPickerComponent)
