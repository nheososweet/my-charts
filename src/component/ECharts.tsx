import React from "react";
import { getChartByType } from "./getChartByType";
import { EChartsType } from "./types";

// Định nghĩa interface cho props
interface ChartProps {
  type: EChartsType;
  data: any;
  config: any;
}

// Component chính
const EchartsComponent: React.FC<ChartProps> = ({ type, data, config }) => {
  const ChartComponent = getChartByType(type);
  return (
    <div className="w-full h-full">
      <p>{type}</p>
      <ChartComponent type={type} data={data} config={config} />
    </div>
  );
};

export default EchartsComponent;
