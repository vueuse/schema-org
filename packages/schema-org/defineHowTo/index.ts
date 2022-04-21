import type { IdReference, OptionalMeta, Thing } from '../types'
import { defineNodeResolverSchema, idReference, prefixId, setIfEmpty } from '../utils'
import { WebPageId } from '../defineWebPage'

export interface HowTo extends Thing {
  /**
   * A string describing the guide.
   */
  name: string
  /**
   * An array of howToStep objects
   */
  step: HowToStep[]
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

export interface HowToStep extends Thing {
  /**
   * A link to a fragment identifier (an 'ID anchor') of the individual step
   * (e.g., https://www.example.com/example-page/#recipe-step-5).
   */
  url: string
  /**
   * The instruction string
   * ("e.g., "Bake at 200*C for 40 minutes, or until golden-brown, stirring periodically throughout").
   */
  text: string
  /**
   * A short summary of the step (e.g., "Bake").
   */
  name?: string
  /**
   * An image representing the step, referenced by ID.
   */
  image?: string
}

export const defineHowToStep = (howToStep: OptionalMeta<HowToStep>) => {
  return {
    '@type': 'HowToStep',
    ...howToStep,
  } as HowToStep
}

export const HowToId = '#howto'
/**
 * Describes an Article on a WebPage.
 */
export function defineHowTo(product: OptionalMeta<HowTo>) {
  return defineNodeResolverSchema<HowTo>(product, {
    defaults({ canonicalUrl, options }) {
      return {
        '@type': 'HowTo',
        '@id': prefixId(canonicalUrl, HowToId),
        'inLanguage': options.defaultLanguage,
      }
    },
    mergeRelations(node, { findNode }) {
      const webPage = findNode(WebPageId)
      if (webPage)
        setIfEmpty(node, 'mainEntityOfPage', idReference(webPage))
    },
  })
}
