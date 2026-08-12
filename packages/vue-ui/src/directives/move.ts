import type { Directive } from 'vue'

// Codex 新增开始
export type MadokaMoveDirectiveOptions = {
  enabled?: () => boolean
  onMove?: (deltaX: number, deltaY: number) => void
}

type MadokaMoveElement = HTMLElement & {
  __madokaMoveCleanup__?: () => void
}

const madokaMove = {
  mounted(el, binding) {
    let lastX = 0
    let lastY = 0

    const titleEl = el.querySelector('.overlay-header') as HTMLElement

    if (!titleEl) return

    const onMouseDown = (e: MouseEvent) => {
      // 原代码 - Codex 保留
      // const enabled = binding.value.enabled
      // if (!enabled) return
      // Codex 新增开始
      const enabled = binding.value?.enabled
      // Codex 新增结束
      // 原代码 - Codex 保留
      // if (!enabled()) return
      // Codex 新增开始
      if (enabled && !enabled()) return
      // Codex 新增结束

      // ✅ 用 screenX（关键）
      lastX = e.screenX
      lastY = e.screenY

      document.addEventListener('mousemove', onMouseMove)
      document.addEventListener('mouseup', onMouseUp)
    }

    const onMouseMove = (e: MouseEvent) => {
      // ✅ 每一帧的增量
      const deltaX = e.screenX - lastX
      const deltaY = e.screenY - lastY

      // 更新基准点
      lastX = e.screenX
      lastY = e.screenY

      if (binding.value && binding.value.onMove) {
        binding.value.onMove(deltaX, deltaY)
      }
    }

    const onMouseUp = () => {
      document.removeEventListener('mousemove', onMouseMove)
      document.removeEventListener('mouseup', onMouseUp)
    }

    titleEl.addEventListener('mousedown', onMouseDown)

    ;(el as MadokaMoveElement).__madokaMoveCleanup__ = () => {
      titleEl.removeEventListener('mousedown', onMouseDown)
      document.removeEventListener('mousemove', onMouseMove)
      document.removeEventListener('mouseup', onMouseUp)
    }
  },

  unmounted(el) {
    ;(el as MadokaMoveElement).__madokaMoveCleanup__?.()
  },
} as Directive<HTMLElement, MadokaMoveDirectiveOptions>

export default madokaMove
// Codex 新增结束
