import { expect } from 'vitest'
import { useSetup } from '../../.test'
import { useSchemaOrg } from '../useSchemaOrg'
import { defineRecipe } from './index'

describe('defineRecipe', () => {
  it('can be defined', () => {
    useSetup(() => {
      useSchemaOrg([
        defineRecipe({
          name: 'Peanut Butter Cookies',
          image: [
            'https://example.com/photos/1x1/photo.jpg',
          ],
          recipeIngredient: ['Peanut Butter', 'Cookie Dough'],
        })
          .withSteps([
            {
              url: '#mylink',
              text: 'Bake at 200*C for 40 minutes, or until golden-brown, stirring periodically throughout',
            },
          ]),
      ])

      expect(useSchemaOrg().nodes).toMatchInlineSnapshot(`
        [
          {
            "@id": "#recipe",
            "@type": "Recipe",
            "image": [
              "https://example.com/photos/1x1/photo.jpg",
            ],
            "name": "Peanut Butter Cookies",
            "recipeIngredient": [
              "Peanut Butter",
              "Cookie Dough",
            ],
            "recipeInstructions": [
              {
                "@type": "HowToStep",
                "text": "Bake at 200*C for 40 minutes, or until golden-brown, stirring periodically throughout",
                "url": "https://example.com/#mylink",
              },
            ],
          },
        ]
      `)
    })
  })
})
