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

Project `.npmrc` only needs the registry mapping:

```ini
@madoka520:registry=https://npm.pkg.github.com
```

Log in once on your machine before publishing:

```bash
npm login --scope=@madoka520 --registry=https://npm.pkg.github.com --auth-type=legacy
```

## Release flow

Use Changesets for versioning and publishing.

Every release:

```bash
pnpm changeset
pnpm version-packages
git add .
git commit -m "Version packages"
pnpm release
```

When `pnpm changeset` asks which packages changed:

- choose `@madoka520/vue-ui` for UI component, directive, style, or UI type changes
- choose `@madoka520/vue-utils` for utility function or utility type changes
- choose `patch` for fixes and small compatible improvements
- choose `minor` for new compatible features
- choose `major` for breaking changes

If a changeset file already exists, do not run `pnpm changeset` again. Continue from:

```bash
pnpm version-packages
git add .
git commit -m "Version packages"
pnpm release
```

Useful scripts:

```bash
pnpm build              # build all packages
pnpm version-packages   # apply pending changesets to package versions
pnpm release            # build and publish packages with changesets
```
