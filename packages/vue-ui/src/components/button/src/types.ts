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

export interface MadokaButtonEmits {
  (e: 'click', event: MouseEvent): void
}

export type MadokaButtonResolvedComponent = string | Component
// Codex 新增结束
