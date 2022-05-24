import { defineComponent, getCurrentInstance, h, onBeforeUnmount, ref, unref } from 'vue'
import type { VNode } from 'vue'
import type { SchemaNode } from '../types'
import { injectSchemaOrg } from '../useSchemaOrg'
import { shallowVNodesToText } from '../utils'

export interface SchemaOrgComponentProps {
  as?: string
  renderScopedSlots?: boolean
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
    props: {
      as: String,
      renderScopedSlots: Boolean,
    } as unknown as any,
    setup(props, { slots, attrs }) {
      const client = injectSchemaOrg()
      if (!client) {
        // never resolves, never hydrates
        return () => {
          return new Promise(() => {})
        }
      }

      const target = ref()

      let node: SchemaNode | undefined | null

      const vm = getCurrentInstance()!
      const ctx = client.setupRouteContext(vm.uid)

      const nodePartial: Record<string, any> = {}
      Object.entries(unref(attrs)).forEach(([key, value]) => {
        if (!ignoreKey(key)) {
          // keys may be passed with kebab case and they aren't transformed
          nodePartial[fixKey(key)] = value
        }
      })

      onBeforeUnmount(() => {
        client.removeContext(ctx)
        client.generateSchema()
      })

      return () => {
        if (!node) {
          // iterate through slots
          for (const [key, slot] of Object.entries(slots)) {
            if (!slot || key === 'default')
              continue
            // allow users to provide data via slots that aren't rendered
            nodePartial[fixKey(key)] = shallowVNodesToText(slot({ ...props, ...Object.entries(node || {}) }) as VNode[])
          }
          const ids = client.addNodesAndResolveRelations(ctx, [
            defineFn(nodePartial),
          ])
          node = client.findNode([...ids.values()][0])
          client.generateSchema()
        }
        if (!slots.default && !props.renderScopedSlots)
          return null
        const childSlots = [
          slots.default ? slots.default({ ...node }) : null,
        ]
        if (props.renderScopedSlots) {
          for (const [key, slot] of Object.entries(slots)) {
            if (!slot || key === 'default')
              continue
            childSlots.push(slot({ ...props, ...Object.entries(node || {}) }))
          }
        }
        return h(props.as || 'div', { ref: target }, childSlots)
      }
    },
  })
}
