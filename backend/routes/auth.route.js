import express from 'express';
import { signup, login, logout, onboard } from '../controller/auth.controller.js';
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post('/signup' , signup);
router.post('/login' , login);
router.post('/logout' , logout);
router.post('/onboard',protectRoute , onboard);
router.get('/me', protectRoute, (req, res) =>  res.status(200).json({sucess: true, mesage: "Success", user: req.user}));
export default router;