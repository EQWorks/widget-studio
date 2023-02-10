export const tableUniqueOptions = [
  'pagination',
  'headerTitle',
  'compactTable',
  'centeredHeader',
  'barColumns',
  'borderType',
  'headerColor',
].reduce((a, v) => ({ ...a, [v.toUpperCase()]: v }), {})

export const headerColor = ['white', 'grey']

export const borderType = ['horizontal', 'vertical', 'around', 'none']
