import { defineComponent, h, ref } from 'vue-demi'
import { useSchemaOrg } from '../useSchemaOrg'
import type { BreadcrumbItem } from './index'
import { defineBreadcrumb } from './index'

export interface UseBreadcrumbsProps {
  as?: string
  items?: BreadcrumbItem[]
}

export const SchemaOrgBreadcrumb = defineComponent<UseBreadcrumbsProps>({
  name: 'SchemaOrgBreadcrumb',
  props: [
    'as',
    'items',
  ] as unknown as undefined,
  setup(props, { slots }) {
    /* const breadcrumbItems = computed<BreadcrumbItem[]>(() => {
      // if items aren't provided we can try and generate them ourselves
      if (props.items) { return props.items }
      else {
        const currentRoute = useRoute()
        const routes = useRouter().getRoutes()

        return traversePathTree(currentRoute.path)
          .map((path) => {
            const route = routes.find(r => r.path === path)
            if (!route?.meta.title)
              return false
            const isActive = currentRoute.path === route.path
            return {
              name: route.meta.title,
              item: isActive ? '' : route.path,
              link: route.path,
              isActive,
            }
          })
          .filter(n => !!n)
          .reverse() as BreadcrumbItem[]
      }
    }) */

    const breadcrumbItems = ref(props.items || [])

    const target = ref()
    useSchemaOrg([
      defineBreadcrumb({
        itemListElement: breadcrumbItems.value.map((i) => {
          const item: Partial<BreadcrumbItem> = {
            name: i.name,
          }
          if (i.item)
            item.item = i.item
          return item as BreadcrumbItem
        }),
      }),
    ])

    return () => {
      if (!slots.default && !slots.item)
        return null
      if (breadcrumbItems.value.length <= 1)
        return null

      return h(props.as || 'div', { ref: target }, [
        slots.default ? slots.default() : null,
        breadcrumbItems.value.map(item => slots.item ? slots.item({ ...item }) : null),
      ])
    }
  },
})
