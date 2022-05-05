import { defineComponent, getCurrentInstance, h, onBeforeUnmount, ref, unref } from 'vue-demi'
import type { VNode } from 'vue'
import type { SchemaNode } from '../types'
import { injectSchemaOrg } from '../useSchemaOrg'
import { shallowVNodesToText } from '../utils'

export interface SchemaOrgComponentProps {
  as?: string
}

const fixKey = (s: string) => {
  // kebab case to camel case
  let key = s.replace(/-./g, x => x[1].toUpperCase())
  // supports @type & @id
  if (key === 'type' || key === 'id')
    key = `@${key}`
  return key
}

const ignoreKey = (s: string) => {
  // pretty hacky, need to setup all props
  if (s.startsWith('aria-') || s.startsWith('data-'))
    return false

  return ['class', 'style'].includes(s)
}

export const defineSchemaOrgComponent = (name: string, defineFn: (data: any) => any) => {
  return defineComponent<SchemaOrgComponentProps>({
    name,
    setup(props, { slots, attrs }) {
      const schemaOrg = injectSchemaOrg()

      const target = ref()

      let node: SchemaNode | undefined | null

      const vm = getCurrentInstance()!
      const ctx = schemaOrg.setupRouteContext(vm)

      const nodePartial: Record<string, any> = {}
      Object.entries(unref(attrs)).forEach(([key, value]) => {
        if (!ignoreKey(key)) {
          // keys may be passed with kebab case and they aren't transformed
          nodePartial[fixKey(key)] = value
        }
      })

      onBeforeUnmount(() => {
        schemaOrg.removeContext(ctx)
        schemaOrg.generateSchema()
      })

      return () => {
        if (!node) {
          // iterate through slots
          for (const [key, slot] of Object.entries(slots)) {
            if (!slot || key === 'default')
              continue
            // allow users to provide data via slots that aren't rendered
            nodePartial[fixKey(key)] = shallowVNodesToText(slot({ props }) as VNode[])
          }
          const ids = schemaOrg.addResolvedNodeInput(ctx, [
            defineFn(nodePartial),
          ])
          node = schemaOrg.findNode([...ids.values()][0])
          schemaOrg.generateSchema()
        }
        if (!slots.default)
          return null
        return h(props.as || 'div', { ref: target }, [
          slots.default ? slots.default({ ...node }) : null,
        ])
      }
    },
  })
}
