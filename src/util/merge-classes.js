import mergeWith from 'lodash.mergewith'


export default (a, b) => mergeWith(a, b, (_a, _b) => [_a, _b].join(' '))
