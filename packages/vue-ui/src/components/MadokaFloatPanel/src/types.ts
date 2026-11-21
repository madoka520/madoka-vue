export interface MadokaFloatPanelProps {
  /** 是否显示 */
  visible?: boolean
  /** 展开卡宽度(默认 300px) */
  width?: string
  /** 卡片背景(默认暗色玻璃底) */
  background?: string
  /** 是否可拖动(默认 true;拖动会绕过 button/a/input 等交互元素) */
  draggable?: boolean
  /** 层级(默认 1200:常规内容之上、弹窗之下) */
  zIndex?: number
  /** Teleport 目标(默认 body) */
  teleport?: string
}

export interface MadokaFloatPanelEmits {
  (e: 'update:minimized', value: boolean): void
}
