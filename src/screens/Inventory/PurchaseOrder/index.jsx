import { Button, Col, DatePicker, Input, message, Row, Table } from "antd";
import React, { Fragment, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BUTTON_SIZE, INPUT_SIZE } from "../../../common/ThemeConstants";
import BasicFormComponent from "../../../components/formComponent/BasicFormComponent";
import FormButton from "../../../components/general/FormButton";
import FormSelect from "../../../components/general/FormSelect";
import FormTextField from "../../../components/general/FormTextField";
import {
  deleteRow,
  resetState,
  setFormFieldValue,
  setInitialState,
  setSearchFieldValue,
  submitForm,
} from "../../../redux/actions/basicFormAction";
import {
  SET_SUPPORTING_TABLE,
  UPDATE_FORM_FIELD,
} from "../../../redux/reduxConstants";
import FormCheckbox from "../../../components/general/FormCheckbox";
import { CloseOutlined } from "@ant-design/icons";
import { postRequest } from "../../../services/mainApp.service";
import ComponentToPrint from "../../../components/specificComponents/ComponentToPrint";
import { html, HTMLChunk } from "./poHtmlReportTemplate.js";

const initialFormValues = {
  VendorId: null,
  BranchId: null,
  IsSubmit: false,
  PONumber: "",
  POId: null,
  PODetail: [],
  // Date: new Date(Date.now()),
  Date: null,
  RequisitionId: null,
  IsRequisition: false,
};

const initialSearchValues = {
  VendorId: null,
  BranchId: null,
  IsSubmit: false,
  PONumber: "",
  POId: null,
  PODetail: [],
  // Date: new Date(Date.now()),
  Date: null,
  RequisitionId: null,
  IsRequisition: false,
};

const columns = [
  {
    title: "PO Number",
    dataIndex: "PONumber",
    key: "PONumber",
  },
  {
    title: "Branch Name",
    dataIndex: "BranchName",
    key: "BranchName",
  },
  {
    title: "Vendor Name",
    dataIndex: "VendorName",
    key: "VendorName",
  },
  {
    title: "Date",
    key: "Date",
    render: (_, record) => {
      // record.Date.split(":")[0]
      return <div>{record.Date?.split("T")[0]}</div>;
    },
  },
  {
    title: "Is Submit",
    key: "IsSubmit",
    render: (_, record) => {
      // record.Date.split(":")[0]
      return <div>{record.IsSubmit === true ? "Submitted" : ""}</div>;
    },
  },
];

const PurchaseOrder = () => {
  const dispatch = useDispatch();
  const controller = new window.AbortController();
  const userData = useSelector((state) => state.authReducer);
  const [updateId, setUpdateId] = useState(null);
  const [PODetail, setPODetail] = useState([]);
  const [date, setDate] = useState(new Date());
  const componentRefPrint = useRef();
  const [htmlReport, setHtmlReport] = useState("");

  const [POObj, setPOObj] = useState({
    ProductDetailId: null,
    RequisitionDetailId: null,
    PurchaseUnitPrice: 0,
    SubTotal: 0,
    TaxAmount: 0,
    Discount: 0,
    NetAmount: 0,
    BatchId: null,
    PurchaseQuantity: 0,
    IssueQuantity: 0,
    ConsumeQuantity: 0,
    PurchaseUnitId: null,
    PurchaseUnitName: "",
    IssueUnitId: null,
    ConsumeUnitId: null,
    ProductSizeName: "",
    IsRequisition: false,
    CategoryId: null,
    ProductId: null,
    Barcode: "",
  });

  const {
    formFields,
    searchFields,
    itemList,
    formLoading,
    tableLoading,
    supportingTable,
  } = useSelector((state) => state.basicFormReducer);

  const handlePODetailChnage = (event, record, name) => {
    const poDetailArr = PODetail;
    const index = poDetailArr.findIndex(
      (x) => x.ProductDetailId === record.ProductDetailId
    );
    if (index > -1) {
      let poDet = poDetailArr[index];
      poDet[name] = event.target.value;
      poDetailArr[index] = poDet;
      if (
        poDet[name] !== 0 &&
        poDet[name] !== "" &&
        name === "PurchaseQuantity"
      ) {
        const subTotal = poDet.PurchaseQuantity * poDet.PurchaseUnitPrice;
        poDet.SubTotal = subTotal !== NaN ? subTotal : 0;
        const netAmount = poDet.SubTotal + poDet.TaxAmount - poDet.Discount;
        poDet.NetAmount = netAmount !== NaN ? netAmount : 0;
        poDetailArr[index] = poDet;
        setPODetail([...poDetailArr]);
      } else if (
        poDet.PurchaseUnitPrice !== 0 &&
        poDet.PurchaseUnitPrice !== "" &&
        name === "PurchaseUnitPrice"
      ) {
        const subTotal = poDet.PurchaseQuantity * poDet.PurchaseUnitPrice;
        poDet.SubTotal = subTotal !== NaN ? subTotal : 0;
        const netAmount = poDet.SubTotal + poDet.TaxAmount - poDet.Discount;
        poDet.NetAmount = netAmount !== NaN ? netAmount : 0;
        poDetailArr[index] = poDet;
        setPODetail([...poDetailArr]);
      } else {
        setPODetail([...poDetailArr]);
      }
    }
  };

  const columnsPODetail = [
    {
      title: "Product",
      dataIndex: "ProductSizeName",
      key: "ProductSizeName",
    },
    {
      title: "Purchase Unit",
      dataIndex: "PurchaseUnitName",
      key: "PurchaseUnitName",
    },
    {
      title: "Purchase Quantity",
      key: "PurchaseQuantity",
      render: (_, record) => {
        return (
          <Input
            value={record.PurchaseQuantity}
            onChange={(event) =>
              handlePODetailChnage(event, record, "PurchaseQuantity")
            }
            onBlur={() => {}}
            type="number"
            disabled={formFields?.IsSubmit === true ? true : false}
            min={1}
            onKeyPress={(e) => {
              if (
                e.code === "Minus" ||
                e.code === "NumpadSubtract" ||
                e.code === "NumpadAdd"
              ) {
                e.preventDefault();
              }
            }}
          />
        );
      },
    },
    {
      title: "Unit Price",
      key: "PurchaseUnitPrice",
      render: (_, record) => {
        return (
          <Input
            value={record.PurchaseUnitPrice}
            onChange={(event) =>
              handlePODetailChnage(event, record, "PurchaseUnitPrice")
            }
            onBlur={() => {}}
            type="number"
            disabled={formFields?.IsSubmit === true ? true : false}
            min={1}
            step="any"
            onKeyPress={(e) => {
              if (
                e.code === "Minus" ||
                e.code === "NumpadSubtract" ||
                e.code === "NumpadAdd"
              ) {
                e.preventDefault();
              }
            }}
          />
        );
      },
    },
    {
      title: "Sub Total",
      key: "SubTotal",
      render: (_, record) => {
        return <div>{parseFloat(record.SubTotal).toFixed(2)}</div>;
      },
    },
    {
      title: "Remaining Quantity",
      key: "PORemainingQuantity",
      render: (_, record) => {
        return record.PORemainingQuantity;
      },
    },
    {
      title: "Tax Amount",
      key: "TaxAmount",
      render: (_, record) => {
        return (
          <Input
            value={record.TaxAmount}
            onChange={(event) =>
              handlePODetailChnage(event, record, "TaxAmount")
            }
            onBlur={() => {
              const PODetailArr = PODetail;
              const index = PODetailArr.findIndex(
                (x) => x.ProductDetailId === record.ProductDetailId
              );
              let poDet = PODetailArr[index];
              if (poDet.TaxAmount == "") poDet.TaxAmount = 0;
              if (poDet.PurchaseQuantity == "") poDet.PurchaseQuantity = 0;
              if (poDet.PurchaseUnitPrice == "") poDet.PurchaseUnitPrice = 0;
              const subTotal =
                parseInt(poDet.PurchaseQuantity) *
                parseInt(poDet.PurchaseUnitPrice);
              poDet.SubTotal = subTotal;
              const netAmount =
                parseInt(poDet.SubTotal) +
                parseInt(poDet.TaxAmount) -
                parseInt(poDet.Discount);
              poDet.NetAmount = netAmount;
              PODetailArr[index] = poDet;
              setPODetail([...PODetailArr]);
            }}
            type="number"
            disabled={formFields?.IsSubmit === true ? true : false}
            min="0"
            onKeyPress={(e) => {
              if (
                e.code === "Minus" ||
                e.code === "NumpadSubtract" ||
                e.code === "NumpadAdd"
              ) {
                e.preventDefault();
              }
            }}
          />
        );
      },
    },
    {
      title: "Discount",
      key: "Discount",
      render: (_, record) => {
        return (
          <Input
            value={record.Discount}
            onChange={(event) =>
              handlePODetailChnage(event, record, "Discount")
            }
            onBlur={() => {
              const PODetailArr = PODetail;
              const index = PODetailArr.findIndex(
                (x) => x.ProductDetailId === record.ProductDetailId
              );

              let poDet = PODetailArr[index];
              if (poDet.Discount == "") poDet.Discount = 0;
              const subTotal =
                parseInt(poDet.PurchaseQuantity) *
                parseInt(poDet.PurchaseUnitPrice);
              poDet.SubTotal = subTotal;
              const netAmount =
                parseInt(poDet.SubTotal) +
                parseInt(poDet.TaxAmount) -
                parseInt(poDet.Discount);
              poDet.NetAmount = netAmount;
              PODetailArr[index] = poDet;
              setPODetail([...PODetailArr]);
            }}
            type="number"
            disabled={formFields?.IsSubmit === true ? true : false}
            min="0"
            onKeyPress={(e) => {
              if (
                e.code === "Minus" ||
                e.code === "NumpadSubtract" ||
                e.code === "NumpadAdd"
              ) {
                e.preventDefault();
              }
            }}
          />
        );
      },
    },
    {
      title: "Net Amount",
      key: "NetAmount",
      render: (_, record) => {
        return <div>{parseFloat(record.NetAmount).toFixed(2)}</div>;
      },
    },
    {
      title: "Delete",
      dataIndex: "delete",
      render: (_, record, index) => {
        return (
          <Button
            disabled={formFields?.IsSubmit === true ? true : false}
            icon={<CloseOutlined />}
            onClick={() => removePoDetail(record, index)}
          />
        );
      },
    },
  ];

  useEffect(() => {
    if (POObj.PurchaseQuantity !== 0 || POObj.PurchaseQuantity !== "") {
      const subTotal = POObj.PurchaseQuantity * POObj.PurchaseUnitPrice;
      setPOObj({ ...POObj, SubTotal: subTotal, NetAmount: subTotal });
    }
  }, [POObj.PurchaseQuantity, POObj.PurchaseUnitPrice]);

  useEffect(() => {
    dispatch(
      setInitialState(
        "/CrudPO",
        {
          ...initialFormValues,
          PONumber: "%%",
          Date: searchFields.Date,
          PODetail: [],
        },
        initialFormValues,
        initialSearchValues,
        controller,
        userData
      )
    );

    return () => {
      controller.abort();
      dispatch(resetState());
    };
  }, []);

  useEffect(() => {
    if (updateId !== null) {
      let editObj = itemList.filter((item) => item.POId === updateId)[0];
      dispatch({
        type: UPDATE_FORM_FIELD,
        payload: { ...editObj, Date: editObj.Date.split("T")[0] },
      });
      // dispatch({
      //   type: UPDATE_FORM_FIELD,
      //   payload: itemList.filter((item) => item.POId === updateId)[0],
      // });
      // const Datee = new Date();
      // const finalDatee =
      //   Datee.getFullYear() +
      //   "-" +
      //   (Datee.getMonth() + 1) +
      //   "-" +
      //   Datee.getDate() +
      //   " " +
      //   "00:00:00.000";
      postRequest(
        "/CrudPO",
        {
          ...initialFormValues,
          Date: formFields.Date,
          PODetail: [],
          POId: updateId,
          OperationId: 5,
          CompanyId: userData.CompanyId,
          UserId: userData.UserId,
          UserIP: "1.2.2.1",
        },
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

        setPODetail([...response.data.DataSet.Table]);
      });
    }
    setUpdateId(null);
  }, [updateId]);

  const handleSearchChange = (data) => {
    dispatch(setSearchFieldValue(data));
  };

  const viewReport = (record, handlePrint) => {
    postRequest(
      "/podetailreport",
      {
        POId: record.POId,
        BranchId: record.BranchId,
        DateFrom: record.Date.split("T")[0],
        DateTo: record.Date.split("T")[0],
      },
      controller
    ).then((res) => {
      const htmlBody = HTMLChunk({
        detail: res.data.DataSet.Table1,
      });
      const report = html({
        DATE_FROM: record.Date.split("T")[0],
        DATE_TO: record.Date.split("T")[0],
        vendorName: record.VendorName,
        master: res.data.DataSet.Table[0],
        body: htmlBody,
      });
      const setReport = new Promise((resolutionFunc, rejectionFunc) => {
        setHtmlReport(report);
        resolutionFunc("Resolved");
      });
      setReport.then(() => {
        handlePrint();
      });
    });
  };

  const handleFormChange = (data) => {
    // if (data.name === "VendorId") {
    //     setPODetail([]);
    //     dispatch(setFormFieldValue({ name: "RequisitionId", value: null }));
    // }

    if (data.name === "IsRequisition") {
      setPODetail([]);
      dispatch(setFormFieldValue({ name: "RequisitionId", value: null }));
      dispatch(setFormFieldValue({ name: "VendorId", value: null }));
      dispatch(setFormFieldValue({ name: "BranchId", value: null }));
    }
    if (data.name === "RequisitionId") {
      if (formFields.BranchId === null) {
        message.error("Select Branch!");
        return;
      }

      if (formFields.VendorId === null) {
        message.error("Select Vendor!");
        return;
      }

      const Datee = new Date();
      const finalDatee =
        Datee.getFullYear() +
        "-" +
        (Datee.getMonth() + 1) +
        "-" +
        Datee.getDate() +
        " " +
        "00:00:00.000";
      postRequest(
        "/CrudPO",
        {
          ...initialFormValues,
          Date: finalDatee,
          PODetail: [],
          RequisitionId: data.value,
          OperationId: 6,
          CompanyId: userData.CompanyId,
          UserId: userData.UserId,
          UserIP: "1.2.2.1",
          POId: null,
        },
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

        const filteredTable = response.data.DataSet.Table.map((e) => {
          return {
            ...e,
            SubTotal: 0,
            NetAmount: 0,
            PurchaseUnitPrice: 0,
            TaxAmount: 0,
            Discount: 0,
          };
        });

        setPODetail([...filteredTable]);
      });
    }
    dispatch(setFormFieldValue(data));
  };

  const handlePoObjChange = (data) => {
    if (data.name === "CategoryId" && data.value === null) {
      setPOObj({
        ProductDetailId: null,
        CategoryId: null,
        ProductId: null,
        Barcode: "",
      });
    } else if (data.name === "ProductId" && data.value === null) {
      setPOObj({
        ProductDetailId: null,
        ProductId: null,
        Barcode: "",
      });
    } else if (data.name === "ProductDetailId") {
      const PD = supportingTable.Table5.filter(
        (e) => e.ProductDetailId === data.value
      )[0];
      setPOObj({
        ...POObj,
        PurchaseUnitId: PD.PurchaseUnitId,
        PurchaseUnitName: PD.PurchaseUnitName,
        ProductSizeName: PD.ProductSizeName,
        [data.name]: data.value,
      });
    } else {
      setPOObj({ ...POObj, [data.name]: data.value });
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();

    dispatch(
      setInitialState(
        "/CrudPO",
        {
          ...searchFields,
          PONumber: `%${searchFields.PONumber}%`,
        },
        initialFormValues,
        searchFields,
        controller,
        userData
      )
    );
  };

  const handlePOOptionAdd = () => {
    if (formFields.BranchId === null) {
      message.error("Select Branch!");
      return;
    }

    if (formFields.VendorId === null) {
      message.error("Select Vendor!");
      return;
    }

    if (POObj.Barcode !== "") {
      const filterClosing = PODetail.filter((e) => e.Barcode === POObj.Barcode);
      if (filterClosing.length === 0) {
        const productDetail = [];
        supportingTable.Table5.forEach((ob) => {
          if (
            ob.Barcode === POObj.Barcode &&
            ob.BranchIds.includes(formFields.BranchId.toString())
          ) {
            productDetail.push({
              ...ob,
              PurchaseQuantity: 0,
              PurchaseUnitPrice: 0,
              TaxAmount: 0,
              Discount: 0,
              SubTotal: 0,
              NetAmount: 0,
            });
          }
        });
        if (productDetail.length === 0) {
          message.error("Inventory items not found!");
          return;
        }
        setPODetail([...PODetail, ...productDetail]);
        setPOObj({
          ProductDetailId: null,
          ProductId: null,
          CategoryId: null,
          Barcode: "",
        });
      } else {
        message.error("Item Already Exist");
      }
    } else {
      if (
        POObj.ProductDetailId !== null &&
        POObj.ProductId !== null &&
        POObj.CategoryId !== null
      ) {
        const filterClosing = PODetail.filter(
          (e) => e.ProductDetailId === POObj.ProductDetailId
        );
        if (filterClosing.length === 0) {
          const productDetail = [];
          supportingTable.Table5.forEach((ob) => {
            if (
              ob.ProductDetailId === POObj.ProductDetailId &&
              ob.BranchIds.includes(formFields.BranchId.toString())
            ) {
              productDetail.push({
                ...ob,
                PurchaseQuantity: 0,
                PurchaseUnitPrice: 0,
                TaxAmount: 0,
                Discount: 0,
                SubTotal: 0,
                NetAmount: 0,
              });
            }
          });
          if (productDetail.length === 0) {
            message.error("Inventory items not found!");
            return;
          }
          setPODetail([...PODetail, ...productDetail]);
          setPOObj({
            ProductDetailId: null,
            ProductId: null,
            CategoryId: null,
            Barcode: "",
          });
        } else {
          message.error("Item Already Exist");
        }
      } else if (POObj.CategoryId !== null && POObj.ProductId !== null) {
        const filterClosing = PODetail.filter(
          (e) => e.ProductId === POObj.ProductId
        );
        if (filterClosing.length === 0) {
          const productDetail = [];
          supportingTable.Table5.forEach((ob) => {
            if (
              ob.ProductId === POObj.ProductId &&
              ob.BranchId === formFields.BranchId
            ) {
              productDetail.push({
                ...ob,
                PurchaseQuantity: 0,
                PurchaseUnitPrice: 0,
                TaxAmount: 0,
                Discount: 0,
                SubTotal: 0,
                NetAmount: 0,
              });
            }
          });
          if (productDetail.length === 0) {
            message.error("Inventory items not found!");
            return;
          }
          setPODetail([...PODetail, ...productDetail]);
          setPOObj({
            ProductDetailId: null,
            ProductId: null,
            CategoryId: null,
            Barcode: "",
          });
        } else {
          message.error("Item Already Exist");
        }
      } else if (POObj.CategoryId !== null) {
        const filterClosing = PODetail.filter(
          (e) => e.CategoryId === POObj.CategoryId
        );
        if (filterClosing.length === 0) {
          const productDetail = [];
          supportingTable.Table5.forEach((ob) => {
            if (
              ob.CategoryId === POObj.CategoryId &&
              ob.BranchId === formFields.BranchId
            ) {
              productDetail.push({
                ...ob,
                PurchaseQuantity: 0,
                PurchaseUnitPrice: 0,
                TaxAmount: 0,
                Discount: 0,
                SubTotal: 0,
                NetAmount: 0,
              });
            }
          });
          if (productDetail.length === 0) {
            message.error("Inventory items not found!");
            return;
          }
          setPODetail([...PODetail, ...productDetail]);
          setPOObj({
            ProductDetailId: null,
            ProductId: null,
            CategoryId: null,
            Barcode: "",
          });
        } else {
          message.error("Item Already Exist");
        }
      } else {
        message.error("Fill all the required fields!");
      }
    }
  };

  const closeForm = () => {
    setPODetail([]);
    setPOObj({
      ProductDetailId: null,
      RequisitionDetailId: null,
      PurchaseUnitPrice: 0,
      SubTotal: 0,
      TaxAmount: 0,
      Discount: 0,
      NetAmount: 0,
      BatchId: null,
      PurchaseQuantity: 0,
      IssueQuantity: 0,
      ConsumeQuantity: 0,
      PurchaseUnitId: null,
      PurchaseUnitName: "",
      IssueUnitId: null,
      ConsumeUnitId: null,
      ProductSizeName: "",
      IsRequisition: false,
      CategoryId: null,
      ProductId: null,
      Barcode: "",
    });
  };

  const handleDeleteRow = (id, record) => {
    if (record.IsSubmit === false) {
      dispatch(
        deleteRow(
          "/CrudPO",
          {
            ...initialFormValues,
            POId: id,
            Date: date,
            PODetail: [],
          },
          controller,
          userData
        )
      );
    } else {
      message.error("Record cant be deleted!");
    }
  };

  const removePoDetail = (record, index) => {
    let arr = PODetail;
    arr.splice(index, 1);
    setPODetail([...arr]);
  };

  const handleFormSubmit = (e, id, submit, closeForm) => {
    e.preventDefault();
    if (formFields.BranchId === null) {
      message.error("Select Branch!");
      return;
    }
    const formFieldsClone = { ...formFields };
    formFieldsClone.IsSubmit = submit;

    if (formFieldsClone.IsRequisition === true) {
      const length = PODetail.filter((e) => e.PORemainingQuantity === 0);
      if (length > 0) {
        message.error("Please remove highlited items");
        return;
      }
    }

    if (date === " 00:00:00.000") {
      message.error("Date cant be empty");
      return;
    }

    if (PODetail.length === 0) {
      message.error("Purchase order detail is required!");
      return;
    }
    dispatch(
      submitForm(
        "/CrudPO",
        { ...formFieldsClone, PODetail: PODetail },
        initialFormValues,
        controller,
        userData,
        id,
        (tables) => {
          delete tables.Table;
          const tablesToSet = {
            Table1: tables.Table2,
            Table2: tables.Table3,
            Table3: tables.Table4,
            Table4: tables.Table5,
            Table5: tables.Table6,
            Table6: tables.Table7,
            Table7: tables.Table8,
            Table8: tables.Table9,
          };
          dispatch({ type: SET_SUPPORTING_TABLE, payload: tablesToSet });
          closeForm();
        }
      )
    );
    closeForm();
  };

  const searchPanel = (
    <Fragment>
      <FormTextField
        colSpan={4}
        label="PO Number"
        name="PONumber"
        size={INPUT_SIZE}
        value={searchFields.PONumber}
        onChange={handleSearchChange}
      />

      <FormSelect
        colSpan={6}
        listItem={supportingTable.Table1}
        idName="BranchId"
        valueName="BranchName"
        size={INPUT_SIZE}
        name="BranchId"
        label="Branch"
        value={searchFields.BranchId || ""}
        onChange={handleSearchChange}
      />

      <FormTextField
        colSpan={4}
        label="Purchase Order Date"
        type="date"
        name="Date"
        size={INPUT_SIZE}
        value={searchFields.Date}
        onChange={handleSearchChange}
      />
    </Fragment>
  );

  const formPanel = (
    <Fragment>
      <FormTextField
        colSpan={6}
        label="PO"
        name="PONumber"
        size={INPUT_SIZE}
        value={formFields.PONumber}
        onChange={handleFormChange}
        disabled={true}
      />
      <FormSelect
        colSpan={6}
        listItem={supportingTable.Table1}
        idName="BranchId"
        valueName="BranchName"
        size={INPUT_SIZE}
        name="BranchId"
        label="Branch"
        value={formFields.BranchId || ""}
        onChange={handleFormChange}
        required={true}
        disabled={
          formFields?.IsSubmit === true
            ? true
            : PODetail.length > 0
            ? true
            : false
        }
      />
      <FormSelect
        colSpan={6}
        listItem={supportingTable.Table2}
        idName="VendorId"
        valueName="VendorName"
        size={INPUT_SIZE}
        name="VendorId"
        label="Vendor"
        value={formFields.VendorId || ""}
        onChange={handleFormChange}
        required={true}
        disabled={formFields?.IsSubmit === true ? true : false}
      />
      <FormSelect
        colSpan={6}
        listItem={supportingTable.Table8?.filter(
          (e) => e.BranchId === formFields.BranchId
        )}
        idName="RequisitionId"
        valueName="RequisitionNumber"
        size={INPUT_SIZE}
        name="RequisitionId"
        label="Requisition"
        value={formFields.RequisitionId || ""}
        onChange={handleFormChange}
        disabled={
          formFields?.IsSubmit === true ? true : !formFields.IsRequisition
        }
        required={formFields.IsPo}
      />
      {/* <Col span={6}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
          }}
        >
          <label>Date</label>
          <DatePicker
            style={{ width: "100%" }}
            value={
              formFields.Date === ""
                ? moment(new Date(), "YYYY/MM/DD")
                : moment(formFields.Date)
            }
            onChange={(date, dateString) => {
              setDate(dateString + " " + "00:00:00.000");
              handleFormChange({ name: "Date", value: dateString });
            }}
            disabled={formFields?.IsSubmit === true ? true : false}
            allowClear={false}
          />
        </div>
      </Col> */}

      <FormTextField
        colSpan={4}
        label="Purchase Order Date"
        type="date"
        name="Date"
        size={INPUT_SIZE}
        value={formFields.Date}
        onChange={handleFormChange}
        required={true}
        disabled={formFields?.IsSubmit === true ? true : false}
      />
      <FormCheckbox
        label={"Receiving by Requisition"}
        checked={formFields.IsRequisition}
        onChange={handleFormChange}
        name="IsRequisition"
        disabled={formFields?.IsSubmit === true ? true : false}
      />
      {formFields.IsRequisition === false && (
        <Col span={24}>
          <b style={{ fontSize: 16 }}>Search</b>
          <Row gutter={[8, 8]}>
            <FormSelect
              colSpan={6}
              listItem={supportingTable.Table3}
              idName="CategoryId"
              valueName="CategoryName"
              size={INPUT_SIZE}
              name="CategoryId"
              label="Category"
              value={POObj.CategoryId || ""}
              onChange={handlePoObjChange}
              disabled={formFields?.IsSubmit === true ? true : false}
            />
            <FormSelect
              colSpan={6}
              listItem={
                (formFields.CategoryId !== null &&
                  supportingTable.Table4?.filter(
                    (e) => e.ProductCategoryId === POObj.CategoryId
                  )) ||
                []
              }
              idName="ProductId"
              valueName="ProductName"
              size={INPUT_SIZE}
              name="ProductId"
              label="Product"
              value={POObj.ProductId || ""}
              onChange={handlePoObjChange}
              disabled={formFields?.IsSubmit === true ? true : false}
            />
            <FormSelect
              colSpan={6}
              listItem={
                (formFields.ProductId !== null &&
                  supportingTable.Table5?.filter(
                    (e) => e.ProductId === POObj.ProductId
                  )) ||
                []
              }
              idName="ProductDetailId"
              valueName="ProductSizeName"
              size={INPUT_SIZE}
              name="ProductDetailId"
              label="Product Detail"
              value={POObj.ProductDetailId || ""}
              onChange={handlePoObjChange}
              disabled={formFields?.IsSubmit === true ? true : false}
            />
            <FormTextField
              colSpan={6}
              label="Barcode"
              name="Barcode"
              size={INPUT_SIZE}
              value={POObj.Barcode}
              onChange={handlePoObjChange}
              disabled={formFields?.IsSubmit === true ? true : false}
            />
            <FormButton
              colSpan={6}
              title="Add"
              type="primary"
              size={BUTTON_SIZE}
              colStyle={{ display: "flex", alignItems: "flex-end" }}
              onClick={handlePOOptionAdd}
              disabled={formFields?.IsSubmit === true ? true : false}
            />
          </Row>
        </Col>
      )}
      <Col span={24}>
        <Table
          rowClassName={(record, index) =>
            formFields?.IsSubmit === true
              ? "table-row-dark"
              : record.PORemainingQuantity === 0
              ? "table-row-light"
              : "table-row-dark"
          }
          columns={
            formFields.IsRequisition === false
              ? columnsPODetail.filter(
                  (col) => col.key !== "PORemainingQuantity"
                )
              : columnsPODetail
          }
          rowKey={(e, i) => i}
          dataSource={PODetail}
        />
      </Col>
    </Fragment>
  );

  return (
    <Fragment>
      <BasicFormComponent
        formTitle="Purchase Order"
        searchPanel={searchPanel}
        formPanel={formPanel}
        searchSubmit={handleSearchSubmit}
        onFormSave={handleFormSubmit}
        tableRows={itemList}
        tableLoading={tableLoading}
        formLoading={formLoading}
        tableColumn={columns}
        deleteRow={handleDeleteRow}
        actionID="POId"
        editRow={setUpdateId}
        fields={initialFormValues}
        crudTitle="Purchase Order"
        formWidth="70vw"
        showSubmit={true}
        onFormClose={closeForm}
        disableSaveAndSubmit={formFields.IsSubmit === true ? true : false}
        report={true}
        viewReport={viewReport}
        componentRefPrint={componentRefPrint}
      />

      <div style={{ display: "none" }}>
        <ComponentToPrint ref={componentRefPrint} Bill={htmlReport} />
      </div>
    </Fragment>
  );
};

export default PurchaseOrder;
