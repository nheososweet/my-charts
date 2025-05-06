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

// interface InputValue {
//   field: string;
//   aggregate?: string;
// }

// interface ChartInput {
//   [key: string]: InputValue | InputValue[];
// }

// // Tạo mapping cho join
// const createJoinMapping = (
//   dataset: Dataset
// ): { [key: string]: Relationship } => {
//   const mapping: { [key: string]: Relationship } = {};
//   dataset.relationships.forEach((relation) => {
//     mapping[relation.column_from_table] = relation;
//     mapping[relation.column_to_table] = relation;
//   });
//   return mapping;
// };

// const getAggregateReturnType = (
//   field: InputValue,
//   dataset: Dataset,
//   allDatasets: Dataset[]
// ): string => {
//   if (!field.aggregate) {
//     return getColumnDataType(field.field, dataset, allDatasets).toUpperCase();
//   }

//   const dataType = getColumnDataType(field.field, dataset, allDatasets);
//   const aggregate = field.aggregate.toUpperCase();

//   switch (aggregate) {
//     case "COUNT":
//     case "COUNT DISTINCT":
//       return "BIGINT";
//     case "SUM":
//     case "AVG":
//       return ["integer", "bigint"].includes(dataType.toLowerCase())
//         ? "BIGINT"
//         : "NUMERIC";
//     case "MIN":
//     case "MAX":
//       return dataType.toUpperCase();
//     default:
//       return "NUMERIC";
//   }
// };

// // Tạo câu JOIN
// const buildJoins = (
//   usedColumns: string[],
//   dataset: Dataset,
//   joinType: "LEFT" | "INNER" = "LEFT"
// ): string => {
//   const joinMapping = createJoinMapping(dataset);
//   const joins: string[] = [];
//   const usedTables = new Set<string>();

//   usedColumns.forEach((col) => {
//     const relation = joinMapping[col];
//     if (relation && !usedTables.has(relation.from_table)) {
//       usedTables.add(relation.from_table);
//       joins.push(
//         `${joinType} JOIN "${relation.from_table}" ${relation.from_table[0]} ON e."${relation.column_to_table}" = ${relation.from_table[0]}."${relation.column_from_table}"`
//       );
//     }
//   });

//   return joins.length > 0 ? joins.join("\n") : "";
// };

// // Kiểm tra xem cột có thuộc bảng chính không
// const isMainTableColumn = (column: string, dataset: Dataset): boolean => {
//   return dataset.columns.some((c) => c.column_name === column);
// };

// // Tạo tham chiếu cột
// const getColumnReference = (column: string, dataset: Dataset): string => {
//   if (isMainTableColumn(column, dataset)) {
//     return `e."${column}"`;
//   }
//   const relation = dataset.relationships.find(
//     (r) => r.column_from_table === column
//   );
//   if (relation) {
//     return `${relation.from_table[0]}."${column}"`;
//   }
//   return `e."${column}"`;
// };

// // Lấy data_type của cột từ metadata
// const getColumnDataType = (
//   column: string,
//   dataset: Dataset,
//   allDatasets: Dataset[]
// ): string => {
//   const columnInfo = dataset.columns.find((c) => c.column_name === column);
//   if (columnInfo) return columnInfo.data_type;

//   const relation = dataset.relationships.find(
//     (r) => r.column_from_table === column
//   );
//   if (relation) {
//     const relatedDataset = allDatasets.find(
//       (d) => d.name === relation.from_table
//     );
//     if (relatedDataset) {
//       const relatedColumn = relatedDataset.columns.find(
//         (c) => c.column_name === relation.column_from_table
//       );
//       return relatedColumn ? relatedColumn.data_type : "text";
//     }
//   }
//   return "text";
// };

// // Áp dụng hàm tổng hợp
// const applyAggregate = (
//   field: InputValue,
//   dataset: Dataset,
//   allDatasets: Dataset[],
//   forCrosstab: boolean = false,
//   chartType: string = ""
// ): string => {
//   console.log("🚀 ~ field:", field);
//   const alias = forCrosstab ? field.field : `"${field.field}"`;
//   const columnRef = getColumnReference(field.field, dataset);
//   const dataType = getColumnDataType(field.field, dataset, allDatasets);

//   if (chartType.toLowerCase() === "card") {
//     const numericTypes = ["integer", "bigint", "numeric", "decimal"];
//     if (numericTypes.includes(dataType.toLowerCase())) {
//       return forCrosstab
//         ? `SUM(${columnRef})`
//         : `SUM(${columnRef}) AS ${alias}`;
//     }
//     return forCrosstab
//       ? `COUNT(${columnRef})`
//       : `COUNT(${columnRef}) AS ${alias}`;
//   }

//   if (!field.aggregate) {
//     return forCrosstab ? columnRef : `${columnRef} AS ${alias}`;
//   }

//   const numericTypes = ["integer", "bigint", "numeric", "decimal"];
//   const dateTypes = ["date", "timestamp", "timestamp without time zone"];
//   const textTypes = ["text", "varchar", "char"];

//   if (
//     textTypes.includes(dataType) &&
//     !["COUNT", "COUNT DISTINCT"].includes(field.aggregate!)
//   ) {
//     return forCrosstab
//       ? `COUNT(${columnRef})`
//       : `COUNT(${columnRef}) AS ${alias}`;
//   }
//   if (
//     dateTypes.includes(dataType) &&
//     !["COUNT", "MIN", "MAX"].includes(field.aggregate!)
//   ) {
//     return forCrosstab
//       ? `COUNT(${columnRef})`
//       : `COUNT(${columnRef}) AS ${alias}`;
//   }
//   if (numericTypes.includes(dataType)) {
//     if (
//       !["SUM", "COUNT", "AVG", "MAX", "MIN", "COUNT DISTINCT"].includes(
//         field.aggregate!
//       )
//     ) {
//       return forCrosstab
//         ? `COUNT(${columnRef})`
//         : `COUNT(${columnRef}) AS ${alias}`;
//     }
//   }
//   const expression = `${field.aggregate}(${columnRef})`;
//   return forCrosstab ? expression : `${expression} AS ${alias}`;
// };

// // Kiểm tra xem cột có tồn tại trong dataset không
// const validateColumn = (column: string, dataset: Dataset): boolean => {
//   return (
//     dataset.columns.some((c) => c.column_name === column) ||
//     dataset.relationships.some((r) => r.column_from_table === column)
//   );
// };

// // Lấy table_name của cột ox
// const getOxTableName = (ox: string, dataset: Dataset): string => {
//   if (isMainTableColumn(ox, dataset)) {
//     return dataset.name;
//   }
//   const relation = dataset.relationships.find(
//     (r) => r.column_from_table === ox
//   );
//   return relation ? relation.from_table : dataset.name;
// };

// // Hàm giả lập chạy format để lấy câu SQL con
// const simulateFormatQuery = (
//   formatQuery: string,
//   ox: string,
//   dataset: Dataset,
//   legendOrBreakdown: string
// ): string => {
//   // Giả lập việc chạy SELECT format(...) để lấy câu SQL con
//   // Trong thực tế, cần chạy query này trên DB để lấy kết quả
//   // Ở đây, ta trích xuất phần bên trong crosstab
//   const crosstabMatch = formatQuery.match(
//     /SELECT\s*\*\s*FROM\s*crosstab\s*\(\s*'([^']+)'\s*(?:,\s*'([^']+)')?\s*\)\s*AS\s*result\s*\(\s*"[^"]+"\s*([^,]+),\s*([^)]+)\s*\)/i
//   );
//   if (!crosstabMatch) {
//     return "Error: Invalid crosstab format query";
//   }
//   const innerQuery = crosstabMatch[1];
//   return `SELECT * FROM crosstab('${innerQuery}') AS result("${ox}" ${getColumnDataType(
//     ox,
//     dataset,
//     []
//   )} ${legendOrBreakdown ? `, "${legendOrBreakdown}" NUMERIC` : ""});`;
// };

// export function sqlBuilder(
//   chartType: string,
//   inputs: ChartInput,
//   dataset: Dataset,
//   allDatasets: Dataset[]
// ): string {
//   console.log("🚀 ~ inputs:", inputs);
//   console.log("🚀 ~ inputscccc:", inputs["Y-Axis"]);
//   if (!dataset) return "Error: Dataset is required";

//   const checkRequired = (inputName: string): boolean => {
//     return (
//       !!inputs[inputName] &&
//       (Array.isArray(inputs[inputName])
//         ? (inputs[inputName] as InputValue[]).length > 0
//         : !!(inputs[inputName] as InputValue).field)
//     );
//   };

//   const getUsedColumns = (): string[] => {
//     const columns: string[] = [];
//     Object.values(inputs).forEach((input) => {
//       if (Array.isArray(input)) {
//         input.forEach((val) => val.field && columns.push(val.field));
//       } else if (input.field) {
//         columns.push(input.field);
//       }
//     });
//     return Array.from(new Set(columns));
//   };

//   switch (chartType.toLowerCase()) {
//     case "card": {
//       if (!checkRequired("Field")) return "Error: Field is required";
//       const field = inputs["Field"] as InputValue;
//       if (!validateColumn(field.field, dataset))
//         return `Error: Column "${field.field}" does not exist`;
//       const aggField = applyAggregate(
//         field,
//         dataset,
//         allDatasets,
//         false,
//         "card"
//       );
//       const joins = buildJoins([field.field], dataset);
//       return `SELECT ${aggField} FROM "${dataset.name}" AS e${
//         joins ? " " + joins : ""
//       };`;
//     }

//     case "pie":
//     case "donut": {
//       if (!checkRequired("Values") || !checkRequired("Details"))
//         return "Error: Values and Details are required";
//       const values = (inputs["Values"] as InputValue).field;
//       const details = inputs["Details"] as InputValue[];
//       if (!validateColumn(values, dataset))
//         return `Error: Column "${values}" does not exist`;
//       for (const d of details) {
//         if (!validateColumn(d.field, dataset))
//           return `Error: Column "${d.field}" does not exist`;
//       }
//       const detailFields = details
//         .map((v) => applyAggregate(v, dataset, allDatasets))
//         .join(", ");
//       const usedColumns = [values, ...details.map((d) => d.field)];
//       const joins = buildJoins(usedColumns, dataset);
//       const valuesRef = getColumnReference(values, dataset);
//       return `SELECT ${valuesRef} AS "${values}", ${detailFields} FROM "${
//         dataset.name
//       }" AS e${
//         joins ? " " + joins : ""
//       } GROUP BY ${valuesRef} ORDER BY ${valuesRef};`;
//     }

//     case "stacked_column":
//     case "stacked_bar":
//     case "area":
//     case "stacked_area": {
//       if (!checkRequired("X-Axis") || !checkRequired("Y-Axis"))
//         return "Error: X-Axis and Y-Axis are required";
//       const ox = (inputs["X-Axis"] as InputValue).field;
//       const oy = inputs["Y-Axis"] as InputValue[];
//       const legend = inputs["Legend"]
//         ? (inputs["Legend"] as InputValue[])[0]?.field
//         : null;

//       if (!validateColumn(ox, dataset))
//         return `Error: Column "${ox}" does not exist`;
//       for (const y of oy) {
//         if (!validateColumn(y.field, dataset))
//           return `Error: Column "${y.field}" does not exist`;
//       }
//       if (legend && !validateColumn(legend, dataset))
//         return `Error: Column "${legend}" does not exist`;

//       const usedColumns = [ox, ...oy.map((y) => y.field)];
//       if (legend) usedColumns.push(legend);

//       const joins = buildJoins(usedColumns, dataset);
//       const oxRef = getColumnReference(ox, dataset);
//       const oxTableName = getOxTableName(ox, dataset);

//       if (legend) {
//         if (oy.length > 1)
//           return "Error: Only one Y-Axis allowed when Legend is present";
//         const oyField = applyAggregate(oy[0], dataset, allDatasets, true);
//         const legendRef = getColumnReference(legend, dataset);
//         const joinMapping = createJoinMapping(dataset);
//         const legendRelation = joinMapping[legend];

//         const legendTable = legendRelation?.from_table || dataset.name;
//         let legendJoin = "";
//         if (legendRelation) {
//           const legendTableAlias = legendRelation.from_table[0];
//           legendJoin = `INNER JOIN "${legendRelation.from_table}" AS ${legendTableAlias} ON e."${legendRelation.column_to_table}" = ${legendTableAlias}."${legendRelation.column_from_table}"`;
//         }

//         const crosstabQuery = `SELECT ${oxRef}, ${legendRef}, CAST(${oyField} AS NUMERIC) AS "${
//           oy[0].field
//         }" FROM "${dataset.name}" AS e${legendJoin ? " " + legendJoin : ""}${
//           joins ? " " + joins : ""
//         } GROUP BY ${oxRef}, ${legendRef} ORDER BY ${oxRef}, ${legendRef}`;

//         const dynamicColumnsQuery = `(SELECT string_agg(quote_ident("${legend}"::text) || ' NUMERIC', ', ')
//           FROM (SELECT DISTINCT "${legend}" FROM "${legendTable}" ORDER BY "${legend}") AS subquery)`;

//         const oxDataTypeQuery = `(SELECT data_type FROM information_schema.columns WHERE table_name = '${oxTableName}' AND column_name = '${ox}' LIMIT 1)`;

//         return `SELECT format(
//             'SELECT * FROM crosstab(
//                 ''${crosstabQuery}''
//             ) AS result("${ox}" %s, %s);',
//             ${oxDataTypeQuery},
//             ${dynamicColumnsQuery}
//         );`;
//       }

//       const oyFields = oy
//         .map((y) => applyAggregate(y, dataset, allDatasets))
//         .join(", ");
//       return `SELECT ${oxRef}, ${oyFields} FROM "${dataset.name}" AS e${
//         joins ? " " + joins : ""
//       } GROUP BY ${oxRef} ORDER BY ${oxRef} ASC;`;
//     }

//     case "clustered_column":
//     case "clustered_bar": {
//       if (!checkRequired("X-Axis") || !checkRequired("Y-Axis"))
//         return "Error: X-Axis and Y-Axis are required";
//       const ox = (inputs["X-Axis"] as InputValue).field;
//       const oy = inputs["Y-Axis"] as InputValue[];
//       const legend = inputs["Legend"]
//         ? (inputs["Legend"] as InputValue[])[0]?.field
//         : null;

//       if (!validateColumn(ox, dataset))
//         return `Error: Column "${ox}" does not exist`;
//       for (const y of oy) {
//         if (!validateColumn(y.field, dataset))
//           return `Error: Column "${y.field}" does not exist`;
//       }
//       if (legend && !validateColumn(legend, dataset))
//         return `Error: Column "${legend}" does not exist`;

//       const usedColumns = [ox, ...oy.map((y) => y.field)];
//       if (legend) usedColumns.push(legend);

//       const joins = buildJoins(usedColumns, dataset);
//       const oxRef = getColumnReference(ox, dataset);
//       const oxTableName = getOxTableName(ox, dataset);

//       if (legend) {
//         if (oy.length > 1)
//           return "Error: Only one Y-Axis allowed when Legend is present";
//         const oyField = applyAggregate(oy[0], dataset, allDatasets, true);
//         const legendRef = getColumnReference(legend, dataset);
//         const joinMapping = createJoinMapping(dataset);
//         const legendRelation = joinMapping[legend];

//         const legendTable = legendRelation?.from_table || dataset.name;
//         let legendJoin = "";
//         if (legendRelation) {
//           const legendTableAlias = legendRelation.from_table[0];
//           legendJoin = `INNER JOIN "${legendRelation.from_table}" AS ${legendTableAlias} ON e."${legendRelation.column_to_table}" = ${legendTableAlias}."${legendRelation.column_from_table}"`;
//         }

//         const crosstabQuery = `SELECT ${oxRef}, ${legendRef}, CAST(${oyField} AS NUMERIC) AS "${
//           oy[0].field
//         }" FROM "${dataset.name}" AS e${legendJoin ? " " + legendJoin : ""}${
//           joins ? " " + joins : ""
//         } GROUP BY ${oxRef}, ${legendRef} ORDER BY ${oxRef}, ${legendRef}`;

//         const dynamicColumnsQuery = `(SELECT string_agg(quote_ident("${legend}"::text) || ' NUMERIC', ', ')
//           FROM (SELECT DISTINCT "${legend}" FROM "${legendTable}" ORDER BY "${legend}") AS subquery)`;

//         const oxDataTypeQuery = `(SELECT data_type FROM information_schema.columns WHERE table_name = '${oxTableName}' AND column_name = '${ox}' LIMIT 1)`;

//         return `SELECT format(
//             'SELECT * FROM crosstab(
//                 ''${crosstabQuery}''
//             ) AS result("${ox}" %s, %s);',
//             ${oxDataTypeQuery},
//             ${dynamicColumnsQuery}
//         );`;
//       }

//       const oyFields = oy
//         .map((y) => applyAggregate(y, dataset, allDatasets))
//         .join(", ");
//       return `SELECT ${oxRef}, ${oyFields} FROM "${dataset.name}" AS e${
//         joins ? " " + joins : ""
//       } GROUP BY ${oxRef} ORDER BY ${oxRef} ASC;`;
//     }

//     case "line_stacked_column":
//     case "line_clustered_column": {
//       if (
//         !checkRequired("X-Axis") ||
//         !checkRequired("Column(Y-Axis)") ||
//         !checkRequired("Line(Y-Axis)")
//       ) {
//         return "Error: X-Axis, Column(Y-Axis), and Line(Y-Axis) are required";
//       }
//       const ox = (inputs["X-Axis"] as InputValue).field;
//       const columnOy = inputs["Column(Y-Axis)"] as InputValue[];
//       const lineOy = inputs["Line(Y-Axis)"] as InputValue[];
//       const legend = inputs["Column Legend"]
//         ? (inputs["Column Legend"] as InputValue).field
//         : null;

//       if (!validateColumn(ox, dataset))
//         return `Error: Column "${ox}" does not exist`;
//       for (const y of columnOy) {
//         if (!validateColumn(y.field, dataset))
//           return `Error: Column "${y.field}" does not exist`;
//       }
//       for (const y of lineOy) {
//         if (!validateColumn(y.field, dataset))
//           return `Error: Column "${y.field}" does not exist`;
//       }
//       if (legend && !validateColumn(legend, dataset))
//         return `Error: Column "${legend}" does not exist`;

//       const usedColumns = [
//         ox,
//         ...columnOy.map((y) => y.field),
//         ...lineOy.map((y) => y.field),
//       ];
//       if (legend) usedColumns.push(legend);

//       const joins = buildJoins(usedColumns, dataset);
//       const oxRef = getColumnReference(ox, dataset);
//       const oxTableName = getOxTableName(ox, dataset);

//       if (legend) {
//         if (columnOy.length > 1)
//           return "Error: Only one Column(Y-Axis) allowed when Column Legend is present";
//         const oyField = applyAggregate(columnOy[0], dataset, allDatasets, true);
//         const legendRef = getColumnReference(legend, dataset);
//         const joinMapping = createJoinMapping(dataset);
//         const legendRelation = joinMapping[legend];

//         const legendTable = legendRelation?.from_table || dataset.name;
//         let legendJoin = "";
//         if (legendRelation) {
//           const legendTableAlias = legendRelation.from_table[0];
//           legendJoin = `INNER JOIN "${legendRelation.from_table}" AS ${legendTableAlias} ON e."${legendRelation.column_to_table}" = ${legendTableAlias}."${legendRelation.column_from_table}"`;
//         }

//         const crosstabQuery = `SELECT ${oxRef}, ${legendRef}, CAST(${oyField} AS NUMERIC) AS "${
//           columnOy[0].field
//         }" FROM "${dataset.name}" AS e${legendJoin ? " " + legendJoin : ""}${
//           joins ? " " + joins : ""
//         } GROUP BY ${oxRef}, ${legendRef} ORDER BY ${oxRef}, ${legendRef}`;

//         const dynamicColumnsQuery = `(SELECT string_agg(quote_ident("${legend}"::text) || ' NUMERIC', ', ')
//           FROM (SELECT DISTINCT "${legend}" FROM "${legendTable}" ORDER BY "${legend}") AS subquery)`;

//         const oxDataTypeQuery = `(SELECT data_type FROM information_schema.columns WHERE table_name = '${oxTableName}' AND column_name = '${ox}' LIMIT 1)`;

//         return `SELECT format(
//             'SELECT * FROM crosstab(
//                 ''${crosstabQuery}''
//             ) AS result("${ox}" %s, %s);',
//             ${oxDataTypeQuery},
//             ${dynamicColumnsQuery}
//         );`;
//       }

//       const columnFields = columnOy
//         .map((y) => applyAggregate(y, dataset, allDatasets))
//         .join(", ");
//       const lineFields = lineOy
//         .map((y) => applyAggregate(y, dataset, allDatasets))
//         .join(", ");
//       return `SELECT ${oxRef}, ${columnFields}, ${lineFields} FROM "${
//         dataset.name
//       }" AS e${
//         joins ? " " + joins : ""
//       } GROUP BY ${oxRef} ORDER BY ${oxRef} ASC;`;
//     }

//     case "waterfall": {
//       // Kiểm tra các input bắt buộc
//       if (
//         !checkRequired("Category") ||
//         !checkRequired("Breakdown") ||
//         !checkRequired("Y-Axis")
//       ) {
//         return "Error: Category, Breakdown, and Y-Axis are required";
//       }

//       // Lấy các trường từ inputs
//       const ox = (inputs["Category"] as InputValue).field; // Cột danh mục (x-axis)
//       const breakdown = (inputs["Breakdown"] as InputValue).field; // Cột phân tích chi tiết
//       const oyInput = inputs["Y-Axis"] as InputValue; // Cột giá trị (y-axis)
//       const oy = applyAggregate(oyInput, dataset, allDatasets, true); // Áp dụng hàm tổng hợp cho y-axis

//       // Kiểm tra tính hợp lệ của các cột
//       if (!validateColumn(ox, dataset))
//         return `Error: Column "${ox}" does not exist`;
//       if (!validateColumn(breakdown, dataset))
//         return `Error: Column "${breakdown}" does not exist`;
//       if (!validateColumn(oyInput.field, dataset))
//         return `Error: Column "${oyInput.field}" does not exist`;

//       // Kiểm tra kiểu dữ liệu của oy để đảm bảo có thể ép kiểu thành NUMERIC
//       const oyDataType = getColumnDataType(
//         oyInput.field,
//         dataset,
//         allDatasets
//       ).toLowerCase();
//       const numericTypes = ["integer", "bigint", "numeric", "decimal", "float"];
//       if (!numericTypes.includes(oyDataType) && !oyInput.aggregate) {
//         return `Error: Column "${oyInput.field}" must be numeric or have an aggregate function to cast to NUMERIC`;
//       }

//       // Xác định các cột được sử dụng để tạo JOIN
//       const usedColumns = [ox, breakdown, oyInput.field];
//       const joins = buildJoins(usedColumns, dataset);

//       // Lấy tham chiếu cột và tên bảng
//       const oxRef = getColumnReference(ox, dataset);
//       const breakdownRef = getColumnReference(breakdown, dataset);
//       const oxTableName = getOxTableName(ox, dataset);

//       // Xác định bảng chứa breakdown (bảng chính hoặc bảng liên quan)
//       const joinMapping = createJoinMapping(dataset);
//       const breakdownRelation = joinMapping[breakdown];
//       let breakdownTable = dataset.name;
//       let breakdownJoin = joins;

//       if (breakdownRelation) {
//         const breakdownTableAlias = breakdownRelation.from_table[0];
//         const joinCondition = `e."${breakdownRelation.column_to_table}" = ${breakdownTableAlias}."${breakdownRelation.column_from_table}"`;
//         breakdownTable = breakdownRelation.from_table;
//         breakdownJoin = `INNER JOIN "${breakdownTable}" AS ${breakdownTableAlias} ON ${joinCondition}${
//           joins ? " " + joins : ""
//         }`;
//       }

//       // Truy vấn để lấy kiểu dữ liệu của ox
//       const oxDataTypeQuery = `(SELECT data_type FROM information_schema.columns WHERE table_name = '${oxTableName}' AND column_name = '${ox}' LIMIT 1)`;

//       // Truy vấn để tạo danh sách cột động từ breakdown
//       const dynamicColumnsQuery = `(SELECT string_agg(quote_ident("${breakdown}"::text) || ' NUMERIC', ', ')
//         FROM (SELECT DISTINCT "${breakdown}" FROM "${breakdownTable}" ORDER BY "${breakdown}") AS subquery)`;

//       // Xây dựng câu query crosstab theo logic BA
//       const crosstabQuery = `
//         SELECT ${oxRef}, ${breakdownRef}, CAST(${oy} AS NUMERIC) AS "${
//         oyInput.field
//       }"
//         FROM (
//           SELECT
//             ${oxRef} AS "${ox}",
//             ''Total'' AS "${breakdown}",
//             CAST(${oy} AS NUMERIC) AS "${oyInput.field}",
//             1 AS stt
//           FROM "${dataset.name}" AS e
//           ${joins ? " " + joins : ""}
//           GROUP BY ${oxRef}
//           UNION ALL
//           SELECT
//             ${oxRef} AS "${ox}",
//             ${breakdownRef} AS "${breakdown}",
//             CAST(${oy} AS NUMERIC) AS "${oyInput.field}",
//             2 AS stt
//           FROM "${dataset.name}" AS e
//           ${breakdownJoin}
//           GROUP BY ${oxRef}, ${breakdownRef}
//           ORDER BY "${ox}", stt, "${breakdown}"
//         ) AS src
//         ORDER BY "${ox}", stt, "${breakdown}"
//       `;

//       // Tạo câu SQL format cho crosstab
//       return `
//         SELECT format(
//           'SELECT * FROM crosstab(
//             ''${crosstabQuery.replace(/'/g, "''")}''
//           ) AS result("${ox}" %s, %s);',
//           ${oxDataTypeQuery},
//           ${dynamicColumnsQuery}
//         );
//       `;
//     }

//     case "line": {
//       if (!checkRequired("X-Axis") || !checkRequired("Y-Axis"))
//         return "Error: X-Axis and Y-Axis are required";
//       const ox = (inputs["X-Axis"] as InputValue).field;
//       const oy = inputs["Y-Axis"] as InputValue[];
//       const secondaryOy = inputs["Secondary Y-Axis"]
//         ? (inputs["Secondary Y-Axis"] as InputValue[])
//         : [];
//       const legend = inputs["Legend"]
//         ? (inputs["Legend"] as InputValue).field
//         : null;

//       if (!validateColumn(ox, dataset))
//         return `Error: Column "${ox}" does not exist`;
//       for (const y of oy) {
//         if (!validateColumn(y.field, dataset))
//           return `Error: Column "${y.field}" does not exist`;
//       }
//       for (const y of secondaryOy) {
//         if (!validateColumn(y.field, dataset))
//           return `Error: Column "${y.field}" does not exist`;
//       }
//       if (legend && !validateColumn(legend, dataset))
//         return `Error: Column "${legend}" does not exist`;

//       const usedColumns = [
//         ox,
//         ...oy.map((y) => y.field),
//         ...secondaryOy.map((y) => y.field),
//       ];
//       if (legend) usedColumns.push(legend);

//       const joins = buildJoins(usedColumns, dataset);
//       const oxRef = getColumnReference(ox, dataset);
//       const oxTableName = getOxTableName(ox, dataset);

//       if (legend) {
//         if (oy.length > 1 || secondaryOy.length > 0)
//           return "Error: Only one Y-Axis allowed when Legend is present";
//         const oyField = applyAggregate(oy[0], dataset, allDatasets, true);
//         const legendRef = getColumnReference(legend, dataset);
//         const joinMapping = createJoinMapping(dataset);
//         const legendRelation = joinMapping[legend];

//         const legendTable = legendRelation?.from_table || dataset.name;
//         let legendJoin = "";
//         if (legendRelation) {
//           const legendTableAlias = legendRelation.from_table[0];
//           legendJoin = `INNER JOIN "${legendRelation.from_table}" AS ${legendTableAlias} ON e."${legendRelation.column_to_table}" = ${legendTableAlias}."${legendRelation.column_from_table}"`;
//         }

//         const crosstabQuery = `SELECT ${oxRef}, ${legendRef}, CAST(${oyField} AS NUMERIC) AS "${
//           oy[0].field
//         }" FROM "${dataset.name}" AS e${legendJoin ? " " + legendJoin : ""}${
//           joins ? " " + joins : ""
//         } GROUP BY ${oxRef}, ${legendRef} ORDER BY ${oxRef}, ${legendRef}`;

//         const dynamicColumnsQuery = `(SELECT string_agg(quote_ident("${legend}"::text) || ' NUMERIC', ', ')
//           FROM (SELECT DISTINCT "${legend}" FROM "${legendTable}" ORDER BY "${legend}") AS subquery)`;

//         const oxDataTypeQuery = `(SELECT data_type FROM information_schema.columns WHERE table_name = '${oxTableName}' AND column_name = '${ox}' LIMIT 1)`;

//         return `SELECT format(
//             'SELECT * FROM crosstab(
//                 ''${crosstabQuery}''
//             ) AS result("${ox}" %s, %s);',
//             ${oxDataTypeQuery},
//             ${dynamicColumnsQuery}
//         );`;
//       }

//       const oyFields = oy
//         .map((y) => applyAggregate(y, dataset, allDatasets))
//         .join(", ");
//       const secondaryOyFields = secondaryOy
//         .map((y) => applyAggregate(y, dataset, allDatasets))
//         .join(", ");
//       const allFields = [oyFields, secondaryOyFields]
//         .filter(Boolean)
//         .join(", ");
//       return `SELECT ${oxRef}, ${allFields} FROM "${dataset.name}" AS e${
//         joins ? " " + joins : ""
//       } GROUP BY ${oxRef} ORDER BY ${oxRef} ASC;`;
//     }

//     case "table": {
//       if (!checkRequired("Columns")) return "Error: Columns are required";
//       const columns = inputs["Columns"] as InputValue[];
//       for (const col of columns) {
//         if (!validateColumn(col.field, dataset))
//           return `Error: Column "${col.field}" does not exist`;
//       }
//       const usedColumns = columns.map((c) => c.field);
//       const joins = buildJoins(usedColumns, dataset);
//       const selectFields = columns
//         .map((col) => {
//           if (col.aggregate && col.aggregate !== "NONE") {
//             return applyAggregate(col, dataset, allDatasets);
//           }
//           return getColumnReference(col.field, dataset);
//         })
//         .join(", ");
//       const groupByFields = columns
//         .filter((col) => !col.aggregate || col.aggregate === "NONE")
//         .map((col) => getColumnReference(col.field, dataset))
//         .join(", ");
//       return `SELECT ${selectFields} FROM "${dataset.name}" AS e${
//         joins ? " " + joins : ""
//       }${groupByFields ? " GROUP BY " + groupByFields : ""};`;
//     }

//     case "funnel": {
//       if (!checkRequired("Values")) return "Error: Values are required";
//       const category = inputs["Category"]
//         ? (inputs["Category"] as InputValue).field
//         : null;
//       const values = inputs["Values"] as InputValue[];
//       for (const v of values) {
//         if (!validateColumn(v.field, dataset))
//           return `Error: Column "${v.field}" does not exist`;
//       }
//       if (category && !validateColumn(category, dataset))
//         return `Error: Column "${category}" does not exist`;

//       const usedColumns = [...values.map((v) => v.field)];
//       if (category) usedColumns.push(category);

//       const joins = buildJoins(usedColumns, dataset);

//       if (category && values.length > 1)
//         return "Error: Only one Value allowed when Category is present";
//       if (!category && values.length === 0)
//         return "Error: At least one Value is required";

//       if (category) {
//         const value = applyAggregate(values[0], dataset, allDatasets);
//         const categoryRef = getColumnReference(category, dataset);
//         return `SELECT ${categoryRef} AS category, ${value} FROM "${
//           dataset.name
//         }" AS e${
//           joins ? " " + joins : ""
//         } GROUP BY ${categoryRef} ORDER BY ${value} DESC;`;
//       }

//       const selectFields = values
//         .map((v) => applyAggregate(v, dataset, allDatasets))
//         .join(", ");
//       return `SELECT ${selectFields} FROM "${dataset.name}" AS e${
//         joins ? " " + joins : ""
//       } ORDER BY ${values
//         .map((v) => applyAggregate(v, dataset, allDatasets))
//         .join(", ")} DESC;`;
//     }

//     default:
//       return "Error: Unsupported chart type";
//   }
// }

// // Hàm xử lý khi nhấn "Run" để tạo câu SQL con hoặc SQL thứ hai
// export function runCrosstabQuery(
//   chartType: string,
//   inputs: ChartInput,
//   dataset: Dataset,
//   allDatasets: Dataset[],
//   firstSqlQuery: string
// ): string {
//   if (!dataset) return "Error: Dataset is required";

//   const ox = (inputs["X-Axis"] || inputs["Category"]) as InputValue;
//   const legend = (inputs["Legend"] || inputs["Column Legend"]) as InputValue;
//   const breakdown = inputs["Breakdown"] as InputValue;
//   const columnOy = inputs["Column(Y-Axis)"] as InputValue[];
//   const lineOy = inputs["Line(Y-Axis)"] as InputValue[];

//   const legendOrBreakdown = legend?.field || breakdown?.field;

//   // Giả lập chạy câu SQL format để lấy câu SQL con
//   const crosstabQuery = simulateFormatQuery(
//     firstSqlQuery,
//     ox?.field || "",
//     dataset,
//     legendOrBreakdown
//   );

//   if (crosstabQuery.startsWith("Error")) {
//     return crosstabQuery;
//   }

//   // Đối với Line + Stacked/Clustered Column, tạo câu SQL thứ hai với WITH
//   if (
//     ["line_stacked_column", "line_clustered_column"].includes(
//       chartType.toLowerCase()
//     ) &&
//     legend?.field
//   ) {
//     const joins = buildJoins(
//       [ox.field, ...lineOy.map((y) => y.field)],
//       dataset
//     );
//     const oxRef = getColumnReference(ox.field, dataset);
//     const lineFields = lineOy
//       .map((y) => applyAggregate(y, dataset, allDatasets))
//       .join(", ");

//     return `WITH column_legend AS (
//       ${crosstabQuery}
//     ),
//     line AS (
//       SELECT ${oxRef}, ${lineFields} FROM "${dataset.name}" AS e${
//       joins ? " " + joins : ""
//     } GROUP BY ${oxRef}
//     )
//     SELECT column_legend.*, ${lineOy.map((y) => `"${y.field}"`).join(", ")}
//     FROM column_legend INNER JOIN line ON column_legend."${ox.field}" = line."${
//       ox.field
//     }";`;
//   }

//   // Đối với các chart khác (Stacked, Clustered, Waterfall, Line với Legend), trả về câu SQL con
//   return crosstabQuery;
// }

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

interface InputValue {
  field: string;
  aggregate?: string;
}

interface ChartInput {
  [key: string]: InputValue | InputValue[];
}

// Tạo mapping cho join
const createJoinMapping = (
  dataset: Dataset
): { [key: string]: Relationship } => {
  const mapping: { [key: string]: Relationship } = {};
  dataset.relationships.forEach((relation) => {
    mapping[relation.column_from_table] = relation;
    mapping[relation.column_to_table] = relation;
  });
  return mapping;
};

// Tạo câu JOIN
const buildJoins = (
  usedColumns: string[],
  dataset: Dataset,
  joinType: "LEFT" | "INNER" = "LEFT"
): string => {
  const joinMapping = createJoinMapping(dataset);
  const joins: string[] = [];
  const usedTables = new Set<string>();

  usedColumns.forEach((col) => {
    const relation = joinMapping[col];
    if (relation && !usedTables.has(relation.from_table)) {
      usedTables.add(relation.from_table);
      joins.push(
        `${joinType} JOIN "${relation.from_table}" ${relation.from_table[0]} ON e."${relation.column_to_table}" = ${relation.from_table[0]}."${relation.column_from_table}"`
      );
    }
  });

  return joins.length > 0 ? joins.join("\n") : "";
};

// Kiểm tra xem cột có thuộc bảng chính không
const isMainTableColumn = (column: string, dataset: Dataset): boolean => {
  return dataset.columns.some((c) => c.column_name === column);
};

// Tạo tham chiếu cột
const getColumnReference = (column: string, dataset: Dataset): string => {
  if (isMainTableColumn(column, dataset)) {
    return `e."${column}"`;
  }
  const relation = dataset.relationships.find(
    (r) => r.column_from_table === column
  );
  if (relation) {
    return `${relation.from_table[0]}."${column}"`;
  }
  return `e."${column}"`;
};

// Lấy data_type của cột từ metadata
const getColumnDataType = (
  column: string,
  dataset: Dataset,
  allDatasets: Dataset[]
): string => {
  const columnInfo = dataset.columns.find((c) => c.column_name === column);
  if (columnInfo) return columnInfo.data_type;

  const relation = dataset.relationships.find(
    (r) => r.column_from_table === column
  );
  if (relation) {
    const relatedDataset = allDatasets.find(
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

// Áp dụng hàm tổng hợp
const applyAggregate = (
  field: InputValue,
  dataset: Dataset,
  allDatasets: Dataset[],
  forCrosstab: boolean = false,
  chartType: string = ""
): string => {
  const alias = forCrosstab ? field.field : `"${field.field}"`;
  const columnRef = getColumnReference(field.field, dataset);
  const dataType = getColumnDataType(field.field, dataset, allDatasets);

  if (chartType.toLowerCase() === "card") {
    const numericTypes = [
      "integer",
      "bigint",
      "numeric",
      "decimal",
      "float",
      "double",
      "double precision",
    ];
    if (numericTypes.includes(dataType.toLowerCase())) {
      return forCrosstab
        ? `SUM(${columnRef})`
        : `SUM(${columnRef}) AS ${alias}`;
    }
    return forCrosstab
      ? `COUNT(${columnRef})`
      : `COUNT(${columnRef}) AS ${alias}`;
  }

  if (forCrosstab && chartType.toLowerCase() === "waterfall") {
    const numericTypes = [
      "integer",
      "bigint",
      "numeric",
      "decimal",
      "float",
      "double",
      "double precision",
    ];
    if (numericTypes.includes(dataType.toLowerCase())) {
      return `SUM(${columnRef})`;
    }
    return `COUNT(${columnRef})`;
  }

  if (!field.aggregate) {
    return forCrosstab ? columnRef : `${columnRef} AS ${alias}`;
  }

  const numericTypes = [
    "integer",
    "bigint",
    "numeric",
    "decimal",
    "float",
    "double",
    "double precision",
  ];
  const dateTypes = ["date", "timestamp", "timestamp without time zone"];
  const textTypes = ["text", "varchar", "char"];

  if (
    textTypes.includes(dataType) &&
    !["COUNT", "COUNT DISTINCT"].includes(field.aggregate!)
  ) {
    return forCrosstab
      ? `COUNT(${columnRef})`
      : `COUNT(${columnRef}) AS ${alias}`;
  }
  if (
    dateTypes.includes(dataType) &&
    !["COUNT", "MIN", "MAX"].includes(field.aggregate!)
  ) {
    return forCrosstab
      ? `COUNT(${columnRef})`
      : `COUNT(${columnRef}) AS ${alias}`;
  }
  if (numericTypes.includes(dataType)) {
    if (
      !["SUM", "COUNT", "AVG", "MAX", "MIN", "COUNT DISTINCT"].includes(
        field.aggregate!
      )
    ) {
      return forCrosstab
        ? `COUNT(${columnRef})`
        : `COUNT(${columnRef}) AS ${alias}`;
    }
  }
  const expression = `${field.aggregate}(${columnRef})`;
  return forCrosstab ? expression : `${expression} AS ${alias}`;
};

// Kiểm tra xem cột có tồn tại trong dataset không
const validateColumn = (column: string, dataset: Dataset): boolean => {
  return (
    dataset.columns.some((c) => c.column_name === column) ||
    dataset.relationships.some((r) => r.column_from_table === column)
  );
};

// Lấy table_name của cột ox
const getOxTableName = (ox: string, dataset: Dataset): string => {
  if (isMainTableColumn(ox, dataset)) {
    return dataset.name;
  }
  const relation = dataset.relationships.find(
    (r) => r.column_from_table === ox
  );
  return relation ? relation.from_table : dataset.name;
};

// Hàm giả lập chạy format để lấy câu SQL con
const simulateFormatQuery = (
  formatQuery: string,
  ox: string,
  dataset: Dataset,
  legendOrBreakdown: string
): string => {
  const crosstabMatch = formatQuery.match(
    /SELECT\s*\*\s*FROM\s*crosstab\s*\(\s*'([^']+)'\s*(?:,\s*'([^']+)')?\s*\)\s*AS\s*result\s*\(\s*"[^"]+"\s*([^,]+),\s*([^)]+)\s*\)/i
  );
  if (!crosstabMatch) {
    return "Error: Invalid crosstab format query";
  }
  const innerQuery = crosstabMatch[1];
  const categorySql = crosstabMatch[2] || "";
  return `SELECT * FROM crosstab('${innerQuery}'${
    categorySql ? ", '" + categorySql + "'" : ""
  }) AS result("${ox}" ${getColumnDataType(ox, dataset, [])}${
    legendOrBreakdown ? `, "${legendOrBreakdown}" NUMERIC` : ""
  });`;
};

export function sqlBuilder(
  chartType: string,
  inputs: ChartInput,
  dataset: Dataset,
  allDatasets: Dataset[]
): string {
  console.log("🚀 ~ inputs:", inputs);
  console.log("🚀 ~ inputscccc:", inputs["Y-Axis"]);
  if (!dataset) return "Error: Dataset is required";

  const checkRequired = (inputName: string): boolean => {
    return (
      !!inputs[inputName] &&
      (Array.isArray(inputs[inputName])
        ? (inputs[inputName] as InputValue[]).length > 0
        : !!(inputs[inputName] as InputValue).field)
    );
  };

  const getUsedColumns = (): string[] => {
    const columns: string[] = [];
    Object.values(inputs).forEach((input) => {
      if (Array.isArray(input)) {
        input.forEach((val) => val.field && columns.push(val.field));
      } else if (input.field) {
        columns.push(input.field);
      }
    });
    return Array.from(new Set(columns));
  };

  switch (chartType.toLowerCase()) {
    case "card": {
      if (!checkRequired("Field")) return "Error: Field is required";
      const field = inputs["Field"] as InputValue;
      if (!validateColumn(field.field, dataset))
        return `Error: Column "${field.field}" does not exist`;
      const aggField = applyAggregate(
        field,
        dataset,
        allDatasets,
        false,
        "card"
      );
      const joins = buildJoins([field.field], dataset);
      return `SELECT ${aggField} FROM "${dataset.name}" AS e${
        joins ? " " + joins : ""
      };`;
    }

    case "pie":
    case "donut": {
      if (!checkRequired("Values") || !checkRequired("Details"))
        return "Error: Values and Details are required";
      const values = (inputs["Values"] as InputValue).field;
      const details = inputs["Details"] as InputValue[];
      if (!validateColumn(values, dataset))
        return `Error: Column "${values}" does not exist`;
      for (const d of details) {
        if (!validateColumn(d.field, dataset))
          return `Error: Column "${d.field}" does not exist`;
      }
      const detailFields = details
        .map((v) => applyAggregate(v, dataset, allDatasets))
        .join(", ");
      const usedColumns = [values, ...details.map((d) => d.field)];
      const joins = buildJoins(usedColumns, dataset);
      const valuesRef = getColumnReference(values, dataset);
      return `SELECT ${valuesRef} AS "${values}", ${detailFields} FROM "${
        dataset.name
      }" AS e${
        joins ? " " + joins : ""
      } GROUP BY ${valuesRef} ORDER BY ${valuesRef};`;
    }

    case "stacked_column":
    case "stacked_bar":
    case "area":
    case "stacked_area": {
      if (!checkRequired("X-Axis") || !checkRequired("Y-Axis"))
        return "Error: X-Axis and Y-Axis are required";
      const ox = (inputs["X-Axis"] as InputValue).field;
      const oy = inputs["Y-Axis"] as InputValue[];
      const legend = inputs["Legend"]
        ? (inputs["Legend"] as InputValue[])[0]?.field
        : null;

      if (!validateColumn(ox, dataset))
        return `Error: Column "${ox}" does not exist`;
      for (const y of oy) {
        if (!validateColumn(y.field, dataset))
          return `Error: Column "${y.field}" does not exist`;
      }
      if (legend && !validateColumn(legend, dataset))
        return `Error: Column "${legend}" does not exist`;

      const usedColumns = [ox, ...oy.map((y) => y.field)];
      if (legend) usedColumns.push(legend);

      const joins = buildJoins(usedColumns, dataset);
      const oxRef = getColumnReference(ox, dataset);
      const oxTableName = getOxTableName(ox, dataset);

      if (legend) {
        if (oy.length > 1)
          return "Error: Only one Y-Axis allowed when Legend is present";
        const oyField = applyAggregate(oy[0], dataset, allDatasets, true);
        const legendRef = getColumnReference(legend, dataset);
        const joinMapping = createJoinMapping(dataset);
        const legendRelation = joinMapping[legend];

        const legendTable = legendRelation?.from_table || dataset.name;
        let legendJoin = "";
        if (legendRelation) {
          const legendTableAlias = legendRelation.from_table[0];
          legendJoin = `INNER JOIN "${legendRelation.from_table}" AS ${legendTableAlias} ON e."${legendRelation.column_to_table}" = ${legendTableAlias}."${legendRelation.column_from_table}"`;
        }

        const crosstabQuery = `SELECT ${oxRef}, ${legendRef}, CAST(${oyField} AS NUMERIC) AS "${
          oy[0].field
        }" FROM "${dataset.name}" AS e${legendJoin ? " " + legendJoin : ""}${
          joins ? " " + joins : ""
        } GROUP BY ${oxRef}, ${legendRef} ORDER BY ${oxRef}, ${legendRef}`;

        const dynamicColumnsQuery = `(SELECT string_agg(quote_ident("${legend}"::text) || ' NUMERIC', ', ') 
          FROM (SELECT DISTINCT "${legend}" FROM "${legendTable}" ORDER BY "${legend}") AS subquery)`;

        const oxDataTypeQuery = `(SELECT data_type FROM information_schema.columns WHERE table_name = '${oxTableName}' AND column_name = '${ox}' LIMIT 1)`;

        return `SELECT format(
            'SELECT * FROM crosstab(
                ''${crosstabQuery}''
            ) AS result("${ox}" %s, %s);',
            ${oxDataTypeQuery},
            ${dynamicColumnsQuery}
        );`;
      }

      const oyFields = oy
        .map((y) => applyAggregate(y, dataset, allDatasets))
        .join(", ");
      return `SELECT ${oxRef}, ${oyFields} FROM "${dataset.name}" AS e${
        joins ? " " + joins : ""
      } GROUP BY ${oxRef} ORDER BY ${oxRef} ASC;`;
    }

    case "clustered_column":
    case "clustered_bar": {
      if (!checkRequired("X-Axis") || !checkRequired("Y-Axis"))
        return "Error: X-Axis and Y-Axis are required";
      const ox = (inputs["X-Axis"] as InputValue).field;
      const oy = inputs["Y-Axis"] as InputValue[];
      const legend = inputs["Legend"]
        ? (inputs["Legend"] as InputValue[])[0]?.field
        : null;

      if (!validateColumn(ox, dataset))
        return `Error: Column "${ox}" does not exist`;
      for (const y of oy) {
        if (!validateColumn(y.field, dataset))
          return `Error: Column "${y.field}" does not exist`;
      }
      if (legend && !validateColumn(legend, dataset))
        return `Error: Column "${legend}" does not exist`;

      const usedColumns = [ox, ...oy.map((y) => y.field)];
      if (legend) usedColumns.push(legend);

      const joins = buildJoins(usedColumns, dataset);
      const oxRef = getColumnReference(ox, dataset);
      const oxTableName = getOxTableName(ox, dataset);

      if (legend) {
        if (oy.length > 1)
          return "Error: Only one Y-Axis allowed when Legend is present";
        const oyField = applyAggregate(oy[0], dataset, allDatasets, true);
        const legendRef = getColumnReference(legend, dataset);
        const joinMapping = createJoinMapping(dataset);
        const legendRelation = joinMapping[legend];

        const legendTable = legendRelation?.from_table || dataset.name;
        let legendJoin = "";
        if (legendRelation) {
          const legendTableAlias = legendRelation.from_table[0];
          legendJoin = `INNER JOIN "${legendRelation.from_table}" AS ${legendTableAlias} ON e."${legendRelation.column_to_table}" = ${legendTableAlias}."${legendRelation.column_from_table}"`;
        }

        const crosstabQuery = `SELECT ${oxRef}, ${legendRef}, CAST(${oyField} AS NUMERIC) AS "${
          oy[0].field
        }" FROM "${dataset.name}" AS e${legendJoin ? " " + legendJoin : ""}${
          joins ? " " + joins : ""
        } GROUP BY ${oxRef}, ${legendRef} ORDER BY ${oxRef}, ${legendRef}`;

        const dynamicColumnsQuery = `(SELECT string_agg(quote_ident("${legend}"::text) || ' NUMERIC', ', ') 
          FROM (SELECT DISTINCT "${legend}" FROM "${legendTable}" ORDER BY "${legend}") AS subquery)`;

        const oxDataTypeQuery = `(SELECT data_type FROM information_schema.columns WHERE table_name = '${oxTableName}' AND column_name = '${ox}' LIMIT 1)`;

        return `SELECT format(
            'SELECT * FROM crosstab(
                ''${crosstabQuery}''
            ) AS result("${ox}" %s, %s);',
            ${oxDataTypeQuery},
            ${dynamicColumnsQuery}
        );`;
      }

      const oyFields = oy
        .map((y) => applyAggregate(y, dataset, allDatasets))
        .join(", ");
      return `SELECT ${oxRef}, ${oyFields} FROM "${dataset.name}" AS e${
        joins ? " " + joins : ""
      } GROUP BY ${oxRef} ORDER BY ${oxRef} ASC;`;
    }

    case "line_stacked_column":
    case "line_clustered_column": {
      if (
        !checkRequired("X-Axis") ||
        !checkRequired("Column(Y-Axis)") ||
        !checkRequired("Line(Y-Axis)")
      ) {
        return "Error: X-Axis, Column(Y-Axis), and Line(Y-Axis) are required";
      }
      const ox = (inputs["X-Axis"] as InputValue).field;
      const columnOy = inputs["Column(Y-Axis)"] as InputValue[];
      const lineOy = inputs["Line(Y-Axis)"] as InputValue[];
      const legend = inputs["Column Legend"]
        ? (inputs["Column Legend"] as InputValue).field
        : null;

      if (!validateColumn(ox, dataset))
        return `Error: Column "${ox}" does not exist`;
      for (const y of columnOy) {
        if (!validateColumn(y.field, dataset))
          return `Error: Column "${y.field}" does not exist`;
      }
      for (const y of lineOy) {
        if (!validateColumn(y.field, dataset))
          return `Error: Column "${y.field}" does not exist`;
      }
      if (legend && !validateColumn(legend, dataset))
        return `Error: Column "${legend}" does not exist`;

      const usedColumns = [
        ox,
        ...columnOy.map((y) => y.field),
        ...lineOy.map((y) => y.field),
      ];
      if (legend) usedColumns.push(legend);

      const joins = buildJoins(usedColumns, dataset);
      const oxRef = getColumnReference(ox, dataset);
      const oxTableName = getOxTableName(ox, dataset);

      if (legend) {
        if (columnOy.length > 1)
          return "Error: Only one Column(Y-Axis) allowed when Column Legend is present";
        const oyField = applyAggregate(columnOy[0], dataset, allDatasets, true);
        const legendRef = getColumnReference(legend, dataset);
        const joinMapping = createJoinMapping(dataset);
        const legendRelation = joinMapping[legend];

        const legendTable = legendRelation?.from_table || dataset.name;
        let legendJoin = "";
        if (legendRelation) {
          const legendTableAlias = legendRelation.from_table[0];
          legendJoin = `INNER JOIN "${legendRelation.from_table}" AS ${legendTableAlias} ON e."${legendRelation.column_to_table}" = ${legendTableAlias}."${legendRelation.column_from_table}"`;
        }

        const crosstabQuery = `SELECT ${oxRef}, ${legendRef}, CAST(${oyField} AS NUMERIC) AS "${
          columnOy[0].field
        }" FROM "${dataset.name}" AS e${legendJoin ? " " + legendJoin : ""}${
          joins ? " " + joins : ""
        } GROUP BY ${oxRef}, ${legendRef} ORDER BY ${oxRef}, ${legendRef}`;

        const dynamicColumnsQuery = `(SELECT string_agg(quote_ident("${legend}"::text) || ' NUMERIC', ', ') 
          FROM (SELECT DISTINCT "${legend}" FROM "${legendTable}" ORDER BY "${legend}") AS subquery)`;

        const oxDataTypeQuery = `(SELECT data_type FROM information_schema.columns WHERE table_name = '${oxTableName}' AND column_name = '${ox}' LIMIT 1)`;

        return `SELECT format(
            'SELECT * FROM crosstab(
                ''${crosstabQuery}''
            ) AS result("${ox}" %s, %s);',
            ${oxDataTypeQuery},
            ${dynamicColumnsQuery}
        );`;
      }

      const columnFields = columnOy
        .map((y) => applyAggregate(y, dataset, allDatasets))
        .join(", ");
      const lineFields = lineOy
        .map((y) => applyAggregate(y, dataset, allDatasets))
        .join(", ");
      return `SELECT ${oxRef}, ${columnFields}, ${lineFields} FROM "${
        dataset.name
      }" AS e${
        joins ? " " + joins : ""
      } GROUP BY ${oxRef} ORDER BY ${oxRef} ASC;`;
    }

    case "waterfall": {
      // Kiểm tra các input bắt buộc
      if (
        !checkRequired("Category") ||
        !checkRequired("Breakdown") ||
        !checkRequired("Y-Axis")
      ) {
        return "Error: Category, Breakdown, and Y-Axis are required";
      }

      // Lấy các trường từ inputs
      const ox = (inputs["Category"] as InputValue).field; // Cột danh mục (x-axis)
      const breakdown = (inputs["Breakdown"] as InputValue).field; // Cột phân tích chi tiết
      const oyInput = inputs["Y-Axis"] as InputValue; // Cột giá trị (y-axis)
      const oy = applyAggregate(
        oyInput,
        dataset,
        allDatasets,
        true,
        "waterfall"
      ); // Áp dụng hàm tổng hợp cho y-axis

      // Kiểm tra tính hợp lệ của các cột
      if (!validateColumn(ox, dataset))
        return `Error: Column "${ox}" does not exist`;
      if (!validateColumn(breakdown, dataset))
        return `Error: Column "${breakdown}" does not exist`;
      if (!validateColumn(oyInput.field, dataset))
        return `Error: Column "${oyInput.field}" does not exist`;

      // Kiểm tra kiểu dữ liệu của oy để đảm bảo có thể ép kiểu thành NUMERIC
      const oyDataType = getColumnDataType(
        oyInput.field,
        dataset,
        allDatasets
      ).toLowerCase();
      const numericTypes = [
        "integer",
        "bigint",
        "numeric",
        "decimal",
        "float",
        "double",
        "double precision",
      ];
      if (!numericTypes.includes(oyDataType) && !oyInput.aggregate) {
        return `Error: Column "${oyInput.field}" must be numeric or have an aggregate function to cast to NUMERIC`;
      }

      // Xác định các cột được sử dụng để tạo JOIN
      const usedColumns = [ox, breakdown, oyInput.field];
      const joins = buildJoins(usedColumns, dataset);

      // Lấy tham chiếu cột và tên bảng
      const oxRef = getColumnReference(ox, dataset);
      const breakdownRef = getColumnReference(breakdown, dataset);
      const oxTableName = getOxTableName(ox, dataset);

      // Xác định bảng chứa breakdown (bảng chính hoặc bảng liên quan)
      const joinMapping = createJoinMapping(dataset);
      const breakdownRelation = joinMapping[breakdown];
      let breakdownTable = dataset.name;
      let breakdownJoin = joins;

      if (breakdownRelation) {
        const breakdownTableAlias = breakdownRelation.from_table[0];
        const joinCondition = `e."${breakdownRelation.column_to_table}" = ${breakdownTableAlias}."${breakdownRelation.column_from_table}"`;
        breakdownTable = breakdownRelation.from_table;
        breakdownJoin = `INNER JOIN "${breakdownTable}" AS ${breakdownTableAlias} ON ${joinCondition}${
          joins ? " " + joins : ""
        }`;
      }

      // Truy vấn để lấy kiểu dữ liệu của ox
      const oxDataTypeQuery = `(SELECT data_type FROM information_schema.columns WHERE table_name = '${oxTableName}' AND column_name = '${ox}' LIMIT 1)`;

      // Truy vấn để tạo danh sách cột động từ breakdown
      const dynamicColumnsQuery = `(SELECT string_agg(quote_ident("${breakdown}"::text) || ' NUMERIC', ', ') 
        FROM (SELECT DISTINCT "${breakdown}" FROM "${breakdownTable}" WHERE "${breakdown}" IS NOT NULL ORDER BY "${breakdown}") AS subquery)`;

      // Xây dựng câu query crosstab
      // const crosstabQuery = `
      //   SELECT ${oxRef}, ${breakdownRef}, CAST(${oy} AS NUMERIC) AS "${
      //   oyInput.field
      // }"
      //   FROM (
      //     SELECT
      //       ${oxRef} AS "${ox}",
      //       ''Total'' AS "${breakdown}",
      //       CAST(${oy} AS NUMERIC) AS "${oyInput.field}",
      //       1 AS stt
      //     FROM "${dataset.name}" AS e
      //     ${joins ? " " + joins : ""}
      //     GROUP BY ${oxRef}
      //     UNION ALL
      //     SELECT
      //       ${oxRef} AS "${ox}",
      //       ${breakdownRef} AS "${breakdown}",
      //       CAST(${oy} AS NUMERIC) AS "${oyInput.field}",
      //       2 AS stt
      //     FROM "${dataset.name}" AS e
      //     ${breakdownJoin}
      //     GROUP BY ${oxRef}, ${breakdownRef}
      //     ORDER BY "${ox}", stt, "${breakdown}"
      //   ) AS src
      //   ORDER BY "${ox}", stt, "${breakdown}"
      // `;
      const crosstabQuery = `
  SELECT src."${ox}", src."${breakdown}", CAST(src."${
        oyInput.field
      }" AS NUMERIC) AS "${oyInput.field}"
  FROM (
    SELECT 
      ${oxRef} AS "${ox}", 
      ''Total'' AS "${breakdown}", 
      CAST(${oy} AS NUMERIC) AS "${oyInput.field}",
      1 AS stt 
    FROM "${dataset.name}" AS e
    ${joins ? " " + joins : ""}
    GROUP BY ${oxRef}
    UNION ALL
    SELECT 
      ${oxRef} AS "${ox}", 
      ${breakdownRef} AS "${breakdown}", 
      CAST(${oy} AS NUMERIC) AS "${oyInput.field}",
      2 AS stt
    FROM "${dataset.name}" AS e
    ${breakdownJoin}
    GROUP BY ${oxRef}, ${breakdownRef}
    ORDER BY "${ox}", stt, "${breakdown}"
  ) AS src
  ORDER BY "${ox}", stt, "${breakdown}"
`;

      console.log(
        crosstabQuery,
        "crosstabQuerycrosstabQuerycrosstabQuerycrosstabQuerycrosstabQuery"
      );

      // Tạo câu SQL format cho crosstab
      return `
        SELECT format(
          'SELECT * FROM crosstab(
            ''${crosstabQuery.replace(/'/g, "''")}'',
            ''SELECT DISTINCT "${breakdown}" FROM "${breakdownTable}" WHERE "${breakdown}" IS NOT NULL ORDER BY "${breakdown}"''
          ) AS result("${ox}" %s, %s);',
          ${oxDataTypeQuery},
          ${dynamicColumnsQuery}
        );
      `;
    }

    case "line": {
      if (!checkRequired("X-Axis") || !checkRequired("Y-Axis"))
        return "Error: X-Axis and Y-Axis are required";
      const ox = (inputs["X-Axis"] as InputValue).field;
      const oy = inputs["Y-Axis"] as InputValue[];
      const secondaryOy = inputs["Secondary Y-Axis"]
        ? (inputs["Secondary Y-Axis"] as InputValue[])
        : [];
      const legend = inputs["Legend"]
        ? (inputs["Legend"] as InputValue).field
        : null;

      if (!validateColumn(ox, dataset))
        return `Error: Column "${ox}" does not exist`;
      for (const y of oy) {
        if (!validateColumn(y.field, dataset))
          return `Error: Column "${y.field}" does not exist`;
      }
      for (const y of secondaryOy) {
        if (!validateColumn(y.field, dataset))
          return `Error: Column "${y.field}" does not exist`;
      }
      if (legend && !validateColumn(legend, dataset))
        return `Error: Column "${legend}" does not exist`;

      const usedColumns = [
        ox,
        ...oy.map((y) => y.field),
        ...secondaryOy.map((y) => y.field),
      ];
      if (legend) usedColumns.push(legend);

      const joins = buildJoins(usedColumns, dataset);
      const oxRef = getColumnReference(ox, dataset);
      const oxTableName = getOxTableName(ox, dataset);

      if (legend) {
        if (oy.length > 1 || secondaryOy.length > 0)
          return "Error: Only one Y-Axis allowed when Legend is present";
        const oyField = applyAggregate(oy[0], dataset, allDatasets, true);
        const legendRef = getColumnReference(legend, dataset);
        const joinMapping = createJoinMapping(dataset);
        const legendRelation = joinMapping[legend];

        const legendTable = legendRelation?.from_table || dataset.name;
        let legendJoin = "";
        if (legendRelation) {
          const legendTableAlias = legendRelation.from_table[0];
          legendJoin = `INNER JOIN "${legendRelation.from_table}" AS ${legendTableAlias} ON e."${legendRelation.column_to_table}" = ${legendTableAlias}."${legendRelation.column_from_table}"`;
        }

        const crosstabQuery = `SELECT ${oxRef}, ${legendRef}, CAST(${oyField} AS NUMERIC) AS "${
          oy[0].field
        }" FROM "${dataset.name}" AS e${legendJoin ? " " + legendJoin : ""}${
          joins ? " " + joins : ""
        } GROUP BY ${oxRef}, ${legendRef} ORDER BY ${oxRef}, ${legendRef}`;

        const dynamicColumnsQuery = `(SELECT string_agg(quote_ident("${legend}"::text) || ' NUMERIC', ', ') 
          FROM (SELECT DISTINCT "${legend}" FROM "${legendTable}" ORDER BY "${legend}") AS subquery)`;

        const oxDataTypeQuery = `(SELECT data_type FROM information_schema.columns WHERE table_name = '${oxTableName}' AND column_name = '${ox}' LIMIT 1)`;

        return `SELECT format(
            'SELECT * FROM crosstab(
                ''${crosstabQuery}''
            ) AS result("${ox}" %s, %s);',
            ${oxDataTypeQuery},
            ${dynamicColumnsQuery}
        );`;
      }

      const oyFields = oy
        .map((y) => applyAggregate(y, dataset, allDatasets))
        .join(", ");
      const secondaryOyFields = secondaryOy
        .map((y) => applyAggregate(y, dataset, allDatasets))
        .join(", ");
      const allFields = [oyFields, secondaryOyFields]
        .filter(Boolean)
        .join(", ");
      return `SELECT ${oxRef}, ${allFields} FROM "${dataset.name}" AS e${
        joins ? " " + joins : ""
      } GROUP BY ${oxRef} ORDER BY ${oxRef} ASC;`;
    }

    case "table": {
      if (!checkRequired("Columns")) return "Error: Columns are required";
      const columns = inputs["Columns"] as InputValue[];
      for (const col of columns) {
        if (!validateColumn(col.field, dataset))
          return `Error: Column "${col.field}" does not exist`;
      }
      const usedColumns = columns.map((c) => c.field);
      const joins = buildJoins(usedColumns, dataset);
      const selectFields = columns
        .map((col) => {
          if (col.aggregate && col.aggregate !== "NONE") {
            return applyAggregate(col, dataset, allDatasets);
          }
          return getColumnReference(col.field, dataset);
        })
        .join(", ");
      const groupByFields = columns
        .filter((col) => !col.aggregate || col.aggregate === "NONE")
        .map((col) => getColumnReference(col.field, dataset))
        .join(", ");
      return `SELECT ${selectFields} FROM "${dataset.name}" AS e${
        joins ? " " + joins : ""
      }${groupByFields ? " GROUP BY " + groupByFields : ""};`;
    }

    case "funnel": {
      if (!checkRequired("Values")) return "Error: Values are required";
      const category = inputs["Category"]
        ? (inputs["Category"] as InputValue).field
        : null;
      const values = inputs["Values"] as InputValue[];
      for (const v of values) {
        if (!validateColumn(v.field, dataset))
          return `Error: Column "${v.field}" does not exist`;
      }
      if (category && !validateColumn(category, dataset))
        return `Error: Column "${category}" does not exist`;

      const usedColumns = [...values.map((v) => v.field)];
      if (category) usedColumns.push(category);

      const joins = buildJoins(usedColumns, dataset);

      if (category && values.length > 1)
        return "Error: Only one Value allowed when Category is present";
      if (!category && values.length === 0)
        return "Error: At least one Value is required";

      if (category) {
        const value = applyAggregate(values[0], dataset, allDatasets);
        const categoryRef = getColumnReference(category, dataset);
        return `SELECT ${categoryRef} AS category, ${value} FROM "${
          dataset.name
        }" AS e${joins ? " " + joins : ""} GROUP BY ${categoryRef} ORDER BY "${
          values[0].field
        }" DESC;`;
      }

      const selectFields = values
        .map((v) => applyAggregate(v, dataset, allDatasets))
        .join(", ");

      const orderByFields = values.map((v) => `"${v.field}"`).join(", ");
      return `SELECT ${selectFields} FROM "${dataset.name}" AS e${
        joins ? " " + joins : ""
      } ORDER BY ${orderByFields} DESC;`;
      // return `SELECT ${selectFields} FROM "${dataset.name}" AS e${
      //   joins ? " " + joins : ""
      // } ORDER BY ${values
      //   .map((v) => applyAggregate(v, dataset, allDatasets))
      //   .join(", ")} DESC;`;
    }

    default:
      return "Error: Unsupported chart type";
  }
}

// Hàm xử lý khi nhấn "Run" để tạo câu SQL con hoặc SQL thứ hai
export function runCrosstabQuery(
  chartType: string,
  inputs: ChartInput,
  dataset: Dataset,
  allDatasets: Dataset[],
  firstSqlQuery: string
): string {
  if (!dataset) return "Error: Dataset is required";

  const ox = (inputs["X-Axis"] || inputs["Category"]) as InputValue;
  const legend = (inputs["Legend"] || inputs["Column Legend"]) as InputValue;
  const breakdown = inputs["Breakdown"] as InputValue;
  const columnOy = inputs["Column(Y-Axis)"] as InputValue[];
  const lineOy = inputs["Line(Y-Axis)"] as InputValue[];

  const legendOrBreakdown = legend?.field || breakdown?.field;

  // // Giả lập chạy câu SQL format để lấy câu SQL con
  // const crosstabQuery = simulateFormatQuery(
  //   firstSqlQuery,
  //   ox?.field || "",
  //   dataset,
  //   legendOrBreakdown
  // );

  // if (crosstabQuery.startsWith("Error")) {
  //   return crosstabQuery;
  // }

  // Đối với Line + Stacked/Clustered Column, tạo câu SQL thứ hai với WITH
  if (
    ["line_stacked_column", "line_clustered_column"].includes(
      chartType.toLowerCase()
    ) &&
    legend?.field
  ) {
    const joins = buildJoins(
      [ox.field, ...lineOy.map((y) => y.field)],
      dataset
    );
    const oxRef = getColumnReference(ox.field, dataset);
    const lineFields = lineOy
      .map((y) => applyAggregate(y, dataset, allDatasets))
      .join(", ");

    return `WITH column_legend AS (
      ${firstSqlQuery}
    ),
    line AS (
      SELECT ${oxRef}, ${lineFields} FROM "${dataset.name}" AS e${
      joins ? " " + joins : ""
    } GROUP BY ${oxRef}
    )
    SELECT column_legend.*, ${lineOy.map((y) => `"${y.field}"`).join(", ")}
    FROM column_legend INNER JOIN line ON column_legend."${ox.field}" = line."${
      ox.field
    }";`;
  }

  // Đối với các chart khác (Stacked, Clustered, Waterfall, Line với Legend), trả về câu SQL con
  return firstSqlQuery;
}
