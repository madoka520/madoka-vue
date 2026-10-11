<template>
  <teleport to="body">
    <div>
      <Transition name="fade">
        <div
          class="mask"
          v-show="modelValue"
          @click="Root.cancel"
          :style="[
            { zIndex, background: props.maskBackground },
            props.maskBlur
              ? { backdropFilter: `blur(${props.maskBlur}px)`, '-webkit-backdrop-filter': `blur(${props.maskBlur}px)` }
              : {},
          ]"
        ></div>
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
    maskBackground: 'rgba(0, 0, 0, 0.5)',
    maskBlur: 0,
  },
)

const modelValue = defineModel({
  default: false,
})
// 原代码 - Codex 保留(共享 ref 实时绑定:所有实例的遮罩同值 N、内容同值 N+1——
// 先开弹窗的内容(N+1)永远高于后开弹窗的遮罩(N),后开的遮罩盖不住先开的内容层)
// const zIndex = useModalState().zIndex
// const contentZIndex = computed(() => zIndex.value + 1)
// zIndex.value++
// Codex 新增开始
// 打开时刻取号(实例本地快照):每次弹窗打开时从全局计数器取新号,后开者整体在上,
// 遮罩能完整压暗下方弹窗的内容;单弹窗场景与原行为一致
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
