// Codex 新增开始
import type { Component } from 'vue'
import type { Variant } from './button'

export type MadokaButtonLegacyType = '1' | '2' | '3' | 'link'
export type MadokaButtonType = MadokaButtonLegacyType | (string & {})

export interface MadokaButtonProps {
  type: MadokaButtonType
  color?: string
  disabled?: boolean
  variant?: Variant
}

export interface MadokaButtonSkinBaseProps {
  text?: string
}

export interface MadokaButtonPrimaryProps extends MadokaButtonSkinBaseProps {
  color?: string
  variant?: Variant
  radius?: number
}

export interface MadokaButtonSubmitProps extends MadokaButtonSkinBaseProps {}

export interface MadokaButtonOutlineProps extends MadokaButtonSkinBaseProps {
  color?: string
}

export interface MadokaButtonLinkProps {
  label?: string
  href?: string
  target?: '_blank' | '_self'
  disabled?: boolean
}

// Codex 新增开始
// Glow 皮肤(type="4"):透明直角细边框 + hover 同色光晕
export interface MadokaButtonGlowProps extends MadokaButtonSkinBaseProps {
  color?: string
  /** 文字色,默认白色(Glow 半透明底在暗色宿主上成立;亮色宿主传深色) */
  textColor?: string
}
// Codex 新增结束

export interface MadokaButtonEmits {
  (e: 'click', event: MouseEvent): void
}

export type MadokaButtonResolvedComponent = string | Component
// Codex 新增结束
