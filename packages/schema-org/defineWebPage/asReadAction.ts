import { defu } from 'defu'
import { injectSchemaOrg } from '../useSchemaOrg'

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
  const { canonicalUrl } = injectSchemaOrg()
  const readAction = defu(readActionInput, {
    '@type': 'ReadAction',
    'target': readActionInput?.target || [],
  }) as ReadAction
  if (!readAction.target.includes(canonicalUrl))
    readAction.target.unshift(canonicalUrl)
  return readAction
}
