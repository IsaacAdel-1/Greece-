import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import { fileURLToPath } from "node:url";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./test/setup.ts"],
    include: ["src/**/*.{test,spec}.{ts,tsx}"],
    // The default worker-thread pool crashes on teardown on some Windows
    // setups (tinypool "Worker exited unexpectedly"). Forks are more stable
    // and a single fork avoids repeatedly spinning up the jsdom environment.
    pool: "forks",
    poolOptions: {
      forks: { singleFork: true },
    },
    coverage: {
      provider: "v8",
      reporter: ["text", "html"],
      include: ["src/lib/**", "src/components/**"],
    },
  },
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
      // `server-only`/`client-only` throw when resolved under jsdom; stub them
      // so server modules can be unit-tested directly.
      "server-only": fileURLToPath(
        new URL("./test/empty-module.ts", import.meta.url),
      ),
      "client-only": fileURLToPath(
        new URL("./test/empty-module.ts", import.meta.url),
      ),
    },
  },
});
