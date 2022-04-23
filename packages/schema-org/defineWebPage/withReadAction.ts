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

export function withReadAction(readActionInput?: ReadActionInput) {
  const { canonicalUrl } = useSchemaOrg()
  const readAction: ReadAction = {
    '@type': 'ReadAction',
    'target': readActionInput?.target || [],
  }
  if (!readAction.target.includes(canonicalUrl))
    readAction.target.unshift(canonicalUrl)

  return readAction
}
