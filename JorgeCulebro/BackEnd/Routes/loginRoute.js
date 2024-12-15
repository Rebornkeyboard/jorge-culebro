import express from 'express';
//controller import
import { getUser } from '../Controllers/loginController.js';

const router = express.Router();

//route for login
router.get('/auth/:userName/:password', getUser);

export default router;