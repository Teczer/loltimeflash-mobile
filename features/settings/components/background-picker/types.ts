import type { IChampion, ISkin } from '@/assets/champions'

export interface ISkinItemProps {
  skin: ISkin
  isSelected: boolean
  onPress: () => void
}

export interface IChampionRowProps {
  champion: IChampion
  selectedChampion: string
  selectedSkinIndex: number
  onSelectSkin: (championName: string, skinIndex: number) => void
}

export interface IBackgroundPickerModalProps {
  visible: boolean
  onClose: () => void
  championName: string
  skinIndex: number
  onSelectSkin: (championName: string, skinIndex: number) => void
  onReset: () => void
}
