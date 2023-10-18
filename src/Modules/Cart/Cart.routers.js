import { Router } from 'express'

import {asyncHandler}from '../../utlis/ErrorHandling.js'

import * as rules from '../../utlis/SystemRoles.js'
import * as CartControllers from'./cart.controllers.js'
import {isAuth}from'../../Middleware/auth.js'
const router = Router()


router.post('/Add',isAuth(),asyncHandler(CartControllers.Add))
router.delete('/Delete',isAuth(),
asyncHandler(CartControllers.DeletefromCart))

export default router