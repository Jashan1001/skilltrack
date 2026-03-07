import { Routes, Route } from "react-router-dom";

import { ThemeProvider } from "./context/themeContext";

import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import HomePage from "./pages/HomePage";

import PatternsPage from "./pages/PatternsPage";
import PatternDetailPage from "./pages/PatternDetailPage";
import ProblemsPage from "./pages/ProblemsPage";
import ProblemDetailPage from "./pages/ProblemDetailPage";
import ProblemLeaderboardPage from "./pages/ProblemLeaderboardPage";
import SubmissionHistoryPage from "./pages/SubmissionHistoryPage";
import DashboardPage from "./pages/DashboardPage";

import CreateProblemPage from "./pages/CreateProblemPage";
import EditProblemPage from "./pages/EditProblemPage";

import ProtectedRoute from "./routes/ProtectedRoute";
import AppLayout from "./layouts/AppLayout";
import GlobalLeaderboardPage from "./pages/GlobalLeaderboardPage";

function App() {
  return (
    <ThemeProvider>

      <Routes>

        {/* PUBLIC ROUTES */}
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

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

            <Route
              path="/leaderboard"
              element={<GlobalLeaderboardPage />}
            />

            <Route
              path="/leaderboard/:problemId"
              element={<ProblemLeaderboardPage />}
            />

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
            </Route>

          </Route>
        </Route>

        {/* 404 */}

        <Route path="*" element={<h1>404 Not Found</h1>} />

      </Routes>

    </ThemeProvider>
  );
}

export default App;