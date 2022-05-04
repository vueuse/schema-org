import {defineComponent, getCurrentInstance, h, onBeforeUnmount, Ref, ref, unref} from 'vue-demi'
import { injectSchemaOrg } from '../useSchemaOrg'
import type { ListItemInput } from '../shared/resolveListItems'
import { defineBreadcrumb } from './index'

export interface UseBreadcrumbsProps {
  as?: string
  value?: ListItemInput[]
}

export const SchemaOrgBreadcrumb = defineComponent<UseBreadcrumbsProps>({
  name: 'SchemaOrgBreadcrumb',
  props: [
    'as',
    'value',
  ] as unknown as undefined,
  setup(props, { slots }) {
    const schemaOrg = injectSchemaOrg()

    const breadcrumbItems: Ref<ListItemInput[]> = ref(props.value || [])

    const target = ref()

    const vm = getCurrentInstance()!
    const ctx = schemaOrg.setupRouteContext(vm)

    schemaOrg.addResolvedNodeInput(ctx, [
      defineBreadcrumb({
        itemListElement: unref(props.value)!,
      }),
    ])

    onBeforeUnmount(() => {
      schemaOrg.removeContext(ctx)
      schemaOrg.generateSchema()
    })

    return () => {
      if (!slots.default && !slots.item)
        return null

      return h(props.as || 'div', { ref: target }, [
        slots.default ? slots.default() : null,
        breadcrumbItems.value.map(item => slots.item ? slots.item({ item }) : null),
      ])
    }
  },
})
