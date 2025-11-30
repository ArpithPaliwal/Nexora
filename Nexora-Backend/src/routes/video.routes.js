import { Router } from 'express';
import { verifyJWT } from '../middlewares/auth.middleware.js';
import {
    getAllVideos,
    publishAVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    getUserVideos,
    getSubscribedVideos
} from '../controllers/video.controller.js';
import { upload } from '../middlewares/multer.middleware.js';

const router = Router();

router.use(verifyJWT);

router
    .route('/')
    .get(getAllVideos)
    .post(
        upload.fields([
            {
                name: 'videoFile',
                maxCount: 1
            },
            {
                name: 'thumbnail',
                maxCount: 1
            }
        ]),
        publishAVideo
    );
router.route('/v/subscribed').get(getSubscribedVideos);
router
    .route('/:videoId')
    .get(getVideoById)
    .delete(deleteVideo)
    .patch(upload.single('thumbnail'), updateVideo);
router.route('/videos/:userId').get(getUserVideos);

//router.route('/videos/subscribed').get(getSubscribedVideos); wont work unless kep above the dynamic route of userid , as it it treats both same 
export default router;
