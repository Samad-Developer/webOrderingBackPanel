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
import moment from "moment";
import FormCheckbox from "../../../components/general/FormCheckbox";
import { CloseOutlined, CloudDownloadOutlined } from "@ant-design/icons";
import {
  postImageRequest,
  postRequest,
} from "../../../services/mainApp.service";
import { HTMLChunk, html } from "./grnHtmlReportTemplate";
import "../Grn/styles.css";
import {
  formatDateFunction,
  getDate,
  getDateYear,
} from "../../../functions/dateFunctions";
import ComponentToPrint from "../../../components/specificComponents/ComponentToPrint";
import { GRN_BULK_FILE_NAME } from "../../../common/SetupMasterEnum";
import FormSearchSelect from "../../../components/general/FormSearchSelect";

const initialFormValues = {
  VendorId: null,
  BranchId: null,
  IsSubmit: false,
  GRNNumber: "%%",
  GoodReceivingId: null,
  IsPo: false,
  GrnDetail: [],
  Date: "",
  POId: null,
  IsExcel: false,
};

const initialSearchValues = {
  VendorId: null,
  BranchId: null,
  IsSubmit: false,
  GRNNumber: "",
  GoodReceivingId: null,
  IsPo: false,
  GrnDetail: [],
  Date: "",
  POId: null,
};

const columns = [
  {
    title: "GRN Number",
    dataIndex: "GoodReceivingNumber",
    key: "GoodReceivingNumber",
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

const Grn = () => {
  const dispatch = useDispatch();
  const controller = new window.AbortController();
  const userData = useSelector((state) => state.authReducer);
  const componentRefPrint = useRef();
  const todayDate = new Date(Date.now());
  const [htmlReport, setHtmlReport] = useState("");
  const customDate = (
    todayDate.getFullYear() +
    "-" +
    todayDate.getMonth() +
    1 +
    "-" +
    todayDate.getDate()
  ).toString();

  const [updateId, setUpdateId] = useState(null);

  const [GrnDetail, setGrnDetail] = useState([]);

  const [date, setDate] = useState("");

  const [GrnObj, setGrnObj] = useState({
    ProductDetailId: null,
    PurchaseOrderDetailId: null,
    PurchaseUnitPrice: 0,
    CategoryId: null,
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
    IsPo: false,
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

  const handleGrnDetailChnage = (event, record, name) => {
    const grnDetailArr = GrnDetail;
    const index = grnDetailArr.findIndex(
      (x) => x.ProductDetailId === record.ProductDetailId
    );
    if (index > -1) {
      let grnDet = grnDetailArr[index];
      if (name === "BatchId") {
        grnDet[name] = event.value;
        grnDetailArr[index] = grnDet;
      } else if (name === "PurchaseQuantity") {
        if (
          record.GRNRemainingQuantity !== undefined &&
          record.GRNRemainingQuantity !== null
        ) {
          if (
            parseInt(event.target.value) <=
            parseInt(record.GRNRemainingQuantity)
          ) {
            grnDet[name] = event.target.value;
            grnDetailArr[index] = grnDet;
          }
        } else {
          grnDet[name] = event.target.value;
          grnDetailArr[index] = grnDet;
        }
      } else {
        grnDet[name] = event.target.value;
        grnDetailArr[index] = grnDet;
      }
      if (
        grnDet[name] !== 0 &&
        grnDet[name] !== "" &&
        name === "PurchaseQuantity"
      ) {
        const subTotal = grnDet.PurchaseQuantity * grnDet.PurchaseUnitPrice;
        grnDet.SubTotal = subTotal !== NaN ? subTotal : 0;
        const netAmount = grnDet.SubTotal + grnDet.TaxAmount - grnDet.Discount;
        grnDet.NetAmount = netAmount !== NaN ? netAmount : 0;
        grnDetailArr[index] = grnDet;
        setGrnDetail([...grnDetailArr]);
      } else if (
        grnDet.PurchaseUnitPrice !== 0 &&
        grnDet.PurchaseUnitPrice !== "" &&
        name === "PurchaseUnitPrice"
      ) {
        const subTotal = grnDet.PurchaseQuantity * grnDet.PurchaseUnitPrice;
        grnDet.SubTotal = subTotal !== NaN ? subTotal : 0;
        const netAmount = grnDet.SubTotal + grnDet.TaxAmount - grnDet.Discount;
        grnDet.NetAmount = netAmount !== NaN ? netAmount : 0;
        grnDetailArr[index] = grnDet;
        setGrnDetail([...grnDetailArr]);
      } else {
        setGrnDetail([...grnDetailArr]);
      }
    }
  };
  const viewReport = (record, handlePrint) => {
    postRequest(
      "/grndetailreport",
      {
        GRNId: record.GoodReceivingId,
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
        master: res.data.DataSet.Table[0],
        body: htmlBody,
        vendorName: record.VendorName,
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

  const columnsGrnDetail = [
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
            required={true}
            value={record.PurchaseQuantity}
            onChange={(event) => {
              if (event.target.value >= 0 || event.target.value === "")
                handleGrnDetailChnage(event, record, "PurchaseQuantity");
              else return;
            }}
            isNumber="true"
            disabled={formFields?.IsSubmit === true ? true : false}
            min={1}
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
            required={true}
            value={record.PurchaseUnitPrice}
            onChange={(event) => {
              if (event.target.value >= 0 || event.target.value === "")
                handleGrnDetailChnage(event, record, "PurchaseUnitPrice");
              else return;
            }}
            isNumber="true"
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
      title: "Sub Total",
      key: "SubTotal",
      render: (_, record) => {
        return <div>{record.SubTotal}</div>;
      },
    },
    {
      title: "Remaining Quantity",
      key: "GRNRemainingQuantity",
      render: (_, record) => {
        return record.GRNRemainingQuantity;
      },
    },
    {
      title: "Stock Quantity",
      dataIndex: "StockQuantity",
      key: "StockQuantity",
    },
    {
      title: "Tax Amount",
      key: "TaxAmount",
      render: (_, record) => {
        return (
          <Input
            required={true}
            value={record.TaxAmount}
            onChange={(event) => {
              if (event.target.value >= 0 || event.target.value === "")
                handleGrnDetailChnage(event, record, "TaxAmount");
              else return;
            }}
            isNumber="true"
            onBlur={() => {
              const grnDetailArr = GrnDetail;
              const index = grnDetailArr.findIndex(
                (x) => x.ProductDetailId === record.ProductDetailId
              );

              let grnDet = grnDetailArr[index];
              const subTotal =
                parseInt(grnDet.PurchaseQuantity) *
                parseInt(grnDet.PurchaseUnitPrice);
              grnDet.SubTotal = Number.isNaN(subTotal) === true ? 0 : subTotal;
              const netAmount =
                parseInt(grnDet.SubTotal) +
                parseInt(grnDet.TaxAmount) -
                parseInt(grnDet.Discount);

              grnDet.NetAmount =
                Number.isNaN(netAmount) === true ? 0 : netAmount;
              grnDetailArr[index] = grnDet;
              setGrnDetail([...grnDetailArr]);
            }}
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
            required={true}
            value={record.Discount}
            onChange={(event) => {
              if (event.target.value >= 0 || event.target.value === "")
                handleGrnDetailChnage(event, record, "Discount");
              else return;
            }}
            isNumber="true"
            onBlur={() => {
              const grnDetailArr = GrnDetail;
              const index = grnDetailArr.findIndex(
                (x) => x.ProductDetailId === record.ProductDetailId
              );

              let grnDet = grnDetailArr[index];
              const subTotal =
                parseInt(grnDet.PurchaseQuantity) *
                parseInt(grnDet.PurchaseUnitPrice);
              grnDet.SubTotal = Number.isNaN(subTotal) === true ? 0 : subTotal;
              const netAmount =
                parseInt(grnDet.SubTotal) +
                parseInt(grnDet.TaxAmount) -
                parseInt(grnDet.Discount);
              grnDet.NetAmount =
                Number.isNaN(netAmount) === true ? 0 : netAmount;
              grnDetailArr[index] = grnDet;
              setGrnDetail([...grnDetailArr]);
            }}
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
        return <div>{record.NetAmount}</div>;
      },
    },
    {
      title: "Manufacture Date",
      key: "ManufactureDate",
      render: (_, record) => {
        return (
          <div>
            <Input
              colSpan={4}
              size={INPUT_SIZE}
              value={record.ManufactureDate}
              onChange={(event) =>
                handleGrnDetailChnage(event, record, "ManufactureDate")
              }
              type="date"
              max={customDate.toString()}
              disabled={formFields?.IsSubmit === true ? true : false}
            />
          </div>
        );
      },
    },
    {
      title: "Expiry Date",
      key: "ExpiryDate",
      render: (_, record) => {
        return (
          <div>
            <Input
              colSpan={2}
              size={INPUT_SIZE}
              value={record.ExpiryDate}
              onChange={(event) =>
                handleGrnDetailChnage(event, record, "ExpiryDate")
              }
              required={record.IsExpiryMandatory}
              type="date"
              // min={customDate.toString()}
              disabled={formFields?.IsSubmit === true ? true : false}
            />
          </div>
        );
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
            onClick={() => removeGrnDetail(record, index)}
          />
        );
      },
    },
  ];

  useEffect(() => {
    if (GrnObj.PurchaseQuantity !== 0 || GrnObj.PurchaseQuantity !== "") {
      const subTotal = GrnObj.PurchaseQuantity * GrnObj.PurchaseUnitPrice;
      setGrnObj({ ...GrnObj, SubTotal: subTotal, NetAmount: subTotal });
    }
  }, [GrnObj.PurchaseQuantity, GrnObj.PurchaseUnitPrice]);

  useEffect(() => {
    setDate("");
    dispatch(
      setInitialState(
        "/CrudGrn",
        { ...initialFormValues, GrnDetail: [] },
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
      dispatch({
        type: UPDATE_FORM_FIELD,
        payload: {
          ...itemList.find((item) => item.GoodReceivingId === updateId),
          IsExcel: false,
        },
      });

      postRequest(
        "/CrudGrn",
        {
          ...initialFormValues,
          GoodReceivingId: updateId,
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

        setGrnDetail(
          response?.data?.DataSet?.Table?.map((x) => ({
            ...x,
            ExpiryDate: x.ExpiryDate?.split("T")[0],
            ManufactureDate: x.ManufactureDate?.split("T")[0],
          }))
        );
      });
    }
    setUpdateId(null);
  }, [updateId]);

  const handleSearchChange = (data) => {
    dispatch(setSearchFieldValue(data));
  };

  const handleFormChange = (data) => {
    if (data.name == "IsPo") {
      dispatch(setFormFieldValue({ name: "BranchId", value: null }));
      dispatch(setFormFieldValue({ name: "VendorId", value: null }));
      setGrnDetail([]);
    }
    if (data.name === "VendorId" && formFields.IsPo === true) {
      setGrnDetail([]);
      dispatch(setFormFieldValue({ name: "POId", value: null }));
    }
    if (data.name === "POId") {
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
        "/CrudGrn",
        {
          ...initialFormValues,
          Date: finalDatee,
          GrnDetail: [],
          GoodReceivingId: null,
          OperationId: 6,
          CompanyId: userData.CompanyId,
          UserId: userData.UserId,
          UserIP: "1.2.2.1",
          POId: data.value,
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

        const productDetail = [];

        response.data.DataSet.Table.map((e) => {
          productDetail.push({
            ...e,
            PurchaseQuantity: e.GRNRemainingQuantity,
          });
        });
        setGrnDetail([...productDetail]);
      });
    }
    dispatch(setFormFieldValue(data));
  };
  const handleGrnObjChange = (data) => {
    setGrnObj({ ...GrnObj, [data.name]: data.value });
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    dispatch(
      setInitialState(
        "/CrudGrn",
        { ...searchFields, GRNNumber: `%${searchFields.GRNNumber}%` },
        initialFormValues,
        searchFields,
        controller,
        userData
      )
    );
  };

  const addItemsToList = () => {
    if (formFields.BranchId === null) {
      message.error("Select Your Branch First");
      return;
    }
    const filteredProductArray = supportingTable?.Table5?.filter(
      (x) =>
        (x.CategoryId === GrnObj.CategoryId || GrnObj.CategoryId === null) &&
        (x.ProductId === GrnObj.ProductId || GrnObj.ProductId === null) &&
        (x.ProductDetailId === GrnObj.ProductDetailId ||
          GrnObj.ProductDetailId === null)
    ).map((obj) => ({
      ...obj,
      PurchaseQuantity: 0,
      PurchaseUnitPrice: 0,
      TaxAmount: 0,
      Discount: 0,
      SubTotal: 0,
      NetAmount: 0,
      ManufactureDate: null,
      ExpiryDate: null,
    }));

    if (filteredProductArray.length === 0) {
      message.error("Inventory items not found!");
      return;
    }
    setGrnDetail([...GrnDetail, ...filteredProductArray]);
    setAddProductDetail(initialAddProductDetailObj);
    message.success("Product Successfully Added");
  };

  // const handleGrnOptionAdd = () => {
  //   if (formFields.BranchId === null) {
  //     message.error("Select Branch first!");
  //     return;
  //   }

  //   if (GrnObj.Barcode !== "") {
  //     const filterGrn = GrnDetail.filter(
  //       (grnItem) => grnItem.Barcode === GrnObj.Barcode
  //     );
  //     if (filterGrn.length === 0) {
  //       const productDetail = [];
  //       supportingTable.Table5.forEach((ob) => {
  //         if (
  //           ob.Barcode === GrnObj.Barcode &&
  //           ob.BranchId === formFields.BranchId
  //         ) {
  //           productDetail.push({
  //             ...ob,
  //             PurchaseQuantity: 0,
  //             PurchaseUnitPrice: 0,
  //             TaxAmount: 0,
  //             Discount: 0,
  //             SubTotal: 0,
  //             NetAmount: 0,
  //             ManufactureDate: null,
  //             ExpiryDate: null
  //           });
  //         }
  //       });
  //       if (productDetail.length === 0) {
  //         message.error("Inventory items not found!");
  //         return;
  //       }
  //       setGrnDetail([...GrnDetail, ...productDetail]);
  //       setGrnObj({
  //         ProductDetailId: null,
  //         ProductId: null,
  //         CategoryId: null,
  //         Barcode: ""
  //       });
  //     } else {
  //       message.error("Item Already Exist");
  //     }
  //   } else {
  //     if (
  //       GrnObj.ProductDetailId !== null &&
  //       GrnObj.ProductId !== null &&
  //       GrnObj.CategoryId !== null
  //     ) {
  //       const filterGrn = GrnDetail.filter(
  //         (grnItem) => grnItem.ProductDetailId === GrnObj.ProductDetailId
  //       );
  //       if (filterGrn.length === 0) {
  //         const productDetail = [];
  //         supportingTable.Table5.forEach((ob) => {
  //           if (
  //             ob.ProductDetailId === GrnObj.ProductDetailId &&
  //             ob.BranchId === formFields.BranchId
  //           ) {
  //             productDetail.push({
  //               ...ob,
  //               PurchaseQuantity: 0,
  //               PurchaseUnitPrice: 0,
  //               TaxAmount: 0,
  //               Discount: 0,
  //               SubTotal: 0,
  //               NetAmount: 0,
  //               ManufactureDate: null,
  //               ExpiryDate: null
  //             });
  //           }
  //         });
  //         if (productDetail.length === 0) {
  //           message.error("Inventory items not found!");
  //           return;
  //         }
  //         setGrnDetail([...GrnDetail, ...productDetail]);
  //         setGrnObj({
  //           ProductDetailId: null,
  //           ProductId: null,
  //           CategoryId: null,
  //           Barcode: ""
  //         });
  //       } else {
  //         message.error("Item Already Exist");
  //       }
  //     } else if (GrnObj.CategoryId !== null && GrnObj.ProductId !== null) {
  //       const filterGrn = GrnDetail.filter(
  //         (grnItem) => grnItem.ProductId === GrnObj.ProductId
  //       );
  //       if (filterGrn.length === 0) {
  //         const productDetail = [];
  //         supportingTable.Table5.forEach((ob) => {
  //           if (
  //             ob.ProductId === GrnObj.ProductId &&
  //             ob.BranchId === formFields.BranchId
  //           ) {
  //             productDetail.push({
  //               ...ob,
  //               PurchaseQuantity: 0,
  //               PurchaseUnitPrice: 0,
  //               TaxAmount: 0,
  //               Discount: 0,
  //               SubTotal: 0,
  //               NetAmount: 0,
  //               ManufactureDate: null,
  //               ExpiryDate: null
  //             });
  //           }
  //         });
  //         if (productDetail.length === 0) {
  //           message.error("Inventory items not found!");
  //           return;
  //         }
  //         setGrnDetail([...GrnDetail, ...productDetail]);
  //         setGrnObj({
  //           ProductDetailId: null,
  //           ProductId: null,
  //           CategoryId: null,
  //           Barcode: ""
  //         });
  //       } else {
  //         message.error("Item Already Exist");
  //       }
  //     } else if (GrnObj.CategoryId !== null) {
  //       const filterGrn = GrnDetail.filter(
  //         (grnItem) => grnItem.CategoryId === GrnObj.CategoryId
  //       );
  //       if (filterGrn.length === 0) {
  //         const productDetail = [];
  //         supportingTable.Table5.forEach((ob) => {
  //           if (
  //             ob.CategoryId === GrnObj.CategoryId &&
  //             ob.BranchId === formFields.BranchId
  //           ) {
  //             productDetail.push({
  //               ...ob,
  //               PurchaseQuantity: 0,
  //               PurchaseUnitPrice: 0,
  //               TaxAmount: 0,
  //               Discount: 0,
  //               SubTotal: 0,
  //               NetAmount: 0,
  //               ManufactureDate: null,
  //               ExpiryDate: null
  //             });
  //           }
  //         });
  //         if (productDetail.length === 0) {
  //           message.error("Inventory items not found!");
  //           return;
  //         }
  //         setGrnDetail([...GrnDetail, ...productDetail]);
  //         setGrnObj({
  //           ProductDetailId: null,
  //           ProductId: null,
  //           CategoryId: null,
  //           Barcode: ""
  //         });
  //       } else {
  //         message.error("Item Already Exist");
  //       }
  //     } else {
  //       message.error("Fill all the required fields!");
  //     }
  //   }
  // };

  const closeForm = () => {
    setGrnDetail([]);
    setGrnObj({
      ProductId: null,
      CategoryId: null,
      ProductDetailId: null,
      Barcode: "",
    });
  };

  const handleDeleteRow = (id, record) => {
    if (record.IsSubmit === false) {
      dispatch(
        deleteRow(
          "/CrudGrn",
          {
            ...initialFormValues,
            GoodReceivingId: id,
            Date: date,
            GrnDetail: [],
          },
          controller,
          userData
        )
      );
    } else {
      message.error("Record cant be deleted!");
    }
  };

  const removeGrnDetail = (record, index) => {
    let arr = GrnDetail;
    arr.splice(index, 1);
    setGrnDetail([...arr]);
  };

  const handleFormSubmit = (e, id, submit, close) => {
    e.preventDefault();
    const formFieldsClone = { ...formFields };
    formFieldsClone.IsSubmit = submit;

    if (formFieldsClone.IsPo === true) {
      const length = GrnDetail.filter((e) => e.GRNRemainingQuantity === 0);
      if (length.length > 0) {
        message.error("Please remove highlited items");
        return;
      }
    }

    const check = GrnDetail.filter((e) => {
      if (e.IsExpiryMandatory === true && e.ExpiryDate === "") {
        message.error("Expiry Date is required for this product");
        return e;
      }
    });
    if (check.length > 0) {
      message.error("Expiry date is required!");
      return;
    }

    if (formFieldsClone.Date === " 00:00:00.000") {
      message.error("Date cant be empty");
      return;
    }
    if (GrnDetail.length === 0) {
      message.error("Grn detail is required!");
      return;
    }

    dispatch(
      submitForm(
        "/CrudGrn",
        { ...formFieldsClone, GrnDetail: GrnDetail },
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
          close();
        }
      )
    );
  };

  const searchPanel = (
    <Fragment>
      <FormTextField
        colSpan={4}
        label="GRN Number"
        name="GRNNumber"
        size={INPUT_SIZE}
        value={searchFields.GRNNumber}
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
      <FormSelect
        colSpan={6}
        listItem={supportingTable.Table2}
        idName="VendorId"
        valueName="VendorName"
        size={INPUT_SIZE}
        name="VendorId"
        label="Vendor"
        value={searchFields.VendorId || ""}
        onChange={handleSearchChange}
      />

      <FormTextField
        colSpan={4}
        label="Date"
        type="date"
        name="Date"
        size={INPUT_SIZE}
        value={searchFields.Date}
        onChange={handleSearchChange}
      />
    </Fragment>
  );

  const handleExcel = (e) => {
    const formData = new FormData();
    formData.append("BranchId", formFields.BranchId);
    formData.append("CompanyId", userData.CompanyId);

    formData.append("File", e.target.files[0]); // e.target.files[0].name);

    postImageRequest("/GrnBulkUpload", formData)
      .then((response) => {
        if (response.error === true) {
          dispatch({
            type: TOGGLE_FORM_LOADING,
          });
          message.error(response.errorMessage);
          return;
        }
        setGrnDetail([...response?.data?.DataSet?.Table]);
        message.success(response.successMessage);
        returnFunction && returnFunction(response.data.DataSet);
        dispatch({ type: TOGGLE_FORM_LOADING });
      })
      .catch((error) => console.error(error));
  };

  const formPanel = (
    <Fragment>
      <FormTextField
        colSpan={6}
        label="GRN"
        name="GoodReceivingNumber"
        size={INPUT_SIZE}
        value={formFields.GoodReceivingNumber}
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
            : GrnDetail.length > 0
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
        listItem={
          (formFields.VendorId !== null &&
            supportingTable.Table6?.filter(
              (PO) => PO.VendorId === formFields.VendorId
            )) ||
          []
        }
        idName="POId"
        valueName="PONumber"
        size={INPUT_SIZE}
        name="POId"
        label="PO"
        value={formFields.POId || ""}
        onChange={handleFormChange}
        disabled={
          formFields?.IsSubmit === true || formFields.VendorId === ("" || null)
            ? true
            : !formFields.IsPo
        }
        required={formFields.IsPo}
      />
      <FormTextField
        colSpan={4}
        label="Date"
        type="date"
        name="Date"
        size={INPUT_SIZE}
        value={formatDateFunction(formFields.Date, "-")}
        onChange={handleFormChange}
        disabled={formFields?.IsSubmit === true ? true : false}
        required={true}
      />
      <FormCheckbox
        label={"Receiving by PO"}
        checked={formFields.IsPo}
        onChange={handleFormChange}
        name="IsPo"
        disabled={formFields?.IsSubmit === true ? true : false}
      />
      {formFields.BranchId !== null && formFields?.IsSubmit === false && (
        <FormCheckbox
          label={"Add From Excel"}
          checked={formFields.IsExcel}
          onChange={handleFormChange}
          name="IsExcel"
          disabled={formFields?.IsSubmit === true ? true : false}
        />
      )}
      {formFields.IsPo === false && formFields.IsExcel === false && (
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
              value={GrnObj.CategoryId || ""}
              onChange={handleGrnObjChange}
              disabled={
                formFields?.IsSubmit === true || formFields.BranchId === null
                  ? true
                  : false
              }
            />
            <FormSelect
              colSpan={6}
              listItem={
                GrnObj.CategoryId !== null &&
                supportingTable.Table4?.filter(
                  (product) =>
                    product.ProductCategoryId === GrnObj.CategoryId ||
                    GrnObj.CategoryId === null
                )
              }
              idName="ProductId"
              valueName="ProductName"
              size={INPUT_SIZE}
              name="ProductId"
              label="Product"
              value={GrnObj.ProductId || ""}
              onChange={handleGrnObjChange}
              disabled={
                formFields?.IsSubmit === true || formFields.BranchId === null
                  ? true
                  : false
              }
            />
            <FormSearchSelect
              colSpan={6}
              listItem={
                (formFields.ProductId !== null &&
                  supportingTable.Table5?.filter(
                    (prodcutDetail) =>
                      ((prodcutDetail.ProductId === GrnObj.ProductId ||
                        GrnObj.ProductId === null) &&
                        prodcutDetail.CategoryId === GrnObj.CategoryId) ||
                      GrnObj.CategoryId === null
                  )) ||
                []
              }
              idName="ProductDetailId"
              valueName="ProductSizeName"
              size={INPUT_SIZE}
              name="ProductDetailId"
              label="Product Detail"
              value={GrnObj.ProductDetailId || ""}
              onChange={handleGrnObjChange}
              disabled={
                formFields?.IsSubmit === true || formFields.BranchId === null
                  ? true
                  : false
              }
            />
            <FormTextField
              colSpan={6}
              label="Barcode"
              name="Barcode"
              size={INPUT_SIZE}
              value={GrnObj.Barcode}
              onChange={handleGrnObjChange}
              disabled={formFields?.IsSubmit === true ? true : false}
            />
            <FormButton
              colSpan={6}
              title="Add"
              type="primary"
              size={BUTTON_SIZE}
              colStyle={{ display: "flex", alignItems: "flex-end" }}
              onClick={addItemsToList}
              disabled={formFields?.IsSubmit === true ? true : false}
            />
          </Row>
        </Col>
      )}
      {formFields.IsExcel && (
        <>
          <input
            type={"file"}
            onChange={handleExcel}
            accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
          />
          <Button
            type="primary"
            icon={<CloudDownloadOutlined />}
            style={{ marginBottom: 20 }}
            onClick={() =>
              (window.location.href =
                process.env.REACT_APP_BASEURL +
                "/UploadFiles/" +
                GRN_BULK_FILE_NAME)
            }
          >
            Download Sample File
          </Button>
        </>
      )}
      <Col span={24}>
        <Table
          rowClassName={(record, index) =>
            formFields?.IsSubmit === true
              ? "table-row-dark"
              : record.GRNRemainingQuantity === 0
              ? "table-row-light"
              : "table-row-dark"
          }
          columns={
            formFields.IsPo === false
              ? columnsGrnDetail.filter(
                  (col) => col.key !== "GRNRemainingQuantity"
                )
              : columnsGrnDetail
          }
          dataSource={GrnDetail}
          rowKey={(e, i) => i}
          size="small"
          pagination={false}
        />
      </Col>
    </Fragment>
  );

  return (
    <Fragment>
      <BasicFormComponent
        formTitle="GRN"
        searchPanel={searchPanel}
        formPanel={formPanel}
        searchSubmit={handleSearchSubmit}
        onFormSave={handleFormSubmit}
        tableRows={itemList}
        tableLoading={tableLoading}
        formLoading={formLoading}
        tableColumn={columns}
        deleteRow={handleDeleteRow}
        actionID="GoodReceivingId"
        editRow={setUpdateId}
        fields={initialFormValues}
        crudTitle="GRN"
        formWidth="90vw"
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

export default Grn;
