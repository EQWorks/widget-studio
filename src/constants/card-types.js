export default [
  'domain',
  'value',
  'general',
].reduce((a, v) => ({ ...a, [v.toUpperCase()]: v }), {})
