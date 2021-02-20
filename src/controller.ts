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
  getNumberParameter,
  getParameterFromRequest
} from './helper';

export const userRecipes = async (req: Request, res: Response) => {
  const userId = getNumberParameter(req, 'userId');
  if(userId !== false){
    res.send(await getUserRecipes(userId));
  } else {
    res.status(400);
    res.send({"error" : "Invalid userId format."});
  }
};

export const saveUserRecipes = async (req: Request, res: Response) => {
  const userId = getNumberParameter(req, 'userId');
  const recipes = req.body;

  console.log(recipes);
  if(userId !== false ){
    res.send(await saveRecipes(userId, recipes));
  } else {
    res.status(400);
    res.send({"error" : "Invalid userId format."});
  }
};

export const deleteUserRecipe = async (req: Request, res: Response) => {
  const userId = getNumberParameter(req, 'userId');
  const recipeId = getNumberParameter(req, 'recipeId');

  if(userId !== false && recipeId !== false){
    res.send(await deleteRecipe(userId, recipeId));
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
    res.send(await searchRecipe(query, diet, n));
  } else {
    res.status(400);
    res.send({"error" : "Parameter q and diet are required to search for recipes."});
  }
};

export const recipeDetails = async (req: Request, res: Response) => {
  const recipeId = getNumberParameter(req, 'recipeId');
  if(recipeId !== false){
    res.send(await getRecipeDetails(recipeId));
  } else {
    res.status(400);
    res.send({"error" : "Invalid recipeId format."});
  }
};

export const userShoppingList = async (req: Request, res: Response) => {
  const userId = getNumberParameter(req, 'userId');
  if(userId !== false){
    res.send(await getUserShoppingList(userId));
  } else {
    res.status(400);
    res.send({"error" : "Invalid userId format."});
  }
};

export const patchUserShoppingList = async (req: Request, res: Response) => {
  const userId = getNumberParameter(req, 'userId');
  if(userId !== false){
    res.send(await updateUserShoppingList(userId, req.body));
  } else {
    res.status(400);
    res.send({"error" : "Invalid userId format."});
  }
};

export const groupIngredients = async (req: Request, res: Response) => {
  res.send(await getGroupedIngredients(req.body));
};

export const nearbyShopsByCategories = async (req: Request, res: Response) => {
  const lat = getNumberFromRequest(req, 'lat');
  const lon = getNumberFromRequest(req, 'lon');
  if (lat !== false && lon !== false){
    res.send(await searchNearbyShopsByCategories(lat, lon, req.body));
  } else {
    res.status(400);
    res.send({"error": "Invalid lat or lon parameters."});
  }
};
