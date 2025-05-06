import React from "react";
import ReactECharts from "echarts-for-react";

interface DoughnutChartProps {
  type: string;
  data: any;
  config: any;
}

const option = {
  tooltip: {
    trigger: "item",
  },
  legend: {
    // top: "5%",
    left: "left",
  },
  grid: {
    left: "3%",
    right: "4%",
    bottom: "3%",
    containLabel: true,
  },
  series: [
    {
      name: "Access From",
      type: "pie",
      radius: ["40%", "70%"],
      avoidLabelOverlap: false,
      label: {
        show: false,
        position: "center",
      },
      // emphasis: {
      //   label: {
      //     show: true,
      //     fontSize: 40,
      //     fontWeight: "bold",
      //   },
      // },
      labelLine: {
        show: false,
      },
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

const DoughnutChart: React.FC<DoughnutChartProps> = ({ config }) => {
  return <ReactECharts option={option} />;
};

export default DoughnutChart;
