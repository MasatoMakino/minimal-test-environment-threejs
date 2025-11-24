# minimal-test-environment-threejs
Minimal example for unit testing three.js

## Development

### Using DevContainer (Recommended)

This project includes a DevContainer configuration for isolated npm environment with Chrome browser testing support.

**Prerequisites:**
- Docker Desktop
- DevContainer CLI (`npm install -g @devcontainers/cli`)

**Usage:**
1. Build and start the container:
   ```bash
   devcontainer up --workspace-folder .
   ```
2. Execute commands in the container:
   ```bash
   devcontainer exec --workspace-folder . npm ci
   devcontainer exec --workspace-folder . npm run test:ci
   ```

The DevContainer uses Debian Bookworm (node:22-bookworm-slim) with Google Chrome, providing a consistent headless browser testing environment with xvfb.

### Local Development

Install dependencies:
```bash
npm ci
```

Run tests:
```bash
npm test
```

**Note:** Local testing requires Chrome browser to be installed. The `test` command runs directly without xvfb, while `test:ci` is used in CI/container environments.
