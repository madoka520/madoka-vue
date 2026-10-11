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
/* 原代码 - Codex 保留(旧版亮色圆角形态)
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
*/

// =========start==========
// 默认形态(2026-10 定稿):直角、透明暗底、细边框;菜单暗浮层毛玻璃,选中项左侧粉线
@pink-primary: #ffb7c5;
@pink-dark: #ff85a2;
@pink-glow: rgba(255, 126, 201, 0.55);

.madoka-select-wrapper {
  position: relative;
  width: 200px;
  user-select: none;

  .madoka-select-input {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
    padding: 8px 12px;
    background: rgba(255, 183, 206, 0.06);
    border: 1.5px solid rgba(255, 183, 197, 0.4);
    border-radius: 0; // 直角是默认形态
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

    &:hover,
    &.is-active {
      border-color: @pink-dark;
      box-shadow: 0 0 8px @pink-glow;
    }

    .selected-label {
      font-size: 13px;
      color: rgba(255, 255, 255, 0.85);
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .select-arrow {
      width: 0;
      height: 0;
      border-left: 5px solid transparent;
      border-right: 5px solid transparent;
      border-top: 6px solid rgba(255, 255, 255, 0.5);
      flex-shrink: 0;
      transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);

      &.is-reverse {
        transform: rotate(180deg);
        border-top-color: @pink-primary;
      }
    }
  }

  .madoka-options-menu {
    position: absolute;
    top: calc(100% + 6px);
    left: 0;
    width: 100%;
    margin: 0;
    padding: 6px;
    list-style: none;
    background: rgba(20, 10, 15, 0.92);
    backdrop-filter: blur(14px);
    -webkit-backdrop-filter: blur(14px);
    border: 1px solid rgba(255, 183, 197, 0.35);
    border-radius: 0;
    box-shadow: 0 8px 32px rgba(255, 183, 197, 0.25);
    z-index: 100;
    overflow: hidden;

    .madoka-option-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 8px;
      padding: 7px 10px;
      font-size: 12px;
      color: rgba(255, 255, 255, 0.8);
      transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);

      &:hover {
        background: rgba(255, 183, 206, 0.12);
        color: white;
      }

      &.is-selected {
        background: rgba(255, 183, 206, 0.15);
        color: white;
        // 当前项:左侧一道粉线
        box-shadow: inset 2px 0 0 @pink-dark;
      }

      .check-mark {
        font-size: 12px;
        color: @pink-primary;
      }
    }

    .no-data {
      padding: 10px;
      text-align: center;
      color: rgba(255, 255, 255, 0.45);
      font-size: 12px;
    }
  }
}
// ========end========

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
