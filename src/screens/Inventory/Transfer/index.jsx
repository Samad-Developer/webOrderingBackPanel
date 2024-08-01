import React, { Fragment, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteRow,
  resetState,
  setFormFieldValue,
  setInitialState,
  setSearchFieldValue,
  submitForm,
} from "../../../redux/actions/basicFormAction";

// import { UPDATE_FORM_FIELD } from "../../redux/reduxConstants";
import { BUTTON_SIZE, INPUT_SIZE } from "../../../common/ThemeConstants";
import BasicFormComponent from "../../../components/formComponent/BasicFormComponent";
import FormTextField from "../../../components/general/FormTextField";
import {
  SET_SUPPORTING_TABLE,
  UPDATE_FORM_FIELD,
} from "../../../redux/reduxConstants";
import FormSelect from "../../../components/general/FormSelect";
import { Button, Col, DatePicker, Input, message, Row, Table } from "antd";
import moment from "moment";
import FormButton from "../../../components/general/FormButton";
import { CloseOutlined } from "@ant-design/icons";
import { postRequest } from "../../../services/mainApp.service";
import { IoDuplicate } from "react-icons/io5";

import FormCheckbox from "../../../components/general/FormCheckbox";
import ComponentToPrint from "../../../components/specificComponents/ComponentToPrint";
import { HTMLChunk, html } from "./transferHtmlReportTemp";
import FormSearchSelect from "../../../components/general/FormSearchSelect";

const initialFormValues = {
  BranchIdFrom: null,
  BranchIdTo: null,
  IsSubmit: false,
  TransferId: null,
  Date: "",
  TransferNumber: "",
  RefNumber: "",
  UseScanner: false,
  Barcode: "",
};

const initialSearchValues = {
  BranchIdFrom: null,
  BranchIdTo: null,
  IsSubmit: false,
  TransferId: null,
  Date: "",
  TransferNumber: "",
  RefNumber: "",
};

const columns = [
  {
    title: "Transfer Number",
    dataIndex: "TransferNo",
    key: "TransferNo",
  },
  {
    title: "Branch From ",
    dataIndex: "BranchFrom",
    key: "BranchFrom",
  },
  {
    title: "Branch To",
    dataIndex: "BranchTo",
    key: "BranchTo",
  },
  {
    title: "Date",
    key: "Date",
    render: (_, record) => {
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

const initialObjData = {
  ProductDetailId: null,
  ProductId: null,
  CategoryId: null,
  Barcode: "",
};

const Transfer = () => {
  const dispatch = useDispatch();
  const controller = new window.AbortController();
  const userData = useSelector((state) => state.authReducer);
  const [TransferDetail, setTransferDetail] = useState([]);
  const [date, setDate] = useState(new Date());
  const componentRefPrint = useRef();
  const [updateId, setUpdateId] = useState(null);
  const [htmlReport, setHtmlReport] = useState("");
  const [transferObj, setTransferObj] = useState(initialObjData);

  const {
    formFields,
    searchFields,
    itemList,
    formLoading,
    tableLoading,
    supportingTable,
  } = useSelector((state) => state.basicFormReducer);

  const columnsTransferDetail = [
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
      title: "Barcode",
      dataIndex: "Barcode",
      key: "Barcode",
    },
    {
      title: "Issuance Unit",
      dataIndex: "IssueUnitName",
      key: "IssueUnitName",
    },
    {
      title: `Stock-${
        formFields.BranchIdFrom
          ? supportingTable?.Table1?.find(
              (x) => x.BranchId === formFields.BranchIdFrom
            )?.BranchName
          : ""
      }`,
      key: "StockQuantity",
      // dataIndex: "StockQuantity"
      render: (_, record) => record.StockQuantity,
    },
    {
      title: "Batch",
      key: "BatchId",
      render: (_, record, index) => {
        return (
          <FormSelect
            colSpan={24}
            listItem={supportingTable.Table6.filter(
              (e) => e.ProductDetailId === record.ProductDetailId
            )}
            idName="BatchId"
            valueName="BatchNumber"
            size={INPUT_SIZE}
            name="BatchId"
            value={record.BatchId || ""}
            onChange={(event) =>
              handleTransferDetailChnage(event, record, "BatchId", index)
            }
            disabled={formFields?.IsSubmit === true ? true : false}
          />
        );
      },
    },
    // {
    //   title: "Quantity Level",
    //   key: "QtyInLevel2",
    //   render: (_, record, index) => {
    //     return (
    //       <Input
    //         value={parseInt(record.QtyInLevel2)}
    //         onChange={(event) =>
    //           handleTransferDetailChnage(event, record, "QtyInLevel2", index)
    //         }
    //         type="number"
    //         disabled={formFields?.IsSubmit === true ? true : false}
    //         min={0}
    //         onKeyPress={(e) => {
    //           if (
    //             e.code === "Minus" ||
    //             e.code === "NumpadSubtract" ||
    //             e.code === "NumpadAdd"
    //           ) {
    //             e.preventDefault();
    //           }
    //         }}
    //         max={record.StockQuantity}
    //         required={true}
    //       />
    //     );
    //   }
    // },
    {
      title: "Transfer Quantity",
      key: "QtyInLevel2",
      render: (_, record, index) => (
        <Input
          type="number"
          name="QtyInLevel2"
          value={record?.QtyInLevel2}
          onChange={(event) =>
            handleTransferDetailChnage(event, record, "QtyInLevel2", index)
          }
          required={true}
          disabled={formFields?.IsSubmit === true ? true : false}
        />
      ),
    },
    {
      title: "Action",
      key: "action",
      render: (_, record, index) => {
        return (
          <Button
            type="text"
            icon={<IoDuplicate />}
            onClick={(e) => {
              let tarnDet = TransferDetail;
              tarnDet?.splice(index + 1, 0, {
                ...record,
                QtyInLevel2: 0,
                BatchId: null,
                StockQuantity: 0,
              });
              setTransferDetail([...tarnDet]);
            }}
            disabled={formFields.UseScanner}
          />
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
            onClick={() => removeTransferDetail(record, index)}
          />
        );
      },
    },
  ];

  const closeForm = () => {
    setTransferDetail([]);
    setTransferObj({
      ProductId: null,
      CategoryId: null,
      ProductDetailId: null,
      Barcode: "",
    });
  };

  const removeTransferDetail = (record, index) => {
    let arr = TransferDetail;
    arr.splice(index, 1);
    setTransferDetail([...arr]);
  };

  const handleTransferDetailChnage = (event, record, name, index) => {
    const TansferDetailArr = TransferDetail;
    if (index > -1) {
      let tranDet = TansferDetailArr[index];
      if (name === "BatchId") {
        tranDet.StockQuantity = supportingTable.Table6.filter(
          (e) => e.BatchId === event.value
        )[0]?.StockQuantity;
        tranDet[name] = event.value;
      } else {
        // if (event.target.value <= record.StockQuantity) {
        tranDet[name] = parseFloat(event.target.value);
        // }
      }
      TansferDetailArr[index] = tranDet;
      setTransferDetail([...TansferDetailArr]);
    }
  };

  useEffect(() => {
    dispatch(
      setInitialState(
        "/CrudTransfer",
        {
          ...initialFormValues,
          TransferNumber: "%%",
          Date: "",
          TransferDetail: [],
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
      let editObj = itemList.filter((item) => item.TransferId === updateId)[0];

      dispatch({
        type: UPDATE_FORM_FIELD,
        // payload: itemList.filter((item) => item.RequisitionId === updateId)[0],
        payload: { ...editObj, Date: editObj.Date.split("T")[0] },
      });
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
        "/CrudTransfer",
        {
          ...initialFormValues,
          Date: finalDatee,
          TransferDetail: [],
          TransferId: updateId,
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

        setTransferDetail([...response.data.DataSet.Table]);
      });

      postRequest(
        "/CrudTransfer",
        {
          ...initialFormValues,
          Date: finalDatee,
          BranchIdFrom: editObj.BranchIdFrom,
          TransferDetail: [],
          TransferId: updateId,
          OperationId: 6,
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

        dispatch({
          type: SET_SUPPORTING_TABLE,
          payload: { ...supportingTable, Table6: response.data.DataSet.Table },
        });
      });
    }
    setUpdateId(null);
  }, [updateId]);

  const handleSearchChange = (data) => {
    dispatch(setSearchFieldValue(data));
  };

  const handleFormChange = (data) => {
    if (data.name === "BranchIdFrom") {
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
        "/CrudTransfer",
        {
          ...initialFormValues,
          Date: finalDatee,
          BranchIdFrom: data.value,
          TransferDetail: [],
          TransferId: updateId,
          OperationId: 6,
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

        dispatch({
          type: SET_SUPPORTING_TABLE,
          payload: { ...supportingTable, Table6: response.data.DataSet.Table },
        });
      });
    }
    dispatch(setFormFieldValue(data));
  };

  const handleTansferObjChange = (data) => {
    setTransferObj({ ...transferObj, [data.name]: data.value });
  };

  const addItemsToList = () => {
    if (formFields.BranchId === null) {
      message.error("Select Your Branch First");
      return;
    }
    // if (transferObj.ProductDetailId === null) {
    //   message.error("Product Detail Required!");
    //   return;
    // }
    const filteredProductArray = supportingTable?.Table5?.filter(
      (x) =>
        (x.CategoryId === transferObj.CategoryId ||
          transferObj.CategoryId === null) &&
        (x.ProductId === transferObj.ProductId ||
          transferObj.ProductId === null) &&
        (x.ProductDetailId === transferObj.ProductDetailId ||
          transferObj.ProductDetailId === null)
    ).map((obj) => ({
      ...obj,
      ProductDetailName: obj.ProductSizeName,
      ProductDetailId: obj.ProductDetailId,
      Level2UnitId: obj.IssuanceUnitId,
      Level2UnitName: obj.IssueUnitName,
      BatchId: null,
      QtyInLevel2: 1,
      WastageDetailId: null,
    }));

    setTransferDetail([...TransferDetail, ...filteredProductArray]);
    setTransferObj(initialObjData);
    message.success("Product Successfully Added");
  };

  const handleTransferOptionAdd = () => {
    if (formFields.BranchIdFrom === null || formFields.BranchIdTo === null) {
      message.error("Select BranchFrom and BranchTo First!");
      return;
    }
    if (transferObj.Barcode !== "") {
      const filterClosing = TransferDetail.filter(
        (e) => e.Barcode === transferObj.Barcode
      );
      if (filterClosing.length === 0) {
        const productDetail = [];
        supportingTable.Table5.filter((ob) => {
          if (ob.Barcode === transferObj.Barcode) {
            if (
              ob.BranchId === formFields.BranchIdFrom ||
              ob.BranchId === null
            ) {
              productDetail.push({
                ...ob,
                QtyInLevel2: 0,
                Level2UnitId: ob.IssuanceUnitId,
                BatchId: null,
                StockQuantity: 0,
              });
            }
          }
        });
        if (productDetail.length === 0) {
          message.error("Inventory items not found!");
          return;
        }
        setTransferDetail([...TransferDetail, ...productDetail]);
        setTransferObj({
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
        transferObj.ProductDetailId !== null &&
        transferObj.ProductId !== null &&
        transferObj.CategoryId !== null
      ) {
        const filterClosing = TransferDetail.filter(
          (e) => e.ProductDetailId === transferObj.ProductDetailId
        );
        if (filterClosing.length === 0) {
          const productDetail = [];
          supportingTable.Table5.map((ob) => {
            if (ob.CategoryId === transferObj.CategoryId) {
              if (
                ob.BranchId === formFields.BranchIdFrom ||
                ob.BranchId === null
              ) {
                productDetail.push({
                  ...ob,
                  QtyInLevel2: 0,
                  Level2UnitId: ob.IssuanceUnitId,
                  BatchId: null,
                  StockQuantity: 0,
                });
              }
            }
          });
          if (productDetail.length === 0) {
            message.error("Inventory items not found!");
            return;
          }
          setTransferDetail([...TransferDetail, ...productDetail]);
          setTransferObj({
            ProductDetailId: null,
            ProductId: null,
            CategoryId: null,
            Barcode: "",
          });
        } else {
          message.error("Item Already Exist");
        }
      } else if (
        transferObj.CategoryId !== null &&
        transferObj.ProductId !== null
      ) {
        const filterClosing = TransferDetail.filter(
          (e) => e.ProductId === transferObj.ProductId
        );
        if (filterClosing.length === 0) {
          const productDetail = [];
          supportingTable.Table5.map((ob) => {
            if (ob.CategoryId === transferObj.CategoryId) {
              if (
                ob.BranchId === formFields.BranchIdFrom ||
                ob.BranchId === null
              ) {
                productDetail.push({
                  ...ob,
                  QtyInLevel2: 0,
                  Level2UnitId: ob.IssuanceUnitId,
                  BatchId: null,
                  StockQuantity: 0,
                });
              }
            }
          });
          if (productDetail.length === 0) {
            message.error("Inventory items not found!");
            return;
          }
          setTransferDetail([...TransferDetail, ...productDetail]);
          setDemandObj({
            ProductDetailId: null,
            ProductId: null,
            CategoryId: null,
            Barcode: "",
          });
        } else {
          message.error("Item Already Exist");
        }
      } else if (transferObj.CategoryId !== null) {
        const filterClosing = TransferDetail.filter(
          (e) => e.CategoryId === transferObj.CategoryId
        );
        if (filterClosing.length === 0) {
          const productDetail = [];
          supportingTable.Table5.map((ob) => {
            if (ob.CategoryId === transferObj.CategoryId) {
              if (
                ob.BranchId === formFields.BranchIdFrom ||
                ob.BranchId === null
              ) {
                productDetail.push({
                  ...ob,
                  QtyInLevel2: 0,
                  Level2UnitId: ob.IssuanceUnitId,
                  BatchId: null,
                  StockQuantity: 0,
                });
              }
            }
          });

          if (productDetail.length === 0) {
            message.error("Inventory items not found!");
            return;
          }

          setTransferDetail([...TransferDetail, ...productDetail]);
          setTransferObj({
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

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    searchFields.TransferNumber = searchFields.TransferNumber.trim();
    dispatch(
      setInitialState(
        "/CrudTransfer",
        {
          ...searchFields,
          TransferNumber: `%${searchFields.TransferNumber}%`,
          TransferDetail: [],
        },
        initialFormValues,
        searchFields,
        controller,
        userData
      )
    );
  };

  const handleDeleteRow = (id, record) => {
    if (record.IsSubmit === false) {
      dispatch(
        deleteRow(
          "/CrudTransfer",
          {
            ...initialFormValues,
            TransferId: id,
            Date: date,
            TransferDetail: [],
          },
          controller,
          userData
        )
      );
    } else {
      message.error("Record cant be deleted!");
    }
  };
  const viewReport = (record, handlePrint) => {
    postRequest(
      "/CrudTransfer",
      {
        ...initialFormValues,
        Date: record.Date,
        BranchIdFrom: record.BranchIdFrom,
        TransferDetail: [],
        TransferId: record.TransferId,
        OperationId: 5,
        CompanyId: userData.CompanyId,
        UserId: userData.UserId,
        UserIP: "1.2.2.1",
      },
      controller
    ).then((res) => {
      const htmlBody = HTMLChunk(
        {
          detail: res.data.DataSet.Table,
        },
        record.BranchFrom
      );
      const report = html({
        DATE_FROM: record.Date.split("T")[0],
        DATE_TO: record.Date.split("T")[0],
        // master: res.data.DataSet.Table2[0],
        body: htmlBody,
        BranchName: record.BranchName,
        master: {
          TransferNumber: record.TransferNo,
          TransferDate: record.Date,
          TransferFrom: record.BranchFrom,
          TransferTo: record.BranchTo,
        },
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

  const handleFormSubmit = (e, id, submit, closeForm) => {
    e.preventDefault();
    const formFieldsClone = { ...formFields };
    formFieldsClone.IsSubmit = submit;

    const qty = TransferDetail.filter((e) => e.QtyInLevel2 === 0);
    if (qty.length > 0) {
      message.error("Quantity must be greater than Zero");
      return;
    }

    const batch = TransferDetail.filter((e) => e.BatchId === null);
    if (batch.length > 0) {
      message.error("Batch is required");
      return;
    }

    if (date === " 00:00:00.000") {
      message.error("Date cant be empty");
      return;
    }

    if (TransferDetail.length === 0) {
      message.error("Transfer detail is required!");
      return;
    }
    dispatch(
      submitForm(
        "/CrudTransfer",
        { ...formFieldsClone, TransferDetail: TransferDetail },
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
  };

  const searchPanel = (
    <Fragment>
      <FormTextField
        colSpan={4}
        label="Transfer Number"
        name="TransferNumber"
        size={INPUT_SIZE}
        value={searchFields.TransferNumber}
        onChange={handleSearchChange}
      />
      <FormSelect
        colSpan={6}
        listItem={supportingTable.Table1}
        idName="BranchId"
        valueName="BranchName"
        size={INPUT_SIZE}
        name="BranchIdFrom"
        label="Branch From"
        value={searchFields.BranchIdFrom || ""}
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

  const formPanel = (
    <Fragment>
      <FormTextField
        colSpan={6}
        label="Transfer Number"
        name="TransferNo"
        size={INPUT_SIZE}
        value={formFields.TransferNo}
        onChange={handleFormChange}
        disabled={true}
      />
      <FormSelect
        colSpan={6}
        listItem={supportingTable.Table1}
        idName="BranchId"
        valueName="BranchName"
        size={INPUT_SIZE}
        name="BranchIdFrom"
        label="Branch From"
        value={formFields.BranchIdFrom || ""}
        onChange={handleFormChange}
        required={true}
        disabled={formFields?.IsSubmit === true ? true : false}
      />
      <FormSelect
        colSpan={6}
        listItem={
          formFields.BranchIdFrom !== null &&
          supportingTable?.Table2?.filter(
            (e) => e.BranchId !== formFields.BranchIdFrom
          )
        }
        idName="BranchId"
        valueName="BranchName"
        size={INPUT_SIZE}
        name="BranchIdTo"
        label="Branch To"
        value={formFields.BranchIdTo || ""}
        onChange={handleFormChange}
        required={true}
        disabled={formFields?.IsSubmit === true ? true : false}
      />
      <FormTextField
        colSpan={6}
        label="Ref Number"
        name="RefNumber"
        size={INPUT_SIZE}
        value={formFields.RefNumber}
        onChange={handleFormChange}
        disabled={formFields?.IsSubmit === true ? true : false}
      />
      <FormTextField
        colSpan={6}
        label="Transfer Date"
        type="date"
        name="Date"
        size={INPUT_SIZE}
        value={formFields.Date}
        onChange={handleFormChange}
        disabled={formFields?.IsSubmit === true ? true : false}
        required={true}
      />
      <FormCheckbox
        label={"Use Scanner For Entry"}
        checked={formFields.UseScanner}
        onChange={handleFormChange}
        name="UseScanner"
        disabled={formFields?.IsSubmit === true ? true : false}
      />
      {formFields.UseScanner && (
        <FormTextField
          colSpan={6}
          label="Barcode"
          name="Barcode"
          size={INPUT_SIZE}
          value={formFields.Barcode}
          onChange={handleFormChange}
          disabled={false}
        />
      )}

      <Col span={24}>
        <b style={{ fontSize: 16 }}>Search</b>
        <Row gutter={[8, 8]}>
          <FormSelect
            colSpan={4}
            listItem={supportingTable.Table3}
            idName="CategoryId"
            valueName="CategoryName"
            size={INPUT_SIZE}
            name="CategoryId"
            label="Category"
            value={transferObj.CategoryId || ""}
            onChange={handleTansferObjChange}
            disabled={formFields?.IsSubmit === true ? true : false}
          />
          <FormSelect
            colSpan={4}
            listItem={
              (transferObj.CategoryId !== null &&
                supportingTable.Table4?.filter(
                  (e) =>
                    e.ProductCategoryId === transferObj.CategoryId ||
                    transferObj.CategoryId === null
                )) ||
              []
            }
            idName="ProductId"
            valueName="ProductName"
            size={INPUT_SIZE}
            name="ProductId"
            label="Product"
            value={transferObj.ProductId || ""}
            onChange={handleTansferObjChange}
            disabled={formFields?.IsSubmit === true ? true : false}
          />
          <FormSearchSelect
            colSpan={4}
            listItem={
              supportingTable.Table5?.filter(
                (e) =>
                  (e.ProductId === transferObj.ProductId ||
                    transferObj.ProductId === null) &&
                  (e.CategoryId === transferObj.CategoryId ||
                    transferObj.CategoryId === null)
              ) || []
            }
            idName="ProductDetailId"
            valueName="ProductSizeName"
            size={INPUT_SIZE}
            name="ProductDetailId"
            label="Product Detail"
            value={transferObj.ProductDetailId || ""}
            onChange={handleTansferObjChange}
            disabled={formFields?.IsSubmit === true ? true : false}
          />
          <FormTextField
            colSpan={4}
            label="Barcode"
            name="Barcode"
            size={INPUT_SIZE}
            value={transferObj.Barcode}
            onChange={handleTansferObjChange}
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
      <Col span={24}>
        <Table
          columns={columnsTransferDetail}
          dataSource={TransferDetail}
          pagination={false}
          size={"small"}
        />
      </Col>
    </Fragment>
  );

  return (
    <Fragment>
      <BasicFormComponent
        formTitle="Transfer"
        searchPanel={searchPanel}
        formPanel={formPanel}
        searchSubmit={handleSearchSubmit}
        onFormSave={handleFormSubmit}
        tableRows={itemList}
        tableLoading={tableLoading}
        formLoading={formLoading}
        tableColumn={columns}
        deleteRow={handleDeleteRow}
        actionID="TransferId"
        editRow={setUpdateId}
        fields={initialFormValues}
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

export default Transfer;
