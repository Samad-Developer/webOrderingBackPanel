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
import { cancelOrderTemplate } from "./cancelOrderTemplate";

const CancelOrderReport = () => {
  const userData = useSelector((state) => state.authReducer);
  const [data, setData] = useState({
    CompanyId: userData.CompanyId,
    BranchId: null,
    DateFrom: "",
    DateTo: "",
    OperationId: 1,
  });
  const [branchList, setBranchList] = useState([]);
  const [orderTable, setOrderTable] = useState([]);
  const [productTable, setProductTable] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    postRequest("CancelOrdersReport", data).then((res) => {
      setBranchList(res.data.DataSet.Table);
    });
  }, []);

  const getReportData = (e) => {
    e.preventDefault();
    setLoading(true);
    if (data.DateFrom !== "" && data.DateTo !== "") {
      if (new Date(data.DateFrom) <= new Date(data.DateTo)) {
        postRequest("CancelOrdersReport", { ...data, OperationId: 2 }).then(
          (res) => {
            setLoading(false);
            if (res.data.DataSet.Table.length === 0) {
              setProductTable([]);
              setOrderTable([]);
              message.error("No Record found!");
              return;
            } else {
              setProductTable(res.data.DataSet.Table1);
              setOrderTable(res.data.DataSet.Table);
            }
          }
        );
      } else {
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
            listItem={branchList || []}
            idName="BranchId"
            valueName="BranchName"
            size={INPUT_SIZE}
            name="BranchId"
            label="Branch"
            value={data.BranchId}
            onChange={(e) => setData({ ...data, BranchId: e.value })}
            required={true}
          />
          <FormTextField
            span={8}
            label="Date From"
            name="DateFrom"
            type="date"
            size={INPUT_SIZE}
            value={data.DateFrom}
            onChange={(e) => setData({ ...data, DateFrom: e.value })}
          />
          <FormTextField
            span={8}
            label="Date To"
            name="DateTo"
            type="date"
            size={INPUT_SIZE}
            value={data.DateTo}
            onChange={(e) => setData({ ...data, DateTo: e.value })}
          />
          <Button
            type="primary"
            htmlType="submit"
            style={{ marginLeft: "auto", marginTop: "auto" }}
            onClick={getReportData}
          >
            Search
          </Button>
        </Row>
      </Col>
      <div style={{ margin: "10px 0", borderTop: "1px solid lightgray" }}></div>
    </>
  );

  return (
    <div style={{ background: "white", padding: 20 }}>
      <Title level={3} type="primary">
        Cancel Order Report
      </Title>
      <Card>
        <Row>
          <Col span={24}>{fieldPanel}</Col>
        </Row>
      </Card>
      <ReportExcelDownload
        fileName={`Cancel_Order_Report: ${data.DateFrom}-${data.DateTo}`}
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
        {
          orderTable.length > 0 &&
            cancelOrderTemplate(
              orderTable,
              productTable,
              data.DateFrom,
              data.DateTo
            )
          // <cancelOrderTemplate
          //   orderTable={orderTable}
          //   productTable={productTable}
          //   date={` Period: From ${data.DateFrom} To ${data.DateTo}`}
          // />
        }
      </ReportExcelDownload>
    </div>
  );
};

export default CancelOrderReport;
