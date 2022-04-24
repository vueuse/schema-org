import { expect } from 'vitest'
import { useSetup } from '../../.test'
import { useSchemaOrg } from '../useSchemaOrg'
import { defineHowTo } from '.'

describe('defineHowTo', () => {
  it('can be registered', () => {
    useSetup(() => {
      useSchemaOrg([
        defineHowTo({
          name: 'Test',
        })
          .withSteps([
            {
              name: 'Create the action',
              text: 'Create the action. Once content is successfully uploaded, it will take couple of minutes to create the action.',
              image: 'https://example.com/1x1/step5.jpg',
              url: 'https://example.com/tie#step5',
              video: {
                '@id': 'Clip5',
              },
            },
          ]),
      ])

      const { nodes } = useSchemaOrg()

      expect(nodes).toMatchInlineSnapshot(`
        [
          {
            "@id": "https://example.com/#howto",
            "@type": "HowTo",
            "inLanguage": "en-AU",
            "name": "Test",
            "step": [
              {
                "@type": "HowToStep",
                "image": "https://example.com/1x1/step5.jpg",
                "name": "Create the action",
                "text": "Create the action. Once content is successfully uploaded, it will take couple of minutes to create the action.",
                "url": "https://example.com/tie#step5",
                "video": {
                  "@id": "Clip5",
                },
              },
            ],
          },
        ]
      `)
    })
  })
})
