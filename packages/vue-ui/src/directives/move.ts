import type { Directive } from 'vue'

// Codex 新增开始
const madokaMove = {
  mounted(el, binding) {
    let lastX = 0
    let lastY = 0

    const titleEl = el.querySelector('.overlay-header') as HTMLElement

    if (!titleEl) return

    const onMouseDown = (e: MouseEvent) => {
      const enabled = binding.value.enabled
      if (!enabled) return
      if (!enabled()) return

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
  },
} as Directive<HTMLElement>

export default madokaMove
// Codex 新增结束
