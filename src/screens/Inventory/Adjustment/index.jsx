import { Button, Col, Input, message, Row, Table } from "antd";
import React, { Fragment, useEffect, useState, useRef } from "react";
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
import { CloseOutlined } from "@ant-design/icons";
import { postRequest } from "../../../services/mainApp.service";
import FormCheckbox from "../../../components/general/FormCheckbox";
import ComponentToPrint from "../../../components/specificComponents/ComponentToPrint";
import { html, HTMLChunk } from "./adjustmentHtmlReportTemplate";

const initialFormValues = {
  BranchId: null,
  IsSubmit: false,
  StatusId: null,
  AdjustmentId: null,
  AdjustmentDetail: [],
  Date: new Date(Date.now()),
  UseScanner: false,
  Barcode: "",
};

const initialSearchValues = {
  BranchId: null,
  IsSubmit: false,
  StatusId: null,
  AdjustmentId: null,
  AdjustmentDetail: [],
  Date: null,
  AdjustmentNumber: "",
  UseScanner: false,
};

const columns = [
  {
    title: "Adjustment Number",
    dataIndex: "AdjustmentNo",
    key: "AdjustmentNo",
  },
  {
    title: "Branch Name",
    dataIndex: "BranchName",
    key: "BranchName",
  },
  {
    title: "Adjustment Date",
    key: "InvAdjustmentDate",
    render: (_, record) => {
      return <div>{record.InvAdjustmentDate?.split("T")[0]}</div>;
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

const Adjustment = () => {
  const dispatch = useDispatch();
  const controller = new window.AbortController();
  const userData = useSelector((state) => state.authReducer);
  const [updateId, setUpdateId] = useState(null);
  const [AdjustmentDetail, setAdjustmentDetail] = useState([]);
  const [date, setDate] = useState(new Date());
  const componentRefPrint = useRef();
  const [htmlReport, setHtmlReport] = useState("");

  const [adjustmentObj, setAdjustmentObj] = useState({
    CategoryId: null,
    ProductDetailId: null,
    ProductId: null,
    Barcode: "",
  });

  const viewReport = (record, handlePrint) => {
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
      "/CrudAdjustment",
      {
        ...initialFormValues,
        Date: finalDatee,
        AdjustmentDetail: [],
        AdjustmentId: record.AdjustmentId,
        OperationId: 5,
        CompanyId: userData.CompanyId,
        UserId: userData.UserId,
        UserIP: "1.2.2.1",
      },
      controller
    ).then((res) => {
      const htmlBody = HTMLChunk({
        detail: res.data.DataSet.Table,
      });
      const report = html({
        DATE_FROM: record.InvAdjustmentDate.split("T")[0],
        DATE_TO: record.InvAdjustmentDate.split("T")[0],
        master: record,
        body: htmlBody,
        BranchName: record.BranchName,
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

  const {
    formFields,
    searchFields,
    itemList,
    formLoading,
    tableLoading,
    supportingTable,
  } = useSelector((state) => state.basicFormReducer);

  const handleAdjustmentDetailChnage = (event, record, name) => {
    const AdjsutmentDetailArr = AdjustmentDetail;
    const index = AdjsutmentDetailArr.findIndex(
      (x) => x.ProductDetailId === record.ProductDetailId
    );
    if (index > -1) {
      let closeDet = AdjsutmentDetailArr[index];
      if (name === "TypeId") {
        closeDet[name] = event.value;
        AdjsutmentDetailArr[index] = closeDet;

        setAdjustmentDetail([...AdjsutmentDetailArr]);
      } else if (name === "BatchId") {
        closeDet[name] = event.value;
        closeDet.StockQuantity = supportingTable.Table6.filter(
          (e) => e.BatchId === event.value
        )[0]?.StockQuantity;
        AdjsutmentDetailArr[index] = closeDet;
        setAdjustmentDetail([...AdjsutmentDetailArr]);
      } else {
        closeDet[name] = event.target.value;
        AdjsutmentDetailArr[index] = closeDet;
        setAdjustmentDetail([...AdjsutmentDetailArr]);
      }
    }
  };

  const columnsAdjustmentDetail = [
    {
      title: "Category",
      dataIndex: "CategoryName",
      key: "CategoryName",
    },
    {
      title: "Product",
      dataIndex: "ProductSizeName",
      key: "ProductSizeName",
    },
    {
      title: "Size",
      dataIndex: "SizeName",
      key: "SizeName",
    },
    {
      title: "Variant",
      dataIndex: "FlavorName",
      key: "FlavorName",
    },
    {
      title: "Barcode",
      dataIndex: "Barcode",
      key: "Barcode",
    },
    {
      title: "Stock",
      key: "StockQuantity",
      render: (_, record) => {
        return record.StockQuantity;
      },
    },
    {
      title: "Batch",
      key: "BatchId",
      render: (_, record) => {
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
            label=""
            value={record.BatchId || ""}
            onChange={(event) =>
              handleAdjustmentDetailChnage(event, record, "BatchId")
            }
            disabled={formFields?.IsSubmit === true ? true : false}
          />
        );
      },
    },
    {
      title: "Type",
      key: "TypeId",
      render: (_, record) => {
        return (
          <FormSelect
            colSpan={24}
            listItem={supportingTable.Table5}
            idName="TypeId"
            valueName="TypeName"
            size={INPUT_SIZE}
            name="TypeId"
            label=""
            value={record.TypeId || ""}
            onChange={(event) =>
              handleAdjustmentDetailChnage(event, record, "TypeId")
            }
            disabled={formFields?.IsSubmit === true ? true : false}
          />
        );
      },
    },
    {
      title: "Adjustment Quantity",
      key: "QtyInLevel2",
      render: (_, record) => {
        return (
          <Input
            value={record.QtyInLevel2}
            onChange={(event) =>
              handleAdjustmentDetailChnage(event, record, "QtyInLevel2")
            }
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
      title: "Delete",
      dataIndex: "delete",
      render: (_, record, index) => {
        return (
          <Button
            disabled={formFields?.IsSubmit === true ? true : false}
            icon={<CloseOutlined />}
            onClick={() => removeAdjustmentDetail(index)}
          />
        );
      },
    },
  ];

  useEffect(() => {
    dispatch(
      setInitialState(
        "/CrudAdjustment",
        {
          ...initialFormValues,
          AdjustmentNumber: "%%",
          Date: "",
          AdjustmentDetail: [],
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
      let editObj = itemList.filter(
        (item) => item.AdjustmentId === updateId
      )[0];

      dispatch({
        type: UPDATE_FORM_FIELD,
        payload: { ...editObj, Date: editObj.InvAdjustmentDate.split("T")[0] },
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
        "/CrudAdjustment",
        {
          ...initialFormValues,
          Date: finalDatee,
          AdjustmentDetail: [],
          AdjustmentId: updateId,
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

        setAdjustmentDetail([...response.data.DataSet.Table]);
      });
    }
    setUpdateId(null);
  }, [updateId]);

  const handleSearchChange = (data) => {
    dispatch(setSearchFieldValue(data));
  };

  const handleFormChange = (data) => {
    if (data.name === "BranchId") {
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
        "/CrudAdjustment",
        {
          ...initialFormValues,
          BranchId: data.value,
          Date: finalDatee,
          AdjustmentDetail: [],
          AdjustmentId: updateId,
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

  const handleAdjustmentObjChange = (data) => {
    setAdjustmentObj({ ...adjustmentObj, [data.name]: data.value });
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();

    dispatch(
      setInitialState(
        "/CrudAdjustment",
        {
          ...searchFields,
          AdjustmentDetail: [],
          AdjustmentNumber: `%${searchFields.AdjustmentNumber}%`,
        },
        initialFormValues,
        searchFields,
        controller,
        userData
      )
    );
  };

  const handleAdjustmentOptionAdd = () => {
    if (formFields.BranchId === null) {
      message.error("Select Branch first!");
      return;
    }

    if (adjustmentObj.Barcode !== "") {
      const filterClosing = AdjustmentDetail.filter(
        (e) => e.Barcode === adjustmentObj.Barcode
      );
      if (filterClosing.length === 0) {
        const productDetail = [];
        supportingTable.Table4.filter((ob) => {
          if (ob.Barcode === adjustmentObj.Barcode) {
            if (ob.BranchId === formFields.BranchId || ob.BranchId === null) {
              productDetail.push({
                ...ob,
                QtyInLevel2: 1,
                TypeId: null,
                StockQuantity: 0,
                BatchId: null,
              });
            }
          }
        });
        if (productDetail.length === 0) {
          message.error("Inventory items not found!");
          return;
        }
        setAdjustmentDetail([...AdjustmentDetail, ...productDetail]);
        setAdjustmentObj({
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
        adjustmentObj.ProductDetailId !== null &&
        adjustmentObj.ProductId !== null &&
        adjustmentObj.CategoryId !== null
      ) {
        const filterClosing = AdjustmentDetail.filter(
          (e) => e.ProductDetailId === adjustmentObj.ProductDetailId
        );
        if (filterClosing.length === 0) {
          const productDetail = [];
          supportingTable.Table4.filter((ob) => {
            if (ob.ProductDetailId === adjustmentObj.ProductDetailId) {
              if (ob.BranchId === formFields.BranchId || ob.BranchId === null) {
                productDetail.push({
                  ...ob,
                  QtyInLevel2: 1,
                  TypeId: null,
                  StockQuantity: 0,
                  BatchId: null,
                });
              }
            }
          });
          if (productDetail.length === 0) {
            message.error("Inventory items not found!");
            return;
          }
          setAdjustmentDetail([...AdjustmentDetail, ...productDetail]);
          setAdjustmentObj({
            ProductDetailId: null,
            ProductId: null,
            CategoryId: null,
            Barcode: "",
          });
        } else {
          message.error("Item Already Exist");
        }
      } else if (
        adjustmentObj.CategoryId !== null &&
        adjustmentObj.ProductId !== null
      ) {
        const filterClosing = AdjustmentDetail.filter(
          (e) => e.ProductId === adjustmentObj.ProductId
        );
        if (filterClosing.length === 0) {
          const productDetail = [];
          supportingTable.Table4.filter((ob) => {
            if (ob.ProductId === adjustmentObj.ProductId) {
              if (ob.BranchId === formFields.BranchId || ob.BranchId === null) {
                productDetail.push({
                  ...ob,
                  QtyInLevel2: 1,
                  TypeId: null,
                  StockQuantity: 0,
                  BatchId: null,
                });
              }
            }
          });
          if (productDetail.length === 0) {
            message.error("Inventory items not found!");
            return;
          }
          setAdjustmentDetail([...AdjustmentDetail, ...productDetail]);
          setAdjustmentObj({
            ProductDetailId: null,
            ProductId: null,
            CategoryId: null,
            Barcode: "",
          });
        } else {
          message.error("Item Already Exist");
        }
      } else if (adjustmentObj.CategoryId !== null) {
        const filterClosing = AdjustmentDetail.filter(
          (e) => e.CategoryId === adjustmentObj.CategoryId
        );
        if (filterClosing.length === 0) {
          const productDetail = [];
          supportingTable.Table4.filter((ob) => {
            if (ob.CategoryId === adjustmentObj.CategoryId) {
              if (ob.BranchId === formFields.BranchId || ob.BranchId === null) {
                productDetail.push({
                  ...ob,
                  QtyInLevel2: 1,
                  TypeId: null,
                  StockQuantity: 0,
                  BatchId: null,
                });
              }
            }
          });

          if (productDetail.length === 0) {
            message.error("Inventory items not found!");
            return;
          }

          setAdjustmentDetail([...AdjustmentDetail, ...productDetail]);
          setAdjustmentObj({
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
    setAdjustmentDetail([]);
    setAdjustmentObj({
      ProductDetailId: null,
      CategoryId: null,
      ProductId: null,
      Barcode: "",
    });
  };

  const handleDeleteRow = (id, record) => {
    if (record.IsSubmit === false) {
      dispatch(
        deleteRow(
          "/CrudAdjustment",
          {
            ...initialFormValues,
            AdjustmentId: id,
            Date: date,
            AdjustmentDetail: [],
          },
          controller,
          userData
        )
      );
    } else {
      message.error("Record cant be deleted!");
    }
  };

  const removeAdjustmentDetail = (index) => {
    let arr = AdjustmentDetail;
    arr.splice(index, 1);
    setAdjustmentDetail([...arr]);
  };

  const handleFormSubmit = (e, id, submit, closeForm) => {
    e.preventDefault();
    const formFieldsCloned = { ...formFields };
    delete formFieldsCloned.IsSubmitted;
    formFieldsCloned.IsSubmit = submit;
    if (formFields.Date === null) {
      message.error("Date cant be empty");
      return;
    }
    if (AdjustmentDetail.length === 0) {
      message.error("Adjustment detail is required!");
      return;
    }

    const arr = [];
    const arr2 = [];
    const arr3 = [];

    AdjustmentDetail.filter((e) => {
      if (e.TypeId === null) {
        arr.push(e);
      } else if (e.BatchId === null) {
        arr2.push(e);
      } else if (e.QtyInLevel2 <= 0) {
        arr3.push(arr3);
      }
    });

    if (arr.length > 0) {
      message.error("Type is Required!");
      return;
    }
    if (arr2.length > 0) {
      message.error("Batch is Required!");
      return;
    }
    if (arr3.length > 0) {
      message.error("Adjustment quantity cant be 0 or less");
      return;
    }
    dispatch(
      submitForm(
        "/CrudAdjustment",
        { ...formFieldsCloned, AdjustmentDetail: AdjustmentDetail },
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
        label="Adjustment Number"
        name="AdjustmentNumber"
        size={INPUT_SIZE}
        value={searchFields.AdjustmentNumber}
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
        label="Adjustment"
        name="AdjustmentNumber"
        size={INPUT_SIZE}
        value={formFields.AdjustmentNumber}
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
            : AdjustmentDetail.length > 0
            ? true
            : false
        }
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
        colSpan={6}
        label="Adjustment Date"
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
            colSpan={6}
            listItem={supportingTable.Table2}
            idName="CategoryId"
            valueName="CategoryName"
            size={INPUT_SIZE}
            name="CategoryId"
            label="Category"
            value={adjustmentObj.CategoryId || ""}
            onChange={handleAdjustmentObjChange}
            disabled={formFields?.IsSubmit === true ? true : false}
          />
          <FormSelect
            colSpan={6}
            listItem={
              (adjustmentObj.CategoryId !== null &&
                supportingTable.Table3?.filter(
                  (e) => e.ProductCategoryId === adjustmentObj.CategoryId
                )) ||
              []
            }
            idName="ProductId"
            valueName="ProductName"
            size={INPUT_SIZE}
            name="ProductId"
            label="Product"
            value={adjustmentObj.ProductId || ""}
            onChange={handleAdjustmentObjChange}
            disabled={formFields?.IsSubmit === true ? true : false}
          />
          <FormSelect
            colSpan={6}
            listItem={
              (adjustmentObj.ProductId !== null &&
                supportingTable.Table4?.filter((e) => {
                  if (
                    e.ProductId === adjustmentObj.ProductId &&
                    e.BranchId === formFields.BranchId
                  ) {
                    return e;
                  }
                })) ||
              []
            }
            idName="ProductDetailId"
            valueName="ProductSizeName"
            size={INPUT_SIZE}
            name="ProductDetailId"
            label="Product Detail"
            value={adjustmentObj.ProductDetailId || ""}
            onChange={handleAdjustmentObjChange}
            disabled={formFields?.IsSubmit === true ? true : false}
          />

          <FormTextField
            colSpan={6}
            label="Barcode"
            name="Barcode"
            size={INPUT_SIZE}
            value={adjustmentObj.Barcode}
            onChange={handleAdjustmentObjChange}
            disabled={formFields?.IsSubmit === true ? true : false}
          />
          <FormButton
            colSpan={6}
            title="Add"
            type="primary"
            size={BUTTON_SIZE}
            colStyle={{ display: "flex", alignItems: "flex-end" }}
            onClick={handleAdjustmentOptionAdd}
            disabled={formFields?.IsSubmit === true ? true : false}
          />
        </Row>
      </Col>
      <Col span={24}>
        <Table
          columns={columnsAdjustmentDetail}
          dataSource={AdjustmentDetail}
        />
      </Col>
    </Fragment>
  );

  return (
    <Fragment>
      <BasicFormComponent
        formTitle="Stock Adjustments"
        searchPanel={searchPanel}
        formPanel={formPanel}
        searchSubmit={handleSearchSubmit}
        onFormSave={handleFormSubmit}
        tableRows={itemList}
        tableLoading={tableLoading}
        formLoading={formLoading}
        tableColumn={columns}
        deleteRow={handleDeleteRow}
        actionID="AdjustmentId"
        editRow={setUpdateId}
        fields={initialFormValues}
        crudTitle="Stock Adjustment"
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

export default Adjustment;
