import React from "react";
import PieChart from "./pie-chart/PieChart";
import { EChartsType } from "./types";
import DoughnutChart from "./doughnut-chart/DoughnutChart";
import LineChart from "./line-chart/LineChart";
import WaterfallChart from "./waterfall-chart/WaterfallChart";
import ClusteredColumnChart from "./clustered-column-chart/ClusteredColumnChart";
import ClusteredBarChart from "./clustered-bar-chart/ClusteredBarChart";
import StackedBarChart from "./stacked-bar-chart/StackedBarChart";
import StackedColumnChart from "./stacked-column-chart/StackedColumnChart";
import LineStackedColumnChart from "./line-stacked-column-chart/LineStackedColumnChart";
import LineClusteredColumnChart from "./line-clustered-column-chart/LineClusteredColumnChart";
import FunnelChart from "./funnel-chart/FunnelChart";
import AreaChart from "./area-chart/AreaChart";
import PercentageAreaChart from "./percentage-area-chart/PercentageAreaChart";
import CardChart from "./card-chart/CardChart";
import TableChart from "./table-chart/TableChart";

interface ChartProps {
  type: EChartsType;
  data: any;
  config: any;
}

export const getChartByType = (
  type: ChartProps["type"]
): React.FC<ChartProps> => {
  switch (type) {
    case EChartsType.CARD:
      return CardChart;
    case EChartsType.PIE:
      return PieChart;
    case EChartsType.DOUGHNUT:
      return DoughnutChart;
    case EChartsType.LINE:
      return LineChart;
    case EChartsType.WATERFALL:
      return WaterfallChart;
    case EChartsType.CLUSTERED_COLUMN:
      return ClusteredColumnChart;
    case EChartsType.CLUSTERED_BAR:
      return ClusteredBarChart;
    case EChartsType.STACKED_COLUMN:
      return StackedColumnChart;
    case EChartsType.STACKED_BAR:
      return StackedBarChart;
    case EChartsType.LINE_STACKED_COLUMN:
      return LineStackedColumnChart;
    case EChartsType.LINE_CLUSTERED_COLUMN:
      return LineClusteredColumnChart;
    case EChartsType.TABLE:
      return TableChart;
    case EChartsType.FUNNEL:
      return FunnelChart;
    case EChartsType.AREA:
      return AreaChart;
    case EChartsType.PERCENTAGE_STACKED_AREA:
      return PercentageAreaChart;

    default:
      return () => <div>Unsupported chart type</div>;
  }
};
