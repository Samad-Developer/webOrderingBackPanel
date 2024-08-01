import { Button, Card, Col, message, Row, Spin } from "antd";
import Title from "antd/lib/typography/Title";
import React, { useState } from "react";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import FormSelect from "../../../components/general/FormSelect";
import FormTextField from "../../../components/general/FormTextField";
import ReportExcelDownload from "../../../components/ReportingComponents/ReportExcelDownload";
import { getDate } from "../../../functions/dateFunctions";
import { postRequest } from "../../../services/mainApp.service";
import { ODMSorderDetailTemp } from "./ODMSorderDetailTemp";

const initialObj = {
  OperationId: 1,
  CompanyId: null,
  DateFrom: getDate(),
  DateTo: getDate(),
  OrderSource: null
};

const ODMSorderDetailReport = () => {
  const userData = useSelector((state) => state.authReducer);
  const [data, setData] = useState(initialObj);
  const [reportData, setReportData] = useState([]);
  const [loading, setLoading] = useState(false);

  const getReportData = (e) => {
    setLoading(true);
    e.preventDefault();
    if (data.DateFrom !== "" && data.DateTo !== "") {
      if (new Date(data.DateFrom) <= new Date(data.DateTo)) {
        postRequest("RPT_OrderDetail", {
          ...data,
          OperationId: 2,
          CompanyId: userData.CompanyId
        }).then((res) => {
          setLoading(false);
          if (res.data.DataSet.Table.length === 0) {
            message.error("No record found");
            setReportData([]);
            return;
          } else setReportData(res?.data?.DataSet?.Table);
        });
      } else {
        setLoading(false);
        message.error("Please select DateTo greater than DateFrom");
      }
    } else {
      setLoading(false);
      message.error("Please select both dates");
    }
  };

  // useEffect(() => {
  //   postRequest("RPT_OrderDetail", {
  //     ...data,
  //     CompanyId: userData.CompanyId
  //   }).then((res) => {
  //     setBranches(res?.data?.DataSet?.Table1);
  //   });
  // }, []);

  const fieldPanel = (
    <>
      <Col span={24}>
        <Row gutter={10} style={{ alignItems: "self-end" }}>
          <FormTextField
            span={8}
            label="Date From"
            name="DateFrom"
            type="date"
            value={data.DateFrom}
            required={true}
            onChange={(e) => setData({ ...data, DateFrom: e.value })}
          />
          <FormTextField
            span={8}
            label="Date To"
            name="DateTo"
            type="date"
            required={true}
            value={data.DateTo}
            onChange={(e) => setData({ ...data, DateTo: e.value })}
          />
          <Button
            type="primary"
            htmlType="Get Report"
            style={{ marginLeft: "auto", marginTop: "auto" }}
            onClick={getReportData}
          >
            Get Report
          </Button>
        </Row>
      </Col>
      <div style={{ margin: "10px 0", borderTop: "1px solid lightgray" }}></div>
    </>
  );

  return (
    <div style={{ background: "white", padding: 20 }}>
      <Title level={3} type="primary">
        Order Detail Report
      </Title>
      <Card>
        <Row>
          <Col span={24}>{fieldPanel}</Col>
        </Row>
      </Card>

      <ReportExcelDownload
        fileName={`OrderDetailReport: ${data.DateFrom}-${data.DateTo}`}
      >
        {loading && (
          <Spin
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center"
            }}
          />
        )}
        {reportData.length > 0 &&
          ODMSorderDetailTemp(reportData, data.DateFrom, data.DateFrom)}
      </ReportExcelDownload>
    </div>
  );
};

export default ODMSorderDetailReport;
