import { Button, Col, message, Row, Spin } from "antd";
import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { INPUT_SIZE } from "../../../common/ThemeConstants";
import FormSearchSelect from "../../../components/general/FormSearchSelect";
import FormSelect from "../../../components/general/FormSelect";
import FormTextField from "../../../components/general/FormTextField";
import ReportExcelDownload from "../../../components/ReportingComponents/ReportExcelDownload";
import { postRequest } from "../../../services/mainApp.service";
import ProductEffTemplate from "./ProductEffTemp";

export const ProductEfficiencyReport = () => {
  const userData = useSelector((state) => state.authReducer);
  const [data, setData] = useState({
    OperationId: null,
    CompanyId: null,
    BranchId: null,
    UserId: null,
    CategoryId: null,
    ProductId: null,
    DateFrom: "",
    DateTo: "",
    ProductDetailId: null
  });
  const [branches, setBranches] = useState([]);
  const [productCategories, setProductCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [productDetails, setProdcutDetails] = useState([]);
  const [disableExcel, setDisableExcel] = useState(true);

  const [reportData, setReportData] = useState("");
  const [list, setList] = useState([]);
  const [disablePrint, setDisablePrint] = useState(true);
  const [loading, setLoading] = useState(true);

  const getReportData = (e) => {
    e.preventDefault();

    if (data.DateFrom !== "" && data.DateTo !== "") {
      if (new Date(data.DateFrom) <= new Date(data.DateTo)) {
        setLoading(true);
        postRequest("InventoryVarianceReport", {
          ...data,
          OperationId: 3,
          CompanyId: userData.CompanyId,
          UserId: userData.UserId
        })
          .then((res) => {
            setLoading(false);
            if (!res.data.DataSet.Table.length) {
              setDisablePrint(true);
              message.error("No Record found!");
              setReportData("");
              setDisableExcel(true);
              return;
            } else setDisablePrint(false);
            // const htmlTmp = ProductEffTemp(res.data.DataSet.Table);
            setList(res.data.DataSet.Table);
            setDisableExcel(false);
            setReportData(htmlTmp);
          })
          .catch((error) => message.error(error));
      } else {
        message.error("Please select DateTo greater than DateFrom");
        setDisablePrint(true);
      }
    } else {
      message.error("Please select both dates");
      setDisablePrint(true);
    }
  };

  const handleSearchChange = (e) => {
    setData({ ...data, [e.name]: e.value });
    setList([]);
  };

  useEffect(() => {
    setLoading(true);
    postRequest("InventoryVarianceReport", {
      ...data,
      CompanyId: userData.CompanyId,
      OperationId: 1,
      UserId: userData.UserId
    })
      .then((res) => {
        setBranches(res.data.DataSet.Table);
        setProductCategories(res.data.DataSet.Table1);
        setProducts(res.data.DataSet.Table2);
        setProdcutDetails(res.data.DataSet.Table3);
        setLoading(false);
      })
      .catch((error) => console.error(error));
  }, []);

  const fieldPanel = (
    <form onSubmit={getReportData}>
      <Row gutter={[8, 8]} style={{ marginBottom: 10 }}>
        <FormSelect
          colSpan={4}
          listItem={branches || []}
          idName="BranchId"
          valueName="BranchName"
          size={INPUT_SIZE}
          name="BranchId"
          label="Branch"
          value={data.BranchId || ""}
          onChange={handleSearchChange}
          required
          disabled={loading ? true : false}
        />
        <FormSelect
          colSpan={4}
          listItem={productCategories || []}
          idName="CategoryId"
          valueName="CategoryName"
          size={INPUT_SIZE}
          name="CategoryId"
          label="Category"
          value={data.CategoryId || ""}
          onChange={handleSearchChange}
          // required
          disabled={loading ? true : false}
        />
        <FormSelect
          colSpan={4}
          listItem={
            products.filter(
              (product) =>
                product.ProductCategoryId === data.CategoryId ||
                data.CategoryId === null
            ) || []
          }
          idName="ProductId"
          valueName="ProductName"
          size={INPUT_SIZE}
          name="ProductId"
          label="Product"
          value={data.ProductId || ""}
          onChange={handleSearchChange}
          // required
          disabled={loading ? true : false}
        />
        <FormSearchSelect
          colSpan={4}
          listItem={
            productDetails.filter(
              (productDtl) =>
                productDtl.ProductId === data.ProductId ||
                data.ProductId === null
            ) || []
          }
          idName="ProductDetailId"
          valueName="ProductSizeName"
          size={INPUT_SIZE}
          name="ProductDetailId"
          label="Product Detail"
          value={data.ProductDetailId || ""}
          onChange={handleSearchChange}
          required
          disabled={loading ? true : false}
        />
        {/* <FormSelect
          colSpan={4}
          listItem={
            productDetails.filter(
              (productDtl) =>
                productDtl.ProductId === data.ProductId ||
                data.ProductId === null
            ) || []
          }
          idName="ProductDetailId"
          valueName="ProductSizeName"
          size={INPUT_SIZE}
          name="ProductDetailId"
          label="Product Detail"
          value={data.ProductDetailId || ""}
          onChange={handleSearchChange}
          required
          disabled={loading ? true : false}
        /> */}
        <FormTextField
          span={4}
          label="Date From"
          name="DateFrom"
          type="date"
          value={data.DateFrom}
          onChange={handleSearchChange}
          required
          disabled={loading ? true : false}
        />
        <FormTextField
          span={4}
          label="Date To"
          name="DateTo"
          type="date"
          value={data.DateTo}
          onChange={handleSearchChange}
          required
          disabled={loading ? true : false}
        />
        <Col>
          <br />{" "}
          <Button
            type="primary"
            htmlType="submit"
            style={{ marginLeft: "auto" }}
            disabled={loading ? true : false}
          >
            Search
          </Button>
        </Col>
      </Row>
    </form>
  );

  return (
    <div style={{ background: "white", padding: 20 }}>
      <h2 style={{ color: "#4561B9" }}>Product Efficiency Report</h2>
      <Row>
        <Col span={24}>{fieldPanel}</Col>
      </Row>
      <ReportExcelDownload
        fileName={`ProductEfficiencyReport_${data.DateFrom} - ${data.DateTo}`}
        hidePdf={1}
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
        {list.length > 0 && (
          <ProductEffTemplate
            list={list}
            branch={
              branches.find((item) => item.BranchId === data.BranchId)
                ?.BranchName
            }
            date={`Date Range: ${data.DateFrom} to ${data.DateTo}`}
          />
        )}
      </ReportExcelDownload>
    </div>
  );
};
