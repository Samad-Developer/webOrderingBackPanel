import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { INPUT_SIZE } from "../../common/ThemeConstants";
import BasicFormComponent from "../../components/formComponent/BasicFormComponent";
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
  CountryId: null,
  CountryName: "",
};

const initialSearchValues = {
  CountryId: null,
  CountryName: "",
};

const columns = [
  {
    title: "Country",
    dataIndex: "CountryName",
    key: "CountryName",
  },
];

const Country = () => {
  const dispatch = useDispatch();
  const controller = new window.AbortController();
  const userData = useSelector((state) => state.authReducer);

  const [updateId, setUpdateId] = useState(null);

  const { formFields, searchFields, itemList, formLoading, tableLoading } =
    useSelector((state) => state.basicFormReducer);

  useEffect(() => {
    dispatch(
      setInitialState(
        "/CrudCountry",
        { CountryId: null, CountryName: "" },
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
        payload: itemList.filter((item) => item.CountryId === updateId)[0],
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
    searchFields.CountryName = searchFields.CountryName.trim();
    dispatch(
      setInitialState(
        "/CrudCountry",
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
      deleteRow("/CrudCountry", { CountryId: id }, controller, userData)
    );
  };

  const handleFormSubmit = (e, id, _, closeForm) => {
    e.preventDefault();
    dispatch(
      submitForm(
        "/CrudCountry",
        formFields,
        initialFormValues,
        controller,
        userData,
        id
      )
    );
    closeForm()
  };

  const searchPanel = (
    <FormTextField
      colSpan={4}
      label="Country"
      name="CountryName"
      size={INPUT_SIZE}
      value={searchFields.CountryName}
      onChange={handleSearchChange}
    />
  );

  const formPanel = (
    <FormTextField
      colSpan={8}
      label="Country"
      name="CountryName"
      size={INPUT_SIZE}
      value={formFields.CountryName}
      onChange={handleFormChange}
      required={true}
    />
  );

  return (
    <BasicFormComponent
      formTitle="Country"
      searchPanel={searchPanel}
      formPanel={formPanel}
      searchSubmit={handleSearchSubmit}
      onFormSave={handleFormSubmit}
      tableRows={itemList}
      tableLoading={tableLoading}
      formLoading={formLoading}
      tableColumn={columns}
      deleteRow={handleDeleteRow}
      actionID="CountryId"
      editRow={setUpdateId}
      fields={initialFormValues}
    />
  );
};

export default Country;
