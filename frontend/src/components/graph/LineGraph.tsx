import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { DEFAULT_SERIES_COLORS } from "./types/color";

type LineGraphTooltipPayloadItem = Readonly<{
  dataKey?: unknown;
  name?: unknown;
  value?: unknown;
  payload?: Record<string, unknown>;
}>;

function LineGraphTooltipContent({
  active,
  payload,
  label,
  extraKey,
}: Readonly<{
  active?: boolean;
  payload?: ReadonlyArray<LineGraphTooltipPayloadItem>;
  label?: unknown;
  extraKey?: string;
}>) {
  if (!active || payload == null || payload.length === 0) return null;

  const row = payload[0]?.payload as Record<string, unknown> | undefined;
  const rawExtra =
    extraKey != null && extraKey !== "" && row != null
      ? row[extraKey]
      : undefined;
  const extraText =
    typeof rawExtra === "string" && rawExtra.trim() !== ""
      ? rawExtra.trim()
      : null;

  return (
    <div
      className="rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm shadow-md dark:border-zinc-600 dark:bg-zinc-900"
      style={{ maxWidth: 360 }}
    >
      <p className="mb-1 font-medium text-foreground">
        {String(label ?? "")}
      </p>
      {payload.map((entry) => {
        const num =
          typeof entry.value === "number"
            ? entry.value
            : Number(entry.value ?? 0);
        const shown = Number.isNaN(num)
          ? String(entry.value ?? "")
          : `${num.toLocaleString("ja-JP")}円`;
        const title =
          entry.name != null && String(entry.name).length > 0
            ? `${String(entry.name)}：`
            : "";
        return (
          <p
            key={String(entry.dataKey)}
            className="tabular-nums text-foreground"
          >
            {title}
            {shown}
          </p>
        );
      })}
      {extraText != null ? (
        <pre className="text-muted-foreground mt-2 max-h-52 max-w-[min(100vw,360px)] overflow-auto whitespace-pre-wrap border-t border-zinc-200 pt-2 text-xs leading-relaxed dark:border-zinc-600">
          {extraText}
        </pre>
      ) : null}
    </div>
  );
}

function resolveSeriesStroke(
  stroke: string | null | undefined,
  index: number,
): string {
  if (stroke != null && stroke !== "") {
    return stroke;
  }
  return DEFAULT_SERIES_COLORS[index % DEFAULT_SERIES_COLORS.length];
}

export type LineGraphSeriesItem = {
  data_key: string;
  name: string;
  stroke?: string | null;
};

export type LineGraphData = {
  title: string;
  /** X 軸：各 point のキーとラベル */
  x_axis: {
    data_key: string;
    label: string;
  };
  /** Y 軸：金額など */
  y_axis: {
    label: string;
    /** 既定 [0, "dataMax"]。固定したいときは min/max */
    min?: number;
    max?: number;
  };
  series: LineGraphSeriesItem[];
  points: Record<string, string | number>[];
  /** ツールチップで points 内のこのキーを追加表示（改行区切りテキストなど） */
  tooltip_extra_key?: string;
};

export type LineGraphProps = {
  data: LineGraphData;
};

function LineGraph({ data }: LineGraphProps) {
  const yDomain: [number | string, number | string] =
    data.y_axis.min !== undefined && data.y_axis.max !== undefined
      ? [data.y_axis.min, data.y_axis.max]
      : [0, "dataMax"];

  const extraKey = data.tooltip_extra_key;

  return (
    <div className="recharts-chart-host h-[min(360px,55vh)] w-full rounded-xl border border-zinc-200 bg-white/80 p-4 shadow-sm dark:border-zinc-700 dark:bg-zinc-900/50">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          accessibilityLayer={false}
          data={data.points}
          margin={{ top: 40, right: 20, left: 8, bottom: 8 }}
          tabIndex={-1}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            className="stroke-zinc-200 dark:stroke-zinc-600"
          />
          <XAxis
            dataKey={data.x_axis.data_key}
            type="category"
            tick={{ fill: "currentColor", fontSize: 12 }}
            className="text-zinc-600 dark:text-zinc-400"
            label={{
              value: data.x_axis.label,
              position: "insideBottom",
              offset: -4,
              fill: "currentColor",
              fontSize: 12,
            }}
          />
          <YAxis
            domain={yDomain}
            tick={{ fill: "currentColor", fontSize: 12 }}
            className="text-zinc-600 dark:text-zinc-400"
            tickFormatter={(v) =>
              typeof v === "number" ? v.toLocaleString("ja-JP") : String(v)
            }
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
            content={(props) => (
              <LineGraphTooltipContent {...props} extraKey={extraKey} />
            )}
          />
          <Legend />
          {data.series.map((s, index) => (
            <Line
              key={s.data_key}
              type="monotone"
              dataKey={s.data_key}
              name={s.name}
              stroke={resolveSeriesStroke(s.stroke, index)}
              strokeWidth={2}
              dot={{ r: 3 }}
              activeDot={{ r: 5 }}
              isAnimationActive={false}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default LineGraph;
