import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

export default function StatsChart({ data }) {
  return (
    <div style={{ width: "100%", height: 300 }}>
      <h3>Users Growth</h3>

      <ResponsiveContainer>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="users" stroke="#4F46E5" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}