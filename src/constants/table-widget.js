// export const tableUniqueOptions = {
//   hidePagination: 'hidePagination',
//   headerTitle: 'headerTitle',
//   compactTable: 'compactTable',
//   centerHeader: 'centerHeader',
//   barColumns: 'barColumns',
//   borderType: 'borderType',
//   headerColor: 'headerColor',
// }
export const tableUniqueOptions = [
  'hidePagination',
  'headerTitle',
  'compactTable',
  'centerHeader',
  'barColumns',
  'borderType',
  'headerColor',
].reduce((a, v) => ({ ...a, [v.toUpperCase()]: v }), {})

export const headerColor = ['white', 'grey']

export const borderType = ['none', 'horizontal', 'vertical', 'around']
