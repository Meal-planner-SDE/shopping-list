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
  getUserByUsername,
  insertUser,
  updateUser,
  computeCalories,
  getMealPlans,
  getMealPlanById,
  generateMealPlan
} from './core';
import {
  getActivityFactor,
  getDietType,
  getNumberFromRequest,
  getNumberParameter,
  getNumberParameterFromRequest,
  getParameterFromRequest,
  getSexParameterFromRequest,
  getStringParameter
} from './helper';
import { CaloriesData } from './types';

export const user = async (req: Request, res: Response) => {
  const username = getStringParameter(req, 'username');
  if(username !== false){
    res.send(await getUserByUsername(username));
  } else {
    res.status(400);
    res.send({"error" : "Invalid username format."});
  }
};

export const postUser = async (req: Request, res: Response) => {
  res.send(await insertUser(req.body));
};

export const patchUser = async (req: Request, res: Response) => {
  const id = getNumberParameter(req, 'userId');
  if(id !== false){
    res.send(await updateUser(id, req.body));
  } else {
    res.status(400);
    res.send({"error" : "Invalid id format."});
  }
};

export const calories = async (req: Request, res: Response) => {
  const height = getNumberFromRequest(req, 'height');
  const weight = getNumberFromRequest(req, 'weight');
  const age = getNumberFromRequest(req, 'age');
  const sex = getSexParameterFromRequest(req);
  const activityFactor = getActivityFactor(req);
  if(height !== false && weight !== false && age !== false && sex !== false && activityFactor !== false){
      const caloriesData:CaloriesData = {
        height: height,
        weight: weight,
        age: age,
        sex: sex,
        activityFactor: activityFactor
      }
      res.send(await computeCalories(caloriesData));
  }else{
    res.status(400);
    res.send({ error: 'height, weight, age, sex and activityFactor are required.' });
  }
};

export const mealPlans = async (req: Request, res: Response) => {
  const userId = getNumberParameter(req, 'userId');

  if(userId !== false){
    res.send(await getMealPlans(userId));
  } else {
    res.status(400);
    res.send({"error": "Invalid userId format."});
  }
};

export const mealPlanById = async (req: Request, res: Response) => {
  const userId = getNumberParameter(req, 'userId');
  const mealPlanId = getNumberParameter(req, 'mealPlanId');

  if(userId !== false && mealPlanId !== false){
    res.send(await getMealPlanById(userId, mealPlanId));
  } else {
    res.status(400);
    res.send({"error": "Invalid userId or mealPlanId format."});
  }
};

export const createMealPlan = async (req: Request, res: Response) => {
  const calories = getNumberFromRequest(req, 'calories');
  const days = getNumberFromRequest(req, 'n');
  const mealsPerDay = getNumberFromRequest(req, 'm');
  const dietType = getDietType(req);

  console.log(calories, days, mealsPerDay, dietType);
  if(calories !== false && days !== false && mealsPerDay !== false && dietType!== false){
    res.send(await generateMealPlan(calories, days, mealsPerDay, dietType));
  } else {
    res.status(400);
    res.send({"error": "Parameters calories, n, m and dietType are required."});
  }
};