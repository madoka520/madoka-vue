// Codex 新增开始
export interface MadokaDialogProps {
  width?: string
  height?: string
  /** 最大高度,超出后内容区(main)内部滚动;默认 86vh */
  maxHeight?: string
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
