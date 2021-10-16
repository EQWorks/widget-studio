const merge = require('lodash.merge')
const base = require('@eqworks/lumen-labs/tailwind.config.js')


const config = {
  theme: {
    extend: {
      // place extended styles here
    }
  }
}

module.exports = merge(base, config)
