import { Dimensions } from 'react-native'

const { height: SCREEN_HEIGHT } = Dimensions.get('window')

export function parseSnapPoint(snapPoint: number | string): number {
  if (typeof snapPoint === 'number') {
    return snapPoint
  }
  const match = snapPoint.match(/^(\d+(?:\.\d+)?)%$/)
  if (match) {
    return (parseFloat(match[1]) / 100) * SCREEN_HEIGHT
  }
  return SCREEN_HEIGHT * 0.5
}
