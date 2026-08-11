<template>
  <div
    class="madoka-switch"
    :class="[isChecked ? 'checked' : '', disabled ? 'disabled' : '']"
    @click="Switch.onToggle"
  >
    <div class="track">
      <div class="thumb"></div>
    </div>

    <span v-if="text" class="label">
      {{ isChecked ? text.on : text.off }}
    </span>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive } from 'vue'
import type { MadokaSwitchValue } from '../types'

const modelValue = defineModel<MadokaSwitchValue>({
  default: false,
})

const props = withDefaults(
  defineProps<{
    disabled?: boolean
    text?: {
      on: string
      off: string
    }
  }>(),
  {
    disabled: false,
  },
)
const isChecked = computed(() => {
  return modelValue.value === true || modelValue.value === 1
})
const emits = defineEmits<{
  (e: 'click', val: MadokaSwitchValue): void
  (e: 'change', val: MadokaSwitchValue): void
}>()
const Switch = (() => {
  const onToggle = (e: Event) => {
    if (props.disabled) return

    if (typeof modelValue.value === 'number') {
      modelValue.value = modelValue.value === 1 ? 0 : 1
    } else {
      modelValue.value = !modelValue.value
    }
    emits('click', modelValue.value)
    emits('change', modelValue.value)
  }

  const s = reactive({
    onToggle,
  })

  return s
})()
</script>

<style scoped lang="less">
.madoka-switch {
  display: inline-flex;
  align-items: center;
  gap: 8px;

  .track {
    width: 40px;
    height: 20px;
    background: #ddd;
    border-radius: 10px;
    position: relative;
    transition: all 0.2s;

    .thumb {
      width: 16px;
      height: 16px;
      background: #fff;
      border-radius: 50%;
      position: absolute;
      top: 2px;
      left: 2px;
      transition: all 0.2s;
    }
  }

  &.checked {
    .track {
      background: #7c3aed;

      .thumb {
        left: 22px;
      }
    }
  }

  &.disabled {
    opacity: 0.5;
  }

  .label {
    font-size: 12px;
    color: #666;
  }
}
</style>
