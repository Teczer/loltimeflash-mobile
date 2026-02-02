import { useWindowDimensions } from 'react-native'

import { NUM_COLUMNS } from '../constants'

// px-4 on container = 16px each side = 32px total
const CONTAINER_PADDING = 32
// m-1.5 on items = 6px each side = 12px per item horizontal
const ITEM_HORIZONTAL_MARGIN = 12

export const useLaneGapLayout = () => {
  const { width: screenWidth } = useWindowDimensions()

  // Available width = screen - container padding
  // Each item takes: itemSize + horizontal margins
  // 4 items: 4 * (itemSize + 12) = availableWidth
  const availableWidth = screenWidth - CONTAINER_PADDING
  const itemSize = Math.floor(
    (availableWidth - ITEM_HORIZONTAL_MARGIN * NUM_COLUMNS) / NUM_COLUMNS
  )
  const iconSize = itemSize - 16

  return {
    itemSize,
    iconSize,
    numColumns: NUM_COLUMNS,
  }
}
