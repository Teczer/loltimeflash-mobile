import { Dimensions } from 'react-native'

const { width: SCREEN_WIDTH } = Dimensions.get('window')

export const NUM_COLUMNS = 4
export const ITEM_MARGIN = 6
export const ITEM_SIZE = (SCREEN_WIDTH - 32 - ITEM_MARGIN * (NUM_COLUMNS * 2)) / NUM_COLUMNS
