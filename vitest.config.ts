import { defineConfig } from "vitest/config";

// Server-side unit tests run from the repo root (the Vite config roots at
// client/, which would otherwise hide server/*.test.ts). Node environment.
export default defineConfig({
  test: {
    root: ".",
    include: ["server/**/*.{test,spec}.ts"],
    environment: "node",
  },
});
