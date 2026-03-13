import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../api/axios";
import { useAuth } from "../context/authContext";
import ActivityHeatmap from "../components/ActivityHeatmap";
import { SkeletonProfile } from "../components/Skeleton";

const PATTERN_ORDER = [
  "Sliding Window", "Two Pointers", "Binary Search", "Stack",
  "Linked List", "Tree", "Graph", "Heap", "Greedy",
  "Backtracking", "Dynamic Programming", "Bit Manipulation",
];

interface ProfileData {
  user: {
    _id: string;
    name: string;
    role: string;
    joinedAt: string;
  };
  stats: {
    totalSolved: number;
    easySolved: number;
    mediumSolved: number;
    hardSolved: number;
  };
  patternBreakdown: Record<string, number>;
  recentSubmissions: {
    _id: string;
    status: string;
    runtime: number;
    createdAt: string;
    problem: { title: string; difficulty: string } | null;
  }[];
  activityMap: Record<string, number>;
}

const ProfilePage: React.FC = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();

  const [data, setData] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await axios.get(`/users/${userId}`);
        setData(res.data.data);
      } catch {
        setError("User not found");
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [userId]);

  if (loading)
    return <SkeletonProfile />;

  if (error || !data)
    return (
      <div className="py-20 text-center text-muted-foreground">
        {error || "Something went wrong"}
      </div>
    );

  const { user, stats, patternBreakdown, recentSubmissions, activityMap } = data;
  const isOwnProfile = currentUser?.userId === user._id;

  const joinedYear = new Date(user.joinedAt).getFullYear();

  return (
    <div className="space-y-10 max-w-6xl">

      {/* Header */}
      <div className="flex items-center gap-6">
        <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center
                        text-primary-foreground text-2xl font-bold">
          {user.name.charAt(0).toUpperCase()}
        </div>

        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-semibold text-foreground">
              {user.name}
            </h1>
            {isOwnProfile && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10
                               text-primary border border-primary/20">
                You
              </span>
            )}
          </div>
          <p className="text-sm text-muted-foreground mt-0.5">
            {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
            {" · "}Joined {joinedYear}
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total Solved", value: stats.totalSolved, color: "text-foreground" },
          { label: "Easy", value: stats.easySolved, color: "text-emerald-500" },
          { label: "Medium", value: stats.mediumSolved, color: "text-amber-500" },
          { label: "Hard", value: stats.hardSolved, color: "text-rose-500" },
        ].map((s) => (
          <div
            key={s.label}
            className="bg-card border border-border rounded-xl p-5 text-center"
          >
            <p className={`text-3xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-sm text-muted-foreground mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Activity Heatmap */}
      <div className="bg-card border border-border rounded-xl p-6">
        <h2 className="text-base font-semibold text-foreground mb-5">
          Activity
        </h2>
        <ActivityHeatmap activityMap={activityMap} />
      </div>

      {/* Pattern Breakdown */}
      <div className="bg-card border border-border rounded-xl p-6">
        <h2 className="text-base font-semibold text-foreground mb-5">
          Pattern Breakdown
        </h2>

        <div className="space-y-3">
          {PATTERN_ORDER.filter((p) => patternBreakdown[p] > 0).map(
            (pattern) => (
              <div
                key={pattern}
                className="flex items-center gap-4 cursor-pointer group"
                onClick={() =>
                  navigate(
                    `/patterns/${pattern.toLowerCase().replace(/\s+/g, "-")}`
                  )
                }
              >
                <span className="text-sm text-muted-foreground w-40 shrink-0
                                 group-hover:text-foreground transition">
                  {pattern}
                </span>
                <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full transition-all duration-500"
                    style={{
                      width: `${Math.min(
                        (patternBreakdown[pattern] / 10) * 100,
                        100
                      )}%`,
                    }}
                  />
                </div>
                <span className="text-sm font-medium text-foreground w-6 text-right">
                  {patternBreakdown[pattern]}
                </span>
              </div>
            )
          )}

          {Object.keys(patternBreakdown).length === 0 && (
            <p className="text-sm text-muted-foreground">
              No patterns solved yet.
            </p>
          )}
        </div>
      </div>

      {/* Recent Submissions */}
      <div className="bg-card border border-border rounded-xl p-6">
        <h2 className="text-base font-semibold text-foreground mb-5">
          Recent Submissions
        </h2>

        {recentSubmissions.length === 0 ? (
          <p className="text-sm text-muted-foreground">No submissions yet.</p>
        ) : (
          <div className="divide-y divide-border">
            {recentSubmissions
              .filter((s) => s.problem)
              .map((sub) => (
                <div
                  key={sub._id}
                  className="py-3 flex items-center justify-between text-sm"
                >
                  <span className="text-foreground font-medium">
                    {sub.problem?.title}
                  </span>
                  <div className="flex items-center gap-4">
                    <span className="text-muted-foreground text-xs">
                      {sub.runtime}ms
                    </span>
                    <span
                      className={`capitalize text-xs font-medium px-2 py-0.5
                                  rounded-full border
                        ${sub.status === "accepted"
                          ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                          : "bg-rose-500/10 text-rose-500 border-rose-500/20"
                        }`}
                    >
                      {sub.status.replace(/_/g, " ")}
                    </span>
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>

    </div>
  );
};

export default ProfilePage;