import { defu } from 'defu'
import type { SchemaOrgContext } from '../../types'

export interface ReadActionInput {
  target?: string[]
}

export interface ReadAction {
  '@type': 'ReadAction'
  /**
   * An object of type EntryPoint, with a relative URL which describes the URL pattern of the internal search function
   * (e.g., /search?query={search_term_string}).
   */
  target: string[]
}

export function asReadAction(readActionInput: ReadActionInput = {}) {
  return (ctx: SchemaOrgContext) => {
    const readAction = defu(readActionInput, {
      '@type': 'ReadAction',
      'target': readActionInput?.target || [],
    }) as ReadAction
    if (!readAction.target.includes(ctx.canonicalUrl))
      readAction.target.unshift(ctx.canonicalUrl)
    return readAction
  }
}
