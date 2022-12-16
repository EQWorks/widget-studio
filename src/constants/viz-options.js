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
    string: 'Top',
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
    string: 'Bottom',
    numeric: [0.5, 0],
  },
  {
    string: 'Bottom-right',
    numeric: [1, 0],
  },
  {
    string: 'Left',
    numeric: [0, 0.5],
  },
  {
    string: 'Right',
    numeric: [1, 0.5],
  },
])

export const CHART_Z_POSITIONS = [
  'Front',
  'Back',
].reduce((a, v) => ({ ...a, [v.toLowerCase()]: v }), {})
