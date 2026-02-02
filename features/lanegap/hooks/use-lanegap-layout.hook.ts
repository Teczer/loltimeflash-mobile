import { useWindowDimensions } from 'react-native'

import { ITEM_MARGIN, NUM_COLUMNS } from '../constants'

export const useLaneGapLayout = () => {
  const { width: screenWidth } = useWindowDimensions()

  const itemSize =
    (screenWidth - 32 - ITEM_MARGIN * (NUM_COLUMNS * 2)) / NUM_COLUMNS
  const iconSize = itemSize - 16

  return {
    itemSize,
    iconSize,
    numColumns: NUM_COLUMNS,
    itemMargin: ITEM_MARGIN,
  }
}
