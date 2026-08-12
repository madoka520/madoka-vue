export type MaybeFn<T, Args extends unknown[] = unknown[]> =
  | T
  | ((...args: Args) => T)

export const resolveMaybeFn = <T, Args extends unknown[] = unknown[]>(
  value: MaybeFn<T, Args>,
  ...args: Args
): T => {
  return typeof value === 'function'
    ? (value as (...args: Args) => T)(...args)
    : value
}

export const sleep = (timeout = 0): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, timeout))
}

// Codex 新增开始
export type MadokaEnumOption<T extends string | number = string | number> = {
  label: string
  value: T
}

export type RGBColor = [red: number, green: number, blue: number]
// Codex 新增结束

// 原代码 - Codex 保留
// export const enumToOptions = <T extends Record<string, string | number>>(value: T) => {
// Codex 新增开始
export const enumToOptions = <T extends Record<string, string | number>>(value: T): MadokaEnumOption<T[keyof T]>[] => {
// Codex 新增结束
  return Object.entries(value)
    .filter(([key]) => Number.isNaN(Number(key)))
    .map(([label, optionValue]) => ({ label, value: optionValue as T[keyof T] }))
}

// 原代码 - Codex 保留
// export const getRGB = (color: string): [number, number, number] | null => {
// Codex 新增开始
export const getRGB = (color: string): RGBColor | null => {
// Codex 新增结束
  const canvas = document.createElement('canvas')
  canvas.width = canvas.height = 1
  const context = canvas.getContext('2d')
  if (!context) return null

  context.fillStyle = '#000'
  context.fillStyle = color
  const computed = context.fillStyle
  if (
    computed === '#000000' &&
    color.toLowerCase() !== 'black' &&
    !color.startsWith('#000')
  ) {
    return null
  }

  context.fillRect(0, 0, 1, 1)
  const [red, green, blue] = context.getImageData(0, 0, 1, 1).data
  return [red, green, blue]
}
