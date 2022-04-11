import { defineComponent, h, ref } from 'vue-demi'
import type { RenderableComponent } from '@vueuse/core'
import { useSchemaOrgBreadcrumb } from './index'

export const SchemaOrgArticle = defineComponent<RenderableComponent>({
  name: 'SchemaOrgArticle',
  props: ['as', 'items'] as unknown as null,
  setup(props, { slots }) {
    const target = ref()
    useSchemaOrgBreadcrumb(props.items)

    return () => {
      if (!slots.default) {
        return null
      }
      return h(props.as || 'div', { ref: target }, [
        slots.default(),
      ])
    }
  },
})
