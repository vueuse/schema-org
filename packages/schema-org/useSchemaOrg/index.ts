import { getCurrentInstance, inject, onMounted } from 'vue-demi'
import type { Thing } from 'schema-org-graph-js'
import type { SchemaOrgClient } from '../createSchemaOrg'
import { PROVIDE_KEY } from '../createSchemaOrg'

export function injectSchemaOrg() {
  const schemaOrg = inject<SchemaOrgClient>(PROVIDE_KEY)

  if (!schemaOrg)
    throw new Error('[@vueuse/schema-org] Failed to find plugin, you may have forgotten to apply app.use(schemaOrg)')

  return schemaOrg
}

export function useSchemaOrg<T extends Thing | any[]>(input: T) {
  let client: SchemaOrgClient
  try {
    client = injectSchemaOrg()
  }
  catch (e) {}
  // @ts-expect-error lazy types
  if (!client)
    return

  const vm = getCurrentInstance()

  // SSR Mode
  if (typeof window === 'undefined') {
    if (vm?.uid)
      client.ctx._ctxUid = vm?.uid

    client.ctx.addNode(input)
    return
  }

  if (vm?.uid)
    client.ctx._ctxUid = vm.uid

  if (!client.serverRendered) {
    // initial state will be correct from server, only need to watch for route changes to re-compute
    client.ctx.addNode(input)
  }

  onMounted(() => {
    client.generateSchema()
  })
  // if we should client side rendered, we may not need to
  // @todo handle true SSR mode
}
