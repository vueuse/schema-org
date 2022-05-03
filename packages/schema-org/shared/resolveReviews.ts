import { defu } from 'defu'
import { hash } from 'ohash'
import type { SchemaOrgContext } from '../createSchemaOrg'
import type { Arrayable, IdReference, ResolvableDate, SchemaNodeInput, Thing } from '../types'
import { prefixId, resolveArrayable } from '../utils'
import type { AuthorInput } from './resolveAuthors'
import { resolveAuthor } from './resolveAuthors'
import type { RatingInput } from './resolveRating'
import { resolveRating } from './resolveRating'

export interface Review extends Thing {
  '@type': 'Review'
  /**
   * The name of the entity being reviewed.
   */
  name: string
  /**
   * The author of the review.
   */
  author: Arrayable<AuthorInput>
  /**
   * An answer object, with a text property which contains the answer to the question.
   */
  reviewRating: Arrayable<RatingInput>
  /**
   * The language code for the question; e.g., en-GB.
   */
  inLanguage?: string
  /**
   * The date that the review was published, in ISO 8601 date format.
   */
  datePublished?: ResolvableDate
}

export type ReviewInput = SchemaNodeInput<Review> | IdReference

export function resolveReviews(client: SchemaOrgContext, input: Arrayable<ReviewInput>) {
  return resolveArrayable<ReviewInput, Review>(input, (input) => {
    const review = defu(input as unknown as Review, {
      '@type': 'Review',
      '@id': prefixId(client.canonicalHost, `#/schema/review/${hash(input)}`),
      'inLanguage': client.options.defaultLanguage,
    }) as Review
    if (review.reviewRating)
      review.reviewRating = resolveRating(client, review.reviewRating) as RatingInput
    if (review.author)
      review.author = resolveAuthor(client, review.author)
    return review
  })
}
