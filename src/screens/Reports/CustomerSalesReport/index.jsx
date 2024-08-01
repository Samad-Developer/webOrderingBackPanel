import { Button, Col, message, Row, Spin } from "antd";
import Title from "antd/lib/typography/Title";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { INPUT_SIZE } from "../../../common/ThemeConstants";
import ReportComponent from "../../../components/formComponent/ReportComponent";
import FormSelect from "../../../components/general/FormSelect";
import FormTextField from "../../../components/general/FormTextField";
import ReportExcelDownload from "../../../components/ReportingComponents/ReportExcelDownload";
import { resetState } from "../../../redux/actions/basicFormAction";
import { postRequest } from "../../../services/mainApp.service";
import CustomerSalesTemp from "./CustomerSalesTemp";
import { getDate } from "../../../functions/dateFunctions";

const initialSearchValues = {
  OperationId: 1,
  BranchId: null,
  DateFrom: "",
  DateTo: getDate(),
  CompanyId: null,
  CnicNo: null,
  ProductDetailId: null,
};

const CustomerSalesReport = () => {
  const dispatch = useDispatch();
  const controller = new window.AbortController();
  const userData = useSelector((state) => state.authReducer);
  const [data, setData] = useState(initialSearchValues);
  const [list, setList] = useState([]);
  const [branches, setBranches] = useState([]);
  const [productDetials, setProductDetails] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [disableExcel, setDisableExcel] = useState(true);
  const [selectedBranch, setSelectedBranch] = useState([]);
  const [showLoader, setShowLoader] = useState(false);
  useEffect(() => {
    postRequest(
      "/CustomerSalesReport",
      {
        ...initialSearchValues,
        CompanyId: userData.CompanyId,

        OperationId: 1,
      },
      controller
    )
      .then((res) => {
        setBranches(res.data.DataSet.Table);
        setProductDetails(res.data.DataSet.Table1);
      })
      .catch((err) => console.error(err));
    return () => {
      controller.abort();
      dispatch(resetState());
    };
  }, []);

  const handleSearchChange = (e) => {
    setData({ ...data, [e.name]: e.value });
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setShowLoader(true);
    postRequest("/CustomerSalesReport", {
      ...data,
      OperationId: 2,
      CompanyId: userData.CompanyId,
    })
      .then((res) => {
        setShowLoader(false);
        if (res.data.DataSet.Table.length <= 0) {
          message.error("No Records found!");

          setTableData(res.data.DataSet.Table);
          setList(res.data.DataSet.Table);
          setDisableExcel(true);
          return;
        }
        setTableData(res.data.DataSet.Table);
        setList(res.data.DataSet.Table);
        setDisableExcel(false);
        setSelectedBranch(
          branches.find((branch) => branch.BranchId === data.BranchId)
        );
      })
      .catch((err) => console.error(err));
  };

  const searchPanel = (
    <form onSubmit={handleSearchSubmit}>
      <div style={{ display: "flex", alignItems: "flex-end", gap: 10 }}>
        <FormSelect
          colSpan={4}
          listItem={branches || []}
          idName="BranchId"
          valueName="BranchName"
          size={INPUT_SIZE}
          name="BranchId"
          label="Branch"
          value={data.BranchId}
          onChange={handleSearchChange}
          // required={true}
        />
        <FormSelect
          colSpan={4}
          listItem={productDetials || []}
          idName="ProductDetailId"
          valueName="ProductDetailName"
          size={INPUT_SIZE}
          name="ProductDetailId"
          label="Product Details"
          value={data.ProductDetailId}
          onChange={handleSearchChange}
        />
        <FormTextField
          colSpan={4}
          label="CnicNo"
          type="text"
          name="CnicNo"
          size={INPUT_SIZE}
          value={data.CnicNo}
          // required={true}
          onChange={handleSearchChange}
        />

        <FormTextField
          colSpan={4}
          label="Date From"
          type="date"
          name="DateFrom"
          size={INPUT_SIZE}
          value={data.DateFrom}
          required={true}
          onChange={handleSearchChange}
        />
        <FormTextField
          colSpan={4}
          label="Date To"
          type="date"
          name="DateTo"
          size={INPUT_SIZE}
          value={data.DateTo}
          required={true}
          onChange={handleSearchChange}
        />

        <Button type="primary" htmlType="submit" style={{ marginLeft: "auto" }}>
          Search
        </Button>
      </div>
      <div style={{ margin: "10px 0", borderTop: "1px solid lightgray" }}></div>
    </form>
  );

  return (
    <div style={{ background: "white", padding: 20 }}>
      <Title level={3} type="primary">
        Customer Sales Report
      </Title>
      <Row>
        <Col span={24}>{searchPanel}</Col>
      </Row>

      <ReportExcelDownload fileName={`Customer Sales Report:${data.DateFrom}`}>
        {showLoader ? (
          <Spin
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          />
        ) : (
          list.length > 0 && (
            <CustomerSalesTemp
              list={list}
              headList={[]}
              branchAddress={
                selectedBranch ? selectedBranch.BranchAddress : "All"
              }
              // tehsil={`Tehsil: ${arr2.tehsil}`}
              city={selectedBranch ? selectedBranch.CityName : "All"}
            />
          )
        )}
      </ReportExcelDownload>
    </div>
  );
};

export default CustomerSalesReport;
