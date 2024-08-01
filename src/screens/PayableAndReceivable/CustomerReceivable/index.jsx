import { SearchOutlined } from "@ant-design/icons";
import { Button, Col, Input, message, Radio, Row, Space, Table } from "antd";
import React, { Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BUTTON_SIZE, INPUT_SIZE } from "../../../common/ThemeConstants";
import BasicFormComponent from "../../../components/formComponent/BasicFormComponent";
import FormButton from "../../../components/general/FormButton";
import FormSelect from "../../../components/general/FormSelect";
import FormTextField from "../../../components/general/FormTextField";
import { getDate } from "../../../functions/dateFunctions";
import {
  deleteRow,
  resetState,
  setFormFieldValue,
  setInitialState,
  setSearchFieldValue,
  submitForm,
} from "../../../redux/actions/basicFormAction";
import {
  SET_FORM_FIELD_VALUE,
  SET_TABLE_DATA,
  UPDATE_FORM_FIELD,
} from "../../../redux/reduxConstants";
import { postRequest } from "../../../services/mainApp.service";

const columns = [
  {
    title: "Customer Phone",
    dataIndex: "PhoneNumber",
    key: "PhoneNumber",
  },
  {
    title: "Customer Name",
    dataIndex: "CustomerName",
    key: "CustomerName",
  },
  {
    title: "Receivable Amount",
    dataIndex: "PaymentAmount",
    key: "PaymentAmount",
  },
];

const initialFormValues = {
  PhoneNumber: "",
  CompanyId: null,
  OperationId: null,
  UserId: null,
  CustomerId: null,
  VendorId: null,
  PaymentAmount: 0,
  IdStr: "",
  PaymentModeId: null,
  BranchId: null,
  Date: getDate(),
  OrderList: [],
  CustomerList: [],
};
const initialSearchValues = {
  PhoneNumber: "",
  CompanyId: null,
  OperationId: null,
  UserId: null,
  CustomerId: null,
  VendorId: null,
  PaymentAmount: null,
  IdStr: "",
  PaymentModeId: null,
  BranchId: null,
};

const CustomerReceivable = () => {
  const dispatch = useDispatch();
  const controller = new window.AbortController();
  const userData = useSelector((state) => state.authReducer);

  const {
    formFields,
    searchFields,
    itemList,
    formLoading,
    tableLoading,
    supportingTable,
  } = useSelector((state) => state.basicFormReducer);

  const formColumns = [
    {
      title: "Select",
      key: "selected",
      render: (_, record) => {
        return (
          <input
            type="checkbox"
            checked={record.selected}
            onChange={(e) => {
              let data = [...formFields.OrderList];
              let dataIndex = data.findIndex(
                (x) => x.OrderMasterId === record.OrderMasterId
              );
              data[dataIndex].selected = e.target.checked;
              dispatch({
                type: UPDATE_FORM_FIELD,
                payload: {
                  ...formFields,
                  OrderList: data,
                },
              });
            }}
          />
        );
      },
    },
    {
      title: "Order Number",
      dataIndex: "OrderNumber",
      key: "OrderNumber",
    },
    {
      title: "Payable Amount",
      dataIndex: "TotalBalance",
      key: "TotalBalance",
    },
  ];

  const handleSearchChange = (data) => {
    dispatch(setSearchFieldValue(data));
  };

  const handleFormChange = (data) => {
    dispatch(setFormFieldValue(data));
  };

  const handleFormSubmit = (e, id, _, closeForm) => {
    e.preventDefault();
    if (formFields.PaymentAmount === 0) {
      message.error("Received Amount not entered");
      return;
    }
    let data = formFields.OrderList.filter((x) => x.selected);
    if (data?.length === 0) {
      message.error("Please Select an Order from Order List first");
      return;
    }
    let newData = data.map((x) => x.OrderMasterId);
    let orderIds = newData.join(",");

    postRequest(
      "/CustomerVendorPayableReceivable",
      {
        OperationId: 2,
        PhoneNumber: formFields.PhoneNumber,
        UserId: userData.UserId,
        CompanyId: userData.CompanyId,
        CustomerId: formFields.CustomerId,
        BranchId: formFields.BranchId,
        PaymentAmount: parseInt(formFields.PaymentAmount),
        PaymentModeId: formFields.PaymentModeId,
        OrderMasterIdStr: orderIds,
      },
      controller
    ).then((response) => {
      if (response.error === true) {
        message.error(response.errorMessage);
        return;
      }
      if (response.data.response === false) {
        message.error(response.DataSet.Table.errorMessage);
        return;
      }
      if (response.error === false) {
        message.success(response.successMessage);
      }
      dispatch({
        type: UPDATE_FORM_FIELD,
        payload: { ...initialFormValues },
      });
    });
    closeForm();
  };

  const handleFormSearchSubmit = (e) => {

    postRequest(
      "/CustomerVendorPayableReceivable",
      {
        ...formFields,
        OperationId: 3,
        PhoneNumber: formFields.PhoneNumber,
        UserId: userData.UserId,
        CompanyId: userData.CompanyId,
        CustomerId: null,
        PaymentAmount: 0,
        OrderMasterIdStr: "",
        PaymentModeId: null,
        BranchId: null,
      },
      controller
    ).then((response) => {
      if (response.error === true) {
        message.error(response.errorMessage);
        return;
      }
      if (response.data.response === false) {
        message.error(response.DataSet.Table.errorMessage);
        return;
      }
      dispatch({
        type: UPDATE_FORM_FIELD,
        payload: {
          ...formFields,
          OrderList: response?.data?.DataSet?.Table1?.map((x) => ({
            ...x,
            selected: false,
          })),
          CustomerList: response?.data?.DataSet?.Table?.map((x) => ({ ...x })),
        },
      });
      if (response.data.DataSet.Table.length === 0)
        message.error("No Record Found");
    });
  };

  const handleNameSelectSubmit = (e) => {
    dispatch({
      type: UPDATE_FORM_FIELD,
      payload: {
        ...formFields,
        [e.name]: e.value,
      },
    });
  };

  useEffect(() => {
    dispatch(
      setInitialState(
        "/CustomerVendorPayableReceivable",
        {
          ...initialFormValues,
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

  const searchPanel = (
    <Fragment>
      <FormTextField
        colSpan={4}
        label="Customer Number"
        name="PhoneNumber"
        size={INPUT_SIZE}
        value={searchFields.PhoneNumber}
        onChange={handleSearchChange}
        type="text"
        isNumber="true"
      />
    </Fragment>
  );

  const formPanel = (
    <Fragment>
      <div style={{ width: "100%", display: "flex" }}>
        <FormTextField
          colSpan={8}
          label="Customer Number"
          name="PhoneNumber"
          size={INPUT_SIZE}
          value={formFields.PhoneNumber}
          onChange={handleFormChange}
          type="text"
          isNumber="true"
        />

        <Button
          style={{ marginTop: "auto" }}
          type="primary"
          size={BUTTON_SIZE}
          colSpan={2}
          htmlType="button"
          icon={<SearchOutlined />}
          onClick={handleFormSearchSubmit}
        >
          Search
        </Button>
      </div>
      <div
        style={{
          width: "100%",
          display: "flex",
        }}
      >
        <FormSelect
          colSpan={8}
          listItem={formFields.CustomerList}
          idName="CustomerId"
          valueName="CustomerName"
          size={INPUT_SIZE}
          name="CustomerId"
          label="Customer Name"
          value={formFields.CustomerId}
          onChange={handleNameSelectSubmit}
          disabled={formFields?.CustomerList?.length === 0}
          required={true}
        />
        <FormSelect
          colSpan={8}
          listItem={supportingTable.Table2}
          idName="PaymentModeId"
          valueName="PaymentMode"
          size={INPUT_SIZE}
          name="PaymentModeId"
          label="Payment Mode"
          value={formFields.PaymentModeId}
          onChange={handleNameSelectSubmit}
          disabled={formFields?.CustomerList?.length === 0}
          required={true}
        />
        <FormSelect
          colSpan={8}
          listItem={supportingTable.Table1}
          idName="BranchId"
          valueName="BranchName"
          size={INPUT_SIZE}
          name="BranchId"
          label="Branch"
          value={formFields.BranchId}
          onChange={handleNameSelectSubmit}
          disabled={formFields?.CustomerList?.length === 0}
          required={true}
        />
      </div>

      <Col span={24} style={{ border: "1px solid lightgray", borderRadius: 5 }}>
        <Table
          size="small"
          columns={formColumns}
          dataSource={
            formFields.OrderList
              ? formFields.OrderList.filter(
                  (x) => x.CustomerId === formFields.CustomerId
                )
              : []
          }
        />
      </Col>

      <div
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <FormTextField
          style={{ color: "#000000" }}
          colSpan={8}
          label="Bank Name"
          name="BankName"
          size={INPUT_SIZE}
          // value={}
          onChange={handleFormChange}
          type="text"
          isNumber="true"
        />
        <FormTextField
          style={{ color: "#000000" }}
          colSpan={8}
          label="Cheque / OTN / DD"
          name="ChequeNumber"
          size={INPUT_SIZE}
          // value={}
          onChange={handleFormChange}
          type="text"
          isNumber="true"
        />
        <FormTextField
          colSpan={8}
          label="Date"
          type="date"
          name="Date"
          size={INPUT_SIZE}
          value={formFields.Date}
          onChange={handleFormChange}
          required={true}
        />
      </div>
      <div
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <FormTextField
          style={{ color: "#000000" }}
          colSpan={8}
          label="Total Payable"
          name="TotalPayable"
          size={INPUT_SIZE}
          value={
            formFields?.CustomerList?.length > 0
              ? parseFloat(
                  formFields?.CustomerList?.find(
                    (acc) => acc.CustomerId === formFields?.CustomerId
                  )?.TotalBalance
                ).toFixed(2)
              : "0"
          }
          onChange={handleFormChange}
          type="text"
          isNumber="true"
          disabled={true}
        />
        <FormTextField
          colSpan={8}
          label="Received Amount"
          name="PaymentAmount"
          size={INPUT_SIZE}
          value={formFields.PaymentAmount}
          onChange={handleFormChange}
          type="text"
          isNumber="true"
          required={true}
        />
      </div>
      <div
        style={{
          width: "100%",
        }}
      >
        <FormTextField
          style={{ color: "#000000" }}
          colSpan={8}
          label="Return Amount"
          name="ReturnAmount"
          size={INPUT_SIZE}
          value={
            formFields?.CustomerList?.length > 0
              ? parseFloat(
                  formFields?.CustomerList?.find(
                    (acc) => acc.CustomerId + formFields.CustomerId
                  )?.TotalBalance - formFields?.PaymentAmount
                ).toFixed(2)
              : "0"
          }
          onChange={handleFormChange}
          type="text"
          isNumber="true"
          disabled={true}
        />
      </div>
    </Fragment>
  );

  return (
    <BasicFormComponent
      formTitle="Customer Receivable"
      searchPanel={searchPanel}
      formPanel={formPanel}
      // searchSubmit={handleSearchSubmit}
      onFormSave={handleFormSubmit}
      tableRows={itemList}
      tableLoading={tableLoading}
      formLoading={formLoading}
      tableColumn={columns}
      // deleteRow={handleDeleteRow}
      actionID="CustomerReceivableId"
      // editRow={setUpdateId}
      fields={initialFormValues}
      crudTitle="Customer Receivable"
    />
  );
};

export default CustomerReceivable;
