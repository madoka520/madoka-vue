<template>
  <div class="madoka-input-container" :style="cssVars">
    <input v-if="type !== 'textarea'" v-model="modelValue" :type class="madoka-input" :placeholder :style="widthStyle" />
    <textarea v-else v-model="modelValue" :placeholder :style="textareaStyle" class="madoka-input" />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { MadokaInputValue } from '../../../types'
import type { MadokaInputProps } from './types'
const props = withDefaults(
  // 原代码 - Codex 保留
  // defineProps<{
  //   placeholder?: string
  //   type?: 'number' | 'text' | 'file' | 'textarea' | 'password'
  //   width?: string
  // }>(),
  // Codex 新增开始
  defineProps<MadokaInputProps>(),
  // Codex 新增结束
  {
    placeholder: '请输入魔法代码...',
    type: 'text',
    background: 'rgba(255, 255, 255, 0.5)',
    focusBackground: '#fff5f8',
    borderColor: '#ffb7d5',
    color: '#ff69b4',
    placeholderColor: '#ffc4d5',
    radius: 8,
    fontSize: 16,
    borderWidth: 2,
    textareaMinHeight: 150,
  },
)
defineOptions({
  name: 'MadokaInput',
})

const modelValue = defineModel<MadokaInputValue>({
  default: null,
})

const widthStyle = computed(() => ({
  width: props.width,
}))

// Codex 新增开始
// textarea 的最小高度走 prop(原来是内联写死 150px,使用侧 :deep 调不动)
const textareaStyle = computed(() => [
  widthStyle.value,
  { minHeight: `${props.textareaMinHeight}px` },
])
// Codex 新增结束

// Codex 新增开始
// 样式配置经 CSS 变量下发:less 里用 var() 引用,
// 避免 v-bind() 出现在 color-mix 等函数参数里导致 less 无法解析
const cssVars = computed(() => ({
  '--input-background': props.background,
  '--input-focus-background': props.focusBackground,
  '--input-border-color': props.borderColor,
  '--input-color': props.color,
  '--input-placeholder-color': props.placeholderColor,
  '--input-radius': `${props.radius}px`,
  '--input-font-size': `${props.fontSize}px`,
  '--input-border-width': `${props.borderWidth}px`,
}))
// Codex 新增结束
</script>

<style scoped lang="less">
.madoka-input-container {
  position: relative;
  width: 100%;

  .madoka-input {
    width: 100%;
    padding: 10px 12px;
    // 视觉全部走可配置项(容器下发的 CSS 变量),默认值即旧亮色样式;
    // 聚焦光晕从 color 派生,宿主只改 color 就能换整套强调色
    font-size: var(--input-font-size);
    color: var(--input-color);
    background-color: var(--input-background);
    border: var(--input-border-width) solid var(--input-border-color);
    border-radius: var(--input-radius);
    outline: none;
    box-sizing: border-box;
    transition: all 0.3s ease;

    &::placeholder {
      color: var(--input-placeholder-color);
      font-style: italic;
    }

    // 聚焦时的线条扩散效果
    &:focus {
      border-color: var(--input-color);
      background-color: var(--input-focus-background);
      box-shadow: 0 0 10px color-mix(in srgb, var(--input-color) 30%, transparent);
      &::placeholder {
        color: var(--input-color);
        opacity: 0.6;
      }
    }
  }
}
</style>
