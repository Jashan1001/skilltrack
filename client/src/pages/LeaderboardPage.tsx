import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "../api/axios";
import { useAuth } from "../context/authContext";

interface LeaderboardEntry {
  user: {
    _id: string;
    name: string;
  };
  score: number;
  runtime: number;
}

const LeaderboardPage: React.FC = () => {
  const { problemId } = useParams<{ problemId: string }>();
  const { user } = useAuth();

  const [data, setData] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const res = await axios.get(`/leaderboard/${problemId}`);
        setData(res.data?.data || []);
      } catch {
        setError("Failed to load leaderboard");
      } finally {
        setLoading(false);
      }
    };

    if (problemId) fetchLeaderboard();
  }, [problemId]);

  if (loading)
    return (
      <div className="flex justify-center py-20 text-gray-400">
        Loading leaderboard...
      </div>
    );

  if (error)
    return (
      <div className="flex justify-center py-20 text-red-400">
        {error}
      </div>
    );

  let lastScore = -1;
  let lastRuntime = -1;
  let rank = 0;

  return (
    <div className="space-y-10">
      <h1 className="text-3xl font-semibold text-gray-100">
        Leaderboard
      </h1>

      {data.length === 0 ? (
        <p className="text-gray-400">No submissions yet.</p>
      ) : (
        <div className="bg-gray-800/40 border border-gray-700 rounded-xl overflow-hidden">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-700/50 text-gray-300">
              <tr>
                <th className="px-6 py-3">Rank</th>
                <th className="px-6 py-3">User</th>
                <th className="px-6 py-3">Score</th>
                <th className="px-6 py-3">Runtime (ms)</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-700">
              {data.map((entry, index) => {
                if (
                  entry.score !== lastScore ||
                  entry.runtime !== lastRuntime
                ) {
                  rank = index + 1;
                  lastScore = entry.score;
                  lastRuntime = entry.runtime;
                }

                const isCurrentUser =
                  user && entry.user._id === user.userId;

                const rowStyle =
                  isCurrentUser
                    ? "bg-blue-500/15 border-l-4 border-blue-400"
                    : rank === 1
                    ? "bg-emerald-400/10"
                    : rank === 2
                    ? "bg-amber-400/10"
                    : rank === 3
                    ? "bg-rose-400/10"
                    : "";

                const rankLabel =
                  rank === 1
                    ? "🥇"
                    : rank === 2
                    ? "🥈"
                    : rank === 3
                    ? "🥉"
                    : rank;

                return (
                  <tr
                    key={entry.user._id}
                    className={`hover:bg-gray-700/40 transition ${rowStyle}`}
                  >
                    <td className="px-6 py-4 font-medium text-gray-200">
                      {rankLabel}
                    </td>

                    <td className="px-6 py-4 text-gray-300">
                      {entry.user.name}
                      {isCurrentUser && (
                        <span className="ml-2 text-xs text-blue-400">
                          (You)
                        </span>
                      )}
                    </td>

                    <td className="px-6 py-4 text-gray-300">
                      {entry.score}
                    </td>

                    <td className="px-6 py-4 text-gray-300">
                      {entry.runtime}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default LeaderboardPage;