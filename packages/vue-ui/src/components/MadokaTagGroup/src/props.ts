// =========start==========
// 标签胶囊组:胶囊数据(名称 + 可选计数)
export interface MadokaTagItem {
  name: string
  /** 引用计数,传入则显示为胶囊右侧角标 */
  count?: number
}

export interface MadokaTagGroupProps {
  tags?: MadokaTagItem[]
  /** 禁用项名称(功能性标签等):不可选中,展示为禁用态 */
  disabledNames?: string[]
  /** 胶囊背景,默认透明 */
  background?: string
  /** 边框色,默认 #e0e0e0 */
  borderColor?: string
  /** 选中态边框色,默认 #ffb7d5 */
  activeBorderColor?: string
  /** 选中态背景,默认 rgba(255, 183, 213, 0.2) */
  activeBackground?: string
  /** 文字色,默认 #444 */
  color?: string
  /** 选中态文字色,默认 #d6336c */
  activeColor?: string
  /** 计数角标文字色,默认 #ffb7d5 */
  countColor?: string
  /** 圆角(px),默认 4 */
  radius?: number
  /** 字号(px),默认 12 */
  fontSize?: number
  /** 空态文案,默认 暂无标签 */
  emptyText?: string
}
// ========end========
