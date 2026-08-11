import type { Directive } from 'vue'

// Codex 新增开始
export type MadokaSelectDirectiveOptions = {
  zIndex?: number
  onSelect?: (rect: DOMRect) => void
}

type SelectElement = HTMLElement & {
  __selectBoxCleanup__?: () => void
}

const madokaSelect = {
  mounted(el, binding) {
    const options: MadokaSelectDirectiveOptions = typeof binding.value === 'function' ? { onSelect: binding.value } : binding.value || {}

    const box = document.createElement('div')

    Object.assign(box.style, {
      position: 'fixed',
      border: '1px solid #409eff',
      background: 'rgba(64,158,255,0.2)',
      pointerEvents: 'none',
      display: 'none',
      zIndex: String(options.zIndex ?? 30), // 👈 外部控制
    })

    document.body.appendChild(box)

    let startX = 0
    let startY = 0
    let currentX = 0
    let currentY = 0
    let dragging = false

    const updateBox = () => {
      const x = Math.min(startX, currentX)
      const y = Math.min(startY, currentY)
      const w = Math.abs(currentX - startX)
      const h = Math.abs(currentY - startY)

      Object.assign(box.style, {
        left: x + 'px',
        top: y + 'px',
        width: w + 'px',
        height: h + 'px',
      })
    }

    const getContainerRect = () => el.getBoundingClientRect()
    const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(value, max))

    const mousedown = (e: MouseEvent) => {
      const rect = getContainerRect()

      startX = clamp(e.clientX, rect.left, rect.right)
      startY = clamp(e.clientY, rect.top, rect.bottom)

      currentX = startX
      currentY = startY
      dragging = true

      box.style.display = 'block'
      updateBox()
    }

    const mousemove = (e: MouseEvent) => {
      if (!dragging) return

      const rect = getContainerRect()

      currentX = clamp(e.clientX, rect.left, rect.right)
      currentY = clamp(e.clientY, rect.top, rect.bottom)

      updateBox()
    }

    const mouseup = () => {
      if (!dragging) return
      dragging = false
      box.style.display = 'none'

      const rect = new DOMRect(Math.min(startX, currentX), Math.min(startY, currentY), Math.abs(currentX - startX), Math.abs(currentY - startY))

      options.onSelect?.(rect) // 👈 改这里
    }

    el.addEventListener('mousedown', mousedown)
    window.addEventListener('mousemove', mousemove)
    window.addEventListener('mouseup', mouseup)

    ;(el as SelectElement).__selectBoxCleanup__ = () => {
      el.removeEventListener('mousedown', mousedown)
      window.removeEventListener('mousemove', mousemove)
      window.removeEventListener('mouseup', mouseup)
      box.remove()
    }
  },

  unmounted(el: SelectElement) {
    el.__selectBoxCleanup__?.()
  },
} as Directive<HTMLElement, MadokaSelectDirectiveOptions>

export default madokaSelect
// Codex 新增结束
