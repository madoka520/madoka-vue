# @madoka520/vue-ui

## 1.4.1

### Patch Changes

- MadokaSelect 修复与新增:菜单宽度改为自适应内容(width:max-content,min-width:100%,上限 260px+省略号)——窄触发器下选项不再溢出;新增 triggerless 模式(隐藏内置触发器,消费方自画触发器经组件 ref 的 open/close/toggle 控制菜单,菜单锚定在组件锚点下方)

## 1.4.0

### Minor Changes

- MadokaSelect 新增多选与触发器配置:multiple(值为数组,菜单内勾选/取消且不自动关闭,触发器最多展示两项、更多折成 +N)、placeholder(占位文案,原写死"请选择")、triggerPrefixIcon(触发器 mdi 前缀图标)、width(宽度可配,原固定 200px)。默认行为与旧版完全一致

## 1.3.0

### Minor Changes

- madokaMoveDirective 升级为通用拖拽能力:Pointer Events + 指针捕获(兼容触摸),handle 可配置(默认仍 '.overlay-header',null=整个元素作手柄),exclude 排除命中交互元素的按下(默认清单含组件库按钮基类),新增 onStart/onEnd(moved) 回调;内置防护——WebView2 拖出边界时 (0,0) 假 pointermove 丢弃(单帧 >200px 跳变)、buttons=0 漏 up 兜底。MadokaFloatPanel 内部拖拽实现删除,改用该指令

## 1.2.1

### Patch Changes

- MadokaFloatPanel 修复:拖出 WebView 边界时 (0,0) 假 pointermove 导致面板瞬移左上角(单帧 >200px 跳变丢弃 + buttons=0 兜底收摊);库按钮根元素是 span 不是 button,排除选择器补上 .madoka-btn-base(原先按最小化/停止/关闭也会触发拖动);胶囊拖动超过 4px 后松手不再当作点击展开;未布局完成(width=0)不冻结位置

## 1.2.0

### Minor Changes

- 新增 MadokaFloatPanel 通用悬浮面板:右下角悬浮(未拖动时贴角,窗口缩放自适应),展开卡/最小化胶囊双形态(v-model:minimized),Pointer Events 拖动(兼容触摸,视口钳制防拖丢,button/a/input 等交互元素不触发),卡片与胶囊的暗色玻璃外观内置,内容经默认插槽与 mini 插槽自定义

## 1.1.25

### Patch Changes

- feat(MadokaDialog): Esc 关闭弹窗——window 捕获阶段监听 + 弹窗栈保证只关最顶层,拦截下沉避免 Esc 同时触发弹窗底下视图的关闭逻辑

## 1.1.24

### Patch Changes

- feat(MadokaDialog/useModal): 确定按钮 loading 态——useModal.confirm 的 onOk 异步执行期间确定/取消禁用+旋转图标,完成自动关窗,失败保留重试

## 1.1.23

### Patch Changes

- feat(MadokaBtn): outline 皮肤实现 disabled 禁用态(半透明+拦截交互)——此前 disabled 透传到 span 是无效属性

## 1.1.22

### Patch Changes

- feat(MadokaTagGroup): 支持 disabledNames 禁用项——功能性标签不可选中,禁用态半透明+锁图标

## 1.1.21

### Patch Changes

- afac937: MadokaBtn 公共样式去重：user-select: none 四处重复规则合并进 .madoka-btn-base（各变体行为不变）
- feat: 新增 MadokaTagGroup 标签胶囊组组件——多选胶囊 + 计数角标,样式经 CSS 变量配置(标签管理/标签筛选等场景复用)

## 1.1.4

### Patch Changes

- MadokaBtn 公共样式重构：四个变体根元素统一挂 madoka-btn-base 类，公共规则（white-space: nowrap / width: fit-content）集中到 Index.vue 的全局样式块，后续公共样式只需改一处；行为不变

## 1.1.3

### Patch Changes

- MadokaBtn 全部变体增加 width: fit-content：按钮宽度自适应文字内容，在拉伸容器中不再被压窄导致文字溢出按钮

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
