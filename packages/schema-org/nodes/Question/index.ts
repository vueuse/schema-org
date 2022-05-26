import type { DeepPartial, Optional } from 'utility-types'
import { hash } from 'ohash'
import type { SchemaNodeInput, Thing } from '../../types'
import {
  dedupeMerge,
  defineSchemaResolver,
  idReference,
  includesType,
  prefixId,
  resolveId,
  setIfEmpty,
} from '../../utils'
import type { WebPage } from '../WebPage'
import { PrimaryWebPageId } from '../WebPage'
import { defineSchemaOrgComponent } from '../../components/defineSchemaOrgComponent'

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
  acceptedAnswer: Answer | string
  /**
   * The language code for the question; e.g., en-GB.
   */
  inLanguage?: string
  /**
   * Alias for `name`
   */
  question?: string
  /**
   * Alias for `acceptedAnswer`
   */
  answer?: string
}

/**
 * An answer offered to a question; perhaps correct, perhaps opinionated or wrong.
 */
export interface Answer extends Optional<Thing, '@id'> {
  text: string
}

export const defineQuestionPartial = <K>(input?: DeepPartial<Question> & K) =>
  // hacky way for users to get around strict typing when using custom schema, route meta or augmentation
  defineQuestion(input as Question)

/**
 * Describes a Question. Most commonly used in FAQPage or QAPage content.
 */
export function defineQuestion<T extends SchemaNodeInput<Question>>(input: T) {
  return defineSchemaResolver<T, Question>(input, {
    defaults({ options }) {
      return {
        '@type': 'Question',
        'inLanguage': options.defaultLanguage,
      }
    },
    resolve(question, { canonicalUrl }) {
      if (question.question)
        question.name = question.question
      if (question.answer)
        question.acceptedAnswer = question.answer
      // generate dynamic id if none has been set
      const id = hash(question.name)
      setIfEmpty(question, '@id', prefixId(canonicalUrl, `#/schema/question/${id}`))
      resolveId(question, canonicalUrl)
      // resolve string answer to Answer
      if (typeof question.acceptedAnswer === 'string') {
        question.acceptedAnswer = {
          '@type': 'Answer',
          'text': question.acceptedAnswer,
        }
      }
      return question
    },
    rootNodeResolve(question, { findNode }) {
      const webPage = findNode<WebPage>(PrimaryWebPageId)

      // merge in nodes to the FAQPage
      if (webPage && includesType(webPage, 'FAQPage'))
        dedupeMerge(webPage, 'mainEntity', idReference(question))
    },
  })
}

export const SchemaOrgQuestion = defineSchemaOrgComponent('SchemaOrgQuestion', defineQuestion)
