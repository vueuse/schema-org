import { defu } from 'defu'
import type { IdReference, Thing, WithAmbigiousFields } from '../types'
import type { HowToNodeResolver } from '../defineHowTo'
import type { RecipeNodeResolver } from '../defineRecipe'
import type { ImageObject } from '../defineImage'
import type { VideoObject } from '../defineVideo'
import { ensureBase } from '../utils'

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
  image?: ImageObject|IdReference|string
  /**
   * A video for this step or a clip of the video.
   */
  video?: VideoObject|IdReference
  /**
   * A list of detailed substeps, including directions or tips.
   */
  itemListElement?: unknown
}

export type WithStepsInput = WithAmbigiousFields<HowToStep>[]

export function withSteps<N extends HowToNodeResolver|RecipeNodeResolver>(resolver: N, key = 'step') {
  return (stepsInput: WithStepsInput) => {
    resolver.append.push(({ canonicalUrl, canonicalHost }) => {
      const steps = stepsInput.map((s) => {
        const step = defu(s as HowToStep, {
          '@type': 'HowToStep',
        })
        if (step.url)
          step.url = ensureBase(canonicalUrl, step.url)
        if (typeof step.image === 'string')
          step.image = ensureBase(canonicalHost, step.image)
        return step
      }) as HowToStep[]

      return {
        [key]: steps,
      }
    })
    return resolver
  }
}
