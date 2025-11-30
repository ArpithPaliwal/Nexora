import { Router } from 'express';

import {verifyJWT} from "../middlewares/auth.middleware.js"
import { watchHistory } from '../controllers/watchHistory.controller.js';


const router = Router();
router.use(verifyJWT); // Apply verifyJWT middleware to all routes in this file

router.route("/").get(watchHistory);


export default router