<template>
  <div class="collapse-item" :class="{ 'is-active': isActive, 'is-disabled': disabled }">
    <div class="collapse-item__header" @click="toggleClick">
      <slot name="title">{{ title }}</slot>
      <div class="collapse-item__icon-box">
        <i class="mdi mdi-chevron-right icon-right" />
        <i class="mdi mdi-chevron-right icon-down" />
      </div>
    </div>

    <div
      class="collapse-item__wrapper"
      :style="{
        height: isActive ? `${contentRef?.scrollHeight}px` : '0px',
      }"
    >
      <div class="collapse-item__content" ref="contentRef">
        <slot />
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { inject, computed, useTemplateRef } from 'vue'
import type { MadokaCollapseItemProps } from './types'
import { madokaCollapseContextKey } from './types'

// 原代码 - Codex 保留
// interface Props {
//   name: string | number
//   title?: string
//   disabled?: boolean
// }

// 原代码 - Codex 保留
// const props = defineProps<Props>()
// Codex 新增开始
const props = defineProps<MadokaCollapseItemProps>()
// Codex 新增结束

// 原代码 - Codex 保留
// const context = inject<{
//   activeNames: () => string | number | (string | number)[]
//   handleItemClick: (name: string | number) => void
// }>('collapseContext')
// Codex 新增开始
const context = inject(madokaCollapseContextKey)
// Codex 新增结束

const contentRef = useTemplateRef<HTMLDivElement>('contentRef')

const isActive = computed(() => {
  const active = context?.activeNames()
  if (Array.isArray(active)) {
    return active.includes(props.name)
  }
  return active === props.name
})

const toggleClick = () => {
  if (props.disabled) return
  context?.handleItemClick(props.name)
}
</script>

<style lang="less" scoped>
.collapse-item {
  &__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 48px;
    border-bottom: 1px solid #ebeef5;
    transition: all 0.3s;

    .collapse-item__icon-box {
      position: relative;
      width: 24px;
      height: 24px;
      display: flex;
      align-items: center;
      justify-content: center;

      i {
        position: absolute;
        transition:
          transform 0.3s ease,
          opacity 0.3s ease;
        font-size: 20px;
      }

      .icon-down {
        opacity: 0;
        transform: rotate(-90deg);
      }
    }
  }

  &__wrapper {
    overflow: hidden;
    transition: height 0.3s ease-in-out;
  }

  &__content {
    padding: 15px 0;
    color: #666;
  }

  &.is-active {
    .collapse-item__icon-box {
      .icon-right {
        opacity: 0;
        transform: rotate(90deg);
      }
      .icon-down {
        opacity: 1;
        transform: rotate(90deg); // 旋转至向下指向
      }
    }
  }

  &.is-disabled {
    .collapse-item__header {
      cursor: not-allowed;
      opacity: 0.5;
    }
  }
}
</style>
