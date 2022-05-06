import { hash } from 'ohash'
import type { DeepPartial } from 'utility-types'
import type { Arrayable, IdReference, SchemaNodeInput, Thing } from '../../types'
import {
  defineSchemaResolver,
  idReference,
  prefixId,
  resolveId,
  setIfEmpty,
} from '../../utils'
import type { Article } from '../Article'
import { PrimaryArticleId } from '../Article'
import type { ChildPersonInput } from '../Person'
import { resolvePerson } from '../Person'
import { defineSchemaOrgComponent } from '../../components/defineSchemaOrgComponent'

export interface Comment extends Thing {
  /**
   * The textual content of the comment, stripping HTML tags.
   */
  text: string
  /**
   *  A reference by ID to the parent Article (or WebPage, when no Article is present).
   */
  about?: IdReference
  /**
   * A reference by ID to the Person who wrote the comment.
   */
  author: Arrayable<ChildPersonInput>
}

/**
 * Describes a review. Usually in the context of an Article or a WebPage.
 */
export const defineCommentPartial = <K>(input?: DeepPartial<Comment> & K) =>
  // hacky way for users to get around strict typing when using custom schema, route meta or augmentation
  defineComment(input as Comment)

/**
 * Describes a review. Usually in the context of an Article or a WebPage.
 */
export function defineComment<T extends SchemaNodeInput<Comment>>(input: T) {
  return defineSchemaResolver<T, Comment>(input, {
    required: [
      'text',
    ],
    defaults: {
      '@type': 'Comment',
    },
    resolve(node, client) {
      // generate dynamic id if none has been set
      setIfEmpty(node, '@id', prefixId(client.canonicalUrl, `#/schema/comment/${hash(node.text)}`))
      resolveId(node, client.canonicalUrl)
      if (node.author)
        node.author = resolvePerson(client, node.author)
      return node
    },
    rootNodeResolve(node, { findNode }) {
      const article = findNode<Article>(PrimaryArticleId)

      if (article)
        setIfEmpty(node, 'about', idReference(article))
    },
  })
}

export const SchemaOrgComment = defineSchemaOrgComponent('SchemaOrgComment', defineComment)
