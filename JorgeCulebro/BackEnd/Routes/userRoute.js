import express from 'express';
//controller import
import {
  createUser,
  getUser,
  getUsers,
  updateUser,
  deleteUser,
} from '../Controllers/userController.js';

const router = express.Router();

//routes
router.post('/create', createUser);
router.get('/read/:id', getUser);
router.put('/update/:id', updateUser);
router.delete('/delete/:id', deleteUser);
router.get('/', getUsers);

export default router;