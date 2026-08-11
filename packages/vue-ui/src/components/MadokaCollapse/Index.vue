<script setup lang="ts">
import { provide } from 'vue'

interface Props {
  accordion?: boolean // 是否是手风琴模式
}

const props = defineProps<Props>()

// 使用 defineModel 处理双向绑定
const modelValue = defineModel<string | number | (string | number)[]>({
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
provide('collapseContext', {
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
