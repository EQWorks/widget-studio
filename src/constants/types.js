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
].reduce((a, v) => ({ ...a, [v.toUpperCase()]: v }), {})
