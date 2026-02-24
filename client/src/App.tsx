import { Routes, Route } from "react-router-dom";

import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import HomePage from "./pages/HomePage";

import ProblemsPage from "./pages/ProblemsPage";
import ProblemDetailPage from "./pages/ProblemDetailPage";
import LeaderboardPage from "./pages/LeaderboardPage";
import SubmissionHistoryPage from "./pages/SubmissionHistoryPage";
import DashboardPage from "./pages/DashboardPage";

import CreateProblemPage from "./pages/CreateProblemPage";
import EditProblemPage from "./pages/EditProblemPage";

import ProtectedRoute from "./routes/ProtectedRoute";
import AppLayout from "./layouts/AppLayout";

function App() {
  return (
    <Routes>

      {/* PUBLIC ROUTES */}
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* ALL AUTHENTICATED ROUTES */}
      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>

          {/* Core */}
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/problems" element={<ProblemsPage />} />
          <Route path="/problems/:problemId" element={<ProblemDetailPage />} />
          <Route path="/leaderboard/:problemId" element={<LeaderboardPage />} />
          <Route path="/submissions" element={<SubmissionHistoryPage />} />

          {/* ADMIN ONLY ROUTES */}
          <Route element={<ProtectedRoute requiredRole="admin" />}>
            <Route path="/admin/create" element={<CreateProblemPage />} />
            <Route path="/admin/edit/:id" element={<EditProblemPage />} />
          </Route>

        </Route>
      </Route>

      {/* Catch All */}
      <Route path="*" element={<h1>404 Not Found</h1>} />

    </Routes>
  );
}

export default App;