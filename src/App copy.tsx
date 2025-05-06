// import "./App.css";
// import React, { useState } from "react";
// import { sqlBuilder } from "./sqlBuilder";

// // Định nghĩa type cho dataset
// interface Column {
//   column_name: string;
//   data_type: string;
//   definition: string | null;
// }

// interface Relationship {
//   from_table: string;
//   column_from_table: string;
//   to_table: string;
//   column_to_table: string;
//   cardinality: string;
//   id: string;
//   user_id: string;
//   created_at: string;
//   updated_at: string;
//   created_by: string;
//   updated_by: string;
// }

// interface Dataset {
//   name: string;
//   description: string;
//   connection_id: string;
//   user_id: string;
//   id: string;
//   created_at: string;
//   updated_at: string;
//   columns: Column[];
//   relationships: Relationship[];
// }

// // Danh sách dataset thực tế
const datasetsMock: Dataset[] = [
  {
    name: "employees_assign",
    description: "employees_assign_tan ETL from PostgreSQL",
    connection_id: "cb0d7102-e2b5-4c2e-8f5e-edb976967a62",
    user_id: "9a31d17f-1442-4946-9662-38ceb80d5b52",
    id: "57f8ebb9-bfe2-40bf-80da-901253a5f711",
    created_at: "2025-04-26T08:21:17.463816Z",
    updated_at: "2025-04-26T08:21:17.463816Z",
    columns: [
      {
        column_name: "id",
        data_type: "text",
        definition: null,
      },
      {
        column_name: "employee_id",
        data_type: "text",
        definition: null,
      },
      {
        column_name: "org_unit_id",
        data_type: "text",
        definition: null,
      },
      {
        column_name: "position_id",
        data_type: "text",
        definition: null,
      },
      {
        column_name: "job_title",
        data_type: "text",
        definition: null,
      },
      {
        column_name: "assignment_start",
        data_type: "date",
        definition: null,
      },
      {
        column_name: "assignment_end",
        data_type: "date",
        definition: null,
      },
      {
        column_name: "contract_type",
        data_type: "text",
        definition: null,
      },
      {
        column_name: "created_at",
        data_type: "timestamp without time zone",
        definition: null,
      },
      {
        column_name: "updated_at",
        data_type: "timestamp without time zone",
        definition: null,
      },
    ],
    relationships: [],
  },

  {
    name: "employees",
    description: "employees_tan ETL from PostgreSQL",
    connection_id: "cb0d7102-e2b5-4c2e-8f5e-edb976967a62",
    user_id: "9a31d17f-1442-4946-9662-38ceb80d5b52",
    id: "7e56ef27-2997-4c72-91b3-026a671af0b7",
    created_at: "2025-04-26T08:20:52.122878Z",
    updated_at: "2025-04-26T08:20:52.122878Z",
    columns: [
      {
        column_name: "id",
        data_type: "text",
        definition: null,
      },
      {
        column_name: "first_name",
        data_type: "text",
        definition: null,
      },
      {
        column_name: "last_name",
        data_type: "text",
        definition: null,
      },
      {
        column_name: "gender",
        data_type: "text",
        definition: null,
      },
      {
        column_name: "birth_date",
        data_type: "date",
        definition: null,
      },
      {
        column_name: "marital_status",
        data_type: "text",
        definition: null,
      },
      {
        column_name: "email",
        data_type: "text",
        definition: null,
      },
      {
        column_name: "phone",
        data_type: "text",
        definition: null,
      },
      {
        column_name: "address",
        data_type: "text",
        definition: null,
      },
      {
        column_name: "province_id",
        data_type: "text",
        definition: null,
      },
      {
        column_name: "district_id",
        data_type: "text",
        definition: null,
      },
      {
        column_name: "ward_id",
        data_type: "text",
        definition: null,
      },
      {
        column_name: "created_at",
        data_type: "timestamp without time zone",
        definition: null,
      },
      {
        column_name: "updated_at",
        data_type: "timestamp without time zone",
        definition: null,
      },
    ],
    relationships: [],
  },
];

import "./App.css";
import React, { useState } from "react";
import { sqlBuilder } from "./sqlBuilder";
import ReactECharts from "echarts-for-react";

// Định nghĩa type cho dataset
interface Column {
  column_name: string;
  data_type: string;
  definition: string | null;
}

interface Relationship {
  from_table: string;
  column_from_table: string;
  to_table: string;
  column_to_table: string;
  cardinality: string;
  id: string;
  user_id: string;
  created_at: string;
  updated_at: string;
  created_by: string;
  updated_by: string;
}

interface Dataset {
  name: string;
  description: string;
  connection_id: string;
  user_id: string;
  id: string;
  created_at: string;
  updated_at: string;
  columns: Column[];
  relationships: Relationship[];
}

// Định nghĩa type cho input
interface InputValue {
  field: string;
  aggregate?: string;
}

interface ChartInput {
  [key: string]: InputValue | InputValue[];
}

// Lọc aggregate functions dựa trên data_type
const getAggregateFunctions = (dataType: string): string[] => {
  if (dataType === "text" || dataType === "varchar" || dataType === "char")
    return ["COUNT", "COUNT DISTINCT"];
  if (dataType === "timestamp without time zone" || dataType === "date")
    return ["COUNT", "MIN", "MAX"];
  if (
    dataType === "integer" ||
    dataType === "bigint" ||
    dataType === "numeric" ||
    dataType === "decimal"
  )
    return ["SUM", "COUNT", "AVG", "MAX", "MIN", "COUNT DISTINCT"];
  return ["COUNT"];
};

// Định nghĩa cấu hình cho các chart
interface ChartInputConfig {
  name: string;
  multi: boolean;
  isAggregate?: boolean;
}

interface ChartConfig {
  inputs: ChartInputConfig[];
}

const chartConfigs: { [key: string]: ChartConfig } = {
  card: { inputs: [{ name: "Field", multi: false, isAggregate: true }] },
  pie: {
    inputs: [
      { name: "Values", multi: false },
      { name: "Details", multi: true, isAggregate: true },
    ],
  },
  donut: {
    inputs: [
      { name: "Values", multi: false },
      { name: "Details", multi: true, isAggregate: true },
    ],
  },
  stacked_column: {
    inputs: [
      { name: "X-Axis", multi: false },
      { name: "Y-Axis", multi: true, isAggregate: true },
      { name: "Legend", multi: true },
      { name: "Small Multiples", multi: false },
    ],
  },
  stacked_bar: {
    inputs: [
      { name: "X-Axis", multi: false },
      { name: "Y-Axis", multi: true, isAggregate: true },
      { name: "Legend", multi: true },
      { name: "Small Multiples", multi: false },
    ],
  },
  clustered_column: {
    inputs: [
      { name: "X-Axis", multi: false },
      { name: "Y-Axis", multi: true, isAggregate: true },
      { name: "Legend", multi: true },
      { name: "Small Multiples", multi: false },
    ],
  },
  clustered_bar: {
    inputs: [
      { name: "X-Axis", multi: false },
      { name: "Y-Axis", multi: true, isAggregate: true },
      { name: "Legend", multi: true },
      { name: "Small Multiples", multi: false },
    ],
  },
  line_stacked_column: {
    inputs: [
      { name: "X-Axis", multi: false },
      { name: "Column(Y-Axis)", multi: true, isAggregate: true },
      { name: "Line(Y-Axis)", multi: true, isAggregate: true },
      { name: "Column Legend", multi: false },
      { name: "Small Multiples", multi: false },
    ],
  },
  line_clustered_column: {
    inputs: [
      { name: "X-Axis", multi: false },
      { name: "Column(Y-Axis)", multi: true, isAggregate: true },
      { name: "Line(Y-Axis)", multi: true, isAggregate: true },
      { name: "Column Legend", multi: false },
      { name: "Small Multiples", multi: false },
    ],
  },
  waterfall: {
    inputs: [
      { name: "Category", multi: false },
      { name: "Breakdown", multi: false },
      { name: "Y-Axis", multi: false, isAggregate: true },
    ],
  },
  line: {
    inputs: [
      { name: "X-Axis", multi: false },
      { name: "Y-Axis", multi: true, isAggregate: true },
      { name: "Secondary Y-Axis", multi: true, isAggregate: true },
      { name: "Legend", multi: false },
    ],
  },
  table: { inputs: [{ name: "Columns", multi: true, isAggregate: true }] },
  funnel: {
    inputs: [
      { name: "Category", multi: false },
      { name: "Values", multi: true, isAggregate: true },
    ],
  },
  area: {
    inputs: [
      { name: "X-Axis", multi: false },
      { name: "Y-Axis", multi: true, isAggregate: true },
      { name: "Legend", multi: false },
      { name: "Small Multiples", multi: false },
    ],
  },
  stacked_area: {
    inputs: [
      { name: "X-Axis", multi: false },
      { name: "Y-Axis", multi: true, isAggregate: true },
      { name: "Legend", multi: false },
      { name: "Small Multiples", multi: false },
    ],
  },
};

const option = {
  legend: {},
  tooltip: {},
  dataset: {
    dimensions: ["product", "2015", "2016", "2017"],
    source: [
      { product: "Matcha Latte", "2015": 43.3, "2016": 85.8, "2017": 93.7 },
      { product: "Milk Tea", "2015": 83.1, "2016": 73.4, "2017": 55.1 },
      { product: "Cheese Cocoa", "2015": 86.4, "2016": 65.2, "2017": 82.5 },
      { product: "Walnut Brownie", "2015": 72.4, "2016": 53.9, "2017": 39.1 },
    ],
  },
  xAxis: { type: "category" },
  yAxis: {},
  // Declare several bar series, each will be mapped
  // to a column of dataset.source by default.
  series: [{ type: "bar" }, { type: "bar" }, { type: "bar" }],
};

const App: React.FC = () => {
  const [datasets, setDatasets] = useState<Dataset[]>(datasetsMock);
  const [datasetId, setDatasetId] = useState<string>("");
  const [chartType, setChartType] = useState<string>("card");
  const [inputs, setInputs] = useState<ChartInput>({});
  const [sqlQuery, setSqlQuery] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // // Lấy datasets từ API
  // useEffect(() => {
  //   const fetchDatasets = async () => {
  //     try {
  //       setLoading(true);
  //       const response = await fetch("https://your-api-endpoint/datasets");
  //       if (!response.ok) throw new Error("Failed to fetch datasets");
  //       const data: Dataset[] = await response.json();
  //       setDatasets(data);
  //       if (data.length > 0) setDatasetId(data[0].id);
  //       setLoading(false);
  //     } catch (err) {
  //       console.error("Error fetching datasets:", err);
  //       setError("Failed to load datasets. Please try again.");
  //       setLoading(false);
  //     }
  //   };
  //   fetchDatasets();
  // }, []);

  // Lấy dataset hiện tại
  const currentDataset =
    datasets.find((d) => d.id === datasetId) || datasets[0];

  // Tạo danh sách cột từ dataset
  const getColumns = (
    dataset: Dataset | undefined
  ): { value: string; label: string }[] => {
    if (!dataset) return [];
    // Cột từ bảng chính
    const columnNames = dataset.columns.map((c) => ({
      value: c.column_name,
      label: c.column_name,
    }));
    // Cột từ relationships
    const relationColumns = dataset.relationships.map((r) => {
      const relatedDataset = datasets.find((d) => d.name === r.from_table);
      const columnName = r.column_from_table;
      const label = relatedDataset
        ? `${r.from_table}.${columnName}`
        : columnName;
      return {
        value: columnName, // Chỉ dùng column_name
        label: label,
      };
    });
    return [...columnNames, ...relationColumns];
  };

  // Lấy data_type cho cột
  const getColumnDataType = (column: string): string => {
    if (!currentDataset) return "text";
    // Kiểm tra cột trong bảng chính
    const columnInfo = currentDataset.columns.find(
      (c) => c.column_name === column
    );
    if (columnInfo) return columnInfo.data_type;
    // Kiểm tra cột trong relationships
    const relation = currentDataset.relationships.find(
      (r) => r.column_from_table === column
    );
    if (relation) {
      const relatedDataset = datasets.find(
        (d) => d.name === relation.from_table
      );
      if (relatedDataset) {
        const relatedColumn = relatedDataset.columns.find(
          (c) => c.column_name === relation.column_from_table
        );
        return relatedColumn ? relatedColumn.data_type : "text";
      }
    }
    return "text";
  };

  // Thêm input mới cho các input multi
  const addMultiInput = (inputName: string) => {
    setInputs((prev) => {
      const current = prev[inputName] || [];
      return {
        ...prev,
        [inputName]: Array.isArray(current)
          ? [...current, { field: "", aggregate: "COUNT" }]
          : [{ field: "", aggregate: "COUNT" }],
      };
    });
  };

  // Xóa input trong multi input
  const removeMultiInput = (inputName: string, index: number) => {
    setInputs((prev) => {
      const current = prev[inputName] as InputValue[];
      return {
        ...prev,
        [inputName]: current.filter((_, i) => i !== index),
      };
    });
  };

  // Cập nhật giá trị input
  const updateInput = (
    inputName: string,
    field: string,
    value: string,
    index?: number
  ) => {
    setInputs((prev) => {
      if (index !== undefined) {
        const current = prev[inputName] as InputValue[];
        const updated = [...current];
        updated[index] = { ...updated[index], [field]: value };
        return { ...prev, [inputName]: updated };
      }
      return { ...prev, [inputName]: { ...prev[inputName], [field]: value } };
    });
  };

  // Submit để tạo SQL
  const handleSubmit = () => {
    if (!currentDataset) {
      setSqlQuery("Error: No dataset selected");
      return;
    }
    const query = sqlBuilder(chartType, inputs, currentDataset, datasets);
    setSqlQuery(query);
  };

  // Copy SQL vào clipboard
  const handleCopySql = () => {
    navigator.clipboard.writeText(sqlQuery);
    // .then(() => {
    //   alert("SQL copied to clipboard!");
    // })
    // .catch((err) => {
    //   console.error("Failed to copy SQL: ", err);
    //   alert("Failed to copy SQL");
    // });
  };

  // Lấy cấu hình input cho chart hiện tại
  const currentConfig = chartConfigs[chartType] || { inputs: [] };

  // Lấy danh sách cột cho dropdown
  const columns = getColumns(currentDataset);

  if (loading) {
    return <div className="text-center p-6">Loading datasets...</div>;
  }

  if (error) {
    return <div className="text-center p-6 text-red-500">{error}</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex flex-col lg:flex-row p-4 lg:p-6 gap-6">
      {/* Sidebar: Dataset & Chart Type */}
      <div className="lg:w-1/4 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 flex flex-col gap-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
          Configuration
        </h2>
        {/* Dataset */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Dataset
          </label>
          <select
            value={datasetId}
            onChange={(e) => {
              setDatasetId(e.target.value);
              setInputs({});
              setSqlQuery("");
            }}
            className="w-full p-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition"
          >
            <option value="">Select Dataset</option>
            {datasets.map((dataset) => (
              <option key={dataset.id} value={dataset.id}>
                {dataset.name}
              </option>
            ))}
          </select>
        </div>
        {/* Chart Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Chart Type
          </label>
          <select
            value={chartType}
            onChange={(e) => {
              setChartType(e.target.value);
              setInputs({});
              setSqlQuery("");
            }}
            className="w-full p-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition"
          >
            <option value="">Select Chart Type</option>
            {Object.keys(chartConfigs).map((key) => (
              <option key={key} value={key}>
                {key.replace(/_/g, " ").toUpperCase()}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Content: Inputs & SQL Output */}
      <div className="flex-1 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 flex flex-col gap-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 text-center">
          Chart Selector & SQL Generator
        </h1>

        {/* Inputs */}
        <div className="flex flex-col gap-4">
          {currentConfig.inputs.map((input) => (
            <div
              key={input.name}
              className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
            >
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                {input.name}
              </label>
              {input.multi ? (
                <div className="space-y-3">
                  {((inputs[input.name] as InputValue[]) || []).map(
                    (val, index) => (
                      <div
                        key={index}
                        className="flex flex-col sm:flex-row items-start sm:items-center gap-3 p-3 bg-white dark:bg-gray-600 rounded-md"
                      >
                        <select
                          value={val.field}
                          onChange={(e) =>
                            updateInput(
                              input.name,
                              "field",
                              e.target.value,
                              index
                            )
                          }
                          className="flex-1 p-2 bg-white dark:bg-gray-500 border border-gray-300 dark:border-gray-500 rounded-md text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 truncate"
                          title={val.field}
                        >
                          <option value="">Select {input.name}</option>
                          {columns.map((col) => (
                            <option key={col.value} value={col.value}>
                              {col.label}
                            </option>
                          ))}
                        </select>
                        {input.isAggregate && (
                          <select
                            value={val.aggregate || "COUNT"}
                            onChange={(e) =>
                              updateInput(
                                input.name,
                                "aggregate",
                                e.target.value,
                                index
                              )
                            }
                            className="p-2 bg-white dark:bg-gray-500 border border-gray-300 dark:border-gray-500 rounded-md text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 w-full sm:w-32"
                          >
                            {getAggregateFunctions(
                              getColumnDataType(val.field)
                            ).map((func) => (
                              <option key={func} value={func}>
                                {func}
                              </option>
                            ))}
                          </select>
                        )}
                        <button
                          onClick={() => removeMultiInput(input.name, index)}
                          className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 dark:hover:bg-red-700 w-full sm:w-auto"
                        >
                          Remove
                        </button>
                      </div>
                    )
                  )}
                  <button
                    onClick={() => addMultiInput(input.name)}
                    className="mt-3 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 dark:hover:bg-blue-700 w-full sm:w-auto"
                  >
                    Add {input.name}
                  </button>
                </div>
              ) : (
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 p-3 bg-white dark:bg-gray-600 rounded-md">
                  <select
                    value={(inputs[input.name] as InputValue)?.field || ""}
                    onChange={(e) =>
                      updateInput(input.name, "field", e.target.value)
                    }
                    className="flex-1 p-2 bg-white dark:bg-gray-500 border border-gray-300 dark:border-gray-500 rounded-md text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 truncate"
                    title={(inputs[input.name] as InputValue)?.field || ""}
                  >
                    <option value="">Select {input.name}</option>
                    {columns.map((col) => (
                      <option key={col.value} value={col.value}>
                        {col.label}
                      </option>
                    ))}
                  </select>
                  {input.isAggregate && (
                    <select
                      value={
                        (inputs[input.name] as InputValue)?.aggregate || "COUNT"
                      }
                      onChange={(e) =>
                        updateInput(input.name, "aggregate", e.target.value)
                      }
                      className="p-2 bg-white dark:bg-gray-500 border border-gray-300 dark:border-gray-500 rounded-md text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 w-full sm:w-32"
                    >
                      {getAggregateFunctions(
                        getColumnDataType(
                          (inputs[input.name] as InputValue)?.field || ""
                        )
                      ).map((func) => (
                        <option key={func} value={func}>
                          {func}
                        </option>
                      ))}
                    </select>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Submit Button */}
        <div className="flex justify-center">
          <button
            onClick={handleSubmit}
            className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 dark:hover:bg-blue-800"
          >
            Generate SQL
          </button>
        </div>

        {/* SQL Output */}
        {sqlQuery && (
          <div className="p-6 bg-gray-50 dark:bg-gray-700 rounded-lg relative">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Generated SQL Query
              </h2>
              <button
                onClick={handleCopySql}
                className="px-4 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 dark:hover:bg-green-800 flex items-center gap-2"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                  ></path>
                </svg>
                Copy SQL
              </button>
            </div>
            <pre className="text-sm text-gray-800 dark:text-gray-200 bg-white dark:bg-gray-600 p-4 rounded-md whitespace-pre-wrap overflow-x-auto font-mono">
              {sqlQuery}
            </pre>
          </div>
        )}
      </div>

      <ReactECharts option={option} />
    </div>
  );
};

export default App;
