import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../api/axios";
import { useAuth } from "../context/authContext";

interface GlobalEntry {
  user: { _id: string; name: string };
  totalSolved: number;
  totalScore: number;
  averageRuntime: number;
}

type Period = "all" | "month" | "week";

const PERIODS: { label: string; value: Period }[] = [
  { label: "All Time", value: "all" },
  { label: "This Month", value: "month" },
  { label: "This Week", value: "week" },
];

const GlobalLeaderboardPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [data, setData] = useState<GlobalEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [period, setPeriod] = useState<Period>("all");

  useEffect(() => {
    const fetchLeaderboard = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await axios.get(`/leaderboard?period=${period}`);
        setData(res.data?.data || []);
      } catch {
        setError("Failed to load leaderboard");
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, [period]);

  const totalUsers = data.length;
  const mostSolved = data.length > 0
    ? Math.max(...data.map((d) => d.totalSolved))
    : 0;
  const highestScore = data.length > 0
    ? Math.max(...data.map((d) => d.totalScore))
    : 0;

  return (
    <div className="space-y-10">

      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-semibold text-foreground">
            Global Leaderboard
          </h1>
          <p className="text-sm text-muted-foreground">
            Overall ranking based on problems solved and total score.
          </p>
        </div>

        {/* Period Toggle */}
        <div className="flex items-center gap-1 bg-muted rounded-lg p-1">
          {PERIODS.map((p) => (
            <button
              key={p.value}
              onClick={() => setPeriod(p.value)}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition
                ${period === p.value
                  ? "bg-card text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
                }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Stats Strip */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: "Total Users", value: totalUsers },
          { label: "Most Problems Solved", value: mostSolved },
          { label: "Highest Total Score", value: highestScore },
        ].map((s) => (
          <div
            key={s.label}
            className="bg-card border border-border rounded-xl p-6 space-y-1"
          >
            <p className="text-xs uppercase tracking-wide text-muted-foreground">
              {s.label}
            </p>
            <p className="text-2xl font-semibold text-foreground">{s.value}</p>
          </div>
        ))}
      </div>

      {/* Rankings */}
      <div className="bg-card border border-border rounded-2xl overflow-hidden">
        <div className="px-6 py-5 border-b border-border flex items-center justify-between">
          <h2 className="text-base font-semibold text-foreground">Rankings</h2>
          <span className="text-sm text-muted-foreground">
            {PERIODS.find((p) => p.value === period)?.label}
          </span>
        </div>

        {loading ? (
          <div className="py-20 text-center text-muted-foreground">
            Loading...
          </div>
        ) : error ? (
          <div className="py-20 text-center text-destructive">{error}</div>
        ) : data.length === 0 ? (
          <div className="py-20 text-center text-muted-foreground">
            No activity in this period yet.
          </div>
        ) : (
          <div className="divide-y divide-border">
            {data.map((entry, index) => {
              const rank = index + 1;
              const medal =
                rank === 1 ? "🥇" : rank === 2 ? "🥈" : rank === 3 ? "🥉" : null;
              const isCurrentUser = user && entry.user._id === user.userId;

              return (
                <div
                  key={entry.user._id}
                  className={`px-6 py-4 flex items-center justify-between
                    hover:bg-muted/40 transition
                    ${isCurrentUser ? "bg-primary/5" : ""}`}
                >
                  <div className="flex items-center gap-5">
                    <div className="w-8 text-center font-medium text-muted-foreground">
                      {medal || rank}
                    </div>
                    <div
                      className="font-medium text-foreground cursor-pointer
                                 hover:text-primary transition"
                      onClick={() => navigate(`/profile/${entry.user._id}`)}
                    >
                      {entry.user.name}
                      {isCurrentUser && (
                        <span className="ml-2 text-xs text-primary">(You)</span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-10 text-sm">
                    {[
                      { label: "Solved", value: entry.totalSolved },
                      { label: "Score", value: entry.totalScore },
                      { label: "Avg Runtime", value: `${entry.averageRuntime}ms` },
                    ].map((stat) => (
                      <div key={stat.label} className="flex flex-col items-end">
                        <span className="text-xs uppercase tracking-wide text-muted-foreground">
                          {stat.label}
                        </span>
                        <span className="font-semibold text-foreground">
                          {stat.value}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default GlobalLeaderboardPage;