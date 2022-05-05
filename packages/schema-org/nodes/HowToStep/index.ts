import type { DeepPartial } from 'utility-types'
import type { Arrayable, IdReference, SchemaNodeInput, SchemaOrgContext, Thing } from '../../types'
import {
  defineSchemaResolver, resolveArrayable, resolveSchemaResolver, resolveWithBaseUrl,
} from '../../utils'
import type { Video } from '../Video'
import type { HowToDirection } from '../HowToStepDirection'
import { resolveHowToDirection } from '../HowToStepDirection'
import type { ImageInput } from '../Image'
import { resolveImages } from '../Image'

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
  video?: Video | IdReference
  /**
   * A list of detailed substeps, including directions or tips.
   */
  itemListElement?: HowToDirection[]
}

export type HowToStepInput = SchemaNodeInput<HowToStep>

/**
 * Describes a HowTo guide, which contains a series of steps.
 */
export const defineHowToStepPartial = <K>(input?: DeepPartial<HowToStep> & K) =>
  // hacky way for users to get around strict typing when using custom schema, route meta or augmentation
  defineHowToStep(input as HowToStep)

/**
 * Describes a HowTo guide, which contains a series of steps.
 */
export function defineHowToStep<T extends SchemaNodeInput<HowToStep>>(input: T) {
  return defineSchemaResolver<T, HowToStep>(input, {
    defaults: {
      '@type': 'HowToStep',
    },
    resolve(step, ctx) {
      if (step.url)
        step.url = resolveWithBaseUrl(ctx.canonicalUrl, step.url)
      if (step.image)
        step.image = resolveImages(ctx, step.image)
      if (step.itemListElement)
        step.itemListElement = resolveHowToDirection(ctx, step.itemListElement) as HowToDirection[]
      return step
    },
  })
}

export function resolveHowToStep(ctx: SchemaOrgContext, input: Arrayable<HowToStepInput>) {
  return resolveArrayable<HowToStepInput, HowToStep>(input, input => resolveSchemaResolver(ctx, defineHowToStep(input)))
}

