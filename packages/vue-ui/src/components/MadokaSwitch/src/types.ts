// Codex 新增开始
import type { MadokaSwitchValue } from '../../../types'

export interface MadokaSwitchText {
  on: string
  off: string
}

export interface MadokaSwitchProps {
  disabled?: boolean
  text?: MadokaSwitchText
}

export interface MadokaSwitchEmits {
  (e: 'click', val: MadokaSwitchValue): void
  (e: 'change', val: MadokaSwitchValue): void
}
// Codex 新增结束
