## Install Dependencies:

```npm install```

## Create Vite Config File (vite.config.js):

```import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import polyfillNode from 'rollup-plugin-polyfill-node';

export default defineConfig({
  plugins: [react(), polyfillNode()],
  define: {
    global: 'globalThis',
  },
});
```
## Install rollup-plugin-polyfill-node:
```npm install --save-dev rollup-plugin-polyfill-node```

## Start Development Server:

``` npm run dev ```
