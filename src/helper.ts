/*********
 * Helper
 *   Here you can define all those functions that can be
 *   useful in several places but does not belong to any
 *   of the other files.
 */

import { Request } from 'express';
import { CaloriesData } from './types';

/**
 * Extract a specific parameter from the query-string
 * @param req The request (as given in the controller)
 * @param param The id of the parameter to be extracted
 * @return the value of the parameter if the parameter is
 * correct and available, false otherwise
 */
export const getNumberParameterFromRequest: (req: Request, param: string) => number | false = (
  req,
  param
) => {
  let value = req.params.n;

  if (typeof value !== 'string') {
    return false;
  }

  try {
    return parseInt(value);
  } catch (e) {
    console.error(`Error extracting number parameter:`, e);
    return false;
  }
};

/**
 * Parse a number parameter from a query
 * @param req The request (as given in the controller)
 * @param param The name of the number parameter to get
 * @return the value of the parameter if the parameter is
 * correct and available, false otherwise
 */
export const getNumberFromRequest: (req: Request, param: string) => number | false = (
  req,
  param
) => {
  let value = req.query[param];

  if (typeof value !== 'string') {
    return false;
  }

  try {
    const result = parseInt(value);
    return isNaN(result) ? false : result;
  } catch (e) {
    console.error(`Error extracting parameter ${param}:`, e);
    return false;
  }
};

export const getFloatFromRequest: (req: Request, param: string) => number | false = (
  req,
  param
) => {
  let value = req.query[param];

  if (typeof value !== 'string') {
    return false;
  }

  try {
    const result = parseFloat(value);
    return isNaN(result) ? false : result;
  } catch (e) {
    console.error(`Error extracting parameter ${param}:`, e);
    return false;
  }
};

/**
 * Get the "id" parameter from a query
 * @param req The request (as given in the controller)
 * @return the id if it is correct and available, false otherwise
 */
export const getNumberParameter: (req: Request, parameter: string) => number | false = (
  req,
  parameter
) => {
  let value = req.params[parameter];

  if (typeof value !== 'string') {
    return false;
  }

  try {
    return parseInt(value);
  } catch (e) {
    console.error(`Error extracting id parameter:`, e);
    return false;
  }
};

export const getStringParameter: (req: Request, parameter: string) => string | false = (
  req,
  parameter
) => {
  let value = req.params[parameter];
  if (typeof value !== 'string') {
    return false;
  }

  return value;
};

export const getActivityFactor: (req: Request) => string | false = (
  req
) => {
  let value = req.query["activityFactor"];
  try {
    let result = String(value);
    if(result !== "none" && result !== "light" && result !== "moderate" && result !== "very" && result !== "extra"){
      result = "moderate";
    }
    return result;
  } catch (e) {
    console.error(`Error extracting parameter activityFactor:`, e);
    return false;
  }
};

export const getDietType: (req: Request) => string | false = (
  req
) => {
  let value = req.query["diet"];
  try {
    let result = String(value);
    if(result !== "omni" && result !== "vegan" && result !== "vegetarian" && result !== "glutenFree"){
      result = "omni";
    }
    return result;
  } catch (e) {
    console.error(`Error extracting parameter diet:`, e);
    return false;
  }
};


/**
 * Get a parameter from the query
 * @param req The request (as given in the controller)
 * @param param The parameter to get from the request
 * @return the value of the parameter if the parameter is
 * correct and available, false otherwise
 */
export const getParameterFromRequest: (req: Request, param: string) => string | false = (
  req,
  param
) => {
  let value = req.query[param];
  try {
    return (value === undefined) ? false : String(value);
  } catch (e) {
    console.error(`Error extracting parameter ${param}:`, e);
    return false;
  }
};

export const getSexParameterFromRequest: (req: Request) => string | false = (
  req
) => {
  let value = req.query["sex"];
  try {
    let result = String(value);
    if(result !== "m" && result !== "f"){
      result = "m";
    }
    return result;
  } catch (e) {
    console.error(`Error extracting "sex" parameter :`, e);
    return false;
  }
};

/**
 * Extract id from the request query-string
 * @param req The request (as given in the controller)
 * @return the id if the parameter is correct and
 * available, false otherwise
 */
export const getIdFromRequest: (req: Request) => number | false = (req) => {
  return getNumberFromRequest(req, 'id');
};

function computeBMR(data: CaloriesData) {
  let result = 10 * data.weight + (6.25 * data.height) - 5 * data.age + 5;
  if(data.sex == "m"){
    result += 5;
  }else{
    result -= 161;
  }
  return result;
}

export const computeNeededCalories: (data: CaloriesData) => number = (data) => {
  const BMR = computeBMR(data);
  if(data.activityFactor == "none")
    return BMR * 1.2;
  else if(data.activityFactor == "light")
    return BMR * 1.375;
  else if(data.activityFactor == "moderate")
    return BMR * 1.55;
  else if(data.activityFactor == "very")
    return BMR * 1.725;
  else if(data.activityFactor == "extra")
    return BMR * 1.9;
  else 
    return 0;
}