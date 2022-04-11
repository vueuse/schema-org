import { defineComponent, h, ref } from 'vue-demi'
import type { RenderableComponent } from '@vueuse/core'
import { useSchemaOrgBreadcrumb } from './index'

export const SchemaOrgBreadcrumb = defineComponent<RenderableComponent>({
  name: 'SchemaOrgBreadcrumb',
  props: ['as', 'items'] as unknown as null,
  setup(props, { slots }) {
    const target = ref()
    useSchemaOrgBreadcrumb(props.items)

    return () => {
      if (!slots.default && !slots.item) {
        return null
      }
      return h(props.as || 'div', { ref: target }, [
        slots.default ? slots.default() : null,
        props.items.map(item => slots.item({ ...item }))
      ])
    }
  },
})
