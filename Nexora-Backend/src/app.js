import express, { urlencoded } from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';

const app = express();
app.set("trust proxy", 1);

// Allowed origins from env
const allowedOrigins = process.env.CORS_ORIGIN.split(",").map(origin => origin.trim());

// CORS middleware
app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (Postman, mobile apps)
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("CORS blocked"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Handle preflight requests
app.options("*", cors());
app.use(express.json({ limit: '16kb' }));
app.use(express.urlencoded({ extended: true, limit: '16kb' }));
app.use(express.static('public'));
app.use(cookieParser());

//routes imprt
import userRouter from './routes/user.routes.js';
import videoRouter from './routes/video.routes.js';
import videoDetailsRouter from "./routes/videoData.route.js"
import commentRouter from './routes/comment.routes.js';
import likeRouter from './routes/like.routes.js';
import tweetRouter from './routes/tweet.routes.js';
import subscriptionRouter from './routes/subscription.routes.js';
import dashboardRouter from './routes/dashboard.routes.js';
import playlistRouter from './routes/playlist.routes.js';
import watchHistoryRouter from './routes/watchhistory.routes.js';
//routes declaration
// safe mount helper to log and catch mount errors (diagnostic)
const safeMount = (mountPath, router, name) => {
  try {
    console.log(`Mounting ${name} at ${mountPath}`);
    app.use(mountPath, router);
    console.log(`Mounted ${name} at ${mountPath}`);
  } catch (err) {
    console.error(`Failed to mount ${name} at ${mountPath}:`, err);
    throw err;
  }
};

safeMount('/api/v1/users', userRouter, 'userRouter');
safeMount('/api/v1/videos', videoRouter, 'videoRouter');
safeMount('/api/v1/videoDetails', videoDetailsRouter, 'videoDetailsRouter');
safeMount('/api/v1/comments', commentRouter, 'commentRouter');
safeMount('/api/v1/likes', likeRouter, 'likeRouter');
safeMount('/api/v1/tweets', tweetRouter, 'tweetRouter');
safeMount('/api/v1/subscriptions', subscriptionRouter, 'subscriptionRouter');
safeMount('/api/v1/dashboard', dashboardRouter, 'dashboardRouter');
safeMount('/api/v1/playlist', playlistRouter, 'playlistRouter');
safeMount('/api/v1/watchhistory', watchHistoryRouter, 'watchHistoryRouter');

app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    return res
        .status(statusCode)
        .json({
            success: err.success || false,
            message: err.message || 'Internal server error',
            errors: err.errors || [],
            data: err.data || null
        });
});
export { app };
