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
      boxShadow: {
        'widget': 'inset -4px 4px 4px rgba(54, 111, 228, 0.1)',
      },
      borderWidth: {
        'custom-1': '0.3rem',
      },
    },
  },
}

module.exports = merge(base, config)
