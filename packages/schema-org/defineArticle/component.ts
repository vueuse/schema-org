import { defineComponent, getCurrentInstance, h, onBeforeUnmount, ref, unref } from 'vue-demi'
import type { DeepPartial } from 'utility-types'
import { injectSchemaOrg } from '../useSchemaOrg'
import type { Article } from '.'
import { defineArticlePartial } from '.'

export interface UseArticleProps extends DeepPartial<Article> {
  as?: string
}

export const SchemaOrgArticle = defineComponent<UseArticleProps>({
  name: 'SchemaOrgArticle',
  setup(props, { slots, attrs }) {
    const schemaOrg = injectSchemaOrg()

    const target = ref()

    const vm = getCurrentInstance()!
    const ctx = schemaOrg.setupRouteContext(vm)

    schemaOrg.addResolvedNodeInput(ctx, [
      defineArticlePartial(unref(attrs)),
    ])

    onBeforeUnmount(() => {
      schemaOrg.removeContext(ctx)
      schemaOrg.generateSchema()
    })

    return () => {
      if (!slots.default)
        return null
      return h(props.as || 'div', { ref: target }, [
        slots.default ? slots.default({ props }) : null,
      ])
    }
  },
})
