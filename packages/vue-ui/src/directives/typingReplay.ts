import type { Directive } from 'vue'

// Codex 新增开始
export type MadokaTypingReplayOp =
  | { t: number; type: 'insert'; value: string }
  | { t: number; type: 'delete' }

type State = {
  ops: MadokaTypingReplayOp[]
  start: number
  timers: number[]
  last: number
}

export type MadokaTypingReplayExposed = {
  consume: () => MadokaTypingReplayOp[]
}

const madokaTypingReplay: Directive = {
  mounted(el, binding) {
    if (binding.arg === 'record') {
      initRecord(el)
    } else {
      play(el, binding.value)
    }
  },

  updated(el, binding) {
    if (binding.arg !== 'record') {
      if (binding.value !== binding.oldValue) {
        play(el, binding.value)
      }
    }
  },

  unmounted(el) {
    clearTimers(el)
  },
}

const initRecord = (el: HTMLElement) => {
  const state: State = {
    ops: [],
    start: 0,
    last: 0,
    timers: [],
  }

  let composing = false
  el.addEventListener('compositionstart', () => {
    composing = true
  })

  el.addEventListener('compositionend', (e: any) => {
    composing = false

    if (!state.start) state.start = Date.now()

    if (e.data) {
      state.ops.push({
        t: Date.now() - state.start,
        type: 'insert',
        value: e.data,
      })
    }
  })

  // ⭐ 挂到 DOM（核心）
  ;(el as any)._typingReplay = {
    consume: () => {
      const res = state.ops.slice()
      state.ops.length = 0
      state.start = 0
      return res
    },
  } as MadokaTypingReplayExposed

  el.addEventListener('keydown', (e: any) => {
    if (!state.start) state.start = Date.now()

    if (e.key === 'Backspace') {
      state.ops.push({
        t: Date.now() - state.start,
        type: 'delete',
      })
    }
  })

  el.addEventListener('input', (e: any) => {
    if (composing) return

    const now = Date.now()

    if (!state.start) {
      state.start = now
      state.last = now
    }

    const delta = now - state.last
    state.last = now

    // ⭐ 插入（必须过滤 null）
    if (e.inputType === 'insertText' && e.data != null) {
      state.ops.push({
        t: (state.ops.at(-1)?.t || 0) + Math.min(delta, 3000),
        type: 'insert',
        value: e.data,
      })
    }
  })
}

const play = (el: HTMLElement, ops: MadokaTypingReplayOp[] = []) => {
  if (!ops || !ops.length) {
    // ⭐ 没有 ops → 保留原内容
    return
  }

  // ⭐ 开始时加 class
  el.classList.add('typing')

  clearTimers(el)

  let text = ''
  const start = ops[0]?.t ?? 0
  const timers: number[] = []

  // ⭐ 核心新增：基于“间隔”而不是“绝对时间”
  const MAX_GAP = 800
  let prev = start
  let delayAcc = 0

  ops.forEach((op, index) => {
    const gap = op.t - prev
    const delay = Math.min(gap, MAX_GAP)

    prev = op.t
    delayAcc += delay

    const timer = window.setTimeout(() => {
      if (op.type === 'insert') {
        text += op.value
      } else {
        text = text.slice(0, -1)
      }

      el.innerText = text

      // ⭐ 最后一个操作 → 移除 class
      if (index === ops.length - 1) {
        el.classList.remove('typing')
      }
    }, delayAcc)

    timers.push(timer)
  })
  ;(el as any)._typingTimers = timers
}

const clearTimers = (el: HTMLElement) => {
  const timers: number[] = (el as any)._typingTimers || []
  timers.forEach(clearTimeout)
  ;(el as any)._typingTimers = []
}

export default madokaTypingReplay
// Codex 新增结束
