import { SaveFilled } from "@ant-design/icons";
import { message } from "antd";
import axios from "axios";
import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useReactToPrint } from "react-to-print";
import { BUTTON_SIZE, INPUT_SIZE } from "../../common/ThemeConstants";
import FormButton from "../../components/general/FormButton";
import FormSelect from "../../components/general/FormSelect";
import { postRequest } from "../../services/mainApp.service";

const stringTemplete = `
  <div  style="background-color:white;">
  <div style="width: 100%; text-align: center"><img src="{companyLogo}" style="height : 100px; width : 100px" /></div>
  <h1 style="text-align: center; margin-bottom: 0">{companyName}</h1>
  <h3 style="text-align: center; margin-bottom: 0; margin-top: 0">
    {address}
  </h3>
  <h3 style="text-align: center; margin-bottom: 0; margin-top: 0">
    {phoneNumber}
  </h3>
  <div style="border: 2px solid #000; text-align: center">
    <h2 style="margin-top: 0; margin-bottom: 10px">PRE-PAYMENT BILL</h2>
    <div style="display: flex; justify-content: space-between">
      <p style="margin: 3px 0; text-align: center">{billDate}</p>
      <p style="margin: 3px 0; text-align: center">{billTime}</p>
    </div>
  </div>
  <div style="display: flex; justify-content: space-between">
    <p style="margin: 3px 0; text-align: center">Order #</p>
    <p style="margin: 3px 0; text-align: center">{orderNumber}</p>
  </div>
  <div style="display: flex; justify-content: space-between">
    <p style="margin: 3px 0; text-align: center">Order Date/Time:</p>
    <p style="margin: 3px 0; text-align: center">{orderDateTime}</p>
  </div>
  <div style="display: flex; justify-content: space-between">
    <p style="margin: 3px 0; text-align: center">sybrid/Main Counter:</p>
    <p style="margin: 3px 0; text-align: center">{orderMode}</p>
  </div>
  <div style="display: flex; justify-content: space-between">
    <div style="display: flex">
      <p style="margin: 3px 0; text-align: center">Table:</p>
      <p style="margin: 3px 0; text-align: center">{orderTable}</p>
    </div>
    <div style="display: flex; justify-content: space-between">
      <p style="margin: 3px 0; text-align: center">Covers:</p>
      <p style="margin: 3px 0; text-align: center">{orderCover}</p>
    </div>
  </div>
  <div style="display: flex; justify-content: space-between">
    <p style="margin: 3px 0; text-align: center">Waiter:</p>
    <p style="margin: 3px 0; text-align: center">{orderWaiter}</p>
  </div>
  <table
    style="
      width: 100%;
      border-top: 1px solid #555;
      border-bottom: 1px solid #555;
    "
  >
    <thead>
      <tr>
        <th
          style="
            text-align: left;
            font-weight: 500;
            text-transform: uppercase;
            border: 0;
          "
        >
          Qty
        </th>
        <th
          style="
            text-align: left;
            font-weight: 500;
            text-transform: uppercase;
            border: 0;
          "
        >
          Item
        </th>
        <th
          style="
            text-align: right;
            font-weight: 500;
            text-transform: uppercase;
            border: 0;
          "
        >
          Price
        </th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td
          style="
            padding: 2px 10px;
            text-align: left;
            vertical-align: middle;
            font-weight: 300;
            border: 0;
          "
        >
          {productQty}
        </td>
        <td
          style="
            padding: 2px 10px;
            text-align: left;
            vertical-align: middle;
            font-weight: 300;
            border: 0;
          "
        >
          {productDetail}
        </td>
        <td
          style="
            padding: 2px 10px;
            text-align: right;
            vertical-align: middle;
            font-weight: 300;
            border: 0;
          "
        >
          {productPrice}
        </td>
      </tr>
    </tbody>
  </table>
  <table style="width: 100%">
    <tbody>
      <tr>
        <td style="vertical-align: middle; font-weight: 300; border: 0">
          Subtotal:
        </td>
        <td
          style="
            text-align: right;
            vertical-align: middle;
            font-weight: 300;
            border: 0;
          "
        >
          {productSubtotal}
        </td>
      </tr>
      <tr>
        <td style="vertical-align: middle; font-weight: 300; border: 0">
          GST ({gstPercent}):
        </td>
        <td
          style="
            text-align: right;
            vertical-align: middle;
            font-weight: 300;
            border: 0;
          "
        >
          {productGst}
        </td>
      </tr>
      <tr>
        <td style="vertical-align: middle; font-weight: 300; border: 0">
          Net Bill:
        </td>
        <td
          style="
            text-align: right;
            vertical-align: middle;
            font-weight: 300;
            border: 0;
          "
        >
          {productNetBill}
        </td>
      </tr>
    </tbody>
  </table>
  <p style="margin: 3px 0; text-align: center; border-top: 1px solid #555">
    For Order Online<br />
    {companyWebsite}<br />
    {companyFBPage}<br />
    {companyWhatsApp}<br />
  </p>
  
  </div>
`;

const orderData = {
  RowNum: 27,
  OrderMasterId: 118,
  OrderNumber: "20220526/ORD/00028",
  OrderDate: "2022-05-26T00:00:00",
  BranchId: 117,
  AdvanceOrderDate: null,
  IsAdvanceOrder: false,
  AreaId: 194,
  AlternateNumber: "0",
  CompanyId: 62,
  CounterDetailId: null,
  CustomerId: 108,
  DeliveryCharges: null,
  DeliveryTime: "30 mins",
  DiscountAmount: 0,
  DiscountId: null,
  DiscountPercent: 0,
  GSTAmount: 136,
  GSTId: null,
  GSTPercent: 0,
  OrderSourceId: 197,
  OrderStatusId: 7,
  OrderTime: "16:30:38.1133333",
  SpecialInstruction: "",
  TotalAmountWithGST: 1836,
  TotalAmountWithoutGST: 1700,
  AdvanceOrderDate1: null,
  AlternateNumber1: "0",
  AreaId1: 194,
  BillPrintCount: 0,
  CareOfId: null,
  CLINumber: 0,
  CounterDetailId1: null,
  Cover: 0,
  CreatedBy: 103,
  CreatedBy1: 103,
  CustomerAddressId: 84,
  CustomerId1: 108,
  FinishWasteReasonId: null,
  FinishWasteRemarks: "",
  IsActive: true,
  ModifiedBy: null,
  ModifiedDate: null,
  OrderCancelReasonId: null,
  OrderModeId: 110,
  OrderSourceValue: "",
  PaymentTypeId: null,
  PhoneId: 68,
  PreviousOrderMasterId: null,
  Remarks: "",
  RiderId: null,
  ShiftDetailId: null,
  WaiterId: null,
  UserIP: "1.2.2.1",
  BranchName: "DHA-Shamsheer",
  PhoneNumber: "0333",
  CustomerName: "IRFAN AHMED",
  OrderStatus: "New",
  Column1: "May 26 2022 12:00AM",
  OrderDateTime: "May 26 2022  4:30PM",
  OrderDeliveryDateTime: "May 26 2022  5:00PM",
  CompanyName: "ABCD Company",
  CompanyAddress: "OP/8788/AC-89 Block 45",
  OrderMode: "Delivery",
  OrderTable: "12",
  OrderCover: "12",
  CompanyPhoneNumber: "021-3232433",
  BillDate: "12-May-2022",
  BillTime: "16:30:38",
  WaiterName: "Arbaz Kirmani",
  CompanyWebsite: "www.abcd.com",
  CompanyFBPage: "www.facebook.com/abcd",
  CompanyWhatsApp: "0332-6767677",
  CompanyLogo:
    "https://cdn1.iconfinder.com/data/icons/dompicon-glyph-fitness-diet/256/vegetable-food-healthy-fitness-diet-512.png",
};

const BillManagement = () => {
  const userData = useSelector((state) => state.authReducer);
  const [templates, setTemplates] = useState([]);
  const [tempString, setTempString] = useState("");
  const [templateType, setTemplateType] = useState([]);
  const [templateTypeId, setTempTypeId] = useState(null);
  const [templateId, setTemplateId] = useState(null);
  const [tempStringToShow, setTempStringToShow] = useState("");
  const controller = new window.AbortController();

  const parseString = (value) => {
    let cloneTempString = value.replace(
      /{companyName}/g,
      orderData.CompanyName
    );
    cloneTempString = cloneTempString.replace(
      /{address}/g,
      orderData.CompanyAddress
    );
    cloneTempString = cloneTempString.replace(
      /{orderNumber}/g,
      orderData.OrderNumber
    );
    cloneTempString = cloneTempString.replace(
      /{orderDate}/g,
      orderData.OrderDate
    );
    cloneTempString = cloneTempString.replace(
      /{orderDateTime}/g,
      orderData.OrderDateTime
    );
    cloneTempString = cloneTempString.replace(
      /{orderMode}/g,
      orderData.OrderMode
    );
    cloneTempString = cloneTempString.replace(
      /{orderTable}/g,
      orderData.OrderTable
    );
    cloneTempString = cloneTempString.replace(
      /{orderCover}/g,
      orderData.OrderCover
    );
    cloneTempString = cloneTempString.replace(
      /{phoneNumber}/g,
      orderData.CompanyPhoneNumber
    );
    cloneTempString = cloneTempString.replace(
      /{billDate}/g,
      orderData.BillDate
    );
    cloneTempString = cloneTempString.replace(
      /{billTime}/g,
      orderData.BillTime
    );
    cloneTempString = cloneTempString.replace(
      /{orderWaiter}/g,
      orderData.WaiterName
    );
    cloneTempString = cloneTempString.replace(
      /{companyWebsite}/g,
      orderData.CompanyWebsite
    );
    cloneTempString = cloneTempString.replace(
      /{companyFBPage}/g,
      orderData.CompanyFBPage
    );
    cloneTempString = cloneTempString.replace(
      /{companyWhatsApp}/g,
      orderData.CompanyWhatsApp
    );
    cloneTempString = cloneTempString.replace(
      /{gstPercent}/g,
      orderData.GSTPercent
    );
    cloneTempString = cloneTempString.replace(
      /{productSubtotal}/g,
      orderData.TotalAmountWithoutGST
    );
    cloneTempString = cloneTempString.replace(
      /{productGst}/g,
      orderData.GSTAmount
    );

    cloneTempString = cloneTempString.replace(
      /{productNetBill}/g,
      orderData.TotalAmountWithGST
    );

    cloneTempString = cloneTempString.replace(
      /{companyLogo}/g,
      orderData.CompanyLogo
    );

    return cloneTempString;
  };

  useEffect(() => {
    const data = {
      TemplateId: templateId,
      TemplateTypeId: templateTypeId,
      TemplateHtml: tempString,
    };

    postRequest(
      "/CrudPrintTemplate",
      {
        ...data,
        OperationId: 1,
        CompanyId: userData.CompanyId,
        UserId: userData.UserId,
        UserIP: "12.1.1.2",
      },
      controller
    ).then((res) => {
      const responce = res.data.DataSet;
      setTemplates(res.data.DataSet.Table);
      // const templateTypeID =
      //   responce.Table1[0] && responce.Table1[0].TemplateTypeId;
      // setTempTypeId(templateTypeID);
      // const filteredTempalteString =
      //   responce.Table &&
      //   responce.Table.filter((str) => {
      //     return templateTypeID === str.TemplateTypeId && str;
      //   });

      // if (filteredTempalteString.length > 0) {
      //   setTemplateId(filteredTempalteString[0].TemplateId);
      //   setTempStringToShow(
      //     parseString(filteredTempalteString[0].TemplateHtml)
      //   );
      //   setTempString(filteredTempalteString[0].TemplateHtml);
      // }
      setTemplateType(responce.Table1);
    });
  }, []);

  const handleChange = (event) => {
    setTempString(event.target.value);
    const value = event.target.value;
    setTempStringToShow(parseString(value));
  };

  const handleTempTypeIdChange = (data) => {
    setTempTypeId(data.value);
    const filteredTempalteString = templates.filter(
      (str) => data.value == str.TemplateTypeId
    );

    if (filteredTempalteString.length > 0) {
      setTemplateId(filteredTempalteString[0].TemplateId);
      setTempStringToShow(parseString(filteredTempalteString[0].TemplateHtml));
      setTempString(filteredTempalteString[0].TemplateHtml);
    }
  };

  const handleUpdate = (event) => {
    const data = {
      TemplateId: templateId,
      TemplateTypeId: templateTypeId,
      TemplateHtml: tempString,
    };
    postRequest(
      "/CrudPrintTemplate",
      {
        ...data,
        OperationId: 2,
        CompanyId: userData.CompanyId,
        UserId: userData.UserId,
        UserIP: "12.1.1.2",
      },
      controller
    ).then((data) => {
      message.success("Updated Successfully!");
      const responce = data.data.DataSet;
      setTemplates(data.data.DataSet.Table1);
      // const templateTypeID =
      //   responce.Table2[0] && responce.Table2[0].TemplateTypeId;
      setTempTypeId(null);
      // const filteredTempalteString =
      //   responce.Table &&
      //   responce.Table.filter((str) => {
      //     return templateTypeID === str.TemplateTypeId && str;
      //   });

      // if (filteredTempalteString.length > 0) {
      setTempStringToShow("");
      setTempString("");
      // }
      // setTemplateType(responce.Table2);
    });
  };

  let cname = "abc";
  const StringA = "<div><h1>{companyName}</h1></div>".replace(
    "{companyName}",
    cname
  );

  return (
    <div style={{ margin: 5 }}>
      <h1 style={{ color: "#4561B9", fontSize: 28 }}>
        <b>Bill Management</b>
      </h1>
      <div
        style={{
          background: "white",
          padding: 15,
          boxShadow: "0 0 5px lightgray",
          borderRadius: 2,
        }}
      >
        <div
          style={{
            marginBottom: 15,
            display: "flex",
            flexDirection: "row",
            alignItems: "flex-end",
            columnGap: "8px",
          }}
        >
          <FormSelect
            colSpan={4}
            listItem={templateType}
            idName="TemplateTypeId"
            valueName="TemplateTypeName"
            size={INPUT_SIZE}
            name="TemplateTypeId"
            label="Template Type"
            value={templateTypeId === null ? "" : templateTypeId}
            onChange={handleTempTypeIdChange}
            required={true}
          />
          <FormButton
            colSpan={4}
            title="Update"
            type="primary"
            size={BUTTON_SIZE}
            className="actionButton"
            icon={<SaveFilled />}
            onClick={handleUpdate}
          />
        </div>
        <div style={{ display: "flex", flexDirection: "row", width: "100%" }}>
          <div style={{ marginRight: 20, flexGrow: 1 }}>
            <textarea
              style={{ height: "100%", width: "100%" }}
              value={tempString}
              onChange={handleChange}
            />
          </div>
          <div dangerouslySetInnerHTML={{ __html: tempStringToShow }} />
        </div>
      </div>
    </div>
  );
};

export default BillManagement;
