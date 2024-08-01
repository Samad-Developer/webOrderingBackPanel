import React, { Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { INPUT_SIZE } from "../../../common/ThemeConstants";
import BasicFormComponent from "../../../components/formComponent/BasicFormComponent";
import FormTextField from "../../../components/general/FormTextField";
import {
  deleteRow,
  resetState,
  setFormFieldValue,
  setInitialState,
  setSearchFieldValue,
  submitForm,
} from "../../../redux/actions/basicFormAction";
import { UPDATE_FORM_FIELD } from "../../../redux/reduxConstants";

const initialFormValues = {
  OperationId: 1,
  ExpenseTypeID: null,
  ExpenseTypeName: "",
};

const initialSearchValues = {
  OperationId: 1,
  ExpenseTypeID: null,
  ExpenseTypeName: "",
};

const columns = [
  {
    title: "Expense Type Name",
    dataIndex: "ExpenseTypeName",
    key: "ExpenseTypeName",
  },
  {
    title: "Account No",
    dataIndex: "AccountCode",
    key: "AccountCode",
  },
];

const ExpenseType = () => {
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
        "/CrudExpenseType",
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
        payload: itemList.filter((item) => item.ExpenseTypeID === updateId)[0],
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
    searchFields.ExpenseTypeName = searchFields.ExpenseTypeName.trim();
    dispatch(
      setInitialState(
        "/CrudExpenseType",
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
      deleteRow("/CrudExpenseType", { CityId: id }, controller, userData)
    );
  };

  const handleFormSubmit = (e, id, _, closeForm) => {
    e.preventDefault();
    dispatch(
      submitForm(
        "/CrudExpenseType",
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
        label="Expense Type Name"
        name="ExpenseTypeName"
        size={INPUT_SIZE}
        value={searchFields.ExpenseTypeName}
        onChange={handleSearchChange}
      />
    </Fragment>
  );

  const formPanel = (
    <Fragment>
      <FormTextField
        colSpan={8}
        label="Expense Type Name"
        name="ExpenseTypeName"
        size={INPUT_SIZE}
        value={formFields.ExpenseTypeName}
        onChange={handleFormChange}
        required={true}
      />
    </Fragment>
  );

  return (
    <BasicFormComponent
      formTitle="Expense Types"
      searchPanel={searchPanel}
      formPanel={formPanel}
      searchSubmit={handleSearchSubmit}
      onFormSave={handleFormSubmit}
      tableRows={itemList}
      tableLoading={tableLoading}
      formLoading={formLoading}
      tableColumn={columns}
      deleteRow={handleDeleteRow}
      actionID="ExpenseTypeID"
      editRow={setUpdateId}
      fields={initialFormValues}
      crudTitle="Expense Type"
      hideDelete={true}
    />
  );
};

export default ExpenseType;
