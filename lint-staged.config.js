'use strict'

module.exports = {
  '*.{js,jsx,ts,tsx,md,json}': 'prettier --write --ignore-unknown',
  '*.{ts,js}': 'eslint --ext .ts,.js .'
}
