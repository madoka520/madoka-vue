// Codex 新增开始
export type MadokaInputType = 'number' | 'text' | 'file' | 'textarea' | 'password'

export interface MadokaInputProps {
  placeholder?: string
  type?: MadokaInputType
  width?: string
  /** 背景色,默认半透明白(旧样式原意,原 rgba(255, 2555, 255) 系笔误从未生效) */
  background?: string
  /** 聚焦时背景色,默认 #fff5f8 */
  focusBackground?: string
  /** 边框色,默认 #ffb7d5 */
  borderColor?: string
  /** 文字色(兼作聚焦边框色),默认 #ff69b4 */
  color?: string
  /** placeholder 色,默认 #ffc4d5 */
  placeholderColor?: string
  /** 圆角(px),默认 8 */
  radius?: number
  /** 字号(px),默认 16 */
  fontSize?: number
  /** 边框粗细(px),默认 2 */
  borderWidth?: number
  /** textarea 最小高度(px),默认 150 */
  textareaMinHeight?: number
}
// Codex 新增结束
