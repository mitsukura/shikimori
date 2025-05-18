module.exports = {
  extends: 'next/core-web-vitals',
  rules: {
    '@typescript-eslint/no-unused-vars': ['warn', { 
      argsIgnorePattern: '^_',
      varsIgnorePattern: '^_' 
    }],
    '@typescript-eslint/ban-types': 'off',
    'react/no-unescaped-entities': 'off',
    'typescript-eslint/no-explicit-any': 'off',
    // アクセシビリティルールの調整
    'jsx-a11y/alt-text': 'warn', // エラーではなく警告として表示
    'jsx-a11y/aria-props': 'warn',
    'jsx-a11y/aria-proptypes': 'warn',
    'jsx-a11y/aria-unsupported-elements': 'warn',
    'jsx-a11y/role-has-required-aria-props': 'warn',
    'jsx-a11y/role-supports-aria-props': 'warn'
  }
};
