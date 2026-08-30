# @madoka520/vue-ui

## 1.1.2

### Patch Changes

- MadokaBtn 全部变体（primary / submit / outlined / link）增加 white-space: nowrap，按钮文字不再换行

## 1.1.1

### Patch Changes

- 修复 .tsx 组件（message / useModal / useContextMenu / useMask）未配置 Vue JSX 转换的问题：此前构建产物将 JSX 按 React 编译（引用 React.createElement），运行时报 React is not defined；现在接入 @vitejs/plugin-vue-jsx，产物正确生成 Vue 虚拟节点调用

## 1.1.0

### Minor Changes

- d5e4992: MadokaTab 新增 closeable 属性：开启后每个 tab 显示关闭按钮，点击时触发 close 事件，并在关闭当前激活 tab 时自动切换到相邻 tab；单个选项可通过 MadokaTabOption.closeable 覆盖全局配置

## 1.0.0

### Major Changes

- 架构调整

## 0.1.2

### Patch Changes

- Add reusable Vue directives
