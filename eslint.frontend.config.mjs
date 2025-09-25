import {
    defineConfig,
    globalIgnores,
} from "eslint/config";

import tsParser from "@typescript-eslint/parser";
import typescriptEslint from "@typescript-eslint/eslint-plugin";
import js from "@eslint/js";
import reactPlugin from "eslint-plugin-react";
import reactHooksPlugin from "eslint-plugin-react-hooks";
import jsxA11yPlugin from "eslint-plugin-jsx-a11y";
import testingLibraryPlugin from "eslint-plugin-testing-library";
import jestDomPlugin from "eslint-plugin-jest-dom";
import nextPlugin from "@next/eslint-plugin-next";
import globals from "globals";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const browserGlobals = {
    ...globals.browser,
    ...globals.es2022,
};

const testingGlobals = {
    ...browserGlobals,
    ...globals.jest,
};

const baseJsLanguageOptions = {
    ecmaVersion: "latest",
    sourceType: "module",
    parserOptions: {
        ecmaFeatures: {
            jsx: true,
        },
    },
    globals: browserGlobals,
};

const baseTypeScriptLanguageOptions = {
    parser: tsParser,
    parserOptions: {
        projectService: true,
        tsconfigRootDir: __dirname,
        ecmaFeatures: {
            jsx: true,
        },
    },
    ecmaVersion: "latest",
    sourceType: "module",
    globals: browserGlobals,
};

const typescriptStrictTypeCheckedRules =
    typescriptEslint.configs["strict-type-checked"]?.rules ?? {};
const typescriptStylisticTypeCheckedRules =
    typescriptEslint.configs["stylistic-type-checked"]?.rules ?? {};

const reactRecommendedRules =
    reactPlugin.configs.flat?.recommended?.rules ??
    reactPlugin.configs.recommended?.rules ??
    {};
const reactJsxRuntimeRules =
    reactPlugin.configs.flat?.["jsx-runtime"]?.rules ??
    reactPlugin.configs["jsx-runtime"]?.rules ??
    {};

const reactStrictRules = {
    ...reactRecommendedRules,
    ...reactJsxRuntimeRules,
    "react/jsx-no-leaked-render": [
        "error",
        { validStrategies: ["coerce", "ternary"] },
    ],
    "react/no-unstable-nested-components": [
        "error",
        { allowAsProps: false },
    ],
    "react/jsx-no-useless-fragment": "error",
    "react/jsx-props-no-spreading": [
        "error",
        {
            html: "enforce",
            custom: "enforce",
            explicitSpread: "ignore",
        },
    ],
    "react/no-array-index-key": "error",
    "react/self-closing-comp": ["error", { component: true, html: true }],
    "react/prefer-exact-props": "error",
    "react/no-danger": "error",
    "react/no-children-prop": "error",
    "react/function-component-definition": [
        "error",
        {
            namedComponents: "arrow-function",
            unnamedComponents: "arrow-function",
        },
    ],
    "react/jsx-filename-extension": [
        "error",
        { extensions: [".tsx", ".jsx"] },
    ],
    "react/jsx-boolean-value": ["error", "never"],
    "react/react-in-jsx-scope": "off",
    "react/prop-types": "off",
    "react/no-unused-prop-types": "error",
};

const reactHooksStrictRules = {
    "react-hooks/rules-of-hooks": "error",
    "react-hooks/exhaustive-deps": [
        "error",
        {
            additionalHooks: "(use(Recoil|Redux|Form)Callback)",
        },
    ],
};

const jsxA11yStrictRules =
    jsxA11yPlugin.configs.strict?.rules ??
    jsxA11yPlugin.configs.recommended?.rules ??
    {};

const nextCoreWebVitalsRules =
    nextPlugin.configs["core-web-vitals"]?.rules ??
    nextPlugin.configs.recommended?.rules ??
    {};

const testingLibraryStrictRules =
    testingLibraryPlugin.configs["flat/react"]?.rules ??
    testingLibraryPlugin.configs.react?.rules ??
    {};

const testingLibraryDomRules =
    testingLibraryPlugin.configs["flat/dom"]?.rules ??
    testingLibraryPlugin.configs.dom?.rules ??
    {};

const jestDomRules = jestDomPlugin.configs.recommended?.rules ?? {};

const commonImportRules = {
    "no-restricted-imports": [
        "error",
        {
            patterns: [
                {
                    group: ["../*"],
                    message: "Prefer absolute imports for better portability.",
                },
            ],
        },
    ],
};

const baseJavaScriptRules = {
    ...js.configs.recommended.rules,
    ...reactStrictRules,
    ...reactHooksStrictRules,
    ...jsxA11yStrictRules,
    ...nextCoreWebVitalsRules,
    ...commonImportRules,
    "no-console": [
        "warn",
        { allow: ["warn", "error"] },
    ],
};

const typeScriptStrictRules = {
    ...baseJavaScriptRules,
    ...typescriptStrictTypeCheckedRules,
    ...typescriptStylisticTypeCheckedRules,
    "@typescript-eslint/array-type": ["error", { default: "generic" }],
    "@typescript-eslint/consistent-type-exports": [
        "error",
        { fixMixedExportsWithInlineTypeSpecifier: true },
    ],
    "@typescript-eslint/consistent-type-imports": [
        "error",
        { prefer: "type-imports", fixStyle: "separate-type-imports" },
    ],
    "@typescript-eslint/explicit-function-return-type": [
        "error",
        {
            allowExpressions: false,
            allowTypedFunctionExpressions: false,
        },
    ],
    "@typescript-eslint/no-explicit-any": [
        "error",
        {
            fixToUnknown: true,
            ignoreRestArgs: false,
        },
    ],
    "@typescript-eslint/no-floating-promises": "error",
    "@typescript-eslint/no-unnecessary-type-assertion": "error",
    "@typescript-eslint/no-misused-promises": [
        "error",
        { checksVoidReturn: { attributes: false } },
    ],
    "@typescript-eslint/no-confusing-void-expression": [
        "error",
        { ignoreArrowShorthand: false },
    ],
    "@typescript-eslint/no-import-type-side-effects": "error",
    "@typescript-eslint/prefer-readonly": "error",
    "@typescript-eslint/switch-exhaustiveness-check": "error",
    "@typescript-eslint/no-unused-vars": [
        "error",
        {
            argsIgnorePattern: "^_",
            varsIgnorePattern: "^_",
            caughtErrorsIgnorePattern: "^_",
        },
    ],
    "@typescript-eslint/use-unknown-in-catch": "error",
    "@typescript-eslint/no-use-before-define": [
        "error",
        {
            functions: false,
            classes: true,
            variables: true,
        },
    ],
    "@typescript-eslint/ban-ts-comment": [
        "error",
        {
            minimumDescriptionLength: 10,
            "ts-expect-error": "allow-with-description",
        },
    ],
    "@typescript-eslint/consistent-indexed-object-style": [
        "error",
        "record",
    ],
    "no-unused-vars": "off",
    "no-redeclare": "off",
    "no-undef": "off",
    "no-use-before-define": "off",
};

const testingRules = {
    ...testingLibraryStrictRules,
    ...testingLibraryDomRules,
    ...jestDomRules,
    "testing-library/no-await-sync-events": "error",
    "testing-library/no-container": "error",
    "testing-library/no-debugging-utils": "error",
    "testing-library/no-render-in-setup": "error",
    "testing-library/no-wait-for-multiple-assertions": "error",
    "testing-library/prefer-presence-queries": "error",
    "testing-library/prefer-screen-queries": "error",
    "testing-library/prefer-user-event": "error",
    "jest-dom/prefer-enabled-disabled": "error",
    "jest-dom/prefer-checked": "error",
};

export default defineConfig([
    {
        linterOptions: {
            reportUnusedDisableDirectives: "error",
        },
    },
    globalIgnores([
        "**/dist/**",
        "**/node_modules/**",
        "**/.next/**",
        "**/out/**",
        "**/coverage/**",
        "**/.turbo/**",
        "**/.vercel/**",
    ]),
    {
        files: ["**/*.{js,jsx,mjs,cjs}"],
        languageOptions: baseJsLanguageOptions,
        plugins: {
            react: reactPlugin,
            "react-hooks": reactHooksPlugin,
            "jsx-a11y": jsxA11yPlugin,
            "@next/next": nextPlugin,
        },
        settings: {
            react: {
                version: "detect",
            },
        },
        rules: baseJavaScriptRules,
    },
    {
        files: ["**/*.{ts,tsx,cts,mts}"],
        languageOptions: baseTypeScriptLanguageOptions,
        plugins: {
            "@typescript-eslint": typescriptEslint,
            react: reactPlugin,
            "react-hooks": reactHooksPlugin,
            "jsx-a11y": jsxA11yPlugin,
            "@next/next": nextPlugin,
        },
        settings: {
            react: {
                version: "detect",
            },
        },
        rules: typeScriptStrictRules,
    },
    {
        files: [
            "**/*.{spec,test}.{js,jsx}",
            "**/__tests__/**/*.{js,jsx}",
        ],
        languageOptions: {
            ...baseJsLanguageOptions,
            globals: testingGlobals,
        },
        plugins: {
            react: reactPlugin,
            "react-hooks": reactHooksPlugin,
            "jsx-a11y": jsxA11yPlugin,
            "@next/next": nextPlugin,
            "testing-library": testingLibraryPlugin,
            "jest-dom": jestDomPlugin,
        },
        settings: {
            react: {
                version: "detect",
            },
        },
        rules: {
            ...baseJavaScriptRules,
            ...testingRules,
        },
    },
    {
        files: [
            "**/*.{spec,test}.{ts,tsx}",
            "**/__tests__/**/*.{ts,tsx}",
        ],
        languageOptions: {
            ...baseTypeScriptLanguageOptions,
            globals: testingGlobals,
        },
        plugins: {
            "@typescript-eslint": typescriptEslint,
            react: reactPlugin,
            "react-hooks": reactHooksPlugin,
            "jsx-a11y": jsxA11yPlugin,
            "@next/next": nextPlugin,
            "testing-library": testingLibraryPlugin,
            "jest-dom": jestDomPlugin,
        },
        settings: {
            react: {
                version: "detect",
            },
        },
        rules: {
            ...typeScriptStrictRules,
            ...testingRules,
        },
    },
    {
        files: ["**/pages/_document.{ts,tsx,js,jsx}"],
        rules: {
            "@next/next/no-document-import-in-page": "off",
        },
    },
]);
