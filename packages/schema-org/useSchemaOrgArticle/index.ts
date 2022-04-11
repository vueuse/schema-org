import type {Article} from 'schema-dts'
import { useSchemaOrgTag } from '../useSchemaOrgTag'
import {defu} from "defu";
import {OmitType} from "../types";
import {mergeId, mergeUrl} from "../_meta";

export function defineArticle(article: OmitType<Article>) {
  mergeId(article, 'article')
  mergeUrl(article)
  return defu(article, {
    '@type': 'Article',
  })
}

/**
 * Async script tag loading.
 *
 * @see https://vueuse.org/useScriptTag
 */
export function useSchemaOrgArticle(
  article?: OmitType<Article>,
) {
  return useSchemaOrgTag(defineArticle(article))
}

export type UseSchemaOrgArticle = ReturnType<typeof useSchemaOrgArticle>
