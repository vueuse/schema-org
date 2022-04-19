import { expect } from 'vitest'
import { firstLdJsonScriptAsJson, ldJsonScriptTags, useHarlansHamburgers, useSetup } from '../../.test'
import { defineWebSite } from '../defineWebSite'
import { defineImage } from '../defineImage'
import { defineRecipe } from '../defineRecipe'
import { defineHowToStep } from '../defineHowTo'
import { useSchemaOrg } from './index'
import {defineOrganization} from "../defineOrganization";
import {defineWebPage} from "../defineWebPage";

describe('useSchemaOrg', () => {
  it('renders nothing when schema isn\'t provided', async() => {
    useSetup(() => {
      const { graph } = useSchemaOrg()

      expect(Object.values(graph.value).length).toBe(0)
      expect(graph.value).toMatchInlineSnapshot('{}')
    })
    expect(ldJsonScriptTags().length).toEqual(0)
  })

  it('renders basic example', () => {
    useSetup(() => {
      useSchemaOrg([
        defineOrganization({
          name: 'Nuxt.js',
          logo: 'https://vueuse.js.org/logo.png',
          sameAs: [
            'https://twitter.com/nuxt_js',
          ],
        }),
        defineWebPage(),
        defineWebSite({
          name: 'Nuxt',
          description: 'Nuxt is a progressive framework for building modern web applications with Vue.js',
        }),
      ])
    })

    expect(ldJsonScriptTags()).toMatchInlineSnapshot(`
      NodeList [
        <script
          type="application/ld+json"
        >
          {
        "@context": "https://schema.org",
        "@graph": [
          {
            "@type": "Organization",
            "@id": "https://example.com/#identity",
            "url": "https://example.com/",
            "name": "Nuxt.js",
            "logo": {
              "@id": "https://example.com/#logo"
            },
            "sameAs": [
              "https://twitter.com/nuxt_js"
            ]
          },
          {
            "@type": "WebPage",
            "@id": "https://example.com/#webpage",
            "url": "https://example.com/",
            "potentialAction": [
              {
                "@type": "ReadAction",
                "target": [
                  "https://example.com/"
                ]
              }
            ],
            "about": {
              "@id": "https://example.com/#identity"
            },
            "primaryImageOfPage": {
              "@id": "https://example.com/#logo"
            },
            "isPartOf": {
              "@id": "https://example.com/#website"
            }
          },
          {
            "@type": "WebSite",
            "@id": "https://example.com/#website",
            "url": "https://example.com/",
            "name": "Nuxt",
            "description": "Nuxt is a progressive framework for building modern web applications with Vue.js",
            "publisher": {
              "@id": "https://example.com/#identity"
            }
          },
          {
            "@type": "ImageObject",
            "inLanguage": "en-AU",
            "@id": "https://example.com/#logo",
            "url": "https://vueuse.js.org/logo.png",
            "caption": "Nuxt.js",
            "contentUrl": "https://vueuse.js.org/logo.png"
          }
        ]
      }
        </script>,
      ]
    `)
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
            "@id": "https://example.com/#website",
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
            "inLanguage": "en-AU",
            "url": "https://harlanshamburgers.com/logo.png",
          },
          {
            "@id": "https://example.com/#website",
            "@type": "WebSite",
            "description": "Home to Australia's best burger",
            "name": "Harlan's Hamburgers",
            "publisher": {
              "@id": "https://example.com/#identity",
            },
            "url": "https://example.com/",
          },
          {
            "@id": "https://example.com/#webpage",
            "@type": "WebPage",
            "about": {
              "@id": "https://example.com/#identity",
            },
            "isPartOf": {
              "@id": "https://example.com/#website",
            },
            "name": "The best hamburger in Australia | Harlan's Hamburger",
            "potentialAction": [
              {
                "@type": "ReadAction",
                "target": [
                  "https://example.com/",
                ],
              },
            ],
            "primaryImageOfPage": {
              "@id": "#logo",
            },
            "url": "https://example.com/",
          },
          {
            "@id": "https://example.com/#identity",
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
            "inLanguage": "en-AU",
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
