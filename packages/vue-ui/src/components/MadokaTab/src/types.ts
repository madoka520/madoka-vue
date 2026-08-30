// Codex 新增开始
import type { MadokaTabOption } from '../../../types'

export interface MadokaTabProps {
  options: readonly MadokaTabOption[]
  closeable?: boolean
}

export interface MadokaTabEmits {
  (e: 'close', tab: MadokaTabOption): void
}
// Codex 新增结束
