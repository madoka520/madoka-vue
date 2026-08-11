import { reactive, h, watchEffect, render, nextTick } from 'vue'

interface MenuSize {
  width?: number
  height?: number
}

interface MenuItem {
  icon?: string
  label: string
  action?: () => void
  children?: MenuItem[]
}

const DEFAULT_SIZE: Required<MenuSize> = { width: 160, height: 30 }

// 单例状态
const state = reactive({
  visible: false,
  position: { x: 0, y: 0 },
  items: [] as MenuItem[],
  size: { ...DEFAULT_SIZE } as Required<MenuSize>,
})

// 全局唯一容器
const container = document.createElement('div')
document.body.appendChild(container)
const style = document.createElement('style')
style.innerHTML = `
  li:hover > ul > li {
    display: flex !important;
  }
`
document.head.appendChild(style)
const hide = () => {
  state.visible = false
}

container.addEventListener('mouseover', (e) => {
  const li = (e.target as HTMLElement)?.closest('li')
  if (!li) return

  const subMenu = li.querySelector(':scope > ul') as HTMLElement | null
  if (!subMenu) return

  // 先恢复为默认：右侧展开
  subMenu.style.left = '100%'
  subMenu.style.right = ''
  subMenu.style.top = '0'

  const rect = subMenu.getBoundingClientRect()
  const screenWidth = window.innerWidth

  // 右侧放不下，改为左侧
  if (rect.right > screenWidth) {
    subMenu.style.left = 'auto'
    subMenu.style.right = '100%'
  }
})

const adjustPosition = () => {
  const menuEl = container.firstElementChild as HTMLElement | null
  if (!menuEl) return

  const rect = menuEl.getBoundingClientRect()
  const screenWidth = window.innerWidth
  const screenHeight = window.innerHeight

  if (rect.right > screenWidth) {
    state.position.x -= rect.right - screenWidth
  }
  if (rect.bottom > screenHeight) {
    state.position.y -= rect.bottom - screenHeight
  }
}

const show = (event: MouseEvent, items: MenuItem[], size?: MenuSize) => {
  // 新增：强制卸载上一次菜单
  render(null, container)
  event.preventDefault()
  state.position.x = event.clientX
  state.position.y = event.clientY
  state.items = items
  state.size = { ...DEFAULT_SIZE, ...size }
  state.visible = true

  // 等 Vue 渲染后再调整位置
  nextTick(adjustPosition)
}
const renderMenuItems = (items: MenuItem[], isChildren: boolean = false) =>
  items.map((item) => (
    <li
      key={item.label}
      style={{ padding: '4px 10px', cursor: 'pointer', position: 'relative', whiteSpace: 'nowrap', width: `${state.size.width}px`, height: `${state.size.height}px`, display: isChildren ? 'none' : 'flex', alignItems: 'center', fontSize: '12px', color: '#333', borderRadius: '4px', margin: '2px 4px', transition: 'background-color 0.15s' }}
      onClick={() => {
        item.action?.()
        hide()
      }}
      onMouseenter={(e) => {
        ;(e.currentTarget as HTMLElement).style.backgroundColor = '#f0f0f0'
      }}
      onMouseleave={(e) => {
        ;(e.currentTarget as HTMLElement).style.backgroundColor = ''
      }}
    >
      {item.icon && <i class={`mdi ${item.icon}`} style={{ marginRight: '6px', fontSize: '14px', opacity: 0.7 }} />}
      {item.label}

      {item.children?.length && (
        <ul
          style={{
            position: 'absolute',
            top: 0,
            left: '100%',
            margin: 0,
            padding: '4px 0',
            listStyle: 'none',
            background: '#fff',
            border: '1px solid #e0e0e0',
            borderRadius: '6px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            zIndex: 9999,
          }}
        >
          {renderMenuItems(item.children, true)}
        </ul>
      )}
    </li>
  ))

// 菜单组件
const Menu = () => {
  if (!state.visible) return null
  return (
    <div
      style={{
        position: 'fixed',
        top: `${state.position.y}px`,
        left: `${state.position.x}px`,
        background: '#fff',
        border: '1px solid #e0e0e0',
        borderRadius: '6px',
        boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
        zIndex: 9999,
        padding: '4px 0',
        backdropFilter: 'blur(8px)',
      }}
      onClick={(e) => e.stopPropagation()}
    >
      <ul style={{ margin: 0, padding: 0, listStyle: 'none' }}>{renderMenuItems(state.items)}</ul>
    </div>
  )
}


// 响应式渲染一次即可
watchEffect(() => {
  render(Menu(), container)
})

// 全局点击隐藏
document.addEventListener('click', hide)

// 暴露给外部调用
export const useContextMenu = () => ({ show, hide })
