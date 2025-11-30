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
app.use('/api/v1/users', userRouter);
app.use('/api/v1/videos', videoRouter);
app.use('/api/v1/videoDetails', videoDetailsRouter);
app.use('/api/v1/comments', commentRouter);
app.use('/api/v1/likes', likeRouter);
app.use('/api/v1/tweets', tweetRouter);
app.use('/api/v1/subscriptions', subscriptionRouter);
app.use('/api/v1/dashboard', dashboardRouter);
app.use('/api/v1/playlist', playlistRouter);
app.use('/api/v1/watchhistory',watchHistoryRouter);
app.use("/*", (req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

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
