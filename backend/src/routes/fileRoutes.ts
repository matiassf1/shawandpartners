import { Router } from 'express';
import UserModel from '../models/UserModel';
import FileController from '../controllers/fileController';
import FileUploadService from '../services/fileUpload';

const router = Router();

const fileUploadService = new FileUploadService();
const userModel = new UserModel();
const fileController = new FileController(fileUploadService, userModel);

router.post('/', fileController.uploadFile);

export default router;
