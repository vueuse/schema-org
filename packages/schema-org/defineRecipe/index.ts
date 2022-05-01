import type { DeepPartial } from 'utility-types'
import type { Arrayable, IdReference, ResolvableDate, SchemaNodeInput, Thing } from '../types'
import {
  callAsPartial,
  defineNodeResolver,
  idReference,
  prefixId,
  resolveId,
  resolveRouteMeta,
  setIfEmpty,
} from '../utils'
import type { Article } from '../defineArticle'
import { ArticleId } from '../defineArticle'
import type { WebPage } from '../defineWebPage'
import { PrimaryWebPageId } from '../defineWebPage'
import type { HowToStepInput } from '../shared/resolveHowToStep'
import { resolveHowToStep } from '../shared/resolveHowToStep'
import type { VideoObject } from '../defineVideo'
import type { ImageInput } from '../shared/resolveImages'
import type { AuthorInput } from '../shared/resolveAuthors'

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
  video?: Arrayable<VideoObject | IdReference>
  /**
   * The language code for the guide; e.g., en-GB.
   */
  inLanguage?: string
  /**
   * A reference-by-ID to the author of the article.
   */
  author?: Arrayable<AuthorInput>
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
  callAsPartial(defineRecipe, input)

export function defineRecipe<T extends SchemaNodeInput<Recipe>>(input: T) {
  return defineNodeResolver<T, Recipe>(input, {
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
    resolve(node, { currentRouteMeta, canonicalUrl }) {
      resolveId(node, canonicalUrl)
      // @todo fix types
      if (node.recipeInstructions)
        node.recipeInstructions = resolveHowToStep(node.recipeInstructions) as HowToStepInput[]

      resolveRouteMeta(node, currentRouteMeta, [
        'name',
        'description',
        'image',
        'datePublished',
      ])
      return node
    },
    mergeRelations(node, { findNode }) {
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
