import { FunnelPlotOutlined } from "@ant-design/icons";
import { Button, Col, DatePicker, Row, Skeleton } from "antd";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import FormButton from "../../components/general/FormButton";
import FormSelect from "../../components/general/FormSelect";
import { postRequest } from "../../services/mainApp.service";
import Chart1 from "./Chart1";
import Chart2 from "./Chart2";
import Chart3 from "./Chart3";

const DashboardView = () => {
  const [reportData, setReportData] = useState([]);
  const [data, setData] = useState({
    DateFrom: "",
    DateTo: "",
    BranchId: null
  });
  const appStore = useSelector((state) => state.authReducer);
  const [loading, setLoading] = useState(false);
  const [chartData, setChartData] = useState({});

  return (
    <div style={{ width: "inherit" }}>
      <Row className="dashboardChartRow" gutter={[10, 10]}>
        <Col span={16} style={{ padding: 0 }}>
          <div className="chartStyle chart1Style">
            <h2>Total Sales</h2>
            {loading ? <Skeleton active /> : <Chart1 />}
          </div>
        </Col>
        <Col span={8} style={{ padding: 0 }}>
          <div className="chartStyle">
            <h2>Sales by Order Mode</h2>
            {loading ? <Skeleton active /> : <Chart2 chartData={reportData} />}
          </div>
        </Col>
        <Col span={24} style={{ padding: 0 }}>
          <div className="chartStyle">
            <h2>Sales by Order Source</h2>
            {loading ? <Skeleton active /> : <Chart3 />}
          </div>
        </Col>
      </Row>
    </div>
  );
};
export default DashboardView;
