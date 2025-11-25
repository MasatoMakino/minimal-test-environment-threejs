import { defineConfig } from "vitest/config";
import { webdriverio } from "@vitest/browser-webdriverio";

export default defineConfig({
  optimizeDeps: {
    esbuildOptions: {
      target: "esnext",
    },
  },
  test: {
    browser: {
      enabled: true,
      provider: webdriverio(),
      instances: [
        {
          browser: "chrome",
        },
      ],
      headless: true,
    },
  },
});
