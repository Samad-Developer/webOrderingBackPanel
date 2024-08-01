import { Button, Card, Col, message, Row, Spin } from "antd";
import Title from "antd/lib/typography/Title";
import React, { Fragment, useState } from "react";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { INPUT_SIZE } from "../../../common/ThemeConstants";
import FormSelect from "../../../components/general/FormSelect";
import FormTextField from "../../../components/general/FormTextField";
import ReportExcelDownload from "../../../components/ReportingComponents/ReportExcelDownload";
import { postRequest } from "../../../services/mainApp.service";
import { discountDetailTemplate } from "./discountDetailTemplate";

const DiscountDetailReport = () => {
  const userData = useSelector((state) => state.authReducer);
  const [data, setData] = useState({
    CompanyId: userData.CompanyId,
    BranchId: userData.branchId,
    DateFrom: "",
    DateTo: "",
  });
  const [branches, setBranches] = useState([]);
  const branchFormValues = {
    BranchId: null,
    BranchName: "",
    CityId: null,
    IsEnable: true,
    NTNNumber: "",
    NTNName: "",
    BusinessDayStartTime: "2011-10-05T14:48:00.000Z",
    BusinessDayEndTime: "2011-10-05T14:48:00.000Z",
    IsCallCenter: false,
    BranchDetail: [],
    IsWarehouse: false,
    OperationId: 1,
    CompanyId: userData.CompanyId,
    UserId: 103,
    UserIP: "12.1.1.2",
  };
  const [reportData, setReportData] = useState([]);
  const controller = new window.AbortController();
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    postRequest("/CrudBranch", branchFormValues, controller).then((res) => {
      setBranches(
        res.data.DataSet.Table.map((item) => {
          return { BranchName: item.BranchName, BranchId: item.BranchId };
        })
      );
    });
  }, []);

  const getReportData = (e) => {
    setLoading(true);
    e.preventDefault();
    if (data.DateFrom !== "" && data.DateTo !== "") {
      if (new Date(data.DateFrom) <= new Date(data.DateTo)) {
        postRequest("DiscountDetailReport", data).then((res) => {
          setLoading(false);
          if (res.data.DataSet.Table.length === 0) {
            message.error("No Record found!");
            setReportData([]);
            return;
          } else setReportData(res.data.DataSet.Table);
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
            onChange={(e) => {
              setData({ ...data, BranchId: e.value });
            }}
            required={true}
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

  return (
    <div style={{ background: "white", padding: 20 }}>
      <Title level={3} type="primary">
        Discount Detail Report
      </Title>
      <Card>
        <Row>
          <Col span={24}>{fieldPanel}</Col>
        </Row>
      </Card>

      <ReportExcelDownload
        fileName={`Discount Detail Report: ${data.DateFrom}-${data.DateTo}`}
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
        {reportData.length > 0 &&
          discountDetailTemplate(reportData, data.DateFrom, data.DateTo)}
      </ReportExcelDownload>
    </div>
  );
};

export default DiscountDetailReport;
