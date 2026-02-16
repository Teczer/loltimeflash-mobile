export const compensateCorners = (
  angle: number,
  strength: number = 0.15
): number => {
  'worklet'
  const rad = (angle * Math.PI) / 180
  const correction = Math.sin(4 * rad) * strength * 15
  return angle - correction
}
