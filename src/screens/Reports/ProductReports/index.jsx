import { SearchOutlined } from "@ant-design/icons";
import { Button, Card, message, Spin } from "antd";
import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  BUTTON_SIZE,
  INPUT_SIZE,
  KOTTemp,
} from "../../../common/ThemeConstants";
import FormButton from "../../../components/general/FormButton";
import FormContainer from "../../../components/general/FormContainer";
import FormSelect from "../../../components/general/FormSelect";
import ComponentToPrint from "../../../components/specificComponents/ComponentToPrint";
import ReactToPrint from "react-to-print";
import {
  setBranches,
  getProductReport,
} from "../../../redux/actions/reportActions";
import FormTextField from "../../../components/general/FormTextField";
import { postRequest } from "../../../services/mainApp.service";
import ProductReportsTemp from "./ProductReportsTemp";
import ReportExcelDownload from "../../../components/ReportingComponents/ReportExcelDownload";
import { getDate } from "../../../functions/dateFunctions";
import FormSearchSelect from "../../../components/general/FormSearchSelect";

const initialDataBody = {
  OperationId: 1,
  BranchId: null,
  DateFrom: getDate(),
  DateTo: null,
  BusinessDayId: null,
  TerminalDetailId: null,
  ShiftId: null,
  ProductDetailId: null,
  ProductSizeName: "",
};

const ProductReports = () => {
  const dispatch = useDispatch();
  const controller = new window.AbortController();
  const userData = useSelector((state) => state.authReducer);
  const [bodyData, setBodyData] = useState(initialDataBody);
  const [shiftData, setShiftData] = useState([]);
  const [productList, setProductList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [reportType, setReportsType] = useState([
    {
      name: "Date Range",
      id: 2,
    },
    {
      name: "Business Day",
      id: 3,
    },
    {
      name: "Shift",
      id: 4,
    },
  ]);
  const [html, setHtml] = useState([]);

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
      "/ProductSaleReport",
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
      setProductList(response?.data?.DataSet?.Table2);
    });
    return () => {
      controller.abort();
    };
  }, []);

  const handleSearchSubmit = (e, operationId) => {
    e.preventDefault();
    setLoading(true);
    let data = bodyData;
    if (data.DateFrom > data.DateTo) {
      message.error("Date from cant be greater than Date To");
      return;
    }
    dispatch(
      getProductReport(
        "/ProductSaleReport",
        {
          ...data,
          DateTo: data.OperationId !== 2 ? null : data.DateTo,
          CompanyId: userData.CompanyId,
        },
        controller,
        userData,
        (data) => {
          if (data.Table.length > 0) {
            setLoading(false);
            setHtml(data.Table);
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
        <b>Product Reports</b>
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

          <FormSelect
            listItem={reportType || []}
            colSpan={4}
            idName="id"
            valueName="name"
            size={INPUT_SIZE}
            name="OperationId"
            className="textInput"
            label="Report Type"
            value={bodyData.OperationId}
            onChange={handleSearchChange}
            required={true}
          />

          <FormTextField
            type="date"
            label={bodyData.OperationId === 2 ? "Date From" : "Date"}
            //defaultValue={moment(new Date(), "YYYY/MM/DD")}
            onChange={(e) => {
              setBodyData({
                ...bodyData,
                DateFrom: e.value,
              });
            }}
            required={true}
          ></FormTextField>

          <FormTextField
            type="date"
            label="Date To"
            //defaultValue={moment(new Date(), "YYYY/MM/DD")}
            onChange={(e) => {
              setBodyData({
                ...bodyData,
                DateTo: e.value,
              });
            }}
            required={bodyData.OperationId === 2}
            hide={bodyData.OperationId !== 2}
          ></FormTextField>
          {bodyData.OperationId === 4 && (
            <FormSelect
              listItem={shiftData || []}
              colSpan={4}
              idName="ShiftId"
              valueName="ShiftName"
              size={INPUT_SIZE}
              name="ShiftId"
              className="textInput"
              label="Shift"
              value={bodyData.ShiftId}
              onChange={handleSearchChange}
              required={bodyData.OperationId === 4}
            />
          )}

          <FormSearchSelect
            colSpan={8}
            label="Product"
            idName="ProductDetailId"
            name="ProductDetailId"
            valueName="ProductSizeName"
            listItem={productList}
            size={INPUT_SIZE}
            value={bodyData.ProductDetailId}
            onChange={handleSearchChange}
          />

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

      <ReportExcelDownload fileName={"Product Report"}>
        {loading && (
          <Spin
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          />
        )}
        {html.length > 0 && (
          <ProductReportsTemp
            html={html}
            DateFrom={bodyData.DateFrom}
            DateTo={bodyData.DateTo}
          />
        )}
      </ReportExcelDownload>
    </div>
  );
};

export default ProductReports;
