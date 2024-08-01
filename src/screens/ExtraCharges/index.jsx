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
  ExtraChargesId: null,
  ExtraChargesName: null,
  OrderModeId: null,
  IsPercent: false,
  ChargesValue: 0,
};

const initialSearchValues = {
  ExtraChargesId: null,
  ExtraChargesName: null,
  OrderModeId: null,
  IsPercent: false,
  ChargesValue: 0,
};

const columns = [
  {
    title: "Extra Charges Name",
    dataIndex: "ExtraChargesName",
    key: "ExtraChargesName",
  },
  {
    title: "Order Mode",
    dataIndex: "OrderMode",
    key: "OrderMode",
  },
  {
    title: "Is Percentage",
    key: "IsPercent",
    render: (record) => <FormCheckbox checked={record.IsPercent} />,
  },
  {
    title: "Value",
    dataIndex: "ChargesValue",
    key: "ChargesValue",
  },
];

const ExtraCharges = () => {
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
        "/CrudExtraCharges",
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
        payload: itemList.filter((item) => item.ExtraChargesId === updateId)[0],
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
    searchFields.ExtraChargesName = searchFields.ExtraChargesName.trim();

    dispatch(
      setInitialState(
        "/CrudExtraCharges",
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
        "/CrudExtraCharges",
        { ExtraChargesId: id },
        controller,
        userData
      )
    );
  };

  const handleFormSubmit = (e, id, _, closeForm) => {
    e.preventDefault();
    dispatch(
      submitForm(
        "/CrudExtraCharges",
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
        label="Extra Charges Name"
        name="ExtraChargesName"
        size={INPUT_SIZE}
        value={searchFields.ExtraChargesName}
        onChange={handleSearchChange}
      />
      <FormSelect
        colSpan={4}
        listItem={
          supportingTable?.Table1?.filter((item) => {
            if (userData?.companyList[0]?.BusinessTypeId === 2) {
              if (item.BusinessType !== "DINE IN") {
                return item;
              }
            } else {
              return item;
            }
          }) || []
        }
        idName="OrderModeId"
        valueName="OrderMode"
        size={INPUT_SIZE}
        name="OrderModeId"
        label="Order Mode"
        value={searchFields.OrderModeId}
        onChange={handleSearchChange}
      />

      {/* <FormTextField
        colSpan={4}
        label="ChargesValue"
        name="ChargesValue"
        size={INPUT_SIZE}
        value={searchFields.ChargesValue}
        onChange={handleSearchChange}
      /> */}
    </Fragment>
  );

  const formPanel = (
    <Fragment>
      <FormTextField
        colSpan={8}
        label="Extra Charges Name"
        name="ExtraChargesName"
        size={INPUT_SIZE}
        value={formFields.ExtraChargesName}
        onChange={handleFormChange}
        required={true}
      />

      <FormSelect
        colSpan={8}
        listItem={
          supportingTable?.Table1?.filter((item) => {
            if (userData?.companyList[0]?.BusinessTypeId === 2) {
              if (item.BusinessType !== "DINE IN") {
                return item;
              }
            } else {
              return item;
            }
          }) || []
        }
        idName="OrderModeId"
        valueName="OrderMode"
        size={INPUT_SIZE}
        name="OrderModeId"
        label="Order Mode"
        value={formFields.OrderModeId}
        onChange={handleFormChange}
        required={true}
      />

      <FormTextField
        colSpan={8}
        type="number"
        label="ChargesValue"
        name="ChargesValue"
        isNumber={"true"}
        size={INPUT_SIZE}
        value={formFields.ChargesValue}
        onChange={(e) => {
          if (e.value > 0 || e.value == "") handleFormChange(e);
          if (e.value < 1) return;
        }}
        required={true}
      />
      <FormCheckbox
        label={"Is Percentage"}
        name="IsPercent"
        checked={formFields.IsPercent}
        onChange={handleFormChange}
        colSpan={8}
      />
    </Fragment>
  );

  return (
    <BasicFormComponent
      formTitle="Extra Charges"
      searchPanel={searchPanel}
      formPanel={formPanel}
      searchSubmit={handleSearchSubmit}
      onFormSave={handleFormSubmit}
      tableRows={itemList}
      tableLoading={tableLoading}
      formLoading={formLoading}
      tableColumn={columns}
      deleteRow={handleDeleteRow}
      actionID="ExtraChargesId"
      editRow={setUpdateId}
      fields={initialFormValues}
    />
  );
};

export default ExtraCharges;
