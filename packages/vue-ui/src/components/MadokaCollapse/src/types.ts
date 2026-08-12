// Codex 新增开始
import type { InjectionKey } from 'vue'
import type { MadokaOptionValue } from '../../../types'

export type MadokaCollapseModelValue = MadokaOptionValue | MadokaOptionValue[]

export interface MadokaCollapseProps {
  accordion?: boolean
}

export interface MadokaCollapseItemProps {
  name: MadokaOptionValue
  title?: string
  disabled?: boolean
}

export interface MadokaCollapseContext {
  activeNames: () => MadokaCollapseModelValue
  handleItemClick: (name: MadokaOptionValue) => void
}

export const madokaCollapseContextKey: InjectionKey<MadokaCollapseContext> = Symbol('madokaCollapseContext')
// Codex 新增结束
