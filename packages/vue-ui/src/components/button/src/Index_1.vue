<template>
  <div class="madoka-btn flex-center" :class="{ [`variant-${variant}`]: true }" tabindex="0">
    <span>
      <slot>
        {{ text }}
      </slot>
    </span>
  </div>
</template>

<script setup lang="ts">
import type { MadokaButtonPrimaryProps } from './types'
import { getRGB } from '@madoka520/vue-utils'

const props = withDefaults(
  // 原代码 - Codex 保留
  // defineProps<{
  //   text?: string
  //   color?: string
  //   variant?: Variant
  //   radius?: number
  // }>(),
  // Codex 新增开始
  defineProps<MadokaButtonPrimaryProps>(),
  // Codex 新增结束
  {
    color: '#409eff',
    radius: 4,
  },
)

function isLightColor(colorStr: string): boolean {
  const rgb = getRGB(colorStr)
  if (!rgb) return true // fallback：亮色
  const [r, g, b] = rgb
  const yiq = (r * 299 + g * 587 + b * 114) / 1000
  return yiq >= 128
}

const textColor = computed(() => {
  return isLightColor(props.color) ? '#409eff' : 'white'
})
</script>

<style scoped lang="less">
.madoka-btn {
  --primary-color: v-bind(color);
  --text-color: v-bind(textColor);
  padding: 5px 16px;
  border-radius: v-bind("radius + 'px'");
  gap: 6px;
  user-select: none;
}

.variant-text {
  background: transparent;
  border: none;
  color: var(--primary-color);

  &:hover {
    background: rgba(0, 0, 0, 0.04);
  }
}

.variant-outlined {
  background: transparent;
  border: 1px solid var(--primary-color);
  color: var(--primary-color);

  &:hover {
    opacity: 0.9;
  }
}

.variant-plain {
  background: var(--primary-color);
  color: var(--text-color);
  border: none;

  &:hover {
    opacity: 0.9;
  }
}
</style>
