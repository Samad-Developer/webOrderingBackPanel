import { Button, Card, Col, message, Row, Spin } from "antd";
import Title from "antd/lib/typography/Title";
import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { INPUT_SIZE } from "../../../common/ThemeConstants";
import FormSelect from "../../../components/general/FormSelect";
import FormTextField from "../../../components/general/FormTextField";
import ReportExcelDownload from "../../../components/ReportingComponents/ReportExcelDownload";
import { getDate } from "../../../functions/dateFunctions";
import { postRequest } from "../../../services/mainApp.service";
import { InventoryVarianceTemp } from "./InventoryVarianceTemp";

export const TheoriticalVarianceReport = () => {
  const userData = useSelector((state) => state.authReducer);
  const [data, setData] = useState({
    OperationId: null,
    CompanyId: null,
    BranchId: null,
    UserId: null,
    CategoryId: null,
    ProductId: null,
    DateFrom: getDate(),
    DateTo: getDate(),
    ProductDetailId: null
  });
  const [branches, setBranches] = useState([]);
  const [reportData, setReportData] = useState([]);
  const [total, setTotal] = useState(null);
  const [loading, setLoading] = useState(false);
  const getReportData = (e) => {
    setLoading(true);
    e.preventDefault();
    if (data.DateFrom !== "" && data.DateTo !== "") {
      if (new Date(data.DateFrom) <= new Date(data.DateTo)) {
        postRequest("InventoryVarianceReport", {
          ...data,
          OperationId: 2,
          CompanyId: userData.CompanyId,
          UserId: userData.UserId
        })
          .then((res) => {
            setLoading(false);
            if (res.data.DataSet.Table1.length === 0) {
              message.error("No Record found!");
              setReportData([]);
              return;
            } else {
              setReportData(res.data.DataSet.Table1);
              setTotal(res.data.DataSet.Table2[0]);
            }
          })
          .catch((error) => message.error(error));
      } else {
        message.error("Please select DateTo greater than DateFrom");

        setLoading(false);
      }
    } else {
      message.error("Please select both dates");

      setLoading(false);
    }
  };
  const getBranchName = () => {
    let selectedBranch = branches
      .filter((x) => x.BranchId === data.BranchId)
      .map((item) => item.BranchName);
    return selectedBranch;
  };

  useEffect(() => {
    postRequest("InventoryVarianceReport", {
      ...data,
      CompanyId: userData.CompanyId,
      OperationId: 1,
      UserId: userData.UserId
    })
      .then((res) => {
        setBranches(res.data.DataSet.Table);
      })
      .catch((error) => console.error(error));
  }, []);

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

  return (
    <div style={{ background: "white", padding: 20, width: "100%" }}>
      <Title level={3} type="primary">
        Inventory Variance Report
      </Title>
      <Card>
        <Row>
          <Col span={24}>{fieldPanel}</Col>
        </Row>
      </Card>

      <ReportExcelDownload
        fileName={`Theoritical Variance Report: ${data.DateFrom}-${data.DateTo}`}
        hidePdf={true}
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
        {reportData?.length > 0 && (
          <InventoryVarianceTemp
            reportData={reportData}
            total={total}
            branch={`Branch: ${getBranchName()}`}
            date={` Period: From ${data.DateFrom} To ${data.DateTo}`}
          />
        )}
      </ReportExcelDownload>
    </div>
  );
};
