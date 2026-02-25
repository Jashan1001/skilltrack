import { useEffect, useState } from "react";
import axios from "../api/axios";
import { useAuth } from "../context/authContext";

interface GlobalEntry {
  user: {
    _id: string;
    name: string;
  };
  totalSolved: number;
  totalScore: number;
  averageRuntime: number;
}

const GlobalLeaderboardPage: React.FC = () => {
  const { user } = useAuth();

  const [data, setData] = useState<GlobalEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const res = await axios.get("/leaderboard");
        setData(res.data?.data || []);
      } catch {
        setError("Failed to load global leaderboard");
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  if (loading)
    return (
      <div className="flex justify-center py-20 text-muted-foreground">
        Loading global leaderboard...
      </div>
    );

  if (error)
    return (
      <div className="flex justify-center py-20 text-destructive">
        {error}
      </div>
    );

  const totalUsers = data.length;

  const mostSolved =
    data.length > 0
      ? Math.max(...data.map((d) => d.totalSolved))
      : 0;

  const highestScore =
    data.length > 0
      ? Math.max(...data.map((d) => d.totalScore))
      : 0;

  return (
    <div className="min-h-screen px-8 py-10 space-y-12">

      {/* HEADER */}
      <div className="space-y-3">
        <h1 className="text-3xl font-semibold tracking-tight">
          Global Leaderboard
        </h1>
        <p className="text-sm text-muted-foreground">
          Overall ranking based on problems solved and total score.
        </p>
      </div>

      {/* STATS STRIP */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-card border border-border rounded-xl p-6 space-y-1">
          <p className="text-xs uppercase tracking-wide text-muted-foreground">
            Total Users
          </p>
          <p className="text-2xl font-semibold">
            {totalUsers}
          </p>
        </div>

        <div className="bg-card border border-border rounded-xl p-6 space-y-1">
          <p className="text-xs uppercase tracking-wide text-muted-foreground">
            Most Problems Solved
          </p>
          <p className="text-2xl font-semibold">
            {mostSolved}
          </p>
        </div>

        <div className="bg-card border border-border rounded-xl p-6 space-y-1">
          <p className="text-xs uppercase tracking-wide text-muted-foreground">
            Highest Total Score
          </p>
          <p className="text-2xl font-semibold">
            {highestScore}
          </p>
        </div>
      </div>

      {/* RANK LIST */}
      <div className="bg-card border border-border rounded-2xl overflow-hidden">

        <div className="px-6 py-5 border-b border-border">
          <h2 className="text-lg font-semibold">
            Rankings
          </h2>
        </div>

        <div className="divide-y divide-border">

          {data.map((entry, index) => {
            const rank = index + 1;

            const medal =
              rank === 1
                ? "🥇"
                : rank === 2
                ? "🥈"
                : rank === 3
                ? "🥉"
                : null;

            const isCurrentUser =
              user && entry.user._id === user.userId;

            return (
              <div
                key={entry.user._id}
                className={`
                  px-6 py-5 flex items-center justify-between
                  hover:bg-muted/40 transition
                  ${isCurrentUser ? "bg-primary/10" : ""}
                `}
              >

                {/* LEFT */}
                <div className="flex items-center gap-6">
                  <div className="w-8 text-center font-medium">
                    {medal || rank}
                  </div>

                  <div>
                    <div className="font-medium">
                      {entry.user.name}
                      {isCurrentUser && (
                        <span className="ml-2 text-xs text-primary">
                          (You)
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* RIGHT */}
                <div className="flex items-center gap-12 text-sm">

                  <div className="flex flex-col items-end">
                    <span className="text-xs uppercase tracking-wide text-muted-foreground">
                      Solved
                    </span>
                    <span className="font-semibold text-base">
                      {entry.totalSolved}
                    </span>
                  </div>

                  <div className="flex flex-col items-end">
                    <span className="text-xs uppercase tracking-wide text-muted-foreground">
                      Score
                    </span>
                    <span className="font-semibold text-base">
                      {entry.totalScore}
                    </span>
                  </div>

                  <div className="flex flex-col items-end">
                    <span className="text-xs uppercase tracking-wide text-muted-foreground">
                      Avg Runtime
                    </span>
                    <span className="font-semibold text-base">
                      {entry.averageRuntime} ms
                    </span>
                  </div>

                </div>

              </div>
            );
          })}

        </div>
      </div>
    </div>
  );
};

export default GlobalLeaderboardPage;