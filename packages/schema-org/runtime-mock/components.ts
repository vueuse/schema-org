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

export const SchemaOrgArticle = /* @__PURE__ */ defineSchemaOrgComponent('SchemaOrgArticle')
export const SchemaOrgBreadcrumb = /* @__PURE__ */ defineSchemaOrgComponent('SchemaOrgBreadcrumb')
export const SchemaOrgComment = /* @__PURE__ */ defineSchemaOrgComponent('SchemaOrgComment')
export const SchemaOrgEvent = /* @__PURE__ */ defineSchemaOrgComponent('SchemaOrgEvent')
export const SchemaOrgHowTo = /* @__PURE__ */ defineSchemaOrgComponent('SchemaOrgHowTo')
export const SchemaOrgOrganization = /* @__PURE__ */ defineSchemaOrgComponent('SchemaOrgOrganization')
export const SchemaOrgPerson = /* @__PURE__ */ defineSchemaOrgComponent('SchemaOrgPerson')
export const SchemaOrgImage = /* @__PURE__ */ defineSchemaOrgComponent('SchemaOrgImage')
export const SchemaOrgLocalBusiness = /* @__PURE__ */ defineSchemaOrgComponent('SchemaOrgLocalBusiness')
export const SchemaOrgProduct = /* @__PURE__ */ defineSchemaOrgComponent('SchemaOrgProduct')
export const SchemaOrgQuestion = /* @__PURE__ */ defineSchemaOrgComponent('SchemaOrgQuestion')
export const SchemaOrgReview = /* @__PURE__ */ defineSchemaOrgComponent('SchemaOrgReview')
export const SchemaOrgRecipe = /* @__PURE__ */ defineSchemaOrgComponent('SchemaOrgRecipe')
export const SchemaOrgVideo = /* @__PURE__ */ defineSchemaOrgComponent('SchemaOrgVideo')
export const SchemaOrgWebPage = /* @__PURE__ */ defineSchemaOrgComponent('SchemaOrgWebPage')
export const SchemaOrgWebSite = /* @__PURE__ */ defineSchemaOrgComponent('SchemaOrgWebSite')
