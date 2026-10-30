<template>
  <madoka-mask v-model="modelValue" v-if="!unuseModel">
    <div
      class="dialog__overlay"
      :style="{ minWidth: width, minHeight: height, maxHeight, background }"
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
          <madoka-btn
            type="3"
            @click="Root.cancel"
            v-if="!hiddenCancel"
            :text="cancelText"
            :disabled="okLoading"
            variant="outlined"
          />
          <!-- ========start======== 确定按钮 loading 态:旋转图标+禁用(useModal.confirm 异步 onOk 时驱动) -->
          <madoka-btn
            type="3"
            @click="Root.ok"
            :disabled="okLoading"
            variant="outlined"
          >
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
    background: 'rgba(255, 240, 245, 0.7)',
    hiddenCancel: false,
    okLoading: false,
  },
)

const overlayRef = useTemplateRef('overlayRef')

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

  const cancel = async (e: Event) => {
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
  border-radius: 12px; // 稍微圆润一点更适合粉色主题

  // ✨ 核心增强：只添加毛玻璃和微光边框，不改动布局逻辑
  backdrop-filter: blur(15px);
  -webkit-backdrop-filter: blur(15px);
  border: 1px solid rgba(255, 255, 255, 0.4);
  box-shadow: 0 8px 32px rgba(255, 183, 197, 0.3);
  left: -99999px;
  top: -99999px;
  background: white;
  overflow: hidden;
  opacity: 0;

  header {
    padding: 20px;
    // 增加一个粉色文字默认样式
    font-weight: bold;
    color: #ff8fab;
  }

  main {
    flex: 1;
    overflow: auto;
    padding: 0 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 0;
  }

  footer {
    display: flex;
    justify-content: end;
    padding: 20px;
    gap: 10px;
  }
}

.dialog__overlay.enter-active {
  left: 50% !important;
  top: 50% !important;
  transform: translate(-50%, -50%) scale(1) !important;
  opacity: 1 !important;
  transition: all 0.3s cubic-bezier(0.1, 1, 0.4, 1);
}

.dialog__overlay.leave-active {
  opacity: 0 !important;
  transition: all 0.3s cubic-bezier(0.1, 1, 0.4, 1);
  pointer-events: none;
}
</style>
