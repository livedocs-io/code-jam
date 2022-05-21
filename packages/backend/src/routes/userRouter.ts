import express from 'express';

import * as userController from '../controllers/user';

const userRouter = express.Router();

userRouter.get('/api/user', userController.createUser);
userRouter.post('/api/user/stock', userController.getStocksFromUser);

export default userRouter;
