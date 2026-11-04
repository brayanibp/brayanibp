import nextVitals from "eslint-config-next/core-web-vitals";

const config = [
  ...nextVitals,
  {
    ignores: [
      ".next/**",
      "out/**",
      "build/**",
      "node_modules/**",
      "next-env.d.ts",
    ],
  },
  {
    rules: {
      // These components intentionally initialize local UI state from browser APIs.
      "react-hooks/set-state-in-effect": "off",
    },
  },
];

export default config;
