// deno-lint-ignore no-external-import
import { build, emptyDir } from "https://deno.land/x/dnt@0.32.1/mod.ts";

if (Deno.args[0] === undefined) {
  throw new Error("Package version not specified");
}

await emptyDir("./npm");

await build({
  entryPoints: ["./mod.ts"],
  outDir: "./npm",
  importMap: "./import_map.json",

  // Don't include CommonJS
  scriptModule: false,

  // Needed for fetch() and other modern APIs
  compilerOptions: {
    lib: ["dom", "dom.iterable"],
  },

  // Technically not needed
  shims: {
    deno: true,
  },

  // package.json
  package: {
    name: "untis-api-client",
    version: Deno.args[0],
    description: "Client for accessing the WebUntis API.",
    license: "MIT",
    repository: {
      type: "git",
      url: "git+https://github.com/arnim279/untis-api-client.git",
    },
    bugs: {
      url: "https://github.com/arnim279/untis-api-client/issues",
    },
    engines: {
      node: ">=18",
    },
  },
});

Deno.copyFileSync("LICENSE", "npm/LICENSE");
Deno.copyFileSync("README.md", "npm/README.md");
