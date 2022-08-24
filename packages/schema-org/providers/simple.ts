import type {
  AggregateOffer,
  AggregateRating,
  Article,
  Book,
  BookEdition,
  BreadcrumbList,
  Comment,
  Course,
  Event,
  HowTo,
  HowToStep,
  ImageObject,
  ItemList,
  LocalBusiness,
  Movie,
  Offer,
  OpeningHoursSpecification,
  Organization,
  Person,
  Place,
  PostalAddress,
  Product,
  Question,
  ReadAction,
  Recipe,
  Review,
  SearchAction,
  SoftwareApp,
  Thing,
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
  bookEditionResolver,
  bookResolver,
  breadcrumbResolver,
  commentResolver,
  courseResolver,
  eventResolver,
  howToResolver,
  howToStepResolver,
  imageResolver,
  itemListResolver,
  localBusinessResolver,
  movieResolver,
  offerResolver,
  organizationResolver,
  personResolver,
  placeResolver,
  productResolver,
  questionResolver,
  readActionResolver,
  recipeResolver,
  resolveOpeningHours,
  reviewResolver,
  searchActionResolver,
  softwareAppResolver,
  videoResolver,
  virtualLocationResolver,
  webPageResolver,
  webSiteResolver,
} from 'schema-org-graph-js'
import type { Ref } from 'vue'

export type MaybeRef<T> = T | Ref<T>
export type DeepMaybeRef<T> = { [K in keyof T]: MaybeRef<T[K]> }

type Node<T> = Omit<DeepMaybeRef<T>, '@type'>

type MaybeWithResolver<T> = T & {
  _resolver?: any
  _uid?: number
}

const provideResolver = <T>(input?: T, resolver?: any) => {
  return <MaybeWithResolver<T>> {
    ...(input || {}),
    _resolver: resolver,
  }
}

export const defineAddress = <T extends Node<PostalAddress>>(input?: T) => provideResolver(input, addressResolver)
export const defineAggregateOffer = <T extends Node<AggregateOffer>>(input?: T) => provideResolver(input, aggregateOfferResolver)
export const defineAggregateRating = <T extends Node<AggregateRating>>(input?: T) => provideResolver(input, aggregateRatingResolver)
export const defineArticle = <T extends Node<Article>>(input?: T) => provideResolver(input, articleResolver)
export const defineBreadcrumb = <T extends Node<BreadcrumbList>>(input?: T) => provideResolver(input, breadcrumbResolver)
export const defineComment = <T extends Node<Comment>>(input?: T) => provideResolver(input, commentResolver)
export const defineEvent = <T extends Node<Event>>(input?: T) => provideResolver(input, eventResolver)
export const defineVirtualLocation = <T extends Node<VirtualLocation>>(input?: T) => provideResolver(input, virtualLocationResolver)
export const definePlace = <T extends Node<Place>>(input?: T) => provideResolver(input, placeResolver)
export const defineHowTo = <T extends Node<HowTo>>(input?: T) => provideResolver(input, howToResolver)
export const defineHowToStep = <T extends Node<HowToStep>>(input?: T) => provideResolver(input, howToStepResolver)
export const defineImage = <T extends Node<ImageObject>>(input?: T) => provideResolver(input, imageResolver)
export const defineLocalBusiness = <T extends Node<LocalBusiness>>(input?: T) => provideResolver(input, localBusinessResolver)
export const defineOffer = <T extends Node<Offer>>(input?: T) => provideResolver(input, offerResolver)
export const defineOpeningHours = <T extends Node<OpeningHoursSpecification>>(input?: T) => provideResolver(input, resolveOpeningHours)
export const defineOrganization = <T extends Node<Organization>>(input?: T) => provideResolver(input, organizationResolver)
export const definePerson = <T extends Node<Person>>(input?: T) => provideResolver(input, personResolver)
export const defineProduct = <T extends Node<Product>>(input?: T) => provideResolver(input, productResolver)
export const defineQuestion = <T extends Node<Question>>(input?: T) => provideResolver(input, questionResolver)
export const defineRecipe = <T extends Node<Recipe>>(input?: T) => provideResolver(input, recipeResolver)
export const defineReview = <T extends Node<Review>>(input?: T) => provideResolver(input, reviewResolver)
export const defineVideo = <T extends Node<VideoObject>>(input?: T) => provideResolver(input, videoResolver)
export const defineWebPage = <T extends Node<WebPage>>(input?: T) => provideResolver(input, webPageResolver)
export const defineWebSite = <T extends Node<WebSite>>(input?: T) => provideResolver(input, webSiteResolver)
export const defineBook = <T extends Node<Book>>(input?: T) => provideResolver(input, bookResolver)
export const defineCourse = <T extends Node<Course>>(input?: T) => provideResolver(input, courseResolver)
export const defineItemList = <T extends Node<ItemList>>(input?: T) => provideResolver(input, itemListResolver)
export const defineMovie = <T extends Node<Movie>>(input?: T) => provideResolver(input, movieResolver)
export const defineSearchAction = <T extends Node<SearchAction>>(input?: T) => provideResolver(input, searchActionResolver)
export const defineReadAction = <T extends Node<ReadAction>>(input?: T) => provideResolver(input, readActionResolver)

/* simple-only */
export const defineSoftwareApp = <T extends Node<SoftwareApp>>(input?: T) => provideResolver(input, softwareAppResolver)
export const defineBookEdition = <T extends Node<BookEdition>>(input?: T) => provideResolver(input, bookEditionResolver)
/* end-simple-only */

export { Thing }
