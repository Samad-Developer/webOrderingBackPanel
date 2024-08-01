import React, { Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { INPUT_SIZE } from "../../common/ThemeConstants";
import BasicFormComponent from "../../components/formComponent/BasicFormComponent";
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
  ShiftId: null,
  ShiftName: "",
  Prefix: "",
};

const initialSearchValues = {
  ShiftId: null,
  ShiftName: "",
  Prefix: "",
};

const columns = [
  {
    title: "Shift",
    dataIndex: "ShiftName",
    key: "ShiftName",
  },
  {
    title: "Prefix",
    dataIndex: "Prefix",
    key: "Prefix",
  },
];

const Shift = () => {
  const dispatch = useDispatch();
  const controller = new window.AbortController();
  const userData = useSelector((state) => state.authReducer);
  const [updateId, setUpdateId] = useState(null);
  const { formFields, searchFields, itemList, formLoading, tableLoading } =
    useSelector((state) => state.basicFormReducer);

  useEffect(() => {
    dispatch(
      setInitialState(
        "/CrudShift",
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
        payload: itemList.filter((item) => item.ShiftId === updateId)[0],
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
    searchFields.ShiftName = searchFields.ShiftName.trim();
    dispatch(
      setInitialState(
        "/CrudShift",
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
        "/CrudShift",
        { ...formFields, ShiftId: id, Prefix: "" },
        controller,
        userData
      )
    );
  };

  const handleFormSubmit = (e, id, _, closeForm) => {
    e.preventDefault();
    dispatch(
      submitForm(
        "/CrudShift",
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
        label="Shift"
        name="ShiftName"
        size={INPUT_SIZE}
        value={searchFields.ShiftName}
        onChange={handleSearchChange}
      />
    </Fragment>
  );

  const formPanel = (
    <Fragment>
      <FormTextField
        colSpan={8}
        label="Shift"
        name="ShiftName"
        size={INPUT_SIZE}
        value={formFields.ShiftName}
        onChange={handleFormChange}
        required
      />
      <FormTextField
        colSpan={8}
        label="Prefix"
        name="Prefix"
        size={INPUT_SIZE}
        value={formFields.Prefix}
        onChange={handleFormChange}
        required
      />
    </Fragment>
  );

  return (
    <BasicFormComponent
      formTitle="Shift"
      searchPanel={searchPanel}
      formPanel={formPanel}
      searchSubmit={handleSearchSubmit}
      onFormSave={handleFormSubmit}
      tableRows={itemList}
      tableLoading={tableLoading}
      formLoading={formLoading}
      tableColumn={columns}
      deleteRow={handleDeleteRow}
      actionID="ShiftId"
      editRow={setUpdateId}
      fields={initialFormValues}
    />
  );
};

export default Shift;
