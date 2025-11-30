import { asyncHandler } from '../utils/asyncHandler.js';
import { apiError } from '../utils/apiError.js';
import { User } from '../models/user.model.js';
import { uploadOnCloudinary } from '../utils/cloudinary.js';
import fs from 'fs';
import path from 'path';
import { apiResponse } from '../utils/apiResponse.js';
import jwt from 'jsonwebtoken';
import mongoose, { mongo } from 'mongoose';

const tempFolder = path.join(process.cwd(), 'public', 'temp');

const generateAccessTokenAndRfereshToken = async (userId) => {
    try {
        const user = await User.findById(userId);
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false }); // becz password feild is complusory every tiem we , save , but as here we want tht exp=ception we asked it to turn off the validation for this save

        return { accessToken, refreshToken };
    } catch (error) {
        console.log(
            'something went wrong while generating accestoken and refresh token '
        );
    }

    //here we can also use findandupdate , and it will automatically skips the validation
};

//register user
const registerUser = asyncHandler(async (req, res) => {
    //stratergy or algo
    //get usert details from front end
    //validation - not empty
    //check if user already exists : username , email
    //check for images ,check for avatar
    //upload them ti cloudinary , avatar
    //create user object - create entry in db
    //remove password and refresh token field from response
    //check for user creation
    //return res

    const { fullName, email, username, password } = req.body;
    //console.log('email :', email);

    if (
        [fullName, email, username, password].some(
            (field) => field?.trim() == ''
        )
    ) {
        throw new apiError(400, 'All fields are required');
    }

    const existedUser = await User.findOne({
        // to find one or the other filed , any ones response is ok then or is used
        $or: [{ username }, { email }]
    });

    if (existedUser) {
        try {
            if (fs.existsSync(tempFolder)) {
                const files = fs.readdirSync(tempFolder);
                files.forEach((file) => {
                    const filePath = path.join(tempFolder, file);
                    fs.unlinkSync(filePath);
                    console.log('Deleted file:', filePath);
                });
                console.log('All files in temp folder deleted.');
            }
        } catch (err) {
            console.error('Error deleting files in temp folder:', err);
        }
        throw new apiError(
            409,
            'User with this email or username already exists'
        );
    }

    //just like req has body , req.body , this multer as a middleware adds , req.files for files

    const avatarLocalPath = req.files?.avatar[0]?.path;
    console.log(avatarLocalPath);

    // const coverImageLocalPath = req.files?.coverImage[0]?.path;
    let coverImageLocalPath;
    if (
        req.files &&
        Array.isArray(req.files.coverImage) &&
        req.files.coverImage.length > 0
    ) {
        coverImageLocalPath = req.files?.coverImage[0].path;
    }

    if (!avatarLocalPath) {
        throw new apiError(400, 'Avatar file is required ,, path not found');
    }

    console.log('Uploading to Cloudinary:', avatarLocalPath);
    const avatar = await uploadOnCloudinary(avatarLocalPath);
    console.log('Cloudinary response:', avatar);
    const coverImage = await uploadOnCloudinary(coverImageLocalPath);
    if (!avatar) {
        throw new apiError(400, 'Avatar files is required');
    }

    // create db

    const user = await User.create({
        fullName,
        avatar: avatar.url,
        coverImage: coverImage?.url || '',
        email,
        password,
        username: username.toLowerCase()
    });

    //verify if user is created or not

    const createdUser = await User.findById(user._id).select(
        '-password -refreshToken'
    );

    if (!createdUser) {
        throw new apiError(
            500,
            'Something went wrong while registering the user'
        );
    }

    return res
        .status(201)
        .json(
            new apiResponse(200, createdUser, 'User registered successfully ')
        );
});

//login

const loginUser = asyncHandler(async (req, res) => {
    //req body ->data
    //username or email
    //find the user
    // password check
    //acces and refresh token
    //send cookies
    const { email, username, password } = req.body;
    if (!username && !email) {
        throw new apiError(400, 'username or email required');
    }

    const user = await User.findOne({ $or: [{ username }, { email }] });

    if (!user) {
        throw new apiError(400, 'User does not exist');
    }

    const isPasswordValid = await user.isPasswordCorrect(password);

    if (!isPasswordValid) {
        throw new apiError(400, 'invalid user credentails');
    }

    const { accessToken, refreshToken } =
        await generateAccessTokenAndRfereshToken(user._id);

    const loggedInUser = await User.findById(user._id).select(
        '-password -refreshToken'
    ); // .selcet : in loggedinuser , every data of db is present of tht user except his or her password and refresh token

    //write cookies
    const options = {
        httpOnly: true, //→ Makes the cookie inaccessible to JavaScript on the frontend (document.cookie).and Ensures cookies are only sent over HTTPS (not plain HTTP).
        secure: true
    };

    return res
        .status(200)
        .cookie('accessToken', accessToken, options)
        .cookie('refreshToken', refreshToken, options)
        .json(
            new apiResponse(
                200,
                {
                    user: loggedInUser,
                    accessToken,
                    refreshToken
                },
                'user logged in succesfully'
            )
        );
});

//logout

const logoutUser = asyncHandler(async (req, res) => {
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $unset: { refresToken: 1 }
        },
        {
            new: true
        }
    ); //we currently dont need thus new , it gives the new and updated response value
    const options = {
        httpOnly: true, //→ Makes the cookie inaccessible to JavaScript on the frontend (document.cookie).and Ensures cookies are only sent over HTTPS (not plain HTTP).
        secure: true
    };

    return res
        .status(200)
        .clearCookie('accessToken', options)
        .clearCookie('refreshToken', options)
        .json(new apiResponse(200, {}, 'user loged out'));
});

//refreshAccessToken

const refreshAccessToken = asyncHandler(async (req, res) => {
    const incomingRefreshToken =
        req.cookies.refreshToken || req.body.refreshToken;

    if (!incomingRefreshToken) {
        throw new apiError(401, 'unauthorized request');
    }

    try {
        const decodeduser = jwt.verify(
            incomingRefreshToken,
            process.env.REFRESH_TOKEN_SECRET
        );

        const user = await User.findById(decodeduser._id);
        if (!user) {
            throw new apiError(401, 'unauthorized request ');
        }

        if (incomingRefreshToken != user?.refreshToken) {
            throw new apiError(401, ' api token is expired or used ');
        }

        const { accessToken, newrefreshToken } =
            await generateAccessTokenAndRfereshToken(decodeduser._id);

        const options = {
            httpOnly: true,
            secure: true
        };

        return res
            .status(200)
            .cookie('accessToken', accessToken, options)
            .cookie('refreshToken', newrefreshToken, options)
            .json(
                new apiResponse(
                    200,
                    { accessToken, refresToken: newrefreshToken },
                    'accestoken refreshed '
                )
            );
    } catch (error) {
        throw new apiError(401, error?.message || 'invalid refresh token');
    }
});

//change password
const changeUserPassword = asyncHandler(async (req, res) => {
    const { oldPassword, newPassword } = req.body;
    const user = await User.findById(req.user?._id);
    const isPasswordCorrect = await user.isPasswordCorrect(oldPassword);
    if (!isPasswordCorrect) {
        throw new apiError(400, 'invalid old password');
    }
    user.password = newPassword;
    await user.save({ validateBeforeSave: false });
    return res
        .status(200)
        .json(new apiResponse(200, {}, 'password changed succesfully '));
});

//get current user
const getCurrentUser = asyncHandler(async (req, res) => {
    return res
        .status(200)
        .json(
            new apiResponse(200, req.user, 'current user fetched succesfully ')
        );
});

//update account details

const updateAccountDetails = asyncHandler(async (req, res) => {
    const { fullName, email, username } = req.body;
    if (!username || !email) {
        throw new apiError(401, 'username and email are required ');
    }

    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set: {
                username,
                email,
                fullName
            }
        },
        { new: true }
    ).select('-password');

    return res
        .status(200)
        .json(new apiResponse(200, 'updated account details succcesfully '));
});

//files update
//avatar
const updateUserAvatar = asyncHandler(async (req, res) => {
    const avatarLocal = req.file?.path; // here file becz only we need to update onle field tht is avatar , in previous we took files as there were two files

    if (!avatarLocal) {
        throw new apiError(401, 'avatar file is missing');
    }

    // Delete old image from Cloudinary if exists
    const oldavatarImage = req.user.avatar?.public_id;
    try {
        const avatar = await uploadOnCloudinary(avatarLocal);
        if (!avatar) {
            throw new apiError(
                401,
                'error while uploading file to cloudinary [avatar]'
            );
        }
        const user = await User.findByIdAndUpdate(
            req.user?._id,
            {
                $set: {
                    avatar: avatar.url
                }
            },
            { new: true }
        );
        if (user) {
            if (oldavatarImage) {
                await cloudinary.uploader.destroy(oldavatarImage);
            }
        }
        return res
            .status(200)
            .json(new apiResponse(200, user, 'avatar updated succesfully '));
    } catch (error) {
        return error?.message || ' failed to update avatar ';
    }
});

//cover image
const updateUserCoverImage = asyncHandler(async (req, res) => {
    const coverImageLocal = req.file?.path; // here file becz only we need to update onle field tht is avatar , in previous we took files as there were two files
    if (!coverImageLocal) {
        throw new apiError(401, 'coverimage file is missing');
    }

    const oldcoverImage = req.user.cover?.public_id;

    try {
        const coverImage = await uploadOnCloudinary(coverImageLocal);
        if (!coverImage) {
            throw new apiError(
                401,
                'error while uploading file to cloudinary [coverImage]'
            );
        }
        const user = await User.findByIdAndUpdate(
            req.user?._id,
            {
                $set: {
                    coverImage: coverImage.url
                }
            },
            { new: true }
        );

        if (user) {
            if (oldcoverImage) {
                await cloudinary.uploader.destroy(oldcoverImage);
            }
        }

        return res
            .status(200)
            .json(
                new apiResponse(200, user, 'coverImage updated succesfully ')
            );
    } catch (error) {
        return error?.message || 'failed to update cover image ';
    }
});
//get user channel profiel
const getUserChannelProfile = asyncHandler(async (req, res) => {
    const { _id } = req.params;

     if (!_id) {
        throw new apiError(400, "User ID is missing in params");
    }


    const channel = await User.aggregate([
        {
            //we are going to show no of subscriber user has and also no of channel he has subscribed to along with tht , if i am subscribed to him or not : situation : im viewing some ones page from my acc
            $match: {
                _id: new mongoose.Types.ObjectId(_id)
            }
        },
        {
            $lookup: {
                from: 'subscriptions', // model name become lowercase and becomes pural
                localField: '_id',
                foreignField: 'channel',
                as: 'subscribers'
            }
        },
        {
            $lookup: {
                from: 'subscriptions', // model name become lowercase and becomes pural
                localField: '_id',
                foreignField: 'subscriber',
                as: 'subscribedTo'
            }
        },
        {
            $addFields: {
                subscribersCount: {
                    $size: '$subscribers'
                },
                channelsSubscribedToCount: {
                    $size: '$subscribedTo'
                },
                isSubscribed: {
                    $cond: {
                        if: { $in: [req.user?._id, '$subscribers.subscriber'] },
                        then: true,
                        else: false
                        //your array is subscribers,and inside that array, each document has a field called subscriber (singular).=> from schema
                    }
                }
            }
        },
        {
            $project: {
                fullName: 1,
                username: 1,
                subscribersCount: 1,
                channelsSubscribedToCount: 1,
                isSubscribed: 1,
                coverImage: 1,
                avatar: 1,
                email: 1,
                isOwner:{
                    $eq:["$_id",new mongoose.Types.ObjectId(req.user._id)]
                }

            }
        }
    ]);

    if (!channel?.length) {
        throw new apiError(401, 'channel not found ');
    }

    return res
        .status(200)
        .json(
            new apiResponse(200, channel[0], 'user channel fetched succesfully')
        ); // channel[0] becz if we print channel we will get channel = [{name="fgf", etc etc }] , it will be wrapped in array , so to avoid tht and directly give the object we do this
});
//watch histroy
const getWatchHistory = asyncHandler(async (req, res) => {
  const userId = new mongoose.Types.ObjectId(req.user._id);

  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;

  const aggregateQuery = User.aggregate([
    { $match: { _id: userId } },

    {
      $lookup: {
        from: "videos",
        localField: "watchHistory",
        foreignField: "_id",
        as: "historyVideos",
        pipeline: [
          {
            $lookup: {
              from: "users",
              localField: "owner",
              foreignField: "_id",
              as: "ownerDetails",
              pipeline: [
                { $project: { _id: 1, username: 1, avatar: 1 } }
              ]
            }
          },
          { $unwind: "$ownerDetails" },

          {
            $project: {
              _id: 1,
              title: 1,
              description: 1,
              views: 1,
              createdAt: 1,
              thumbnail: 1,
              videoFile: 1,
              publicId: 1,
              duration: 1,

              ownerId: "$ownerDetails._id",
              username: "$ownerDetails.username",
              avatar: "$ownerDetails.avatar"
            }
          }
        ]
      }
    },

    // Flatten historyVideos
    { $unwind: "$historyVideos" },

    { $replaceRoot: { newRoot: "$historyVideos" } }
  ]);

  const options = {
    page,
    limit,
    
  };

  const result = await User.aggregatePaginate(aggregateQuery, options);

  return res
    .status(200)
    .json(new apiResponse(200, result, "Watch history fetched successfully"));
});



export {
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken,
    changeUserPassword,
    getCurrentUser,
    updateAccountDetails,
    updateUserAvatar,
    updateUserCoverImage,
    getUserChannelProfile,
    getWatchHistory
};
