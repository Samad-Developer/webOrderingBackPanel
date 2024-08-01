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
  CityName: "",
  CityId: null,
  ProvinceId: null,
  CountryId: null,
};

const initialSearchValues = {
  CountryName: "",
  ProvinceName: "",
  CityName: "",
  CityId: null,
  ProvinceId: null,
  CountryId: null,
};

const columns = [
  {
    title: "City Name",
    dataIndex: "CityName",
    key: "CityName",
  },
  {
    title: "Province",
    dataIndex: "ProvinceName",
    key: "ProvinceName",
  },
  {
    title: "Country",
    dataIndex: "CountryName",
    key: "CountryName",
  },
];

const Cities = () => {
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
        "/CrudCity",
        {
          CountryName: "",
          ProvinceName: "",
          CityName: "",
          CityId: null,
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
        payload: itemList.filter((item) => item.CityId === updateId)[0],
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
    searchFields.CityName = searchFields.CityName.trim();
    dispatch(
      setInitialState(
        "/CrudCity",
        searchFields,
        initialFormValues,
        searchFields,
        controller,
        userData
      )
    );
  };

  const handleDeleteRow = (id) => {
    dispatch(deleteRow("/CrudCity", { CityId: id }, controller, userData));
  };

  const handleFormSubmit = (e, id, _, closeForm) => {
    e.preventDefault();
    dispatch(
      submitForm(
        "/CrudCity",
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

      <FormSelect
        colSpan={4}
        listItem={supportingTable.Table2 || []}
        idName="ProvinceId"
        valueName="ProvinceName"
        size={INPUT_SIZE}
        name="ProvinceId"
        label="Province"
        value={searchFields.ProvinceId}
        onChange={handleSearchChange}
      />

      <FormTextField
        colSpan={4}
        label="City Name"
        name="CityName"
        size={INPUT_SIZE}
        value={searchFields.CityName}
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

      <FormSelect
        colSpan={8}
        listItem={
          supportingTable.Table2
            ? supportingTable.Table2.filter(
              (item) => item.CountryId === formFields.CountryId
            )
            : []
        }
        disabled={!supportingTable.Table2 || formFields.CountryId === null}
        idName="ProvinceId"
        valueName="ProvinceName"
        size={INPUT_SIZE}
        name="ProvinceId"
        label="Province"
        value={formFields.ProvinceId}
        onChange={handleFormChange}
      />

      <FormTextField
        colSpan={8}
        label="City Name"
        name="CityName"
        size={INPUT_SIZE}
        value={formFields.CityName}
        onChange={handleFormChange}
        required={true}
      />
    </Fragment>
  );

  return (
    <BasicFormComponent
      formTitle="Cities"
      searchPanel={searchPanel}
      formPanel={formPanel}
      searchSubmit={handleSearchSubmit}
      onFormSave={handleFormSubmit}
      tableRows={itemList}
      tableLoading={tableLoading}
      formLoading={formLoading}
      tableColumn={columns}
      deleteRow={handleDeleteRow}
      actionID="CityId"
      editRow={setUpdateId}
      fields={initialFormValues}
      crudTitle="City"
    />
  );
};

export default Cities;
