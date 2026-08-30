<template>
  <div class="madoka-tabs" ref="root">
    <span
      class="madoka-tab"
      v-for="tab in options"
      :key="tab.value"
      :class="{ active: modelValue === tab.value }"
      @click="Root.onClick(tab.value)"
    >
      {{ tab.label }}
      <!-- Codex 新增开始 -->
      <span
        v-if="Root.isCloseable(tab)"
        class="madoka-tab-close"
        @click.stop="Root.onClose(tab)"
      >
        ×
      </span>
      <!-- Codex 新增结束 -->
    </span>
    <div
      class="slider"
      ref="slider"
      :style="{
        width: Root.getWidth() + '%',
        transform: Root.getTransform(),
      }"
    ></div>
  </div>
</template>
<script setup lang="ts">
import { reactive } from 'vue'
// 原代码 - Codex 保留
// import type { MadokaOptionValue } from '../../../types'
// import type { MadokaTabProps } from './types'
// Codex 新增开始
import type { MadokaOptionValue, MadokaTabOption } from '../../../types'
import type { MadokaTabEmits, MadokaTabProps } from './types'
// Codex 新增结束

const props = withDefaults(
  // 原代码 - Codex 保留
  // defineProps<{
  //   options: readonly MadokaTabOption[]
  // }>(),
  // Codex 新增开始
  defineProps<MadokaTabProps>(),
  // Codex 新增结束
  {
    options: () => [],
    // Codex 新增开始
    closeable: false,
    // Codex 新增结束
  },
)
const modelValue = defineModel<MadokaOptionValue>({
  default: '',
})
// Codex 新增开始
const emits = defineEmits<MadokaTabEmits>()
// Codex 新增结束
const Root = (() => {
  const onClick = (val: MadokaOptionValue) => {
    modelValue.value = val
  }
  // Codex 新增开始
  const isCloseable = (tab: MadokaTabOption) => {
    return tab.closeable ?? props.closeable
  }

  const onClose = (tab: MadokaTabOption) => {
    emits('close', tab)
    // 关闭的是当前激活 tab 时，自动切换到相邻 tab（优先右侧，否则左侧）
    if (modelValue.value === tab.value) {
      const index = props.options.findIndex((i) => i.value === tab.value)
      const next = props.options[index + 1] ?? props.options[index - 1]
      modelValue.value = next?.value ?? ''
    }
  }
  // Codex 新增结束
  const getIndex = () => {
    return props.options.findIndex((i) => i.value === modelValue.value)
  }

  const getWidth = () => {
    return props.options.length ? 100 / props.options.length : 0
  }

  const getTransform = () => {
    return `translateX(${getIndex() * 100}%)`
  }
  const s = reactive({
    onClick,
    // Codex 新增开始
    isCloseable,
    onClose,
    // Codex 新增结束
    getIndex,
    getWidth,
    getTransform,
  })
  // 原代码 - Codex 保留
  // modelValue.value = props.options[0]?.value
  // Codex 新增开始
  if (modelValue.value === '' && props.options.length) {
    modelValue.value = props.options[0]?.value
  }
  // Codex 新增结束
  return s
})()
</script>
<style scoped lang="less">
.madoka-tabs {
  display: flex;
  position: relative;

  .madoka-tab {
    flex: 1;
    text-align: center;
    padding: 10px 0;
    transition: color 0.3s;

    user-select: none;
    &.active {
      color: #ff3e83;
    }

    // Codex 新增开始
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 4px;

    .madoka-tab-close {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 16px;
      height: 16px;
      border-radius: 50%;
      font-size: 12px;
      line-height: 1;
      color: #999;
      transition: all 0.2s;

      &:hover {
        color: #fff;
        background: #ff9eb5;
      }
    }
    // Codex 新增结束
  }

  .slider {
    position: absolute;
    bottom: 0;
    height: 2px;
    border-radius: 2px;
    transition: all 0.3s ease;
    transform: translateX(0);
    background: #ff9eb5;
  }
}
</style>
