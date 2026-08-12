// modal.tsx
import { reactive, createVNode, render } from "vue"
import type { JSX } from "vue/jsx-runtime"
import MadokaDialog from './MadokaDialog/src/Index.vue'
import { message } from './message'

// 原代码 - Codex 保留
// type ConfirmOptions = {
// Codex 新增开始
export type MadokaModalConfirmOptions = {
// Codex 新增结束
  width?: string
  title?: string
  content?: JSX.Element | string
  // 原代码 - Codex 保留
  // onOk?: () => void
  // Codex 新增开始
  onOk?: () => void | Promise<void>
  // Codex 新增结束
  onCancel?: () => void
  hiddenCancel?: boolean
  okText?: string
  footer?: JSX.Element | string
}

export default (() => {
  // 原代码 - Codex 保留
  // const confirm = (options: ConfirmOptions) => {
  // Codex 新增开始
  const confirm = (options: MadokaModalConfirmOptions) => {
  // Codex 新增结束
    // Codex 新增开始
    if (typeof document === 'undefined') return
    // Codex 新增结束
    const state = reactive({
      visible: false, // ⚠️ 一定是 false
      title: options.title ?? "",
      content: options.content ?? null,
      onOk: options.onOk,
      onCancel: options.onCancel,
    })

    const container = document.createElement("div")
    document.body.appendChild(container)

    const close = () => {
      state.visible = false
      setTimeout(() => {
        render(null, container)
        container.remove()
      }, 300)
    }

    const vnode = createVNode(() => (
      <MadokaDialog
        v-model={state.visible}
        title={state.title}
        okText={options.okText}
        width={options.width}
        hiddenCancel={options.hiddenCancel}
        onOk={async () => {
          try {
            await state.onOk?.()
            close()
          } catch (error: any) {
            if (error.message) message.error(error.message)
          }
        }}
        onCancel={() => {
          state.onCancel?.()
          close()
        }}
      >
        {{
          default: state.content,
          footer: () => options.footer,
        }}
      </MadokaDialog>
    ))

    render(vnode, container)

    // ⚠️ 关键：等组件真正挂载后，再打开
    queueMicrotask(() => {
      state.visible = true
    })
  }

  // 原代码 - Codex 保留
  // const info = (options: Omit<ConfirmOptions, "onCancel">) => {
  // Codex 新增开始
  const info = (options: Omit<MadokaModalConfirmOptions, "onCancel">) => {
  // Codex 新增结束
    confirm({
      ...options,
      hiddenCancel: true,
      okText: "知道了",
    })
  }

  return {
    confirm,
    info
  }
})()
