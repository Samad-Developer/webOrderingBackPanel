import { PercentageOutlined } from "@ant-design/icons";
import React, { Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { INPUT_SIZE } from "../../common/ThemeConstants";
import BasicFormComponent from "../../components/formComponent/BasicFormComponent";
import FormSelect from "../../components/general/FormSelect";
import FormTextField from "../../components/general/FormTextField";
import {
  deleteRow,
  resetState,
  setFormFieldValue,
  setInitialState,
  setSearchFieldValue,
  submitForm,
} from "../../redux/actions/basicFormAction";
import { UPDATE_FORM_FIELD } from "../../redux/reduxConstants";

const initialFormValues = {
  GSTName: "",
  CityId: null,
  GSTPercentage: null,
  PaymentModeId: null,
};

const initialSearchValues = {
  GstName: "",
  CityId: null,
  GstPercentage: null,
  PaymentModeId: null,
};

const columns = [
  {
    title: "Tax Name",
    dataIndex: "GSTName",
    key: "GSTName",
  },
  {
    title: "Tax Percentage",
    dataIndex: "GSTPercentage",
    key: "GSTPercentage",
  },
  {
    title: "City Name",
    dataIndex: "CityName",
    key: "CityName",
  },
  {
    title: "Payment Type",
    dataIndex: "PaymentMode",
    key: "PaymentMode",
  },
];

const Gst = () => {
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
        "/CrudGst",
        initialFormValues,
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
        payload: itemList.filter((item) => item.GSTId === updateId)[0],
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

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    searchFields.GstName = searchFields.GstName.trim();
    searchFields.GstPercentage =
      searchFields.GstPercentage === ""
        ? null
        : searchFields.GstPercentage === null
          ? searchFields.GstPercentage
          : parseInt(searchFields.GstPercentage);
    dispatch(
      setInitialState(
        "/CrudGst",
        searchFields,
        initialFormValues,
        searchFields,
        controller,
        userData
      )
    );
  };

  const handleDeleteRow = (id) => {
    dispatch(deleteRow("/CrudGst", { GstId: id }, controller, userData));
  };

  const handleFormSubmit = (e, id, _, closeForm) => {
    e.preventDefault();
    dispatch(
      submitForm(
        "/CrudGst",
        formFields,
        initialFormValues,
        controller,
        userData,
        id
      )
    );
    closeForm();
  };

  const searchPanel = (
    <Fragment>
      <FormTextField
        colSpan={4}
        label="Tax Name"
        name="GstName"
        size={INPUT_SIZE}
        value={searchFields.GstName}
        onChange={handleSearchChange}
      />
      <FormTextField
        colSpan={4}
        label="Tax Percentage"
        name="GstPercentage"
        size={INPUT_SIZE}
        value={searchFields.GstPercentage}
        onChange={handleSearchChange}
        isNumber="true"
        suffix={<PercentageOutlined />}
      />
      <FormSelect
        colSpan={4}
        listItem={supportingTable.Table1 || []}
        disabled={!supportingTable.Table1}
        idName="CityId"
        valueName="CityName"
        size={INPUT_SIZE}
        name="CityId"
        label="City Name"
        value={searchFields.CityId}
        onChange={handleSearchChange}
      />
    </Fragment>
  );

  const formPanel = (
    <Fragment>
      <FormTextField
        colSpan={8}
        label="Tax Name"
        name="GSTName"
        size={INPUT_SIZE}
        value={formFields.GSTName}
        onChange={handleFormChange}
        required={true}
      />
      <FormTextField
        colSpan={8}
        label="Tax Percentage"
        name="GSTPercentage"
        size={INPUT_SIZE}
        value={formFields.GSTPercentage}
        onChange={handleFormChange}
        isNumber="true"
        suffix={<PercentageOutlined />}
        required={true}
      />
      <FormSelect
        colSpan={8}
        listItem={supportingTable.Table1 || []}
        disabled={!supportingTable.Table1}
        idName="CityId"
        valueName="CityName"
        size={INPUT_SIZE}
        name="CityId"
        label="City Name"
        value={formFields.CityId}
        onChange={handleFormChange}
        required={true}
      />
      <FormSelect
        colSpan={8}
        listItem={supportingTable.Table2 || []}
        disabled={!supportingTable.Table2}
        idName="PaymentModeId"
        valueName="PaymentMode"
        size={INPUT_SIZE}
        name="PaymentModeId"
        label="Payment"
        value={formFields.PaymentModeId}
        onChange={handleFormChange}
        required={true}
      />
    </Fragment>
  );

  return (
    <BasicFormComponent
      formTitle="Tax"
      searchPanel={searchPanel}
      formPanel={formPanel}
      searchSubmit={handleSearchSubmit}
      onFormSave={handleFormSubmit}
      tableRows={itemList}
      tableLoading={tableLoading}
      formLoading={formLoading}
      tableColumn={columns}
      deleteRow={handleDeleteRow}
      actionID="GSTId"
      editRow={setUpdateId}
      fields={initialFormValues}
    />
  );
};

export default Gst;
