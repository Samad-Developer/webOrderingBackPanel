import React, { Fragment, useEffect, useState } from "react";
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
import { INPUT_SIZE } from "../../../common/ThemeConstants";
import BasicFormComponent from "../../../components/formComponent/BasicFormComponent";
import FormTextField from "../../../components/general/FormTextField";
import { UPDATE_FORM_FIELD } from "../../../redux/reduxConstants";
import FormSelect from "../../../components/general/FormSelect";
import { Col, DatePicker, message } from "antd";
import moment from "moment";
import { compareDate, getDate } from "../../../functions/dateFunctions";
const initialSearchValues = {
  BatchId: null,
  ProductDetailId: null,
  ManufactureDate: "",
  ExpiryDate: "",
  CategoryId: null,
  ProductId: null,
  ProductSizeId: null,
  FlavorId: null,
  BatchNumber: null,
};

const initialFormValues = {
  BatchId: null,
  ProductDetailId: null,
  ManufactureDate: "",
  ExpiryDate: "",
  CategoryId: null,
  ProductId: null,
  ProductSizeId: null,
  FlavorId: null,
  BatchNumber: null,
};

const columns = [
  {
    title: "Product",
    dataIndex: "ProductName",
    key: "ProductName",
  },
  {
    title: "Product Category",
    dataIndex: "CategoryName",
    key: "CategoryName",
  },
  {
    title: "Product Detail",
    dataIndex: "ProductDetailName",
    key: "ProductDetailName",
  },
  {
    title: "Batch Number",
    dataIndex: "BatchNumber",
    key: "BatchNumber",
  },
  {
    title: "Manufacturer Date",

    key: "ManufactureDate",
    render: (record) => {
      const splitDate = record.ManufactureDate?.split("T")[0];
      return splitDate;
    },
  },
  {
    title: "Expiry Date",

    key: "ExpiryDate",
    render: (record) => {
      const splitDate = record.ExpiryDate?.split("T")[0];
      return splitDate;
    },
  },
];

const Batch = () => {
  const dispatch = useDispatch();
  const controller = new window.AbortController();
  const userData = useSelector((state) => state.authReducer);
  const [updateId, setUpdateId] = useState(null);

  const {
    formFields,
    searchFields,
    itemList,
    formLoading,
    tableLoading,
    supportingTable,
  } = useSelector((state) => state.basicFormReducer);

  useEffect(() => {
    dispatch(
      setInitialState(
        "/CrudBatch",
        initialSearchValues,
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
        payload: itemList.filter((item) => item.BatchId === updateId)[0],
      });
    }
    setUpdateId(null);
  }, [updateId]);

  const handleSearchChange = (data) => {
    if (data.name === "BatchNumber" && data.value === "") data.value = null;
    dispatch(setSearchFieldValue(data));
  };

  const handleFormChange = (data) => {
    dispatch(setFormFieldValue(data));
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();

    dispatch(
      setInitialState(
        "/CrudBatch",
        searchFields,
        initialFormValues,
        searchFields,
        controller,
        userData
      )
    );
  };

  const handleDeleteRow = (id) => {
    dispatch(deleteRow("/CrudBatch", { BatchId: id }, controller, userData));
  };

  const handleFormSubmit = (e, id, submit, close) => {
    e.preventDefault();

    const comparedDate = compareDate(
      getDate(formFields.ManufactureDate),
      getDate(formFields.ExpiryDate)
    );

    if (comparedDate === false) {
      message.error("Manufacturing date cant be greater than expiry date");
      return;
    }

    dispatch(
      submitForm(
        "/CrudBatch",
        formFields,
        initialFormValues,
        controller,
        userData,
        id
      )
    );
    close();
  };

  const searchPanel = (
    <Fragment>
      <FormSelect
        colSpan={4}
        listItem={supportingTable.Table1 || []}
        disabled={!supportingTable.Table1}
        idName="CategoryId"
        valueName="CategoryName"
        size={INPUT_SIZE}
        name="CategoryId"
        label="Product Category"
        value={searchFields.CategoryId}
        onChange={handleSearchChange}
      />
      <FormSelect
        colSpan={4}
        listItem={supportingTable.Table2 || []}
        idName="ProductId"
        valueName="ProductName"
        size={INPUT_SIZE}
        name="ProductId"
        label="Product"
        value={searchFields.ProductId}
        onChange={handleSearchChange}
      />

      <FormSelect
        colSpan={4}
        listItem={supportingTable.Table3 || []}
        idName="ProductDetailId"
        valueName="ProductDetailName"
        size={INPUT_SIZE}
        name="ProductDetailId"
        label="Product Detail"
        value={searchFields.ProductDetailId}
        onChange={handleSearchChange}
      />
      <FormTextField
        colSpan={4}
        label="Batch Number"
        name="BatchNumber"
        size={INPUT_SIZE}
        value={searchFields.BatchNumber}
        onChange={handleSearchChange}
      />
      <Col span={4}>
        <div>Manufacturer Date</div>
        <FormTextField
          type="date"
          style={{ width: "100%" }}
          value={
            searchFields.ManufactureDate
              ? searchFields.ManufactureDate
              : searchFields.ManufactureDate
          }
          onChange={(e) => {
            handleSearchChange({ name: "ManufactureDate", value: e.value });
          }}
          allowClear={false}
        />
      </Col>

      <Col span={4}>
        <div>Expiry Date</div>
        <FormTextField
          type="date"
          style={{ width: "100%" }}
          value={
            searchFields.ExpiryDate
              ? searchFields.ExpiryDate
              : searchFields.ExpiryDate
          }
          onChange={(e) => {
            handleSearchChange({ name: "ExpiryDate", value: e.value });
          }}
          allowClear={false}
        />
      </Col>
    </Fragment>
  );

  const formPanel = (
    <Fragment>
      <FormSelect
        colSpan={8}
        listItem={supportingTable.Table1 || []}
        disabled={!supportingTable.Table1}
        idName="CategoryId"
        valueName="CategoryName"
        size={INPUT_SIZE}
        name="CategoryId"
        label="Product Category"
        value={formFields.CategoryId}
        onChange={handleFormChange}
        required
      />
      <FormSelect
        colSpan={8}
        listItem={
          supportingTable.Table2?.filter(
            (e) => e.ProductCategoryId === formFields.CategoryId
          ) || []
        }
        idName="ProductId"
        valueName="ProductName"
        size={INPUT_SIZE}
        name="ProductId"
        label="Product"
        value={formFields.ProductId}
        onChange={handleFormChange}
        required
      />

      <FormSelect
        colSpan={8}
        listItem={
          supportingTable.Table3?.filter(
            (e) => e.ProductId === formFields.ProductId
          ) || []
        }
        idName="ProductDetailId"
        valueName="ProductDetailName"
        size={INPUT_SIZE}
        name="ProductDetailId"
        label="Product Detail"
        value={formFields.ProductDetailId}
        onChange={handleFormChange}
        required
      />

      <FormTextField
        colSpan={8}
        label="Batch Number"
        name="BatchNumber"
        size={INPUT_SIZE}
        value={formFields.BatchNumber}
        onChange={handleFormChange}
        required
      />
      <Col span={8}>
        <div>Manufacturer Date</div>
        <FormTextField
          type="date"
          style={{ width: "100%" }}
          value={moment(formFields.ManufactureDate).format("yyyy-MM-DD")}
          onChange={(e) => {
            handleFormChange({ name: "ManufactureDate", value: e.value });
          }}
          allowClear={false}
        />
      </Col>

      <Col span={8}>
        <div>Expiry Date</div>
        <FormTextField
          type="date"
          style={{ width: "100%" }}
          value={moment(new Date(formFields.ExpiryDate)).format("yyyy-MM-DD")}
          onChange={(e) => {
            handleFormChange({ name: "ExpiryDate", value: e.value });
          }}
          allowClear={false}
        />
      </Col>
    </Fragment>
  );

  return (
    <BasicFormComponent
      formTitle="Batch"
      searchPanel={searchPanel}
      formPanel={formPanel}
      searchSubmit={handleSearchSubmit}
      onFormSave={handleFormSubmit}
      tableRows={itemList}
      tableLoading={tableLoading}
      formLoading={formLoading}
      tableColumn={columns}
      deleteRow={handleDeleteRow}
      actionID="BatchId"
      editRow={setUpdateId}
      fields={initialFormValues}
    />
  );
};

export default Batch;
