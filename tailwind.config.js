const merge = require('lodash.merge')
const base = require('@eqworks/lumen-labs/tailwind.config.js')


const config = {
  plugins: [require('tailwindcss-children')],
  variants: {
    extend: {
      flex: ['children-not-first'],
      textColor: ['children'],
      textOverflow: ['children'],
      margin: ['hover'],
    },
  },
  theme: {
    extend: {
      padding: {
        '1rem': '1rem',
      },
      gridTemplateColumns: {
        'min-min': 'min-content min-content',
        'min-1fr': 'min-content 1fr',
      },
      transitionProperty: {
        'max-width': 'max-width',
      },
      borderWidth: {
        'custom-1': '0.3rem',
      },
    },
  },
}

module.exports = merge(base, config)
