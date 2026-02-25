import type { ViewStyle } from 'react-native'

export type TSnapPoint = number | string

export interface IBottomSheetProps {
  isOpen: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
  snapPoints?: TSnapPoint[]
  enableBackdrop?: boolean
  backdropOpacity?: number
  dismissOnBackdropPress?: boolean
  dismissOnSwipeDown?: boolean
  showHandle?: boolean
  backgroundColor?: string
  borderRadius?: number
  /** When true, children are not wrapped in ScrollView (e.g. for FlatList) */
  disableScroll?: boolean
}

export interface IBottomSheetMethods {
  snapToIndex: (index: number) => void
  close: () => void
}
