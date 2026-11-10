import js from "@eslint/js";
import tseslint from "typescript-eslint";

/**
 * Shared ESLint flat configuration for VEXORA TypeScript packages.
 */
export function buat_konfigurasi_eslint_dasar(opsi = {}) {
  const { abaikan_tambahan = [] } = opsi;

  return tseslint.config(
    {
      ignores: [
        "**/node_modules/**",
        "**/dist/**",
        "**/.next/**",
        "**/coverage/**",
        "**/generated/**",
        ...abaikan_tambahan,
      ],
    },
    js.configs.recommended,
    ...tseslint.configs.recommended,
    {
      rules: {
        "@typescript-eslint/no-explicit-any": "error",
        "@typescript-eslint/no-unused-vars": [
          "error",
          {
            argsIgnorePattern: "^_",
            varsIgnorePattern: "^_",
          },
        ],
        "no-console": "off",
      },
    },
  );
}

export default buat_konfigurasi_eslint_dasar();
