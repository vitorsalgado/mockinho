module.exports = {
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint/eslint-plugin', 'eslint-plugin-tsdoc', 'import'],
  extends: [
    'plugin:@typescript-eslint/recommended',
    'standard',
    'plugin:import/recommended',
    'plugin:import/typescript',
    'prettier'
  ],
  env: {
    jest: true,
    node: true
  },
  rules: {
    'tsdoc/syntax': 'error',

    'no-unused-vars': 'off',
    'space-before-function-paren': 'off',
    'no-console': 'error',

    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    'no-dupe-class-members': 'off',
    '@typescript-eslint/no-dupe-class-members': ['error'],
    'no-useless-constructor': 'off',
    '@typescript-eslint/no-useless-constructor': ['error'],
    '@typescript-eslint/no-inferrable-types': ['off'],
    '@typescript-eslint/ban-types': ['warn'],

    'import/order': [
      'error',
      {
        groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index', 'object']
      }
    ],
    'import/no-duplicates': ['error', { considerQueryString: false }],
    'import/no-mutable-exports': ['error'],
    'import/no-useless-path-segments': [
      'error',
      {
        noUselessIndex: true
      }
    ],
    'import/no-self-import': ['error'],
    'import/named': ['error'],
    'import/export': ['error'],
    'import/no-unused-modules': [1, { unusedExports: true }],
    'import/no-deprecated': ['error']
  },
  settings: {
    'import/extensions': ['.js', '.ts'],
    'import/parsers': {
      '@typescript-eslint/parser': ['.ts']
    },
    'import/internal-regex': '^@mockinho/'
  }
}
