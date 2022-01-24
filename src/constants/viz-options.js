const multiExport = d => ({
  string: d.map(({ string }) => string),
  numeric: d.map(({ numeric }) => numeric),
  dict: Object.fromEntries(d.map(({ string, numeric }) => [string, numeric])),
})

export const sizes = multiExport([
  // scale is 0-1, 0 is most spacious (smallest viz) and 1 is most compact (largest viz)
  {
    string: 'Spacious',
    numeric: 0.2,
  },
  {
    string: 'Moderate',
    numeric: 0.6,
  },
  {
    string: 'Compact',
    numeric: 0.8,
  },
])

export const positions = multiExport([
  // scale is 0-1, first number is x-coord and second number is y-coord
  {
    string: 'Top-left',
    numeric: [0, 1],
  },
  {
    string: 'Top-center',
    numeric: [0.5, 1],
  },
  {
    string: 'Top-right',
    numeric: [1, 1],
  },
  {
    string: 'Bottom-left',
    numeric: [0, 0],
  },
  {
    string: 'Bottom-center',
    numeric: [0.5, 0],
  },
  {
    string: 'Bottom-right',
    numeric: [1, 0],
  },
])

export const DEFAULT_PRESET_COLORS = ['#3232F5', '#07A0C3', '#F0C808', '#91F5AD', '#dd1c1a', '#463F3A']
