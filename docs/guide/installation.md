# Installation

## Install

Using Nuxt? Check out [nuxt-schema-org](/guide/nuxt-installation.md).

```bash
# NPM
npm install -D @vueuse/schema-org
# or Yarn
yarn add -D @vueuse/schema-org
# or PNPM
pnpm add -D @vueuse/schema-org
```

# Vite Usage

Register the Vue plugin:

```ts
import { createApp } from 'vue'
import { createSchemaOrg } from '@vueuse/schema-org'

const app = createApp()
const schemaOrg = createSchemaOrg({
  // providing a host is required for SSR
  canoicalHost: 'https://example.com',
})

app.use(schemaOrg)

app.mount('#app')
```
