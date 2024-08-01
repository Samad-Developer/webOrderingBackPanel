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
  RoleId: null,
  RoleName: "",
  SelectedCompanyId: 0,
};

const initialSearchValues = {
  RoleName: "",
  SelectedCompanyId: 0,
};

const columns = [
  {
    title: "Role Name",
    dataIndex: "RoleName",
    key: "RoleName",
  },
  {
    title: "Company",
    dataIndex: "CompanyName",
    key: "CompanyName",
  },
];

const Role = () => {
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
        "/CrudUserRole",
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
        payload: itemList.filter((item) => item.RoleId === updateId)[0],
      });
      setUpdateId(null);
    }
  }, [updateId]);

  const handleSearchChange = (data) => {
    dispatch(setSearchFieldValue(data));
  };

  const handleFormChange = (data) => {
    dispatch(setFormFieldValue(data));
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    searchFields.AreaName = searchFields.AreaName.trim();
    dispatch(
      setInitialState(
        "/CrudUserRole",
        searchFields,
        initialFormValues,
        searchFields,
        controller,
        userData
      )
    );
  };

  const handleDeleteRow = (id) => {
    dispatch(deleteRow("/CrudUserRole", { RoleId: id }, controller, userData));
  };

  const handleFormSubmit = (e, id, _, closeForm) => {
    e.preventDefault();
    dispatch(
      submitForm(
        "/CrudUserRole",
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
        disabled={!supportingTable.Table1}
        idName="CompanyId"
        valueName="CompanyName"
        size={INPUT_SIZE}
        name="SelectedCompanyId"
        label="Company"
        value={searchFields.SelectedCompanyId}
        onChange={handleSearchChange}
      />
      <FormTextField
        colSpan={4}
        label="Role Name"
        name="RoleName"
        size={INPUT_SIZE}
        value={searchFields.RoleName}
        onChange={handleSearchChange}
      />
    </Fragment>
  );

  const formPanel = (
    <Fragment>
      <FormTextField
        colSpan={8}
        label="Role Name"
        name="RoleName"
        size={INPUT_SIZE}
        value={formFields.RoleName}
        onChange={handleFormChange}
        required={true}
      />
      <FormSelect
        colSpan={8}
        listItem={supportingTable.Table1 || []}
        disabled={!supportingTable.Table1}
        idName="CompanyId"
        valueName="CompanyName"
        size={INPUT_SIZE}
        name="SelectedCompanyId"
        label="Company"
        value={formFields.SelectedCompanyId}
        onChange={handleFormChange}
        required={true}
      />
    </Fragment>
  );

  return (
    <BasicFormComponent
      formTitle="Roles"
      searchPanel={searchPanel}
      formPanel={formPanel}
      searchSubmit={handleSearchSubmit}
      onFormSave={handleFormSubmit}
      tableRows={itemList}
      tableLoading={tableLoading}
      formLoading={formLoading}
      tableColumn={columns}
      deleteRow={handleDeleteRow}
      actionID="RoleId"
      editRow={setUpdateId}
      fields={initialFormValues}
      crudTitle="Role"
    />
  );
};

export default Role;
