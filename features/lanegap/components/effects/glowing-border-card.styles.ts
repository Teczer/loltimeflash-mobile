import { StyleSheet } from 'react-native'

import { CARD_BACKGROUND_COLOR } from './constants'

export const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  glowWrapper: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: -1,
  },
  effectContainer: {
    position: 'relative',
    overflow: 'hidden',
  },
  borderLayer: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  rotatingWheel: {
    position: 'absolute',
  },
  innerContent: {
    backgroundColor: CARD_BACKGROUND_COLOR,
    zIndex: 2,
  },
})
