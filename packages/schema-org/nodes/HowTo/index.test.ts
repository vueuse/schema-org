import { expect } from 'vitest'
import { useSetup } from '../../../.test'
import { injectSchemaOrg, useSchemaOrg } from '../../useSchemaOrg'
import { defineHowTo } from './index'

describe('defineHowTo', () => {
  it('can be registered', () => {
    useSetup(() => {
      useSchemaOrg([
        defineHowTo({
          name: 'How to tie a tie',
          step: [
            {
              url: '#step-one',
              text: 'Button your shirt how you\'d like to wear it, then drape the tie around your neck. Make the thick end about 1/3rd longer than the short end. For formal button down shirts, it usually works best with the small end of the tie between 4th and 5th button.',
              image: '/1x1/photo.jpg',
            },
            {
              url: '#step-two',
              text: 'Cross the long end over the short end. This will form the basis for your knot.',
              image: '/1x1/photo.jpg',
            }, {
              url: '#step-three',
              text: 'Bring the long end back under the short end, then throw it back over the top of the short end in the other direction. ',
              image: '/1x1/photo.jpg',
            }, {
              text: 'Now pull the long and through the loop near your neck, forming another loop near your neck.',
              image: '/1x1/photo.jpg',
            }, {
              text: 'Pull the long end through that new loop and tighten to fit! ',
              image: '/1x1/photo.jpg',
            },
          ],
        }),
      ])

      const { graphNodes } = injectSchemaOrg()

      expect(graphNodes).toMatchInlineSnapshot(`
        [
          {
            "@id": "https://example.com/#/schema/image/YJgouI7tGV",
            "@type": "ImageObject",
            "contentUrl": "https://example.com/1x1/photo.jpg",
            "inLanguage": "en-AU",
            "url": "https://example.com/1x1/photo.jpg",
          },
          {
            "@id": "https://example.com/#howto",
            "@type": "HowTo",
            "inLanguage": "en-AU",
            "name": "How to tie a tie",
            "step": [
              {
                "@type": "HowToStep",
                "image": {
                  "@id": "https://example.com/#/schema/image/YJgouI7tGV",
                },
                "text": "Button your shirt how you'd like to wear it, then drape the tie around your neck. Make the thick end about 1/3rd longer than the short end. For formal button down shirts, it usually works best with the small end of the tie between 4th and 5th button.",
                "url": "https://example.com/#step-one",
              },
              {
                "@type": "HowToStep",
                "image": {
                  "@id": "https://example.com/#/schema/image/YJgouI7tGV",
                },
                "text": "Cross the long end over the short end. This will form the basis for your knot.",
                "url": "https://example.com/#step-two",
              },
              {
                "@type": "HowToStep",
                "image": {
                  "@id": "https://example.com/#/schema/image/YJgouI7tGV",
                },
                "text": "Bring the long end back under the short end, then throw it back over the top of the short end in the other direction. ",
                "url": "https://example.com/#step-three",
              },
              {
                "@type": "HowToStep",
                "image": {
                  "@id": "https://example.com/#/schema/image/YJgouI7tGV",
                },
                "text": "Now pull the long and through the loop near your neck, forming another loop near your neck.",
              },
              {
                "@type": "HowToStep",
                "image": {
                  "@id": "https://example.com/#/schema/image/YJgouI7tGV",
                },
                "text": "Pull the long end through that new loop and tighten to fit! ",
              },
            ],
          },
        ]
      `)
    })
  })
})
