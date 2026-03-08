import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../api/axios";
import { useAuth } from "../context/authContext";
import { ArrowLeft } from "lucide-react";

interface LeaderboardEntry {
user: {
_id: string;
name: string;
};
score: number;
runtime: number;
}

const ProblemLeaderboardPage: React.FC = () => {
const { problemId } = useParams<{ problemId: string }>();
const navigate = useNavigate();
const { user } = useAuth();

const [data, setData] = useState<LeaderboardEntry[]>([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState("");

useEffect(() => {
    if (!problemId) return;

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

    fetchLeaderboard();
}, [problemId]);

if (loading) {
    return (
        <div className="flex justify-center py-20 text-muted-foreground">
            Loading leaderboard...
        </div>
    );
}

if (error) {
    return (
        <div className="flex justify-center py-20 text-destructive">
            {error}
        </div>
    );
}

let lastScore = -1;
let lastRuntime = -1;
let rank = 0;

const totalParticipants = data.length;
const highestScore = data.length > 0 ? data[0].score : 0;
const fastestRuntime =
    data.length > 0
        ? Math.min(...data.map((d) => d.runtime))
        : 0;

return (
    <div className="min-h-screen px-8 py-8 space-y-12">

        {/* HEADER */}
        <div className="space-y-3">
            <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition"
            >
                <ArrowLeft size={16} />
                Back
            </button>

            <div>
                <h1 className="text-3xl font-semibold tracking-tight">
                    Problem Leaderboard
                </h1>
                <p className="text-sm text-muted-foreground">
                    Competitive ranking based on score and runtime efficiency.
                </p>
            </div>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

            <div className="bg-card border border-border border-t-2 rounded-xl p-6 space-y-1">
                <p className="text-xs uppercase tracking-wide text-muted-foreground">
                    Participants
                </p>
                <p className="text-2xl font-semibold">
                    {totalParticipants}
                </p>
            </div>

            <div className="bg-card border border-border border-t-2 rounded-xl p-6 space-y-1">
                <p className="text-xs uppercase tracking-wide text-muted-foreground">
                    Highest Score
                </p>
                <p className="text-2xl font-semibold">
                    {highestScore}
                </p>
            </div>

            <div className="bg-card border border-border border-t-2 rounded-xl p-6 space-y-1">
                <p className="text-xs uppercase tracking-wide text-muted-foreground">
                    Fastest Runtime
                </p>
                <p className="text-2xl font-semibold">
                    {fastestRuntime} ms
                </p>
            </div>

        </div>

        {/* RANK LIST */}
        <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">

            <div className="px-6 py-5 border-b border-border">
                <h2 className="text-lg font-semibold tracking-tight">
                    Rankings
                </h2>
            </div>

            <div className="divide-y divide-border">

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

                    const medal =
                        rank === 1
                            ? "🥇"
                            : rank === 2
                            ? "🥈"
                            : rank === 3
                            ? "🥉"
                            : null;

                    return (
                        <div
                            key={entry.user._id}
                            className={`
                                px-6 py-5 flex items-center justify-between
                                transition-all hover:bg-muted/40 hover:shadow-sm
                                ${isCurrentUser ? "bg-primary/10 border-l-4 border-primary" : ""}
                            `}
                        >

                            {/* LEFT */}
                            <div className="flex items-center gap-6">

                                {/* Rank Badge */}
                                <div className="w-8 h-8 flex items-center justify-center rounded-md bg-muted font-semibold text-sm">
                                    {medal || rank}
                                </div>

                                {/* Avatar */}
                                <div className="w-9 h-9 rounded-full bg-primary/20 flex items-center justify-center text-xs font-semibold text-primary">
                                    {entry.user.name.charAt(0)}
                                </div>

                                {/* Username */}
                                <div className="font-medium flex items-center">
                                    {entry.user.name}

                                    {isCurrentUser && (
                                        <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-primary/20 text-primary">
                                            YOU
                                        </span>
                                    )}
                                </div>

                            </div>

                            {/* RIGHT */}
                            <div className="flex items-center gap-12 text-sm">

                                <div className="flex flex-col items-end w-24">
                                    <span className="text-xs uppercase tracking-wide text-muted-foreground">
                                        Score
                                    </span>
                                    <span className="font-semibold text-base">
                                        {entry.score}
                                    </span>
                                </div>

                                <div className="flex flex-col items-end w-24">
                                    <span className="text-xs uppercase tracking-wide text-muted-foreground">
                                        Runtime
                                    </span>
                                    <span className="font-semibold text-base">
                                        {entry.runtime} ms
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

export default ProblemLeaderboardPage;
