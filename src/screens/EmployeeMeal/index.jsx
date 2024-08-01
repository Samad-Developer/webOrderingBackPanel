import { Button, Col, Input, message, Row, Table } from "antd";
import { useState } from "react";
import { CloseOutlined } from "@ant-design/icons";
import { useEffect } from "react";
import { Fragment } from "react";
import { useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BUTTON_SIZE, INPUT_SIZE } from "../../common/ThemeConstants";
import BasicFormComponent from "../../components/formComponent/BasicFormComponent";
import FormButton from "../../components/general/FormButton";
import FormSelect from "../../components/general/FormSelect";
import FormTextField from "../../components/general/FormTextField";
import ComponentToPrint from "../../components/specificComponents/ComponentToPrint";
import {
  deleteRow,
  resetState,
  setFormFieldValue,
  setInitialState,
  setSearchFieldValue,
  submitForm,
} from "../../redux/actions/basicFormAction";
import { postRequest } from "../../services/mainApp.service";
import { UPDATE_FORM_FIELD } from "../../redux/reduxConstants";

const initialFormValues = {
  OperationId: null,
  BranchId: null,
  UserId: null,
  UserIP: "",
  IsSubmit: false,
  CompanyId: null,
  MealMasterId: null,
  MealDetail: [],
  Date: "",
  MealNumber: "",
  EmployeeName: "",
};

const initialSearchValues = {
  OperationId: null,
  BranchId: null,
  UserId: null,
  UserIP: "",
  IsSubmit: false,
  CompanyId: null,
  MealMasterId: null,
  MealDetail: [],
  Date: "",
  MealNumber: "",
  EmployeeName: "",
};

const columns = [
  {
    title: "Meal Number",
    dataIndex: "EmployeeMealNumber",
    key: "EmployeeMealNumber",
  },
  {
    title: "Date",
    key: "Date",
    render: (_, record) => {
      return <div>{record.Date?.split("T")[0]}</div>;
    },
  },

  {
    title: "Branch",
    dataIndex: "BranchName",
    key: "BranchName",
  },
  {
    title: "Employee Name",
    dataIndex: "EmployeeName",
    key: "EmployeeName",
  },

  {
    title: "Is Approved",
    key: "IsApproved",
    render: (_, record) => {
      return (
        <div>{record.IsApproved === true ? "Approved" : "Not Approved"}</div>
      );
    },
  },
  {
    title: "Is Submit",
    key: "IsSubmit",
    render: (_, record) => {
      return (
        <div>{record.IsSubmit === true ? "Submitted" : "Not Submitted"}</div>
      );
    },
  },
];

const EmployeeMeal = () => {
  const dispatch = useDispatch();
  const controller = new window.AbortController();
  const userData = useSelector((state) => state.authReducer);
  const componentRefPrint = useRef();
  const [updateId, setUpdateId] = useState(null);
  const [htmlReport, setHtmlReport] = useState("");
  const [mealDetail, setMealDetails] = useState([]);

  const [demandObj, setDemandObj] = useState({
    CategoryId: null,
    ProductDetailId: null,
    ProductId: null,
  });

  const {
    formFields,
    searchFields,
    itemList,
    formLoading,
    tableLoading,
    supportingTable,
  } = useSelector((state) => state.basicFormReducer);

  const handleMealDetailChange = (event, record, name) => {
    const mealdetailArray = mealDetail;
    const index = mealdetailArray.findIndex(
      (x) => x.ProductDetailId === record.ProductDetailId
    );
    if (index > -1) {
      let closeDet = mealdetailArray[index];
      closeDet[name] = event.target.value;
      closeDet = { ...closeDet, ApprovedQuantity: event.target.value };
      mealdetailArray[index] = closeDet;
      setMealDetails([...mealdetailArray]);
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
      dataIndex: "ProductName",
      key: "ProductName",
    },
    {
      title: "Size",
      dataIndex: "SizeName",
      key: "SizeName",
    },
    {
      title: "Variant",
      dataIndex: "FlavourName",
      key: "FlavourName",
    },
    {
      title: "Quantity",
      key: "Quantity",
      render: (_, record) => {
        return (
          <Input
            value={parseInt(record.Quantity)}
            onChange={(event) =>
              handleMealDetailChange(event, record, "Quantity")
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
        "/CrudEmployeeMeal",
        {
          ...initialSearchValues,
          EmployeeName: `%${initialFormValues.EmployeeName}%`,
          MealNumber: `%${initialFormValues.MealNumber}%`,
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
        (item) => item.MealMasterId === updateId
      )[0];

      dispatch({
        type: UPDATE_FORM_FIELD,
        payload: { ...editObj, Date: editObj.Date.split("T")[0] },
      });

      postRequest(
        "/CrudEmployeeMeal",
        {
          ...initialFormValues,
          Date: formFields.Date,
          MealDetail: [],
          MealMasterId: updateId,
          OperationId: 5,
          CompanyId: userData.CompanyId,
          UserId: userData.UserId,
          UserIP: "1.2.2.1",
          BranchId: formFields.BranchId,
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

        setMealDetails([...response.data.DataSet.Table]);
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
        "/CrudEmployeeMeal",
        {
          ...searchFields,
          MealDetail: [],
          MealNumber: `%${searchFields.MealNumber}%`,
          EmployeeName: `%${searchFields.EmployeeName}%`,
        },
        initialFormValues,
        searchFields,
        controller,
        userData
      )
    );
  };

  const handleDemandOptionAdd = () => {
    if (formFields.BranchId === null) {
      message.error("Select Branch first!");
      return;
    }
    if (
      demandObj.ProductDetailId !== null &&
      demandObj.ProductId !== null &&
      demandObj.CategoryId !== null
    ) {
      const isItemAdded = mealDetail.filter(
        (e) => e.ProductDetailId === demandObj.ProductDetailId
      );
      if (isItemAdded.length === 0) {
        const productDetail = supportingTable.Table4.filter(
          (ob) => ob.ProductDetailId === demandObj.ProductDetailId
        ).map((ob) => {
          ob.Quantity = 1;
          return ob;
        });
        if (productDetail.length === 0) {
          message.error("Inventory items not found!");
          return;
        }

        setMealDetails([...mealDetail, ...productDetail]);
        setDemandObj({
          ProductDetailId: null,
          ProductId: null,
          CategoryId: null,
        });
      } else {
        message.error("Item Already Exist");
      }
    } else if (demandObj.CategoryId !== null && demandObj.ProductId !== null) {
      const isItemAdded = mealDetail.filter(
        (e) => e.ProductId === demandObj.ProductId
      );
      if (isItemAdded.length === 0) {
        const productDetail = supportingTable.Table4.filter(
          (ob) => ob.ProductId === demandObj.ProductId
        ).map((ob) => {
          ob.Quantity = 1;
          return ob;
        });
        if (productDetail.length === 0) {
          message.error("Inventory items not found!");
          return;
        }
        setMealDetails([...mealDetail, ...productDetail]);
        setDemandObj({
          ProductDetailId: null,
          ProductId: null,
          CategoryId: null,
        });
      } else {
        message.error("Item Already Exist");
      }
    } else if (demandObj.CategoryId !== null) {
      const isItemAdded = mealDetail.filter(
        (e) => e.CategoryId === demandObj.CategoryId
      );
      if (isItemAdded.length === 0) {
        const productDetail = supportingTable.Table4.filter(
          (ob) => ob.CategoryId === demandObj.CategoryId
        ).map((ob) => {
          ob.Quantity = 1;
          return ob;
        });

        if (productDetail.length === 0) {
          message.error("Inventory items not found!");
          return;
        }

        setMealDetails([...mealDetail, ...productDetail]);
        setDemandObj({
          ProductDetailId: null,
          ProductId: null,
          CategoryId: null,
        });
      } else {
        message.error("Item Already Exist");
      }
    } else {
      message.error("Fill all the required fields!");
    }
  };

  const closeForm = () => {
    setMealDetails([]);
    setDemandObj({
      ProductDetailId: null,
      CategoryId: null,
      ProductId: null,
    });
  };

  const handleDeleteRow = (id, record) => {
    if (record.IsSubmit === false) {
      dispatch(
        deleteRow(
          "/CrudEmployeeMeal",
          {
            ...initialFormValues,
            MealMasterId: id,
            Date: formFields.Date,
            MealDetail: [],
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
    let arr = mealDetail;
    arr.splice(index, 1);
    setMealDetails([...arr]);
  };

  const handleFormSubmit = (e, id, submit, closeForm) => {
    e.preventDefault();
    const formFieldClones = { ...formFields };
    formFieldClones.IsSubmit = submit;

    if (mealDetail.length === 0) {
      message.error("Meal detail is required!");
      return;
    }

    const arr = mealDetail.filter((e) => {
      return e.Quantity === undefined || e.Quantity <= 0;
    });

    if (arr.length > 0) {
      message.error("Quantity is Required!");
      return;
    }
    const filteredFieldsInMealDetails = mealDetail.map((md) => {
      return {
        ProductDetailId: md.ProductDetailId,
        Quantity: md.Quantity,
        ApprovedQuantity: md.Quantity,
      };
    });

    dispatch(
      submitForm(
        "/CrudEmployeeMeal",
        {
          ...formFieldClones,
          MealDetail: filteredFieldsInMealDetails,
        },
        initialFormValues,
        controller,
        userData,
        id
      )
    );
    closeForm();
  };

  const viewReport = (record, handlePrint) => {
    postRequest(
      "/CrudEmployeeMeal",
      {
        DemandId: record.MealMasterId,
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
        label="Employee Name"
        name="EmployeeName"
        size={INPUT_SIZE}
        value={searchFields.EmployeeName}
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
        label="Employee Number"
        name="MealNumber"
        size={INPUT_SIZE}
        value={searchFields.MealNumber}
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
        label="Employee Name"
        name="EmployeeName"
        size={INPUT_SIZE}
        value={formFields.EmployeeName}
        onChange={handleFormChange}
        // disabled={true}
        required
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
            : mealDetail.length > 0
            ? true
            : false
        }
      />
      <FormTextField
        colSpan={6}
        label="Date"
        type="date"
        name="Date"
        size={INPUT_SIZE}
        value={formFields.Date}
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
            disabled={formFields?.IsSubmit === true ? true : false}
          />
          <FormSelect
            colSpan={6}
            listItem={
              (demandObj.CategoryId !== null &&
                supportingTable.Table3?.filter(
                  (e) => e.CategoryId === demandObj.CategoryId
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
            disabled={formFields?.IsSubmit === true ? true : false}
          />
          <FormSelect
            colSpan={6}
            listItem={
              (demandObj.ProductId !== null &&
                supportingTable.Table4?.filter(
                  (e) => e.ProductId === demandObj.ProductId
                )) ||
              []
            }
            idName="ProductDetailId"
            valueName="ProductDetailName"
            size={INPUT_SIZE}
            name="ProductDetailId"
            label="Product Detail"
            value={demandObj.ProductDetailId || ""}
            onChange={handleDemandObjChange}
            disabled={formFields?.IsSubmit === true ? true : false}
          />

          <FormButton
            colSpan={6}
            title="Add"
            type="primary"
            size={BUTTON_SIZE}
            colStyle={{ display: "flex", alignItems: "flex-end" }}
            onClick={handleDemandOptionAdd}
            disabled={formFields?.IsSubmit === true ? true : false}
          />
        </Row>
      </Col>
      <Col span={24}>
        <Table columns={columnsDemandDetail} dataSource={mealDetail} />
      </Col>
    </Fragment>
  );

  return (
    <Fragment>
      <BasicFormComponent
        formTitle="Employee Meal"
        searchPanel={searchPanel}
        formPanel={formPanel}
        searchSubmit={handleSearchSubmit}
        onFormSave={handleFormSubmit}
        tableRows={itemList}
        tableLoading={tableLoading}
        formLoading={formLoading}
        tableColumn={columns}
        deleteRow={handleDeleteRow}
        actionID="MealMasterId"
        editRow={setUpdateId}
        fields={initialFormValues}
        crudTitle="Employee Meal"
        formWidth="70vw"
        showSubmit={true}
        onFormClose={closeForm}
        disableSaveAndSubmit={formFields.IsSubmit === true ? true : false}
        // report={true}
        viewReport={viewReport}
        componentRefPrint={componentRefPrint}
      />
      <div style={{ display: "none" }}>
        <ComponentToPrint ref={componentRefPrint} Bill={htmlReport} />
      </div>
    </Fragment>
  );
};

export default EmployeeMeal;
