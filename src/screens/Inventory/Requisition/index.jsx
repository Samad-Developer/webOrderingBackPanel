import { Button, Col, Input, message, Row, Table } from "antd";
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
import { CloseOutlined } from "@ant-design/icons";
import { postRequest } from "../../../services/mainApp.service";

const initialFormValues = {
  BranchId: null,
  IsSubmit: false,
  RequisitionNumber: "",
  RequisitionId: null,
  RequisitionDetail: [],
  // Date: new Date(Date.now()),
  Date: null,
};
import ComponentToPrint from "../../../components/specificComponents/ComponentToPrint";
import { html, HTMLChunk } from "./requisitionHrmlReportTemplate";

const initialSearchValues = {
  BranchId: null,
  IsSubmit: false,
  RequisitionNumber: "",
  RequisitionId: null,
  RequisitionDetail: [],
  // Date: new Date(Date.now()),
  Date: null,
};

const columns = [
  {
    title: "Requisition Number",
    dataIndex: "RequisitionNumber",
    key: "RequisitionNumber",
  },
  {
    title: "Branch Name",
    dataIndex: "BranchName",
    key: "BranchName",
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

const Requisition = () => {
  const dispatch = useDispatch();
  const controller = new window.AbortController();
  const userData = useSelector((state) => state.authReducer);
  const componentRefPrint = useRef();

  const [updateId, setUpdateId] = useState(null);

  const [RequisitionDetail, setRequisitionDetail] = useState([]);

  const [date, setDate] = useState(new Date());

  const [htmlReport, setHtmlReport] = useState("");

  const [searchDate, setSearchDate] = useState(
    new Date().getFullYear() +
      "-" +
      (new Date().getMonth() + 1) +
      "-" +
      new Date().getDate() +
      " " +
      "00:00:00.000"
  );

  const [requisitionObj, setRequisitionObj] = useState({
    CategoryId: null,
    ProductDetailId: null,
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

  const handlerequisitionDetailChnage = (event, record, name) => {
    const RequisitionDetailArr = RequisitionDetail;
    const index = RequisitionDetailArr.findIndex(
      (x) => x.ProductDetailId === record.ProductDetailId
    );
    if (index > -1) {
      let closeDet = RequisitionDetailArr[index];
      closeDet[name] = event.target.value;
      RequisitionDetailArr[index] = closeDet;
      setRequisitionDetail([...RequisitionDetailArr]);
    }
  };

  const columnsRequisitionDetail = [
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
      title: "Requested Quantity",
      key: "RequestedQuantityInPurchase",
      render: (_, record) => {
        return (
          <Input
            value={parseInt(record.RequestedQuantityInPurchase)}
            onChange={(event) =>
              handlerequisitionDetailChnage(
                event,
                record,
                "RequestedQuantityInPurchase"
              )
            }
            type="number"
            disabled={formFields?.IsSubmit === true ? true : false}
            min={1}
            onKeyPress={(e) => {
              if (e.code === "Minus") {
                e.preventDefault();
              }
            }}
            required={true}
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
            onClick={() => removeRequisitionDetail(index)}
          />
        );
      },
    },
  ];

  useEffect(() => {
    dispatch(
      setInitialState(
        "/CrudRequisition",
        {
          ...initialFormValues,
          RequisitionNumber: "%%",
          Date: null,
          RequisitionDetail: [],
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
        (item) => item.RequisitionId === updateId
      )[0];
      dispatch({
        type: UPDATE_FORM_FIELD,
        // payload: itemList.filter((item) => item.RequisitionId === updateId)[0],
        payload: { ...editObj, Date: editObj.Date.split("T")[0] },
      });

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
        "/CrudRequisition",
        {
          ...initialFormValues,
          Date: formFields.Date,
          RequisitionDetail: [],
          RequisitionId: updateId,
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

        setRequisitionDetail([...response.data.DataSet.Table]);
      });
    }
    setUpdateId(null);
  }, [updateId]);

  const handleSearchChange = (data) => {
    dispatch(setSearchFieldValue(data));
  };

  const handleFormChange = (data) => {
    dispatch(setFormFieldValue(data));
  };

  const handleRequisitionObjChange = (data) => {
    setRequisitionObj({ ...requisitionObj, [data.name]: data.value });
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    dispatch(
      setInitialState(
        "/CrudRequisition",
        {
          ...searchFields,
          RequisitionNumber: `%${searchFields.RequisitionNumber}%`,
        },
        initialFormValues,
        searchFields,
        controller,
        userData
      )
    );
  };

  const handleRequisitionOptionAdd = () => {
    if (formFields.BranchId === null) {
      message.error("Select Branch first!");
      return;
    }
    if (requisitionObj.Barcode !== "") {
      const filterClosing = RequisitionDetail.filter(
        (e) => e.Barcode === requisitionObj.Barcode
      );
      if (filterClosing.length === 0) {
        const productDetail = [];
        supportingTable.Table5.filter((ob) => {
          if (ob.Barcode === requisitionObj.Barcode) {
            if (
              ob.BranchId.includes(formFields.BranchId.toString()) ||
              ob.BranchId === null
            ) {
              productDetail.push({ ...ob, RequestedQuantityInPurchase: 1 });
            }
          }
        });
        if (productDetail.length === 0) {
          message.error("Inventory items not found!");
          return;
        }
        setRequisitionDetail([...RequisitionDetail, ...productDetail]);
        setRequisitionObj({
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
        requisitionObj.ProductDetailId !== null &&
        requisitionObj.ProductId !== null &&
        requisitionObj.CategoryId !== null
      ) {
        const filterClosing = RequisitionDetail.filter(
          (item) => item.ProductDetailId === requisitionObj.ProductDetailId
        );
        if (filterClosing.length === 0) {
          const productDetail = supportingTable.Table5.filter((ob) => {
            if (ob.ProductDetailId === requisitionObj.ProductDetailId) {
              if (
                ob.BranchIds.includes(formFields.BranchId.toString()) ||
                ob.BranchId === null
              ) {
                return (ob.RequestedQuantityInPurchase = 1);
              }
            }
          });
          if (productDetail.length === 0) {
            message.error("Inventory items not found!");
            return;
          }
          setRequisitionDetail([...RequisitionDetail, ...productDetail]);
          setRequisitionObj({
            ProductDetailId: null,
            ProductId: null,
            CategoryId: null,
            Barcode: "",
          });
        } else {
          message.error("Item Already Exist");
        }
      } else if (
        requisitionObj.CategoryId !== null &&
        requisitionObj.ProductId !== null
      ) {
        const filterClosing = RequisitionDetail.filter(
          (e) => e.ProductId === requisitionObj.ProductId
        );
        if (filterClosing.length === 0) {
          const productDetail = supportingTable.Table5.filter((ob) => {
            if (ob.ProductId === requisitionObj.ProductId) {
              if (ob.BranchId === formFields.BranchId || ob.BranchId === null) {
                return (ob.RequestedQuantityInPurchase = 1);
              }
            }
          });
          if (productDetail.length === 0) {
            message.error("Inventory items not found!");
            return;
          }
          setRequisitionDetail([...RequisitionDetail, ...productDetail]);
          setRequisitionObj({
            ProductDetailId: null,
            ProductId: null,
            CategoryId: null,
            Barcode: "",
          });
        } else {
          message.error("Item Already Exist");
        }
      } else if (requisitionObj.CategoryId !== null) {
        const filterClosing = RequisitionDetail.filter(
          (e) => e.CategoryId === requisitionObj.CategoryId
        );
        if (filterClosing.length === 0) {
          const productDetail = supportingTable.Table5.filter((ob) => {
            if (ob.CategoryId === requisitionObj.CategoryId) {
              if (ob.BranchId === formFields.BranchId || ob.BranchId === null) {
                return (ob.RequestedQuantityInPurchase = 1);
              }
            }
          });
          if (productDetail.length === 0) {
            message.error("Inventory items not found!");
            return;
          }
          setRequisitionDetail([...RequisitionDetail, ...productDetail]);
          setRequisitionObj({
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

  const closeFormDetail = () => {
    setRequisitionDetail([]);
    setRequisitionObj({
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
          "/CrudRequisition",
          {
            ...initialFormValues,
            RequisitionId: id,
            Date: date,
            RequisitionDetail: [],
          },
          controller,
          userData
        )
      );
    } else {
      message.error("Record cant be deleted!");
    }
  };

  const removeRequisitionDetail = (index) => {
    let arr = RequisitionDetail;
    arr.splice(index, 1);
    setRequisitionDetail([...arr]);
  };

  const handleFormSubmit = (e, id, submit, closeForm) => {
    e.preventDefault();
    delete formFields.IsSubmitted;
    formFields.IsSubmit = submit;

    if (formFields.Date === null) {
      message.error("Date cant be empty");
      return;
    }
    if (RequisitionDetail.length === 0) {
      message.error("Requisition detail is required!");
      return;
    }

    const reqDet = RequisitionDetail.filter(
      (e) => parseInt(e.RequestedQuantityInPurchase) === 0
    );

    if (reqDet.length > 0) {
      message.error("Requisition Quantity is required!");
      return;
    }

    dispatch(
      submitForm(
        "/CrudRequisition",
        { ...formFields, RequisitionDetail: RequisitionDetail },
        initialFormValues,
        controller,
        userData,
        id,
        (tables) => {
          delete tables.Table;
          const tablesToSet = {
            Table: tables.Table1,
          };
          dispatch({ type: SET_SUPPORTING_TABLE, payload: tablesToSet });
          closeForm();
          closeFormDetail();
        }
      )
    );
  };

  const viewReport = (record, handlePrint) => {
    postRequest(
      "/requisitiondetailreport",
      {
        RequisitionId: record.RequisitionId,
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
        body: htmlBody.html,
        totalQty: htmlBody.totalPurchaseQty,
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

  const searchPanel = (
    <Fragment>
      <FormTextField
        colSpan={4}
        label="Requisition Number"
        name="RequisitionNumber"
        size={INPUT_SIZE}
        value={searchFields.RequisitionNumber}
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
        label="Requisition Date"
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
        label="Requisition"
        name="RequisitionNumber"
        size={INPUT_SIZE}
        value={formFields.RequisitionNumber}
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
        required
        disabled={
          formFields?.IsSubmit === true
            ? true
            : RequisitionDetail.length > 0
            ? true
            : false
        }
      />

      <FormTextField
        colSpan={6}
        label="Requistion Date"
        type="date"
        name="Date"
        size={INPUT_SIZE}
        value={formFields.Date}
        onChange={handleFormChange}
        disabled={formFields?.IsSubmit === true ? true : false}
      />

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
            value={requisitionObj.CategoryId || ""}
            onChange={handleRequisitionObjChange}
            disabled={formFields?.IsSubmit === true ? true : false}
          />
          <FormSelect
            colSpan={6}
            listItem={
              (requisitionObj.CategoryId !== null &&
                supportingTable.Table4?.filter(
                  (e) => e.ProductCategoryId === requisitionObj.CategoryId
                )) ||
              []
            }
            idName="ProductId"
            valueName="ProductName"
            size={INPUT_SIZE}
            name="ProductId"
            label="Product"
            value={requisitionObj.ProductId || ""}
            onChange={handleRequisitionObjChange}
            disabled={formFields?.IsSubmit === true ? true : false}
          />
          <FormSelect
            colSpan={6}
            listItem={
              (requisitionObj.ProductId !== null &&
                supportingTable.Table5?.filter(
                  (e) => e.ProductId === requisitionObj.ProductId
                )) ||
              []
            }
            idName="ProductDetailId"
            valueName="ProductSizeName"
            size={INPUT_SIZE}
            name="ProductDetailId"
            label="Product Detail"
            value={requisitionObj.ProductDetailId || ""}
            onChange={handleRequisitionObjChange}
            disabled={formFields?.IsSubmit === true ? true : false}
          />
          <FormTextField
            colSpan={6}
            label="Barcode"
            name="Barcode"
            size={INPUT_SIZE}
            value={requisitionObj.Barcode}
            onChange={handleRequisitionObjChange}
            disabled={formFields?.IsSubmit === true ? true : false}
          />
          <FormButton
            colSpan={6}
            title="Add"
            type="primary"
            size={BUTTON_SIZE}
            colStyle={{ display: "flex", alignItems: "flex-end" }}
            onClick={handleRequisitionOptionAdd}
            disabled={formFields?.IsSubmit === true ? true : false}
          />
        </Row>
      </Col>
      <Col span={24}>
        <Table
          columns={columnsRequisitionDetail}
          dataSource={RequisitionDetail}
        />
      </Col>
    </Fragment>
  );

  return (
    <Fragment>
      <BasicFormComponent
        formTitle="Purchase Requisitions"
        searchPanel={searchPanel}
        formPanel={formPanel}
        searchSubmit={handleSearchSubmit}
        onFormSave={handleFormSubmit}
        tableRows={itemList}
        tableLoading={tableLoading}
        formLoading={formLoading}
        tableColumn={columns}
        deleteRow={handleDeleteRow}
        actionID="RequisitionId"
        editRow={setUpdateId}
        fields={initialFormValues}
        crudTitle="Purchase Requisition"
        formWidth="70vw"
        showSubmit={true}
        onFormClose={closeFormDetail}
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

export default Requisition;
