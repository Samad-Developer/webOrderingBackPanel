import { Button, Card, Col, message, Row, Spin } from "antd";
import Title from "antd/lib/typography/Title";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { INPUT_SIZE } from "../../../common/ThemeConstants";
import FormSelect from "../../../components/general/FormSelect";
import FormTextField from "../../../components/general/FormTextField";
import ReportExcelDownload from "../../../components/ReportingComponents/ReportExcelDownload";
import ReportPdfDownload from "../../../components/ReportingComponents/ReportPdfDownload";
import { postRequest } from "../../../services/mainApp.service";
import { InventoryProdRepTemplate } from "./InventoryProdRepTemplate";

export const InventoryProductRate = () => {
  const userData = useSelector((state) => state.authReducer);
  const [data, setData] = useState({
    CompanyId: userData.CompanyId,
    BranchId: userData.branchId,
    operationId: 1,
    CategoryId: null,
    ProductId: null,
    VendorId: null,
    DateFrom: "",
    DateTo: "",
    UserId: userData.UserId,
  });
  const [branches, setBranches] = useState([]);
  const [reportData, setReportData] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  const getReportData = (e) => {
    e.preventDefault();
    setLoading(true);
    postRequest("InventoryItemRate", { ...data, operationId: 2 })
      .then((res) => {
        if (res.data.DataSet.Table.length <= 0) {
          message.error("No record found!");
          setReportData([]);
          setLoading(false);

          return;
        }
        // let resp = InventoryProdRepTemplate(res.data.DataSet);
        setReportData(res.data.DataSet.Table);
        setLoading(false);
      })
      .catch((error) => console.error(error));
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
            required={true}
          />

          <FormSelect
            colSpan={8}
            listItem={categories || []}
            idName="CategoryId"
            valueName="CategoryName"
            size={INPUT_SIZE}
            name="CategoryId"
            label="Product Category"
            value={data.CategoryId || ""}
            onChange={(e) => setData({ ...data, CategoryId: e.value })}
          />

          <FormSelect
            colSpan={8}
            listItem={
              products.filter(
                (product) => product.ProductCategoryId === data.CategoryId
              ) || []
            }
            idName="ProductId"
            valueName="ProductName"
            size={INPUT_SIZE}
            name="ProductId"
            label="Product"
            value={data.ProductId || ""}
            onChange={(e) => setData({ ...data, ProductId: e.value })}
          />

          <FormSelect
            colSpan={8}
            listItem={vendors || []}
            idName="VendorId"
            valueName="VendorName"
            size={INPUT_SIZE}
            name="VendorId"
            label="Vendor Name"
            value={data.VendorId || ""}
            onChange={(e) => setData({ ...data, VendorId: e.value })}
          />
          <FormTextField
            name="DateFrom"
            value={data.DateFrom}
            onChange={(e) => setData({ ...data, DateFrom: e.value })}
            label="Date From"
            type="date"
            required={true}
          />

          <FormTextField
            name="DateTo"
            value={data.DateTo}
            onChange={(e) => setData({ ...data, DateTo: e.value })}
            label="Date To"
            type="date"
            required={true}
          />
          <Button
            type="primary"
            htmlType="submit"
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
    postRequest("InventoryItemRate", data).then((res) => {
      setBranches(res.data.DataSet.Table3);
      setCategories(res.data.DataSet.Table1);
      setVendors(res.data.DataSet.Table);
      setProducts(res.data.DataSet.Table2);
    });
  }, []);

  return (
    <div style={{ background: "white", padding: 20 }}>
      <Title level={3} type="primary">
        Inventory Product Rate Report
      </Title>
      <Card>
        <Row>
          <Col span={24}>{fieldPanel}</Col>
        </Row>
      </Card>
      <ReportExcelDownload
        fileName={`Inventory Product Rate Report: ${data.DateFrom}-${data.DateTo}`}
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
          <InventoryProdRepTemplate reportData={reportData} />
        )}
      </ReportExcelDownload>
      {/* <ReportPdfDownload
        fileName="sales_summary_report"
        elementId="report1"
        htmlFile={reportData}
        fieldPanel={fieldPanel}
        getReportFunc={getReportData}
        disablePDF={disablePrint}
      /> */}
    </div>
  );
};
