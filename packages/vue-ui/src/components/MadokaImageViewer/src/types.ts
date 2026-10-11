export interface MadokaImageViewerImage {
  url: string
  name?: string
}

export interface MadokaImageViewerProps {
  images: MadokaImageViewerImage[]
  /** 点遮罩是否可关闭,默认 true */
  maskClosable?: boolean
}

export interface MadokaImageViewerEmits {
  (e: 'change', index: number): void
}
