<template>
  <!-- 通用悬浮面板:Teleport 到 body,展开卡与最小化胶囊两种形态。
       按住即可拖动(Pointer Events,兼容触摸):首次拖动把 right/bottom 锚点布局
       冻结为 left/top,移动量经视口钳制不会拖丢;按钮/输入框等交互元素不触发拖动 -->
  <Teleport :to="teleport">
    <div
      ref="rootRef"
      v-if="visible"
      class="madoka-float-panel"
      :class="{ 'is-dragged': Panel.dragged }"
      :style="panelStyle"
      @pointerdown="Panel.onDragStart"
    >
      <!-- 最小化胶囊:点击恢复展开 -->
      <div class="madoka-float-panel__mini" v-if="minimized" title="点击展开" @click="emit('update:minimized', false)">
        <slot name="mini" />
      </div>

      <!-- 展开卡片:内容与头部按钮全由使用方通过默认插槽塞入 -->
      <div class="madoka-float-panel__card" v-else :style="cardStyle">
        <slot />
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, reactive, ref } from 'vue'
import type { MadokaFloatPanelEmits, MadokaFloatPanelProps } from './types'

const minimized = defineModel<boolean>('minimized', { default: false })

const props = withDefaults(defineProps<MadokaFloatPanelProps>(), {
  visible: true,
  width: '300px',
  background: 'rgba(20, 10, 15, 0.94)',
  draggable: true,
  zIndex: 1200,
  teleport: 'body',
})

const emit = defineEmits<MadokaFloatPanelEmits>()

const rootRef = ref<HTMLElement | null>(null)

const Panel = (() => {
  const f = {
    // ===== 同步方法 =====
    onDragStart: (e: PointerEvent) => {
      if (!props.draggable) return
      const target = e.target as HTMLElement
      // 交互元素上的指针事件不当作拖动
      if (target.closest('button, a, input, textarea, select, [data-no-drag]')) return
      const el = rootRef.value
      if (!el) return
      const rect = el.getBoundingClientRect()
      s.w = rect.width
      s.h = rect.height
      // 首次拖动:把 right/bottom 定位换算成 left/top,之后按增量移动
      if (!s.dragged) {
        s.left = rect.left
        s.top = rect.top
        s.dragged = true
      }
      s.lastX = e.clientX
      s.lastY = e.clientY
      el.setPointerCapture(e.pointerId)
      el.addEventListener('pointermove', f.onDragMove)
      el.addEventListener('pointerup', f.onDragEnd)
      el.addEventListener('pointercancel', f.onDragEnd)
    },
    onDragMove: (e: PointerEvent) => {
      const dx = e.clientX - s.lastX
      const dy = e.clientY - s.lastY
      s.lastX = e.clientX
      s.lastY = e.clientY
      // 视口钳制:留 4px 在屏内,不会拖丢找不回
      s.left = Math.min(Math.max(4, s.left + dx), window.innerWidth - s.w - 4)
      s.top = Math.min(Math.max(4, s.top + dy), window.innerHeight - s.h - 4)
    },
    onDragEnd: (e: PointerEvent) => {
      const el = rootRef.value
      if (el?.hasPointerCapture?.(e.pointerId)) {
        el.releasePointerCapture(e.pointerId)
      }
      el?.removeEventListener('pointermove', f.onDragMove)
      el?.removeEventListener('pointerup', f.onDragEnd)
      el?.removeEventListener('pointercancel', f.onDragEnd)
    },
  }

  const s = reactive({
    dragged: false,
    left: 0,
    top: 0,
    w: 0,
    h: 0,
    lastX: 0,
    lastY: 0,
    ...f,
  })

  return s
})()

// 未拖动时保持 right/bottom 锚点(窗口缩放也贴着角);拖动后用 left/top 定位
const panelStyle = computed(() => {
  if (!Panel.dragged) return { zIndex: props.zIndex }
  return {
    zIndex: props.zIndex,
    left: `${Panel.left}px`,
    top: `${Panel.top}px`,
    right: 'auto',
    bottom: 'auto',
  }
})

const cardStyle = computed(() => ({
  width: props.width,
  background: props.background,
}))

onBeforeUnmount(() => {
  Panel.onDragEnd({ pointerId: -1 } as PointerEvent)
})
</script>

<style scoped lang="less">
.madoka-float-panel {
  position: fixed;
  right: 20px;
  bottom: 20px;
  user-select: none;
  touch-action: none; // 拖动时别让触摸设备滚动页面

  &.is-dragged {
    right: auto;
    bottom: auto;
  }
}

/* 最小化胶囊 */
.madoka-float-panel__mini {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 14px;
  border: 1.5px solid rgba(255, 183, 197, 0.5);
  background: rgba(20, 10, 15, 0.92);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  color: #ffb7c5;
  font-size: 12px;
  box-shadow: 0 0 12px rgba(255, 126, 201, 0.55);
  transition: all 0.25s;

  &:hover {
    border-color: #ff85a2;
    color: #fff;
  }
}

/* 展开卡片:暗色玻璃底 + 粉描边,内容纵向排列 */
.madoka-float-panel__card {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 12px 14px;
  border: 1.5px solid rgba(255, 183, 197, 0.5);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.5), 0 0 12px rgba(255, 126, 201, 0.25);
  animation: madoka-float-in 0.25s ease;
}

@keyframes madoka-float-in {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
