import React from "react";
import ReactECharts from "echarts-for-react";

interface ClusteredColumnChartProps {
  type: string;
  data: any;
  config: any;
}

const option = {
  title: {
    // text: "Clustered Column Chart",
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
    type: "category",
    data: ["Brazil", "Indonesia", "USA", "India", "China", "World"],
  },
  yAxis: {
    type: "value",
    boundaryGap: [0, 0.01],
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
const ClusteredColumnChart: React.FC<ClusteredColumnChartProps> = ({
  config,
}) => {
  return <ReactECharts option={option} />;
};

export default ClusteredColumnChart;
