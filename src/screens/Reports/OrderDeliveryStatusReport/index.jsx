import { Button, Card, Col, message, Row, Spin } from "antd";
import Title from "antd/lib/typography/Title";
import React, { useState } from "react";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { INPUT_SIZE } from "../../../common/ThemeConstants";
import FormSearchSelect from "../../../components/general/FormSearchSelect";
import FormSelect from "../../../components/general/FormSelect";
import FormTextField from "../../../components/general/FormTextField";
import ReportExcelDownload from "../../../components/ReportingComponents/ReportExcelDownload";
import { getDate } from "../../../functions/dateFunctions";
import { postRequest } from "../../../services/mainApp.service";
import { OrderDeliveryStatusTemp } from "./OrderDeliveryStatusTemp";

const initialObj = {
  OperationId: 1,
  CompanyId: null,
  DateFrom: getDate(),
  DateTo: getDate(),
  BranchId: null,
  ProductDetailId: null,
  OrderSource: null
};

const OrderDeliveryStatusReport = () => {
  const userData = useSelector((state) => state.authReducer);
  const [data, setData] = useState(initialObj);
  const [branches, setBranches] = useState([]);
  const [orderSource, setOrderSource] = useState([]);
  const [reportData, setReportData] = useState([]);
  const [loading, setLoading] = useState(false);

  const getReportData = (e) => {
    e.preventDefault();

    setLoading(true);
    if (data.DateFrom !== "" && data.DateTo !== "") {
      if (new Date(data.DateFrom) <= new Date(data.DateTo)) {
        postRequest("OrderDeliveryStatus", {
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

  useEffect(() => {
    postRequest("OrderDeliveryStatus", {
      ...data,
      CompanyId: userData.CompanyId,
      BranchId: userData.BranchId
    }).then((res) => {
      const { Table, Table1, Table2 } = res?.data?.DataSet;
      setBranches(Table);
      setOrderSource(Table1);
    });
  }, []);

  const fieldPanel = (
    <>
      <Col span={24}>
        <Row gutter={10} style={{ alignItems: "self-end" }}>
          <FormSelect
            colSpan={4}
            listItem={branches || []}
            idName="BranchId"
            valueName="BranchName"
            size={INPUT_SIZE}
            name="BranchId"
            label="Branch"
            value={data.BranchId}
            onChange={(e) => setData({ ...data, BranchId: e.value })}
            required={true}
          />

          <FormSelect
            colSpan={4}
            listItem={orderSource || []}
            idName="SetupDetailId"
            valueName="SetupDetailName"
            size={INPUT_SIZE}
            name="OrderSource"
            label="Order Source"
            required={true}
            value={data.OrderSource}
            onChange={(e) => setData({ ...data, OrderSource: e.value })}
          />

          {/* <FormSearchSelect
            colSpan={4}
            listItem={productDetail || []}
            idName="ProductDetailId"
            valueName="ProductName"
            size={INPUT_SIZE}
            name="ProductDetailId"
            label="Product Details"
            value={data.ProductDetailId}
            onChange={(e) => setData({ ...data, ProductDetailId: e.value })}
          /> */}

          <FormTextField
            span={8}
            label="Date From"
            name="DateFrom"
            type="date"
            required={true}
            value={data.DateFrom}
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
        Order Delivery Status Report
      </Title>
      <Card>
        <Row>
          <Col span={24}>{fieldPanel}</Col>
        </Row>
      </Card>

      <ReportExcelDownload
        fileName={`Order Delivery Status: ${data.DateFrom}-${data.DateTo}`}
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
          OrderDeliveryStatusTemp(reportData, data.DateFrom, data.DateFrom)}
      </ReportExcelDownload>
    </div>
  );
};

export default OrderDeliveryStatusReport;
