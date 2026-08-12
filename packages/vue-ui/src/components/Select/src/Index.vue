<template>
  <!-- 原代码 - Codex 保留 -->
  <!-- <div class="madoka-select-wrapper" tabindex="-1" @blur="handleClickOutside"> -->
  <!-- <div class="madoka-select-input" :class="{ 'is-active': isOpen }" @click="toggleMenu"> -->
  <!-- Codex 新增开始 -->
  <div ref="selectRef" class="madoka-select-wrapper" tabindex="-1">
    <div class="madoka-select-input" :class="{ 'is-active': isOpen }" @click.stop="toggleMenu">
      <!-- Codex 新增结束 -->
      <span class="selected-label">
        {{ selectedLabel || '请选择' }}
      </span>
      <span class="select-arrow" :class="{ 'is-reverse': isOpen }"></span>
    </div>

    <Transition name="fade-slide">
      <ul v-show="isOpen" class="madoka-options-menu">
        <!-- 原代码 - Codex 保留 -->
        <!-- <li v-for="item in options" :key="String(item[valueName])" class="madoka-option-item" :class="{ 'is-selected': modelValue === item[valueName] }" @click="handleSelect(item)"> -->
        <!-- Codex 新增开始 -->
        <li
          v-for="item in options"
          :key="String(item[valueName])"
          class="madoka-option-item"
          :class="{ 'is-selected': modelValue === item[valueName] }"
          @click.stop="handleSelect(item)"
        >
          <!-- Codex 新增结束 -->
          {{ item[labelName] }}
          <span v-if="modelValue === item[valueName]" class="check-mark">✓</span>
        </li>
        <li v-if="options.length === 0" class="no-data">暂无数据</li>
      </ul>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, useTemplateRef } from 'vue'
import type { MadokaOption, MadokaOptionValue } from '../../../types'
import type { MadokaSelectProps } from './props'

const props = withDefaults(
  // 原代码 - Codex 保留
  // defineProps<{
    //   labelName?: string
  //   valueName?: string
  // }>(),
  // Codex 新增开始
  defineProps<MadokaSelectProps>(),
  // Codex 新增结束
  {
    options: () => [],
    labelName: 'label',
    valueName: 'value',
  },
)

const modelValue = defineModel<MadokaOptionValue>({
  default: '',
})

const isOpen = ref(false)

// Codex 新增开始
const selectRef = useTemplateRef<HTMLElement>('selectRef')
// Codex 新增结束

// 获取当前显示的 label
const selectedLabel = computed(() => {
  const target = props.options.find((opt) => opt[props.valueName] === modelValue.value)
  return target ? String(target[props.labelName] ?? '') : ''
})

const toggleMenu = () => {
  isOpen.value = !isOpen.value
}

const handleSelect = (item: MadokaOption) => {
  modelValue.value = item[props.valueName] as MadokaOptionValue
  isOpen.value = false
}

// 点击外部关闭下拉框
// 原代码 - Codex 保留
// const handleClickOutside = (e: MouseEvent) => {
//   isOpen.value = false
// }
// Codex 新增开始
const handleClickOutside = (e: MouseEvent) => {
  const target = e.target as Node | null
  if (target && selectRef.value?.contains(target)) return
  isOpen.value = false
}
// Codex 新增结束

onMounted(() => {
  // 原代码 - Codex 保留
  // window.addEventListener('click', handleClickOutside)
  // Codex 新增开始
  document.addEventListener('click', handleClickOutside)
  // Codex 新增结束
})

onUnmounted(() => {
  // 原代码 - Codex 保留
  // window.removeEventListener('click', handleClickOutside)
  // Codex 新增开始
  document.removeEventListener('click', handleClickOutside)
  // Codex 新增结束
})

defineOptions({
  name: 'MadokaSelect',
})
</script>

<style scoped lang="less">
@primary-color: #ffb7d5;
@hover-bg: #fff5f8;
@border-color: #e0e0e0;
@text-color: #444;
@shadow: 0 4px 12px rgba(0, 0, 0, 0.1);

.madoka-select-wrapper {
  position: relative;
  width: 200px;
  user-select: none;
  font-family: sans-serif;

  .madoka-select-input {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 8px 12px;
    background: #fff;
    border: 1.5px solid @border-color;
    border-radius: 8px;
    transition: all 0.3s ease;

    &:hover {
      border-color: @primary-color;
    }

    &.is-active {
      border-color: @primary-color;
      box-shadow: 0 0 0 3px rgba(255, 183, 213, 0.2);
    }

    .selected-label {
      font-size: 14px;
      color: @text-color;
    }

    .select-arrow {
      width: 0;
      height: 0;
      border-left: 5px solid transparent;
      border-right: 5px solid transparent;
      border-top: 6px solid @border-color;
      transition: transform 0.3s ease;

      &.is-reverse {
        transform: rotate(180deg);
        border-top-color: @primary-color;
      }
    }
  }

  .madoka-options-menu {
    position: absolute;
    top: calc(100% + 8px);
    left: 0;
    width: 100%;
    margin: 0;
    padding: 6px 0;
    list-style: none;
    background: #fff;
    border-radius: 8px;
    box-shadow: @shadow;
    z-index: 100;
    overflow: hidden;

    .madoka-option-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 10px 12px;
      font-size: 14px;
      color: @text-color;
      transition: background 0.2s;

      &:hover {
        background-color: @hover-bg;
        color: @primary-color;
      }

      &.is-selected {
        background-color: @hover-bg;
        color: @primary-color;
        font-weight: bold;
      }

      .check-mark {
        font-size: 12px;
      }
    }

    .no-data {
      padding: 10px;
      text-align: center;
      color: #999;
      font-size: 13px;
    }
  }
}

// 简单的进场动画
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition:
    opacity 0.2s,
    transform 0.2s;
}

.fade-slide-enter-from,
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
