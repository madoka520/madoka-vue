<template>
  <component :is="Root.component" v-bind="$attrs" :color :variant @click="emits('click', $event)">
    <template v-for="(name, index) in Object.keys($slots)" v-slot:[name]>
      <slot :name="name" />
    </template>
  </component>
</template>

<script setup lang="ts">
import { capitalize } from 'lodash'
// 原代码 - Codex 保留
// import type { Variant } from '@/components/button/button'
// Codex 新增开始
import type { Variant } from './button'
// Codex 新增结束
const props = withDefaults(
  defineProps<{
    type: string
    color?: string
    disabled?: boolean
    variant?: Variant
  }>(),
  {},
)
defineOptions({
  name: 'madoka-btn',
})
const emits = defineEmits<{
  (e: 'click', event: MouseEvent): void
}>()

// 原代码 - Codex 保留
// const components = import.meta.glob('/src/components/button/*.vue')
// Codex 新增开始
const components = import.meta.glob('./*.vue')
// Codex 新增结束

const toAsyncComponent = <T extends Component>(comp: () => Promise<T>) => markRaw(defineAsyncComponent(comp))
const Root = (() => {
  const setWatcher = () => {
    watch(() => props.type, resolveComponent, { immediate: true })
  }

  const resolveComponent = () => {
    // 原代码 - Codex 保留
    // const basePath = '/src/components/button'
    // Codex 新增开始
    const basePath = '.'
    // Codex 新增结束
    const compName = props.type
    const madokaComp = components[`${basePath}/Index_${capitalize(compName)}.vue`]

    if (madokaComp) {
      s.component = toAsyncComponent(madokaComp)
      return
    }
  }

  const s = reactive({
    component: 'div' as string | Component,
  })
  setWatcher()
  return s
})()
</script>

<style scoped></style>
