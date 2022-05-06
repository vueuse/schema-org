# API Core Reference

## @vueuse/schema-org

Functions exposed from the `@vueuse/schema-org` package.

### createSchemaOrg

- **Type:** `(userConfig: UserConfig, provider?: Provider) => Promise<UnlighthouseContext>`

  This is the entry point to using Unlighthouse, it will initialise Unlighthouse with the provided configuration and an optional provider.

  When no provider is given, a default provider is created which will try and resolve route definitions and URLs.

  ```ts
  import { createUnlighthouse } from '@unlighthouse/core'

  createUnlighthouse(
    // config
    { configFile: 'mysite.config.ts' },
    // provider
    { 
        name: 'custom',
        // some custom implementation to find the route definitions
        routeDefinitions: () => generateRouteDefinitions(),
    }
  )
  ```

### useSchemaOrg

- **Type:** `() => UnlighthouseContext`

  Unlighthouse makes use of a [composition API](https://github.com/unjs/unctx) to retain the core state. This allows you to access unlighthouse _anywhere_,
  which is great to avoid transferring state between your logic.

  ```ts
  import { useUnlighthouse } from '@unlighthouse/core'
  // access the lighthouse context, pick out the worker
  const { worker } = useUnlighthouse()
  // force whichever route matches home.md to be re-scanned
  worker.invalidateFile('/home.md')
  ```
