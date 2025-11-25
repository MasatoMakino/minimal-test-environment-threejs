# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a minimal testing environment for Three.js applications. It demonstrates how to set up browser-based unit tests for both WebGL and WebGPU renderers using Vitest with WebDriverIO.

## Key Technologies

- **Testing Framework**: Vitest with browser mode (`@vitest/browser`)
- **Browser Provider**: WebDriverIO with Chrome headless
- **Target Library**: Three.js (WebGL and WebGPU renderers)
- **Runtime**: Node.js 22 (ES modules)

## Development Commands

### Security-Conscious Approach (Recommended)

This repository demonstrates DevContainer-based development as a defense against npm supply chain attacks.

**DevContainer provides:**
- **Filesystem Isolation**: Separates working directory from host OS
- **Environment Isolation**: Limits access to host environment variables and system information
- **Damage Containment**: Minimizes impact if malware infiltrates node_modules

**Prerequisites**: Docker Desktop and DevContainer CLI (`npm install -g @devcontainers/cli`)

#### Start DevContainer

```bash
devcontainer up --workspace-folder .
```

#### Install Dependencies

```bash
devcontainer exec --workspace-folder . npm ci
```
Use `npm ci` (not `npm install`) to ensure exact versions from package-lock.json.

#### Run Tests

```bash
devcontainer exec --workspace-folder . npm run test:ci
```
Runs `xvfb-run --auto-servernum vitest --run` in headless Chrome environment.

### Alternative: Local Execution (Understand Security Trade-offs)

For users who find DevContainer excessive, direct local execution is available:

```bash
npm ci
npm test
```

**Available npm Scripts:**
- `npm test`: Direct Chrome execution (requires Chrome installed locally)
- `npm run test:ci`: xvfb-wrapped execution for headless environments

**Note**: Local execution exposes your host system to potential risks from compromised npm packages. The DevContainer approach is recommended for security-sensitive environments.

## Architecture

### Test Configuration

**File**: `vitest.config.ts`

Key settings:
- Browser mode enabled with WebDriverIO provider
- Chrome headless configuration
- ESNext target for esbuild optimization

### Test Structure

Tests are located in `__test__/Test.spec.ts` and cover:
1. Basic 2D canvas context creation
2. WebGL renderer initialization and rendering
3. WebGPU renderer initialization and rendering (async with `await renderer.init()`)

### WebGPU Renderer Pattern

**IMPORTANT**: WebGPU renderer requires initialization before use:
```typescript
const renderer = new WebGPURenderer();
await renderer.init();  // Must call init() before render()
renderer.render(scene, camera);
```

This pattern replaced the deprecated `renderAsync()` method in Three.js r162+.

### DevContainer Architecture

**Base Image**: `node:22-bookworm-slim` (Debian Bookworm)

**Key Components**:
- Google Chrome Stable (installed from official repository)
- xvfb (virtual X11 display for headless WebGL rendering)
- SwiftShader (CPU-based WebGL software rendering)

**Why xvfb**: Chrome requires a display server even in headless mode for WebGL rendering. xvfb provides virtual X11 context for SwiftShader CPU rendering without GPU access.

**Security**: Container runs with `SYS_ADMIN` capability to allow Chrome sandboxing. This is standard practice for containerized browser testing.

See `.devcontainer/README.md` for detailed architecture decisions and troubleshooting.

## CI/CD

**Workflow**: `.github/workflows/test.yml`

- Runs on: `ubuntu-latest`
- Node versions: 20.x, 22.x
- Commands: `npm ci` → `npm run test:ci`
- Consistency: Uses same xvfb-based approach as DevContainer

## Important Notes

### Browser Testing Environment

- Tests run in real Chrome browser (not JSDOM)
- WebGL/WebGPU rendering requires browser context
- Software rendering (SwiftShader) used in headless/container environments
- CPU rendering is 20-40% slower than GPU rendering

### Vitest Configuration

The project uses `browser.instances` (not deprecated `browser.name`) for browser configuration:
```typescript
browser: {
  enabled: true,
  provider: "webdriverio",
  instances: [{ browser: "chrome" }],
  headless: true,
}
```

### Security Policy

**This repository demonstrates two approaches:**

1. **DevContainer (Recommended)**: Provides defense against npm supply chain attacks through:
   - Filesystem isolation from host OS
   - Environment variable and system information isolation
   - Containment of potential malware in node_modules
   - Consistent environment between development and CI
   - Proper Chrome browser sandboxing capabilities

2. **Local Execution (Optional)**: Available for users who understand and accept the security trade-offs. Suitable for learning and experimentation, but not recommended for production or security-sensitive environments.
