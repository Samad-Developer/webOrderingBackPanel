import React, { Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { INPUT_SIZE } from "../../common/ThemeConstants";
import BasicFormComponent from "../../components/formComponent/BasicFormComponent";
import { OrderModes } from "../../common/SetupMasterEnum";
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
  SetupMasterId: OrderModes,
  ParentId: null,
  SetupDetailName: "",
  Flex1: "",
  Flex2: "",
  Flex3: "",
  SetupDetailId: null,
};

const initialSearchValues = {
  SetupMasterId: OrderModes,
  ParentId: null,
  SetupDetailName: "",
  Flex1: "",
  Flex2: "",
  Flex3: "",
  SetupDetailId: null,
};
const columns = [
  {
    title: "Setup Detail Name",
    dataIndex: "SetupDetailName",
    key: "SetupDetailName",
  },
];
const OrderMode = () => {
  const dispatch = useDispatch();
  const controller = new window.AbortController();
  const userData = useSelector((state) => state.authReducer);

  const [updateId, setUpdateId] = useState(null);

  const { formFields, searchFields, itemList, formLoading, tableLoading } =
    useSelector((state) => state.basicFormReducer);

  useEffect(() => {
    dispatch(
      setInitialState(
        "/CrudMasterDetail",
        {
          SetupMasterId: OrderModes,
          ParentId: null,
          SetupDetailName: "",
          Flex1: "",
          Flex2: "",
          Flex3: "",
          SetupDetailId: null,
        },
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
        payload: itemList.filter((item) => item.SetupDetailId === updateId)[0],
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
        "/CrudMasterDetail",
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
        "/CrudMasterDetail",
        { SetupDetailId: id, SetupMasterId: OrderModes },
        controller,
        userData
      )
    );
  };

  const handleFormSubmit = (e, id, _, closeForm) => {
    e.preventDefault();
    dispatch(
      submitForm(
        "/CrudMasterDetail",
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
        colSpan={8}
        label="Order Mode Name"
        name="SetupDetailName"
        size={INPUT_SIZE}
        value={searchFields.SetupDetailName}
        onChange={handleSearchChange}
      />
    </Fragment>
  );

  const formPanel = (
    <Fragment>
      <FormTextField
        colSpan={8}
        label="Order Mode Name"
        name="SetupDetailName"
        size={INPUT_SIZE}
        value={formFields.SetupDetailName}
        onChange={handleFormChange}
        required={true}
      />
    </Fragment>
  );

  return (
    <BasicFormComponent
      formTitle="OrderMode"
      searchPanel={searchPanel}
      formPanel={formPanel}
      searchSubmit={handleSearchSubmit}
      onFormSave={handleFormSubmit}
      tableRows={itemList}
      tableLoading={tableLoading}
      formLoading={formLoading}
      tableColumn={columns}
      deleteRow={handleDeleteRow}
      actionID="SetupDetailId"
      editRow={setUpdateId}
      fields={initialFormValues}
    />
  );
};

export default OrderMode;
