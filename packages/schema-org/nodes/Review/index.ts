import { hash } from 'ohash'
import type { DeepPartial } from 'utility-types'
import type { Arrayable, IdReference, ResolvableDate, SchemaNodeInput, SchemaOrgContext, Thing } from '../../types'
import {
  defineSchemaResolver,
  prefixId,
  resolveArrayable, resolveSchemaResolver,
} from '../../utils'
import { defineSchemaOrgComponent } from '../../components/defineSchemaOrgComponent'
import type { RatingInput } from '../Rating'
import { resolveRating } from '../Rating'
import type { ChildPersonInput } from '../Person'
import { resolvePerson } from '../Person'

export interface Review extends Thing {
  '@type': 'Review'
  /**
   * A title for the review.
   */
  name?: string
  /**
   * The author of the review.
   */
  author: Arrayable<ChildPersonInput> | string
  /**
   * An answer object, with a text property which contains the answer to the question.
   */
  reviewRating: Arrayable<RatingInput> | number
  /**
   * The language code for the question; e.g., en-GB.
   */
  inLanguage?: string
  /**
   * The date that the review was published, in ISO 8601 date format.
   */
  datePublished?: ResolvableDate
  /**
   * The text content of the review.
   */
  reviewBody?: string
}

export type RelatedReviewInput = SchemaNodeInput<Review> | IdReference

/**
 * Describes an Article on a WebPage.
 */
export const defineReviewPartial = <K>(input?: DeepPartial<Review> & K) =>
  // hacky way for users to get around strict typing when using custom schema, route meta or augmentation
  defineReview(input as Review)

export function defineReview<T extends SchemaNodeInput<Review>>(input: T) {
  return defineSchemaResolver<T, Review>(input, {
    defaults(ctx) {
      return {
        '@type': 'Review',
        '@id': prefixId(ctx.canonicalHost, `#/schema/review/${hash(input)}`),
        'inLanguage': ctx.options.defaultLanguage,
      }
    },
    resolve(review, ctx) {
      if (review.reviewRating)
        review.reviewRating = resolveRating(ctx, typeof review.reviewRating === 'number' ? { ratingValue: review.reviewRating } : review.reviewRating) as RatingInput
      if (review.author)
        review.author = resolvePerson(ctx, typeof review.author === 'string' ? { name: review.author } : review.author)
      return review
    },
  })
}

export function resolveReviews(ctx: SchemaOrgContext, input: Arrayable<RelatedReviewInput>) {
  return resolveArrayable<RelatedReviewInput, Review>(input, input => resolveSchemaResolver(ctx, defineReview(input)))
}

export const SchemaOrgReview = defineSchemaOrgComponent('SchemaOrgReview', defineReview)
