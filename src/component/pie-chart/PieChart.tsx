import React from "react";
import ReactECharts from "echarts-for-react";

interface PieChartProps {
  type: string;
  data: any;
  config: any;
}

const option = {
  title: {
    // text: "Referer of a Website",
    // subtext: "Fake Data",
    // left: "center",
  },
  tooltip: {
    trigger: "item",
  },
  grid: {
    left: "3%",
    right: "4%",
    bottom: "3%",
    containLabel: true,
  },
  legend: {
    // orient: "vertical",
    left: "left",
  },
  series: [
    {
      name: "Access From",
      type: "pie",
      radius: "50%",
      data: [
        { value: 1048, name: "Search Engine" },
        { value: 735, name: "Direct" },
        { value: 580, name: "Email" },
        { value: 484, name: "Union Ads" },
        { value: 300, name: "Video Ads" },
      ],
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: "rgba(0, 0, 0, 0.5)",
        },
      },
    },
  ],
};

const PieChart: React.FC<PieChartProps> = ({ config }) => {
  return <ReactECharts option={option} />;
};

export default PieChart;
