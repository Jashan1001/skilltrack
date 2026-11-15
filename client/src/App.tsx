import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";

import { ThemeProvider } from "./context/themeContext";

import ProtectedRoute from "./routes/ProtectedRoute";
import AppLayout from "./layouts/AppLayout";

const LoginPage = lazy(() => import("./pages/LoginPage"));
const RegisterPage = lazy(() => import("./pages/RegisterPage"));
const HomePage = lazy(() => import("./pages/HomePage"));
const PatternsPage = lazy(() => import("./pages/PatternsPage"));
const PatternDetailPage = lazy(() => import("./pages/PatternDetailPage"));
const ProblemsPage = lazy(() => import("./pages/ProblemsPage"));
const ProblemDetailPage = lazy(() => import("./pages/ProblemDetailPage"));
const ProblemLeaderboardPage = lazy(() => import("./pages/ProblemLeaderboardPage"));
const SubmissionHistoryPage = lazy(() => import("./pages/SubmissionHistoryPage"));
const DashboardPage = lazy(() => import("./pages/DashboardPage"));
const CreateProblemPage = lazy(() => import("./pages/CreateProblemPage"));
const EditProblemPage = lazy(() => import("./pages/EditProblemPage"));
const GlobalLeaderboardPage = lazy(() => import("./pages/GlobalLeaderboardPage"));
const SubmissionDetailPage = lazy(() => import("./pages/SubmissionDetailPage"));
const ProfilePage = lazy(() => import("./pages/ProfilePage"));
const OAuthCallbackPage = lazy(() => import("./pages/OAuthCallbackPage"));
const AdminAnalyticsPage = lazy(() => import("./pages/AdminAnalyticsPage"));
const ForgotPasswordPage = lazy(() => import("./pages/ForgotPasswordPage"));
const ResetPasswordPage = lazy(() => import("./pages/ResetPasswordPage"));
function App() {
  return (
    <ThemeProvider>

      <Suspense
        fallback={
          <div className="min-h-screen flex items-center justify-center text-muted-foreground">
            Loading SkillTrack…
          </div>
        }
      >
      <Routes>

        {/* PUBLIC ROUTES */}
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/oauth/callback" element={<OAuthCallbackPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />

        {/* AUTHENTICATED ROUTES */}
        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>

            {/* Core Structure */}

            <Route path="/dashboard" element={<DashboardPage />} />

            <Route path="/patterns" element={<PatternsPage />} />
            <Route
              path="/patterns/:patternName"
              element={<PatternDetailPage />}
            />

            <Route path="/problems" element={<ProblemsPage />} />
            <Route
              path="/problems/:problemId"
              element={<ProblemDetailPage />}
            />

            <Route
              path="/submissions"
              element={<SubmissionHistoryPage />}
            />

            <Route path="/submissions/:id" element={<SubmissionDetailPage />} />

            <Route
              path="/leaderboard"
              element={<GlobalLeaderboardPage />}
            />

            <Route
              path="/leaderboard/:problemId"
              element={<ProblemLeaderboardPage />}
            />

            <Route path="/profile/:userId" element={<ProfilePage />} />

            {/* ADMIN ONLY */}

            <Route element={<ProtectedRoute requiredRole="admin" />}>
              <Route
                path="/admin/create"
                element={<CreateProblemPage />}
              />

              <Route
                path="/admin/edit/:id"
                element={<EditProblemPage />}
              />
              <Route path="/admin/analytics" element={<AdminAnalyticsPage />} />
            </Route>

          </Route>
        </Route>

        <Route path="*" element={
          <div className="min-h-screen flex items-center justify-center
                          bg-background text-foreground">
            <div className="text-center space-y-2">
              <p className="text-6xl font-bold text-primary">404</p>
              <p className="text-muted-foreground">Page not found.</p>
            </div>
          </div>
        } />

      </Routes>
      </Suspense>

    </ThemeProvider>
  );
}

export default App;
