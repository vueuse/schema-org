import { defineComponent, h } from 'vue'

export function defineSchemaOrgComponent(name: string) {
  return defineComponent({
    name,
    props: {
      as: String,
    },
    setup(props, { slots, attrs }) {
      return () => {
        // renderless component
        if (!slots.default)
          return null
        const childSlots = []
        if (slots.default)
          childSlots.push(slots.default(attrs))
        return h(props.as || 'div', {}, childSlots)
      }
    },
  })
}

export const SchemaOrgArticle = defineSchemaOrgComponent('SchemaOrgArticle')
export const SchemaOrgBreadcrumb = defineSchemaOrgComponent('SchemaOrgBreadcrumb')
export const SchemaOrgComment = defineSchemaOrgComponent('SchemaOrgComment')
export const SchemaOrgEvent = defineSchemaOrgComponent('SchemaOrgEvent')
export const SchemaOrgHowTo = defineSchemaOrgComponent('SchemaOrgHowTo')
export const SchemaOrgOrganization = defineSchemaOrgComponent('SchemaOrgOrganization')
export const SchemaOrgPerson = defineSchemaOrgComponent('SchemaOrgPerson')
export const SchemaOrgImage = defineSchemaOrgComponent('SchemaOrgImage')
export const SchemaOrgLocalBusiness = defineSchemaOrgComponent('SchemaOrgLocalBusiness')
export const SchemaOrgProduct = defineSchemaOrgComponent('SchemaOrgProduct')
export const SchemaOrgQuestion = defineSchemaOrgComponent('SchemaOrgQuestion')
export const SchemaOrgReview = defineSchemaOrgComponent('SchemaOrgReview')
export const SchemaOrgRecipe = defineSchemaOrgComponent('SchemaOrgRecipe')
export const SchemaOrgVideo = defineSchemaOrgComponent('SchemaOrgVideo')
export const SchemaOrgWebPage = defineSchemaOrgComponent('SchemaOrgWebPage')
export const SchemaOrgWebSite = defineSchemaOrgComponent('SchemaOrgWebSite')
