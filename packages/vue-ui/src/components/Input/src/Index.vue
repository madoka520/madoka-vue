<template>
  <div class="madoka-input-container">
    <input v-if="type !== 'textarea'" v-model="modelValue" :type class="madoka-input" :placeholder :style />
    <textarea v-else v-model="modelValue" :placeholder :style class="madoka-input" style="min-height: 150px"/>
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
  },
)
defineOptions({
  name: 'MadokaInput',
})

const modelValue = defineModel<MadokaInputValue>({
  default: null,
})

const style = computed(() => ({
  width: props.width,
}))
</script>

<style scoped lang="less">
.madoka-input-container {
  position: relative;
  width: 100%;

  .madoka-input {
    width: 100%;
    padding: 10px 12px;
    // Codex 新增开始
    // 视觉全部走可配置项(v-bind 编译为 CSS 变量),默认值即旧亮色样式;
    // 聚焦光晕从 color 派生,宿主只改 color 就能换整套强调色
    // Codex 新增结束
    font-size: v-bind(fontSize + 'px');
    color: v-bind(color);
    background-color: v-bind(background);
    border: v-bind(borderWidth + 'px') solid v-bind(borderColor);
    border-radius: v-bind(radius + 'px');
    outline: none;
    box-sizing: border-box;
    transition: all 0.3s ease;

    &::placeholder {
      color: v-bind(placeholderColor);
      font-style: italic;
    }

    // 聚焦时的线条扩散效果
    &:focus {
      border-color: v-bind(color);
      background-color: v-bind(focusBackground);
      box-shadow: 0 0 10px color-mix(in srgb, v-bind(color) 30%, transparent);
      &::placeholder {
        color: v-bind(color);
        opacity: 0.6;
      }
    }
  }
}
</style>
