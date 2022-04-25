import { defu } from 'defu'
import type { IdReference, SchemaNodeInput, Thing } from '../types'
import type { VideoObject } from '../defineVideo'
import { ensureBase, resolver } from '../utils'
import type { Recipe } from '../defineRecipe'
import type { HowTo } from '../defineHowTo'
import type { ImageInput } from './resolveImages'

export interface HowToStep extends Thing {
  /**
   * A link to a fragment identifier (an 'ID anchor') of the individual step
   * (e.g., https://www.example.com/example-page/#recipe-step-5).
   */
  url?: string
  /**
   * The instruction string
   * ("e.g., "Bake at 200*C for 40 minutes, or until golden-brown, stirring periodically throughout").
   */
  text: string
  /**
   * The word or short phrase summarizing the step (for example, "Attach wires to post" or "Dig").
   * Don't use non-descriptive text (for example, "Step 1: [text]") or other form of step number (for example, "1. [text]").
   */
  name?: string
  /**
   * An image representing the step, referenced by ID.
   */
  image?: ImageInput
  /**
   * A video for this step or a clip of the video.
   */
  video?: VideoObject|IdReference
  /**
   * A list of detailed substeps, including directions or tips.
   */
  itemListElement?: unknown
}

export type StepInput = SchemaNodeInput<HowToStep>[]

export function resolveAsStepInput<T extends HowTo|Recipe>(node: T, field: keyof T) {
  if (node[field]) {
    node[field] = resolver(node[field], (s, { canonicalUrl, canonicalHost }) => {
      const step = defu(s as unknown as HowToStep, {
        '@type': 'HowToStep',
      }) as HowToStep
      if (step.url)
        step.url = ensureBase(canonicalUrl, step.url)
      if (typeof step.image === 'string')
        step.image = ensureBase(canonicalHost, step.image)
      return step
    })
  }
}
