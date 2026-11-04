<template>
  <!-- 原代码 - 保留 -->
  <!-- <madoka-mask v-model="modelValue" v-if="!unuseModel"> -->
  <!-- ========start======== 遮罩透传:默认改低不透明度+轻 blur,壁纸柔化退后,弹层才"浮"得起来 -->
  <madoka-mask
    v-model="modelValue"
    v-if="!unuseModel"
    :mask-background="maskBackground"
    :mask-blur="maskBlur"
  >
  <!-- ========end======== -->
    <div
      class="dialog__overlay"
      :style="panelStyle"
      @click.stop
      ref="overlayRef"
    >
      <header v-if="title || $slots.header">
        <slot name="header">
          {{ title }}
        </slot>
      </header>
      <main style="overflow: hidden">
        <slot />
      </main>
      <footer v-if="footer">
        <slot name="footer">
          <!-- 原代码 - 保留 -->
          <!-- <madoka-btn
            type="3"
            @click="Root.cancel"
            v-if="!hiddenCancel"
            :text="cancelText"
            :disabled="okLoading"
            variant="outlined"
          /> -->
          <!-- ========start======== 取消按钮降为弱化色,确定保持强调色——主次分明,不再两个粉按钮打架 -->
          <!-- 2026-11-05 起按钮色随色板联动:粉乳默认深字按钮,dark 预设回落白字(硬编码色注释保留) -->
          <!-- color="rgba(255, 255, 255, 0.55)" -->
          <madoka-btn
            type="3"
            @click="Root.cancel"
            v-if="!hiddenCancel"
            :text="cancelText"
            :disabled="okLoading"
            variant="outlined"
            :color="palette.cancelColor"
          />
          <!-- ========end======== -->
          <!-- ========start======== 确定按钮 loading 态:旋转图标+禁用(useModal.confirm 异步 onOk 时驱动) -->
          <!-- ========start======== 确定按钮色随色板(粉乳默认深粉 #d94f7e,dark 预设热粉 #ff7eb9) -->
          <madoka-btn
            type="3"
            @click="Root.ok"
            :disabled="okLoading"
            variant="outlined"
            :color="palette.okColor"
          >
          <!-- ========end======== -->
            <i v-if="okLoading" class="mdi mdi-loading is-spinning" />
            <span>{{ okText }}</span>
          </madoka-btn>
          <!-- ========end======== -->
        </slot>
      </footer>
    </div>
  </madoka-mask>
  <slot v-else />
</template>
<script setup lang="ts">
import MadokaMask from '../../MadokaMask/src/Index.vue'
import MadokaBtn from '../../button/src/Index.vue'
import { useMouse } from '@vueuse/core'
import type { MadokaDialogEmits, MadokaDialogProps } from './types'

const props = withDefaults(
  // 原代码 - Codex 保留
  // defineProps<{
  //   width?: string
  //   height?: string
  //   footer?: boolean
  //   title?: string
  //   okText?: string
  //   cancelText?: string
  //   unuseModel?: boolean
  //   background?: string
  //   hiddenCancel?: boolean
  // }>(),
  // Codex 新增开始
  defineProps<MadokaDialogProps>(),
  // Codex 新增结束
  {
    title: '',
    footer: true,
    width: '400px',
    height: '300px',
    maxHeight: '86vh',
    okText: '确 定',
    cancelText: '取 消',
    // 原代码 - Codex 保留
    // unuseMode: false,
    // Codex 新增开始
    unuseModel: false,
    // Codex 新增结束
    // 原代码 - 保留
    // background: 'rgba(255, 240, 245, 0.7)',
    // ========start========
    // 2026-11 重设计:默认改暗色玻璃——桌面壁纸 overlay 上亮色玻璃块太突兀,
    // 暗底配白字也把"Dark Dialog 内容文字不可见"从默认值层面根除;要亮底仍可传 background 覆盖
    // background: 'rgba(22, 12, 18, 0.78)',
    // 2026-11-05 可配置外观:background 默认值移出 props,改由 panelStyle 兜底——
    // 否则 props 默认值永远压过 theme 预设的底色(显式 background > theme > 暗色玻璃,行为不变)
    // 遮罩同步降不透明度+轻 blur:壁画柔化退后,弹层才有"浮"起来的层次
    maskBackground: 'rgba(0, 0, 0, 0.35)',
    maskBlur: 6,
    // ========end========
    hiddenCancel: false,
    okLoading: false,
  },
)

const overlayRef = useTemplateRef('overlayRef')

// ========start======== 可配置外观(2026-11-05 勾选定稿):radius/border/theme/shadow
// 归一成一份面板内联样式,全部缺省时不写对应键,让静态 CSS 继续生效——默认值零漂移
import type { CSSProperties } from 'vue'

// 原代码 - 保留(1.1.28 的预设只有三色;粉乳玻璃定稿为默认后,边框/分隔线/按钮色也需随明暗联动,扩成整套色板)
// const THEME_PRESETS: Record<'dark' | 'light', { background: string; titleColor: string; contentColor: string }> = {
//   dark: {
//     background: 'rgba(22, 12, 18, 0.78)',
//     titleColor: '#ff8fab',
//     contentColor: 'rgba(255, 255, 255, 0.88)',
//   },
//   light: {
//     background: 'rgba(255, 240, 245, 0.7)',
//     titleColor: '#ff8fab',
//     contentColor: '#4a3a40',
//   },
// }

// 整套色板:底色/标题/内容/分隔线/边框/取消与确定按钮色——亮底暗字、暗底白字各自配好,不出现"白字白底"
interface DialogPalette {
  background: string
  titleColor: string
  contentColor: string
  lineColor: string
  borderColor: string
  cancelColor: string
  okColor: string
}

// 2026-11-05 定稿:默认即「粉乳玻璃」——半透奶粉底 + 深粉标题 + 深字(用户在配色对比里点的)
const DEFAULT_PALETTE: DialogPalette = {
  background: 'rgba(255, 190, 205, 0.45)',
  titleColor: '#d94f7e',
  contentColor: '#5f3a49',
  lineColor: 'rgba(217, 79, 126, 0.3)',
  borderColor: 'rgba(255, 126, 167, 0.55)',
  cancelColor: 'rgba(90, 50, 70, 0.75)',
  okColor: '#d94f7e',
}

const THEME_PRESETS: Record<'dark' | 'light', DialogPalette> = {
  // 想要 1.1.27/1.1.28 的暗色玻璃,显式传 theme: 'dark'
  dark: {
    background: 'rgba(22, 12, 18, 0.78)',
    titleColor: '#ff8fab',
    contentColor: 'rgba(255, 255, 255, 0.88)',
    lineColor: 'rgba(255, 183, 197, 0.22)',
    borderColor: 'rgba(255, 183, 197, 0.45)',
    cancelColor: 'rgba(255, 255, 255, 0.55)',
    okColor: '#ff7eb9',
  },
  light: {
    background: 'rgba(255, 240, 245, 0.7)',
    titleColor: '#ff8fab',
    contentColor: '#4a3a40',
    lineColor: 'rgba(255, 143, 171, 0.35)',
    borderColor: 'rgba(255, 183, 197, 0.55)',
    cancelColor: 'rgba(90, 50, 70, 0.75)',
    okColor: '#d94f7e',
  },
}

// 生效色板:不传 theme 用默认粉乳,传了用预设;显式 background 只覆盖底色
const palette = computed<DialogPalette>(() => (props.theme ? THEME_PRESETS[props.theme] : DEFAULT_PALETTE))

// 边框归一:false→关;字符串→当颜色;对象→逐项配;返回 undefined 表示走 CSS 默认(色板细粉 1.5px)
const resolveBorder = (defaultColor: string): string | undefined => {
  const b = props.border
  if (b === undefined) return undefined
  if (b === false) return 'none'
  const o = typeof b === 'string' ? { color: b } : b
  return `${o.width ?? 1.5}px solid ${o.color ?? defaultColor}`
}

// 光晕归一:字符串→完整 CSS box-shadow 直传;对象→按色生成三层(近粉晕+中粉投影+外层黑压场),strength 缩放扩散
const makeGlow = (color: string, strength = 1): string =>
  `0 0 ${18 * strength}px ${color}, 0 ${8 * strength}px ${32 * strength}px ${color}, 0 24px 80px rgba(0, 0, 0, 0.45)`

const resolveShadow = (): string | undefined => {
  const s = props.shadow
  if (s === undefined) return undefined
  if (s === false || s === 'none') return 'none'
  if (typeof s === 'string') return s
  return makeGlow(s.color ?? 'rgba(255, 126, 185, 0.3)', s.strength ?? 1)
}

const panelStyle = computed<CSSProperties>(() => {
  const p = palette.value
  const style: CSSProperties = {
    minWidth: props.width,
    minHeight: props.height,
    maxHeight: props.maxHeight,
    // 优先级:显式 background > theme 预设 > 粉乳玻璃默认(2026-11-05 定稿)
    background: props.background ?? p.background,
  }
  // 色板颜色走 CSS 变量下发,静态 CSS 里用 var() 兜底(兜底值=粉乳默认,与这里同源)
  style['--dlg-title'] = p.titleColor
  style['--dlg-content'] = p.contentColor
  style['--dlg-line'] = p.lineColor
  style['--dlg-border'] = p.borderColor
  if (props.radius !== undefined) {
    style.borderRadius = typeof props.radius === 'number' ? `${props.radius}px` : props.radius
  }
  const border = resolveBorder(p.borderColor)
  if (border !== undefined) style.border = border
  const shadow = resolveShadow()
  if (shadow !== undefined) style.boxShadow = shadow
  return style
})
// ========end========

const mouse = useMouse()
const modelValue = defineModel({
  default: false,
})
// 原代码 - Codex 保留
// const emits = defineEmits<{
//   (e: 'cancel', event?: Event): void
//   (e: 'ok', event: Event): void
// }>()
// Codex 新增开始
const emits = defineEmits<MadokaDialogEmits>()
// Codex 新增结束

// ========start======== Esc 关闭:模块级弹窗栈(后开者在栈顶,Esc 只关栈顶那层)。
// 监听挂 window 捕获阶段——先于业务层容器(如图库详情视图)的 keydown 触发,
// stopPropagation 拦截下沉,避免 Esc 同时关掉弹窗底下的视图
const escStack: { onEsc: () => void }[] = []

const onKeydown = (e: KeyboardEvent) => {
  if (e.key !== 'Escape') return
  if (escStack[escStack.length - 1]?.onEsc !== onKeydownEsc) return // 非栈顶不响应
  e.preventDefault()
  e.stopPropagation()
  onKeydownEsc()
}

const onKeydownEsc = () => Root.cancel()
// ========end========

const Root = (() => {
  const setWatcher = () => {
    watch(modelValue, (visible) => {
      const el = overlayRef.value
      if (!el) return

      if (visible) {
        /* —— 打开 —— */
        // ========start======== Esc 关闭:入栈 + 挂捕获监听
        escStack.push({ onEsc: onKeydownEsc })
        window.addEventListener('keydown', onKeydown, true)
        // ========end========
        nextTick(async () => {
          // 清理上次可能残留的离场类:transitionend 丢失时 leave-active 不被移除,
          // 与 enter-active 并存且 CSS 顺序靠后会赢得 opacity:0,弹窗永久隐形
          el.classList.remove('leave-active')

          const { width: w, height: h } = el.getBoundingClientRect()
          const left = mouse.x.value - w * 5
          const top = mouse.y.value - h * 5

          s.lastX = left
          s.lastY = top
          /* 初始状态：在鼠标中心缩小、透明 */
          Object.assign(el.style, {
            left: left + 'px',
            top: top + 'px',
          })
          /* 下一帧触发过渡到居中放大 */
          requestAnimationFrame(() => el.classList.add('enter-active'))
        })
      } else {
        /* —— 关闭 —— */

        // ========start======== Esc 关闭:出栈 + 摘监听(与打开对称)
        const idx = escStack.findIndex((item) => item.onEsc === onKeydownEsc)
        if (idx >= 0) escStack.splice(idx, 1)
        window.removeEventListener('keydown', onKeydown, true)
        // ========end========
        nextTick(() => {
          // 移除打开状态类
          el.classList.remove('enter-active')
          // 添加关闭状态类，触发淡出动画
          el.classList.add('leave-active')

          // Codex 新增开始
          // 离场收尾做成幂等函数:transitionend 兜不住的场景(事件丢失/多属性多事件)由定时器兜底,
          // 常驻挂载反复开关的用法(如图库编辑器)一旦 leave-active 残留,下次打开将永久隐形
          const cleanup = () => {
            el.removeEventListener('transitionend', onEnd)
            clearTimeout(fallbackTimer)
            el.classList.remove('leave-active')
            Object.assign(el.style, {
              // 还原初始内联样式
              left: '-99999px',
              top: '-99999px',
              transform: '',
              opacity: '',
            })
          }
          const onEnd = (e: TransitionEvent) => {
            if (e.target === el) cleanup()
          }
          const fallbackTimer = setTimeout(cleanup, 500)
          el.addEventListener('transitionend', onEnd)
          // Codex 新增结束
        })

        emits('cancel')
      }
    })
  }

  // ========start======== 参数可选:Esc 关闭路径无事件对象可传(emits 类型本就允许 event?: Event)
  const cancel = async (e?: Event) => {
    modelValue.value = false
    emits('cancel', e)
  }
  const ok = async (e: Event) => {
    emits('ok', e)
  }
  const s = reactive({
    lastX: 0,
    lastY: 0,
    ok,
    cancel,
  })
  setWatcher()
  return s
})()

// ========start======== 卸载兜底:父级 v-if 直接拆组件时,栈与监听不残留
onUnmounted(() => {
  const idx = escStack.findIndex((item) => item.onEsc === onKeydownEsc)
  if (idx >= 0) escStack.splice(idx, 1)
  window.removeEventListener('keydown', onKeydown, true)
})
// ========end========
</script>
<style lang="less" scoped>
.dialog__overlay {
  display: flex;
  flex-direction: column;
  position: fixed;
  transform: scale(0.1);
  /* 原代码 - 保留(圆角是旧版气质,默认形态定稿为直角) */
  /* border-radius: 12px; // 稍微圆润一点更适合粉色主题 */
  border-radius: 0; // 2026-09 默认形态:直角,靠细边框成形

  // ========start======== ✨ 核心重设计:玻璃面板 + 1.5px 细粉边框 + 分层粉光晕
  backdrop-filter: blur(18px) saturate(1.15);
  -webkit-backdrop-filter: blur(18px) saturate(1.15);
  // 边框色随色板走 var(默认粉乳的深粉;dark 预设回落旧浅粉)
  border: 1.5px solid var(--dlg-border, rgba(255, 126, 167, 0.55));
  // 光晕三层递进:近处粉晕提亮边界,中层粉投影,外层纯黑压住壁纸——阴影必须带色调
  box-shadow:
    0 0 18px rgba(255, 126, 185, 0.15),
    0 8px 32px rgba(255, 183, 197, 0.2),
    0 24px 80px rgba(0, 0, 0, 0.45);
  left: -99999px;
  top: -99999px;
  /* 原代码 - 保留 */
  /* background: white; */
  /* background: rgba(22, 12, 18, 0.78); // 暗色玻璃兜底(与默认 prop 同值,防闪烁) */
  background: rgba(255, 190, 205, 0.45); // 粉乳玻璃兜底(与 DEFAULT_PALETTE 同值,防闪烁)
  overflow: hidden;
  opacity: 0;
  // ========end========

  header {
    /* 原代码 - 保留 */
    /* padding: 20px; */
    /* font-weight: bold; */
    /* color: #ff8fab; */
    padding: 14px 20px;
    font-weight: 600;
    // ========start======== 色板文字色走 CSS 变量,panelStyle 下发;兜底=粉乳默认深粉标题
    color: var(--dlg-title, #d94f7e);
    // ========end========
    letter-spacing: 2px;
    // ✨ 细分隔线:靠线成形,不再靠粗标题块撑场面;色随色板(亮底深粉线,暗底浅粉线)
    border-bottom: 1px solid var(--dlg-line, rgba(217, 79, 126, 0.3));
  }

  main {
    flex: 1;
    overflow: auto;
    /* 原代码 - 保留 */
    /* padding: 0 20px; */
    // 2026-11-05 内容区补上下内边距,短文案不再贴着分隔线(与左右同为 20px)
    padding: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 0;
    // ========start======== 内容文字色随色板,不再吃宿主颜色
    // (粉乳默认深字 #5f3a49;theme 'dark' 回落白字 0.88)
    color: var(--dlg-content, #5f3a49);
    // ========end========
  }

  footer {
    display: flex;
    justify-content: end;
    /* 原代码 - 保留 */
    /* padding: 20px; */
    padding: 14px 20px;
    gap: 10px;
    // ✨ 与 header 对称的细分隔线,按钮区自成一格;色随色板
    border-top: 1px solid var(--dlg-line, rgba(217, 79, 126, 0.3));
  }
}

.dialog__overlay.enter-active {
  left: 50% !important;
  top: 50% !important;
  transform: translate(-50%, -50%) scale(1) !important;
  opacity: 1 !important;
  /* 原代码 - 保留 */
  /* transition: all 0.3s cubic-bezier(0.1, 1, 0.4, 1); */
  // 💫 弹跳曲线:从鼠标位置绽放开,像魔法发动
  transition: all 0.35s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.dialog__overlay.leave-active {
  opacity: 0 !important;
  /* 原代码 - 保留 */
  /* transition: all 0.3s cubic-bezier(0.1, 1, 0.4, 1); */
  // 💫 expo-out 收场:利落不拖沓
  transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
  pointer-events: none;
}
</style>
