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
  TerminalId: null,
  TerminalName: "",
  Prefix: "",
  BranchId: null,
};

const initialSearchValues = {
  TerminalId: null,
  TerminalName: "",
  Prefix: "",
  BranchId: null,
};

const columns = [
  {
    title: "Terminal",
    dataIndex: "TerminalName",
    key: "TerminalName",
  },
  {
    title: "Branch",
    dataIndex: "BranchName",
    key: "BranchName",
  },
];

const Terminal = () => {
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
        "/CrudTerminal",
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
        payload: itemList.filter((item) => item.TerminalId === updateId)[0],
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
    searchFields.TerminalName = searchFields.TerminalName.trim();
    dispatch(
      setInitialState(
        "/CrudTerminal",
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
      deleteRow("/CrudTerminal", { TerminalId: id }, controller, userData)
    );
  };

  const handleFormSubmit = (e, id, _, closeForm) => {
    e.preventDefault();
    dispatch(
      submitForm(
        "/CrudTerminal",
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
        label="Terminal"
        name="TerminalName"
        size={INPUT_SIZE}
        value={searchFields.TerminalName}
        onChange={handleSearchChange}
      />

      <FormSelect
        colSpan={4}
        listItem={supportingTable.Table1 || []}
        idName="BranchId"
        valueName="BranchName"
        size={INPUT_SIZE}
        name="BranchId"
        label="Branch Name"
        value={searchFields.BranchId}
        onChange={handleSearchChange}
      />
    </Fragment>
  );

  const formPanel = (
    <Fragment>
      <FormTextField
        colSpan={8}
        label="Terminal"
        name="TerminalName"
        size={INPUT_SIZE}
        value={formFields.TerminalName}
        onChange={handleFormChange}
        required
      />

      <FormSelect
        colSpan={8}
        listItem={supportingTable.Table1 || []}
        idName="BranchId"
        valueName="BranchName"
        size={INPUT_SIZE}
        name="BranchId"
        label="Branch Name"
        value={formFields.BranchId}
        onChange={handleFormChange}
        required
      />
    </Fragment>
  );

  return (
    <BasicFormComponent
      formTitle="Terminal"
      searchPanel={searchPanel}
      formPanel={formPanel}
      searchSubmit={handleSearchSubmit}
      onFormSave={handleFormSubmit}
      tableRows={itemList}
      tableLoading={tableLoading}
      formLoading={formLoading}
      tableColumn={columns}
      deleteRow={handleDeleteRow}
      actionID="TerminalId"
      editRow={setUpdateId}
      fields={initialFormValues}
    />
  );
};

export default Terminal;
