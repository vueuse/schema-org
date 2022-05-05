import type { DeepPartial } from 'utility-types'
import type { Arrayable, IdReference, ResolvableDate, SchemaNodeInput, Thing } from '../../types'
import {
  defineSchemaResolver,
  idReference,
  prefixId,
  resolveId,
  resolveRouteMeta,
  setIfEmpty,
} from '../../utils'
import type { Article } from '../Article'
import { ArticleId } from '../Article'
import type { WebPage } from '../WebPage'
import { PrimaryWebPageId } from '../WebPage'
import type { Video } from '../Video'
import type { ImageInput } from '../Image'
import type { HowToStepInput } from '../HowToStep'
import { resolveHowToStep } from '../HowToStep'
import type { ChildPersonInput } from '../Person'
import { defineSchemaOrgComponent } from '../../components/defineSchemaOrgComponent'

export interface Recipe extends Thing {
  '@type': 'Recipe'
  /**
   * Referencing the WebPage or Article by ID.
   */
  mainEntityOfPage?: IdReference
  /**
   * A string describing the recipe.
   */
  name: string
  /**
   * An image representing the completed recipe, referenced by ID.
   */
  image: ImageInput
  /**
   * An array of strings representing each ingredient and quantity (e.g., "3 apples").
   */
  recipeIngredient: string[]
  /**
   * An array of HowToStep objects.
   */
  recipeInstructions: Arrayable<HowToStepInput>
  /**
   * A string describing the recipe.
   */
  description?: string
  /**
   * The cooking time in ISO 8601 format.
   */
  cookTime?: string
  /**
   * The time required to prepare the recipe.
   */
  prepTime?: string
  /**
   * A NutritionInformation node, with a calories property which defines a calorie count as a string (e.g., "270 calories").
   */
  nutrition?: NutritionInformation
  /**
   * The number of servings the recipe creates (not the number of individual items, if these are different), as a string
   * (e.g., "6", rather than 6).
   */
  recipeYield?: string
  /**
   * An array of strings representing the tools required in the recipe.
   */
  tools?: string[]
  /**
   * An array of keywords describing the recipe.
   */
  keywords?: string[]
  /**
   * A string describing the cuisine type (e.g., "American" or "Spanish").
   */
  recipeCuisine?: string
  /**
   * The category of the recipe.
   */
  recipeCategory?: 'Appetizer' | 'Breakfast' | 'Brunch' | 'Dessert' | 'Dinner' | 'Drink' | 'Lunch' | 'Main course' | 'Sauce' | 'Side dish' | 'Snack' | 'Starter'
  /**
   * A RestrictedDiet node, with a value (or array of values
   */
  suitableForDiet?: Partial<'DiabeticDiet' | 'GlutenFreeDiet' | 'HalalDiet' | 'HinduDiet' | 'KosherDiet' | 'LowCalorieDiet' | 'LowFatDiet' | 'LowLactoseDiet' | 'LowSaltDiet' | 'VeganDiet' | 'VegetarianDiet'>[]
  /**
   *  A reference to a video representing the recipe instructions, by ID.
   */
  video?: Arrayable<Video | IdReference>
  /**
   * The language code for the guide; e.g., en-GB.
   */
  inLanguage?: string
  /**
   * A reference-by-ID to the author of the article.
   */
  author?: Arrayable<ChildPersonInput>
  /**
   * The date when the recipe was added, in ISO 8601 format.
   */
  datePublished?: ResolvableDate
}

export interface NutritionInformation extends Thing {
  '@type': 'NutritionInformation'
  /**
   * A calorie count as a string (e.g., "270 calories").
   */
  calories: string
}

export const RecipeId = '#recipe'

export const defineRecipePartial = <K>(input?: DeepPartial<Recipe> & K) =>
  // hacky way for users to get around strict typing when using custom schema, route meta or augmentation
  defineRecipe(input as Recipe)

export function defineRecipe<T extends SchemaNodeInput<Recipe>>(input: T) {
  return defineSchemaResolver<T, Recipe>(input, {
    required: [
      'name',
      'image',
      'recipeIngredient',
      'recipeInstructions',
    ],
    defaults({ canonicalUrl }) {
      return {
        '@type': 'Recipe',
        '@id': prefixId(canonicalUrl, RecipeId),
      }
    },
    resolve(node, client) {
      resolveId(node, client.canonicalUrl)
      // @todo fix types
      if (node.recipeInstructions)
        node.recipeInstructions = resolveHowToStep(client, node.recipeInstructions) as HowToStepInput[]

      resolveRouteMeta(node, client.meta, [
        'name',
        'description',
        'image',
        'datePublished',
      ])
      return node
    },
    rootNodeResolve(node, { findNode }) {
      const article = findNode<Article>(ArticleId)
      const webPage = findNode<WebPage>(PrimaryWebPageId)
      if (article)
        setIfEmpty(node, 'mainEntityOfPage', idReference(article))
      else if (webPage)
        setIfEmpty(node, 'mainEntityOfPage', idReference(webPage))
      if (article?.author)
        setIfEmpty(node, 'author', article.author)
      return node
    },
  })
}

export const SchemaOrgRecipe = defineSchemaOrgComponent('SchemaOrgRecipe', defineRecipe)
