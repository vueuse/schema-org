import { defineSchemaOrgComponent } from './defineSchemaOrgComponent'
// @ts-expect-error untyped
import { defineArticle, defineBreadcrumb, defineComment, defineHowTo, defineImage, defineLocalBusiness, defineOrganization, definePerson, defineProduct, defineQuestion, defineRecipe, defineReview, defineVideo, defineWebPage, defineWebSite } from '#vueuse/schema-org/provider'

export const SchemaOrgArticle = defineSchemaOrgComponent('SchemaOrgArticle', defineArticle)
export const SchemaOrgBreadcrumb = defineSchemaOrgComponent('SchemaOrgBreadcrumb', defineBreadcrumb)
export const SchemaOrgComment = defineSchemaOrgComponent('SchemaOrgComment', defineComment)
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
