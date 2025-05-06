import React from "react";
import ReactECharts from "echarts-for-react";

interface LineStackedColumnChartProps {
  type: string;
  data: any;
  config: any;
}

const LineStackedColumnChart: React.FC<LineStackedColumnChartProps> = ({
  data,
  config,
}) => {
  // Dữ liệu mặc định
  const defaultCategories = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const defaultBarData = [
    [2.0, 4.9, 7.0, 23.2, 25.6, 76.7, 135.6], // Evaporation
    [2.6, 5.9, 9.0, 26.4, 28.7, 70.7, 175.6], // Precipitation
  ];
  const defaultLineData = [2.0, 2.2, 3.3, 4.5, 6.3, 10.2, 20.3]; // Temperature

  // Option cơ bản
  const defaultOption = {
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "cross",
        crossStyle: {
          color: "#999",
        },
      },
      formatter: (params: any) => {
        let result = `${params[0].name}<br/>`;
        params.forEach((item: any) => {
          const unit = item.seriesType === "line" ? "°C" : "ml";
          result += `${item.marker} ${item.seriesName}: ${item.value} ${unit}<br/>`;
        });
        return result;
      },
    },
    legend: {
      data: ["Evaporation", "Precipitation", "Temperature"],
      // top: "5%",
      left: "left",
    },
    grid: {
      left: "3%",
      right: "4%",
      bottom: "3%",
      containLabel: true,
    },
    xAxis: {
      type: "category",
      data: data?.categories || defaultCategories,
      axisPointer: {
        type: "shadow",
      },
      axisLine: {
        lineStyle: {
          color: "#999",
        },
      },
    },
    yAxis: [
      {
        type: "value",
        name: "Precipitation",
        min: 0,
        // max: 250,
        interval: 50,
        axisLabel: {
          formatter: "{value} ml",
        },
      },
      {
        type: "value",
        name: "Temperature",
        min: 0,
        // max: 25,
        interval: 5,
        axisLabel: {
          formatter: "{value} °C",
        },
        splitLine: {
          show: false, // Ẩn lưới trục y phụ
        },
      },
    ],
    series: [
      {
        name: "Evaporation",
        type: "bar",
        stack: "total", // Xếp chồng
        label: {
          show: true,
          position: "inside",
        },
        emphasis: {
          focus: "series",
        },
        tooltip: {
          valueFormatter: (value: any) => `${value} ml`,
        },
        data: data?.barData?.[0] || defaultBarData[0],
      },
      {
        name: "Precipitation",
        type: "bar",
        stack: "total", // Xếp chồng
        label: {
          show: true,
          position: "inside",
        },
        emphasis: {
          focus: "series",
        },
        tooltip: {
          valueFormatter: (value: any) => `${value} ml`,
        },
        data: data?.barData?.[1] || defaultBarData[1],
      },
      {
        name: "Temperature",
        type: "line",
        yAxisIndex: 1,
        smooth: true, // Đường mượt mà
        symbol: "circle",
        // symbolSize: 6,
        // lineStyle: {
        //   width: 3,
        //   color: "#ff4d4f",
        // },
        areaStyle: {
          color: {
            type: "linear",
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: "transparent" },
              { offset: 1, color: "rgba(255, 77, 79, 0)" },
            ],
          },
        },
        tooltip: {
          valueFormatter: (value: any) => `${value} °C`,
        },
        data: config?.lineData || data?.lineData || defaultLineData,
      },
    ],
  };

  // Kết hợp config từ props
  const finalOption = {
    ...defaultOption,
    ...config,
    xAxis: {
      ...defaultOption.xAxis,
      ...config?.xAxis,
      data: config?.categories || data?.categories || defaultOption.xAxis.data,
    },
    series: config?.series || defaultOption.series,
  };

  return (
    <ReactECharts option={finalOption} style={{ width: "100%", height: 400 }} />
  );
};

export default LineStackedColumnChart;
