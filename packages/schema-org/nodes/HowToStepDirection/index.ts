import type { Arrayable, SchemaNodeInput, SchemaOrgContext, Thing } from '../../types'
import {
  defineSchemaResolver, resolveArrayable, resolveSchemaResolver,
} from '../../utils'

export interface HowToDirection extends Thing {
  /**
   * The text of the direction or tip.
   */
  text: string
}

/**
 * Describes a HowTo guide, which contains a series of steps.
 */
function defineHowToStepDirection<T extends SchemaNodeInput<HowToDirection>>(input: T) {
  return defineSchemaResolver<T, HowToDirection>(input, {
    defaults: {
      '@type': 'HowToDirection',
    },
  })
}

export function resolveHowToDirection(ctx: SchemaOrgContext, input: Arrayable<HowToDirection>) {
  return resolveArrayable<HowToDirection, HowToDirection>(input, input => resolveSchemaResolver(ctx, defineHowToStepDirection(input)))
}
