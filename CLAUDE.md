# Cohost JS SDK

## Package Version Policy

**CRITICAL: All packages must have the same version number.**

The packages in this monorepo have dependencies on each other:
- `@cohostvip/cohost-react` depends on `@cohostvip/cohost-node`
- `@cohostvip/cohost-node` depends on `@cohostvip/cohost-types`

To prevent version drift and simplify debugging, **all packages are published together with the same version**:
- `packages/types` - TypeScript type definitions
- `packages/auth` - Authentication client
- `packages/node` - Node.js API client
- `packages/react` - React hooks and components

### Before Publishing

1. **Check current versions:**
   ```bash
   for pkg in types auth node react; do echo "$pkg: $(cat packages/$pkg/package.json | grep '"version"' | head -1)"; done
   ```

2. **Sync all versions to the same number:**
   ```bash
   # Replace X.Y.Z with the new version
   VERSION="X.Y.Z"
   for pkg in types auth node react; do
     cd packages/$pkg && npm version $VERSION --no-git-tag-version && cd ../..
   done
   ```

3. **Update inter-package dependencies:**
   - `packages/node/package.json`: Update `@cohostvip/cohost-types` to `^X.Y.Z`
   - `packages/react/package.json`: Update `@cohostvip/cohost-node` to `^X.Y.Z`

4. **Build and publish (in order):**
   ```bash
   pnpm -r build
   cd packages/types && pnpm publish --access public --no-git-checks && cd ../..
   cd packages/auth && pnpm publish --access public --no-git-checks && cd ../..
   cd packages/node && pnpm publish --access public --no-git-checks && cd ../..
   cd packages/react && pnpm publish --access public --no-git-checks && cd ../..
   ```

### Automated Publishing

The GitHub workflow (`.github/workflows/publish.yml`) publishes all packages in the correct order when a release is created.

## Type Generation

Types in `packages/types` are generated from Zod schemas in the main `packages/types` directory:

1. Source schemas: `/packages/types/src/schemas/`
2. Generation script: `/packages/types/scripts/extract-types.ts`
3. Generated output: `/packages/types/out/docs/types.d.ts`

To regenerate types:
```bash
cd /path/to/guestwho/packages/types
npx tsx scripts/extract-types.ts
```

Then copy to OSS package:
```bash
# Copy generated types to oss/cohost-js/packages/types/src/index.ts
# Add pagination and cart session types manually (not in generated output)
```
