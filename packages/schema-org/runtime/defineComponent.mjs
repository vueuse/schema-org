import { useSchemaOrg } from '#useSchemaOrg/exports'

const shallowVNodesToText = (nodes) => {
  let text = ''
  for (const node of nodes) {
    if (typeof node.children === 'string')
      text += node.children.trim()
  }
  return text
}

const fixKey = (s) => {
  // kebab case to camel case
  let key = s.replace(/-./g, x => x[1].toUpperCase())
  // supports @type & @id
  if (key === 'type' || key === 'id')
    key = `@${key}`
  return key
}

const ignoreKey = (s) => {
  // pretty hacky, need to setup all props
  if (s.startsWith('aria-') || s.startsWith('data-'))
    return false

  return ['class', 'style'].includes(s)
}

export const defineSchemaOrgComponent = (name, defineFn) => {
  return defineComponent({
    name,
    props: {
      as: String,
      renderScopedSlots: Boolean,
    },
    setup(props, { slots, attrs }) {
      console.log(name, props, attrs)
      const node = ref(null)

      const nodePartial = computed(() => {
        const val = {}
        Object.entries(unref(attrs)).forEach(([key, value]) => {
          if (!ignoreKey(key)) {
            // keys may be passed with kebab case, and they aren't transformed
            val[fixKey(key)] = unref(value)
          }
        })
        // only render vnodes while we don't have a node
        if (!node.value) {
          // iterate through slots
          for (const [key, slot] of Object.entries(slots)) {
            if (!slot || key === 'default')
              continue
            // allow users to provide data via slots that aren't rendered
            val[fixKey(key)] = shallowVNodesToText(slot(props))
          }
        }
        return val
      })

      console.log(nodePartial, defineFn)

      // may not be available
      if (defineFn) {
        // register via main schema composable for route watching
        useSchemaOrg([defineFn(unref(nodePartial))])
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
