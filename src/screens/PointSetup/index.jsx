import { Col, Row } from "antd";
import Checkbox from "antd/lib/checkbox/Checkbox";
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
  OperationId: 1,
  CompanyId: null,
  UserId: null,
  UserIP: "",
  LoyaltyCardTypeId: null,
  LoyaltyCardType: "",
  AmountEarnByPerPoint: null,
  AmountRedeemByPerPoint: null,
};

const initialSearchValues = {
  OperationId: 1,
  CompanyId: null,
  UserId: null,
  UserIP: "",
  LoyaltyCardTypeId: null,
  LoyaltyCardType: "",
  AmountEarnByPerPoint: null,
  AmountRedeemByPerPoint: null,
};

const columns = [
  {
    title: "Redemention",
    dataIndex: "RedementionName",
    key: "RedementionName",
  },
  {
    title: "Points",
    dataIndex: "PointsName",
    key: "PointsName",
  },
  {
    title: "Branches",
    dataIndex: "BranchName",
    key: "BranchName",
  },
];

const PointSetup = () => {
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
        "/CrudLoyaltyCardType",
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
        payload: itemList.filter((item) => item.TerminalId === updateId)[0],
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
    searchFields.TerminalName = searchFields.TerminalName.trim();
    dispatch(
      setInitialState(
        "/CrudLoyaltyCardType",
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
        "/CrudLoyaltyCardType",
        { TerminalId: id },
        controller,
        userData
      )
    );
  };

  const handleFormSubmit = (e, id, _, closeForm) => {
    e.preventDefault();
    dispatch(
      submitForm(
        "/CrudTerminal",
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
        label="Point Status"
        name="Point"
        size={INPUT_SIZE}
        //value={searchFields.TerminalName}
        onChange={handleSearchChange}
      />
      <FormSelect
        colSpan={4}
        // listItem={supportingTable.Table1 || []}
        idName="BranchId"
        valueName="BranchName"
        size={INPUT_SIZE}
        name="BranchId"
        label="Redemention"
        //value={searchFields.BranchId}
        onChange={handleSearchChange}
      />
    </Fragment>
  );

  const formPanel = (
    <Fragment>
      <FormSelect
        colSpan={8}
        listItem={supportingTable.Table1 || []}
        idName="RedemtionId"
        valueName="Redemtion"
        size={INPUT_SIZE}
        name="RedemtionId"
        label="Loyalty Type"
        value={formFields.BranchId}
        onChange={handleFormChange}
        required
      />

      <Col span={24} style={{ display: "flex", flexDirection: "row" }}>
        <div
          style={{
            border: "1px solid lightgray",
            position: "relative",
            margin: 5,
            marginTop: 10,
            borderRadius: 5,
            padding: 10,
            display: "flex",
            width: "auto",
            flexWrap: "wrap",
          }}
        >
          <p className="container-label-custom">Earning</p>

          <FormTextField
            colSpan={8}
            label="Price"
            name="Price"
            size={INPUT_SIZE}
            value={formFields.TerminalName}
            onChange={handleFormChange}
            required
          />
          <FormTextField
            colSpan={8}
            label="Points"
            name="Points"
            size={INPUT_SIZE}
            value={formFields.TerminalName}
            onChange={handleFormChange}
            required
          />
        </div>
      </Col>

      <div
        style={{
          border: "1px solid lightgray",
          position: "relative",
          margin: 5,
          marginTop: 10,
          borderRadius: 5,
          padding: 10,
          display: "flex",
          width: "auto",
          flexWrap: "wrap",
        }}
      >
        <p className="container-label-custom">Redemption</p>

        <FormTextField
          colSpan={8}
          label="Points"
          name="Points"
          size={INPUT_SIZE}
          value={formFields.TerminalName}
          onChange={handleFormChange}
          required
        />
        <FormTextField
          colSpan={8}
          label="Price"
          name="Price"
          size={INPUT_SIZE}
          value={formFields.TerminalName}
          onChange={handleFormChange}
          required
        />
      </div>
      <Col span={24} style={{ display: "flex", flexDirection: "row", gap: 30 }}>
        <FormTextField
          colSpan={4}
          label="Valid From"
          type="date"
          name="ValidFrom"
          size={INPUT_SIZE}
          //value={data.DateFrom}
          required={true}
          onChange={handleSearchChange}
        />
        <FormTextField
          colSpan={4}
          label="Valid Upto"
          type="date"
          name="ValidUpto"
          size={INPUT_SIZE}
          //value={data.DateFrom}
          required={true}
          onChange={handleSearchChange}
        />
      </Col>
      <FormTextField
          colSpan={4}
          label="Points Expiry"
          type="date"
          name="ValidUpto"
          size={INPUT_SIZE}
          disabled={true}
          //value={data.DateFrom}
          onChange={handleSearchChange}
        />
      <Col span={24} style={{ display: "flex", flexDirection: "row", gap: 30 }}>
        <p>Check Box:</p>

        <FormCheckbox
          // colSpan={8}
          idName="id"
          valueName="name"
          name="DisplayInPos"
          label="CheckBox 1"
          checked={formFields.DisplayInPos}
          onChange={handleFormChange}
        />

        <FormCheckbox
          // colSpan={8}
          idName="id"
          valueName="name"
          name="DisplayInPos"
          label="Checkbox 2"
          checked={formFields.DisplayInPos}
          onChange={handleFormChange}
        />

        <FormCheckbox
          // colSpan={8}
          idName="id"
          valueName="name"
          name="DisplayInPos"
          label="Checkbox 3"
          checked={formFields.DisplayInPos}
          onChange={handleFormChange}
        />

        <FormCheckbox
          // colSpan={8}
          idName="id"
          valueName="name"
          name="DisplayInPos"
          label="Checkbox 4"
          checked={formFields.DisplayInPos}
          onChange={handleFormChange}
        />
      </Col>

      <Col span={24} style={{ display: "flex", flexDirection: "row", gap: 30 }}>
        <p>Branch:</p>

        <FormCheckbox
          // colSpan={8}
          idName="id"
          valueName="name"
          name="DisplayInPos"
          label="Branch 1"
          checked={formFields.DisplayInPos}
          onChange={handleFormChange}
        />

        <FormCheckbox
          // colSpan={8}
          idName="id"
          valueName="name"
          name="DisplayInPos"
          label="Branch 2"
          checked={formFields.DisplayInPos}
          onChange={handleFormChange}
        />

        <FormCheckbox
          // colSpan={8}
          idName="id"
          valueName="name"
          name="DisplayInPos"
          label="Branch 3"
          checked={formFields.DisplayInPos}
          onChange={handleFormChange}
        />
        <FormCheckbox
          // colSpan={8}
          idName="id"
          valueName="name"
          name="DisplayInPos"
          label="Branch 4"
          checked={formFields.DisplayInPos}
          onChange={handleFormChange}
        />
      </Col>
    </Fragment>
  );

  return (
    <BasicFormComponent
      formTitle="Point Setup"
      searchPanel={searchPanel}
      formPanel={formPanel}
      searchSubmit={handleSearchSubmit}
      onFormSave={handleFormSubmit}
      tableRows={itemList}
      tableLoading={tableLoading}
      formLoading={formLoading}
      tableColumn={columns}
      deleteRow={handleDeleteRow}
      actionID="PointSetupId"
      editRow={setUpdateId}
      fields={initialFormValues}
    />
  );
};

export default PointSetup;
