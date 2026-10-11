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
/* 原代码 - Codex 保留(旧版亮色圆角形态;其中 rgba(255, 2555, 255, 0.5) 的 2555 是笔误,
   背景声明一直未生效)
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
*/

// =========start==========
// 默认形态(2026-10 定稿):直角、透明暗底、细边框,聚焦绽放粉光
@pink-primary: #ffb7c5;
@pink-dark: #ff85a2;
@pink-glow: rgba(255, 126, 201, 0.55);

.madoka-input-container {
  position: relative;
  width: 100%;

  .madoka-input {
    width: 100%;
    padding: 8px 12px;
    font-size: 13px;
    color: rgba(255, 255, 255, 0.9);
    background: rgba(255, 183, 206, 0.06);
    border: 1.5px solid rgba(255, 183, 197, 0.4);
    border-radius: 0; // 直角是默认形态
    outline: none;
    box-sizing: border-box;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

    &::placeholder {
      color: #9e9e9e;
      font-style: normal;
    }

    &:focus {
      border-color: @pink-dark;
      background: rgba(255, 183, 206, 0.1);
      box-shadow: 0 0 8px @pink-glow;
    }
  }
}
// ========end========
</style>
