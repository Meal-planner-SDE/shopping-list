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

import { Error, MPUser, CaloriesData, MealPlan, SpoonacularRecipe, DailyPlan, Recipe} from './types';
import config from '../config';
import qs from 'qs';

import axios from 'axios';
import { computeNeededCalories } from './helper';
axios.defaults.paramsSerializer = (params) => {
  return qs.stringify(params, { indices: false });
};


export const getUserByUsername: (user_name: string) => Promise<MPUser | Error> = async (user_name) => {
  try {
    const response = await axios.get<MPUser>(`${config.INTERNAL_DB_ADAPTER_URL}/users/${user_name}`);
    return response.data;
  } catch (e) {
    console.error(e);
    return {
      error: e.toString(),
    };
  }
};

export const insertUser: (user : MPUser) => Promise<MPUser | Error> = async (user) => {
  try {
    const response = await axios.post<MPUser>(`${config.INTERNAL_DB_ADAPTER_URL}/users/`, user);
    return response.data;
  } catch (e) {
    console.error(e);
    return {
      error: e.toString(),
    };
  }
};

export const updateUser: (id: number, user : MPUser) => Promise<MPUser | Error> = async (id, user) => {
  try {
    const response = await axios.patch<MPUser>(`${config.INTERNAL_DB_ADAPTER_URL}/users/${id}`, user);
    return response.data;
  } catch (e) {
    console.error(e);
    return {
      error: e.toString(),
    };
  }
};

export const computeCalories: (data: CaloriesData) => Promise<Object | Error> = async (data) => {
  return {neededCalories: computeNeededCalories(data)};
};

export const getMealPlans: (userId: number) => Promise<MealPlan[] | Error> = async (userId) => {
  try {
    const response = await axios.get<MealPlan[]>(`${config.INTERNAL_DB_ADAPTER_URL}/users/${userId}/mealPlans`);
    return response.data;
  } catch (e) {
    console.error(e);
    return {
      error: e.toString(),
    };
  }
};

export const getMealPlanById: (userId: number, mealPlanId: number) => Promise<MealPlan | Error> = async (userId, mealPlanId) => {
  try {
    const response = await axios.get<MealPlan>(`${config.INTERNAL_DB_ADAPTER_URL}/users/${userId}/mealPlans/${mealPlanId}`);
    return response.data;
  } catch (e) {
    console.error(e);
    return {
      error: e.toString(),
    };
  }
};

export const generateMealPlan: (calories: number, days: number, mealsPerDay: number, dietType: string) => Promise<MealPlan | Error> = async (calories, days, mealsPerDay, dietType) => {
  try {
    const totalRecipes = days * mealsPerDay;
    const response = await axios.get<SpoonacularRecipe[]>(`${config.SPOONACULAR_ADAPTER_URL}/recipe`, {
      params: {
        diet: dietType,
        n: totalRecipes
      }
    });
    let k=0;
    let dailyPlans:DailyPlan[] = [];
    for(let i=0; i<days; i++){
      let recipes:SpoonacularRecipe[] = [];
      for(let j=0; j<mealsPerDay; j++){
        recipes.push(response.data[k] as SpoonacularRecipe);
        k++;
      }
      let dailyPlan = {recipes: recipes}; 
      dailyPlans.push(dailyPlan);
    }

    let result:MealPlan = {
      daily_calories: calories,
      diet_type: dietType,
      daily_plans: dailyPlans
    };

    return result;
  } catch (e) {
    console.error(e);
    return {
      error: e.toString(),
    };
  }
};


