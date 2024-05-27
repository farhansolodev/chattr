import express from "express";
import * as authController from "./auth.controller";
import { handleInvalidLogin, handleInvalidSignup } from "./auth.middleware";

const router = express.Router()

router.post('/signup', handleInvalidSignup, authController.signup);
router.post('/login', handleInvalidLogin, authController.login);

export default router