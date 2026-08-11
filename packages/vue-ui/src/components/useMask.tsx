// modal.tsx
import { createVNode, reactive, render } from 'vue'
import type { JSX } from 'vue/jsx-runtime'
// 原代码 - Codex 保留
// import MadokaMask from '@/components/MadokaMask.vue'
// Codex 新增开始
import MadokaMask from './MadokaMask.vue'
// Codex 新增结束

export default (content: JSX.Element | (() => JSX.Element) | string) => {
  const state = reactive({
    visible: false, // ⚠️ 一定是 false
    content: content ?? null,
  })

  const container = document.createElement('div')
  document.body.appendChild(container)

  const vnode = createVNode(() => (
    <MadokaMask
      v-model={state.visible}
      onUpdate:modelValue={(v: boolean) => {
        state.visible = v

        if (!v) {
          render(null, container)
          container.remove()
        }
      }}
    >
      {{
        default: (
          <div style={{ left: '50%', top: '50%', transform: 'translate(-50%, -50%)', position: 'fixed' }}>
            {state.visible && (typeof state.content === 'function' ? state.content() : state.content)}
          </div>
        ),
      }}
    </MadokaMask>
  ))
  render(vnode, container)

  // ⚠️ 关键：等组件真正挂载后，再打开
  queueMicrotask(() => {
    state.visible = true
  })

  return () => {
    state.visible = false
  }
}
