import { Button, Card, Col, message, Row, Spin } from "antd";
import Title from "antd/lib/typography/Title";
import React, { useState } from "react";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import FormTextField from "../../../components/general/FormTextField";
import ReportExcelDownload from "../../../components/ReportingComponents/ReportExcelDownload";
import { postRequest } from "../../../services/mainApp.service";
import { CustomerInformationTemp } from "./CustomerInformationTemp";

const initialObj = {
  OperationId: 1,
  CompanyId: null,
  Email: null,
  PhoneNumber: null,
  CustomerName: null
};

const CustomerInformationReport = () => {
  const userData = useSelector((state) => state.authReducer);
  const [data, setData] = useState(initialObj);
  const [reportData, setReportData] = useState([]);
  const [loading, setLoading] = useState(false);

  const getReportData = (e) => {
    setLoading(true);
    e.preventDefault();
    postRequest("CustomerInformationReport", {
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
  };

  // useEffect(() => {
  //   postRequest("CustomerInformationReport", {
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
            label="Customer Name"
            name="CustomerName"
            type="text"
            value={data.CustomerName}
            // required={true}
            onChange={(e) => setData({ ...data, CustomerName: e.value })}
          />
          <FormTextField
            span={8}
            label="Phone Number"
            name="PhoneNumber"
            type="number"
            // required={true}
            value={data.PhoneNumber}
            onChange={(e) => setData({ ...data, PhoneNumber: e.value })}
          />
          <FormTextField
            span={16}
            label="Email"
            name="Email"
            type="email"
            // required={true}
            value={data.Email}
            onChange={(e) => setData({ ...data, Email: e.value })}
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
        Customer Information Report
      </Title>
      <Card>
        <Row>
          <Col span={24}>{fieldPanel}</Col>
        </Row>
      </Card>

      <ReportExcelDownload
        fileName={`Customer Information Report: ${data.DateFrom}-${data.DateTo}`}
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
          CustomerInformationTemp(reportData, data.DateFrom, data.DateFrom)}
      </ReportExcelDownload>
    </div>
  );
};

export default CustomerInformationReport;
