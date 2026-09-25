import js from "@eslint/js";
import globals from "globals";

export default [
    js.configs.recommended,
    {
        files: ["**/*.js"],
        languageOptions: {
            globals: {
                ...globals.browser,
            },
        },
        rules: {
            "no-unused-vars": "warn", // предупреждать о неиспользуемых переменных
            "no-undef": "error",      // ошибка при использовании необъявленных переменных
        },
    },
];