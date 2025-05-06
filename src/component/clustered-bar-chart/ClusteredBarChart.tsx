import React from "react";
import ReactECharts from "echarts-for-react";

interface ClusteredBarChartProps {
  type: string;
  data: any;
  config: any;
}

const option = {
  title: {
    // text: "World Population",
  },
  tooltip: {
    trigger: "axis",
    axisPointer: {
      type: "shadow",
    },
  },
  legend: { left: "left" },
  grid: {
    left: "3%",
    right: "4%",
    bottom: "3%",
    containLabel: true,
  },
  xAxis: {
    type: "value",
    boundaryGap: [0, 0.01],
  },
  yAxis: {
    type: "category",
    data: ["Brazil", "Indonesia", "USA", "India", "China", "World"],
  },
  series: [
    {
      name: "2011",
      type: "bar",
      data: [18203, 23489, 29034, 104970, 131744, 630230],
    },
    {
      name: "2012",
      type: "bar",
      data: [19325, 23438, 31000, 121594, 134141, 681807],
    },
  ],
};
const ClusteredBarChart: React.FC<ClusteredBarChartProps> = ({ config }) => {
  return (
    <div className="w-full">
      <ReactECharts className="w-full" option={option} />
    </div>
  );
};

export default ClusteredBarChart;
