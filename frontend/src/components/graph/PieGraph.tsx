import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Sector,
  Tooltip,
} from "recharts";
import type { PieSectorShapeProps } from "recharts";
import { DEFAULT_SERIES_COLORS } from "./types/color";

/** アクティブ扇形の押し出し（px） */
const ACTIVE_SLICE_POP_PX = 8;
const ACTIVE_SLICE_FLOAT_CLASS = "recharts-active-shape-float";
const RAD = Math.PI / 180;

/** ホバー／フォーカス時: 扇形を中心方向に少し押し出す */
function ActiveExplodedSlice(props: PieSectorShapeProps) {
  const {
    cx = 0,
    cy = 0,
    innerRadius = 0,
    outerRadius = 0,
    startAngle,
    endAngle,
    fill,
    stroke,
    strokeWidth,
    cornerRadius,
    midAngle,
  } = props;

  const angle =
    midAngle !== undefined && midAngle !== null
      ? midAngle
      : ((startAngle ?? 0) + (endAngle ?? 0)) / 2;

  const dx = ACTIVE_SLICE_POP_PX * Math.cos(-RAD * angle);
  const dy = ACTIVE_SLICE_POP_PX * Math.sin(-RAD * angle);

  return (
    <Sector
      cx={cx + dx}
      cy={cy + dy}
      innerRadius={innerRadius}
      outerRadius={outerRadius}
      startAngle={startAngle}
      endAngle={endAngle}
      fill={fill}
      stroke={stroke}
      strokeWidth={strokeWidth}
      cornerRadius={cornerRadius}
      className={`recharts-sector ${ACTIVE_SLICE_FLOAT_CLASS}`}
      style={{ outline: "none" }}
    />
  );
}

function resolveSliceFill(
  fill: string | null | undefined,
  index: number,
): string {
  if (fill != null && fill !== "") {
    return fill;
  }
  return DEFAULT_SERIES_COLORS[index % DEFAULT_SERIES_COLORS.length];
}

export type PieGraphData = {
  title: string;
  /** スライス行の「ラベル」列名（例: name / category） */
  name_key: string;
  /** スライス行の「数値」列名（例: value / amount） */
  value_key: string;
  /** 各スライス。name_key / value_key に合わせた列 + 任意で fill */
  slices: Array<Record<string, string | number | null | undefined>>;
};

export type PieGraphProps = {
  data: PieGraphData;
};

function PieGraph({ data }: PieGraphProps) {
  return (
    <div className="recharts-chart-host h-[min(360px,55vh)] w-full rounded-xl border border-zinc-200 bg-white/80 p-4 shadow-sm dark:border-zinc-700 dark:bg-zinc-900/50">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart accessibilityLayer={false} tabIndex={-1}>
          <Pie
            data={data.slices}
            dataKey={data.value_key}
            nameKey={data.name_key}
            cx="50%"
            cy="50%"
            outerRadius={120}
            paddingAngle={2}
            labelLine
            activeShape={ActiveExplodedSlice}
            rootTabIndex={-1}
            label={({ name, percent }) =>
              `${name} ${((percent ?? 0) * 100).toFixed(0)}%`
            }
          >
            {data.slices.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={resolveSliceFill(
                  entry.fill as string | null | undefined,
                  index,
                )}
              />
            ))}
          </Pie>
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
            contentStyle={{
              borderRadius: "8px",
              border: "1px solid rgb(228 228 231)",
            }}
          />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

export default PieGraph;
