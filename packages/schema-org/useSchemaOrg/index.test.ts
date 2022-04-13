import { expect } from 'vitest'
import { firstLdJsonScriptAsJson, ldJsonScriptTags, useHarlansHamburgers, useSetup } from '../../.test'
import { defineHowToStep, defineRecipe, defineWebSite } from '../definitions'
import { defineImage } from '../definitions/defineImage'
import {schemaOrgGraph, useSchemaOrg} from './index'

describe('useSchemaOrg', () => {
  it('renders nothing when schema isn\'t provided', async() => {
    useSetup(() => {
      const { graph } = useSchemaOrg()

      expect(graph.value.length).toBe(0)
      expect(graph.value).toMatchInlineSnapshot('[]')
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
            "@id": "localhost:3000#website",
            "@type": "WebSite",
            "name": "Test",
            "publisher": {
              "@id": "localhost:3000#identity",
            },
            "url": "localhost:3000",
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
            "@id": "localhost:3000#logo",
            "@type": "ImageObject",
            "contentUrl": "https://harlanshamburgers.com/logo.png",
            "url": "https://harlanshamburgers.com/logo.png",
          },
          {
            "@id": "localhost:3000#website",
            "@type": "WebSite",
            "description": "Home to Australia's best burger",
            "name": "Harlan's Hamburgers",
            "publisher": {
              "@id": "localhost:3000#identity",
            },
            "url": "localhost:3000",
          },
          {
            "@id": "localhost:3000#webpage",
            "@type": "WebPage",
            "about": {
              "@id": "localhost:3000#identity",
            },
            "isPartOf": {
              "@id": "localhost:3000#website",
            },
            "name": "The best hamburger in Australia | Harlan's Hamburger",
            "url": "localhost:3000",
          },
          {
            "@id": "localhost:3000#identity",
            "@type": [
              "Organization",
              "Place",
              "Restaurant",
            ],
            "logo": {
              "@id": "localhost:3000#logo",
            },
            "name": "Harlan's Hamburgers",
            "url": "localhost:3000",
          },
        ],
      }
    `)
  })

  it('should allow getting the current root schema tag', async() => {
    useSetup(() => {
      const recipeImage = defineImage({
        '@id': 'recipeImage',
        'url': 'https://example.com/photos/1x1/photo.jpg',
      })
      useSchemaOrg([
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
            '@id': recipeImage['@id'],
          },
        }),
      ])
    })

    useSetup(() => {
      expect(schemaOrgGraph.value).toMatchInlineSnapshot(`
        {
          "0": {
            "@id": "localhost:3000#recipe",
            "@type": "Recipe",
            "contentUrl": "https://harlanshamburgers.com/logo.png",
            "image": {
              "@id": "recipeImage",
            },
            "mainEntityOfPage": {
              "@id": "localhost:3000#article",
            },
            "name": "Peanut Butter Cookies",
            "publisher": {
              "@id": "localhost:3000#identity",
            },
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
            "url": "https://harlanshamburgers.com/logo.png",
          },
          "1": {
            "@id": "localhost:3000#website",
            "@type": "WebSite",
            "description": "Home to Australia's best burger",
            "name": "Harlan's Hamburgers",
            "publisher": {
              "@id": "localhost:3000#identity",
            },
            "url": "localhost:3000",
          },
          "2": {
            "@id": "localhost:3000#webpage",
            "@type": "WebPage",
            "about": {
              "@id": "localhost:3000#identity",
            },
            "isPartOf": {
              "@id": "localhost:3000#website",
            },
            "name": "The best hamburger in Australia | Harlan's Hamburger",
            "url": "localhost:3000",
          },
          "3": {
            "@id": "localhost:3000#identity",
            "@type": [
              "Organization",
              "Place",
              "Restaurant",
            ],
            "logo": {
              "@id": "localhost:3000#logo",
            },
            "name": "Harlan's Hamburgers",
            "url": "localhost:3000",
          },
        }
      `)
    })
  })
/*
    it('should allow modifying the root element tag', async() => {
      useSetup(() => {
        useSchemaOrg([
          defineRecipe({
            name: 'Peanut Butter Cookies',
            image: [
              'https://example.com/photos/1x1/photo.jpg',
              'https://example.com/photos/4x3/photo.jpg',
              'https://example.com/photos/16x9/photo.jpg',
            ],
          }),
        ])
      })

      useSetup(() => {
        useSchemaOrg([
          defineRecipe({
            name: 'Choc Chip Cookies',
            image: [
              'https://example.com/photos/1x1/photo.jpg',
              'https://example.com/photos/4x3/photo.jpg',
              'https://example.com/photos/16x9/photo.jpg',
            ],
          }),
        ])
      })

      useSetup(() => {
        const schemaTag = useSchemaOrg()

        const json = schemaTag.value?.json()
        expect(json.name).toEqual('Choc Chip Cookies')
        expect(json).toMatchInlineSnapshot(`
          {
            "@context": "https://schema.org",
            "@type": "Recipe",
            "image": [
              "https://example.com/photos/1x1/photo.jpg",
              "https://example.com/photos/4x3/photo.jpg",
              "https://example.com/photos/16x9/photo.jpg",
            ],
            "name": "Choc Chip Cookies",
          }
        `)
      })
    })

   */
})
