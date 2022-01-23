module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint/eslint-plugin', 'import', 'eslint-plugin-tsdoc'],
  extends: ['plugin:@typescript-eslint/recommended'],
  env: {
    jest: true,
    node: true
  },
  rules: {
    'tsdoc/syntax': 'error',
    'no-console': 'error',

    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    '@typescript-eslint/no-dupe-class-members': ['error'],
    '@typescript-eslint/no-useless-constructor': ['error'],
    '@typescript-eslint/no-inferrable-types': ['off'],
    '@typescript-eslint/ban-types': ['warn'],
    '@typescript-eslint/no-explicit-any': ['off'],
    '@typescript-eslint/no-extra-semi': ['off'],

    'import/extensions': [
      'error',
      'ignorePackages',
      { js: 'always', jsx: 'never', ts: 'never', tsx: 'never' }
    ],
    'import/order': [
      'error',
      {
        groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index', 'object']
      }
    ],
    'import/no-named-as-default': ['off'],
    'import/no-duplicates': ['off'],
    'import/no-mutable-exports': ['error'],
    'import/no-useless-path-segments': [
      'error',
      {
        noUselessIndex: false
      }
    ],
    'import/no-self-import': ['error'],
    'import/export': ['error'],
    'import/no-deprecated': ['error']
  },
  settings: {
    'import/extensions': ['.js', '.ts'],
    'import/parsers': {
      '@typescript-eslint/parser': ['.ts']
    },
    'import/internal-regex': '^@mockdog/'
  },
  overrides: [
    {
      files: ['*.test.ts', '*.spec.ts'],
      rules: {
        'import/extensions': ['off'],
        '@typescript-eslint/no-useless-constructor': ['off'],
        '@typescript-eslint/no-empty-function': ['off'],
        '@typescript-eslint/no-unused-vars': ['off']
      }
    }
  ]
}
