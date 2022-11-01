export default [
  'domain',
  'value',
  'right_sidebar',
  'general',
].reduce((a, v) => ({ ...a, [v.toUpperCase()]: v }), {})
