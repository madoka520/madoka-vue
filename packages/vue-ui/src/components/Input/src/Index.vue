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
// 定义色值，圆的代表色
@madoka-pink: #ffb7d5;
@madoka-dark-pink: #ff69b4;
@madoka-white: #fff5f8;

.madoka-input-container {
  position: relative;
  width: 100%;
  .madoka-input {
    width: 100%;
    padding: 10px 12px;
    font-size: 16px;
    color: @madoka-dark-pink;
    background-color: rgba(255, 2555, 255, 0.5);
    border: 2px solid @madoka-pink;
    border-radius: 8px;
    outline: none;
    transition: all 0.3s ease;

    &::placeholder {
      color: lighten(@madoka-pink, 10%);
      font-style: italic;
    }

    // 聚焦时的线条扩散效果
    &:focus {
      border-color: @madoka-dark-pink;
      background-color: @madoka-white;
      box-shadow: 0 0 10px rgba(255, 105, 180, 0.3);
      &::placeholder {
        color: @madoka-dark-pink;
        opacity: 0.6;
      }
    }
  }
}
</style>
