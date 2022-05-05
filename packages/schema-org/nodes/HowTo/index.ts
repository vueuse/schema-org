import type { DeepPartial } from 'utility-types'
import type { IdReference, SchemaNodeInput, Thing } from '../../types'
import {
  defineSchemaResolver,
  idReference,
  prefixId,
  resolveId,
  resolveRouteMeta,
  setIfEmpty,
} from '../../utils'
import { PrimaryWebPageId } from '../WebPage'
import type { Video } from '../Video'
import type { HowToStepInput } from '../HowToStep'
import { resolveHowToStep } from '../HowToStep'
import type { ImageInput } from '../Image'
import { defineSchemaOrgComponent } from '../../components/defineSchemaOrgComponent'

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
  step: HowToStepInput[]
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
  estimatedCost?: string | unknown
  /**
   * Image of the completed how-to.
   */
  image?: ImageInput
  /**
   * A supply consumed when performing instructions or a direction.
   */
  supply?: string | unknown
  /**
   * An object used (but not consumed) when performing instructions or a direction.
   */
  tool?: string | unknown
  /**
   * A video of the how-to. Follow the list of required and recommended Video properties.
   * Mark steps of the video with hasPart.
   */
  video?: IdReference | Video
}

export const HowToId = '#howto'

/**
 * Describes a HowTo guide, which contains a series of steps.
 */
export const defineHowToPartial = <K>(input?: DeepPartial<HowTo> & K) =>
  // hacky way for users to get around strict typing when using custom schema, route meta or augmentation
  defineHowTo(input as HowTo)

/**
 * Describes a HowTo guide, which contains a series of steps.
 */
export function defineHowTo<T extends SchemaNodeInput<HowTo>>(input: T) {
  return defineSchemaResolver<T, HowTo>(input, {
    required: [
      'name',
      'step',
    ],
    defaults({ canonicalUrl, meta, options }) {
      const defaults: Partial<HowTo> = {
        '@type': 'HowTo',
        '@id': prefixId(canonicalUrl, HowToId),
        'inLanguage': options.defaultLanguage,
      }
      resolveRouteMeta(defaults, meta, [
        'name',
        'description',
        'image',
      ])
      return defaults
    },
    resolve(node, client) {
      resolveId(node, client.canonicalUrl)
      if (node.step)
        node.step = resolveHowToStep(client, node.step) as HowToStepInput[]
      return node
    },
    rootNodeResolve(node, { findNode }) {
      const webPage = findNode(PrimaryWebPageId)
      if (webPage)
        setIfEmpty(node, 'mainEntityOfPage', idReference(webPage))
    },
  })
}

export const SchemaOrgHowTo = defineSchemaOrgComponent('SchemaOrgHowTo', defineHowTo)
