/*********
 * Core functionalities
 *   All the processing logics are defined here. In this way, we leave in the
 *   controller all the input/output filtering and selection, and here we write
 *   the "raw" logics. In this way they're also re-usable! :)
 *   Obviously, in a real project, those functionalities should be divided as well.
 *   "Core" is not a fixed word for this type of file, sometimes
 *   people put those functions in a Utils file, sometimes in a Helper
 *   file, sometimes in a Services folder with different files for every service..
 *   It really depends on your project, style and personal preference :)
 */

import { Error, SpoonacularRecipe, Recipe, ShoppingListEntry, Ingredient, Category, SpoonacularIngredient, SpoonacularIngredientRaw} from './types';
import config from '../config';
import qs from 'qs';

import axios from 'axios';
axios.defaults.paramsSerializer = (params) => {
  return qs.stringify(params, { indices: false });
};

export const getUserRecipes: (userId: number) => Promise<Recipe[] | Error> = async (userId) => {
  try {
    const response = await axios.get<Recipe[]>(`${config.INTERNAL_DB_ADAPTER_URL}/users/${userId}/recipes`);
    return response.data;
  } catch (e) {
    console.error(e);
    return {
      error: e.toString(),
    };
  }
};

export const saveRecipes: (userId: number, recipes: Recipe[]) => Promise<Recipe[] | Error> = async (userId, recipes) => {
  try {
    const response = await axios.post<Recipe[]>(`${config.INTERNAL_DB_ADAPTER_URL}/users/${userId}/recipes`, recipes);
    return response.data;
  } catch (e) {
    console.error(e);
    return {
      error: e.toString(),
    };
  }
};

export const deleteRecipe: (userId: number, recipeId: number) => Promise<Recipe | Error> = async (userId, recipeId) => {
  try {
    const response = await axios.delete<Recipe>(`${config.INTERNAL_DB_ADAPTER_URL}/users/${userId}/recipes/${recipeId}`);
    return response.data;
  } catch (e) {
    console.error(e);
    return {
      error: e.toString(),
    };
  }
};

export const searchRecipe: (query: string, diet:string, n: number) => Promise<SpoonacularRecipe[] | Error> = async (query, diet, n) => {
  try {
    const response = await axios.get<SpoonacularRecipe[]>(`${config.SPOONACULAR_ADAPTER_URL}/recipe`, {
      params: {
        q: query,
        diet: diet,
        n: n
      }
    });
    return response.data;
  } catch (e) {
    console.error(e);
    return {
      error: e.toString(),
    };
  }
};

export const getRecipeDetails: (recipeId: number) => Promise<SpoonacularRecipe | Error> = async (recipeId) => {
  try {
    const response = await axios.get<SpoonacularRecipe>(`${config.SPOONACULAR_ADAPTER_URL}/recipe/${recipeId}`);
    return response.data;
  } catch (e) {
    console.error(e);
    return {
      error: e.toString(),
    };
  }
};

export const getUserShoppingList: (userId: number) => Promise<ShoppingListEntry[] | Error> = async (userId) => {
  try {
    const response = await axios.get<ShoppingListEntry[]>(`${config.INTERNAL_DB_ADAPTER_URL}/users/${userId}/shoppingList`);
    return response.data;
  } catch (e) {
    console.error(e);
    return {
      error: e.toString(),
    };
  }
};

export const updateUserShoppingList: (userId: number, ingredients: ShoppingListEntry[]) => Promise<ShoppingListEntry[] | Error> = async (userId, ingredients) => {
  try {
    const response = await axios.patch<ShoppingListEntry[]>(`${config.INTERNAL_DB_ADAPTER_URL}/users/${userId}/shoppingList`, ingredients);
    return response.data;
  } catch (e) {
    console.error(e);
    return {
      error: e.toString(),
    };
  }
};

export const getGroupedIngredients: (ingredients: Ingredient[]) => Promise<{[category_name: string]: Category} | Error> = async (ingredients) => {
  try {
    let categories = {} as {[category_name: string]: Category};    
    for(const ingredient of ingredients){
      const response = await axios.get<SpoonacularIngredientRaw>(`${config.SPOONACULAR_ADAPTER_URL}/ingredient/${ingredient.ingredient_id}`);
      const responseIngredient = new SpoonacularIngredient(response.data);
      console.log(responseIngredient);
      
      for(const category of responseIngredient.categoryPath){
        if (! (category in categories)){
          categories[category] = new Category(category, responseIngredient);
        } else {
          categories[category].ingredients.push(responseIngredient);
        }
      }

    }
    return categories;
  } catch (e) {
    console.error(e);
    return {
      error: e.toString(),
    };
  }
};


