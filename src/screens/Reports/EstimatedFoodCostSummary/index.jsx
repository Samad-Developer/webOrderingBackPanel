import { Button, Card, Col, message, Row, Spin } from "antd";
import Title from "antd/lib/typography/Title";
import React, { Fragment, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { INPUT_SIZE } from "../../../common/ThemeConstants";
import FormSelect from "../../../components/general/FormSelect";
import FormTextField from "../../../components/general/FormTextField";
import ReportExcelDownload from "../../../components/ReportingComponents/ReportExcelDownload";
import { currencyFormat } from "../../../functions/generalFunctions";
import { postRequest } from "../../../services/mainApp.service";
// import { salesSummaryTemplate } from "./salesSummaryTemplate";
import { EstimatedFoodCostSummaryTemp } from "./EstimatedFoodCostSummaryTemp";

const EstimatedFoodCostSummary = () => {
  const userData = useSelector((state) => state.authReducer);
  const [data, setData] = useState({
    OperationID: 1,
    BranchId: null,
    CompanyId: userData.CompanyId,
    EatInPercent: null,
    EatOutPercent: null,
    CategoryId: null,
    ProductId: null,
    ProductDetailId: null,
    UserId: userData.UserId,
    ReportRateTypeId: null,
    DateFromAvg: "",
    DateToAvg: "",
  });
  const [branches, setBranches] = useState([]);
  const [reportData, setReportData] = useState([]);
  const [productCategories, setProductCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [reportRateTypeList, setReportRateTypeList] = useState("");
  const [isAvgRate, setIsAvgRate] = useState(false);
  const [productDetails, setProductDetails] = useState([]);
  const [loading, setLoading] = useState(false);

  const getReportData = (e) => {
    e.preventDefault();
    setLoading(true);
    const eatInOutSum = parseInt(
      parseInt(data.EatInPercent) + parseInt(data.EatOutPercent)
    );
    if (eatInOutSum !== 100) {
      message.error("Eat in and eat sum must be 100;");
      return;
    }
    postRequest("RPT_EstimatedFoodCost ", { ...data, OperationID: 2 })
      .then((res) => {
        setLoading(false);
        if (
          res.data.DataSet.Table.length <= 0 ||
          res.data.DataSet.Table1.length <= 0 ||
          res.data.DataSet.Table2.length <= 0
        ) {
          message.error("No Record Found");
          setReportData([]);
          return;
        }
        setReportData(res.data.DataSet.Table);
      })
      .catch((error) => console.error(error));
  };

  useEffect(() => {
    postRequest("RPT_EstimatedFoodCost ", data)
      .then((res) => {
        setBranches(res.data.DataSet.Table2);
        setProductCategories(res.data.DataSet.Table);
        setProducts(res.data.DataSet.Table1);
        setReportRateTypeList(res.data.DataSet.Table3);
      })
      .catch((error) => console.error(error.message));
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
            required
          />

          <FormSelect
            colSpan={8}
            listItem={productCategories || []}
            idName="CategoryId"
            valueName="CategoryName"
            size={INPUT_SIZE}
            name="CategoryId"
            label="Product Category"
            value={data.CategoryId || ""}
            onChange={(e) => setData({ ...data, CategoryId: e.value })}
            required
          />

          <FormSelect
            colSpan={8}
            listItem={
              (products &&
                products.filter(
                  (product) => product.ProductCategoryId === data.CategoryId
                )) ||
              []
            }
            idName="ProductId"
            valueName="ProductName"
            size={INPUT_SIZE}
            name="ProductId"
            label="Product"
            value={data.ProductId || ""}
            onChange={(e) => setData({ ...data, ProductId: e.value })}
            // required
          />
          <FormSelect
            colSpan={8}
            listItem={reportRateTypeList || []}
            idName="ReportRateTypeId"
            valueName="ReportRateType"
            size={INPUT_SIZE}
            name="ReportRateTypeId"
            label="By Rate Type"
            value={data.ReportRateTypeId || ""}
            onChange={(e) => {
              setIsAvgRate(
                reportRateTypeList.find(
                  (item) => item.ReportRateTypeId === e.value
                ).Flex1
              );
              setData({ ...data, ReportRateTypeId: e.value });
            }}
            required
          />

          {isAvgRate === "AvgRate" && (
            <FormTextField
              name="DateFromAvg"
              value={data.DateFromAvg}
              onChange={(e) => {
                setData({ ...data, DateFromAvg: e.value });
              }}
              label="Date From"
              required
              type="date"
            />
          )}

          {isAvgRate === "AvgRate" && (
            <FormTextField
              name="DateToAvg"
              value={data.DateToAvg}
              onChange={(e) => setData({ ...data, DateToAvg: e.value })}
              label="Date To"
              required
              type="date"
            />
          )}
          <FormTextField
            name="eatin"
            value={data.EatInPercent}
            onChange={(e) => setData({ ...data, EatInPercent: e.value })}
            label="Eat In %"
            required
          />

          <FormTextField
            name="eatout"
            value={data.EatOutPercent}
            onChange={(e) => setData({ ...data, EatOutPercent: e.value })}
            label="Eat Out %"
            required
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
        Estimated Food Cost Summery Report
      </Title>
      <Card>
        <Row>
          <Col span={24}>{fieldPanel}</Col>
        </Row>
      </Card>

      <ReportExcelDownload fileName={`Estimated Food Cost Summery Report`}>
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
          <EstimatedFoodCostSummaryTemp reportData={reportData} />
        )}
      </ReportExcelDownload>
    </div>
  );
};

export default EstimatedFoodCostSummary;
