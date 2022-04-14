import { expect } from 'vitest'
import { firstLdJsonScriptAsJson, ldJsonScriptTags, useHarlansHamburgers, useSetup } from '../../.test'
import { defineWebSite } from '../defineWebSite'
import { defineImage } from '../defineImage'
import { defineHowToStep, defineRecipe } from '../defineRecipe'
import { useSchemaOrg } from './index'

describe('useSchemaOrg', () => {
  it('renders nothing when schema isn\'t provided', async() => {
    useSetup(() => {
      const { graph } = useSchemaOrg()

      expect(Object.values(graph.value).length).toBe(0)
      expect(graph.value).toMatchInlineSnapshot('{}')
    })
    expect(ldJsonScriptTags().length).toEqual(0)
  })

  it('should render WebSite', async() => {
    useSetup(() => {
      useSchemaOrg([
        defineWebSite({
          name: 'Test',
        }),
      ])
    })

    expect(ldJsonScriptTags().length).toEqual(1)
    expect(firstLdJsonScriptAsJson()['@context']).toEqual('https://schema.org')

    expect(firstLdJsonScriptAsJson()).toMatchInlineSnapshot(`
      {
        "@context": "https://schema.org",
        "@graph": [
          {
            "@id": "#website",
            "@type": "WebSite",
            "name": "Test",
            "url": "https://example.com/",
          },
        ],
      }
    `)
  })

  it('should render full', async() => {
    useSetup(() => {
      useHarlansHamburgers()
    })

    expect(ldJsonScriptTags().length).toEqual(1)
    expect(firstLdJsonScriptAsJson()['@context']).toEqual('https://schema.org')

    expect(firstLdJsonScriptAsJson()).toMatchInlineSnapshot(`
      {
        "@context": "https://schema.org",
        "@graph": [
          {
            "@id": "#logo",
            "@type": "ImageObject",
            "contentUrl": "https://harlanshamburgers.com/logo.png",
            "url": "https://harlanshamburgers.com/logo.png",
          },
          {
            "@id": "#website",
            "@type": "WebSite",
            "description": "Home to Australia's best burger",
            "name": "Harlan's Hamburgers",
            "publisher": {
              "@id": {
                "@id": "#identity",
                "@type": [
                  "Organization",
                  "Place",
                  "Restaurant",
                ],
                "logo": {
                  "@id": "#logo",
                },
                "name": "Harlan's Hamburgers",
                "url": "https://example.com/",
              },
            },
            "url": "https://example.com/",
          },
          {
            "@id": "#webpage",
            "@type": "WebPage",
            "about": {
              "@id": {
                "@id": "#identity",
                "@type": [
                  "Organization",
                  "Place",
                  "Restaurant",
                ],
                "logo": {
                  "@id": "#logo",
                },
                "name": "Harlan's Hamburgers",
                "url": "https://example.com/",
              },
            },
            "isPartOf": {
              "@id": {
                "@id": "#website",
                "@type": "WebSite",
                "description": "Home to Australia's best burger",
                "name": "Harlan's Hamburgers",
                "publisher": {
                  "@id": {
                    "@id": "#identity",
                    "@type": [
                      "Organization",
                      "Place",
                      "Restaurant",
                    ],
                    "logo": {
                      "@id": "#logo",
                    },
                    "name": "Harlan's Hamburgers",
                    "url": "https://example.com/",
                  },
                },
                "url": "https://example.com/",
              },
            },
            "name": "The best hamburger in Australia | Harlan's Hamburger",
            "url": "https://example.com/",
          },
          {
            "@id": "#identity",
            "@type": [
              "Organization",
              "Place",
              "Restaurant",
            ],
            "logo": {
              "@id": "#logo",
            },
            "name": "Harlan's Hamburgers",
            "url": "https://example.com/",
          },
        ],
      }
    `)
  })

  it('should allow getting the current root schema tag', async() => {
    useSetup(() => {
      const recipeImage = defineImage({
        '@id': '#recipeImage',
        'url': 'https://example.com/photos/1x1/photo.jpg',
      })
      useSchemaOrg([
        recipeImage,
        defineRecipe({
          name: 'Peanut Butter Cookies',
          recipeIngredient: ['Peanut Butter', 'Cookie Dough'],
          recipeInstructions: [
            defineHowToStep({
              url: '#mylink',
              text: 'Bake at 200*C for 40 minutes, or until golden-brown, stirring periodically throughout',
            }),
          ],
          image: {
            '@id': '#recipeImage',
          },
        }),
      ])

      expect(useSchemaOrg().nodes).toMatchInlineSnapshot(`
        [
          {
            "@id": "#recipeImage",
            "@type": "ImageObject",
            "contentUrl": "https://example.com/photos/1x1/photo.jpg",
            "url": "https://example.com/photos/1x1/photo.jpg",
          },
          {
            "@id": "#recipe",
            "@type": "Recipe",
            "image": {
              "@id": "#recipeImage",
            },
            "name": "Peanut Butter Cookies",
            "recipeIngredient": [
              "Peanut Butter",
              "Cookie Dough",
            ],
            "recipeInstructions": [
              {
                "text": "Bake at 200*C for 40 minutes, or until golden-brown, stirring periodically throughout",
                "url": "#mylink",
              },
            ],
          },
        ]
      `)
    })
  })
})
