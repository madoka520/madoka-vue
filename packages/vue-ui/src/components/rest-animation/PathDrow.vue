<template>
  <path
    ref="pathRef"
    :d="props.d"
    class="path"
    :style="{ stroke: props.color }"
  />
</template>

<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    d: string
    color?: string
    duration?: number
    delay?: number
  }>(),
  {
    color: 'black',
    duration: 1.5,
    delay: 0,
  },
)

const pathRef = useTemplateRef('pathRef')

const S = (() => {
  const redraw = () => {
    const path = pathRef.value as SVGPathElement
    const length = path.getTotalLength()

    // 重置
    path.style.transition = 'none'
    path.style.strokeDasharray = `${length}`
    path.style.strokeDashoffset = `${length}`

    path.getBoundingClientRect()

    requestAnimationFrame(() => {
      path.style.transition = `stroke-dashoffset ${props.duration}s ease`

      requestAnimationFrame(() => {
        path.style.strokeDashoffset = '0'
      })
    })
  }
  const init = () => {
    const path = pathRef.value as SVGPathElement
    const length = path.getTotalLength()

    path.style.transition = 'none'
    path.style.strokeDasharray = `${length}`
    path.style.strokeDashoffset = `${length}`

    path.getBoundingClientRect()

    requestAnimationFrame(() => {
      path.style.transition = `stroke-dashoffset ${props.duration}s ease ${props.delay}s`

      requestAnimationFrame(() => {
        path.style.strokeDashoffset = '0'
      })
    })
  }

  const s = reactive({
    init,
  })

  return s
})()

onMounted(() => {
  S.init()
})
</script>

<style lang="less">
.path {
  fill: none;
  stroke-width: 2;
  stroke: rgba(0, 0, 0, 0.2); // 浅灰
}
</style>
