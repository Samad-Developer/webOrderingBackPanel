import { Button, Card, Col, message, Row, Spin } from "antd";
import Title from "antd/lib/typography/Title";
import React, { Fragment, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { INPUT_SIZE } from "../../../common/ThemeConstants";
import FormSelect from "../../../components/general/FormSelect";
import FormTextField from "../../../components/general/FormTextField";
import ReportExcelDownload from "../../../components/ReportingComponents/ReportExcelDownload";
import ReportPdfDownload from "../../../components/ReportingComponents/ReportPdfDownload";
import { postRequest } from "../../../services/mainApp.service";
import { TopSellingTemplate, HTML_Chunk } from "./topSellingTemplate.js";

const TopSellingReport = () => {
  const userData = useSelector((state) => state.authReducer);
  const [data, setData] = useState({
    CompanyId: userData.CompanyId,
    BranchId: userData.BranchId,
    DateFrom: "",
    DateTo: "",
    UserId: userData.UserId,
  });
  const [reportData, setReportData] = useState([]);
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(false);

  const getReportData = (e) => {
    e.preventDefault();

    if (data.DateFrom !== "" && data.DateTo !== "") {
      if (new Date(data.DateFrom) <= new Date(data.DateTo)) {
        setLoading(true);
        postRequest("topsellingreport", data).then((res) => {
          setLoading(false);
          if (res.data.DataSet.Table.length === 0) {
            message.error("No Record Found!");
            setReportData([]);
            return;
          } else setReportData(res.data.DataSet.Table);
        });

        setReportData([]);
      } else {
        message.error("Please select DateTo greater than DateFrom");
      }
    } else {
      message.error("Please select both dates");
    }
  };

  const fieldPanel = (
    <>
      <Col>
        <Row gutter={10} style={{ alignItem: "self-end" }}>
          <FormSelect
            colSpan={8}
            listItem={branches || []}
            idName="BranchId"
            valueName="BranchName"
            size={INPUT_SIZE}
            name="BranchId"
            label="Branch"
            value={data.BranchId || ""}
            onChange={(e) => setData({ ...data, BranchId: e.value })}
          />
          <FormTextField
            span={8}
            label="Date From"
            name="DateFrom"
            type="date"
            value={data.DateFrom}
            onChange={(e) => setData({ ...data, DateFrom: e.value })}
          />
          <FormTextField
            span={8}
            label="Date To"
            name="DateTo"
            type="date"
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

  useEffect(() => {
    postRequest("topsellingreport", data).then((res) => {
      setBranches(res.data.DataSet.Table2);
    });
  }, []);

  return (
    <div style={{ background: "white", padding: 20 }}>
      <Title level={3} type="primary">
        Top Selling Report
      </Title>
      <Card>
        <Row>
          <Col span={24}>{fieldPanel}</Col>
        </Row>
      </Card>

      <ReportExcelDownload
        fileName={`Top Selling Report: ${data.DateFrom}-${data.DateTo}`}
      >
        {loading && (
          <Spin
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          />
        )}
        {reportData.length > 0 && (
          <TopSellingTemplate
            reportData={reportData}
            branchName={
              branches.find((x) => x.BranchId === data.BranchId)?.BranchName
            }
            date={` Period: From ${data.DateFrom} To ${data.DateTo}`}
          />
        )}
      </ReportExcelDownload>
    </div>
  );
};

export default TopSellingReport;
