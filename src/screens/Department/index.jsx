import React, { Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { INPUT_SIZE } from "../../common/ThemeConstants";
import BasicFormComponent from "../../components/formComponent/BasicFormComponent";
import FormCheckbox from "../../components/general/FormCheckbox";
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
  DepartmentId: null,
  DepartmentName: "",
  IsEnable: true,
};

const initialSearchValues = {
  DepartmentId: null,
  DepartmentName: "",
};
const columns = [
  {
    title: "Department Name",
    dataIndex: "DepartmentName",
    key: "DepartmentName",
  },
];

const Department = () => {
  const dispatch = useDispatch();
  const controller = new window.AbortController();
  const userData = useSelector((state) => state.authReducer);

  const [updateId, setUpdateId] = useState(null);

  const { formFields, searchFields, itemList, formLoading, tableLoading } =
    useSelector((state) => state.basicFormReducer);

  useEffect(() => {
    dispatch(
      setInitialState(
        "/CrudDepartment",
        { DepartmentId: null, DepartmentName: "" },
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
        payload: itemList.filter((item) => item.DepartmentId === updateId)[0],
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
    searchFields.DepartmentName = searchFields.DepartmentName.trim();
    dispatch(
      setInitialState(
        "/CrudDepartment",
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
      deleteRow("/CrudDepartment", { DepartmentId: id }, controller, userData)
    );
  };

  const handleFormSubmit = (e, id, _, closeForm) => {
    e.preventDefault();
    dispatch(
      submitForm(
        "/CrudDepartment",
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
        label="Department Name"
        name="DepartmentName"
        size={INPUT_SIZE}
        value={searchFields.DepartmentName}
        onChange={handleSearchChange}
      />
    </Fragment>
  );

  const formPanel = (
    <Fragment>
      <FormTextField
        colSpan={8}
        label="Department Name"
        name="DepartmentName"
        size={INPUT_SIZE}
        value={formFields.DepartmentName}
        onChange={handleFormChange}
        required={true}
      />


      <div className="ant-col ant-col-8 mt-26">
        <FormCheckbox
          idName="id"
          valueName="name"
          name="IsEnable"
          label="Is Enabled"
          checked={formFields.IsEnable}
          onChange={handleFormChange}
        />
      </div>
    </Fragment>
  );

  return (
    <BasicFormComponent
      formTitle="Department"
      searchPanel={searchPanel}
      formPanel={formPanel}
      searchSubmit={handleSearchSubmit}
      onFormSave={handleFormSubmit}
      tableRows={itemList}
      tableLoading={tableLoading}
      formLoading={formLoading}
      tableColumn={columns}
      deleteRow={handleDeleteRow}
      actionID="DepartmentId"
      editRow={setUpdateId}
      fields={initialFormValues}
    />
  );
};

export default Department;
