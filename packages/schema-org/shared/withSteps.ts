import { defu } from 'defu'
import type { Thing, WithAmbigiousFields } from '../types'
import type { HowToNodeResolver } from '../defineHowTo'
import type { RecipeNodeResolver } from '../defineRecipe'

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

export type WithStepsInput = WithAmbigiousFields<HowToStep>[]

export function withSteps<N extends HowToNodeResolver|RecipeNodeResolver>(resolver: N, key = 'step') {
  return (stepsInput: WithStepsInput) => {
    resolver.append.push(() => {
      return {
        [key]: stepsInput.map(s => defu(s as HowToStep, {
          '@type': 'HowToStep',
        })) as HowToStep[],
      }
    })
    return resolver
  }
}
