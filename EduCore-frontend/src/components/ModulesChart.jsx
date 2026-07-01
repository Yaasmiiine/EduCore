import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

const data = [
  { name: "Dev", modules: 10 },
  { name: "Design", modules: 6 },
  { name: "Math", modules: 8 },
];

export default function ModulesChart() {
  return (
    <div style={{ width: "100%", height: 300 }}>
      <h3>Modules Distribution</h3>

      <ResponsiveContainer>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="modules" fill="#6366F1" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}