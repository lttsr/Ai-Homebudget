import type { BarGraphData } from "../../../components/graph/BarGraph";

/** App / Story 用の棒グラフサンプル（API レスポンスの想定形） */
export const BAR_GRAPH_SAMPLE: BarGraphData = {
  title: "収支サンプル",
  x_axis: {
    data_key: "month",
    ticks: ["1月", "2月", "3月", "4月", "5月", "6月"],
    label: "月",
  },
  y_axis: {
    min: 0,
    max: 500000,
    ticks: [0, 100000, 200000, 300000, 400000, 500000],
    label: "金額（円）",
  },
  series: [
    { data_key: "income", name: "収入", fill: "#22c55e" },
    { data_key: "expense", name: "支出", fill: null },
    { data_key: "saving", name: "貯金", fill: "#3b82f6" },
  ],
  points: [
    { month: "1月", income: 420000, expense: 310000, saving: 110000 },
    { month: "2月", income: 398000, expense: 285000, saving: 113000 },
    { month: "3月", income: 445000, expense: 302000, saving: 143000 },
    { month: "4月", income: 412000, expense: 318000, saving: 94000 },
    { month: "5月", income: 460000, expense: 329000, saving: 131000 },
    { month: "6月", income: 438000, expense: 301000, saving: 137000 },
  ],
};
