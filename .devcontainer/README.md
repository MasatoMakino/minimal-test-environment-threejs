# DevContainer Configuration

## Overview

This DevContainer provides an isolated npm environment for Three.js browser testing with Chrome. The configuration is designed to maintain consistency between local development and CI environments while keeping the Docker image footprint manageable.

## Architecture Decisions

### Base Image: `node:22-bookworm-slim`

**Choice:** Debian Bookworm-based Node.js 22 slim image

**Rationale:**
- **Compatibility**: Better library compatibility compared to Alpine Linux (glibc vs musl)
- **Stability**: Official Node.js image with long-term support
- **Size**: Slim variant (227MB base) balances footprint and functionality
- **CI Alignment**: Similar to GitHub Actions ubuntu-latest environment

**Alternatives Considered:**
- ❌ **Alpine Linux**: WebGL compatibility issues with Chromium (Swiftshader errors)
- ❌ **Ubuntu**: Larger base image (~80MB) with no significant benefit
- ❌ **Full node:22**: Unnecessary packages increase image size

### Browser: Google Chrome Stable

**Choice:** System-installed Chrome via official Google repository

**Rationale:**
- **WebGL Support**: Full WebGL/WebGL2 support with software rendering (SwiftShader)
- **Stability**: Official stable releases
- **CI Parity**: Matches browser available in GitHub Actions environment
- **Three.js Compatibility**: Verified working with CPU fallback rendering

**Alternatives Considered:**
- ❌ **Chromium (Alpine)**: WebGL rendering failures
- ⚠️ **Chrome Headless Shell**: Integration with Vitest unclear, limited documentation
- ❌ **Playwright Official Image**: 2GB footprint (vs current 1.02GB)
- ⚠️ **Puppeteer Official Image**: 950MB but requires additional Vitest integration work

**Current Image Size:** 1.02GB
- Base image: 227MB
- Chrome + dependencies: ~600-700MB
- Node modules: 167MB
- System tools (git, xvfb): ~30-50MB

### Display Server: xvfb

**Purpose:** Provides virtual X11 display for headless browser testing

**Implementation:**
```bash
xvfb-run --auto-servernum npm test
```

**Why Needed:**
- Chrome requires a display server even in headless mode for WebGL rendering
- Software rendering (SwiftShader) requires X11 context
- Enables CPU-based WebGL without GPU access

### Security: SYS_ADMIN Capability

**Configuration:**
```json
"runArgs": ["--cap-add=SYS_ADMIN"]
```

**Purpose:** Allows Chrome to create sandboxed processes

**Alternatives:**
- Running Chrome with `--no-sandbox` flag (less secure)
- Using Puppeteer's bundled Chrome (requires architecture changes)

**Security Note:** This is standard practice for containerized browser testing and matches CI environment requirements.

### User: Non-root (node)

**Configuration:**
```json
"remoteUser": "node"
```

**Rationale:**
- **Security**: Follows principle of least privilege
- **Compatibility**: Pre-existing user in Node.js official images
- **npm**: Prevents permission issues with npm global installations

### Lifecycle Hooks

#### postCreateCommand
```json
"postCreateCommand": "npm ci"
```
- Installs exact dependency versions from package-lock.json
- Runs once when container is created
- Ensures reproducible builds

#### postStartCommand
```json
"postStartCommand": "npm audit --audit-level=moderate || true"
```
- Checks for security vulnerabilities on container start
- `|| true` prevents container startup failure on audit findings
- Alerts developers to security issues without blocking work

## Test Commands

### `npm test`
- **Environment**: Local development (Chrome with display)
- **Command**: `vitest --run`
- **Use Case**: Developer machines with GUI

### `npm run test:ci`
- **Environment**: CI/DevContainer (headless Chrome)
- **Command**: `xvfb-run --auto-servernum vitest --run`
- **Use Case**: GitHub Actions, DevContainer environments

## Optimization Attempts

### Cache Cleanup
**Attempted:** Adding `/tmp/*` and `/var/tmp/*` cleanup
**Result:** No size reduction (directories already empty during build)
**Conclusion:** Current Dockerfile already optimally configured

### Future Optimization Opportunities

1. **Multi-stage Build** (Estimated: 100-200MB reduction)
   - Separate build and runtime stages
   - Copy only necessary artifacts

2. **Chrome Headless Shell** (Estimated: 100-200MB reduction)
   - Requires investigation of Vitest integration
   - Limited documentation available

3. **Custom Chromium Build**
   - High maintenance overhead
   - Not recommended for this use case

## CI/CD Consistency

### GitHub Actions Alignment
- Both use Debian-based Linux (Bookworm vs ubuntu-latest)
- Both use xvfb for headless display
- Both run `npm run test:ci`
- Chrome versions may differ but WebGL compatibility maintained

### Design Principle
**Consistency over Optimization**: Prioritize reproducible test results across environments over minimal image size.

## Troubleshooting

### WebGL Tests Fail
**Symptom:** Tests pass locally but fail in container

**Solution:**
1. Verify xvfb is running: `ps aux | grep Xvfb`
2. Check Chrome flags: Should include `--use-gl=swiftshader`
3. Confirm SYS_ADMIN capability: `docker inspect <container> | grep SYS_ADMIN`

### Container Build Fails
**Common Causes:**
1. Docker daemon not running
2. Network issues accessing Chrome repository
3. Insufficient disk space (need ~1.5GB for build)

### Tests Run Slowly
**Expected Behavior:** Software rendering (CPU) is slower than GPU rendering
**Typical Impact:** 20-40% slower than native GPU execution

## References

- [Chrome Headless Documentation](https://developer.chrome.com/blog/chrome-headless-shell)
- [Vitest Browser Mode](https://vitest.dev/guide/browser/)
- [DevContainer Specification](https://containers.dev/)
- [WebGL in Headless Chrome](https://stackoverflow.com/questions/70948512/how-to-enable-webgl-in-headless-chrome-96-within-selenium-docker-project-to-r)
