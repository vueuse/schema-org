import type { OptionalMeta, Thing } from '../types'
import { defineNodeResolverSchema } from '../utils'

export interface Answer extends Thing {
  text: string
}

export interface Question extends Thing {
  /**
   * The text content of the question.
   */
  name: string
  /**
   * An answer object, with a text property which contains the answer to the question.
   */
  acceptedAnswer: Answer
  /**
   * The language code for the question; e.g., en-GB.
   */
  inLanguage: string
}

/**
 * Describes a Question. Most commonly used in FAQPage or QAPage content.
 */
export function defineQuestion(question: OptionalMeta<Question>) {
  return defineNodeResolverSchema(question, {
    defaults({ options }) {
      return {
        '@type': 'Question',
        'inLanguage': options.defaultLanguage,
      }
    },
  })
}
