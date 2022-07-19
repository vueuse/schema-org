import { expect } from 'vitest'
import { mockRoute, useSetup } from '../../../.test'
import { injectSchemaOrg, useSchemaOrg } from '../../useSchemaOrg'
import { defineWebPagePartial } from '../WebPage'
import { defineQuestion } from './index'

describe('defineQuestion', () => {
  it('can be registered', () => {
    mockRoute({
      path: '/frequently-asked-questions',
      meta: {
        title: 'FAQ',
      },
    }, () => {
      useSetup(() => {
        useSchemaOrg([
          defineWebPagePartial({
            '@type': 'FAQPage',
          }),
          defineQuestion({
            name: 'How long is a piece of string?',
            acceptedAnswer: 'Long',
          }),
          defineQuestion({
            name: 'Why do we ask questions?',
            acceptedAnswer: 'To get an accepted answer',
          }),
        ])

        const { graphNodes } = injectSchemaOrg()

        expect(graphNodes).toMatchInlineSnapshot(`
          [
            {
              "@id": "https://example.com/frequently-asked-questions/#webpage",
              "@type": [
                "WebPage",
                "FAQPage",
              ],
              "mainEntity": [
                {
                  "@id": "https://example.com/frequently-asked-questions/#/schema/question/NFmi3kwPwY",
                },
                {
                  "@id": "https://example.com/frequently-asked-questions/#/schema/question/JT3Yfbekc6",
                },
              ],
              "name": "FAQ",
              "url": "https://example.com/frequently-asked-questions",
            },
            {
              "@id": "https://example.com/frequently-asked-questions/#/schema/question/NFmi3kwPwY",
              "@type": "Question",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Long",
              },
              "inLanguage": "en-AU",
              "name": "How long is a piece of string?",
            },
            {
              "@id": "https://example.com/frequently-asked-questions/#/schema/question/JT3Yfbekc6",
              "@type": "Question",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "To get an accepted answer",
              },
              "inLanguage": "en-AU",
              "name": "Why do we ask questions?",
            },
          ]
        `)
      })
    })
  })
})
