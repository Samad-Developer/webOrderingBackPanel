import { SearchOutlined } from "@ant-design/icons";
import { Button, Card, message, Spin } from "antd";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BUTTON_SIZE, INPUT_SIZE } from "../../../common/ThemeConstants";
import FormButton from "../../../components/general/FormButton";
import FormContainer from "../../../components/general/FormContainer";
import FormSelect from "../../../components/general/FormSelect";
import {
  setBranches,
  getProductReport
} from "../../../redux/actions/reportActions";
import FormTextField from "../../../components/general/FormTextField";
import { postRequest } from "../../../services/mainApp.service";
import ReportExcelDownload from "../../../components/ReportingComponents/ReportExcelDownload";
import { getDate } from "../../../functions/dateFunctions";
import ProductCostingTemp from "./ProductCostingTemp";

const initialDataBody = {
  OperationId: 1,
  BranchId: null,
  DateFrom: getDate(),
  DateTo: getDate(),
  ProductName: null,
  CompanyId: null
};

const ProductCostingReports = () => {
  const dispatch = useDispatch();
  const controller = new window.AbortController();
  const userData = useSelector((state) => state.authReducer);
  const [bodyData, setBodyData] = useState(initialDataBody);
  const [shiftData, setShiftData] = useState([]);
  const [loading, setLoading] = useState(false);

  const [html, setHtml] = useState([]);
  const [htmlDetail, setHtmlDetail] = useState([]);

  const { branches } = useSelector((state) => state.reportsReducer);

  useEffect(() => {
    dispatch(
      setBranches(
        "/PosReports",
        { ...bodyData, OperationId: 0, CompanyId: userData.CompanyId },
        controller,
        userData
      )
    );
    postRequest(
      "/ProductCostingReport",
      { ...bodyData, OperationId: 1, CompanyId: userData.CompanyId },
      controller
    ).then((response) => {
      if (response.error === true) {
        message.error(response.errorMessage);
        return;
      }
      if (response.data.response === false) {
        message.error(response.DataSet.Table.errorMessage);
        return;
      }
      setShiftData(response.data.DataSet.Table1);
      setBodyData({ ...bodyData, DateFrom: getDate(), DateTo: getDate() });
    });
    return () => {
      controller.abort();
    };
  }, []);

  const handleSearchSubmit = (e, operationId) => {
    e.preventDefault();
    if (bodyData.DateFrom > bodyData.DateTo) {
      message.error("Date From should be less than Date To");
      return;
    }
    setLoading(true);
    let data = bodyData;
    if (data.DateFrom > data.DateTo) {
      message.error("Date from cant be greater than Date To");
      return;
    }
    dispatch(
      getProductReport(
        "/ProductCostingReport",
        {
          ...data,
          OperationId: 2,
          CompanyId: userData.CompanyId,
          ProductName:
            data.ProductName === null
              ? data.ProductName
              : "%" + data.ProductName + "%"
        },
        controller,
        userData,
        (data) => {
          if (data.Table.length > 0) {
            setLoading(false);
            setHtml(data.Table);
            setHtmlDetail(data.Table1);
          } else {
            setLoading(false);
            setHtml([]);
            message.error("No records found");
          }
        }
      )
    );
  };

  const handleSearchChange = (event) => {
    if (event.name === "OperationId") {
      if (event.value !== null) {
        setBodyData({ ...bodyData, [event.name]: event.value });
      }
    }
    setBodyData({ ...bodyData, [event.name]: event.value });
  };

  return (
    <div>
      <h1 style={{ color: "#4561B9", fontSize: 28 }}>
        <b>Product Costing Reports</b>
      </h1>
      <Card>
        <FormContainer
          onSubmit={handleSearchSubmit}
          rowStyle={{ display: "flex" }}
        >
          <FormSelect
            listItem={branches || []}
            colSpan={4}
            idName="BranchId"
            valueName="BranchName"
            size={INPUT_SIZE}
            name="BranchId"
            className="textInput"
            label="Branches"
            value={bodyData.BranchId}
            onChange={handleSearchChange}
            required={true}
          />

          <FormTextField
            colSpan={6}
            label="Product Name"
            name="ProductName"
            value={bodyData.ProductName}
            placeholder="Product Name"
            onChange={handleSearchChange}
          />

          <FormTextField
            type="date"
            label="Date From"
            onChange={(e) => {
              setBodyData({
                ...bodyData,
                DateFrom: e.value
              });
            }}
            value={bodyData.DateFrom}
            required={true}
          ></FormTextField>

          <FormTextField
            type="date"
            label="Date To"
            onChange={(e) => {
              setBodyData({
                ...bodyData,
                DateTo: e.value
              });
            }}
            value={bodyData.DateTo}
            required={true}
          ></FormTextField>

          <FormButton
            title="Search"
            type="primary"
            size={BUTTON_SIZE}
            colSpan={2}
            htmlType="submit"
            icon={<SearchOutlined />}
            colStyle={{ marginLeft: "auto", alignSelf: "end" }}
          />
        </FormContainer>
      </Card>
      <div style={{ margin: "10px 0", borderTop: "1px solid lightgray" }}></div>

      <ReportExcelDownload
        fileName={`ProductCostingReport_${bodyData.DateFrom}_${bodyData.DateTo}`}
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
        {html.length > 0 && (
          <ProductCostingTemp
            html={html}
            htmlDetail={htmlDetail}
            date={`For the Period of ${bodyData.DateFrom} To ${bodyData.DateTo}`}
            branch={
              branches?.find((item) => item.BranchId === bodyData.BranchId)
                .BranchName
            }
          />
        )}
      </ReportExcelDownload>
    </div>
  );
};

export default ProductCostingReports;
