export type MadokaOptionValue = string | number

export interface MadokaOption {
  label: string
  value: MadokaOptionValue
  [key: string]: unknown
}

export interface MadokaTabOption {
  label: string
  value: MadokaOptionValue
}

export type MadokaInputValue = string | number | null
export type MadokaSwitchValue = boolean | 0 | 1
export type MadokaSlidebarItem = string | number
