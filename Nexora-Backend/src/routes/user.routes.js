import {Router} from "express"
import {changeUserPassword, getCurrentUser, getUserChannelProfile, getWatchHistory, loginUser, logoutUser, refreshAccessToken, registerUser, updateAccountDetails, updateUserAvatar, updateUserCoverImage} from "../controllers/user.controller.js"
import {upload} from "../middlewares/multer.middleware.js"
import { verifyJWT } from "../middlewares/auth.middleware.js"

const router = Router()
//midleware are written first in .post example upload from multer , and fields is fro multiple feilds i,e phots with diffrent names

router.route("/register").post(upload.fields([
    {
        name:"avatar",
        maxCount:1
    },
    {
        name:"coverImage",
        maxCount:1 //number of images
    }
]
),registerUser)

router.route("/login").post(loginUser)

router.route("/logout").post(verifyJWT,logoutUser)

router.route("/refresh-token").post(refreshAccessToken)

router.route("/change-password").post(verifyJWT,changeUserPassword)

router.route("/current-user").get(verifyJWT,getCurrentUser)

router.route("/update-account").patch(verifyJWT,updateAccountDetails)

router.route("/update-avatar").patch(verifyJWT,upload.single("avatar"),updateUserAvatar)

router.route("/update-cover-image").patch(verifyJWT,upload.single("coverImage"),updateUserCoverImage)
router.route("/history").get(verifyJWT,getWatchHistory)
router.route("/channel/:_id").get(verifyJWT,getUserChannelProfile)


export default router