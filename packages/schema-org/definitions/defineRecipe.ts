import { defu } from 'defu'
import type { IdReference, OptionalMeta, Thing } from '../types'
import { mergeRouteMeta } from '../_meta'
import { resolveArticleId } from './defineArticle'
import {useSchemaOrg} from "../useSchemaOrg";

export interface HowToStep extends Thing {
  '@type': 'HowToStep'
  /**
   * A link to a fragment identifier (an 'ID anchor') of the individual step
   * (e.g., https://www.example.com/example-page/#recipe-step-5).
   */
  url: string
  /**
   * The instruction string
   * ("e.g., "Bake at 200*C for 40 minutes, or until golden-brown, stirring periodically throughout").
   */
  text: string
  /**
   * A short summary of the step (e.g., "Bake").
   */
  name?: string
  /**
   * An image representing the step, referenced by ID.
   */
  image?: string
}

export interface NutritionInformation extends Thing {
  '@type': 'NutritionInformation'
  /**
   * A calorie count as a string (e.g., "270 calories").
   */
  calories: string
}

export interface Recipe extends Thing {
  '@type': 'Recipe'
  /**
   * Referencing the WebPage or Article by ID.
   */
  mainEntityOfPage: IdReference
  /**
   * A string describing the recipe.
   */
  name: string
  /**
   * An image representing the completed recipe, referenced by ID.
   */
  image: IdReference
  /**
   * An array of strings representing each ingredient and quantity (e.g., "3 apples").
   */
  recipeIngredient: string[]
  /**
   * An array of HowToStep objects.
   */
  recipeInstructions: HowToStep[]
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
  video?: IdReference
  /**
   * The language code for the guide; e.g., en-GB.
   */
  inLanguage?: string
  /**
   * The date when the recipe was added, in ISO 8601 format.
   */
  datePublished?: string
}

export const resolveRecipeId = (path?: string) => {
  const { resolvePathId } = useSchemaOrg()
  return resolvePathId('recipe', path)
}

export const defineHowToStep = (howToStep: OptionalMeta<HowToStep>) => howToStep as HowToStep

export function defineRecipe(recipe: OptionalMeta<Recipe, 'mainEntityOfPage'>) {
  const partial: Partial<Recipe> = {
    '@type': 'Recipe',
    '@id': resolveRecipeId(),
  }
  if (!recipe.mainEntityOfPage) {
    // @todo has article use article id, otherwise web page id
    recipe.mainEntityOfPage = {
      '@id': resolveArticleId(),
    }
  }

  // mergeRouteMeta(partial)
  return defu(partial, recipe) as Recipe
}
