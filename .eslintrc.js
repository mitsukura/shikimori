module.exports = {
  extends: 'next/core-web-vitals',
  rules: {
    '@typescript-eslint/no-unused-vars': ['warn', { 
      argsIgnorePattern: '^_',
      varsIgnorePattern: '^_' 
    }],
    '@typescript-eslint/ban-types': 'off',
    'react/no-unescaped-entities': 'off',
    'typescript-eslint/no-explicit-any': 'off'
  }
};
