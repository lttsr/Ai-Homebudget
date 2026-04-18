import type { PieGraphData } from "../../../components/graph/PieGraph";

/** App / Story 用の円グラフサンプル（API レスポンスの想定形） */
export const PIE_GRAPH_SAMPLE: PieGraphData = {
  title: "支出内訳サンプル",
  name_key: "name",
  value_key: "value",
  slices: [
    { name: "食費", value: 120000 },
    { name: "住居", value: 85000 },
    { name: "交通", value: 42000 },
    { name: "光熱費", value: 28000 },
    { name: "その他", value: 35000, fill: "#6366f1" },
  ],
};
