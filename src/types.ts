/*********
 * Type definitions
 *   TypeScript interfaces and types should be defined here!
 */

export interface Error {
  error: any;
}

export interface MPUser {
  mp_user_id: number,
  username: string,
  height: number,
  weight: number,
  sex: string,
  birth_year: number,
  diet_type: string,
  activity_factor: string,
  address: string,
  shopping_list_id: number,
  current_weekly_plan_id: number
}

export interface Ingredient {
  ingredient_id: number
}

export interface ShoppingListEntry {
  ingredient_id: number,
  quantity: number,
  measure: string
}

export interface CaloriesData {
  height: number,
  weight: number,
  age: number,
  sex: string,
  activityFactor: string
}

export interface Recipe {
  recipe_id: number;
}

export interface DailyPlan {
  recipes: SpoonacularRecipe[],
}

export interface MealPlan {
  daily_calories: number,
  diet_type: string,
  daily_plans: DailyPlan[]
}

export interface SpoonacularMeasureRaw {
  amount: number,
  unitLong: string,
  unitShort: string
}

export class SpoonacularMeasure {
  amount: number;
  unitLong: string;
  unitShort: string;

  constructor(measure: SpoonacularMeasureRaw){
    this.amount = measure.amount;
    this.unitLong = measure.unitLong;
    this.unitShort = measure.unitShort;
  }
}

export class SpoonacularRecipeIngredient {
  id: number;
  name: string;
  measures: {
    metric: SpoonacularMeasure
  };

  constructor(rec_ingredient: SpoonacularRecipeIngredientRaw){
    this.id = rec_ingredient.id;
    this.name = rec_ingredient.name;
    this.measures = {
      metric : new SpoonacularMeasure(rec_ingredient.measures.metric)
    };
  }
}

export interface SpoonacularRecipeIngredientRaw {
  id: number,
  name: string,
  measures: {
    metric: SpoonacularMeasureRaw
  }
}

export class SpoonacularRecipe {
  id: number;
  title: string;
  image: string;
  imageType: string;
  ingredients: SpoonacularRecipeIngredient[];
  summary: string;
  sourceUrl: string;
  servings: number;
  readyInMinutes: number;
  pricePerServing: number;
  glutenFree: boolean;
  vegan: boolean;
  vegetarian: boolean;
  instructions: string;

  constructor(recipe: SpoonacularRecipeRaw){
    this.id = recipe.id;
    this.title = recipe.title;
    this.image = recipe.image;
    this.imageType = recipe.imageType;
    this.summary = recipe.summary;
    this.sourceUrl = recipe.sourceUrl;
    this.servings = recipe.servings;
    this.readyInMinutes = recipe.readyInMinutes;
    this.pricePerServing = recipe.pricePerServing;
    this.glutenFree = recipe.glutenFree;
    this.vegan = recipe.vegan;
    this.vegetarian = recipe.vegetarian;
    this.instructions = recipe.instructions;
    this.ingredients = [];
    if(recipe.extendedIngredients !== undefined){
      for (const ingredient of recipe.extendedIngredients){
        this.ingredients.push(new SpoonacularRecipeIngredient(ingredient));
      }
    }
  }
}

export interface SpoonacularRecipeRaw {
  id: number,
  title: string,
  image: string,
  imageType: string,
  extendedIngredients: SpoonacularRecipeIngredientRaw[],
  summary: string,
  sourceUrl: string,
  servings: number,
  readyInMinutes: number,
  pricePerServing: number,
  glutenFree: boolean,
  vegan: boolean,
  vegetarian: boolean,
  instructions: string
}

export class SpoonacularIngredient {
  id: number;
  name: string;
  categoryPath: string[];

  constructor(ingredient: SpoonacularIngredientRaw){
    this.id = ingredient.id;
    this.name = ingredient.name;
    this.categoryPath = ingredient.categoryPath;
  }
}

export interface SpoonacularIngredientRaw {
  id: number;
  name: string;
  categoryPath: string[];
}

export interface SpoonacularAmount {
  sourceAmount: number,
  sourceUnit: string,
  targetAmount: number,
  targetUnit: string,
  answer: string
}

export class Category {
  category: string;
  ingredients: SpoonacularIngredient[];
  
  constructor(category:string, ingredient:SpoonacularIngredient){
    this.category = category;
    this.ingredients = [];
    this.ingredients.push(ingredient);
  }
}
