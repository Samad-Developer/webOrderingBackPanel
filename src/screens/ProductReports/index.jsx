import { SearchOutlined } from "@ant-design/icons";
import { Button, Card, message } from "antd";
import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BUTTON_SIZE, INPUT_SIZE, KOTTemp } from "../../common/ThemeConstants";
import FormButton from "../../components/general/FormButton";
import FormContainer from "../../components/general/FormContainer";
import FormSelect from "../../components/general/FormSelect";
import ComponentToPrint from "../../components/specificComponents/ComponentToPrint";
import ReactToPrint from "react-to-print";
import {
  setBranches,
  getProductReport,
} from "../../redux/actions/reportActions";
import FormTextField from "../../components/general/FormTextField";
import { postRequest } from "../../services/mainApp.service";

const initialDataBody = {
  OperationId: 1,
  BranchId: null,
  DateFrom: null,
  // new Date().getFullYear() +
  // "-" +
  // ((new Date().getMonth() + 1) < 10 ? "0" + (new Date().getMonth() + 1) : (new Date().getMonth() + 1)) +
  // "-" +
  // new Date().getDate(),
  // +" " +
  // "00:00:00.000",
  DateTo: null,
  // new Date().getFullYear() +
  // "-" +
  // ((new Date().getMonth() + 1) < 10 ? "0" + (new Date().getMonth() + 1) : (new Date().getMonth() + 1)) +
  // "-" +
  // new Date().getDate(),
  // +" " +
  // "00:00:00.000",
  BusinessDayId: null,
  TerminalDetailId: null,
  ShiftId: null,
};

const ProductReports = () => {
  const dispatch = useDispatch();
  const controller = new window.AbortController();
  const userData = useSelector((state) => state.authReducer);
  const [bodyData, setBodyData] = useState(initialDataBody);
  const [shiftData, setShiftData] = useState([]);
  const [disableDownload, setDisableDownload] = useState(true);
  let componentRef = useRef();
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
  const [html, setHtml] = useState("");

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
      // setBranches(response.data.DataSet.Table)
      setShiftData(response.data.DataSet.Table1);
    });
    return () => {
      controller.abort();
    };
  }, []);

  const handleSearchSubmit = (e, operationId) => {
    e.preventDefault();

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
            setDisableDownload(false);
            let htmlToSet = `<div style='page-break-inside:avoid;background-color:white;'>
                        <div style="border: 2px solid #000; text-align: center;">
                          <h3 style="margin-top: 0;"> Product Report </h3>
                      </div>
                      <table class="table">
                      <tr>
                        <th><b>Department</b></th>
                        <th><b>Category</b></th>
                        <th><b>Product</b></th>
                        <th><b>Size</b></th>
                        <th><b>Variant</b></th>
                        <th><b>Quantity</b></th>
                        <th><b>Price Without GST</b></th>
                        <th><b>Amount</b></th>
                      </tr>
                      ${data.Table.map((row) => {
                        return `
                          <tr>
                          <td> ${row.Department}</td>
                          <td> ${row.Category} </td>
                          <td> ${row.Product} </td>
                          <td> ${row.Size}</td>
                          <td> ${row.Variant}</td>
                          <td> ${row.Quantity}</td>
                          <td> ${row.PriceWithoutGST.toFixed(2)} </td>
                          <td> ${row.Amount.toFixed(2)}</td>
                          </tr>
                          `;
                      }).join("")}
                      <tr style='border:2px solid black'><td colSpan=6 style='font-weight:bold'>Total</td><td style='font-weight:bold'>${data.Table.reduce(
                        (sum, next) => sum + next.PriceWithoutGST,
                        0
                      ).toFixed(2)}</td>
                      
                      <td style='font-weight:bold'>${data.Table.reduce(
                        (sum, next) => sum + next.Amount,
                        0
                      ).toFixed(2)}</td>
                      
                      </tr>
                      </table>
                      </div>`;

            setHtml(htmlToSet);
            setDisableDownload(false);
          } else {
            setHtml("");
            setDisableDownload(true);
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

      <ReactToPrint
        trigger={() => <Button>Print PDF</Button>}
        content={() => componentRef}
      />
      <ComponentToPrint ref={(el) => (componentRef = el)} Bill={html} />
    </div>
  );
};

export default ProductReports;
