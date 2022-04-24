import type { IdReference, Thing, WithAmbigiousFields } from '../types'
import type { NodeResolver } from '../utils'
import { defineNodeResolver, idReference, prefixId, setIfEmpty } from '../utils'
import { WebPageId } from '../defineWebPage'
import type { HowToStep, WithStepsInput } from '../shared'
import { withSteps } from '../shared'
import type { ImageObject } from '../defineImage'
import type { VideoObject } from '../defineVideo'

/**
 * Instructions that explain how to achieve a result by performing a sequence of steps.
 */
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
   * The total time required to perform all instructions or directions (including time to prepare the supplies),
   * in ISO 8601 duration format.
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
  /**
   * The estimated cost of the supplies consumed when performing instructions.
   */
  estimatedCost?: string|unknown
  /**
   * Image of the completed how-to.
   */
  image?: IdReference|ImageObject|string
  /**
   * A supply consumed when performing instructions or a direction.
   */
  supply?: string|unknown
  /**
   * An object used (but not consumed) when performing instructions or a direction.
   */
  tool?: string|unknown
  /**
   * A video of the how-to. Follow the list of required and recommended Video properties.
   * Mark steps of the video with hasPart.
   */
  video?: IdReference|VideoObject
}

export type HowToNodeResolver = NodeResolver<HowTo> & {
  withSteps: (stepsInput: WithStepsInput) => HowToNodeResolver
}

export const HowToId = '#howto'
/**
 * Describes a HowTo guide, which contains a series of steps.
 */
export function defineHowTo(howToInput: WithAmbigiousFields<HowTo>): HowToNodeResolver {
  const resolver = defineNodeResolver<HowTo>(howToInput, {
    defaults({ canonicalUrl, currentRouteMeta, options }) {
      return {
        '@type': 'HowTo',
        '@id': prefixId(canonicalUrl, HowToId),
        'name': currentRouteMeta.title as string,
        'description': currentRouteMeta.description as string,
        'image': currentRouteMeta.image as string,
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
