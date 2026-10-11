// Codex 新增开始
export interface MadokaMaskProps {
  maskClosable?: boolean
  beforeClose?: () => void | Promise<void>
  /** 遮罩背景色,默认 rgba(0, 0, 0, 0.5) */
  maskBackground?: string
  /** 遮罩毛玻璃强度(px),默认 0 不启用 */
  maskBlur?: number
}

export interface MadokaMaskEmits {
  (e: 'cancel', event: Event): void
}
// Codex 新增结束
