module.exports = {
    root: true,
    parser: '@typescript-eslint/parser',
    plugins: ['@typescript-eslint'],
    env: {
        node: true,
    },
    extends: ['eslint:all', 'plugin:@typescript-eslint/all', 'prettier'],
    rules: {
        '@typescript-eslint/no-empty-function': [
            'error',
            { allow: ['constructors'] },
        ],
        '@typescript-eslint/no-unused-vars': [
            'error',
            { argsIgnorePattern: '^_' },
        ],
        '@typescript-eslint/no-unnecessary-condition': [
            'error',
            { allowConstantLoopConditions: true },
        ],
    },
};
