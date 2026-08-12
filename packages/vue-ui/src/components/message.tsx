// MadokaMessage.tsx
import { h, render, ref, type Ref } from "vue"

// 类型定义
// 原代码 - Codex 保留
// type MessageType = "success" | "info" | "error" | "warn"
// Codex 新增开始
export type MadokaMessageType = "success" | "info" | "error" | "warn"
// Codex 新增结束

// 原代码 - Codex 保留
// interface MessageOptions {
//   text: string
//   type?: MessageType
//   duration?: number
// }
// Codex 新增开始
export interface MadokaMessageOptions {
  text: string
  type?: MadokaMessageType
  duration?: number
  offset?: number
  zIndex?: number
}

export type MadokaMessageClose = () => void
// Codex 新增结束

// 存放当前消息节点
const messages: HTMLElement[] = []

// 原代码 - Codex 保留
// const icons: Record<MessageType, string> = {
// Codex 新增开始
const icons: Record<MadokaMessageType, string> = {
// Codex 新增结束
  success: "mdi-check-circle",
  info: "mdi-information",
  error: "mdi-alert-circle",
  warn: "mdi-alert",
}

// 核心创建消息函数
// 原代码 - Codex 保留
// const createMessage = (options: MessageOptions) => {
//   const { text, type = "info", duration = 2000 } = options
// Codex 新增开始
const createMessage = (options: MadokaMessageOptions): MadokaMessageClose => {
  // 原代码 - Codex 保留
  // if (typeof document === 'undefined') return
  // Codex 新增开始
  if (typeof document === 'undefined') return () => {}
  // Codex 新增结束
  const { text, type = "info", duration = 2000, offset = 20, zIndex = 999999999 } = options
// Codex 新增结束
  const container = document.createElement("div")
  container.style.position = "fixed"
  // 原代码 - Codex 保留
  // container.style.top = "20px"
  // Codex 新增开始
  container.style.top = offset + "px"
  // Codex 新增结束
  container.style.left = "50%"
  container.style.transform = "translateX(-50%)"
  // 原代码 - Codex 保留
  // container.style.zIndex = "999999999"
  // Codex 新增开始
  container.style.zIndex = String(zIndex)
  // Codex 新增结束
  document.body.appendChild(container)

  const visible: Ref<boolean> = ref(true)

  const vnode = (
    <div
      class={`madoka-message ${type}`}
      style={{
        opacity: visible.value ? 1 : 0,
        transition: "all 0.3s",
        marginTop: messages.length * 60 + "px",
        display: "flex",
        alignItems: "center",
        padding: "10px 16px",
        borderRadius: "8px",
        color: "#fff",
        fontWeight: 500,
        backgroundColor: type === "success" ? "#ffb6c1" : type === "error" ? "#ff6961" : type === "info" ? "#87cefa" : "#ffa500",
      }}
    >
      <i class={`mdi ${icons[type]}`} style={{ marginRight: "8px" }}></i>
      <span>{text}</span>
    </div>
  )

  render(vnode, container)
  messages.push(container)

  // 原代码 - Codex 保留
  // setTimeout(() => {
  //   visible.value = false
  //   render(null, container)
  //   container.remove()
  //   messages.splice(messages.indexOf(container), 1)
  // }, duration)
  // Codex 新增开始
  const close = () => {
    visible.value = false
    render(null, container)
    container.remove()
    messages.splice(messages.indexOf(container), 1)
  }

  window.setTimeout(close, duration)
  return close
  // Codex 新增结束
}

// 全局方法封装
export const message = {
  // Codex 新增开始
  open: createMessage,
  // Codex 新增结束
  success: (text: string, duration?: number) => createMessage({ text, type: "success", duration }),
  info: (text: string, duration?: number) => createMessage({ text, type: "info", duration }),
  error: (text: string, duration?: number) => createMessage({ text, type: "error", duration }),
  warn: (text: string, duration?: number) => createMessage({ text, type: "warn", duration }),
}
