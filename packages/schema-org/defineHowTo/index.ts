import type { IdReference, Thing, WithAmbigiousFields } from '../types'
import type { NodeResolver } from '../utils'
import { defineNodeResolver, idReference, prefixId, setIfEmpty } from '../utils'
import { WebPageId } from '../defineWebPage'
import type { HowToStep, WithStepsInput } from '../shared'
import { withSteps } from '../shared'

export interface HowTo extends Thing {
  /**
   * A string describing the guide.
   */
  name?: string
  /**
   * An array of howToStep objects
   */
  step?: HowToStep[]
  /**
   * Referencing the WebPage by ID.
   */
  mainEntityOfPage?: IdReference
  /**
   * The total time required to complete the instructions, in ISO 8601 duration format.
   */
  totalTime?: string
  /**
   * Introduction or description content relating to the HowTo guide.
   */
  description?: string
  /**
   * The language code for the guide; e.g., en-GB.
   */
  inLanguage?: string
}

export type HowToNodeResolver = NodeResolver<HowTo> & {
  withSteps: (stepsInput: WithStepsInput) => HowToNodeResolver
}

export const HowToId = '#howto'
/**
 * Describes an Article on a WebPage.
 */
export function defineHowTo(howToInput: WithAmbigiousFields<HowTo>): HowToNodeResolver {
  const resolver = defineNodeResolver<HowTo>(howToInput, {
    defaults({ canonicalUrl, currentRouteMeta, options }) {
      return {
        '@type': 'HowTo',
        '@id': prefixId(canonicalUrl, HowToId),
        'name': currentRouteMeta.title as string,
        'description': currentRouteMeta.description as string,
        'inLanguage': options.defaultLanguage,
      }
    },
    mergeRelations(node, { findNode }) {
      const webPage = findNode(WebPageId)
      if (webPage)
        setIfEmpty(node, 'mainEntityOfPage', idReference(webPage))
    },
  })

  const howToResolver = {
    ...resolver,
    withSteps: (withStepsInput: WithStepsInput) => withSteps(howToResolver)(withStepsInput),
  }

  return howToResolver
}
