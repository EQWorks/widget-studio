import { color } from 'd3-color'

/*
 * complementaryColor - transforms a string format color ex.'#0062d9' into an array of its complementary color's rgb values
 * @param { object } param
 * @param { string } param.baseColor - string format color
 * @returns { array  } - an array of rgb color values [r, g, b]
 */
export const complementaryColor = ({ baseColor }) => {
  const objColor = color(baseColor)
  return [255 - objColor.r, 255 - objColor.g, 255 - objColor.b]
}
