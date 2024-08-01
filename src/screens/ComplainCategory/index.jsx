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
  ComplainCategoryId: null,
  ComplainCategoryName: "",
  ComplainTypeId: null,
};

const initialSearchValues = {
  ComplainCategoryId: null,
  ComplainTypeId: null,
  ComplainTypeName: "",
  ComplainCategoryName: "",
};

const columns = [
  {
    title: "Complaint Category",
    dataIndex: "ComplainCategoryName",
    key: "ComplainCategoryName",
  },
  {
    title: "Complaint Type",
    dataIndex: "ComplainTypeName",
    key: "ComplainTypeName",
  },
];

const ComplainCategory = () => {
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
        "/CrudComplainCategory",
        { ...initialFormValues, ComplainTypeId: undefined },
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
        payload: itemList.filter(
          (item) => item.ComplainCategoryId === updateId
        )[0],
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
    searchFields.ComplainCategoryName =
      searchFields.ComplainCategoryName.trim();
    dispatch(
      setInitialState(
        "/CrudComplainCategory",
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
      deleteRow(
        "/CrudComplainCategory",
        { ComplainCategoryId: id },
        controller,
        userData
      )
    );
  };

  const handleFormSubmit = (e, id, _, closeForm) => {
    e.preventDefault();
    dispatch(
      submitForm(
        "/CrudComplainCategory",
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
        label="Complaint Category"
        name="ComplainCategoryName"
        size={INPUT_SIZE}
        value={searchFields.ComplainCategoryName}
        onChange={handleSearchChange}
      />
      <FormSelect
        colSpan={4}
        listItem={supportingTable.Table1 || []}
        idName="SetupDetailId"
        valueName="SetupDetailName"
        size={INPUT_SIZE}
        name="ComplainTypeId"
        label="Complaint Type"
        value={searchFields.ComplainTypeId}
        onChange={handleSearchChange}
      />
    </Fragment>
  );

  const formPanel = (
    <Fragment>
      <FormTextField
        colSpan={8}
        label="Complaint Category"
        name="ComplainCategoryName"
        size={INPUT_SIZE}
        value={formFields.ComplainCategoryName}
        onChange={handleFormChange}
        required={true}
      />

      <FormSelect
        colSpan={8}
        listItem={supportingTable.Table1 ? supportingTable.Table1 : []}
        idName="SetupDetailId"
        valueName="SetupDetailName"
        size={INPUT_SIZE}
        name="ComplainTypeId"
        label="Complaint Type"
        value={formFields.ComplainTypeId}
        onChange={handleFormChange}
        required={true}
      />
    </Fragment>
  );

  return (
    <BasicFormComponent
      formTitle="Complaint Category"
      searchPanel={searchPanel}
      formPanel={formPanel}
      searchSubmit={handleSearchSubmit}
      onFormSave={handleFormSubmit}
      tableRows={itemList}
      tableLoading={tableLoading}
      formLoading={formLoading}
      tableColumn={columns}
      deleteRow={handleDeleteRow}
      actionID="ComplainCategoryId"
      editRow={setUpdateId}
      fields={initialFormValues}
    />
  );
};

export default ComplainCategory;
