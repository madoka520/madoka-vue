<template>
  <!-- =========start========== -->
  <!-- 标签胶囊组:一排可多选的标签胶囊(可选带计数角标),选中态高亮;
       v-model 是选中的名称数组,点击胶囊切换选中/取消;
       样式配置经 CSS 变量下发(与 MadokaInput/Select 同款方案) -->
  <div class="madoka-tag-group" :style="cssVars">
    <span
      v-for="tag in tags"
      :key="tag.name"
      class="madoka-tag"
      :class="{ 'is-selected': modelValue.includes(tag.name), 'is-disabled': isDisabled(tag.name) }"
      :title="tag.count !== undefined ? `${tag.name} (${tag.count})` : tag.name"
      @click="toggle(tag.name)"
    >
      <!-- ========start======== 禁用项(功能性标签):锁图标提示不可操作 -->
      <i v-if="isDisabled(tag.name)" class="madoka-tag__lock mdi mdi-lock" />
      <!-- ========end======== -->
      <span class="madoka-tag__label">{{ tag.name }}</span>
      <span class="madoka-tag__count" v-if="tag.count !== undefined">{{ tag.count }}</span>
    </span>
    <span v-if="!tags.length" class="madoka-tag-group__empty">{{ emptyText }}</span>
  </div>
  <!-- ========end======== -->
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { MadokaTagGroupProps } from './props'

const props = withDefaults(defineProps<MadokaTagGroupProps>(), {
  tags: () => [],
  background: 'transparent',
  borderColor: '#e0e0e0',
  activeBorderColor: '#ffb7d5',
  activeBackground: 'rgba(255, 183, 213, 0.2)',
  color: '#444',
  activeColor: '#d6336c',
  countColor: '#ffb7d5',
  radius: 4,
  fontSize: 12,
  emptyText: '暂无标签',
})

// 样式配置经 CSS 变量下发,默认值即亮色样式
const cssVars = computed(() => ({
  '--tag-background': props.background,
  '--tag-border-color': props.borderColor,
  '--tag-active-border-color': props.activeBorderColor,
  '--tag-active-background': props.activeBackground,
  '--tag-color': props.color,
  '--tag-active-color': props.activeColor,
  '--tag-count-color': props.countColor,
  '--tag-radius': `${props.radius}px`,
  '--tag-font-size': `${props.fontSize}px`,
}))

const modelValue = defineModel<string[]>({
  default: () => [],
})

// ========start======== 禁用项:功能性标签等不可选中(点击无效,展示禁用态)
const isDisabled = (name: string) => (props.disabledNames ?? []).includes(name)
// ========end========

// 点击胶囊:选中/取消(禁用项不响应)
const toggle = (name: string) => {
  if (isDisabled(name)) return
  modelValue.value = modelValue.value.includes(name)
    ? modelValue.value.filter((n) => n !== name)
    : [...modelValue.value, name]
}
</script>

<style scoped lang="less">
.madoka-tag-group {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;

  &__empty {
    color: #bbb;
    font-size: var(--tag-font-size);
  }
}

.madoka-tag {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 10px;
  border: 1px solid var(--tag-border-color);
  border-radius: var(--tag-radius);
  background: var(--tag-background);
  color: var(--tag-color);
  font-size: var(--tag-font-size);
  cursor: pointer;
  user-select: none;
  transition: all 0.25s;

  &:hover {
    border-color: var(--tag-active-border-color);
  }

  &.is-selected {
    border-color: var(--tag-active-border-color);
    background: var(--tag-active-background);
    color: var(--tag-active-color);
  }

  // ========start======== 禁用态:半透明 + 禁用手势,悬浮不变色,不可选中
  &.is-disabled {
    opacity: 0.5;
    cursor: not-allowed;

    &:hover {
      border-color: var(--tag-border-color);
    }
  }

  &__lock {
    font-size: calc(var(--tag-font-size) - 1px);
    opacity: 0.7;
  }
  // ========end========

  &__label {
    word-break: break-all;
  }

  &__count {
    padding: 0 5px;
    border-left: 1px solid var(--tag-border-color);
    color: var(--tag-count-color);
    font-size: calc(var(--tag-font-size) - 1px);
  }

  &.is-selected &__count {
    border-left-color: var(--tag-active-border-color);
  }
}
</style>
<!-- ========end======== -->
