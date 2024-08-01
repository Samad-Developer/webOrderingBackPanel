import React, { Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { INPUT_SIZE } from "../../common/ThemeConstants";
import BasicFormComponent from "../../components/formComponent/BasicFormComponent";
import FormCheckbox from "../../components/general/FormCheckbox";
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

// import { UPDATE_FORM_FIELD } from "../../redux/reduxConstants";

const initialFormValues = {
  OperationId: null,
  CompanyId: null,
  BranchId: null,
  DepartmentId: null,
  PrinterName: "",
  UserId: null,
  UserIP: "",
  PrinterMappingId: null,
};

const initialSearchValues = {
  OperationId: null,
  CompanyId: null,
  BranchId: null,
  DepartmentId: null,
  PrinterName: "",
  UserId: null,
  UserIP: "",
  PrinterMappingId: null,
};

const columns = [
  {
    title: "Branch",
    dataIndex: "BranchName",
    key: "BranchName",
  },
  {
    title: "Department",
    dataIndex: "DepartmentName",
    key: "DepartmentName",
  },
  {
    title: "Printer Name",
    dataIndex: "PrinterName",
    key: "PrinterName",
  },
];

const PrinterDepartmentMapping = () => {
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
        "/PrinterDepartmentMapping",
        // {
        //   ...initialSearchValues,
        //   BranchId: userData.userBranchList[0].BranchId,
        // },
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
        payload: itemList.filter(
          (item) => item.PrinterMappingId === updateId
        )[0],
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

    dispatch(
      setInitialState(
        "/PrinterDepartmentMapping",
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
        "/PrinterDepartmentMapping",
        { ...initialSearchValues, PrinterMappingId: id },
        controller,
        userData
      )
    );
  };

  const handleFormSubmit = (e, id, _, closeForm) => {
    e.preventDefault();
    dispatch(
      submitForm(
        "/PrinterDepartmentMapping",
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
        colSpan={6}
        listItem={supportingTable.Table1}
        idName="BranchId"
        valueName="BranchName"
        size={INPUT_SIZE}
        name="BranchId"
        label="Branch"
        value={searchFields.BranchId || ""}
        onChange={handleSearchChange}
      />
      <FormSelect
        colSpan={6}
        listItem={supportingTable.Table2}
        idName="DepartmentId"
        valueName="DepartmentName"
        size={INPUT_SIZE}
        name="DepartmentId"
        label="Department"
        value={searchFields.DepartmentId || ""}
        onChange={handleSearchChange}
      />
      <FormTextField
        colSpan={4}
        label="Printer Name"
        name="PrinterName"
        size={INPUT_SIZE}
        value={searchFields.PrinterName}
        onChange={handleSearchChange}
      />
    </Fragment>
  );

  const formPanel = (
    <Fragment>
      <FormSelect
        colSpan={6}
        listItem={supportingTable.Table1}
        idName="BranchId"
        valueName="BranchName"
        size={INPUT_SIZE}
        name="BranchId"
        label="Branch"
        value={formFields.BranchId || ""}
        onChange={handleFormChange}
      />
      <FormSelect
        colSpan={6}
        listItem={supportingTable.Table2}
        idName="DepartmentId"
        valueName="DepartmentName"
        size={INPUT_SIZE}
        name="DepartmentId"
        label="Department"
        value={formFields.DepartmentId || ""}
        onChange={handleFormChange}
      />
      <FormTextField
        colSpan={12}
        label="Printer Name"
        name="PrinterName"
        size={INPUT_SIZE}
        value={formFields.PrinterName}
        onChange={handleFormChange}
      />
    </Fragment>
  );

  return (
    <BasicFormComponent
      formTitle="Printer Department Mapping"
      searchPanel={searchPanel}
      formPanel={formPanel}
      searchSubmit={handleSearchSubmit}
      onFormSave={handleFormSubmit}
      tableRows={itemList}
      tableLoading={tableLoading}
      formLoading={formLoading}
      tableColumn={columns}
      deleteRow={handleDeleteRow}
      actionID="PrinterMappingId"
      editRow={setUpdateId}
      fields={initialFormValues}
    />
  );
};

export default PrinterDepartmentMapping;
