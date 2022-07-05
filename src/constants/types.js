export default [
  'line',
  'bar',
  'scatter',
  'pie',
  'map',
  'stat',
  'table',
  'pyramid',
].reduce((a, v) => ({ ...a, [v.toUpperCase()]: v }), {})
