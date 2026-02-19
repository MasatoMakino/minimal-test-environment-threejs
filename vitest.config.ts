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
      provider: webdriverio({
        capabilities: {
          "goog:chromeOptions": {
            args: ["--use-gl=angle", "--use-angle=swiftshader"],
          },
        },
      }),
      instances: [
        {
          browser: "chrome",
        },
      ],
      headless: true,
    },
  },
});
