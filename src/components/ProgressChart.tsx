import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";

const ProgressChart = () => {
  // Example historical progress data
  const data = [
    { date: "2025-03-01", level: 20 },
    { date: "2025-03-15", level: 40 },
    { date: "2025-04-01", level: 60 },
    { date: "2025-04-11", level: 80 },
  ];

  const getTrendText = () => {
    const last = data[data.length - 1].level;
    const previous = data[data.length - 2]?.level;
    if (last > previous) return "📈 Improvement";
    if (last < previous) return "📉 Deterioration";
    return "➖ Stable";
  };

  return (
    <div className="p-6 max-w-xl mx-auto rounded-2xl shadow-lg bg-white dyslexic-friendly">
      <h2 className="text-2xl font-bold mb-4 text-blue-800">Your Progress</h2>

      <div className="text-lg mb-2">
        <strong>Current Level:</strong> {data[data.length - 1].level} 
        <span className="ml-4">{getTrendText()}</span>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis domain={[0, 100]} />
          <Tooltip />
          <ReferenceLine y={60} stroke="green" strokeDasharray="3 3" label="Threshold" />
          <Line type="monotone" dataKey="level" stroke="#8884d8" strokeWidth={3} dot={{ r: 6 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ProgressChart;
