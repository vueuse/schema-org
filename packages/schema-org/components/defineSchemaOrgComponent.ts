import { computed, defineComponent, h, ref, unref } from 'vue-demi'
import type { Ref, VNode } from 'vue-demi'
import type { SchemaNode } from '../types'
import { useSchemaOrg } from '../useSchemaOrg'
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

export const defineSchemaOrgComponent = (name: string, defineFn?: (data: any) => any) => {
  return defineComponent<SchemaOrgComponentProps>({
    name,
    props: {
      as: String,
      renderScopedSlots: Boolean,
    } as unknown as any,
    setup(props, { slots, attrs }) {
      const node: Ref<SchemaNode | null> = ref(null)

      const nodePartial = computed(() => {
        const val: Record<string, any> = {}
        Object.entries(unref(attrs)).forEach(([key, value]) => {
          if (!ignoreKey(key)) {
            // keys may be passed with kebab case, and they aren't transformed
            val[fixKey(key)] = value
          }
        })
        // only render vnodes while we don't have a node
        if (!node.value) {
          // iterate through slots
          for (const [key, slot] of Object.entries(slots)) {
            if (!slot || key === 'default')
              continue
            // allow users to provide data via slots that aren't rendered
            val[fixKey(key)] = shallowVNodesToText(slot(props) as VNode[])
          }
        }
        return val
      })

      // may not be available
      if (schemaApi) {
        // register via main schema composable for route watching
        useSchemaOrg([
          defineFn(unref(nodePartial)),
        ])
      }

      return () => {
        const data = unref(nodePartial)
        // renderless component
        if (!slots.default && !props.renderScopedSlots)
          return null
        const childSlots = []
        if (slots.default)
          childSlots.push(slots.default(data))
        if (props.renderScopedSlots) {
          for (const [key, slot] of Object.entries(slots)) {
            if (slot && key !== 'default')
              childSlots.push(slot(data))
          }
        }
        return h(props.as || 'div', {}, childSlots)
      }
    },
  })
}
