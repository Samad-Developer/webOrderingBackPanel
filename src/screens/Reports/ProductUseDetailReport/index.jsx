import { Button, Col, message, Row, Spin } from "antd";
import Title from "antd/lib/typography/Title";
import React, { useState } from "react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { INPUT_SIZE } from "../../../common/ThemeConstants";
import FormSearchSelect from "../../../components/general/FormSearchSelect";
import FormSelect from "../../../components/general/FormSelect";
import FormTextField from "../../../components/general/FormTextField";
import ReportExcelDownload from "../../../components/ReportingComponents/ReportExcelDownload";
import { getDate } from "../../../functions/dateFunctions";
import { setBranches } from "../../../redux/actions/reportActions";
import { postRequest } from "../../../services/mainApp.service";
import ProductUseDetailTemp from "./ProductUseDetailTemp";

const ProductUseDetailReport = () => {
  const userData = useSelector((state) => state.authReducer);
  const { branches, supportingTable } = useSelector(
    (state) => state.reportsReducer
  );
  const dispatch = useDispatch();
  const [data, setData] = useState({
    OperationId: 1,
    BranchId: 0,
    CompanyId: null,
    UserId: null,
    DateFrom: getDate(),
    DateTo: getDate(),
    ProductDetailId: 0,
  });

  const [reportData, setReportData] = useState([]);
  const controller = new window.AbortController();
  const [disablePrint, setDisablePrint] = useState(true);
  const [disableExcel, setDisableExcel] = useState(true);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    dispatch(
      setBranches(
        "/ProductUseDetailReport",
        {
          ...data,
          OperationId: 1,
          CompanyId: userData.CompanyId,
          UserId: userData.UserId,
        },
        controller,
        userData
      )
    );
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (data.DateFrom !== "" && data.DateTo !== "") {
      if (new Date(data.DateFrom) <= new Date(data.DateTo)) {
        setLoading(true);

        postRequest("ProductUseDetailReport", {
          ...data,
          UserId: userData.UserId,
          OperationId: 2,
          CompanyId: userData.CompanyId,
          ProductDetailId:
            userData.ProductDetailId == null ? 0 : userData.ProductDetailId,
        }).then((res) => {
          setLoading(false);
          if (!res.data.DataSet.Table.length) {
            message.error("No Records found.");
            setDisableExcel(true);
            setReportData([]);
            return;
          }
          setReportData(res.data.DataSet.Table);
          setDisableExcel(false);
        });
      } else {
        message.error("Please select DateTo greater than DateFrom");
      }
    } else {
      message.error("Please select both dates");
    }
  };

  const fieldPanel = (
    <form onSubmit={handleSearchSubmit}>
      <div
        style={{
          display: "flex",
          alignItems: "flex-end",
          gap: 10,
        }}
      >
        <FormSelect
          colSpan={4}
          listItem={branches || []}
          idName="BranchId"
          valueName="BranchName"
          size={INPUT_SIZE}
          name="BranchId"
          label="Branch"
          value={data.BranchId || ""}
          onChange={(e) => {
            setData({ ...data, BranchId: e.value });
            setReportData([]);
          }}
          disabled={branches?.length === 0}
          required={true}
        />
        <FormSearchSelect
          colSpan={4}
          listItem={supportingTable?.Table1 || []}
          idName="ProductDetailId"
          valueName="ProductName"
          size={INPUT_SIZE}
          name="ProductDetailId"
          label="Product Detail"
          value={data.ProductDetailId}
          onChange={(e) => {
            setData({ ...data, ProductDetailId: e.value });
          }}
          disabled={supportingTable?.Table1?.length === 0}
        />
        <FormTextField
          span={4}
          label="Date From"
          name="DateFrom"
          type="date"
          value={data.DateFrom}
          onChange={(e) => setData({ ...data, DateFrom: e.value })}
        />
        <FormTextField
          span={4}
          label="Date To"
          name="DateTo"
          type="date"
          value={data.DateTo}
          onChange={(e) => setData({ ...data, DateTo: e.value })}
        />

        <Button type="primary" htmlType="submit" style={{ marginLeft: "auto" }}>
          Search
        </Button>
      </div>
    </form>
  );

  return (
    <div style={{ background: "white", padding: 20 }}>
      <Title level={2} style={{ color: "#4561B9" }}>
        Product Use Detail Report
      </Title>
      <Row>
        <Col span={24}>{fieldPanel}</Col>
      </Row>

      <ReportExcelDownload
        fileName={`Product_Use_Report ${data.DateFrom} - ${data.DateTo}`}
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
          <ProductUseDetailTemp
            list={reportData}
            headList={reportData.length > 0 ? Object.keys(reportData[0]) : []}
            date={`Date Range: ${data.DateFrom} to ${data.DateTo}`}
            branch={
              branches.find((item) => item.BranchId === data.BranchId)
                .BranchName
            }
          />
        )}
      </ReportExcelDownload>
    </div>
  );
};

export default ProductUseDetailReport;
