// Codex 新增开始
import { reactive, toRefs } from 'vue'

const state = reactive({
  zIndex: 999999,
})

export default function useModalState() {
  return toRefs(state)
}
// Codex 新增结束
