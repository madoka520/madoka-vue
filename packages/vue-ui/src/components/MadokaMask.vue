<template>
  <teleport to="body">
    <div>
      <Transition name="fade">
        <div class="mask" v-show="modelValue" @click="Root.cancel" :style="{ zIndex }"></div>
      </Transition>
      <div class="content" :style="{ zIndex: contentZIndex }">
        <slot />
      </div>
    </div>
  </teleport>
</template>

<script setup lang="ts">
// 原代码 - Codex 保留
// import useModalState from "@/hooks/useModalState"
// Codex 新增开始
import useModalState from '../hooks/useModalState'
// Codex 新增结束

const props = withDefaults(
  defineProps<{
    maskClosable?: boolean
    beforeClose?: () => void | Promise<void>
  }>(),
  {
    maskClosable: true,
  },
)

const modelValue = defineModel({
  default: false,
})
const zIndex = useModalState().zIndex
// 原代码 - Codex 保留
// const contentZIndex = computed(() => zIndex + 1)
// useModalState().zIndex++
// Codex 新增开始
const contentZIndex = computed(() => zIndex.value + 1)
zIndex.value++
// Codex 新增结束
const emits = defineEmits<{
  (e: "cancel", event: Event): void
}>()

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
