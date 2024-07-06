import pluginJs from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';


export default [
  {files: ['**/*.ts'], languageOptions: {sourceType: 'module'}},
  {
    languageOptions: { 
      globals: {
        ...globals.browser,
        ...globals.node,
      },
      parserOptions: {
				parser: tseslint.parser,
			},
    }
  },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  {
    rules: {
      'quotes': [
          'error',
          'single'
      ],
      'semi': [
        'error',
        'always'
      ],
      // 'no-undef': 'error',
    }
  }
];