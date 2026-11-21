<template>
  <!-- 通用悬浮面板:Teleport 到 body,展开卡与最小化胶囊两种形态。
       拖动复用 v-madoka-move 指令(整个面板是手柄,交互元素由指令排除;假跳变/漏 up
       也在指令内防护):首次拖动把 right/bottom 锚点布局冻结为 left/top,
       移动量经视口钳制不会拖丢 -->
  <Teleport :to="teleport">
    <div
      ref="rootRef"
      v-if="visible"
      v-madoka-move="{
        enabled: () => draggable,
        handle: null,
        onStart: Panel.onDragStart,
        onMove: Panel.onDragMove,
        onEnd: Panel.onDragEnd,
      }"
      class="madoka-float-panel"
      :class="{ 'is-dragged': Panel.dragged }"
      :style="panelStyle"
    >
      <!-- 最小化胶囊:点击恢复展开;按住拖动超过阈值后松手不当作点击 -->
      <div
        class="madoka-float-panel__mini"
        v-if="minimized"
        title="点击展开"
        @click="!Panel.dragMoved && emit('update:minimized', false)"
      >
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
import { computed, reactive, ref } from 'vue'
import madokaMoveDirective from '../../../directives/move'
import type { MadokaFloatPanelEmits, MadokaFloatPanelProps } from './types'

// 拖动走 v-madoka-move 指令(局部注册)
const vMadokaMove = madokaMoveDirective

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
    // 拖动开始(指令回调):把 right/bottom 锚点布局冻结为 left/top,之后按增量移动
    onDragStart: () => {
      const el = rootRef.value
      if (!el) return
      const rect = el.getBoundingClientRect()
      if (rect.width === 0) return // 尚未布局完成,冻结了就是错的
      s.w = rect.width
      s.h = rect.height
      if (!s.dragged) {
        s.left = rect.left
        s.top = rect.top
        s.dragged = true
      }
    },
    // 每帧增量(指令已过滤假跳变):视口钳制,留 4px 在屏内不会拖丢
    onDragMove: (dx: number, dy: number) => {
      s.left = Math.min(Math.max(4, s.left + dx), window.innerWidth - s.w - 4)
      s.top = Math.min(Math.max(4, s.top + dy), window.innerHeight - s.h - 4)
    },
    // 拖动结束:moved=真拖过(胶囊据此抑制误展开)
    onDragEnd: (moved: boolean) => {
      s.dragMoved = moved
    },
  }

  const s = reactive({
    dragged: false,
    dragMoved: false,
    left: 0,
    top: 0,
    w: 0,
    h: 0,
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
