import type { Optional } from 'utility-types'
import { hash } from 'ohash'
import type { SchemaNodeInput, Thing } from '../types'
import { defineNodeResolver, idReference, includesType, prefixId, setIfEmpty } from '../utils'
import type { WebPage } from '../defineWebPage'
import { PrimaryWebPageId } from '../defineWebPage'

/**
 * A specific question - e.g. from a user seeking answers online, or collected in a Frequently Asked Questions (FAQ) document.
 */
export interface Question extends Thing {
  /**
   * The text content of the question.
   */
  name: string
  /**
   * An answer object, with a text property which contains the answer to the question.
   */
  acceptedAnswer: Answer|string
  /**
   * The language code for the question; e.g., en-GB.
   */
  inLanguage?: string
}

/**
 * An answer offered to a question; perhaps correct, perhaps opinionated or wrong.
 */
export interface Answer extends Optional<Thing, '@id'> {
  text: string
}

/**
 * Describes a Question. Most commonly used in FAQPage or QAPage content.
 */
export function defineQuestion(question: SchemaNodeInput<Question>) {
  return defineNodeResolver(question, {
    defaults({ options }) {
      return {
        '@type': 'Question',
        'inLanguage': options.defaultLanguage,
      }
    },
    resolve(question, { canonicalUrl }) {
      // generate dynamic id if none has been set
      setIfEmpty(question, '@id', prefixId(canonicalUrl, `#/schema/question/${hash(question.name)}`))
      // resolve string answer to Answer
      if (typeof question.acceptedAnswer === 'string') {
        question.acceptedAnswer = {
          '@type': 'Answer',
          'text': question.acceptedAnswer,
        }
      }
      return question
    },
    mergeRelations(question, { findNode }) {
      const webPage = findNode<WebPage>(PrimaryWebPageId)

      // merge in nodes to the FAQPage
      if (webPage && includesType(webPage, 'FAQPage')) {
        if (Array.isArray(webPage.mainEntity)) {
          webPage.mainEntity = [
            ...webPage.mainEntity,
            idReference(question),
          ]
        }
        else if (webPage.mainEntity) {
          webPage.mainEntity = [
            webPage.mainEntity,
            idReference(question),
          ]
        }
        else {
          webPage.mainEntity = [
            idReference(question),
          ]
        }
      }
    },
  })
}
