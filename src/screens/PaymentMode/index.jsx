import { Col, Row, Space } from "antd";
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

const initialFormValues = {
  OperationId: null,
  CompanyId: null,
  PaymentModeId: null,
  PaymentMode: "",
  UserId: null,
  UserIP: null,
  IsFoc: false,
  IsPosType: false,
  IsCashType: false,
  IsCreditType: false,
  IsThirdParty: false,
  InstantDiscount: false,
  IsPartyAccount: false,
};

const initialSearchValues = {
  OperationId: null,
  CompanyId: null,
  PaymentModeId: null,
  PaymentMode: "",
  UserId: null,
  UserIP: null,
  IsFoc: false,
  IsPosType: false,
  IsCashType: false,
  IsCreditType: false,
  IsThirdParty: false,
  InstantDiscount: false,
  IsPartyAccount: false,
};

const columns = [
  {
    title: "Payment Mode",
    dataIndex: "PaymentMode",
    key: "PaymentMode",
  },
];

const PaymentMode = () => {
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
        "/CrudPaymentMode",
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
        payload: itemList.filter((item) => item.PaymentModeId === updateId)[0],
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
    searchFields.PaymentMode = searchFields.PaymentMode.trim();
    dispatch(
      setInitialState(
        "/CrudPaymentMode",
        {
          ...searchFields,
          PaymentModeId: itemList.find(
            (item) =>
              item.PaymentMode.toLowerCase() ===
              searchFields.PaymentMode.toLowerCase()
          )?.PaymentModeId,
        },
        initialFormValues,
        searchFields,
        controller,
        userData
      )
    );
  };

  const handleDeleteRow = (id) => {
    dispatch(
      deleteRow("/CrudPaymentMode", { PaymentModeId: id }, controller, userData)
    );
  };

  const handleFormSubmit = (e, id, _, closeForm) => {
    e.preventDefault();
    dispatch(
      submitForm(
        "/CrudPaymentMode",
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
        label="Payment Mode"
        name="PaymentMode"
        size={INPUT_SIZE}
        value={searchFields.PaymentMode}
        onChange={handleSearchChange}
      />
      {/* <FormCheckbox
        colSpan={4}
        checked={searchFields.IsPosType}
        name="IsPosType"
        onChange={handleFormChange}
        label="Is POS"
      />
      <FormCheckbox
        colSpan={4}
        checked={searchFields.IsFoc}
        name="IsFoc"
        onChange={handleFormChange}
        label="Is FOC"
      />
      <FormCheckbox
        colSpan={4}
        checked={searchFields.IsCashType}
        name="IsCashType"
        onChange={handleFormChange}
        label="Is Cash"
      /> */}
    </Fragment>
  );

  const formPanel = (
    <Fragment>
      <FormTextField
        colSpan={8}
        label="Payment Mode"
        name="PaymentMode"
        size={INPUT_SIZE}
        value={formFields.PaymentMode}
        onChange={handleFormChange}
      />
      <Col span={24}>
        <Row
          style={{ border: "1px solid lightgray", borderRadus: 5, padding: 10 }}
        >
          <Space direction="horizontal" size={35} align="center">
            <h4 style={{ textDecoration: "underline" }}>Payment Modes</h4>
            &nbsp;&nbsp;
          </Space>
          <Col span={24} style={{ marginBottom: 20 }}>
            <FormCheckbox
              colSpan={8}
              checked={formFields.IsPosType}
              name="IsPosType"
              onChange={handleFormChange}
              label="Is POS"
            />
            <FormCheckbox
              colSpan={8}
              checked={formFields.IsFoc}
              name="IsFoc"
              onChange={handleFormChange}
              label="Is FOC"
            />
            <FormCheckbox
              colSpan={8}
              checked={formFields.IsCashType}
              name="IsCashType"
              onChange={handleFormChange}
              label="Is Cash"
            />
            <FormCheckbox
              colSpan={8}
              checked={formFields.IsCreditType}
              name="IsCreditType"
              onChange={handleFormChange}
              label="Is Credit"
            />
            <FormCheckbox
              colSpan={8}
              checked={formFields.IsThirdParty}
              name="IsThirdParty"
              onChange={handleFormChange}
              label="Is Third Party"
            />
            <FormCheckbox
              colSpan={8}
              checked={formFields.InstantDiscount}
              name="InstantDiscount"
              onChange={handleFormChange}
              label="Instant Discount"
            />
            <FormCheckbox
              colSpan={8}
              checked={formFields.IsPartyAccount}
              name="IsPartyAccount"
              onChange={handleFormChange}
              label="Party Account"
            />
          </Col>
        </Row>
      </Col>
    </Fragment>
  );

  return (
    <BasicFormComponent
      formTitle="Payment Mode"
      searchPanel={searchPanel}
      formPanel={formPanel}
      searchSubmit={handleSearchSubmit}
      onFormSave={handleFormSubmit}
      tableRows={itemList}
      tableLoading={tableLoading}
      formLoading={formLoading}
      tableColumn={columns}
      deleteRow={handleDeleteRow}
      actionID="PaymentModeId"
      editRow={setUpdateId}
      fields={initialFormValues}
      crudTitle="Payment Mode"
    />
  );
};

export default PaymentMode;
