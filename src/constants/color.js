import { colord } from 'colord'
import { HexColorPicker, HslColorPicker, RgbColorPicker } from 'react-colorful'


export const DEFAULT_PRESET_COLORS = ['#3232F5', '#07A0C3', '#F0C808', '#91F5AD', '#dd1c1a', '#463F3A']

export const COLOR_REPRESENTATIONS = [
  {
    label: 'HEX',
    set: v => colord(v).toHex(),
    display: v => colord(v).toHex(),
    picker: HexColorPicker,
  },
  {
    label: 'RGB',
    set: v => colord(v).toRgb(),
    display: v => colord(v).toRgbString(),
    picker: RgbColorPicker,
  },
  {
    label: 'HSL',
    set: v => colord(v).toHsl(),
    display: v => colord(v).toHslString(),
    picker: HslColorPicker,
  },
]
