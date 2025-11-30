import React, { Suspense, lazy } from "react";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import Layout from "../Layout";
import NotFound from "../pages/NotFound";
const Home = lazy(() => import("../pages/Home"));
const LandingPage = lazy(() => import("../pages/SignUpAndLogin/LandingPage"));
const Login = lazy(() => import("../pages/SignUpAndLogin/Login"));
const SignupForm = lazy(() => import("../pages/SignUpAndLogin/SignupForm"));
const WatchVideo = lazy(() => import("../pages/Videos/WatchVideo"));
const DashBoard = lazy(() => import("../pages/DashBoard"));
const UploadVideo = lazy(() => import("../pages/Videos/UploadVideo"));
const EditVideo = lazy(() => import("../pages/Videos/EditVideo"));
const Tweets = lazy(() => import("../pages/Tweets/Tweets"));
const CreateTweet = lazy(() => import("../pages/Tweets/CreateTweet"));
const EditTweet = lazy(() => import("../pages/Tweets/EditTweet"));
const SubscribedVideos = lazy(() => import("../pages/Videos/SubscribedVideos"));
const CreatePlaylist = lazy(() => import("../pages/PlayList/CreatePlaylist"));
const EditPlaylist = lazy(() => import("../pages/PlayList/EditPlaylist"));
const PlaylistContent = lazy(() => import("../pages/PlayList/PlaylistContent"));
const Settings = lazy(() => import("../pages/UserAccUpdates/Settings"));
const UpdateAccDetails = lazy(() =>
  import("../pages/UserAccUpdates/UpdateAccDetails")
);
const UpdateAvatar = lazy(() => import("../pages/UserAccUpdates/UpdateAvatar"));
const UpdateCoverImage = lazy(() =>
  import("../pages/UserAccUpdates/UpdateCoverImage")
);
const UpdatePassword = lazy(() =>
  import("../pages/UserAccUpdates/UpdatePassword")
);

function LoadingFallback() {
  return (
    <div className="text-center py-10 text-gray-600 text-lg">Loading…</div>
  );
}

const router = createBrowserRouter(
  createRoutesFromElements(
    
    <Route path="/" element={<Layout />}>
      <Route path="*" element={<NotFound />} />
      <Route
        path="/"
        element={
          <Suspense fallback={<LoadingFallback />}>
            <LandingPage />
          </Suspense>
        }
      />


      <Route
        path="/Home"
        element={
          <Suspense fallback={<LoadingFallback />}>
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          </Suspense>
        }
      />

      <Route
        path="/signupForm"
        element={
          <Suspense fallback={<LoadingFallback />}>
            <SignupForm />
          </Suspense>
        }
      />

      <Route
        path="/LoginForm"
        element={
          <Suspense fallback={<LoadingFallback />}>
            <Login />
          </Suspense>
        }
      />

      <Route
        path="/watch/:_id"
        element={
          <Suspense fallback={<LoadingFallback />}>
            <ProtectedRoute>
              <WatchVideo />
            </ProtectedRoute>
          </Suspense>
        }
      />

      <Route
        path="/DashBoard/:_id"
        element={
          <Suspense fallback={<LoadingFallback />}>
            <ProtectedRoute>
              <DashBoard />
            </ProtectedRoute>
          </Suspense>
        }
      />

      <Route
        path="/UploadVideo/:userId"
        element={
          <Suspense fallback={<LoadingFallback />}>
            <ProtectedRoute>
              <UploadVideo />
            </ProtectedRoute>
          </Suspense>
        }
      />

      <Route
        path="/EditVideo/:userId/:videoId"
        element={
          <Suspense fallback={<LoadingFallback />}>
            <ProtectedRoute>
              <EditVideo />
            </ProtectedRoute>
          </Suspense>
        }
      />

      <Route
        path="/Tweets"
        element={
          <Suspense fallback={<LoadingFallback />}>
            <ProtectedRoute>
              <Tweets />
            </ProtectedRoute>
          </Suspense>
        }
      />

      <Route
        path="/Tweets/createTweet/:userId"
        element={
          <Suspense fallback={<LoadingFallback />}>
            <ProtectedRoute>
              <CreateTweet />
            </ProtectedRoute>
          </Suspense>
        }
      />

      <Route
        path="/Tweets/EditTweet/:userId/:tweetId"
        element={
          <Suspense fallback={<LoadingFallback />}>
            <ProtectedRoute>
              <EditTweet />
            </ProtectedRoute>
          </Suspense>
        }
      />

      <Route
        path="/SubscribedVideos"
        element={
          <Suspense fallback={<LoadingFallback />}>
            <ProtectedRoute>
              <SubscribedVideos />
            </ProtectedRoute>
          </Suspense>
        }
      />

      <Route
        path="/CreatePlaylist/:userId"
        element={
          <Suspense fallback={<LoadingFallback />}>
            <ProtectedRoute>
              <CreatePlaylist />
            </ProtectedRoute>
          </Suspense>
        }
      />

      <Route
        path="/EditPlaylist/:userId/:playlistId"
        element={
          <Suspense fallback={<LoadingFallback />}>
            <ProtectedRoute>
              <EditPlaylist />
            </ProtectedRoute>
          </Suspense>
        }
      />

      <Route
        path="/PlaylistContent/:playlistId/:userId"
        element={
          <Suspense fallback={<LoadingFallback />}>
            <ProtectedRoute>
              <PlaylistContent />
            </ProtectedRoute>
          </Suspense>
        }
      />

      <Route
        path="/Settings"
        element={
          <Suspense fallback={<LoadingFallback />}>
            <ProtectedRoute>
              <Settings />
            </ProtectedRoute>
          </Suspense>
        }
      />

      <Route
        path="/Settings/UpdateAccDetails"
        element={
          <Suspense fallback={<LoadingFallback />}>
            <ProtectedRoute>
              <UpdateAccDetails />
            </ProtectedRoute>
          </Suspense>
        }
      />

      <Route
        path="/Settings/UpdateAvatar"
        element={
          <Suspense fallback={<LoadingFallback />}>
            <ProtectedRoute>
              <UpdateAvatar />
            </ProtectedRoute>
          </Suspense>
        }
      />

      <Route
        path="/Settings/UpdateCoverImage"
        element={
          <Suspense fallback={<LoadingFallback />}>
            <ProtectedRoute>
              <UpdateCoverImage />
            </ProtectedRoute>
          </Suspense>
        }
      />

      <Route
        path="/Settings/UpdatePassword"
        element={
          <Suspense fallback={<LoadingFallback />}>
            <ProtectedRoute>
              <UpdatePassword />
            </ProtectedRoute>
          </Suspense>
        }
      />
      
    </Route>
      
  )
);

export default router;
