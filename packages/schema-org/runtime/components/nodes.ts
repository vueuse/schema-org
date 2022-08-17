import { computed, defineComponent, h, ref, unref } from 'vue'
// @ts-expect-error untyped
import { defineArticle, defineBreadcrumb, defineComment, defineEvent, defineHowTo, defineImage, defineLocalBusiness, defineOrganization, definePerson, defineProduct, defineQuestion, defineRecipe, defineReview, defineVideo, defineWebPage, defineWebSite } from '#vueuse/schema-org/provider'
// @ts-expect-error untyped
import { useSchemaOrg } from '#vueuse/schema-org/runtime'

const shallowVNodesToText = (nodes: any) => {
  let text = ''
  for (const node of nodes) {
    if (typeof node.children === 'string')
      text += node.children.trim()
  }
  return text
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

export const defineSchemaOrgComponent = (name: string, defineFn: (input: any) => any) => {
  return defineComponent({
    name,
    props: {
      as: String,
      renderScopedSlots: Boolean,
    },
    setup(props, { slots, attrs }) {
      const node = ref(null)

      const nodePartial = computed(() => {
        const val: Record<string, any> = {}
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

export const SchemaOrgArticle = defineSchemaOrgComponent('SchemaOrgArticle', defineArticle)
export const SchemaOrgBreadcrumb = defineSchemaOrgComponent('SchemaOrgBreadcrumb', defineBreadcrumb)
export const SchemaOrgComment = defineSchemaOrgComponent('SchemaOrgComment', defineComment)
export const SchemaOrgEvent = defineSchemaOrgComponent('SchemaOrgEvent', defineEvent)
export const SchemaOrgHowTo = defineSchemaOrgComponent('SchemaOrgHowTo', defineHowTo)
export const SchemaOrgOrganization = defineSchemaOrgComponent('SchemaOrgOrganization', defineOrganization)
export const SchemaOrgPerson = defineSchemaOrgComponent('SchemaOrgPerson', definePerson)
export const SchemaOrgImage = defineSchemaOrgComponent('SchemaOrgImage', defineImage)
export const SchemaOrgLocalBusiness = defineSchemaOrgComponent('SchemaOrgLocalBusiness', defineLocalBusiness)
export const SchemaOrgProduct = defineSchemaOrgComponent('SchemaOrgProduct', defineProduct)
export const SchemaOrgQuestion = defineSchemaOrgComponent('SchemaOrgQuestion', defineQuestion)
export const SchemaOrgReview = defineSchemaOrgComponent('SchemaOrgReview', defineReview)
export const SchemaOrgRecipe = defineSchemaOrgComponent('SchemaOrgRecipe', defineRecipe)
export const SchemaOrgVideo = defineSchemaOrgComponent('SchemaOrgVideo', defineVideo)
export const SchemaOrgWebPage = defineSchemaOrgComponent('SchemaOrgWebPage', defineWebPage)
export const SchemaOrgWebSite = defineSchemaOrgComponent('SchemaOrgWebSite', defineWebSite)
