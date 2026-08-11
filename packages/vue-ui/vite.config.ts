import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'
import AutoImport from 'unplugin-auto-import/vite'
import { resolve } from 'node:path'

export default defineConfig({
  plugins: [
    vue(),
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
      name: 'MadokaPreUi',
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
