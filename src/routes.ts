/*********
 * Route definitions
 *   All the routes that you want to implement should be defined here!
 *   You should avoid to put code here: it's a better approach to call
 *   methods from the controllers in order to process the requests!
 *   In this way, here you can have a more organized way to check all
 *   your routes!
 *   In a huge project, you can define multiple routers in order to divide
 *   the endpoints in different files by the domain of their operation.
 */

import express from 'express';
import {
  userRecipes,
  recipeDetails,
  recipes,
  saveUserRecipes,
  deleteUserRecipe,
  userShoppingList,
  patchUserShoppingList,
  groupIngredients
} from './controller';

const router = express.Router();


router.get('/users/:userId/recipes', userRecipes);
router.post('/users/:userId/recipes', saveUserRecipes);
router.delete('/users/:userId/recipes', deleteUserRecipe);

router.get('/users/:userId/shoppingList', userShoppingList);
router.patch('/users/:userId/shoppingList', patchUserShoppingList);

router.post('/groupIngredients', groupIngredients);

router.get('/recipes', recipes);
router.get('/recipes/:recipeId', recipeDetails);





export default router;
