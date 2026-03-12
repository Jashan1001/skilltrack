interface Props {
  activityMap: Record<string, number>;
}

const ActivityHeatmap: React.FC<Props> = ({ activityMap }) => {
  // Build last 365 days as array of date strings
  const days: string[] = [];
  const today = new Date();

  for (let i = 364; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    days.push(d.toISOString().split("T")[0]);
  }

  // Pad to start on Sunday
  const firstDayOfWeek = new Date(days[0]).getDay(); // 0=Sun
  const padded = [...Array(firstDayOfWeek).fill(null), ...days];

  // Group into weeks (columns of 7)
  const weeks: (string | null)[][] = [];
  for (let i = 0; i < padded.length; i += 7) {
    weeks.push(padded.slice(i, i + 7));
  }

  const getColor = (day: string | null) => {
    if (!day) return "bg-transparent";
    const count = activityMap[day] || 0;
    if (count === 0) return "bg-muted";
    if (count === 1) return "bg-primary/30";
    if (count === 2) return "bg-primary/55";
    if (count <= 4) return "bg-primary/75";
    return "bg-primary";
  };

  const months = [
    "Jan","Feb","Mar","Apr","May","Jun",
    "Jul","Aug","Sep","Oct","Nov","Dec",
  ];

  // Month labels — find first day of each month in the weeks
  const monthLabels: { label: string; col: number }[] = [];
  weeks.forEach((week, colIndex) => {
    week.forEach((day) => {
      if (!day) return;
      const d = new Date(day);
      if (d.getDate() === 1) {
        monthLabels.push({ label: months[d.getMonth()], col: colIndex });
      }
    });
  });

  const totalSubmissions = Object.values(activityMap).reduce(
    (a, b) => a + b,
    0
  );

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
        <span>{totalSubmissions} submissions in the last year</span>
        <div className="flex items-center gap-1">
          <span>Less</span>
          {["bg-muted", "bg-primary/30", "bg-primary/55", "bg-primary/75", "bg-primary"].map(
            (c, i) => (
              <div key={i} className={`w-3 h-3 rounded-sm ${c}`} />
            )
          )}
          <span>More</span>
        </div>
      </div>

      {/* Month labels */}
      <div className="flex gap-[3px] ml-0">
        {weeks.map((_, colIndex) => {
          const label = monthLabels.find((m) => m.col === colIndex);
          return (
            <div
              key={colIndex}
              className="w-3 text-xs text-muted-foreground truncate"
            >
              {label?.label || ""}
            </div>
          );
        })}
      </div>

      {/* Grid */}
      <div className="flex gap-[3px]">
        {weeks.map((week, colIndex) => (
          <div key={colIndex} className="flex flex-col gap-[3px]">
            {week.map((day, rowIndex) => (
              <div
                key={rowIndex}
                title={
                  day
                    ? `${day}: ${activityMap[day] || 0} submission(s)`
                    : ""
                }
                className={`w-3 h-3 rounded-sm transition-colors ${getColor(day)}`}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ActivityHeatmap;