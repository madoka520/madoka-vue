// Codex 新增开始
import type { MadokaOption } from '../../../types'

export interface MadokaSelectProps {
  options: MadokaOption[]
  labelName?: string
  valueName?: string
  /** 触发器背景色,默认 #fff */
  background?: string
  /** 边框色,默认 #e0e0e0 */
  borderColor?: string
  /** 展开态边框色,默认 #ffb7d5 */
  activeBorderColor?: string
  /** 文字色,默认 #444 */
  color?: string
  /** 圆角(px),默认 8 */
  radius?: number
  /** 字号(px),默认 14 */
  fontSize?: number
  /** 边框粗细(px),默认 1.5 */
  borderWidth?: number
  /** 下拉菜单背景(设半透明自动获得毛玻璃),默认 #fff */
  menuBackground?: string
  /** 菜单条目悬停背景,默认 #fff5f8 */
  hoverBackground?: string
  /** 菜单条目悬停/选中文字色,默认 #ffb7d5 */
  hoverColor?: string
  // ========start======== 多选模式(标签筛选条「更多」等场景):
  // 值为数组,点选在菜单里勾选/取消,菜单不自动关;默认 false 保持单选行为
  multiple?: boolean
  /** 未选中时触发器文案,默认 '请选择' */
  placeholder?: string
  /** 触发器前缀图标(mdi 类名),如 'mdi-dots-horizontal' */
  triggerPrefixIcon?: string
  /** 组件宽度(任意 CSS 宽度值,含 'auto'),默认 '200px' */
  width?: string
  // ========end========
}
// Codex 新增结束
