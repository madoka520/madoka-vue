<template>
  <span
    class="madoka-link"
    :class="[disabled ? 'disabled' : '']"
    @click="Link.onClick"
  >
    <slot>{{ props.label }}</slot>
  </span>
</template>

<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    label?: string
    href?: string
    target?: '_blank' | '_self'
    disabled?: boolean
  }>(),
  {
    label: '',
    target: '_self',
    disabled: false,
  },
)

const emits = defineEmits<{
  (e: 'click', e2: MouseEvent): void
}>()

const Link = (() => {
  const onClick = (e: MouseEvent) => {
    if (props.disabled) return

    emits('click', e)

    if (!props.href) return

    if (props.target === '_blank') {
      window.open(props.href)
    } else {
      window.location.href = props.href
    }
  }

  const s = reactive({
    onClick,
  })

  return s
})()
</script>

<style scoped lang="less">
.madoka-link {
  color: #e64980;
  font-size: 14px;
  transition: all 0.2s;

  user-select: none;

  &:hover {
    color: #c2255c;
  }

  &:active {
    color: #a61e4d;
  }

  &.disabled {
    color: #d8a1b8;
  }
}
</style>
