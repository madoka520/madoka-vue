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
import type { MadokaOptionValue, MadokaTabOption } from '../types'

const props = withDefaults(
  defineProps<{
    options: readonly MadokaTabOption[]
  }>(),
  {
    options: () => [],
  },
)
const modelValue = defineModel<MadokaOptionValue>({
  default: '',
})
const Root = (() => {
  const onClick = (val: MadokaOptionValue) => {
    modelValue.value = val
  }
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
    getIndex,
    getWidth,
    getTransform,
  })
  modelValue.value = props.options[0]?.value
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
