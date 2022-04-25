import type { Arrayable, IdReference, SchemaNodeInput, Thing } from '../types'
import type { NodeResolver } from '../utils'
import {defineNodeResolver, idReference, prefixId, resolveId, resolveRouteMeta, setIfEmpty} from '../utils'
import { ArticleId } from '../defineArticle'
import { PrimaryWebPageId } from '../defineWebPage'
import type { StepInput } from '../shared/resolveHowToStep'
import { resolveAsStepInput } from '../shared/resolveHowToStep'
import type { VideoObject } from '../defineVideo'
import type { ImageInput } from '../shared/resolveImages'

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
  recipeInstructions: StepInput
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
  video?: Arrayable<VideoObject|IdReference>
  /**
   * The language code for the guide; e.g., en-GB.
   */
  inLanguage?: string
  /**
   * The date when the recipe was added, in ISO 8601 format.
   */
  datePublished?: string
}

export interface NutritionInformation extends Thing {
  '@type': 'NutritionInformation'
  /**
   * A calorie count as a string (e.g., "270 calories").
   */
  calories: string
}

export const RecipeId = '#recipe'

export type RecipeOptionalKeys = '@id'|'@type'|'mainEntityOfPage'
export type RecipeUsingRouteMeta = RecipeOptionalKeys|'name'|'image'
export type RecipeNodeResolver<T extends keyof Recipe = RecipeOptionalKeys> = NodeResolver<Recipe, T>

export function defineRecipe(recipeInput: SchemaNodeInput<Recipe, RecipeOptionalKeys>): RecipeNodeResolver
export function defineRecipe<OptionalKeys extends keyof Recipe>(recipeInput?: SchemaNodeInput<Recipe, OptionalKeys | RecipeOptionalKeys>): RecipeNodeResolver<OptionalKeys>
export function defineRecipe(recipeInput: any) {
  return defineNodeResolver<Recipe>(recipeInput, {
    defaults({ canonicalUrl }) {
      return {
        '@type': 'Recipe',
        '@id': prefixId(canonicalUrl, RecipeId),
      }
    },
    resolve(node, { currentRouteMeta, canonicalUrl }) {
      resolveId(node, canonicalUrl)
      resolveAsStepInput(node, 'recipeInstructions')
      resolveRouteMeta(node, currentRouteMeta, [
        'name',
        'description',
        'image',
        'datePublished',
      ])
      return node
    },
    mergeRelations(node, { findNode }) {
      const article = findNode(ArticleId)
      const webPage = findNode(PrimaryWebPageId)
      if (article)
        setIfEmpty(node, 'mainEntityOfPage', idReference(article))
      else if (webPage)
        setIfEmpty(node, 'mainEntityOfPage', idReference(webPage))
      return node
    },
  })
}
