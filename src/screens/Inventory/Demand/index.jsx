import { CloseOutlined } from "@ant-design/icons";
import { Button, Col, Input, message, Row, Table } from "antd";
import React, { Fragment, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BUTTON_SIZE, INPUT_SIZE } from "../../../common/ThemeConstants";
import BasicFormComponent from "../../../components/formComponent/BasicFormComponent";
import FormButton from "../../../components/general/FormButton";
import FormSearchSelect from "../../../components/general/FormSearchSelect";
import FormSelect from "../../../components/general/FormSelect";
import FormTextField from "../../../components/general/FormTextField";
import ComponentToPrint from "../../../components/specificComponents/ComponentToPrint";
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
import { postRequest } from "../../../services/mainApp.service";
import { html, HTMLChunk } from "./demandHtmlReportTemplate";

const initialFormValues = {
  BranchId: null,
  IsSubmit: false,
  StatusId: null,
  DemandMasterId: null,
  DemandDetailList: [],
  DemandDate: null,
};

const initialSearchValues = {
  BranchId: null,
  IsSubmit: false,
  StatusId: null,
  DemandMasterId: null,
  DemandDetailList: [],
  DemandDate: null,
  DemandNumber: "",
};

const columns = [
  {
    title: "Demand Number",
    dataIndex: "DemandNumber",
    key: "DemandNumber",
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
      return <div>{record.IsSubmit === true ? "Submitted" : ""}</div>;
    },
  },
];

const Demand = () => {
  const dispatch = useDispatch();
  const controller = new window.AbortController();
  const userData = useSelector((state) => state.authReducer);
  const componentRefPrint = useRef();

  const [updateId, setUpdateId] = useState(null);

  const [htmlReport, setHtmlReport] = useState("");

  const [DemandDetail, setDemandDetail] = useState([]);

  const [demandObj, setDemandObj] = useState({
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

  const handleDemandDetailChnage = (event, record, name) => {
    const DemandDetailArr = DemandDetail;
    const index = DemandDetailArr.findIndex(
      (x) => x.ProductDetailId === record.ProductDetailId
    );
    if (index > -1) {
      let closeDet = DemandDetailArr[index];
      closeDet[name] = event.target.value;
      DemandDetailArr[index] = closeDet;
      setDemandDetail([...DemandDetailArr]);
    }
  };

  const columnsDemandDetail = [
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
      title: "Stock Quantity",
      dataIndex: "StockQuantity",
      key: "StockQuantity",
    },
    {
      title: "Barcode",
      dataIndex: "Barcode",
      key: "Barcode",
    },
    {
      title: "Demand Quantity",
      key: "DemandQuantityInIssue",
      render: (_, record) => {
        return (
          <Input
            value={parseInt(record.DemandQuantityInIssue)}
            onChange={(event) =>
              handleDemandDetailChnage(event, record, "DemandQuantityInIssue")
            }
            type="number"
            disabled={formFields?.IsSubmit === true ? true : false}
            min={1}
            onKeyPress={(e) => {
              if (e.code === "Minus") {
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
            onClick={() => removeDemandDetail(index)}
          />
        );
      },
    },
  ];

  useEffect(() => {
    dispatch(
      setInitialState(
        "/CrudDemand",
        {
          ...initialSearchValues,
          DemandNumber: "%%",
          DemandDate: searchFields.DemandDate,
          DemandDetailList: [],
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
        (item) => item.DemandMasterId === updateId
      )[0];
      dispatch({
        type: UPDATE_FORM_FIELD,
        payload: { ...editObj, DemandDate: editObj.DemandDate.split("T")[0] },
      });

      postRequest(
        "/CrudDemand",
        {
          ...initialFormValues,
          DemandDate: formFields.DemandDate,
          DemandDetailList: [],
          DemandMasterId: updateId,
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

        setDemandDetail([...response.data.DataSet.Table]);
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

  const handleDemandObjChange = (data) => {
    setDemandObj({ ...demandObj, [data.name]: data.value });
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    dispatch(
      setInitialState(
        "/CrudDemand",
        {
          ...searchFields,
          DemandDetailList: [],
          DemandNumber: `%${searchFields.DemandNumber}%`,
        },
        initialFormValues,
        searchFields,
        controller,
        userData
      )
    );
  };

  const handleDemandOptionAdd = () => {
    const { Barcode, ProductDetailId, CategoryId, ProductId } = demandObj;
    const branchId = formFields.BranchId;

    if (!branchId) {
      message.error("Select Branch first!");
      return;
    }

    const isAlreadyExisting = DemandDetail.find(
      (product) => product.ProductDetailId === ProductDetailId
    );


    if (!!isAlreadyExisting) {
      message.error("Product is already added to the closing inventory");
      return;
    }

    let filterClosing;
    let filterFunction;

    if (Barcode !== "") {
      filterClosing = DemandDetail.filter((e) => e.Barcode === Barcode);
      filterFunction = (ob) =>
        ob.Barcode === Barcode && ob.BranchIds.includes(branchId.toString());
    } else if (ProductDetailId !== null) {
      filterClosing = DemandDetail.filter(
        (e) => e.ProductDetailId === ProductDetailId
      );
      filterFunction = (ob) =>
        ob.ProductDetailId === ProductDetailId &&
        ob.BranchIds.includes(branchId.toString());
    } else if (ProductId !== null && CategoryId !== null) {
      filterClosing = DemandDetail.filter((e) => e.ProductId === ProductId);
      filterFunction = (ob) =>
        ob.ProductId === ProductId && ob.BranchId === branchId;
    } else if (CategoryId !== null) {
      filterClosing = DemandDetail.filter((e) => e.CategoryId === CategoryId);
      filterFunction = (ob) =>
        ob.CategoryId === CategoryId && ob.BranchId === branchId;
    } else {
      message.error("Fill all the required fields!");
    }

    if (filterClosing.length === 0) {
      const productDetail = supportingTable.Table4.filter(filterFunction).map(
        (ob) => {
          ob.DemandQuantityInIssue = 1;
          return ob;
        }
      );

      if (productDetail.length === 0) {
        message.error("Inventory items not found!");
      }
      setDemandObj({
        CategoryId: null,
        ProductDetailId: null,
        ProductId: null,
        Barcode: "",
      });
      setDemandDetail([...DemandDetail, ...productDetail]);
    } else {
      message.error("Item Already Exists");
    }

  };

  const closeForm = () => {
    setDemandDetail([]);
    setDemandObj({
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
          "/CrudDemand",
          {
            ...initialFormValues,
            DemandMasterId: id,
            DemandDate: formFields.DemandDate,
            DemandDetailList: [],
          },
          controller,
          userData
        )
      );
    } else {
      message.error("Record cant be deleted!");
    }
  };

  const removeDemandDetail = (index) => {
    let arr = DemandDetail;
    arr.splice(index, 1);
    setDemandDetail([...arr]);
  };

  const handleFormSubmit = (e, id, submit, closeForm) => {
    e.preventDefault();
    const formFieldClones = { ...formFields };
    delete formFieldClones.IsSubmitted;
    formFieldClones.IsSubmit = submit;

    if (DemandDetail.length === 0) {
      message.error("Demand detail is required!");
      return;
    }

    const arr = DemandDetail.filter((e) => {
      return (
        e.DemandQuantityInIssue === undefined || e.DemandQuantityInIssue <= 0
      );
    });

    if (arr.length > 0) {
      message.error("Demand Quantity is Required!");
      return;
    }
    dispatch(
      submitForm(
        "/CrudDemand",
        {
          ...formFieldClones,
          DemandDetailList: DemandDetail,
        },
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

  const viewReport = (record, handlePrint) => {
    postRequest(
      "/demanddetailreport",
      {
        DemandId: record.DemandMasterId,
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
        label="Demand Number"
        name="DemandNumber"
        size={INPUT_SIZE}
        value={searchFields.DemandNumber}
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
        label="Demand Date"
        type="date"
        name="DemandDate"
        size={INPUT_SIZE}
        value={searchFields.DemandDate}
        onChange={handleSearchChange}
      />
    </Fragment>
  );

  const formPanel = (
    <Fragment>
      <FormTextField
        colSpan={6}
        label="Demand"
        name="DemandNumber"
        size={INPUT_SIZE}
        value={formFields.DemandNumber}
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
            : DemandDetail.length > 0
              ? true
              : false
        }
      />
      <FormTextField
        colSpan={6}
        label="Demand Date"
        type="date"
        name="DemandDate"
        size={INPUT_SIZE}
        value={formFields.DemandDate}
        onChange={handleFormChange}
        disabled={formFields?.IsSubmit === true ? true : false}
        required={true}
      />
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
            value={demandObj.CategoryId || ""}
            onChange={handleDemandObjChange}
            disabled={
              formFields?.IsSubmit === true
                ? true
                : false || formFields.BranchId === ("" || null)
            }
          />
          <FormSelect
            colSpan={6}
            listItem={
              (demandObj.CategoryId !== null &&
                supportingTable.Table3?.filter(
                  (e) => e.ProductCategoryId === demandObj.CategoryId
                )) ||
              []
            }
            idName="ProductId"
            valueName="ProductName"
            size={INPUT_SIZE}
            name="ProductId"
            label="Product"
            value={demandObj.ProductId || ""}
            onChange={handleDemandObjChange}
            disabled={
              formFields?.IsSubmit === true
                ? true
                : false || formFields.BranchId === ("" || null)
            }
          />
          <FormSearchSelect
            colSpan={6}
            listItem={
              supportingTable.Table4?.filter(
                (product) =>
                  (product.ProductId === demandObj.ProductId ||
                    demandObj.ProductId === null) &&
                  (product.CategoryId === demandObj.CategoryId ||
                    demandObj.CategoryId === null)
              ) || []
            }
            idName="ProductDetailId"
            valueName="ProductSizeName"
            size={INPUT_SIZE}
            name="ProductDetailId"
            label="Product Detail"
            value={demandObj.ProductDetailId || ""}
            onChange={handleDemandObjChange}
            disabled={
              formFields?.IsSubmit === true
                ? true
                : false || formFields.BranchId === ("" || null)
            }
          />

          <FormTextField
            colSpan={6}
            label="Barcode"
            name="Barcode"
            size={INPUT_SIZE}
            value={demandObj.Barcode}
            onChange={handleDemandObjChange}
            disabled={
              formFields?.IsSubmit === true
                ? true
                : false || formFields.BranchId === ("" || null)
            }
          />
          <FormButton
            colSpan={6}
            title="Add"
            type="primary"
            size={BUTTON_SIZE}
            colStyle={{ display: "flex", alignItems: "flex-end" }}
            onClick={handleDemandOptionAdd}
            disabled={
              formFields?.IsSubmit === true
                ? true
                : false || formFields.BranchId === ("" || null)
            }
          />
        </Row>
      </Col>
      <Col span={24}>
        <Table columns={columnsDemandDetail} dataSource={DemandDetail} />
      </Col>
    </Fragment>
  );

  return (
    <Fragment>
      <BasicFormComponent
        formTitle="Demand"
        searchPanel={searchPanel}
        formPanel={formPanel}
        searchSubmit={handleSearchSubmit}
        onFormSave={handleFormSubmit}
        tableRows={itemList}
        tableLoading={tableLoading}
        formLoading={formLoading}
        tableColumn={columns}
        deleteRow={handleDeleteRow}
        actionID="DemandMasterId"
        editRow={setUpdateId}
        fields={initialFormValues}
        crudTitle="Demand"
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

export default Demand;
