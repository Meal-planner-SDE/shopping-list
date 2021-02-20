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
   SpoonacularIngredientRaw,
   Measure} from './types';
import config from '../config';
import qs from 'qs';

import axios from 'axios';
// import { isError } from 'util';
axios.defaults.paramsSerializer = (params) => {
  return qs.stringify(params, { indices: false });
};

const category2shop = {
  "fish": "seafood",
  "meat" : "butcher", 
  "dairy": "dairy",
  "bread": "bakery",
  "vegetable" : "greengrocer",
  "other" : "supermarket"
} as {[key:string]: string}

let shop2category = {} as {[key:string]: string}

for (let category in category2shop){
  let shop = category2shop[category]
  shop2category[shop] = category;
}

const groupedCategories = {
  "fish": "fish",
  "sprouts" : "vegetable",
  "onion" : "vegetable",
  "fruit" : "vegetable",
  "spices" : "vegetable",
  "herbs" : "vegetable",
  "vegetable" : "vegetable",
  "meat" : "meat", 
  "steak": "meat",
  "cheese": "dairy",
  "milk": "dairy",
  "bread": "bread",
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
    //convert every element in grams
    let final_entries:{[key: number] : ShoppingListEntry;} = {}
    for(let entry of ingredients){
      // const ingredient_response = await axios.get<SpoonacularIngredientRaw>(`${config.SPOONACULAR_ADAPTER_URL}/ingredient/${entry.ingredient_id}`);
      // const ingredient = new SpoonacularIngredient(ingredient_response.data);
      if(entry.measure !== "g"){
        if(entry.quantity > 0){
          const response = await axios.get<Measure>(`${config.SPOONACULAR_ADAPTER_URL}/convert`, {
            params: {
              ingredientName: entry.ingredient_name,
              sourceAmount: entry.quantity,
              sourceUnit: entry.measure,
              targetUnit: "g"
            }
          });
          if(response.data.hasOwnProperty("error")){
            entry.quantity = 100;
          }else{
            entry.quantity = response.data.targetAmount;
          }
        }
      }
      entry.measure = "g";
      entry.quantity = Math.ceil(entry.quantity)
      if(!final_entries.hasOwnProperty(entry.ingredient_id)){
        final_entries[entry.ingredient_id] = entry;
      }else{
        final_entries[entry.ingredient_id].quantity += entry.quantity;
      }
    }
    console.log(Object.values(final_entries))
    const response = await axios.patch<ShoppingListEntry[]>(`${config.INTERNAL_DB_ADAPTER_URL}/users/${userId}/shoppingList`, Object.values(final_entries));
    return response.data;
  } catch (e) {
    console.error(e);
    return {
      error: e.toString(),
    };
  }
};

// {'meal_plan_id': 9,
//  'mp_user_id': 3,
//  'is_current': True, 
//  'daily_calories': 3070, 
//  'diet_type': 'vegan', 
//  'daily_plans': [
//     {'daily_plan_id': 26, 
//      'meal_plan_id': 9, 
//      'daily_plan_number': 0, 
//      'recipes': [
//        {'recipe_id': 716426}, 
//        {'recipe_id': 715594}
//       ]
//     }
//   ]
// }

export const getGroupedIngredients: (ingredients: Ingredient[]) => 
  Promise<Category[] | Error> = async (ingredients) => {
  try {
    
    
    let promises = ingredients.map((ingredient) => {
      return axios.get<SpoonacularIngredientRaw>(`${config.SPOONACULAR_ADAPTER_URL}/ingredient/${ingredient.ingredient_id}`);
    });
    let spoon_ingredients = (await Promise.all(promises)).map(ingredient => {
      return new SpoonacularIngredient(ingredient.data);
    }).filter(ingredient => 'name' in ingredient);
    // console.log(spoon_ingredients)
    
    let categories = {} as {[category_name: string]: Category};
    for (let ingredient of spoon_ingredients){
      let category_found = "other";
      if (ingredient.categoryPath !== undefined && ingredient.categoryPath.length > 0){
        for(const category of ingredient.categoryPath){
          if (category in groupedCategories){
            category_found = groupedCategories[category];
            break;
          }
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

export const searchNearbyShopsByCategories: (lat: number, lon: number, categories: Category[]) => 
  Promise<ShopsResult[] | Error> = async (lat, lon, categories) => {
  try {
    // const response = await axios.post<ShoppingListEntry[]>(`${config.SPOONACULAR_ADAPTER_URL}/users/${userId}/shoppingList`);
    if (!categories)
      throw new Error("Categories not found");
    const category_names = categories.map(category => {
      if (!(category.category in category2shop))
        throw new Error(`Unknown category '${category.category}'`)
      return category2shop[category.category];
    });
    // let body = {} as ShopsQuery;
    // body.area = query.area;
    // body.categories = category_names;
    let params ={
      lat: lat,
      lon: lon
    };
    const shops = await axios.post<ShopsResult[]>(
      `${config.OSM_ADAPTER_URL}/shopsByCoord`, category_names, {params: params});
    shops.data.forEach(shop_category => {
      shop_category.category = shop2category[shop_category.category]
    });
    return shops.data;
  } catch (e) {
    console.error(e);
    return {
      error: e.toString(),
    };
  }
};


