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
  props: [
    'as',
  ] as unknown as undefined,
  setup(props, { slots }) {
    const schemaOrg = injectSchemaOrg()

    const target = ref()

    const vm = getCurrentInstance()!
    const ctx = schemaOrg.setupRouteContext(vm)

    schemaOrg.addResolvedNodeInput(ctx, [
      defineArticlePartial(unref(props)),
    ])

    onBeforeUnmount(() => {
      schemaOrg.removeContext(ctx)
      schemaOrg.generateSchema()
    })

    return () => {
      return h(props.as || 'div', { ref: target }, [
        slots.default ? slots.default({ props }) : null,
      ])
    }
  },
})
