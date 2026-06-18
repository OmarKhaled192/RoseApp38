import nx from '@nx/eslint-plugin';

export default [
  ...nx.configs['flat/base'],
  ...nx.configs['flat/typescript'],
  ...nx.configs['flat/javascript'],
  {
    ignores: [
      '**/dist',
      '**/vite.config.*.timestamp*',
      '**/vitest.config.*.timestamp*',
    ],
  },
  {
    files: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx'],
    rules: {
      '@nx/enforce-module-boundaries': [
        'error',
        {
          enforceBuildableLibDependency: true,
          allow: ['^.*/eslint(\\.base)?\\.config\\.[cm]?[jt]s$'],
          depConstraints: [
            {
              sourceTag: 'scope:shared',
              onlyDependOnLibsWithTags: ['scope:shared'],
            },

            {
              sourceTag: 'scope:auth',
              onlyDependOnLibsWithTags: ['scope:shared', 'scope:auth'],
            },

            {
              sourceTag: 'scope:rose',
              onlyDependOnLibsWithTags: ['scope:shared', 'scope:rose'],
            },

            {
              sourceTag: 'scope:admin',
              onlyDependOnLibsWithTags: ['scope:shared', 'scope:admin'],
            },

            {
              sourceTag: 'scope:shell',
              onlyDependOnLibsWithTags: ['scope:shared'],
            },


          ]
        },
      ],
    },
  },
  {
    files: [
      '**/*.ts',
      '**/*.tsx',
      '**/*.cts',
      '**/*.mts',
      '**/*.js',
      '**/*.jsx',
      '**/*.cjs',
      '**/*.mjs',
    ],
    // Override or add rules here
    rules: {},
  },
];
