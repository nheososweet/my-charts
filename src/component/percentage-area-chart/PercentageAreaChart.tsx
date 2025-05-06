import React from "react";
import ReactECharts from "echarts-for-react";

interface PercentageAreaChartProps {
  type: string;
  data: any;
  config: any;
}

const PercentageAreaChart: React.FC<PercentageAreaChartProps> = ({
  config,
}) => {
  // Dữ liệu mẫu
  const rawSeries = [
    {
      name: "Email",
      data: [120, 132, 101, 134, 90, 230, 210],
    },
    {
      name: "Union Ads",
      data: [220, 182, 191, 234, 290, 330, 310],
    },
    {
      name: "Video Ads",
      data: [150, 232, 201, 154, 190, 330, 410],
    },
    {
      name: "Direct",
      data: [320, 332, 301, 334, 390, 330, 320],
    },
    {
      name: "Search Engine",
      data: [820, 932, 901, 934, 1290, 1330, 1320],
    },
  ];

  const categories = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  // Chuyển đổi dữ liệu sang phần trăm theo từng cột (trục X)
  const totalPerDay = categories.map((_, i) =>
    rawSeries.reduce((sum, series) => sum + series.data[i], 0)
  );

  const percentageSeries = rawSeries.map((series) => ({
    name: series.name,
    type: "line",
    stack: "Total",
    areaStyle: {},
    emphasis: {
      focus: "series",
    },
    data: series.data.map((value, i) =>
      ((value / totalPerDay[i]) * 100).toFixed(2)
    ),
  }));

  const option = {
    tooltip: {
      trigger: "axis",
      formatter: (params: any) => {
        let total = 0;
        params.forEach((p: any) => (total += parseFloat(p.value)));
        let result = `${params[0].axisValue}<br/>`;
        params.forEach((p: any) => {
          result += `${p.marker} ${p.seriesName}: ${p.value}%<br/>`;
        });
        // result += `<strong>Total: ${total.toFixed(2)}%</strong>`;
        return result;
      },
    },
    legend: {
      data: rawSeries.map((s) => s.name),
    },
    grid: {
      left: "3%",
      right: "4%",
      bottom: "3%",
      containLabel: true,
    },
    xAxis: {
      type: "category",
      boundaryGap: false,
      data: categories,
    },
    yAxis: {
      type: "value",
      max: 100,
      axisLabel: {
        formatter: "{value}%",
      },
    },
    series: percentageSeries,
  };

  return (
    <ReactECharts option={option} style={{ width: "100%", height: "100%" }} />
  );
};

export default PercentageAreaChart;
