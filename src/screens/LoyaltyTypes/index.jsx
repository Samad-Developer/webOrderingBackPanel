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
  CountryName: "",
  ProvinceName: "",
  ProvinceId: null,
  CountryId: null,
};

const initialSearchValues = {
  CountryName: "",
  ProvinceName: "",
  ProvinceId: null,
  CountryId: null,
};

const columns = [
  {
    title: "Province Name",
    dataIndex: "ProvinceName",
    key: "ProvinceName",
  },
  {
    title: "Country",
    dataIndex: "CountryName",
    key: "CountryName",
  },
];

const LoyaltyTypes = () => {
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
        "/CrudProvince",
        {
          CountryName: "",
          ProvinceName: "",
          CountryId: null,
          ProvinceId: null,
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
      dispatch({
        type: UPDATE_FORM_FIELD,
        payload: itemList.filter((item) => item.ProvinceId === updateId)[0],
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
    searchFields.ProvinceName = searchFields.ProvinceName.trim();
    dispatch(
      setInitialState(
        "/CrudProvince",
        searchFields,
        initialFormValues,
        searchFields,
        controller,
        userData
      )
    );
  };

  const handleDeleteRow = (id) => {
    dispatch(
      deleteRow("/CrudProvince", { ProvinceId: id }, controller, userData)
    );
  };

  const handleFormSubmit = (e, id, _, closeForm) => {
    e.preventDefault();
    dispatch(
      submitForm(
        "/CrudProvince",
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
      <FormSelect
        colSpan={4}
        listItem={supportingTable.Table1 || []}
        idName="CountryId"
        valueName="CountryName"
        size={INPUT_SIZE}
        name="CountryId"
        label="Country"
        value={searchFields.CountryId}
        onChange={handleSearchChange}
      />

      <FormTextField
        colSpan={4}
        label="Province Name"
        name="ProvinceName"
        size={INPUT_SIZE}
        value={searchFields.ProvinceName}
        onChange={handleSearchChange}
      />
    </Fragment>
  );

  const formPanel = (
    <Fragment>
      <FormSelect
        colSpan={8}
        listItem={supportingTable.Table1 || []}
        idName="CountryId"
        valueName="CountryName"
        size={INPUT_SIZE}
        name="CountryId"
        label="Country"
        value={formFields.CountryId}
        onChange={handleFormChange}
      />
      <FormTextField
        colSpan={8}
        label="Province Name"
        name="ProvinceName"
        size={INPUT_SIZE}
        value={formFields.ProvinceName}
        onChange={handleFormChange}
        required={true}
      />
    </Fragment>
  );

  return (
    <BasicFormComponent
      formTitle="Loyality Types"
      searchPanel={searchPanel}
      formPanel={formPanel}
      searchSubmit={handleSearchSubmit}
      onFormSave={handleFormSubmit}
      tableRows={itemList}
      tableLoading={tableLoading}
      formLoading={formLoading}
      tableColumn={columns}
      deleteRow={handleDeleteRow}
      actionID="ProvinceId"
      editRow={setUpdateId}
      fields={initialFormValues}
    />
  );
};

export default LoyaltyTypes;
