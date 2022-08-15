import type {
  AggregateOffer,
  AggregateRating,
  Article,
  BreadcrumbList,
  Comment,
  Event,
  HowTo,
  HowToStep,
  ImageObject,
  LocalBusiness,
  Offer,
  OpeningHoursSpecification,
  Organization,
  Person,
  Place,
  PostalAddress,
  Product,
  Question,
  Recipe,
  Review,
  VideoObject,
  VirtualLocation,
  WebPage,
  WebSite,
} from 'schema-org-graph-js'
import {
  addressResolver,
  aggregateOfferResolver,
  aggregateRatingResolver,
  articleResolver,
  breadcrumbResolver,
  commentResolver,
  eventResolver,
  howToResolver,
  howToStepResolver,
  imageResolver,
  localBusinessResolver,
  offerResolver,
  organizationResolver,
  personResolver,
  placeResolver,
  productResolver,
  questionResolver,
  recipeResolver,
  resolveOpeningHours,
  reviewResolver,
  videoResolver,
  virtualLocationResolver,
  webPageResolver,
  webSiteResolver,
} from 'schema-org-graph-js'
import type { Ref } from 'vue-demi'

type MaybeRef<T> = {
  [P in keyof T]?: T[P] | Ref<T[P]>;
}

export type WithResolver<T> = T & {
  _resolver?: any
  _uid?: number
}

export const provideResolver = <T>(input?: T, resolver?: any) => {
  return <WithResolver<T>> {
    ...(input || {}),
    _resolver: resolver,
  }
}

export const defineAddress = <T extends MaybeRef<PostalAddress>>(input?: T) => provideResolver(input, addressResolver)
export const defineAggregateOffer = <T extends MaybeRef<AggregateOffer>>(input?: T) => provideResolver(input, aggregateOfferResolver)
export const defineAggregateRating = <T extends MaybeRef<AggregateRating>>(input?: T) => provideResolver(input, aggregateRatingResolver)
export const defineArticle = <T extends MaybeRef<Article>>(input?: T) => provideResolver(input, articleResolver)
export const defineBreadcrumb = <T extends MaybeRef<BreadcrumbList>>(input?: T) => provideResolver(input, breadcrumbResolver)
export const defineComment = <T extends MaybeRef<Comment>>(input?: T) => provideResolver(input, commentResolver)
export const defineEvent = <T extends MaybeRef<Event>>(input?: T) => provideResolver(input, eventResolver)
export const defineVirtualLocation = <T extends MaybeRef<VirtualLocation>>(input?: T) => provideResolver(input, virtualLocationResolver)
export const definePlace = <T extends MaybeRef<Place>>(input?: T) => provideResolver(input, placeResolver)
export const defineHowTo = <T extends MaybeRef<HowTo>>(input?: T) => provideResolver(input, howToResolver)
export const defineHowToStep = <T extends MaybeRef<HowToStep>>(input?: T) => provideResolver(input, howToStepResolver)
export const defineImage = <T extends MaybeRef<ImageObject>>(input?: T) => provideResolver(input, imageResolver)
export const defineLocalBusiness = <T extends MaybeRef<LocalBusiness>>(input?: T) => provideResolver(input, localBusinessResolver)
export const defineOffer = <T extends MaybeRef<Offer>>(input?: T) => provideResolver(input, offerResolver)
export const defineOpeningHours = <T extends MaybeRef<OpeningHoursSpecification>>(input?: T) => provideResolver(input, resolveOpeningHours)
export const defineOrganization = <T extends MaybeRef<Organization>>(input?: T) => provideResolver(input, organizationResolver)
export const definePerson = <T extends MaybeRef<Person>>(input?: T) => provideResolver(input, personResolver)
export const defineProduct = <T extends MaybeRef<Product>>(input?: T) => provideResolver(input, productResolver)
export const defineQuestion = <T extends MaybeRef<Question>>(input?: T) => provideResolver(input, questionResolver)
export const defineRecipe = <T extends MaybeRef<Recipe>>(input?: T) => provideResolver(input, recipeResolver)
export const defineReview = <T extends MaybeRef<Review>>(input?: T) => provideResolver(input, reviewResolver)
export const defineVideo = <T extends MaybeRef<VideoObject>>(input?: T) => provideResolver(input, videoResolver)
export const defineWebPage = <T extends MaybeRef<WebPage>>(input?: T) => provideResolver(input, webPageResolver)
export const defineWebSite = <T extends MaybeRef<WebSite>>(input?: T) => provideResolver(input, webSiteResolver)
