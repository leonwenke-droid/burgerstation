import * as esbuild from "esbuild";

await esbuild.build({
  entryPoints: ["api/_source.ts"],
  bundle: true,
  platform: "node",
  format: "esm",
  outfile: "api/index.js",
  banner: {
    js: "import { createRequire } from 'module'; const require = createRequire(import.meta.url);",
  },
});

console.log("  api/index.js  built ✓");
