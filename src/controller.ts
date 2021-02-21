/*********
 * Main controller
 *   Here you can define all the processing logics of your endpoints.
 *   It's a good approach to keep in here only the elaboration of the inputs
 *   and outputs, with complex logics inside other functions to improve
 *   reusability and maintainability. In this case, we've defined the complex
 *   logics inside the core.ts file!
 *   In a huge project, you should have multiple controllers, divided
 *   by the domain of the operation.
 */

import { Request, Response } from 'express';

import {
  deleteRecipe,
  getRecipeDetails,
  getUserRecipes,
  saveRecipes,
  searchRecipe,
  getUserShoppingList,
  updateUserShoppingList,
  getGroupedIngredients,
  searchNearbyShopsByCategories
} from './core';
import {
  getDietType,
  getNumberFromRequest,
  getFloatFromRequest,
  getNumberParameter,
  getParameterFromRequest
} from './helper';
import { isError } from './types';

export const userRecipes = async (req: Request, res: Response) => {
  const userId = getNumberParameter(req, 'userId');
  if(userId !== false){
    let recipes = await getUserRecipes(userId);
    if (isError(recipes)){
      res.status(400);
    }
    res.send(recipes);
  } else {
    res.status(400);
    res.send({"error" : "Invalid userId format."});
  }
};

export const saveUserRecipes = async (req: Request, res: Response) => {
  const userId = getNumberParameter(req, 'userId');

  if(userId !== false ){
    let recipes = await saveRecipes(userId, req.body);
    if (isError(recipes)){
      res.send(400);
    }
    res.send(recipes);
  } else {
    res.status(400);
    res.send({"error" : "Invalid userId format."});
  }
};

export const deleteUserRecipe = async (req: Request, res: Response) => {
  const userId = getNumberParameter(req, 'userId');
  const recipeId = getNumberParameter(req, 'recipeId');

  if(userId !== false && recipeId !== false){
    let recipe = await deleteRecipe(userId, recipeId);
    if (isError(recipe)){
      res.status(400);
    }
    res.send(recipe);
  } else {
    res.status(400);
    res.send({"error" : "Invalid userId or recipeId format."});
  }
};

export const recipes = async (req: Request, res: Response) => {
  const query = getParameterFromRequest(req, 'q');
  const diet = getDietType(req);
  const n = getNumberFromRequest(req, 'n') || 1;
  if(query !== false && diet !== false){
    let recipes = await searchRecipe(query, diet, n);
    if (isError(recipes)){
      res.status(400);
    }
    res.send(recipes);
  } else {
    res.status(400);
    res.send({"error" : "Parameter q and diet are required to search for recipes."});
  }
};

export const recipeDetails = async (req: Request, res: Response) => {
  const recipeId = getNumberParameter(req, 'recipeId');
  if(recipeId !== false){
    let recipe = await getRecipeDetails(recipeId);
    if (isError(recipe)){
      res.status(400);
    }
    res.send(recipe);
  } else {
    res.status(400);
    res.send({"error" : "Invalid recipeId format."});
  }
};

export const userShoppingList = async (req: Request, res: Response) => {
  const userId = getNumberParameter(req, 'userId');
  if(userId !== false){
    let shopping_list = await getUserShoppingList(userId);
    if (isError(shopping_list)){
      res.status(400);
    }
    res.send(shopping_list);
  } else {
    res.status(400);
    res.send({"error" : "Invalid userId format."});
  }
};

export const patchUserShoppingList = async (req: Request, res: Response) => {
  const userId = getNumberParameter(req, 'userId');
  if(userId !== false){
    let shopping_list = await updateUserShoppingList(userId, req.body);
    if (isError(shopping_list)){
      res.status(400);
    }
    res.send(shopping_list);
  } else {
    res.status(400);
    res.send({"error" : "Invalid userId format."});
  }
};

export const groupIngredients = async (req: Request, res: Response) => {
  let groups = await getGroupedIngredients(req.body);
  if (isError(groups)){
    res.status(400);
  }
  res.send(groups);
};

export const nearbyShopsByCategories = async (req: Request, res: Response) => {
  const lat = getFloatFromRequest(req, 'lat');
  const lon = getFloatFromRequest(req, 'lon');
  if (lat !== false && lon !== false){
    let shops = await searchNearbyShopsByCategories(lat, lon, req.body);
    if (isError(shops)){
      res.status(400);
    }
    res.send(shops);
  } else {
    res.status(400);
    res.send({"error": "Invalid lat or lon parameters."});
  }
};
