<template>
  <!-- =========start========== -->
  <!-- Glow 按钮:透明直角细边框,hover 绽放同色光晕(madoka-ui-style 默认形态,提炼自 madoka-nas 图库 header) -->
  <div class="madoka-btn madoka-btn-base madoka-btn-glow" tabindex="0">
    <span class="flex-center" style="gap: 6px">
      <slot>
        {{ text }}
      </slot>
    </span>
  </div>
</template>

<script setup lang="ts">
// Codex 新增开始
import type { MadokaButtonGlowProps } from './types'

const props = withDefaults(
  defineProps<MadokaButtonGlowProps>(),
  {
    color: '#ff85a2',
    // 文字默认白色:Glow 形态的半透明底在暗色宿主上成立;
    // 亮色宿主需显式传深色(textColor),组件不假设宿主明暗
    textColor: 'rgba(255, 255, 255, 0.85)',
  },
)
// Codex 新增结束
</script>

<style scoped lang="less">
.madoka-btn-glow {
  --primary-color: v-bind(color);
  --glow-text-color: v-bind(textColor);
  // 光晕与底色由主色派生,换一个 color 整套风格跟着走
  --glow: color-mix(in srgb, var(--primary-color) 55%, transparent);
  padding: 5px 14px;
  border-radius: 0; // 直角是默认形态
  background: color-mix(in srgb, var(--primary-color) 6%, transparent);
  border: 1.5px solid color-mix(in srgb, var(--primary-color) 45%, transparent);
  color: var(--glow-text-color);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

  &:hover {
    border-color: var(--primary-color);
    // hover 文字提纯到不透明的同色相(textColor 的透明版本由浏览器渲染层近似)
    color: var(--glow-text-color);
    filter: brightness(1.15);
    background: color-mix(in srgb, var(--primary-color) 12%, transparent);
    box-shadow:
      0 0 4px var(--glow),
      0 0 10px var(--glow);
  }

  &:active {
    opacity: 0.7;
  }
}
</style>
<!-- ========end======== -->
