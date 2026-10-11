<template>
  <!-- =========start========== -->
  <!-- 大图预览器:基于 MadokaMask 的弹层(父级只调 open(index)),键盘 ←/→/Esc,
       业务信息与操作经具名 slot 上抛(header 右上操作区 / footer 底部信息条)。
       Mask 随开随挂、关完即卸(与 useMask/useModal 同生命周期语义,层级永远跟随打开顺序) -->
  <MadokaMask
    v-if="Viewer.mounted"
    v-model="Viewer.visible"
    :mask-closable="props.maskClosable"
    mask-background="rgba(12, 6, 10, 0.86)"
    :mask-blur="14"
  >
    <!-- 💫 v-if 跟随显隐:Mask 的 content 容器只做定位不管显隐,
         不挂条件的话预览器会常驻全屏(一打开 app 就"弹窗"的根因) -->
    <Transition name="image-viewer-pop">
      <div class="image-viewer" v-if="Viewer.visible">
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

      <!-- 大图:key 换 url 才重新加载;加载完成前由共享元素 ghost 顶位 -->
      <img
        class="image-viewer__image"
        v-if="current"
        :key="current.url"
        :src="current.url"
        :alt="current.name ?? ''"
        draggable="false"
        :class="{ 'is-loaded': Viewer.imageLoaded }"
        @load="Viewer.imageLoaded = true"
      />

      <!-- 共享元素 ghost:open 传入来源(缩略图位置与 src)时,
           先用缩略图从原位飞向放大位(模仿 MadoMagiArchive 的 img-zoom),
           原图加载完成即淡换,加载再慢也有图看 -->
      <img
        class="image-viewer__ghost"
        v-if="Viewer.ghost"
        :src="Viewer.ghost.src"
        :style="Viewer.ghostStyle"
        draggable="false"
      />

      <!-- 底部信息 slot(作者/标签/尺寸等业务数据) -->
      <div class="image-viewer__footer">
        <slot name="footer" :image="current" :index="Viewer.currentIndex" />
      </div>
      </div>
    </Transition>
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
  // 目标框:视口中央 88%×84% 区域内按图片宽高比 contain(与 .image-viewer__image 的 max 约束一致)
  const targetRect = (index: number) => {
    const img = props.images[index]
    const vw = window.innerWidth
    const vh = window.innerHeight
    const boxW = vw * 0.88
    const boxH = vh * 0.84
    const boxL = vw * 0.06
    const boxT = vh * 0.08
    if (!img?.width || !img?.height) {
      return { left: boxL, top: boxT, width: boxW, height: boxH }
    }
    const ratio = img.width / img.height
    let w = boxW
    let h = w / ratio
    if (h > boxH) {
      h = boxH
      w = h * ratio
    }
    return { left: boxL + (boxW - w) / 2, top: boxT + (boxH - h) / 2, width: w, height: h }
  }

  const f = {
    // ===== 同步方法 =====
    // source 传来源(网格缩略图的矩形与 src)时启用共享元素过渡:缩略图从原位飞向放大位
    open: (index = 0, source?: { left: number; top: number; width: number; height: number; src: string }) => {
      s.currentIndex = Math.min(Math.max(index, 0), Math.max(props.images.length - 1, 0))
      // Mask 随开随挂:挂载即取 z 号,和 useMask/useModal 的短命弹层同一套层级语义;
      // 常驻挂载会在热更新/窗口重开后取号漂移,出现下层盖住上层的关闭顺序错乱
      s.mounted = true
      s.imageLoaded = false
      nextTick(() => {
        s.visible = true
        if (source) {
          const to = targetRect(s.currentIndex)
          s.ghost = source
          // 初始摆在缩略图原位,下一帧过渡到放大位(FLIP)
          s.ghostStyle = {
            left: `${source.left}px`,
            top: `${source.top}px`,
            width: `${source.width}px`,
            height: `${source.height}px`,
            transition: 'none',
          }
          requestAnimationFrame(() => {
            s.ghostStyle = {
              left: `${to.left}px`,
              top: `${to.top}px`,
              width: `${to.width}px`,
              height: `${to.height}px`,
              transition: 'all 0.42s cubic-bezier(0.22, 1, 0.36, 1)',
            }
          })
        }
      })
    },
    close: () => {
      s.visible = false
      // 离场动画播完再卸载 Mask
      setTimeout(() => {
        s.mounted = false
        s.ghost = null
      }, 400)
    },
    prev: () => {
      if (s.currentIndex > 0) {
        s.currentIndex--
        s.imageLoaded = false
        s.ghost = null
        emits('change', s.currentIndex)
      }
    },
    next: () => {
      if (s.currentIndex < props.images.length - 1) {
        s.currentIndex++
        s.imageLoaded = false
        s.ghost = null
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
    mounted: false,
    currentIndex: 0,
    // 共享元素过渡:ghost 顶位直到原图加载完(imageLoaded)
    ghost: null as { left: number; top: number; width: number; height: number; src: string } | null,
    ghostStyle: {} as Record<string, string>,
    imageLoaded: false,
    ...f,
  })

  onMounted(() => {
    window.addEventListener('keydown', s.onKeydown)
  })

  onUnmounted(() => {
    window.removeEventListener('keydown', s.onKeydown)
  })

  // 原图就绪后等淡入起来再撤 ghost,双段渐变更平滑
  watch(
    () => s.imageLoaded,
    (loaded) => {
      if (loaded) {
        setTimeout(() => {
          s.ghost = null
        }, 160)
      }
    },
  )

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
// 纯布局容器:顶栏/按钮/图片的定位骨架。
// 无背景无事件——暗化毛玻璃由 Mask 的 maskBackground/maskBlur 提供,
// 点击穿透到遮罩层(无叠加关自己,有叠加命中上层弹窗的遮罩,顺序天然正确)
.image-viewer {
  position: fixed;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  user-select: none;
  pointer-events: none;
}

// 真正要交互的元素单独恢复接收点击
.image-viewer__topbar,
.image-viewer__btn,
.image-viewer__image {
  pointer-events: auto;
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
  // 加载完成前保持透明,由共享元素 ghost 顶位;就绪后淡入换防
  opacity: 0;
  transition: opacity 0.3s ease;

  &.is-loaded {
    opacity: 1;
  }
}

// 共享元素 ghost:缩略图从原位飞向放大位的过渡层,原图就绪即撤
.image-viewer__ghost {
  position: fixed;
  object-fit: fill;
  z-index: 1000002;
  pointer-events: none;
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

// 进出场:expo-out 大面板曲线,图先缩后弹;离场快速淡出
.image-viewer-pop-enter-active {
  transition: opacity 0.35s cubic-bezier(0.16, 1, 0.3, 1);

  .image-viewer__image {
    transition: transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
  }
}

.image-viewer-pop-leave-active {
  transition: opacity 0.2s ease;
}

.image-viewer-pop-enter-from,
.image-viewer-pop-leave-to {
  opacity: 0;
}

.image-viewer-pop-enter-from .image-viewer__image {
  transform: scale(0.92);
}
</style>
<!-- ========end======== -->
