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
                "image": "https://example.com/1x1/photo.jpg",
                "text": "Button your shirt how you'd like to wear it, then drape the tie around your neck. Make the thick end about 1/3rd longer than the short end. For formal button down shirts, it usually works best with the small end of the tie between 4th and 5th button.",
                "url": "https://example.com/#step-one",
              },
              {
                "@type": "HowToStep",
                "image": "https://example.com/1x1/photo.jpg",
                "text": "Cross the long end over the short end. This will form the basis for your knot.",
                "url": "https://example.com/#step-two",
              },
              {
                "@type": "HowToStep",
                "image": "https://example.com/1x1/photo.jpg",
                "text": "Bring the long end back under the short end, then throw it back over the top of the short end in the other direction. ",
                "url": "https://example.com/#step-three",
              },
              {
                "@type": "HowToStep",
                "image": "https://example.com/1x1/photo.jpg",
                "text": "Now pull the long and through the loop near your neck, forming another loop near your neck.",
              },
              {
                "@type": "HowToStep",
                "image": "https://example.com/1x1/photo.jpg",
                "text": "Pull the long end through that new loop and tighten to fit! ",
              },
            ],
          },
        ]
      `)
    })
  })
})
