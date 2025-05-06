import "./App.css";
import React, { useState } from "react";
import { sqlBuilder, runCrosstabQuery } from "./sqlBuilder";
import ReactECharts from "echarts-for-react";
import * as echarts from "echarts/core";
import EchartsComponent from "./component/ECharts";
import { EChartsType } from "./component/types";
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

// Danh sách dataset thực tế
const datasetsMock: Dataset[] = [
  {
    name: "separation_reason",
    description: "separation_reason ETL from PostgreSQL",
    connection_id: "e790024d-411c-4226-8670-f690dadc1971",
    user_id: "9a31d17f-1442-4946-9662-38ceb80d5b52",
    id: "92831399-4748-44dd-a392-6da738d8ac9e",
    created_at: "2025-04-10T09:07:46.440582Z",
    updated_at: "2025-04-10T09:07:46.440582Z",
    columns: [
      {
        column_name: "SeparationTypeID",
        data_type: "text",
        definition: "Mã loại nghỉ việc.",
      },
      {
        column_name: "SeparationReason",
        data_type: "text",
        definition: "Mô tả lý do (ví dụ: Voluntary, Layoff, Retirement…).",
      },
    ],
    relationships: [
      {
        from_table: "separation_reason",
        column_from_table: "SeparationTypeID",
        to_table: "employee",
        column_to_table: "term_reason",
        cardinality: "1-n",
        id: "d9733e77-de58-4ace-9fc4-5b751d5cae78",
        user_id: "9a31d17f-1442-4946-9662-38ceb80d5b52",
        created_at: "2025-04-17T14:18:40.958367",
        updated_at: "2025-04-17T14:18:40.958367",
        created_by: "9a31d17f-1442-4946-9662-38ceb80d5b52",
        updated_by: "9a31d17f-1442-4946-9662-38ceb80d5b52",
      },
      {
        from_table: "separation_reason",
        column_from_table: "SeparationTypeID",
        to_table: "employee",
        column_to_table: "term_reason",
        cardinality: "1-n",
        id: "40b800cb-fd1e-4470-a7e3-3cceb5db2c3d",
        user_id: "9a31d17f-1442-4946-9662-38ceb80d5b52",
        created_at: "2025-04-17T14:18:56.756251",
        updated_at: "2025-04-17T14:18:56.756251",
        created_by: "9a31d17f-1442-4946-9662-38ceb80d5b52",
        updated_by: "9a31d17f-1442-4946-9662-38ceb80d5b52",
      },
      {
        from_table: "separation_reason",
        column_from_table: "SeparationTypeID",
        to_table: "employee",
        column_to_table: "term_reason",
        cardinality: "1-n",
        id: "527efa47-3a2f-48bc-a4a8-82cda81696ae",
        user_id: "9a31d17f-1442-4946-9662-38ceb80d5b52",
        created_at: "2025-04-23T15:43:23.346766",
        updated_at: "2025-04-23T15:43:23.346766",
        created_by: "9a31d17f-1442-4946-9662-38ceb80d5b52",
        updated_by: "9a31d17f-1442-4946-9662-38ceb80d5b52",
      },
      {
        from_table: "separation_reason",
        column_from_table: "SeparationTypeID",
        to_table: "employee",
        column_to_table: "term_reason",
        cardinality: "1-n",
        id: "e1852966-bf11-4ac8-84ee-ba0d62e6888c",
        user_id: "9a31d17f-1442-4946-9662-38ceb80d5b52",
        created_at: "2025-04-23T15:53:53.342620",
        updated_at: "2025-04-23T15:53:53.342620",
        created_by: "9a31d17f-1442-4946-9662-38ceb80d5b52",
        updated_by: "9a31d17f-1442-4946-9662-38ceb80d5b52",
      },
    ],
  },
  {
    name: "pay_type",
    description: "pay_type ETL from PostgreSQL",
    connection_id: "e790024d-411c-4226-8670-f690dadc1971",
    user_id: "9a31d17f-1442-4946-9662-38ceb80d5b52",
    id: "1dae5041-3d2f-4da3-b80e-c31437216ccd",
    created_at: "2025-04-10T09:07:46.273657Z",
    updated_at: "2025-04-10T09:07:46.273657Z",
    columns: [
      {
        column_name: "PayTypeID",
        data_type: "text",
        definition: "Mã loại hình lương (liên kết đến employee).",
      },
      {
        column_name: "PayType",
        data_type: "text",
        definition: "Mô tả cách trả lương (theo giờ, theo tháng, cố định…).",
      },
    ],
    relationships: [
      {
        from_table: "pay_type",
        column_from_table: "PayTypeID",
        to_table: "employee",
        column_to_table: "pay_type_id",
        cardinality: "1-n",
        id: "82d14238-fd68-4aec-8f6e-fa36b60dcf77",
        user_id: "9a31d17f-1442-4946-9662-38ceb80d5b52",
        created_at: "2025-04-17T14:17:53.161864",
        updated_at: "2025-04-17T14:17:53.161864",
        created_by: "9a31d17f-1442-4946-9662-38ceb80d5b52",
        updated_by: "9a31d17f-1442-4946-9662-38ceb80d5b52",
      },
      {
        from_table: "pay_type",
        column_from_table: "PayTypeID",
        to_table: "employee",
        column_to_table: "pay_type_id",
        cardinality: "1-n",
        id: "f598e5e3-03bb-42fd-a3e0-d09452bf026e",
        user_id: "9a31d17f-1442-4946-9662-38ceb80d5b52",
        created_at: "2025-04-23T15:41:28.199306",
        updated_at: "2025-04-23T15:41:28.199306",
        created_by: "9a31d17f-1442-4946-9662-38ceb80d5b52",
        updated_by: "9a31d17f-1442-4946-9662-38ceb80d5b52",
      },
    ],
  },
  {
    name: "gender",
    description: "gender ETL from PostgreSQL",
    connection_id: "e790024d-411c-4226-8670-f690dadc1971",
    user_id: "9a31d17f-1442-4946-9662-38ceb80d5b52",
    id: "88919233-232b-4ed4-9974-71711514a6e5",
    created_at: "2025-04-10T09:07:45.900217Z",
    updated_at: "2025-04-10T09:07:45.900217Z",
    columns: [
      {
        column_name: "ID",
        data_type: "text",
        definition: "Mã định danh giới tính (primary key).",
      },
      {
        column_name: "Gender",
        data_type: "text",
        definition: "Tên mô tả giới tính (ví dụ: Male, Female, Other…).",
      },
      {
        column_name: "Sort",
        data_type: "bigint",
        definition:
          "Giá trị dùng để sắp xếp thứ tự hiển thị giới tính (ví dụ: 1 cho Male, 2 cho Female…).",
      },
    ],
    relationships: [
      {
        from_table: "gender",
        column_from_table: "ID",
        to_table: "employee",
        column_to_table: "gender",
        cardinality: "1-n",
        id: "480c0875-f64d-460b-be13-d24d355fb144",
        user_id: "9a31d17f-1442-4946-9662-38ceb80d5b52",
        created_at: "2025-04-17T14:12:16.966802",
        updated_at: "2025-04-17T14:12:16.966802",
        created_by: "9a31d17f-1442-4946-9662-38ceb80d5b52",
        updated_by: "9a31d17f-1442-4946-9662-38ceb80d5b52",
      },
      {
        from_table: "gender",
        column_from_table: "ID",
        to_table: "employee",
        column_to_table: "gender",
        cardinality: "1-n",
        id: "550e8e1d-d7d6-4a8c-9679-60ee954fe63e",
        user_id: "9a31d17f-1442-4946-9662-38ceb80d5b52",
        created_at: "2025-04-23T15:41:45.701350",
        updated_at: "2025-04-23T15:41:45.701350",
        created_by: "9a31d17f-1442-4946-9662-38ceb80d5b52",
        updated_by: "9a31d17f-1442-4946-9662-38ceb80d5b52",
      },
    ],
  },
  {
    name: "FP",
    description: "FP ETL from PostgreSQL",
    connection_id: "e790024d-411c-4226-8670-f690dadc1971",
    user_id: "9a31d17f-1442-4946-9662-38ceb80d5b52",
    id: "9822b8c0-c939-4041-bd78-4d347c7d80c5",
    created_at: "2025-04-10T09:07:45.797627Z",
    updated_at: "2025-04-10T09:07:45.797627Z",
    columns: [
      {
        column_name: "FP",
        data_type: "text",
        definition: "Mã loại hình làm việc.",
      },
      {
        column_name: "FPDesc",
        data_type: "text",
        definition: "Mô tả chi tiết loại hình (ví dụ: Full-Time, Part-Time).",
      },
    ],
    relationships: [
      {
        from_table: "FP",
        column_from_table: "FP",
        to_table: "employee",
        column_to_table: "FP",
        cardinality: "1-n",
        id: "5e63daec-34df-4a9e-aa15-da0ac0c79834",
        user_id: "9a31d17f-1442-4946-9662-38ceb80d5b52",
        created_at: "2025-04-17T14:18:21.928711",
        updated_at: "2025-04-17T14:18:21.928711",
        created_by: "9a31d17f-1442-4946-9662-38ceb80d5b52",
        updated_by: "9a31d17f-1442-4946-9662-38ceb80d5b52",
      },
      {
        from_table: "FP",
        column_from_table: "FP",
        to_table: "employee",
        column_to_table: "FP",
        cardinality: "1-n",
        id: "5025319b-f065-405e-bf2b-bf0d3f24fe9a",
        user_id: "9a31d17f-1442-4946-9662-38ceb80d5b52",
        created_at: "2025-04-23T15:41:59.670999",
        updated_at: "2025-04-23T15:41:59.670999",
        created_by: "9a31d17f-1442-4946-9662-38ceb80d5b52",
        updated_by: "9a31d17f-1442-4946-9662-38ceb80d5b52",
      },
    ],
  },
  {
    name: "ethnicity",
    description: "ethnicity ETL from PostgreSQL",
    connection_id: "e790024d-411c-4226-8670-f690dadc1971",
    user_id: "9a31d17f-1442-4946-9662-38ceb80d5b52",
    id: "23f2408d-5dc1-48f7-8476-2d2ee78e6afa",
    created_at: "2025-04-10T09:07:45.582082Z",
    updated_at: "2025-04-10T09:07:45.582082Z",
    columns: [
      {
        column_name: "EthnicGroup",
        data_type: "integer",
        definition: "Mã nhóm dân tộc (liên kết đến employee).",
      },
      {
        column_name: "Ethnicity",
        data_type: "text",
        definition: "Mô tả tên dân tộc (ví dụ: Asian, Hispanic…).",
      },
    ],
    relationships: [
      {
        from_table: "ethnicity",
        column_from_table: "Ethnic Group",
        to_table: "employee",
        column_to_table: "ethnic_Group",
        cardinality: "1-n",
        id: "ffec8671-8ba3-4ab8-8412-14977ff8a79c",
        user_id: "9a31d17f-1442-4946-9662-38ceb80d5b52",
        created_at: "2025-04-17T14:16:43.490476",
        updated_at: "2025-04-17T14:16:43.490476",
        created_by: "9a31d17f-1442-4946-9662-38ceb80d5b52",
        updated_by: "9a31d17f-1442-4946-9662-38ceb80d5b52",
      },
      {
        from_table: "ethnicity",
        column_from_table: "Ethnic Group",
        to_table: "employee",
        column_to_table: "ethnic_Group",
        cardinality: "1-n",
        id: "873aac10-1baf-4e01-b49f-2112399ae9a3",
        user_id: "9a31d17f-1442-4946-9662-38ceb80d5b52",
        created_at: "2025-04-17T14:16:57.426971",
        updated_at: "2025-04-17T14:16:57.426971",
        created_by: "9a31d17f-1442-4946-9662-38ceb80d5b52",
        updated_by: "9a31d17f-1442-4946-9662-38ceb80d5b52",
      },
      {
        from_table: "ethnicity",
        column_from_table: "Ethnic Group",
        to_table: "employee",
        column_to_table: "ethnic_Group",
        cardinality: "1-n",
        id: "ef3c99de-5543-4877-845f-07a7507f4a6a",
        user_id: "9a31d17f-1442-4946-9662-38ceb80d5b52",
        created_at: "2025-04-17T14:17:40.691153",
        updated_at: "2025-04-17T14:17:40.691153",
        created_by: "9a31d17f-1442-4946-9662-38ceb80d5b52",
        updated_by: "9a31d17f-1442-4946-9662-38ceb80d5b52",
      },
      {
        from_table: "ethnicity",
        column_from_table: "Ethnic Group",
        to_table: "employee",
        column_to_table: "ethnic_Group",
        cardinality: "1-n",
        id: "d9933173-2c77-4ef7-8f06-b560d97f7a1a",
        user_id: "9a31d17f-1442-4946-9662-38ceb80d5b52",
        created_at: "2025-04-23T15:01:26.908359",
        updated_at: "2025-04-23T15:01:26.908359",
        created_by: "9a31d17f-1442-4946-9662-38ceb80d5b52",
        updated_by: "9a31d17f-1442-4946-9662-38ceb80d5b52",
      },
      {
        from_table: "ethnicity",
        column_from_table: "EthnicGroup",
        to_table: "employee",
        column_to_table: "ethnic_Group",
        cardinality: "1-n",
        id: "25797462-4774-4d95-9621-e97c4ec9b049",
        user_id: "9a31d17f-1442-4946-9662-38ceb80d5b52",
        created_at: "2025-04-23T15:22:54.346508",
        updated_at: "2025-04-23T15:22:54.346508",
        created_by: "9a31d17f-1442-4946-9662-38ceb80d5b52",
        updated_by: "9a31d17f-1442-4946-9662-38ceb80d5b52",
      },
      {
        from_table: "ethnicity",
        column_from_table: "EthnicGroup",
        to_table: "employee",
        column_to_table: "ethnic_Group",
        cardinality: "1-n",
        id: "b4047238-d4d4-4c60-8c63-7457eae8682f",
        user_id: "9a31d17f-1442-4946-9662-38ceb80d5b52",
        created_at: "2025-04-23T15:24:09.056524",
        updated_at: "2025-04-23T15:24:09.056524",
        created_by: "9a31d17f-1442-4946-9662-38ceb80d5b52",
        updated_by: "9a31d17f-1442-4946-9662-38ceb80d5b52",
      },
      {
        from_table: "ethnicity",
        column_from_table: "EthnicGroup",
        to_table: "employee",
        column_to_table: "ethnic_Group",
        cardinality: "1-n",
        id: "8927f0a3-7125-4614-9869-9f08d7e6e946",
        user_id: "9a31d17f-1442-4946-9662-38ceb80d5b52",
        created_at: "2025-04-23T15:42:15.315483",
        updated_at: "2025-04-23T15:42:15.315534",
        created_by: "9a31d17f-1442-4946-9662-38ceb80d5b52",
        updated_by: "9a31d17f-1442-4946-9662-38ceb80d5b52",
      },
    ],
  },
  {
    name: "date",
    description: "date ETL from PostgreSQL",
    connection_id: "e790024d-411c-4226-8670-f690dadc1971",
    user_id: "9a31d17f-1442-4946-9662-38ceb80d5b52",
    id: "fd034752-0ccf-4b46-b88c-5c146eb44534",
    created_at: "2025-04-10T09:07:38.538959Z",
    updated_at: "2025-04-10T09:07:38.538959Z",
    columns: [
      {
        column_name: "Date",
        data_type: "timestamp without time zone",
        definition: "Ngày cụ thể (primary key).",
      },
      {
        column_name: "Month",
        data_type: "text",
        definition: 'Tên tháng (ví dụ: "January").',
      },
      {
        column_name: "MonthNumber",
        data_type: "bigint",
        definition: "Số thứ tự tháng (1–12).",
      },
      {
        column_name: "Period",
        data_type: "text",
        definition: "Giai đoạn tính lương hoặc kỳ kế toán.",
      },
      {
        column_name: "PeriodNumber",
        data_type: "bigint",
        definition: "Mã số của kỳ.",
      },
      {
        column_name: "Qtr",
        data_type: "bigint",
        definition: "Quý (ví dụ: Q1, Q2…).",
      },
      {
        column_name: "QtrNumber",
        data_type: "text",
        definition: "Số quý (1–4).",
      },
      {
        column_name: "Year",
        data_type: "bigint",
        definition: "Năm (4 chữ số).",
      },
      {
        column_name: "Day",
        data_type: "bigint",
        definition: "Ngày trong tháng.",
      },
      {
        column_name: "MonthStartDate",
        data_type: "timestamp without time zone",
        definition: "Ngày bắt đầu của tháng.",
      },
      {
        column_name: "MonthEndDate",
        data_type: "timestamp without time zone",
        definition: "Ngày kết thúc của tháng.",
      },
      {
        column_name: "MonthIncrementNumber",
        data_type: "bigint",
        definition:
          "Số thứ tự tăng dần theo từng tháng (dùng cho dòng thời gian).",
      },
    ],
    relationships: [
      {
        from_table: "date",
        column_from_table: "Date",
        to_table: "employee",
        column_to_table: "date",
        cardinality: "1-n",
        id: "3a4f135f-4ef8-4e4e-8a08-58f67a1ef9ca",
        user_id: "9a31d17f-1442-4946-9662-38ceb80d5b52",
        created_at: "2025-04-17T14:19:37.542720",
        updated_at: "2025-04-17T14:19:37.542720",
        created_by: "9a31d17f-1442-4946-9662-38ceb80d5b52",
        updated_by: "9a31d17f-1442-4946-9662-38ceb80d5b52",
      },
      {
        from_table: "date",
        column_from_table: "Date",
        to_table: "employee",
        column_to_table: "date",
        cardinality: "1-n",
        id: "ad8a4e4a-b66c-491d-b27f-69fd240ba267",
        user_id: "9a31d17f-1442-4946-9662-38ceb80d5b52",
        created_at: "2025-04-23T15:35:35.969596",
        updated_at: "2025-04-23T15:35:35.969596",
        created_by: "9a31d17f-1442-4946-9662-38ceb80d5b52",
        updated_by: "9a31d17f-1442-4946-9662-38ceb80d5b52",
      },
    ],
  },
  {
    name: "BU",
    description: "BU ETL from PostgreSQL",
    connection_id: "e790024d-411c-4226-8670-f690dadc1971",
    user_id: "9a31d17f-1442-4946-9662-38ceb80d5b52",
    id: "77cf5cb7-faf7-47a1-b3a5-90f9274336d6",
    created_at: "2025-04-10T09:07:38.375972Z",
    updated_at: "2025-04-10T09:07:38.375972Z",
    columns: [
      {
        column_name: "BU",
        data_type: "bigint",
        definition: "Mã hoặc tên đơn vị kinh doanh.",
      },
      {
        column_name: "RegionSeq",
        data_type: "text",
        definition: "Số thứ tự vùng địa lý (dùng cho sorting).",
      },
      {
        column_name: "VP",
        data_type: "text",
        definition: "Tên hoặc mã phó giám đốc khu vực.",
      },
      {
        column_name: "Region",
        data_type: "text",
        definition: "Tên khu vực địa lý (ví dụ: North America, APAC…).",
      },
    ],
    relationships: [
      {
        from_table: "BU",
        column_from_table: "BU",
        to_table: "employee",
        column_to_table: "BU",
        cardinality: "1-n",
        id: "8c028c39-c104-449f-a630-55c65908e4aa",
        user_id: "9a31d17f-1442-4946-9662-38ceb80d5b52",
        created_at: "2025-04-14T17:36:11.981839",
        updated_at: "2025-04-14T17:36:11.981839",
        created_by: "9a31d17f-1442-4946-9662-38ceb80d5b52",
        updated_by: "9a31d17f-1442-4946-9662-38ceb80d5b52",
      },
      {
        from_table: "BU",
        column_from_table: "BU",
        to_table: "employee",
        column_to_table: "BU",
        cardinality: "1-n",
        id: "dc973859-90b3-4924-bf74-524221664b13",
        user_id: "9a31d17f-1442-4946-9662-38ceb80d5b52",
        created_at: "2025-04-17T14:19:20.344687",
        updated_at: "2025-04-17T14:19:20.344687",
        created_by: "9a31d17f-1442-4946-9662-38ceb80d5b52",
        updated_by: "9a31d17f-1442-4946-9662-38ceb80d5b52",
      },
      {
        from_table: "BU",
        column_from_table: "BU",
        to_table: "employee",
        column_to_table: "BU",
        cardinality: "1-n",
        id: "d56461ca-5eb1-467c-b9a7-e65b5fddd3b0",
        user_id: "9a31d17f-1442-4946-9662-38ceb80d5b52",
        created_at: "2025-04-23T15:01:09.010174",
        updated_at: "2025-04-23T15:01:09.010174",
        created_by: "9a31d17f-1442-4946-9662-38ceb80d5b52",
        updated_by: "9a31d17f-1442-4946-9662-38ceb80d5b52",
      },
      {
        from_table: "BU",
        column_from_table: "BU",
        to_table: "employee",
        column_to_table: "BU",
        cardinality: "1-n",
        id: "d42d53eb-77f5-4ee8-b593-db9a302a411d",
        user_id: "9a31d17f-1442-4946-9662-38ceb80d5b52",
        created_at: "2025-04-23T15:35:26.654061",
        updated_at: "2025-04-23T15:35:26.654061",
        created_by: "9a31d17f-1442-4946-9662-38ceb80d5b52",
        updated_by: "9a31d17f-1442-4946-9662-38ceb80d5b52",
      },
    ],
  },
  {
    name: "age_group",
    description: "age_group ETL from PostgreSQL",
    connection_id: "e790024d-411c-4226-8670-f690dadc1971",
    user_id: "9a31d17f-1442-4946-9662-38ceb80d5b52",
    id: "c46d2f01-38ad-4142-8938-3475fc74fc17",
    created_at: "2025-04-10T09:07:37.861571Z",
    updated_at: "2025-04-10T09:07:37.861571Z",
    columns: [
      {
        column_name: "AgeGroupID",
        data_type: "bigint",
        definition: "Mã nhóm độ tuổi (primary key).",
      },
      {
        column_name: "AgeGroup",
        data_type: "text",
        definition: 'Tên mô tả nhóm tuổi (ví dụ: "18-24", "25-34", v.v.).',
      },
    ],
    relationships: [
      {
        from_table: "age_group",
        column_from_table: "AgeGroupID",
        to_table: "employee",
        column_to_table: "age_group_id",
        cardinality: "1-n",
        id: "9a91784d-8561-4d52-860a-b01e4faf428e",
        user_id: "9a31d17f-1442-4946-9662-38ceb80d5b52",
        created_at: "2025-04-23T15:41:07.963363",
        updated_at: "2025-04-23T15:41:07.963363",
        created_by: "9a31d17f-1442-4946-9662-38ceb80d5b52",
        updated_by: "9a31d17f-1442-4946-9662-38ceb80d5b52",
      },
    ],
  },
  {
    name: "employee",
    description: "employee ETL from PostgreSQL",
    connection_id: "a9d6d992-d221-40c8-bc25-c0283d7f707f",
    user_id: "9a31d17f-1442-4946-9662-38ceb80d5b52",
    id: "ade2a854-b1a9-4574-9ba9-6a8390449aea",
    created_at: "2025-04-10T09:28:46.327750Z",
    updated_at: "2025-04-10T09:28:46.327750Z",
    columns: [
      {
        column_name: "date",
        data_type: "timestamp without time zone",
        definition: null,
      },
      {
        column_name: "employee_id",
        data_type: "integer",
        definition: null,
      },
      {
        column_name: "gender",
        data_type: "text",
        definition: null,
      },
      {
        column_name: "age",
        data_type: "integer",
        definition: null,
      },
      {
        column_name: "ethnic_Group",
        data_type: "integer",
        definition: null,
      },
      {
        column_name: "FP",
        data_type: "text",
        definition: null,
      },
      {
        column_name: "term_date",
        data_type: "text",
        definition: null,
      },
      {
        column_name: "is_new_hire",
        data_type: "integer",
        definition: null,
      },
      {
        column_name: "BU",
        data_type: "integer",
        definition: null,
      },
      {
        column_name: "hire_date",
        data_type: "text",
        definition: null,
      },
      {
        column_name: "pay_type_id",
        data_type: "text",
        definition: null,
      },
      {
        column_name: "term_reason",
        data_type: "text",
        definition: null,
      },
      {
        column_name: "age_group_id",
        data_type: "integer",
        definition: null,
      },
      {
        column_name: "tenure_days",
        data_type: "integer",
        definition: null,
      },
      {
        column_name: "tenure_months",
        data_type: "integer",
        definition: null,
      },
      {
        column_name: "bad_hires",
        data_type: "integer",
        definition: null,
      },
    ],
    relationships: [
      {
        from_table: "BU",
        column_from_table: "BU",
        to_table: "employee",
        column_to_table: "BU",
        cardinality: "1-n",
        id: "8c028c39-c104-449f-a630-55c65908e4aa",
        user_id: "9a31d17f-1442-4946-9662-38ceb80d5b52",
        created_at: "2025-04-14T17:36:11.981839",
        updated_at: "2025-04-14T17:36:11.981839",
        created_by: "9a31d17f-1442-4946-9662-38ceb80d5b52",
        updated_by: "9a31d17f-1442-4946-9662-38ceb80d5b52",
      },
      {
        from_table: "gender",
        column_from_table: "ID",
        to_table: "employee",
        column_to_table: "gender",
        cardinality: "1-n",
        id: "480c0875-f64d-460b-be13-d24d355fb144",
        user_id: "9a31d17f-1442-4946-9662-38ceb80d5b52",
        created_at: "2025-04-17T14:12:16.966802",
        updated_at: "2025-04-17T14:12:16.966802",
        created_by: "9a31d17f-1442-4946-9662-38ceb80d5b52",
        updated_by: "9a31d17f-1442-4946-9662-38ceb80d5b52",
      },
      {
        from_table: "ethnicity",
        column_from_table: "Ethnic Group",
        to_table: "employee",
        column_to_table: "ethnic_Group",
        cardinality: "1-n",
        id: "ffec8671-8ba3-4ab8-8412-14977ff8a79c",
        user_id: "9a31d17f-1442-4946-9662-38ceb80d5b52",
        created_at: "2025-04-17T14:16:43.490476",
        updated_at: "2025-04-17T14:16:43.490476",
        created_by: "9a31d17f-1442-4946-9662-38ceb80d5b52",
        updated_by: "9a31d17f-1442-4946-9662-38ceb80d5b52",
      },
      {
        from_table: "ethnicity",
        column_from_table: "Ethnic Group",
        to_table: "employee",
        column_to_table: "ethnic_Group",
        cardinality: "1-n",
        id: "873aac10-1baf-4e01-b49f-2112399ae9a3",
        user_id: "9a31d17f-1442-4946-9662-38ceb80d5b52",
        created_at: "2025-04-17T14:16:57.426971",
        updated_at: "2025-04-17T14:16:57.426971",
        created_by: "9a31d17f-1442-4946-9662-38ceb80d5b52",
        updated_by: "9a31d17f-1442-4946-9662-38ceb80d5b52",
      },
      {
        from_table: "ethnicity",
        column_from_table: "Ethnic Group",
        to_table: "employee",
        column_to_table: "ethnic_Group",
        cardinality: "1-n",
        id: "ef3c99de-5543-4877-845f-07a7507f4a6a",
        user_id: "9a31d17f-1442-4946-9662-38ceb80d5b52",
        created_at: "2025-04-17T14:17:40.691153",
        updated_at: "2025-04-17T14:17:40.691153",
        created_by: "9a31d17f-1442-4946-9662-38ceb80d5b52",
        updated_by: "9a31d17f-1442-4946-9662-38ceb80d5b52",
      },
      {
        from_table: "pay_type",
        column_from_table: "PayTypeID",
        to_table: "employee",
        column_to_table: "pay_type_id",
        cardinality: "1-n",
        id: "82d14238-fd68-4aec-8f6e-fa36b60dcf77",
        user_id: "9a31d17f-1442-4946-9662-38ceb80d5b52",
        created_at: "2025-04-17T14:17:53.161864",
        updated_at: "2025-04-17T14:17:53.161864",
        created_by: "9a31d17f-1442-4946-9662-38ceb80d5b52",
        updated_by: "9a31d17f-1442-4946-9662-38ceb80d5b52",
      },
      {
        from_table: "FP",
        column_from_table: "FP",
        to_table: "employee",
        column_to_table: "FP",
        cardinality: "1-n",
        id: "5e63daec-34df-4a9e-aa15-da0ac0c79834",
        user_id: "9a31d17f-1442-4946-9662-38ceb80d5b52",
        created_at: "2025-04-17T14:18:21.928711",
        updated_at: "2025-04-17T14:18:21.928711",
        created_by: "9a31d17f-1442-4946-9662-38ceb80d5b52",
        updated_by: "9a31d17f-1442-4946-9662-38ceb80d5b52",
      },
      {
        from_table: "separation_reason",
        column_from_table: "SeparationTypeID",
        to_table: "employee",
        column_to_table: "term_reason",
        cardinality: "1-n",
        id: "d9733e77-de58-4ace-9fc4-5b751d5cae78",
        user_id: "9a31d17f-1442-4946-9662-38ceb80d5b52",
        created_at: "2025-04-17T14:18:40.958367",
        updated_at: "2025-04-17T14:18:40.958367",
        created_by: "9a31d17f-1442-4946-9662-38ceb80d5b52",
        updated_by: "9a31d17f-1442-4946-9662-38ceb80d5b52",
      },
      {
        from_table: "separation_reason",
        column_from_table: "SeparationTypeID",
        to_table: "employee",
        column_to_table: "term_reason",
        cardinality: "1-n",
        id: "40b800cb-fd1e-4470-a7e3-3cceb5db2c3d",
        user_id: "9a31d17f-1442-4946-9662-38ceb80d5b52",
        created_at: "2025-04-17T14:18:56.756251",
        updated_at: "2025-04-17T14:18:56.756251",
        created_by: "9a31d17f-1442-4946-9662-38ceb80d5b52",
        updated_by: "9a31d17f-1442-4946-9662-38ceb80d5b52",
      },
      {
        from_table: "BU",
        column_from_table: "BU",
        to_table: "employee",
        column_to_table: "BU",
        cardinality: "1-n",
        id: "dc973859-90b3-4924-bf74-524221664b13",
        user_id: "9a31d17f-1442-4946-9662-38ceb80d5b52",
        created_at: "2025-04-17T14:19:20.344687",
        updated_at: "2025-04-17T14:19:20.344687",
        created_by: "9a31d17f-1442-4946-9662-38ceb80d5b52",
        updated_by: "9a31d17f-1442-4946-9662-38ceb80d5b52",
      },
      {
        from_table: "date",
        column_from_table: "Date",
        to_table: "employee",
        column_to_table: "date",
        cardinality: "1-n",
        id: "3a4f135f-4ef8-4e4e-8a08-58f67a1ef9ca",
        user_id: "9a31d17f-1442-4946-9662-38ceb80d5b52",
        created_at: "2025-04-17T14:19:37.542720",
        updated_at: "2025-04-17T14:19:37.542720",
        created_by: "9a31d17f-1442-4946-9662-38ceb80d5b52",
        updated_by: "9a31d17f-1442-4946-9662-38ceb80d5b52",
      },
      {
        from_table: "BU",
        column_from_table: "BU",
        to_table: "employee",
        column_to_table: "BU",
        cardinality: "1-n",
        id: "d56461ca-5eb1-467c-b9a7-e65b5fddd3b0",
        user_id: "9a31d17f-1442-4946-9662-38ceb80d5b52",
        created_at: "2025-04-23T15:01:09.010174",
        updated_at: "2025-04-23T15:01:09.010174",
        created_by: "9a31d17f-1442-4946-9662-38ceb80d5b52",
        updated_by: "9a31d17f-1442-4946-9662-38ceb80d5b52",
      },
      {
        from_table: "ethnicity",
        column_from_table: "Ethnic Group",
        to_table: "employee",
        column_to_table: "ethnic_Group",
        cardinality: "1-n",
        id: "d9933173-2c77-4ef7-8f06-b560d97f7a1a",
        user_id: "9a31d17f-1442-4946-9662-38ceb80d5b52",
        created_at: "2025-04-23T15:01:26.908359",
        updated_at: "2025-04-23T15:01:26.908359",
        created_by: "9a31d17f-1442-4946-9662-38ceb80d5b52",
        updated_by: "9a31d17f-1442-4946-9662-38ceb80d5b52",
      },
      {
        from_table: "ethnicity",
        column_from_table: "EthnicGroup",
        to_table: "employee",
        column_to_table: "ethnic_Group",
        cardinality: "1-n",
        id: "25797462-4774-4d95-9621-e97c4ec9b049",
        user_id: "9a31d17f-1442-4946-9662-38ceb80d5b52",
        created_at: "2025-04-23T15:22:54.346508",
        updated_at: "2025-04-23T15:22:54.346508",
        created_by: "9a31d17f-1442-4946-9662-38ceb80d5b52",
        updated_by: "9a31d17f-1442-4946-9662-38ceb80d5b52",
      },
      {
        from_table: "ethnicity",
        column_from_table: "EthnicGroup",
        to_table: "employee",
        column_to_table: "ethnic_Group",
        cardinality: "1-n",
        id: "b4047238-d4d4-4c60-8c63-7457eae8682f",
        user_id: "9a31d17f-1442-4946-9662-38ceb80d5b52",
        created_at: "2025-04-23T15:24:09.056524",
        updated_at: "2025-04-23T15:24:09.056524",
        created_by: "9a31d17f-1442-4946-9662-38ceb80d5b52",
        updated_by: "9a31d17f-1442-4946-9662-38ceb80d5b52",
      },
      {
        from_table: "BU",
        column_from_table: "BU",
        to_table: "employee",
        column_to_table: "BU",
        cardinality: "1-n",
        id: "d42d53eb-77f5-4ee8-b593-db9a302a411d",
        user_id: "9a31d17f-1442-4946-9662-38ceb80d5b52",
        created_at: "2025-04-23T15:35:26.654061",
        updated_at: "2025-04-23T15:35:26.654061",
        created_by: "9a31d17f-1442-4946-9662-38ceb80d5b52",
        updated_by: "9a31d17f-1442-4946-9662-38ceb80d5b52",
      },
      {
        from_table: "date",
        column_from_table: "Date",
        to_table: "employee",
        column_to_table: "date",
        cardinality: "1-n",
        id: "ad8a4e4a-b66c-491d-b27f-69fd240ba267",
        user_id: "9a31d17f-1442-4946-9662-38ceb80d5b52",
        created_at: "2025-04-23T15:35:35.969596",
        updated_at: "2025-04-23T15:35:35.969596",
        created_by: "9a31d17f-1442-4946-9662-38ceb80d5b52",
        updated_by: "9a31d17f-1442-4946-9662-38ceb80d5b52",
      },
      {
        from_table: "age_group",
        column_from_table: "AgeGroupID",
        to_table: "employee",
        column_to_table: "age_group_id",
        cardinality: "1-n",
        id: "9a91784d-8561-4d52-860a-b01e4faf428e",
        user_id: "9a31d17f-1442-4946-9662-38ceb80d5b52",
        created_at: "2025-04-23T15:41:07.963363",
        updated_at: "2025-04-23T15:41:07.963363",
        created_by: "9a31d17f-1442-4946-9662-38ceb80d5b52",
        updated_by: "9a31d17f-1442-4946-9662-38ceb80d5b52",
      },
      {
        from_table: "pay_type",
        column_from_table: "PayTypeID",
        to_table: "employee",
        column_to_table: "pay_type_id",
        cardinality: "1-n",
        id: "f598e5e3-03bb-42fd-a3e0-d09452bf026e",
        user_id: "9a31d17f-1442-4946-9662-38ceb80d5b52",
        created_at: "2025-04-23T15:41:28.199306",
        updated_at: "2025-04-23T15:41:28.199306",
        created_by: "9a31d17f-1442-4946-9662-38ceb80d5b52",
        updated_by: "9a31d17f-1442-4946-9662-38ceb80d5b52",
      },
      {
        from_table: "gender",
        column_from_table: "ID",
        to_table: "employee",
        column_to_table: "gender",
        cardinality: "1-n",
        id: "550e8e1d-d7d6-4a8c-9679-60ee954fe63e",
        user_id: "9a31d17f-1442-4946-9662-38ceb80d5b52",
        created_at: "2025-04-23T15:41:45.701350",
        updated_at: "2025-04-23T15:41:45.701350",
        created_by: "9a31d17f-1442-4946-9662-38ceb80d5b52",
        updated_by: "9a31d17f-1442-4946-9662-38ceb80d5b52",
      },
      {
        from_table: "FP",
        column_from_table: "FP",
        to_table: "employee",
        column_to_table: "FP",
        cardinality: "1-n",
        id: "5025319b-f065-405e-bf2b-bf0d3f24fe9a",
        user_id: "9a31d17f-1442-4946-9662-38ceb80d5b52",
        created_at: "2025-04-23T15:41:59.670999",
        updated_at: "2025-04-23T15:41:59.670999",
        created_by: "9a31d17f-1442-4946-9662-38ceb80d5b52",
        updated_by: "9a31d17f-1442-4946-9662-38ceb80d5b52",
      },
      {
        from_table: "ethnicity",
        column_from_table: "EthnicGroup",
        to_table: "employee",
        column_to_table: "ethnic_Group",
        cardinality: "1-n",
        id: "8927f0a3-7125-4614-9869-9f08d7e6e946",
        user_id: "9a31d17f-1442-4946-9662-38ceb80d5b52",
        created_at: "2025-04-23T15:42:15.315483",
        updated_at: "2025-04-23T15:42:15.315534",
        created_by: "9a31d17f-1442-4946-9662-38ceb80d5b52",
        updated_by: "9a31d17f-1442-4946-9662-38ceb80d5b52",
      },
      {
        from_table: "separation_reason",
        column_from_table: "SeparationTypeID",
        to_table: "employee",
        column_to_table: "term_reason",
        cardinality: "1-n",
        id: "527efa47-3a2f-48bc-a4a8-82cda81696ae",
        user_id: "9a31d17f-1442-4946-9662-38ceb80d5b52",
        created_at: "2025-04-23T15:43:23.346766",
        updated_at: "2025-04-23T15:43:23.346766",
        created_by: "9a31d17f-1442-4946-9662-38ceb80d5b52",
        updated_by: "9a31d17f-1442-4946-9662-38ceb80d5b52",
      },
      {
        from_table: "separation_reason",
        column_from_table: "SeparationTypeID",
        to_table: "employee",
        column_to_table: "term_reason",
        cardinality: "1-n",
        id: "e1852966-bf11-4ac8-84ee-ba0d62e6888c",
        user_id: "9a31d17f-1442-4946-9662-38ceb80d5b52",
        created_at: "2025-04-23T15:53:53.342620",
        updated_at: "2025-04-23T15:53:53.342620",
        created_by: "9a31d17f-1442-4946-9662-38ceb80d5b52",
        updated_by: "9a31d17f-1442-4946-9662-38ceb80d5b52",
      },
    ],
  },
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
  {
    name: "store",
    description: "store ETL from PostgreSQL",
    connection_id: "372fcf1a-e5c7-44af-8657-1efd9c6ba5f8",
    user_id: "9a31d17f-1442-4946-9662-38ceb80d5b52",
    id: "8cca1a1b-7a28-4e88-9c1b-dc89699f6382",
    created_at: "2025-04-29T09:47:49.282392Z",
    updated_at: "2025-04-29T09:47:49.282392Z",
    columns: [
      {
        column_name: "store",
        data_type: "text",
        definition: null,
      },
      {
        column_name: "province",
        data_type: "text",
        definition: null,
      },
    ],
    relationships: [],
  },
  {
    name: "revenue",
    description: "revenue ETL from PostgreSQL",
    connection_id: "372fcf1a-e5c7-44af-8657-1efd9c6ba5f8",
    user_id: "9a31d17f-1442-4946-9662-38ceb80d5b52",
    id: "1379c70c-dcf8-4bc7-b728-600e59383556",
    created_at: "2025-04-29T09:47:33.871786Z",
    updated_at: "2025-04-29T09:47:33.871786Z",
    columns: [
      {
        column_name: "date",
        data_type: "timestamp without time zone",
        definition: null,
      },
      {
        column_name: "store",
        data_type: "text",
        definition: null,
      },
      {
        column_name: "revenue",
        data_type: "bigint",
        definition: null,
      },
      {
        column_name: "cost",
        data_type: "bigint",
        definition: null,
      },
    ],
    relationships: [],
  },
  {
    name: "province",
    description: "province ETL from PostgreSQL",
    connection_id: "372fcf1a-e5c7-44af-8657-1efd9c6ba5f8",
    user_id: "9a31d17f-1442-4946-9662-38ceb80d5b52",
    id: "8177ad3b-acbb-4add-a37f-fc4936be456a",
    created_at: "2025-04-29T09:47:18.184613Z",
    updated_at: "2025-04-29T09:47:18.184613Z",
    columns: [
      {
        column_name: "region",
        data_type: "text",
        definition: null,
      },
      {
        column_name: "province",
        data_type: "text",
        definition: null,
      },
      {
        column_name: "latitude",
        data_type: "double precision",
        definition: null,
      },
      {
        column_name: "longitude",
        data_type: "double precision",
        definition: null,
      },
    ],
    relationships: [],
  },
];

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
  console.log("🚀 ~ dataType:", dataType);
  if (dataType === "text" || dataType === "varchar" || dataType === "char")
    return ["COUNT", "COUNT DISTINCT"];
  if (dataType === "timestamp without time zone" || dataType === "date")
    return ["COUNT", "MIN", "MAX"];
  if (
    dataType === "integer" ||
    dataType === "bigint" ||
    dataType === "numeric" ||
    dataType === "decimal" ||
    dataType === "double precision"
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

// Chart sử dụng crosstab
const crosstabCharts = [
  "stacked_column",
  "stacked_bar",
  "clustered_column",
  "clustered_bar",
  "line_stacked_column",
  "line_clustered_column",
  "waterfall",
  "line",
  "area",
  "stacked_area",
];

const option = {
  tooltip: {
    trigger: "item",
  },
  legend: {
    top: "5%",
    left: "center",
  },
  series: [
    {
      name: "Access From",
      type: "pie",
      radius: ["40%", "70%"],
      avoidLabelOverlap: false,
      itemStyle: {
        borderRadius: 10,
        borderColor: "#fff",
        borderWidth: 2,
      },
      label: {
        show: false,
        position: "center",
      },
      emphasis: {
        label: {
          show: true,
          fontSize: 40,
          fontWeight: "bold",
        },
      },
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
    },
  ],
};

const option2 = {
  tooltip: {
    trigger: "axis",
    axisPointer: {
      type: "shadow",
    },
  },
  legend: {},
  grid: {
    left: "3%",
    right: "4%",
    bottom: "3%",
    containLabel: true,
  },
  xAxis: [
    {
      type: "category",
      data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    },
  ],
  yAxis: [
    {
      type: "value",
    },
  ],
  series: [
    {
      name: "Direct",
      type: "bar",
      emphasis: {
        focus: "series",
      },
      data: [320, 332, 301, 334, 390, 330, 320],
    },
    {
      name: "Email",
      type: "bar",
      stack: "Ad",
      emphasis: {
        focus: "series",
      },
      data: [120, 132, 101, 134, 90, 230, 210],
    },
    {
      name: "Union Ads",
      type: "bar",
      stack: "Ad",
      emphasis: {
        focus: "series",
      },
      data: [220, 182, 191, 234, 290, 330, 310],
    },
    {
      name: "Video Ads",
      type: "bar",
      stack: "Ad",
      emphasis: {
        focus: "series",
      },
      data: [150, 232, 201, 154, 190, 330, 410],
    },
    {
      name: "Search Engine",
      type: "bar",
      data: [862, 1018, 964, 1026, 1679, 1600, 1570],
      emphasis: {
        focus: "series",
      },
      markLine: {
        lineStyle: {
          type: "dashed",
        },
        data: [[{ type: "min" }, { type: "max" }]],
      },
    },
    {
      name: "Baidu",
      type: "bar",
      barWidth: 5,
      stack: "Search Engine",
      emphasis: {
        focus: "series",
      },
      data: [620, 732, 701, 734, 1090, 1130, 1120],
    },
    {
      name: "Google",
      type: "bar",
      stack: "Search Engine",
      emphasis: {
        focus: "series",
      },
      data: [120, 132, 101, 134, 290, 230, 220],
    },
    {
      name: "Bing",
      type: "bar",
      stack: "Search Engine",
      emphasis: {
        focus: "series",
      },
      data: [60, 72, 71, 74, 190, 130, 110],
    },
    {
      name: "Others",
      type: "bar",
      stack: "Search Engine",
      emphasis: {
        focus: "series",
      },
      data: [62, 82, 91, 84, 109, 110, 120],
    },
  ],
};

const option3 = {
  title: {
    text: "Accumulated Waterfall Chart",
  },
  tooltip: {
    trigger: "axis",
    axisPointer: {
      type: "shadow",
    },
    formatter: function (params) {
      let tar;
      if (params[1] && params[1].value !== "-") {
        tar = params[1];
      } else {
        tar = params[2];
      }
      return tar && tar.name + "<br/>" + tar.seriesName + " : " + tar.value;
    },
  },
  legend: {
    data: ["Expenses", "Income"],
  },
  grid: {
    left: "3%",
    right: "4%",
    bottom: "3%",
    containLabel: true,
  },
  xAxis: {
    type: "category",
    data: (function () {
      let list = [];
      for (let i = 1; i <= 11; i++) {
        list.push("Nov " + i);
      }
      return list;
    })(),
  },
  yAxis: {
    type: "value",
  },
  series: [
    {
      name: "Placeholder",
      type: "bar",
      stack: "Total",
      silent: true,
      itemStyle: {
        borderColor: "transparent",
        color: "transparent",
      },
      emphasis: {
        itemStyle: {
          borderColor: "transparent",
          color: "transparent",
        },
      },
      data: [0, 900, 1245, 1530, 1376, 1376, 1511, 1689, 1856, 1495, 1292],
    },
    {
      name: "Income",
      type: "bar",
      stack: "Total",
      label: {
        show: true,
        position: "top",
      },
      data: [900, 345, 393, "-", "-", 135, 178, 286, "-", "-", "-"],
    },
    {
      name: "Expenses",
      type: "bar",
      stack: "Total",
      label: {
        show: true,
        position: "bottom",
      },
      data: ["-", "-", "-", 108, 154, "-", "-", "-", 119, 361, 203],
    },
  ],
};

const App: React.FC = () => {
  const [datasets, setDatasets] = useState<Dataset[]>(datasetsMock);
  const [datasetId, setDatasetId] = useState<string>("");
  const [chartType, setChartType] = useState<string>("card");
  const [inputs, setInputs] = useState<ChartInput>({});
  const [firstSqlQuery, setFirstSqlQuery] = useState<string>("");
  const [finalSqlQuery, setFinalSqlQuery] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [crosstabResult, setCrosstabResult] = useState("");

  // Lấy dataset hiện tại
  const currentDataset =
    datasets.find((d) => d.id === datasetId) || datasets[0];

  // Kiểm tra xem chart có dùng crosstab không
  const isCrosstabChart = crosstabCharts.includes(chartType.toLowerCase());

  // Tạo danh sách cột từ dataset
  const getColumns = (
    dataset: Dataset | undefined
  ): { value: string; label: string }[] => {
    if (!dataset) return [];
    const columnNames = dataset.columns.map((c) => ({
      value: c.column_name,
      label: c.column_name,
    }));
    const relationColumns = dataset.relationships.map((r) => {
      const relatedDataset = datasets.find((d) => d.name === r.from_table);
      const columnName = r.column_from_table;
      const label = relatedDataset
        ? `${r.from_table}.${columnName}`
        : columnName;
      return {
        value: columnName,
        label: label,
      };
    });
    return [...columnNames, ...relationColumns];
  };

  // Lấy data_type cho cột
  const getColumnDataType = (column: string): string => {
    if (!currentDataset) return "text";
    const columnInfo = currentDataset.columns.find(
      (c) => c.column_name === column
    );
    if (columnInfo) return columnInfo.data_type;
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

  // Submit để tạo SQL đầu tiên
  const handleSubmit = () => {
    if (!currentDataset) {
      setFirstSqlQuery("Error: No dataset selected");
      setFinalSqlQuery("");
      return;
    }
    const query = sqlBuilder(chartType, inputs, currentDataset, datasets);
    setFirstSqlQuery(query);
    setFinalSqlQuery(""); // Reset final query
  };

  // Run để tạo SQL con hoặc SQL thứ hai
  const handleRun = () => {
    if (!firstSqlQuery || firstSqlQuery.startsWith("Error")) {
      setFinalSqlQuery("Error: Invalid first SQL query");
      return;
    }
    const resultToUse =
      (chartType === "line_stacked_column" ||
        chartType === "line_clustered_column") &&
      crosstabResult
        ? crosstabResult
        : firstSqlQuery;
    const finalQuery = runCrosstabQuery(
      chartType,
      inputs,
      currentDataset,
      datasets,
      resultToUse
    );
    setFinalSqlQuery(finalQuery);
  };

  // Copy SQL vào clipboard
  const handleCopySql = (sql: string) => {
    navigator.clipboard.writeText(sql);
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
    <>
      <div className="bg-white rounded p-2">
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
                  setFirstSqlQuery("");
                  setFinalSqlQuery("");
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
                  setFirstSqlQuery("");
                  setFinalSqlQuery("");
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
                              onClick={() =>
                                removeMultiInput(input.name, index)
                              }
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
                            (inputs[input.name] as InputValue)?.aggregate ||
                            "COUNT"
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

            {/* Submit and Run Buttons */}
            <div className="flex justify-center gap-4">
              <button
                onClick={handleSubmit}
                className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 dark:hover:bg-blue-800"
              >
                Generate SQL
              </button>
              {isCrosstabChart &&
                firstSqlQuery &&
                !firstSqlQuery.startsWith("Error") && (
                  <button
                    onClick={handleRun}
                    className="px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 dark:hover:bg-green-800"
                  >
                    Run Crosstab
                  </button>
                )}
            </div>

            {/* SQL Output */}
            {firstSqlQuery && (
              <div className="p-6 bg-gray-50 dark:bg-gray-700 rounded-lg relative">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    First SQL Query (Format)
                  </h2>
                  <button
                    onClick={() => handleCopySql(firstSqlQuery)}
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
                  {firstSqlQuery}
                </pre>
              </div>
            )}

            {/* Input for Crosstab Result (only for line_stacked_column and line_clustered_column) */}
            {firstSqlQuery &&
              !firstSqlQuery.startsWith("Error") &&
              (chartType === "line_stacked_column" ||
                chartType === "line_clustered_column") && (
                <div className="p-6 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Enter Crosstab Result (Paste SQL Result Here)
                  </label>
                  <textarea
                    value={crosstabResult}
                    onChange={(e) => setCrosstabResult(e.target.value)}
                    className="w-full p-3 bg-white dark:bg-gray-600 border border-gray-300 dark:border-gray-500 rounded-lg text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition h-40 resize-y"
                    placeholder="Paste the result of the first SQL query here..."
                  />
                </div>
              )}

            {finalSqlQuery && (
              <div className="p-6 bg-gray-50 dark:bg-gray-700 rounded-lg relative">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    Final SQL Query
                  </h2>
                  <button
                    onClick={() => handleCopySql(finalSqlQuery)}
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
                  {finalSqlQuery}
                </pre>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="min-h-screen bg-gray-200 text-black grid-cols-4 grid gap-5 p-6">
        <div className="bg-white rounded p-2">
          <EchartsComponent
            type={EChartsType.CARD}
            data={option}
            config={"config"}
          />
        </div>
        <div className="bg-white rounded p-2">
          <EchartsComponent
            type={EChartsType.PIE}
            data={option}
            config={"config"}
          />
        </div>
        <div className="bg-white rounded p-2">
          <EchartsComponent
            type={EChartsType.DOUGHNUT}
            data={option}
            config={"config"}
          />
        </div>
        <div className="bg-white rounded p-2">
          <EchartsComponent
            type={EChartsType.LINE}
            data={option}
            config={"config"}
          />
        </div>
        <div className="bg-white rounded p-2">
          <EchartsComponent
            type={EChartsType.WATERFALL}
            data={option}
            config={"config"}
          />
        </div>
        <div className="bg-white rounded p-2">
          <EchartsComponent
            type={EChartsType.CLUSTERED_COLUMN}
            data={option}
            config={"config"}
          />
        </div>
        <div className="bg-white rounded p-2">
          <EchartsComponent
            type={EChartsType.CLUSTERED_BAR}
            data={option}
            config={"config"}
          />
        </div>
        <div className="bg-white rounded p-2">
          <EchartsComponent
            type={EChartsType.STACKED_COLUMN}
            data={option}
            config={"config"}
          />
        </div>
        <div className="bg-white rounded p-2">
          <EchartsComponent
            type={EChartsType.STACKED_BAR}
            data={option}
            config={"config"}
          />
        </div>
        <div className="bg-white rounded p-2">
          <EchartsComponent
            type={EChartsType.LINE_STACKED_COLUMN}
            data={option}
            config={"config"}
          />
        </div>
        <div className="bg-white rounded p-2">
          <EchartsComponent
            type={EChartsType.LINE_CLUSTERED_COLUMN}
            data={option}
            config={"config"}
          />
        </div>
        <div className="bg-white rounded p-2">
          <EchartsComponent
            type={EChartsType.TABLE}
            data={option}
            config={"config"}
          />
        </div>
        <div className="bg-white rounded p-2">
          <EchartsComponent
            type={EChartsType.FUNNEL}
            data={option}
            config={"config"}
          />
        </div>
        <div className="bg-white rounded p-2">
          <EchartsComponent
            type={EChartsType.AREA}
            data={option}
            config={"config"}
          />
        </div>
        <div className="bg-white rounded p-2">
          <EchartsComponent
            type={EChartsType.PERCENTAGE_STACKED_AREA}
            data={option}
            config={"config"}
          />
        </div>
      </div>
    </>
  );
};

export default App;
