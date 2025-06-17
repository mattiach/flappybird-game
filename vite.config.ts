import { defineConfig } from 'vite';

// plugins
import { qwikVite } from '@builder.io/qwik/optimizer';
import tailwindcss from "@tailwindcss/vite";
import tsconfigPaths from 'vite-tsconfig-paths';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    tailwindcss(),
    qwikVite({
      csr: true,
    }),
    tsconfigPaths(),
  ],
  server: {
    port: 3000,
    strictPort: true,
  },
})
