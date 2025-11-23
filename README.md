# minimal-test-environment-threejs
Minimal example for unit testing three.js

## Development

### Using DevContainer (Recommended)

This project includes a DevContainer configuration for isolated npm environment with Chrome browser testing support.

**Prerequisites:**
- Docker Desktop
- Visual Studio Code with DevContainers extension

**Usage:**
1. Open this project in VS Code
2. Press `F1` and select "Dev Containers: Reopen in Container"
3. Wait for the container to build and dependencies to install
4. Run tests: `npm test`

The DevContainer uses Ubuntu 24.04 with Google Chrome, matching the GitHub Actions CI environment for consistent test results.

### Local Development

Install dependencies:
```bash
npm ci
```

Run tests:
```bash
npm test
```

**Note:** Local testing requires Chrome browser and xvfb (Linux only) to be installed.
