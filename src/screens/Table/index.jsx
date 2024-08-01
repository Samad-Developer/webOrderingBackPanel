import React, { Fragment, useState, useEffect } from "react";
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
  TableId: null,
  TableName: "",
  BranchId: null,
};
const initialSearchValues = {
  TableId: null,
  TableName: "",
  BranchId: null,
};
const columns = [
  {
    title: "Table Name",
    dataIndex: "TableName",
    key: "TableName",
  },
  {
    title: "Branch Name",
    dataIndex: "BranchName",
    key: "BranchName",
  },
];

const Table = () => {
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
        "/CrudTable",
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
        payload: itemList.filter((item) => item.TableId === updateId)[0],
      });
    }
    setUpdateId(null);
  }, [updateId]);

  const handleSearchChange = (data) => {
    if (data.value !== "") {
      dispatch(setSearchFieldValue(data));
    } else {
      dispatch(setSearchFieldValue({ name: data.name, value: null }));
    }
  };

  const handleFormChange = (data) => {
    dispatch(setFormFieldValue(data));
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    searchFields.TableName =
      searchFields.TableName && searchFields.TableName.trim();
    dispatch(
      setInitialState(
        "/CrudTable",
        searchFields,
        initialFormValues,
        searchFields,
        controller,
        userData
      )
    );
  };

  const handleDeleteRow = (id) => {
    dispatch(deleteRow("/CrudTable", { TableId: id }, controller, userData));
  };

  const handleFormSubmit = (e, id, _, closeForm) => {
    e.preventDefault();
    dispatch(
      submitForm(
        "/CrudTable",
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
      <FormTextField
        colSpan={4}
        label="Table Name"
        name="TableName"
        size={INPUT_SIZE}
        value={searchFields.TableName}
        onChange={handleSearchChange}
      />
      <FormSelect
        colSpan={4}
        listItem={supportingTable.Table1 || []}
        disabled={!supportingTable.Table1}
        idName="BranchId"
        valueName="BranchName"
        size={INPUT_SIZE}
        name="BranchId"
        label="Branch Name"
        value={searchFields.BranchId || ""}
        onChange={handleSearchChange}
      />
    </Fragment>
  );

  const formPanel = (
    <Fragment>
      <FormTextField
        colSpan={8}
        label="Table Name"
        name="TableName"
        size={INPUT_SIZE}
        value={formFields.TableName}
        onChange={handleFormChange}
        required={true}
      />
      <FormSelect
        colSpan={8}
        listItem={supportingTable.Table1 || []}
        disabled={!supportingTable.Table1}
        idName="BranchId"
        valueName="BranchName"
        size={INPUT_SIZE}
        name="BranchId"
        label="Branch Name"
        value={formFields.BranchId || ""}
        onChange={handleFormChange}
        required={true}
      />
    </Fragment>
  );

  return (
    <BasicFormComponent
      formTitle="Tables"
      searchPanel={searchPanel}
      formPanel={formPanel}
      searchSubmit={handleSearchSubmit}
      onFormSave={handleFormSubmit}
      tableRows={itemList}
      tableLoading={tableLoading}
      formLoading={formLoading}
      tableColumn={columns}
      deleteRow={handleDeleteRow}
      actionID="TableId"
      editRow={setUpdateId}
      fields={initialFormValues}
      crudTitle={"Table"}
    />
  );
};
export default Table;
