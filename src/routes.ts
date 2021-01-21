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
  user,
  postUser,
  patchUser,
  calories,
  mealPlans,
  mealPlanById,
  createMealPlan
} from './controller';

const router = express.Router();

router.get('/users/:username', user);
router.post('/users', postUser);
router.patch('/users/:userId', patchUser);

router.get('/calories', calories);

router.get('/users/:userId/mealPlans', mealPlans);
router.get('/users/:userId/mealPlans/:mealPlanId', mealPlanById);
// router.post('/users/:userId/mealPlans', saveMealPlan);

router.get('/mealPlans', createMealPlan);




export default router;
