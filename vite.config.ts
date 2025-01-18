import path from 'path';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

export default defineConfig({
  plugins: [
    dts({
      include: [
        'lib',
      ],
      exclude: [
        '**/*.test.ts',
      ],
    }),
  ],
  build: {
    copyPublicDir: false,
    lib: {
      entry: path.resolve(__dirname, 'lib/index.ts'),
      name: 'Markdown2HTML',
      fileName: format => format === 'es' ? 'index.js' : `index.${format}.js`,
    },
    rollupOptions: {
      external: [
        'dompurify',
        'marked',
      ],
      output: {
        globals: {
          dompurify: 'dompurify',
          marked: 'marked',
        },
      },
    },
  },
  resolve: {
    alias: {
      '~': path.resolve(__dirname, 'lib'),
    },
  },
});
