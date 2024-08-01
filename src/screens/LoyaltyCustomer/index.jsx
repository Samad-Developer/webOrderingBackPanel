import { Col, Row, Spin, Table } from "antd";
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

const LoyaltyCustomer = () => {
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
            label="Customer Phone"
            name="Price"
            size={INPUT_SIZE}
            value={formFields.TerminalName}
            onChange={handleFormChange}
            required
          />
        <FormTextField
            colSpan={4}
            label="Customer Name"
            name="Price"
            size={INPUT_SIZE}
            value={formFields.TerminalName}
            onChange={handleFormChange}
            required
          />
          <FormSelect
        colSpan={4}
        listItem={supportingTable.Table1 || []}
        idName="LoyaltyId"
        valueName="Loyalty"
        size={INPUT_SIZE}
        name="LoyaltyId"
        label="Loyalty Type"
        value={formFields.BranchId}
        onChange={handleFormChange}
        required
      />
    </Fragment>
  );

  const formPanel = (
    <Fragment>
        <Col span={24} style={{ display: "flex", flexDirection: "row", gap: 30 }}>
        <FormTextField
            colSpan={8}
            label="Customer Phone"
            name="Price"
            size={INPUT_SIZE}
            value={formFields.TerminalName}
            onChange={handleFormChange}
            required
          />
        <FormTextField
            colSpan={8}
            label="Customer Name"
            name="Price"
            size={INPUT_SIZE}
            value={formFields.TerminalName}
            onChange={handleFormChange}
            required
          />
          </Col>
          <Col span={24} style={{ display: "flex", flexDirection: "row", gap: 30 }}>
        <FormSelect
        colSpan={8}
        listItem={supportingTable.Table1 || []}
        idName="LoyaltyId"
        valueName="Loyalty"
        size={INPUT_SIZE}
        name="LoyaltyId"
        label="Loyalty Type"
        value={formFields.BranchId}
        onChange={handleFormChange}
        required
      />
      </Col>
      <Col span={24} style={{ display: "flex", flexDirection: "row", gap: 30 }}>

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
      <Col span={24} style={{ display: "flex", flexDirection: "row", gap: 30 }}>

      <FormTextField
            colSpan={8}
            label="Points"
            name="Price"
            size={INPUT_SIZE}
            value={formFields.TerminalName}
            onChange={handleFormChange}
            disabled={true}
            required
          />
      </Col>

      <Col span={24}>
        <Spin 
        tip="Loading..." 
        // spinning={formTableLoading}
        >
          <Table 
        //   columns={columnsClosingDetail} 
        //   dataSource={closingDetail}
           />
        </Spin>
      </Col>
    </Fragment>
  );

  return (
    <BasicFormComponent
      formTitle="Loyalty Customer"
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

export default LoyaltyCustomer;
