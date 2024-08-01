import React, { Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { INPUT_SIZE } from "../../../common/ThemeConstants";
import BasicFormComponent from "../../../components/formComponent/BasicFormComponent";
import FormSelect from "../../../components/general/FormSelect";
import FormTextField from "../../../components/general/FormTextField";
import { dateformatFunction } from "../../../functions/dateFunctions";
import {
  deleteRow,
  resetState,
  setFormFieldValue,
  setInitialState,
  setSearchFieldValue,
  submitForm,
} from "../../../redux/actions/basicFormAction";
import { UPDATE_FORM_FIELD } from "../../../redux/reduxConstants";

const initialFormValues = {
  COAID: null,
  Amount: null,
  IsActive: true,
  BranchID: null,
  PaymentModeID: null,
  PaymentAccountID: null,
  VoucherIDD: null,
  Date: null,
  Description: "",
  InvoiceNo: "",
  ChequeNo: "",
  FromDate: null,
  ToDate: null,
  IS_IN: null,
  IS_CASH: null,
  Rate: 0,
  lst_REC_PAY_COA: [],
  lst_REC_PAY_PAYMENT: [],
  Mode: 1,
  VendorID: null,
  CustomerID: null,
};

const initialSearchValues = {
  COAID: null,
  Amount: null,
  IsActive: true,
  BranchID: null,
  PaymentModeID: null,
  PaymentAccountID: null,
  VoucherIDD: null,
  Date: null,
  Description: "",
  InvoiceNo: "",
  ChequeNo: "",
  FromDate: null,
  ToDate: null,
  IS_IN: null,
  IS_CASH: null,
  Rate: 0,
  lst_REC_PAY_COA: [],
  lst_REC_PAY_PAYMENT: [],
  Mode: 1,
  VendorID: null,
  CustomerID: null,
};

const columns = [
  {
    title: "Date",
    key: "Date",
    render: (_, record) => dateformatFunction(record.Date),
  },
  {
    title: "Branch Name",
    key: "BranchName",
    dataIndex: "BranchName",
  },
  {
    title: "Mode Name",
    key: "ModeName",
    dataIndex: "ModeName",
  },
  {
    title: "Account Of",
    dataIndex: "AccountName",
    key: "AccountName",
  },
  {
    title: "Vendor Name",
    dataIndex: "VendorName",
    key: "VendorName",
  },
  {
    title: "Customer Name",
    dataIndex: "CustomerName",
    key: "CustomerName",
  },
  {
    title: "Bank Name",
    dataIndex: "BankName",
    key: "BankName",
  },
  {
    title: "Payment From",
    dataIndex: "PaymentAccountName",
    key: "PaymentAccountName",
  },
  {
    title: "Payment Mode",
    dataIndex: "PaymentMode",
    key: "PaymentMode",
  },
  {
    title: "Amount",
    dataIndex: "Amount",
    key: "Amount",
  },
  {
    title: "Rate",
    dataIndex: "Rate",
    key: "Rate",
  },
  {
    title: "Invoice",
    dataIndex: "InvoiceNo",
    key: "InvoiceNo",
  },
  {
    title: "Chq / DD / PO / OT",
    dataIndex: "ChequeNo",
    key: "ChequeNo",
  },
];

const CashBankIn = () => {
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
        "/CrudRecieveablePayable",
        formFields,
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
      let data = itemList.filter((item) => item.VoucherIDD === updateId)[0];
      const date = data.Date.split("T")[0];

      dispatch({
        type: UPDATE_FORM_FIELD,
        payload: {
          ...data,
          Date: date,
          IS_IN:
            formFields.IS_IN === 1 || formFields.IS_IN === 2 ? true : false,
        },
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
    searchFields.CityName = searchFields.CityName.trim();
    dispatch(
      setInitialState(
        "/CrudRecieveablePayable",
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
        "/CrudRecieveablePayable",
        { VoucherIDD: id },
        controller,
        userData
      )
    );
  };

  const handleFormSubmit = (e, id, _, closeForm) => {
    e.preventDefault();
    dispatch(
      submitForm(
        "/CrudRecieveablePayable",
        {
          ...formFields,
          IS_IN:
            formFields.IS_IN === 1 || formFields.IS_IN === 2 ? true : false,
        },
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
      <FormSelect
        colSpan={4}
        listItem={[
          { id: 1, name: "Cash IN" },
          { id: 2, name: "Bank IN" },
          { id: 3, name: "Cash OUT" },
          { id: 4, name: "Bank OUT" },
        ]}
        idName="id"
        valueName="name"
        size={INPUT_SIZE}
        name="IS_IN"
        label="Transaction Type"
        value={formFields.IS_IN}
        onChange={handleFormChange}
      />
      {userData.branchId === null && (
        <FormSelect
          colSpan={4}
          listItem={supportingTable.Table7 || []}
          idName="BranchId"
          valueName="BranchName"
          size={INPUT_SIZE}
          name="BranchID"
          label="Branch"
          value={formFields.BranchID}
          onChange={handleFormChange}
        />
      )}
      <FormSelect
        colSpan={4}
        listItem={supportingTable.Table8 || []}
        idName="ChartOfAccountId"
        valueName="AccountName"
        size={INPUT_SIZE}
        name="COAID"
        label="Pay For"
        value={formFields.COAID}
        onChange={handleFormChange}
      />
      <FormSelect
        colSpan={4}
        listItem={[
          { id: 1, name: "Cash" },
          { id: 0, name: "Bank" },
        ]}
        idName="id"
        valueName="name"
        formFields={INPUT_SIZE}
        name="Mode"
        label="Payment From"
        value={formFields.Mode}
        onChange={handleFormChange}
      />
      {formFields.Mode === 1 && (
        <FormSelect
          colSpan={4}
          listItem={supportingTable.Table2 || []}
          idName="ChartOfAccountId"
          valueName="AccountName"
          size={INPUT_SIZE}
          name="PaymentAccountID"
          label="Cash Account"
          value={formFields.PaymentAccountID}
          onChange={handleFormChange}
        />
      )}
      {formFields.Mode === 0 && (
        <>
          <FormSelect
            colSpan={4}
            listItem={supportingTable.Table3 || []}
            idName="BankId"
            valueName="BankName"
            size={INPUT_SIZE}
            name="BankId"
            label="Bank"
            value={formFields.BankId}
            onChange={handleFormChange}
          />
          <FormSelect
            colSpan={4}
            listItem={
              supportingTable.Table4.filter(
                (x) => x.BankId === formFields.BankId
              ) || []
            }
            idName="BankDetailId"
            valueName="AccountNo"
            size={INPUT_SIZE}
            name="PaymentAccountID"
            label="Account Number"
            value={formFields.PaymentAccountID}
            onChange={handleFormChange}
            disabled={formFields.BankId === null}
          />
          <FormSelect
            colSpan={4}
            listItem={
              supportingTable.Table6.filter((x) =>
                formFields.Mode === 1
                  ? x.IsPosType === true
                  : x.IsPosType === false
              ) || []
            }
            idName="PaymentModeid"
            valueName="PaymentMode"
            size={INPUT_SIZE}
            name="PaymentModeID"
            label="Payment Mode"
            value={formFields.PaymentModeID}
            onChange={handleFormChange}
          />
        </>
      )}
      <FormTextField
        colSpan={4}
        label="Amount"
        name="Amount"
        size={INPUT_SIZE}
        value={formFields.Amount}
        onChange={handleFormChange}
      />
      <FormTextField
        colSpan={4}
        type="date"
        label="Date"
        name="Date"
        size={INPUT_SIZE}
        value={formFields.Date}
        onChange={handleFormChange}
      />
      {formFields.Mode === 2 && (
        <FormTextField
          colSpan={4}
          label="Chq / DD / OTN"
          name="ChequeNo"
          size={INPUT_SIZE}
          value={formFields.ChequeNo}
          onChange={handleFormChange}
        />
      )}
      <FormTextField
        colSpan={4}
        label="Invoice Number"
        name="InvoiceNo"
        size={INPUT_SIZE}
        value={formFields.InvoiceNo}
        onChange={handleFormChange}
      />
    </Fragment>
  );

  const formPanel = (
    <Fragment>
      <FormSelect
        colSpan={8}
        listItem={[
          { id: 1, name: "Cash IN" },
          { id: 1, name: "Bank IN" },
          { id: 0, name: "Cash OUT" },
          { id: 0, name: "Bank OUT" },
        ]}
        idName="id"
        valueName="name"
        size={INPUT_SIZE}
        name="IS_IN"
        label="Transaction Type"
        value={formFields.IS_IN}
        onChange={handleFormChange}
      />
      {userData.branchId === null && (
        <FormSelect
          colSpan={8}
          listItem={supportingTable.Table7 || []}
          idName="BranchId"
          valueName="BranchName"
          size={INPUT_SIZE}
          name="BranchID"
          label="Branch"
          value={formFields.BranchID}
          onChange={handleFormChange}
        />
      )}
      <FormSelect
        colSpan={8}
        listItem={supportingTable.Table8 || []}
        idName="ChartOfAccountId"
        valueName="AccountName"
        size={INPUT_SIZE}
        name="COAID"
        label="Pay For"
        value={formFields.COAID}
        onChange={handleFormChange}
      />
      <FormSelect
        colSpan={8}
        listItem={[
          { id: 1, name: "Cash" },
          { id: 2, name: "Bank" },
        ]}
        idName="id"
        valueName="name"
        formFields={INPUT_SIZE}
        name="Mode"
        label="Payment From"
        value={formFields.Mode}
        onChange={handleFormChange}
      />
      {formFields.Mode === 1 && (
        <FormSelect
          colSpan={8}
          listItem={supportingTable.Table2 || []}
          idName="ChartOfAccountId"
          valueName="AccountName"
          size={INPUT_SIZE}
          name="PaymentAccountID"
          label="Cash Account"
          value={formFields.PaymentAccountID}
          onChange={handleFormChange}
        />
      )}
      {formFields.Mode === 2 && (
        <>
          <FormSelect
            colSpan={8}
            listItem={supportingTable.Table3 || []}
            idName="BankId"
            valueName="BankName"
            size={INPUT_SIZE}
            name="BankId"
            label="Bank"
            value={formFields.BankId}
            onChange={handleFormChange}
          />
          <FormSelect
            colSpan={8}
            listItem={
              supportingTable.Table4.filter(
                (x) => x.BankId === formFields.BankId
              ) || []
            }
            idName="BankDetailId"
            valueName="AccountNo"
            size={INPUT_SIZE}
            name="PaymentAccountID"
            label="Account Number"
            value={formFields.PaymentAccountID}
            onChange={handleFormChange}
            disabled={formFields.BankId === null}
          />
          <FormSelect
            colSpan={8}
            listItem={
              supportingTable.Table6.filter((x) =>
                formFields.Mode === 1
                  ? x.IsPosType === true
                  : x.IsPosType === false
              ) || []
            }
            idName="PaymentModeid"
            valueName="PaymentMode"
            size={INPUT_SIZE}
            name="PaymentModeID"
            label="Payment Mode"
            value={formFields.PaymentModeID}
            onChange={handleFormChange}
          />
        </>
      )}
      <FormTextField
        colSpan={8}
        label="Rate"
        name="Rate"
        size={INPUT_SIZE}
        value={formFields.Rate}
        onChange={handleFormChange}
      />
      <FormTextField
        colSpan={8}
        label="Amount"
        name="Amount"
        size={INPUT_SIZE}
        value={formFields.Amount}
        onChange={handleFormChange}
      />
      <FormTextField
        colSpan={8}
        type="date"
        label="Date"
        name="Date"
        size={INPUT_SIZE}
        value={formFields.Date}
        onChange={handleFormChange}
      />
      {formFields.Mode === 2 && (
        <FormTextField
          colSpan={8}
          label="Chq / DD / OTN"
          name="ChequeNo"
          size={INPUT_SIZE}
          value={formFields.ChequeNo}
          onChange={handleFormChange}
        />
      )}
      <FormTextField
        colSpan={8}
        label="Invoice Number"
        name="InvoiceNo"
        size={INPUT_SIZE}
        value={formFields.InvoiceNo}
        onChange={handleFormChange}
      />
      <FormTextField
        colSpan={16}
        label="Description"
        name="Description"
        size={INPUT_SIZE}
        value={formFields.Description}
        onChange={handleFormChange}
      />
    </Fragment>
  );
  return (
    <BasicFormComponent
      formTitle="Cash Bank IN / OUT"
      searchPanel={searchPanel}
      formPanel={formPanel}
      searchSubmit={handleSearchSubmit}
      onFormSave={handleFormSubmit}
      tableRows={itemList}
      tableLoading={tableLoading}
      formLoading={formLoading}
      tableColumn={columns}
      deleteRow={handleDeleteRow}
      actionID="VoucherIDD"
      editRow={setUpdateId}
      fields={initialFormValues}
      formWidth="50vw"
      crudTitle="Cash Bank IN / OUT"
    />
  );
};

export default CashBankIn;
