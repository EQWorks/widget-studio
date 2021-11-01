const merge = require('lodash.merge')
const base = require('@eqworks/lumen-labs/tailwind.config.js')


const config = {
  plugins: [require('tailwindcss-children')],
  variants: {
    extend: {
      flex: ['children-not-first'],
      textColor: ['children'],
      textOverflow: ['children'],
    },
  },
  theme: {
    extend: {
      transitionProperty: {
        'max-width': 'max-width',
      },
    },
  },
}

module.exports = merge(base, config)
