import { useEffect, useState } from "react";
import axios from "../api/axios";

interface Analytics {
  totals: { users: number; problems: number; submissions: number };
  usersByRole: { _id: string; count: number }[];
  problemsByPattern: { _id: string; count: number }[];
  problemsByDifficulty: { _id: string; count: number }[];
  topProblems: {
    _id: string;
    title: string;
    difficulty: string;
    total: number;
    accepted: number;
    acceptanceRate: number;
  }[];
  recentUsers: {
    _id: string;
    name: string;
    email: string;
    role: string;
    createdAt: string;
  }[];
}

const StatCard = ({
  label,
  value,
}: {
  label: string;
  value: number | string;
}) => (
  <div className="bg-card border border-border rounded-xl p-6">
    <p className="text-xs uppercase tracking-wide text-muted-foreground mb-1">
      {label}
    </p>
    <p className="text-3xl font-bold text-foreground">{value}</p>
  </div>
);

const AdminAnalyticsPage: React.FC = () => {
  const [data, setData] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("/admin/analytics")
      .then((res) => setData(res.data.data))
      .finally(() => setLoading(false));
  }, []);

  if (loading)
    return (
      <div className="py-20 text-center text-muted-foreground">
        Loading analytics...
      </div>
    );

  if (!data) return null;

  const difficultyColor = (d: string) =>
    d === "easy"
      ? "text-emerald-500"
      : d === "medium"
      ? "text-amber-500"
      : "text-rose-500";

  return (
    <div className="space-y-10">

      <div>
        <h1 className="text-3xl font-semibold text-foreground">
          Analytics
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Platform health overview.
        </p>
      </div>

      {/* Totals */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard label="Total Users" value={data.totals.users} />
        <StatCard label="Total Problems" value={data.totals.problems} />
        <StatCard label="Total Submissions" value={data.totals.submissions} />
      </div>

      <div className="grid md:grid-cols-2 gap-8">

        {/* Problems by Pattern */}
        <div className="bg-card border border-border rounded-xl p-6">
          <h2 className="text-base font-semibold text-foreground mb-5">
            Problems by Pattern
          </h2>
          <div className="space-y-3">
            {data.problemsByPattern.map((p) => (
              <div key={p._id} className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">{p._id}</span>
                <span className="font-semibold text-foreground">{p.count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Users by Role */}
        <div className="bg-card border border-border rounded-xl p-6">
          <h2 className="text-base font-semibold text-foreground mb-5">
            Users by Role
          </h2>
          <div className="space-y-3">
            {data.usersByRole.map((r) => (
              <div key={r._id} className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground capitalize">{r._id}</span>
                <span className="font-semibold text-foreground">{r.count}</span>
              </div>
            ))}
          </div>

          <div className="mt-6 pt-4 border-t border-border">
            <h3 className="text-sm font-semibold text-foreground mb-4">
              Recent Signups
            </h3>
            <div className="space-y-3">
              {data.recentUsers.map((u) => (
                <div key={u._id} className="flex items-center justify-between text-sm">
                  <div>
                    <p className="text-foreground font-medium">{u.name}</p>
                    <p className="text-xs text-muted-foreground">{u.email}</p>
                  </div>
                  <span className="text-xs text-muted-foreground capitalize">
                    {u.role}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Top Problems */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="px-6 py-5 border-b border-border">
          <h2 className="text-base font-semibold text-foreground">
            Most Attempted Problems
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted text-muted-foreground">
              <tr>
                <th className="px-6 py-3 text-left">Problem</th>
                <th className="px-6 py-3 text-left">Difficulty</th>
                <th className="px-6 py-3 text-right">Attempts</th>
                <th className="px-6 py-3 text-right">Accepted</th>
                <th className="px-6 py-3 text-right">Acceptance Rate</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {data.topProblems.map((p) => (
                <tr key={p._id} className="hover:bg-muted/40 transition">
                  <td className="px-6 py-4 text-foreground font-medium">
                    {p.title}
                  </td>
                  <td className={`px-6 py-4 capitalize font-medium ${difficultyColor(p.difficulty)}`}>
                    {p.difficulty}
                  </td>
                  <td className="px-6 py-4 text-right text-foreground">
                    {p.total}
                  </td>
                  <td className="px-6 py-4 text-right text-emerald-500">
                    {p.accepted}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className={`font-semibold ${
                      p.acceptanceRate >= 50
                        ? "text-emerald-500"
                        : p.acceptanceRate >= 30
                        ? "text-amber-500"
                        : "text-rose-500"
                    }`}>
                      {p.acceptanceRate}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

export default AdminAnalyticsPage;