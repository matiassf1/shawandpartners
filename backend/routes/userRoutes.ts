import { Router } from 'express';
import UserModel from '../models/UserModel';
import UserController from '../controllers/userController';

const router = Router();

const userModel = new UserModel();
const userController = new UserController(userModel);

router.get('/', userController.getUserData);

export default router;
