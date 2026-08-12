# madoka-vue

`madoka-vue` 是 Madoka 前端项目使用的 Vue 包工作区。

## 子包

- `@madoka520/vue-ui`：Vue UI 组件、指令和 UI 相关组合式函数。
- `@madoka520/vue-utils`：面向 Vue / 浏览器环境的工具函数。

## 开发

安装依赖：

```bash
pnpm install
```

构建全部子包：

```bash
pnpm build
```

只构建某一个子包：

```bash
pnpm --filter @madoka520/vue-utils run build
pnpm --filter @madoka520/vue-ui run build
```

## GitHub Packages

包发布到 GitHub Packages，作用域是 `@madoka520`。

项目 `.npmrc` 只需要配置 registry：

```ini
@madoka520:registry=https://npm.pkg.github.com
```

发布前，本机需要先登录一次 GitHub Packages：

```bash
npm login --scope=@madoka520 --registry=https://npm.pkg.github.com --auth-type=legacy
```

## 发布流程

项目使用 Changesets 管理版本和发布。

每次发布完整流程：

```bash
pnpm changeset
pnpm version-packages
git add .
git commit -m "Version packages"
pnpm release
```

执行 `pnpm changeset` 时按实际改动选择子包：

- 改了组件、指令、样式、UI 类型，选择 `@madoka520/vue-ui`
- 改了工具函数或工具类型，选择 `@madoka520/vue-utils`
- 修复问题或小型兼容优化，选择 `patch`
- 新增兼容功能，选择 `minor`
- 破坏性变更，选择 `major`

如果 `.changeset` 里已经存在本次发布记录，不要重复执行 `pnpm changeset`，直接从这里继续：

```bash
pnpm version-packages
git add .
git commit -m "Version packages"
pnpm release
```

常用脚本：

```bash
pnpm build              # 构建所有子包
pnpm version-packages   # 根据 changeset 更新版本号和 changelog
pnpm release            # 构建并发布需要发布的包
```

## 约定

- README 使用中文。
- 代码注释使用中文。
- 组件目录尽量保持类似 Element Plus 的结构：组件目录下使用 `src/Index.vue` 和 `src/types.ts` / `src/props.ts`。
