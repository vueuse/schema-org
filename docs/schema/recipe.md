# Vue Schema.org Recipe

**Type**: `defineRecipe(recipe: Recipe)`

Describes a Recipe, which contains a series of instructions, ingredients, and optional fields.

::: warning
🔨 Documentation in progress
:::

## Useful Links

- [Schema.org Recipe](https://schema.org/Recipe)
- [Recipe Structed Data](https://developers.google.com/search/docs/advanced/structured-data/recipe)

## Type Definition

```ts
export interface Recipe extends Thing {
  '@type': 'Recipe'
  /**
   * Referencing the WebPage or Article by ID.
   */
  mainEntityOfPage?: IdReference
  /**
   * A string describing the recipe.
   */
  name?: string
  /**
   * An image representing the completed recipe, referenced by ID.
   */
  image?: Arrayable<IdReference|string|ImageObject>
  /**
   * An array of strings representing each ingredient and quantity (e.g., "3 apples").
   */
  recipeIngredient: string[]
  /**
   * An array of HowToStep objects.
   */
  recipeInstructions?: HowToStep[]
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
```
