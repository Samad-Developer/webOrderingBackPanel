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
  RiderId: null,
  RiderName: null,
  RiderCnic: null,
  Contact1: null,
  Contact2: null,
  Address: null,
  BranchId: null,
};

const initialSearchValues = {
  RiderId: null,
  RiderName: null,
  RiderCnic: null,
  Contact1: null,
  Contact2: null,
  Address: null,
  BranchId: null,
};
const columns = [
  {
    title: "Rider Name",
    dataIndex: "RiderName",
    key: "RiderName",
  },
  {
    title: "Rider CNIC",
    dataIndex: "Cnic",
    key: "Cnic",
  },
  {
    title: "Contact #",
    dataIndex: "Contact1",
    key: "Contact1",
  },
  {
    title: "Alternate Contact #",
    dataIndex: "Contact2",
    key: "Contact1",
  },
  {
    title: "Branch",
    dataIndex: "BranchName",
    key: "BranchName",
  },
  {
    title: "Address",
    dataIndex: "Address",
    key: "Address",
  },
];

const Rider = () => {
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
        "/CrudRider",
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
      const obj = itemList.filter((item) => item.RiderId === updateId)[0];
      obj.RiderCnic = obj.Cnic;
      // delete obj.Cnic;
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
    e.preventDefault();
    searchFields.RiderName
      ? (searchFields.RiderName = searchFields.RiderName.trim())
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

    dispatch(
      setInitialState(
        "/CrudRider",
        searchFields,
        initialFormValues,
        searchFields,
        controller,
        userData
      )
    );
  };

  const handleDeleteRow = (id) => {
    dispatch(deleteRow("/CrudRider", { RiderId: id }, controller, userData));
  };

  const handleFormSubmit = (e, id, _, closeForm) => {
    e.preventDefault();
    dispatch(
      submitForm(
        "/CrudRider",
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
        label="Rider Name"
        name="RiderName"
        size={INPUT_SIZE}
        value={searchFields.RiderName}
        onChange={handleSearchChange}
      />

      <FormTextField
        colSpan={4}
        label="Rider CNIC"
        name="RiderCnic"
        size={INPUT_SIZE}
        value={searchFields.RiderCnic}
        onChange={handleSearchChange}
        maxLength={13}
      />

      <FormTextField
        colSpan={4}
        label="Contact #"
        name="Contact1"
        size={INPUT_SIZE}
        value={searchFields.Contact1}
        onChange={handleSearchChange}
        maxLength={11}
      />

      <FormTextField
        colSpan={4}
        label="Alternate Contact #"
        name="Contact2"
        size={INPUT_SIZE}
        value={searchFields.Contact2}
        onChange={handleSearchChange}
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
        label="Rider Name"
        name="RiderName"
        size={INPUT_SIZE}
        value={formFields.RiderName}
        onChange={handleFormChange}
        required={true}
      />

      <FormTextField
        colSpan={8}
        label="Rider CNIC"
        name="RiderCnic"
        size={INPUT_SIZE}
        value={formFields.RiderCnic}
        onChange={handleFormChange}
        minLength={13}
        maxLength={13}
        required={true}
        pattern={"[0-9]{13}"}
      />

      <FormTextField
        colSpan={8}
        label="Contact #"
        name="Contact1"
        size={INPUT_SIZE}
        value={formFields.Contact1}
        onChange={handleFormChange}
        minLength={11}
        maxLength={11}
        required={true}
        pattern={"[0-9]{11}"}
      />

      <FormTextField
        colSpan={8}
        label="Alternate Contact #"
        name="Contact2"
        size={INPUT_SIZE}
        value={formFields.Contact2}
        onChange={handleFormChange}
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
      formTitle="Riders"
      searchPanel={searchPanel}
      formPanel={formPanel}
      searchSubmit={handleSearchSubmit}
      onFormSave={handleFormSubmit}
      tableRows={itemList}
      tableLoading={tableLoading}
      formLoading={formLoading}
      tableColumn={columns}
      deleteRow={handleDeleteRow}
      actionID="RiderId"
      editRow={setUpdateId}
      fields={initialFormValues}
      crudTitle="Rider"
    />
  );
};

export default Rider;
