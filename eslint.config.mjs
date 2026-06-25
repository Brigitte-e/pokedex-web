import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Cypress files use namespace augmentation to extend Chainable — not app code
    "cypress/**",
    "cypress.config.ts",
    'storybook-static/**',
    // Claude Code skills are external tooling, not project code
    '.claude/**',
  ]),
]);

export default eslintConfig;
