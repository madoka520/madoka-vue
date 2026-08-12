import type { DirectiveBinding } from 'vue'

// Codex 新增开始
export type MadokaResizeDirectivePayload = {
  width: number
  height: number
  newLeft: number
  newTop: number
}

export type MadokaResizeDirectiveOptions = {
  enabled?: () => boolean
  onResize?: (payload: MadokaResizeDirectivePayload) => void
}

declare global {
  interface HTMLElement {
    _resizeHandles?: HTMLDivElement[]
    __madokaResizeCleanup__?: () => void
  }
}

const directions = [
  { name: 'top', cursor: 'n-resize' },
  { name: 'right', cursor: 'e-resize' },
  { name: 'bottom', cursor: 's-resize' },
  { name: 'left', cursor: 'w-resize' },
  { name: 'top-left', cursor: 'nw-resize' },
  { name: 'top-right', cursor: 'ne-resize' },
  { name: 'bottom-left', cursor: 'sw-resize' },
  { name: 'bottom-right', cursor: 'se-resize' },
]

const madokaResize = {
  // 原代码 - Codex 保留
  // updated(el: HTMLElement, binding: DirectiveBinding) {
  // Codex 新增开始
  updated(el: HTMLElement, binding: DirectiveBinding<MadokaResizeDirectiveOptions>) {
  // Codex 新增结束
    if (el._resizeHandles) {
      const enabled = binding.value?.enabled() !== false
      for (const handle of el._resizeHandles) {
        handle.style.pointerEvents = enabled ? 'auto' : 'none'
        handle.style.cursor = enabled ? handle.dataset.cursor || 'default' : 'default'
      }
    }
  },
  // 原代码 - Codex 保留
  // mounted(el: HTMLElement, binding: DirectiveBinding) {
  // Codex 新增开始
  mounted(el: HTMLElement, binding: DirectiveBinding<MadokaResizeDirectiveOptions>) {
  // Codex 新增结束
    const handles: HTMLDivElement[] = []
    // 原代码 - Codex 保留
    // const cleanupList: Array<() => void> = []
    // Codex 新增开始
    const cleanupList: Array<() => void> = []
    // Codex 新增结束
    if (getComputedStyle(el).position === 'static') {
      el.style.position = 'absolute' // 或 'relative'
    }

    let startX = 0, startY = 0
    let startWidth = 0, startHeight = 0
    let startTop = 0, startLeft = 0

    const onMouseMove = (e: MouseEvent, dir: string) => {
      let newWidth = startWidth
      let newHeight = startHeight
      let newTop = startTop
      let newLeft = startLeft

      const dx = e.clientX - startX
      const dy = e.clientY - startY

      if (dir.includes('right')) newWidth += dx
      if (dir.includes('bottom')) newHeight += dy
      if (dir.includes('left')) {
        newWidth -= dx
        newLeft += dx
      }
      if (dir.includes('top')) {
        newHeight -= dy
        newTop += dy
      }

      if (newWidth > 20) {
        el.style.width = newWidth + 'px'
        if (dir.includes('left')) el.style.left = newLeft + 'px'
      }
      if (newHeight > 20) {
        el.style.height = newHeight + 'px'
        if (dir.includes('top')) el.style.top = newTop + 'px'
      }

      if (typeof binding.value?.onResize === 'function') {
        binding.value.onResize({ width: newWidth, height: newHeight, newLeft, newTop })
      }
    }

    const createMouseDown = (dir: string) => (e: MouseEvent) => {
      e.preventDefault()
      startX = e.clientX
      startY = e.clientY
      startWidth = el.offsetWidth
      startHeight = el.offsetHeight
      startTop = el.offsetTop
      startLeft = el.offsetLeft

      const moveHandler = (ev: MouseEvent) => onMouseMove(ev, dir)
      const upHandler = () => {
        document.removeEventListener('mousemove', moveHandler)
        document.removeEventListener('mouseup', upHandler)
      }

      document.addEventListener('mousemove', moveHandler)
      document.addEventListener('mouseup', upHandler)
    }

    for (const { name, cursor } of directions) {
      const handle = document.createElement('div')
      handle.style.position = 'absolute'
      handle.style.width = name.includes('left') || name.includes('right') ? '3px' : '100%'
      handle.style.height = name.includes('top') || name.includes('bottom') ? '3px' : '100%'
      handle.style.cursor = cursor
      handle.style.zIndex = '10'
      handle.style.background = 'transparent'
      handle.dataset.cursor = cursor

      switch (name) {
        case 'top':
          handle.style.top = '0'
          handle.style.left = '0'
          break
        case 'right':
          handle.style.top = '0'
          handle.style.right = '0'
          break
        case 'bottom':
          handle.style.bottom = '0'
          handle.style.left = '0'
          break
        case 'left':
          handle.style.top = '0'
          handle.style.left = '0'
          break
        case 'top-left':
          handle.style.top = '0'
          handle.style.left = '0'
          handle.style.width = '3px'
          handle.style.height = '3px'
          break
        case 'top-right':
          handle.style.top = '0'
          handle.style.right = '0'
          handle.style.width = '3px'
          handle.style.height = '3px'
          break
        case 'bottom-left':
          handle.style.bottom = '0'
          handle.style.left = '0'
          handle.style.width = '3px'
          handle.style.height = '3px'
          break
        case 'bottom-right':
          handle.style.bottom = '0'
          handle.style.right = '0'
          handle.style.width = '3px'
          handle.style.height = '3px'
          break
      }

      // 原代码 - Codex 保留
      // handle.addEventListener('mousedown', createMouseDown(name))
      // cleanupList.push(() => handle.removeEventListener('mousedown', createMouseDown(name)))
      // Codex 新增开始
      const mouseDownHandler = createMouseDown(name)
      handle.addEventListener('mousedown', mouseDownHandler)
      cleanupList.push(() => handle.removeEventListener('mousedown', mouseDownHandler))
      // Codex 新增结束
      el.appendChild(handle)
      handles.push(handle)
    }

    el._resizeHandles = handles
    el.__madokaResizeCleanup__ = () => {
      cleanupList.forEach(cleanup => cleanup())
      handles.forEach(handle => handle.remove())
      delete el._resizeHandles
    }
  },

  unmounted(el: HTMLElement) {
    // Codex 新增开始
    el.__madokaResizeCleanup__?.()
    delete el.__madokaResizeCleanup__
    // Codex 新增结束
    // 原代码 - Codex 保留
    // if (el._resizeHandles) {
    //   el._resizeHandles.forEach(handle => handle.remove())
    //   delete el._resizeHandles
    // }
  }
}

export default madokaResize
// Codex 新增结束
