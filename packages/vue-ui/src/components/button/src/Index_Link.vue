<template>
  <span
    class="madoka-link madoka-btn-base"
    :class="[disabled ? 'disabled' : '']"
    @click="Link.onClick"
  >
    <slot>{{ props.label }}</slot>
  </span>
</template>

<script setup lang="ts">
import type { MadokaButtonEmits, MadokaButtonLinkProps } from './types'
const props = withDefaults(
  // 原代码 - Codex 保留
  // defineProps<{
  //   label?: string
  //   href?: string
  //   target?: '_blank' | '_self'
  //   disabled?: boolean
  // }>(),
  // Codex 新增开始
  defineProps<MadokaButtonLinkProps>(),
  // Codex 新增结束
  {
    label: '',
    target: '_self',
    disabled: false,
  },
)

// 原代码 - Codex 保留
// const emits = defineEmits<{
//   (e: 'click', e2: MouseEvent): void
// }>()
// Codex 新增开始
const emits = defineEmits<MadokaButtonEmits>()
// Codex 新增结束

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

  /* 原代码 - Codex 保留（公共样式已抽到 Index.vue 的 .madoka-btn-base） */
  /* user-select: none; */
  /* 原代码 - Codex 保留（公共样式已抽到 Index.vue 的 .madoka-btn-base） */
  /* white-space: nowrap; */
  /* width: fit-content; */

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
