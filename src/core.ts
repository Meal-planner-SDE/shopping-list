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

import { Error, isError,
   SpoonacularRecipe, 
   Recipe, 
   ShoppingListEntry, 
   Ingredient, 
   Category, 
   Shop,
   ShopsQuery,
   ShopsResult,
   Area,
   SpoonacularIngredient, 
   SpoonacularIngredientRaw} from './types';
import config from '../config';
import qs from 'qs';

import axios from 'axios';
// import { isError } from 'util';
axios.defaults.paramsSerializer = (params) => {
  return qs.stringify(params, { indices: false });
};

const category2shop = {
  "fish": "seafood",
  "sprouts" : "greengrocer",
  "onion" : "greengrocer",
  "fruit" : "greengrocer",
  "spices" : "greengrocer",
  "herbs" : "greengrocer",
  "meat" : "butcher", 
  "steak": "butcher",
  "cheese": "dairy",
  "bread": "bakery",
  "vegetable" : "greengrocer",
  "other" : "supermarket"
} as {[key:string]: string}


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

export const getGroupedIngredients: (ingredients: Ingredient[]) => 
  Promise<Category[] | Error> = async (ingredients) => {
  try {
    
    let categories = {} as {[category_name: string]: Category};

    let promises = ingredients.map((ingredient) => {
      return axios.get<SpoonacularIngredientRaw>(`${config.SPOONACULAR_ADAPTER_URL}/ingredient/${ingredient.ingredient_id}`);
    });
    let spoon_ingredients = (await Promise.all(promises)).map(ingredient => {
      return new SpoonacularIngredient(ingredient.data);
    }).filter(ingredient => ingredient.categoryPath != null);

    for (let ingredient of spoon_ingredients){
      let category_found = "other";
      for(const category of ingredient.categoryPath){
        if (category in category2shop){
          category_found = category;
          break;
        }
      }
      if (! (category_found in categories)){
        categories[category_found] = new Category(category_found, ingredient);
      } else {
        categories[category_found].ingredients.push(ingredient);
      }
    }
    return Object.values(categories);
} catch (e) {
  console.error(e);
  return {
    error: e.toString(),
  };
}
};

export const searchNearbyShopsByCategories: (query:{area: Area, categories: Category[]}) => 
  Promise<ShopsResult[] | Error> = async (query) => {
  try {
    // const response = await axios.post<ShoppingListEntry[]>(`${config.SPOONACULAR_ADAPTER_URL}/users/${userId}/shoppingList`);
    if (!query.categories)
      throw new Error("Categories not found");
    const category_names = query.categories.map(category => {
      if (category.category in category2shop)
        throw new Error(`Unknown category '${category.category}'`)
      return category2shop[category.category];
    });
    let body = {} as ShopsQuery;
    body.area = query.area;
    body.categories = category_names;
    const shops = await axios.post<ShopsResult[]>(`${config.OSM_ADAPTER_URL}/shops`, body);
    return shops.data;
  } catch (e) {
    console.error(e);
    return {
      error: e.toString(),
    };
  }
};


