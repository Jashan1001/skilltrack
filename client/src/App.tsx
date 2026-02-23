import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ProblemsPage from "./pages/ProblemsPage";
import ProblemDetailPage from "./pages/ProblemDetailPage";
import LeaderboardPage from "./pages/LeaderboardPage";
import ProtectedRoute from "./routes/ProtectedRoute";
import AppLayout from "./layouts/AppLayout";
import CreateProblemPage from "./pages/CreateProblemPage";
import SubmissionHistoryPage from "./pages/SubmissionHistoryPage";
import HomePage from "./pages/HomePage";

function App() {
  return (
    <Routes>

      {/* Public Routes */}
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Protected Routes */}
      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>

          <Route path="/problems" element={<ProblemsPage />} />

          <Route
            path="/problems/:problemId"
            element={<ProblemDetailPage />}
          />

          <Route
            path="/leaderboard/:problemId"
            element={<LeaderboardPage />}
          />

        </Route>
      </Route>
      <Route element={<ProtectedRoute />}>
        <Route path="/submissions" element={<SubmissionHistoryPage />} />
      </Route>

      <Route element={<ProtectedRoute requiredRole="admin" />}>
        <Route element={<AppLayout />}>
          <Route path="/admin/create" element={<CreateProblemPage />} />
        </Route>
      </Route>

      {/* Catch All */}
      <Route path="*" element={<h1>404 Not Found</h1>} />

    </Routes>
  );
}

export default App;