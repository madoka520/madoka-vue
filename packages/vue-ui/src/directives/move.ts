import type { Directive } from 'vue'

// Codex 新增开始
export type MadokaMoveDirectiveOptions = {
  /** 拖动开关(每次按下时求值) */
  enabled?: () => boolean
  /**
   * 手柄选择器:按下必须发生在手柄元素内才启动拖动。
   * 默认 '.overlay-header'(旧版弹窗行为);传 null 表示整个元素都是手柄
   * (悬浮面板场景,配合 exclude 排除内部交互元素)
   */
  handle?: string | null
  /** 命中这些元素的按下不启动拖动,默认交互元素清单(组件库按钮根是 span,要带上基类) */
  exclude?: string
  /** 拖动开始(按下并命中手柄) */
  onStart?: () => void
  /** 每帧增量(clientX/Y 差值;假跳变已在指令内丢弃,回调拿到的都是真实位移) */
  onMove?: (deltaX: number, deltaY: number) => void
  /** 拖动结束;moved=总位移是否超过 4px(用于区分"点击"与"真拖过") */
  onEnd?: (moved: boolean) => void
}

type MadokaMoveElement = HTMLElement & {
  __madokaMoveCleanup__?: () => void
}

const madokaMove = {
  mounted(el: MadokaMoveElement, binding) {
    let dragging = false
    let moved = false
    let lastX = 0
    let lastY = 0
    let downX = 0
    let downY = 0

    const opts = () => (binding.value ?? {}) as MadokaMoveDirectiveOptions

    const onPointerDown = (e: PointerEvent) => {
      const o = opts()
      if (o.enabled && !o.enabled()) return
      // 手柄判定:默认 '.overlay-header'(旧行为),null = 整个元素
      const handleSel = o.handle === undefined ? '.overlay-header' : o.handle
      if (handleSel) {
        const handleEl = el.querySelector(handleSel)
        if (!handleEl || !handleEl.contains(e.target as Node)) return
      }
      const exclude = o.exclude ?? 'button, a, input, textarea, select, [data-no-drag], .madoka-btn-base'
      const target = e.target as HTMLElement
      if (exclude && target.closest?.(exclude)) return

      dragging = true
      moved = false
      downX = lastX = e.clientX
      downY = lastY = e.clientY
      el.setPointerCapture(e.pointerId)
      el.addEventListener('pointermove', onPointerMove)
      el.addEventListener('pointerup', onPointerUp)
      el.addEventListener('pointercancel', onPointerUp)
      o.onStart?.()
    }

    const onPointerMove = (e: PointerEvent) => {
      if (!dragging) return
      // 按键已松(错过 up 事件的兜底):立即收摊,别拿着假事件继续拖
      if (e.buttons === 0) {
        onPointerUp(e)
        return
      }
      const deltaX = e.clientX - lastX
      const deltaY = e.clientY - lastY
      // WebView2 里指针拖出 webview 边界(进入原生标题栏等)会派发坐标 (0,0) 的假 move,
      // 单帧几百像素的跳变不可能是真实拖动,直接丢弃(否则元素瞬移到左上角)
      if (Math.abs(deltaX) > 200 || Math.abs(deltaY) > 200) return
      lastX = e.clientX
      lastY = e.clientY
      if (Math.abs(e.clientX - downX) + Math.abs(e.clientY - downY) > 4) {
        moved = true
      }
      opts().onMove?.(deltaX, deltaY)
    }

    const onPointerUp = (e: PointerEvent) => {
      if (!dragging) return
      dragging = false
      if (el.hasPointerCapture?.(e.pointerId)) {
        el.releasePointerCapture(e.pointerId)
      }
      el.removeEventListener('pointermove', onPointerMove)
      el.removeEventListener('pointerup', onPointerUp)
      el.removeEventListener('pointercancel', onPointerUp)
      opts().onEnd?.(moved)
    }

    el.addEventListener('pointerdown', onPointerDown)

    el.__madokaMoveCleanup__ = () => {
      el.removeEventListener('pointerdown', onPointerDown)
      el.removeEventListener('pointermove', onPointerMove)
      el.removeEventListener('pointerup', onPointerUp)
      el.removeEventListener('pointercancel', onPointerUp)
    }
  },

  unmounted(el) {
    ;(el as MadokaMoveElement).__madokaMoveCleanup__?.()
  },
} as Directive<HTMLElement, MadokaMoveDirectiveOptions>

export default madokaMove
// Codex 新增结束

// 原代码 - Codex 保留(mousedown 绑在写死的 .overlay-header 上、document 收事件、screenX 增量;
// 无触摸支持、无假事件防护。升级为 Pointer Events + 指针捕获,handle 默认值保持旧行为)
// export type MadokaMoveDirectiveOptions = {
//   enabled?: () => boolean
//   onMove?: (deltaX: number, deltaY: number) => void
// }
// const madokaMove = {
//   mounted(el, binding) {
//     let lastX = 0
//     let lastY = 0
//     const titleEl = el.querySelector('.overlay-header') as HTMLElement
//     if (!titleEl) return
//     const onMouseDown = (e: MouseEvent) => {
//       const enabled = binding.value?.enabled
//       if (enabled && !enabled()) return
//       lastX = e.screenX
//       lastY = e.screenY
//       document.addEventListener('mousemove', onMouseMove)
//       document.addEventListener('mouseup', onMouseUp)
//     }
//     const onMouseMove = (e: MouseEvent) => {
//       const deltaX = e.screenX - lastX
//       const deltaY = e.screenY - lastY
//       lastX = e.screenX
//       lastY = e.screenY
//       if (binding.value && binding.value.onMove) {
//         binding.value.onMove(deltaX, deltaY)
//       }
//     }
//     const onMouseUp = () => {
//       document.removeEventListener('mousemove', onMouseMove)
//       document.removeEventListener('mouseup', onMouseUp)
//     }
//     titleEl.addEventListener('mousedown', onMouseDown)
//     ;(el as MadokaMoveElement).__madokaMoveCleanup__ = () => {
//       titleEl.removeEventListener('mousedown', onMouseDown)
//       document.removeEventListener('mousemove', onMouseMove)
//       document.removeEventListener('mouseup', onMouseUp)
//     }
//   },
//   unmounted(el) {
//     ;(el as MadokaMoveElement).__madokaMoveCleanup__?.()
//   },
// } as Directive<HTMLElement, MadokaMoveDirectiveOptions>
