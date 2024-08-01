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
  FlavourId: null,
  FlavourName: "",
};

const initialSearchValues = {
  FlavourId: null,
  FlavourName: "",
};

const columns = [
  {
    title: "Variant Name",
    dataIndex: "FlavourName",
    key: "FlavourName",
  },
];

const Flavour = () => {
  const dispatch = useDispatch();
  const controller = new window.AbortController();
  const userData = useSelector((state) => state.authReducer);

  const [updateId, setUpdateId] = useState(null);

  const { formFields, searchFields, itemList, formLoading, tableLoading } =
    useSelector((state) => state.basicFormReducer);

  useEffect(() => {
    dispatch(
      setInitialState(
        "/CrudFlavour",
        { FlavourId: null, FlavourName: "" },
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
        payload: itemList.filter((item) => item.FlavourId === updateId)[0],
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
    searchFields.FlavourName = searchFields.FlavourName.trim();
    dispatch(
      setInitialState(
        "/CrudFlavour",
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
      deleteRow("/CrudFlavour", { FlavourId: id }, controller, userData)
    );
  };

  const handleFormSubmit = (e, id, _, closeForm) => {
    e.preventDefault();
    dispatch(
      submitForm(
        "/CrudFlavour",
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
        label="Variant Name"
        name="FlavourName"
        size={INPUT_SIZE}
        value={searchFields.FlavourName}
        onChange={handleSearchChange}
      />
    </Fragment>
  );

  const formPanel = (
    <Fragment>
      <FormTextField
        colSpan={8}
        label="Variant Name"
        name="FlavourName"
        size={INPUT_SIZE}
        value={formFields.FlavourName}
        onChange={handleFormChange}
        required={true}
      />
    </Fragment>
  );

  return (
    <BasicFormComponent
      formTitle="Variants"
      searchPanel={searchPanel}
      formPanel={formPanel}
      searchSubmit={handleSearchSubmit}
      onFormSave={handleFormSubmit}
      tableRows={itemList}
      tableLoading={tableLoading}
      formLoading={formLoading}
      tableColumn={columns}
      deleteRow={handleDeleteRow}
      actionID="FlavourId"
      editRow={setUpdateId}
      fields={initialFormValues}
      crudTitle="Variant"
    />
  );
};

export default Flavour;
