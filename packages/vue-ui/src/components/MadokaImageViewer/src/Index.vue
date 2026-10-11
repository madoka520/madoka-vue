<template>
  <!-- =========start========== -->
  <!-- 大图预览器:基于 MadokaMask 的自治弹层(父级只调 open(index)),键盘 ←/→/Esc,
       业务信息与操作经具名 slot 上抛(header 右上操作区 / footer 底部信息条) -->
  <MadokaMask v-model="Viewer.visible" :mask-closable="props.maskClosable">
    <div class="image-viewer">
      <!-- 顶部:序号 + 右侧操作 slot(替换/编辑/删除等业务按钮) -->
      <div class="image-viewer__topbar">
        <span class="image-viewer__counter" v-if="props.images.length">
          {{ Viewer.currentIndex + 1 }} / {{ props.images.length }}
        </span>
        <div class="image-viewer__actions">
          <slot name="header" :image="current" :index="Viewer.currentIndex" />
        </div>
      </div>

      <!-- 左右切换 -->
      <button class="image-viewer__btn image-viewer__nav--prev" v-if="Viewer.currentIndex > 0" @click="Viewer.prev" title="上一张 (←)">
        <i class="mdi mdi-chevron-left" />
      </button>
      <button
        class="image-viewer__btn image-viewer__nav--next"
        v-if="Viewer.currentIndex < props.images.length - 1"
        @click="Viewer.next"
        title="下一张 (→)"
      >
        <i class="mdi mdi-chevron-right" />
      </button>

      <!-- 大图:key 换 url 才重新加载 -->
      <img
        class="image-viewer__image"
        v-if="current"
        :key="current.url"
        :src="current.url"
        :alt="current.name ?? ''"
        draggable="false"
      />

      <!-- 底部信息 slot(作者/标签/尺寸等业务数据) -->
      <div class="image-viewer__footer">
        <slot name="footer" :image="current" :index="Viewer.currentIndex" />
      </div>
    </div>
  </MadokaMask>
  <!-- ========end======== -->
</template>

<script setup lang="ts">
// Codex 新增开始
import MadokaMask from '../../MadokaMask/src/Index.vue'
import type { MadokaImageViewerEmits, MadokaImageViewerProps } from './types'

const props = withDefaults(defineProps<MadokaImageViewerProps>(), {
  maskClosable: true,
})

const emits = defineEmits<MadokaImageViewerEmits>()

const Viewer = (() => {
  const f = {
    // ===== 同步方法 =====
    open: (index = 0) => {
      s.currentIndex = Math.min(Math.max(index, 0), Math.max(props.images.length - 1, 0))
      s.visible = true
    },
    close: () => {
      s.visible = false
    },
    prev: () => {
      if (s.currentIndex > 0) {
        s.currentIndex--
        emits('change', s.currentIndex)
      }
    },
    next: () => {
      if (s.currentIndex < props.images.length - 1) {
        s.currentIndex++
        emits('change', s.currentIndex)
      }
    },
    onKeydown: (e: KeyboardEvent) => {
      // 💫 只有开着的时候才拦键盘,别抢别的弹层的 Esc
      if (!s.visible) return
      if (e.key === 'Escape') s.close()
      if (e.key === 'ArrowLeft') s.prev()
      if (e.key === 'ArrowRight') s.next()
    },
  }

  const s = reactive({
    visible: false,
    currentIndex: 0,
    ...f,
  })

  onMounted(() => {
    window.addEventListener('keydown', s.onKeydown)
  })

  onUnmounted(() => {
    window.removeEventListener('keydown', s.onKeydown)
  })

  return s
})()

// 当前图:slot props 与大图共同消费的派生值
const current = computed(() => props.images[Viewer.currentIndex] ?? null)

// 👉 列表在外面被移除条目时收拢索引:越界夹回尾部,空了就散场
watch(
  () => props.images.length,
  (len) => {
    if (Viewer.currentIndex >= len) {
      Viewer.currentIndex = Math.max(0, len - 1)
    }
    if (len === 0) {
      Viewer.close()
    }
  },
)

defineExpose({ open: Viewer.open, close: Viewer.close })
// Codex 新增结束
</script>

<style scoped lang="less">
// 预览器是暗场:铺满视口的容器叠在 Mask 黑罩之上,再加一层暗化与毛玻璃
.image-viewer {
  position: fixed;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(12, 6, 10, 0.72);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  user-select: none;
}

.image-viewer__topbar {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 18px;
  background: linear-gradient(180deg, rgba(0, 0, 0, 0.5), transparent);
}

.image-viewer__counter {
  color: rgba(255, 255, 255, 0.75);
  font-size: 12px;
}

.image-viewer__actions {
  display: flex;
  gap: 8px;
}

.image-viewer__btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border: 1.5px solid rgba(255, 255, 255, 0.35);
  background: rgba(0, 0, 0, 0.35);
  color: rgba(255, 255, 255, 0.85);
  font-size: 20px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

  &:hover {
    border-color: rgba(255, 255, 255, 0.8);
    color: white;
    box-shadow: 0 0 8px rgba(255, 255, 255, 0.35);
  }

  &:active {
    opacity: 0.7;
  }
}

.image-viewer__nav--prev {
  position: absolute;
  left: 22px;
  top: 50%;
  transform: translateY(-50%);
}

.image-viewer__nav--next {
  position: absolute;
  right: 22px;
  top: 50%;
  transform: translateY(-50%);
}

.image-viewer__image {
  max-width: 88%;
  max-height: 84%;
  object-fit: contain;
  border: 1.5px solid rgba(255, 255, 255, 0.25);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
}

.image-viewer__footer {
  position: absolute;
  bottom: 14px;
  left: 0;
  right: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  color: rgba(255, 255, 255, 0.55);
  font-size: 12px;
}
</style>
<!-- ========end======== -->
