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
  WaiterId: null,
  WaiterName: null,
  WaiterCnic: null,
  Contact1: null,
  Contact2: null,
  Address: null,
  BranchId: null,
};

const initialSearchValues = {
  WaiterId: null,
  WaiterName: null,
  WaiterCnic: null,
  Contact1: null,
  Contact2: null,
  Address: null,
  BranchId: null,
};
const columns = [
  {
    title: "Waiter Name",
    dataIndex: "WaiterName",
    key: "WaiterName",
  },
  {
    title: "Waiter CNIC",
    dataIndex: "Cnic",
    key: "Cnic",
  },
  {
    title: "Branch",
    dataIndex: "BranchName",
    key: "BranchName",
  },
  {
    title: "Contact #",
    dataIndex: "Contact1",
    key: "Contact1",
  },
  {
    title: "Alternate Contact #",
    dataIndex: "Contact2",
    key: "Contact2",
  },
  {
    title: "Address",
    dataIndex: "Address",
    key: "Address",
  },
];

const Waiter = () => {
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
        "/CrudWaiter",
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
      const obj = itemList.filter((item) => item.WaiterId === updateId)[0];
      obj.WaiterCnic = obj.Cnic;
      dispatch({
        type: UPDATE_FORM_FIELD,
        payload: obj,
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
    searchFields.WaiterName
      ? (searchFields.WaiterName = searchFields.WaiterName.trim())
      : null;
    searchFields.Contact1
      ? (searchFields.Contact1 = searchFields.Contact1.trim())
      : null;
    searchFields.Contact2
      ? (searchFields.Contact2 = searchFields.Contact2.trim())
      : null;
    searchFields.Address
      ? (searchFields.Address = searchFields.Address.trim())
      : null;
    e.preventDefault();
    dispatch(
      setInitialState(
        "/CrudWaiter",
        searchFields,
        initialFormValues,
        searchFields,
        controller,
        userData
      )
    );
  };

  const handleDeleteRow = (id) => {
    dispatch(deleteRow("/CrudWaiter", { WaiterId: id }, controller, userData));
  };

  const handleFormSubmit = (e, id, _, closeForm) => {
    e.preventDefault();
    dispatch(
      submitForm(
        "/CrudWaiter",
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
        label="Waiter Name"
        name="WaiterName"
        size={INPUT_SIZE}
        value={searchFields.WaiterName}
        onChange={handleSearchChange}
      />

      <FormTextField
        colSpan={4}
        label="Waiter CNIC"
        name="WaiterCnic"
        size={INPUT_SIZE}
        value={searchFields.WaiterCnic}
        onChange={handleSearchChange}
        isNumber="true"
        maxLength={13}
      />

      <FormTextField
        colSpan={4}
        label="Contact #"
        name="Contact1"
        size={INPUT_SIZE}
        value={searchFields.Contact1}
        onChange={handleSearchChange}
        isNumber="true"
        maxLength={11}
      />

      <FormTextField
        colSpan={4}
        label="Alternate Contact #"
        name="Contact2"
        size={INPUT_SIZE}
        value={searchFields.Contact2}
        onChange={handleSearchChange}
        isNumber="true"
        maxLength={11}
      />
      <FormTextField
        colSpan={4}
        label="Address"
        name="Address"
        size={INPUT_SIZE}
        value={searchFields.Address}
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
        label="Waiter Name"
        name="WaiterName"
        size={INPUT_SIZE}
        value={formFields.WaiterName}
        onChange={handleFormChange}
        required={true}
      />

      <FormTextField
        colSpan={8}
        label="Waiter CNIC"
        name="WaiterCnic"
        size={INPUT_SIZE}
        value={formFields.WaiterCnic}
        onChange={handleFormChange}
        required={true}
        isNumber="true"
        minLength={13}
        maxLength={13}
        pattern={"[0-9]{13}"}
      />

      <FormTextField
        colSpan={8}
        label="Contact #"
        name="Contact1"
        size={INPUT_SIZE}
        value={formFields.Contact1}
        onChange={handleFormChange}
        required={true}
        isNumber="true"
        minLength={11}
        maxLength={11}
        pattern={"[0-9]{11}"}
      />

      <FormTextField
        colSpan={8}
        label="Alternate Contact #"
        name="Contact2"
        size={INPUT_SIZE}
        value={formFields.Contact2}
        onChange={handleFormChange}
        isNumber="true"
        // required={true}
        minLength={11}
        maxLength={11}
        pattern={"[0-9]{11}"}
      />
      <FormTextField
        colSpan={8}
        label="Address"
        name="Address"
        size={INPUT_SIZE}
        value={formFields.Address}
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
      formTitle="Waiters"
      searchPanel={searchPanel}
      formPanel={formPanel}
      searchSubmit={handleSearchSubmit}
      onFormSave={handleFormSubmit}
      tableRows={itemList}
      tableLoading={tableLoading}
      formLoading={formLoading}
      tableColumn={columns}
      deleteRow={handleDeleteRow}
      actionID="WaiterId"
      editRow={setUpdateId}
      fields={initialFormValues}
      crudTitle="Waiter"
    />
  );
};

export default Waiter;
