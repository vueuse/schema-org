import type { IdReference, OptionalMeta, Thing } from '../types'
import {defineNodeResolverSchema, IdentityId, idReference, setIfEmpty} from '../utils'
import type { Article } from '../defineArticle'
import { ArticleId } from '../defineArticle'
import {Person} from "../definePerson";
import {Organization} from "../defineOrganization";

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
  author?: IdReference
}

/**
 * Describes an Article on a WebPage.
 */
export function defineComment(comment: OptionalMeta<Comment, '@type'>) {
  return defineNodeResolverSchema<Comment>(comment, {
    defaults: {
      '@type': 'Comment',
    },
    mergeRelations(node, { findNode }) {
      const article = findNode<Article>(ArticleId)

      if (article)
        setIfEmpty(node, 'about', idReference(article))

      const identity = findNode<Person|Organization>(IdentityId)
      if (identity && identity['@type'] === 'Person')
        setIfEmpty(node, 'author', idReference(identity))
    },
  })
}
