import { expect } from 'vitest'
import { mockRoute, useSetup } from '../../.test'
import { useSchemaOrg } from '../useSchemaOrg'
import { defineWebPagePartial } from '../defineWebPage'
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

        const client = useSchemaOrg()

        expect(client.nodes).toMatchInlineSnapshot(`
        [
          {
            "@id": "https://example.com/frequently-asked-questions/#webpage",
            "@type": [
              "WebPage",
              "FAQPage",
            ],
            "mainEntity": [
              {
                "@id": "https://example.com/frequently-asked-questions/#/schema/question/521045072",
              },
              {
                "@id": "https://example.com/frequently-asked-questions/#/schema/question/2038892454",
              },
            ],
            "name": "FAQ",
            "potentialAction": [
              {
                "@type": "ReadAction",
                "target": [
                  "https://example.com/frequently-asked-questions",
                ],
              },
            ],
            "url": "https://example.com/frequently-asked-questions",
          },
          {
            "@id": "https://example.com/frequently-asked-questions/#/schema/question/521045072",
            "@type": "Question",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Long",
            },
            "inLanguage": "en-AU",
            "name": "How long is a piece of string?",
          },
          {
            "@id": "https://example.com/frequently-asked-questions/#/schema/question/2038892454",
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
