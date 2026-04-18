import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { DEFAULT_SERIES_COLORS } from "./types/color";

function resolveSeriesFill(
  fill: string | null | undefined,
  index: number,
): string {
  if (fill != null && fill !== "") {
    return fill;
  }
  return DEFAULT_SERIES_COLORS[index % DEFAULT_SERIES_COLORS.length];
}

export type BarGraphSeriesItem = {
  data_key: string;
  name: string;
  fill?: string | null;
};

export type BarGraphData = {
  title: string;
  x_axis: {
    data_key: string;
    ticks: string[];
    label: string;
  };
  y_axis: {
    min: number;
    max: number;
    ticks: number[];
    label: string;
  };
  series: BarGraphSeriesItem[];
  points: Record<string, string | number>[];
};

export type BarGraphProps = {
  data: BarGraphData;
};

function BarGraph({ data }: BarGraphProps) {
  return (
    <div className="recharts-chart-host h-[min(360px,55vh)] w-full rounded-xl border border-zinc-200 bg-white/80 p-4 shadow-sm dark:border-zinc-700 dark:bg-zinc-900/50">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          accessibilityLayer={false}
          data={data.points}
          margin={{ top: 40, right: 20, left: 20, bottom: 8 }}
          tabIndex={-1}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            className="stroke-zinc-200 dark:stroke-zinc-600"
          />
          <XAxis
            dataKey={data.x_axis.data_key}
            type="category"
            ticks={data.x_axis.ticks}
            tick={{ fill: "currentColor", fontSize: 12 }}
            className="text-zinc-600 dark:text-zinc-400"
            label={{
              value: data.x_axis.label,
              position: "right",
              offset: -2,
              fill: "currentColor",
              fontSize: 12,
            }}
          />
          <YAxis
            domain={[data.y_axis.min, data.y_axis.max]}
            ticks={data.y_axis.ticks}
            tick={{ fill: "currentColor", fontSize: 12 }}
            className="text-zinc-600 dark:text-zinc-400"
            label={{
              value: data.y_axis.label,
              angle: 0,
              position: "top",
              offset: 20,
              fill: "currentColor",
              fontSize: 12,
            }}
          />
          <Tooltip
            separator=""
            formatter={(value, name) => {
              const n = typeof value === "number" ? value : Number(value);
              if (Number.isNaN(n)) {
                return ["", ""];
              }
              const num = `${n.toLocaleString("ja-JP")}円`;
              if (name === undefined || name === null || name === "") {
                return [num, undefined];
              }
              return [num, `${String(name)}：`];
            }}
            labelFormatter={(label) => `${label}`}
            contentStyle={{
              borderRadius: "8px",
              border: "1px solid rgb(228 228 231)",
            }}
          />
          <Legend />
          {data.series.map((s, index) => (
            <Bar
              key={s.data_key}
              dataKey={s.data_key}
              name={s.name}
              fill={resolveSeriesFill(s.fill, index)}
              radius={[4, 4, 0, 0]}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default BarGraph;
