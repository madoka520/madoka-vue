<template>
  <teleport to="body">
    <div>
      <Transition name="fade">
        <div class="mask" v-show="modelValue" @click="Root.cancel" :style="{ zIndex }"></div>
      </Transition>
      <!-- Codex 新增开始 -->
      <!-- content 跟随 modelValue 显隐:组件式使用时 slot 内容不能常驻
           (useMask 命令式用法内容里另有 visible 判断,双控不冲突) -->
      <div class="content" v-show="modelValue" :style="{ zIndex: contentZIndex }">
        <slot />
      </div>
      <!-- Codex 新增结束 -->
    </div>
  </teleport>
</template>

<script setup lang="ts">
import useModalState from '../../../hooks/useModalState'
import type { MadokaMaskEmits, MadokaMaskProps } from './types'

const props = withDefaults(
  // 原代码 - Codex 保留
  // defineProps<{
  //   maskClosable?: boolean
  //   beforeClose?: () => void | Promise<void>
  // }>(),
  // Codex 新增开始
  defineProps<MadokaMaskProps>(),
  // Codex 新增结束
  {
    maskClosable: true,
  },
)

const modelValue = defineModel({
  default: false,
})
// 原代码 - Codex 保留(挂载时取号:层级由挂载顺序决定)
// const zIndex = useModalState().zIndex
// const contentZIndex = computed(() => zIndex.value + 1)
// zIndex.value++
// Codex 新增开始
// 打开时取号:层级由打开顺序决定,后开的永远在上。
// 常驻挂载的多个弹层(如图库预览器与编辑器)在热更新/窗口重开导致挂载顺序翻转时,
// 挂载取号会让下层盖住上层——点击空白命中错误弹层,关闭顺序错乱
const modalZIndex = useModalState().zIndex
const zIndex = ref(999999)
const contentZIndex = computed(() => zIndex.value + 1)
watch(
  modelValue,
  (visible) => {
    if (visible) {
      modalZIndex.value++
      zIndex.value = modalZIndex.value
    }
  },
  { immediate: true },
)
// Codex 新增结束
// 原代码 - Codex 保留
// const emits = defineEmits<{
//   (e: "cancel", event: Event): void
// }>()
// Codex 新增开始
const emits = defineEmits<MadokaMaskEmits>()
// Codex 新增结束

const Root = (() => {
  const cancel = async (e: Event) => {
    if (!props.maskClosable) return
    if (props.beforeClose) {
      //这个await去掉会导致弹窗关闭的时候突然跑到左下角
      await props.beforeClose()
    }
    emits("cancel", e)
    modelValue.value = false
  }
  return reactive({ cancel })
})()
</script>

<style scoped>
.mask {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 999999;
}

/* 💫 下面是淡入淡出动画 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
.content {
  z-index: 1000000;
  position: fixed;
}
</style>
