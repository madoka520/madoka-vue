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
  // Codex 新增开始 (2026-11-05 可配置外观,勾选定稿 radius/border/theme/shadow)
  /** 圆角;数字按 px,字符串原样(如 '12px' / '50%');默认 0(直角,2026-09 默认形态) */
  radius?: number | string
  /** 边框:false 完全关闭;字符串=颜色(默认 1.5px);对象={ color, width } 逐项配;默认 1.5px 细粉边框 */
  border?: false | string | { color?: string; width?: number }
  /** 主题预设:'dark' | 'light' 整套联动(底色+标题/内容文字色);显式 background 优先于预设底色 */
  theme?: 'dark' | 'light'
  /** 阴影光晕:false 或 'none' 关闭;字符串=完整 CSS box-shadow 值;对象={ color, strength } 按色生成三层光晕,strength(默认 1)缩放扩散半径;默认三层粉晕 */
  shadow?: false | string | { color?: string; strength?: number }
  // Codex 新增结束
  // Codex 新增开始
  /** 遮罩背景色;默认 rgba(0, 0, 0, 0.35),配合 maskBlur 让壁纸柔化退后 */
  maskBackground?: string
  /** 遮罩高斯模糊半径(px),默认 6;传 0 关闭模糊 */
  maskBlur?: number
  // Codex 新增结束
  hiddenCancel?: boolean
  /** 确定按钮 loading 态(旋转图标+禁用);useModal.confirm 在 onOk 异步时自动驱动 */
  okLoading?: boolean
}

export interface MadokaDialogEmits {
  (e: 'cancel', event?: Event): void
  (e: 'ok', event: Event): void
}
// Codex 新增结束
