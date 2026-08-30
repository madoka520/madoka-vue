import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'
import AutoImport from 'unplugin-auto-import/vite'
import { resolve } from 'node:path'
// Codex 新增开始
// message/useModal/useContextMenu/useMask 等 .tsx 需要 Vue JSX 转换，
// 否则 esbuild 默认按 React JSX 编译，产物错误引用 React.createElement
import vueJsx from '@vitejs/plugin-vue-jsx'
// Codex 新增结束

export default defineConfig({
  plugins: [
    vue(),
    // Codex 新增开始
    vueJsx(),
    // Codex 新增结束
    AutoImport({
      // 原代码 - Codex 保留
      // imports: ['vue'],
      // Codex 新增开始
      imports: ['vue', '@vueuse/core'],
      // Codex 新增结束
      dts: 'auto-imports.d.ts',
    }),
  ],
  build: {
    minify: false,
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'MadokaVueUi',
      fileName: 'vue-ui',
      formats: ['es'],
    },
    rollupOptions: {
      external: ['vue'],
      output: {
        globals: { vue: 'Vue' },
      },
    },
  },
})
