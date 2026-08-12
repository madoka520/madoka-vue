<script setup lang="ts">
import { provide } from 'vue'
import type { MadokaCollapseModelValue, MadokaCollapseProps } from './types'
import { madokaCollapseContextKey } from './types'

// 原代码 - Codex 保留
// interface Props {
//   accordion?: boolean // 是否是手风琴模式
// }

// 原代码 - Codex 保留
// const props = defineProps<Props>()
// Codex 新增开始
const props = defineProps<MadokaCollapseProps>()
// Codex 新增结束

// 使用 defineModel 处理双向绑定
// 原代码 - Codex 保留
// const modelValue = defineModel<string | number | (string | number)[]>({
// Codex 新增开始
const modelValue = defineModel<MadokaCollapseModelValue>({
// Codex 新增结束
  default: '',
})

const handleItemClick = (name: string | number) => {
  if (props.accordion) {
    // 手风琴模式：点击当前已展开的则关闭，否则切换到当前项
    modelValue.value = modelValue.value === name ? '' : name
  } else {
    // 多选模式：确保是数组并进行增删
    const currentValues = Array.isArray(modelValue.value) ? [...modelValue.value] : []
    const index = currentValues.indexOf(name)

    if (index > -1) {
      currentValues.splice(index, 1)
    } else {
      currentValues.push(name)
    }
    modelValue.value = currentValues
  }
}

// 注入上下文给子组件
// 原代码 - Codex 保留
// provide('collapseContext', {
// Codex 新增开始
provide(madokaCollapseContextKey, {
// Codex 新增结束
  activeNames: () => modelValue.value,
  handleItemClick,
})
</script>

<template>
  <div class="my-collapse">
    <slot />
  </div>
</template>

<style lang="less" scoped>
.my-collapse {
  border-top: 1px solid #ebeef5;
  border-bottom: 1px solid #ebeef5;
}
</style>
