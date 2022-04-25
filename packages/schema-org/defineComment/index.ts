import { hash } from 'ohash'
import type { IdReference, SchemaNodeInput, Thing } from '../types'
import { IdentityId, defineNodeResolver, idReference, prefixId, setIfEmpty } from '../utils'
import type { Article } from '../defineArticle'
import { ArticleId } from '../defineArticle'
import type { Person } from '../definePerson'
import type { Organization } from '../defineOrganization'

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
  author?: Person|IdReference
}

/**
 * Describes an Article on a WebPage.
 */
export function defineComment(comment: SchemaNodeInput<Comment>) {
  return defineNodeResolver<Comment>(comment, {
    defaults: {
      '@type': 'Comment',
    },
    resolve(node, { canonicalUrl }) {
      // generate dynamic id if none has been set
      setIfEmpty(node, '@id', prefixId(canonicalUrl, `#/schema/comment/${hash(node.text)}`))
      return node
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
