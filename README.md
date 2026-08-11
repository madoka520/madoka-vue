# madoka-vue

`madoka-vue` is the Vue package workspace for Madoka frontend projects.

## Packages

- `@madoka520/vue-ui` - Vue UI components.
- `@madoka520/vue-utils` - Vue-oriented utility helpers.

## Development

```bash
pnpm install
pnpm -r build
```

Build a single package:

```bash
pnpm --filter @madoka520/vue-utils run build
pnpm --filter @madoka520/vue-ui run build
```

## GitHub Packages

Publishing uses GitHub Packages under the `@madoka520` scope.

Root `.npmrc` should use an environment token:

```ini
@madoka520:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${GITHUB_TOKEN}
```

Publish order:

```bash
pnpm --filter @madoka520/vue-utils publish --no-git-checks
pnpm --filter @madoka520/vue-ui publish --no-git-checks
```

`@madoka520/vue-ui` depends on `@madoka520/vue-utils`, so publish utils first.
