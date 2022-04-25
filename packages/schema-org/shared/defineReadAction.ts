import { defu } from 'defu'
import { useSchemaOrg } from '../useSchemaOrg'

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

export function defineReadAction(readActionInput: ReadActionInput = {}) {
  const { canonicalUrl } = useSchemaOrg()
  const readAction = defu(readActionInput, {
    '@type': 'ReadAction',
    'target': readActionInput?.target || [],
  }) as ReadAction
  if (!readAction.target.includes(canonicalUrl))
    readAction.target.unshift(canonicalUrl)
  return readAction
}
