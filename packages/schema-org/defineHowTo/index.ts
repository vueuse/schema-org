import type { Optional } from 'utility-types'
import type { IdReference, Thing } from '../types'
import type { NodeResolver } from '../utils'
import { defineNodeResolver, idReference, prefixId, setIfEmpty } from '../utils'
import { PrimaryWebPageId } from '../defineWebPage'
import type { StepInput } from '../shared/resolveHowToStep'
import { resolveAsStepInput } from '../shared/resolveHowToStep'
import type { ImageObject } from '../defineImage'
import type { VideoObject } from '../defineVideo'

/**
 * Instructions that explain how to achieve a result by performing a sequence of steps.
 */
export interface HowTo extends Thing {
  /**
   * A string describing the guide.
   */
  name: string
  /**
   * An array of howToStep objects
   */
  step: StepInput
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

export type HowToOptionalKeys = '@id'|'@type'
export type HowToUsingRouteMeta = HowToOptionalKeys|'name'

export type HowToNodeResolver<T extends keyof HowTo = HowToOptionalKeys> = NodeResolver<HowTo, T>

export const HowToId = '#howto'
/**
 * Describes a HowTo guide, which contains a series of steps.
 */
export function defineHowTo(howToInput: Optional<HowTo, HowToOptionalKeys>): HowToNodeResolver
export function defineHowTo<OptionalKeys extends keyof HowTo>(howToInput: Optional<HowTo, OptionalKeys | HowToOptionalKeys>): HowToNodeResolver<OptionalKeys>
export function defineHowTo(howToInput: any) {
  return defineNodeResolver<HowTo>(howToInput, {
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
    resolve(node) {
      resolveAsStepInput(node, 'step')
      return node
    },
    mergeRelations(node, { findNode }) {
      const webPage = findNode(PrimaryWebPageId)
      if (webPage)
        setIfEmpty(node, 'mainEntityOfPage', idReference(webPage))
    },
  })
}
