// Codex 新增开始
export interface MadokaDialogProps {
  width?: string
  height?: string
  footer?: boolean
  title?: string
  okText?: string
  cancelText?: string
  unuseModel?: boolean
  background?: string
  hiddenCancel?: boolean
}

export interface MadokaDialogEmits {
  (e: 'cancel', event?: Event): void
  (e: 'ok', event: Event): void
}
// Codex 新增结束
