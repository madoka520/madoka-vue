<template>
  <component :is="Root.component" v-bind="$attrs" :color :variant @click="emits('click', $event)">
    <template v-for="(name, index) in Object.keys($slots)" v-slot:[name]>
      <slot :name="name" />
    </template>
  </component>
</template>

<script setup lang="ts">
import { capitalize } from 'lodash'
import type { MadokaButtonEmits, MadokaButtonProps, MadokaButtonResolvedComponent } from './types'
const props = withDefaults(
  // 原代码 - Codex 保留
  // defineProps<{
  //   type: string
  //   color?: string
  //   disabled?: boolean
  //   variant?: Variant
  // }>(),
  // Codex 新增开始
  defineProps<MadokaButtonProps>(),
  // Codex 新增结束
  {},
)
defineOptions({
  name: 'madoka-btn',
})
// 原代码 - Codex 保留
// const emits = defineEmits<{
//   (e: 'click', event: MouseEvent): void
// }>()
// Codex 新增开始
const emits = defineEmits<MadokaButtonEmits>()
// Codex 新增结束

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
    // 原代码 - Codex 保留
    // component: 'div' as string | Component,
    // Codex 新增开始
    component: 'div' as MadokaButtonResolvedComponent,
    // Codex 新增结束
  })
  setWatcher()
  return s
})()
</script>

<style scoped></style>
<style lang="less">
/* Codex 新增开始 */
/* 四个变体（Index_1 / Index_2 / Index_3 / Index_Link）根元素均带 madoka-btn-base 类，
   公共样式统一写在这里，避免同样的规则要改四个文件 */
.madoka-btn-base {
  white-space: nowrap;
  width: fit-content;
  user-select: none;
}
/* Codex 新增结束 */
</style>
