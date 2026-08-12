// Codex 新增开始
export interface MadokaMaskProps {
  maskClosable?: boolean
  beforeClose?: () => void | Promise<void>
}

export interface MadokaMaskEmits {
  (e: 'cancel', event: Event): void
}
// Codex 新增结束
