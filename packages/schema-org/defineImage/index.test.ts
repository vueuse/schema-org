import { expect } from 'vitest'
import { useSetup } from '../../.test'
import { useSchemaOrg } from '../useSchemaOrg'
import { defineImage } from '.'

describe('defineImage', () => {
  it('can be registered', () => {
    useSetup(() => {
      useSchemaOrg([
        defineImage({
          url: '/image.png',
        }),
      ])

      const { nodes } = useSchemaOrg()

      expect(nodes).toMatchInlineSnapshot(`
        [
          {
            "@id": "https://example.com/#image/1656904464",
            "@type": "ImageObject",
            "contentUrl": "https://example.com/image.png",
            "inLanguage": "en-AU",
            "url": "https://example.com/image.png",
          },
        ]
      `)
    })
  })
})
