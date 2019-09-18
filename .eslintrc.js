module.exports = {
    root: true,
    env: {
        es6: true,
        node: true
    },
    parserOptions: {
        ecmaVersion: 2017,
        ecmaFeatures: {
        experimentalObjectRestSpread: true,
            jsx: true
        },
        sourceType: 'module'
    },
    rules: {
        //Stylistic Issues
        "no-multiple-empty-lines": ["error", { "max": 1}],
        "block-spacing": [2, 'always'],
        "brace-style": [2, '1tbs', { 'allowSingleLine': true }],
        "comma-spacing": [2, { 'before': false, 'after': true }],
        "comma-style": [2, 'last'],
        "no-trailing-spaces": 2,
        "semi": [2, 'always'],
        "keyword-spacing": 2,
        "indent": 2,
        'space-before-function-paren': ["error", "never"],
        "comma-dangle": ["error", "never"],
        "quotes": ["error", "single"],
        "space-infix-ops": 2,
        "space-in-parens": 2,
        "lines-around-comment": 2,
        "padded-blocks": ["error", "never"],
        "camelcase": 2,
        "one-var": ["error", "never"],
        "no-use-before-define": "error",
        "eqeqeq": 2,
        "curly": 2,
        "operator-linebreak": ["error", "after"],
        
        // "object-curly-newline": ["error", "always"],
        //Best Practices
        "no-multi-spaces": 2,
        "no-useless-call": 2,
        "key-spacing": 2,
        "no-eval": "error",
        "no-caller": "error",
        "no-with": "error",
        //Variables
        "no-unused-vars": [2, { 'vars': 'all', 'args': 'none' }],

    }
}