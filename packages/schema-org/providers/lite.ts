import type {
  Article,
  Breadcrumb,
  Comment,
  HowTo,
  Image,
  LocalBusiness,
  Organization,
  Person,
  Product,
  Question,
  Recipe,
  Review,
  Video,
  WebPage,
  WebSite,
} from 'schema-org-graph-js'
import {
  defineArticle as article,
  defineBreadcrumb as breadcrumb,
  defineComment as comment,
  defineHowTo as howTo,
  defineImage as image,
  defineLocalBusiness as localBusiness,
  defineOrganization as organization,
  definePerson as person,
  defineProduct as product,
  defineQuestion as question,
  defineRecipe as recipe,
  defineReview as review,
  defineVideo as video,
  defineWebPage as webPage,
  defineWebSite as webSite,
} from 'schema-org-graph-js'
import type { Ref } from 'vue-demi'

type MaybeRef<T> = {
  [P in keyof T]?: T[P] | Ref<T[P]>;
}

export const defineArticle = (input?: MaybeRef<Article>) => article(input as Article)
export const defineBreadcrumb = (input?: MaybeRef<Breadcrumb>) => breadcrumb(input as Breadcrumb)
export const defineComment = (input?: MaybeRef<Comment>) => comment(input as Comment)
export const defineHowTo = (input?: MaybeRef<HowTo>) => howTo(input as HowTo)
export const defineOrganization = (input?: MaybeRef<Organization>) => organization(input as Organization)
export const definePerson = (input?: MaybeRef<Person>) => person(input as Person)
export const defineImage = (input?: MaybeRef<Image>) => image(input as Image)
export const defineLocalBusiness = (input?: MaybeRef<LocalBusiness>) => localBusiness(input as LocalBusiness)
export const defineProduct = (input?: MaybeRef<Product>) => product(input as Product)
export const defineQuestion = (input?: MaybeRef<Question>) => question(input as Question)
export const defineReview = (input?: MaybeRef<Review>) => review(input as Review)
export const defineRecipe = (input?: MaybeRef<Recipe>) => recipe(input as Recipe)
export const defineVideo = (input?: MaybeRef<Video>) => video(input as Video)
export const defineWebPage = (input?: MaybeRef<WebPage>) => webPage(input as WebPage)
export const defineWebSite = (input?: MaybeRef<WebSite>) => webSite(input as WebSite)

