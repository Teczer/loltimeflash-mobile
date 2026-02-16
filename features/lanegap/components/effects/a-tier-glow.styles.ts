import { StyleSheet } from 'react-native'

import { CARD_BACKGROUND_COLOR } from './constants'

export const styles = StyleSheet.create({
  wrapper: {
    position: 'relative',
  },
  glow: {
    ...StyleSheet.absoluteFillObject,
  },
  content: {
    backgroundColor: CARD_BACKGROUND_COLOR,
    overflow: 'hidden',
  },
})
