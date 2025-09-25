import {
    defineConfig,
    globalIgnores,
} from "eslint/config";

import tsParser from "@typescript-eslint/parser";
import typescriptEslint from "@typescript-eslint/eslint-plugin";
import globals from "globals";
import js from "@eslint/js";

import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const typescriptStrictTypeCheckedRules = typescriptEslint.configs["strict-type-checked"]?.rules ?? {};
const typescriptStylisticTypeCheckedRules = typescriptEslint.configs["stylistic-type-checked"]?.rules ?? {};

const baseTypeScriptLanguageOptions = {
    parser: tsParser,
    parserOptions: {
        projectService: true,
        tsconfigRootDir: __dirname,
    },
    ecmaVersion: "latest",
    sourceType: "module",
    globals: {
        ...globals.node,
    },
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
        "**/coverage/**",
        "**/*.min.js",
        "**/jest.config.js",
        ".releaserc.js",
    ]),
    {
        files: ["**/*.{js,jsx,mjs,cjs}"],
        languageOptions: {
            ecmaVersion: "latest",
            sourceType: "module",
            globals: {
                ...globals.node,
            },
        },
        rules: {
            ...js.configs.recommended.rules,
            "no-console": ["warn", { allow: ["warn", "error"] }],
        },
    },
    {
        files: ["**/*.{ts,tsx,cts,mts}"],
        languageOptions: baseTypeScriptLanguageOptions,
        plugins: {
            "@typescript-eslint": typescriptEslint,
        },
        rules: {
            ...typescriptStrictTypeCheckedRules,
            ...typescriptStylisticTypeCheckedRules,
            "@typescript-eslint/consistent-type-exports": "error",
            "@typescript-eslint/consistent-type-imports": [
                "error",
                {
                    prefer: "type-imports",
                    fixStyle: "separate-type-imports",
                },
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
            "@typescript-eslint/no-floating-promises": [
                "error",
                {
                    ignoreIIFE: false,
                },
            ],
            "@typescript-eslint/no-unnecessary-type-assertion": "error",
            "@typescript-eslint/no-unused-vars": [
                "error",
                {
                    argsIgnorePattern: "^_",
                    caughtErrorsIgnorePattern: "^_",
                    varsIgnorePattern: "^_",
                },
            ],
            "@typescript-eslint/prefer-readonly": "error",
            "@typescript-eslint/switch-exhaustiveness-check": "error",
        },
    },
    {
        files: ["**/*.{test,spec}.{ts,tsx}"],
        languageOptions: {
            ...baseTypeScriptLanguageOptions,
            globals: {
                ...globals.node,
                ...globals.jest,
            },
        },
    },
    {
        files: ["**/*.{test,spec}.{js,jsx}"],
        languageOptions: {
            ecmaVersion: "latest",
            sourceType: "module",
            globals: {
                ...globals.node,
                ...globals.jest,
            },
        },
    },
]);
