export default [
  'line',
  'bar',
  'barLine',
  'scatter',
  'pie',
  'map',
  'stat',
  'table',
  'pyramid',
  'text',
].reduce((a, v) => ({ ...a, [v.toUpperCase()]: v }), {})
