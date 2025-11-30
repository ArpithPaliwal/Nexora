import { Router } from 'express';
import { verifyJWT } from '../middlewares/auth.middleware.js';
import { getViedoDetails } from '../controllers/videoData.controller.js';


const router = Router();

router.use(verifyJWT);

router
    .route('/getVideoDetails/:videoId')
    .get(getViedoDetails)
    


export default router;
