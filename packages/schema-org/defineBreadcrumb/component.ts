import { computed, defineComponent, h, ref } from 'vue-demi'
import type { BreadcrumbItem } from 'vueuse-schema-org'
import { defineBreadcrumb, useSchemaOrg } from 'vueuse-schema-org'
import { useRoute, useRouter } from 'vue-router'
import { $URL, withTrailingSlash } from 'ufo'

export interface UseBreadcrumbsProps {
  as?: string
  items?: BreadcrumbItem[]
}

interface TraversePathTreeRuntime {
  /**
   * Whether we need to append a trailing slash to each path node.
   */
  trailingSlash?: boolean
  /**
   * The URL nodes found when traversing
   */
  nodes: string[]
}

/**
 * Steps through a URL removing the last segment each time, giving you a tree of urls leading up to the provided url.
 *
 * For example, the traversal for the URL /blog/article/my-long-article-title will be:
 * - /blog/article/my-long-article-title
 * - /blog/article
 * - /blog
 * - /
 */
export const traversePathTree = (url: string, runtime: TraversePathTreeRuntime = { nodes: [] }) => {
  const node = new $URL(url)
  // boot the trailing slash runtime so we can handle them properly
  if (typeof runtime.trailingSlash === 'undefined')
    runtime.trailingSlash = node.pathname.endsWith('/')
  // when we hit the root the path will be an empty string; we swap it out for a slash
  runtime.nodes.push(url || '/')

  const currentPathName = node.pathname
  // note: $URL will strip the leading slash
  const childNode = new $URL(url)
  childNode.pathname = currentPathName.substring(0, currentPathName.lastIndexOf('/'))
  // need to do another step on the slash if we're dealing with a trailing slash
  if (runtime.trailingSlash) {
    childNode.pathname = childNode.pathname.substring(0, childNode.pathname.lastIndexOf('/'))
    childNode.pathname = withTrailingSlash(childNode.pathname)
  }
  // if we still have a pathname and it's different, traverse
  // when it hits the root route the pathname will be empty so this avoids further recursion while avoiding infinite loops
  if (childNode.pathname !== currentPathName)
    traversePathTree(childNode.toString(), runtime)
  return runtime.nodes
}

export const SchemaOrgBreadcrumb = defineComponent<UseBreadcrumbsProps>({
  name: 'SchemaOrgBreadcrumb',
  props: [
    'as',
    'items',
  ] as unknown as undefined,
  setup(props, { slots }) {
    const breadcrumbItems = computed<BreadcrumbItem[]>(() => {
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
    })

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
