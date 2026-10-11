export interface MadokaImageViewerImage {
  url: string
  name?: string
  /** 原始宽高:open 传来源时用于计算共享元素过渡的精确目标框 */
  width?: number
  height?: number
}

export interface MadokaImageViewerProps {
  images: MadokaImageViewerImage[]
  /** 点遮罩是否可关闭,默认 true */
  maskClosable?: boolean
}

export interface MadokaImageViewerEmits {
  (e: 'change', index: number): void
}
