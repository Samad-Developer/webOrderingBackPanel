import { SearchOutlined } from "@ant-design/icons";
import { Button, Col, Input, message, Radio, Row, Space, Table } from "antd";
import TextArea from "antd/lib/input/TextArea";
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
  SET_SEARCH_FIELD_VALUE,
  UPDATE_FORM_FIELD,
} from "../../../redux/reduxConstants";
import { postRequest } from "../../../services/mainApp.service";

const columns = [
  {
    title: "Vendor Name",
    dataIndex: "VendorName",
    key: "VendorName",
  },
  {
    title: "Voucher Number",
    dataIndex: "VoucherNumber",
    key: "VoucherNumber",
  },
  {
    title: "Amount",
    dataIndex: "TotalPaymentAmount",
    key: "TotalPaymentAmount",
  },
  {
    title: "Date",
    dataIndex: "VoucherDate",
    key: "VoucherDate",
    render: (_, record) => record?.VoucherDate?.split("T")[0],
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
  Type: "V",
  UserIP: "",
  ChequeNo: "",
  InVoiceList: [],
  PayableReceivableVoucherMasterId: null,
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
  Type: "",
  UserIP: "",
  ChequeNo: "",
};

const VendorPayable = () => {
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

    let data = formFields.InVoiceList.filter((x) => x.selected);
    let newData = data.map((x) => x.PurchaseInvoiceId);
    let inVoiceIds = newData.join(",");

    postRequest(
      "/CustomerVendorPayableReceivable",
      {
        OperationId: 2,
        PhoneNumber: null,
        UserId: userData.UserId,
        CompanyId: userData.CompanyId,
        PaymentModeId: formFields.PaymentModeId,
        BranchId: formFields.BranchId,
        VendorId: formFields.VendorId,
        PaymentAmount: formFields.PaymentAmount,
        IdStr: inVoiceIds,
        Type: "V",
        UserIP: "1.2.2.1",
        ChequeNo: formFields.ChequeNo,
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
        OperationId: 3,
        PhoneNumber: null,
        UserId: userData.UserId,
        CompanyId: userData.CompanyId,
        PaymentModeId: formFields.PaymentModeId,
        BranchId: userData.branchId,
        VendorId: formFields.VendorId,
        PaymentAmount: null,
        IdStr: "",
        Type: "V",
        UserIP: "1.2.2.1",
        ChequeNo: "",
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
          InVoiceList: response?.data?.DataSet?.Table?.map((x) => ({
            ...x,
            selected: false,
          })),
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

  const handleSearchSelectSubmit = (e) => {
    dispatch({
      type: SET_SEARCH_FIELD_VALUE,
      payload: {
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
      <FormSelect
        colSpan={8}
        listItem={supportingTable.Table3}
        idName="VendorId"
        valueName="VendorName"
        size={INPUT_SIZE}
        name="VendorId"
        label="Vendor Name"
        value={searchFields.VendorId}
        onChange={handleSearchSelectSubmit}
        required={true}
      />
    </Fragment>
  );

  const formPanel = (
    <Fragment>
      {/* <div style={{ width: "100%", display: "flex" }}>
        <FormTextField
          colSpan={8}
          label="Vendor Number"
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
      </div> */}
      <div
        style={{
          width: "100%",
          display: "flex",
        }}
      >
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
          // disabled={formFields?.CustomerList?.length === 0}
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
      </div>
      <FormSelect
        colSpan={8}
        listItem={supportingTable.Table3}
        idName="VendorId"
        valueName="VendorName"
        size={INPUT_SIZE}
        name="VendorId"
        label="Vendor Name"
        value={formFields.VendorId}
        onChange={handleNameSelectSubmit}
        // disabled={formFields?.CustomerList?.length === 0}
        required={true}
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

      <Col span={24} style={{ border: "1px solid lightgray", borderRadius: 5 }}>
        <table>
          <thead>
            <tr
              style={{
                fontWeight: "bold",
              }}
            >
              <th>
                <input
                  type="checkbox"
                  checked={
                    formFields?.InVoiceList?.length > 0
                      ? formFields?.InVoiceList?.filter(
                          (x) => x.VendorId === formFields.VendorId
                        ).every((x) => x.selected)
                      : false
                  }
                  onChange={(e) => {
                    dispatch({
                      type: SET_FORM_FIELD_VALUE,
                      payload: {
                        name: "InVoiceList",
                        value: formFields.InVoiceList.map((x) => ({
                          ...x,
                          selected: e.target.checked,
                        })),
                      },
                    });
                  }}
                />{" "}
                <b> Select</b>
              </th>
              <th>
                <b>Purchase Invoice Number</b>
              </th>
              <th>
                <b>Payable Amount</b>
              </th>
            </tr>
          </thead>
          <tbody>
            {formFields?.InVoiceList?.filter(
              (x) => x.VendorId === formFields.VendorId
            ).map((item) => (
              <tr>
                <td>
                  <input
                    type="checkbox"
                    checked={item.selected}
                    onChange={(e) => {
                      let data = formFields.InVoiceList;
                      data.find(
                        (x) => x.PurchaseInvoiceId === item.PurchaseInvoiceId
                      ).selected = e.target.checked;
                      dispatch({
                        type: UPDATE_FORM_FIELD,
                        payload: {
                          ...formFields,
                          InVoiceList: data,
                        },
                      });
                    }}
                  />
                </td>
                <td>{item.PurchaseInvoiceNumber}</td>
                <td>{item.TotalBalance}</td>
              </tr>
            ))}
          </tbody>
        </table>
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
          name="ChequeNo"
          size={INPUT_SIZE}
          value={formFields.ChequeNo}
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
          onChange={handleSearchChange}
          required
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
          label="Balance"
          name="Balance"
          size={INPUT_SIZE}
          value={formFields?.InVoiceList?.reduce(
            (acc, curr) => acc + curr.TotalBalance,
            0
          )}
          onChange={handleFormChange}
          type="text"
          isNumber="true"
          disabled={true}
        />
        <FormTextField
          style={{ color: "#000000" }}
          colSpan={8}
          label="Total Payable"
          name="TotalPayable"
          size={INPUT_SIZE}
          value={parseFloat(
            formFields?.InVoiceList?.filter((x) => x.selected).reduce(
              (acc, curr) => acc + curr.TotalBalance,
              0
            )
          ).toFixed(2)}
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
            formFields?.PaymentAmount -
              formFields?.InVoiceList?.filter((x) => x.selected).reduce(
                (acc, curr) => acc + curr.TotalBalance,
                0
              ) >
            0
              ? parseFloat(
                  formFields?.PaymentAmount -
                    formFields?.InVoiceList?.filter((x) => x.selected).reduce(
                      (acc, curr) => acc + curr.TotalBalance,
                      0
                    )
                ).toFixed(2)
              : 0
          }
          onChange={handleFormChange}
          type="text"
          isNumber="true"
          disabled={true}
        />
      </div>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <label>Remarks: </label>
        <TextArea rows={4} cols={120} />
      </div>
    </Fragment>
  );

  return (
    <BasicFormComponent
      formTitle="Vendor Payable"
      searchPanel={searchPanel}
      formPanel={formPanel}
      // searchSubmit={handleSearchSubmit}
      onFormSave={handleFormSubmit}
      tableRows={itemList}
      tableLoading={tableLoading}
      formLoading={formLoading}
      tableColumn={columns}
      // deleteRow={handleDeleteRow}
      actionID="VendorPayableId"
      // editRow={setUpdateId}
      fields={initialFormValues}
      crudTitle="Vendor Payable"
      hideDelete={true}
    />
  );
};

export default VendorPayable;
