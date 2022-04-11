import { expect } from 'vitest'
import { useSetup } from '../../.test'
import { useSchemaOrgTag} from './index'

describe('useSchemaOrg', () => {
  const tags = () => document.head.querySelectorAll('script[type="application/ld+json"]')

  it('should render script', async() => {
    useSetup(() => {
      useSchemaOrgTag({
        "@type": "Recipe",
        "name": "Peanut Butter Cookies",
        "image": [
          "https://example.com/photos/1x1/photo.jpg",
          "https://example.com/photos/4x3/photo.jpg",
          "https://example.com/photos/16x9/photo.jpg"
        ],
      })
      return
    })

    expect(tags().length).toEqual(1)
    expect(tags()[0].innerHTML.includes('https://schema.org'))

    expect(tags()).toMatchInlineSnapshot(`
      NodeList [
        <script
          type="application/ld+json"
        >
          {
        "@context": "https://schema.org",
        "@type": "Recipe",
        "name": "Peanut Butter Cookies",
        "image": [
          "https://example.com/photos/1x1/photo.jpg",
          "https://example.com/photos/4x3/photo.jpg",
          "https://example.com/photos/16x9/photo.jpg"
        ]
      }
        </script>,
      ]
    `)
  })

})
