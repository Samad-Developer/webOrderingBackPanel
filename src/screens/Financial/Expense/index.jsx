import { Col, message } from "antd";
import TextArea from "antd/lib/input/TextArea";
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
  OperationId: 1,
  ExpenseTypeID: null,
  ExpenseAmount: 0,
  IsActive: true,
  BranchID: null,
  PaymentModeID: null,
  PaymentAccountID: null,
  ExpenseID: null,
  Date: dateformatFunction(Date.now()),
  Description: "",
  InvoiceNo: "",
  DateFrom: null,
  DateTo: null,
  ChequeNo: "",
};

const initialSearchValues = {
  OperationId: 1,
  ExpenseTypeID: null,
  ExpenseAmount: 0,
  IsActive: true,
  BranchID: null,
  PaymentModeID: null,
  PaymentAccountID: null,
  ExpenseID: null,
  Date: null,
  DateFrom: null,
  DateTo: null,
  Description: "",
  InvoiceNo: "",
  BankId: null,
  ChequeNo: "",
};

const columns = [
  {
    title: "Expense Type",
    dataIndex: "ExpenseTypeName",
    key: "ExpenseTypeName",
  },
  {
    title: "Date",
    key: "Date",
    render: (_, record) => <p>{dateformatFunction(record.Date)}</p>,
  },
  {
    title: "Payment Mode",
    dataIndex: "PaymentModeName",
    key: "PaymentModeName",
  },
  {
    title: "Expense Amount",
    dataIndex: "ExpenseAmount",
    key: "ExpenseAmount",
    render: (_, record) => (
      <p>
        {record.ExpenseAmount < 0
          ? `(${record.ExpenseAmount * -1})`
          : record.ExpenseAmount}
      </p>
    ),
  },
  {
    title: "Branch",
    dataIndex: "BranchName",
    key: "BranchName",
  },
  {
    title: "Bank",
    dataIndex: "BankName",
    key: "BankName",
  },
];

const Expense = () => {
  const dispatch = useDispatch();
  const controller = new window.AbortController();
  const userData = useSelector((state) => state.authReducer);
  const [updateId, setUpdateId] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [deleteData, setDeleteData] = useState(null);

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
        "/CrudExpense",
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
      let obj = itemList.filter((item) => item.ExpenseID === updateId)[0];
      dispatch({
        type: UPDATE_FORM_FIELD,
        payload: { ...obj, Date: dateformatFunction(obj.Date) },
      });
    }
    setUpdateId(null);
  }, [updateId]);

  useEffect(() => {
    if (deleteId !== null) {
      let data = itemList.filter((item) => item.ExpenseID === deleteId)[0];
      dispatch(
        deleteRow(
          "/CrudExpense",
          { ...data, IsActive: false },
          controller,
          userData
        )
      );
    }
    setDeleteId(null);
  }, [deleteId]);

  const handleSearchChange = (data) => {
    dispatch(setSearchFieldValue(data));
  };

  const handleFormChange = (data) => {
    if (data.name === "Mode") {
      dispatch(setFormFieldValue({ name: "PaymentAccountID", value: null }));
      dispatch(setFormFieldValue({ name: "BankId", value: null }));
      dispatch(setFormFieldValue({ name: "PaymentModeID", value: null }));
    }
    dispatch(setFormFieldValue(data));
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    dispatch(
      setInitialState(
        "/CrudExpense",
        searchFields,
        initialFormValues,
        searchFields,
        controller,
        userData
      )
    );
  };

  const handleDeleteRow = (id) => {
    setDeleteId(id);
  };

  const handleFormSubmit = (e, id, _, closeForm) => {
    e.preventDefault();
    dispatch(
      submitForm(
        "/CrudExpense",
        userData.branchId === null
          ? formFields
          : { ...formFields, BranchID: userData.branchId },
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
        listItem={supportingTable?.Table4 || []}
        idName="ExpenseTypeID"
        valueName="ExpenseTypeName"
        size={INPUT_SIZE}
        name="ExpenseTypeID"
        label="Expense Type"
        value={searchFields.ExpenseTypeID}
        onChange={handleSearchChange}
      />
      <FormSelect
        colSpan={4}
        listItem={[
          { id: 1, name: "Cash" },
          { id: 2, name: "Bank" },
        ]}
        idName="id"
        valueName="name"
        formFields={INPUT_SIZE}
        name="Mode"
        label="Payment From"
        value={searchFields.Mode}
        onChange={handleSearchChange}
      />
      {userData.branchId === null && (
        <FormSelect
          colSpan={4}
          listItem={supportingTable?.Table6 || []}
          idName="BranchId"
          valueName="BranchName"
          size={INPUT_SIZE}
          name="BranchID"
          label="Branch"
          value={searchFields.BranchID}
          onChange={handleSearchChange}
        />
      )}
      <FormSelect
        colSpan={4}
        listItem={supportingTable?.Table1 || []}
        idName="ChartOfAccountId"
        valueName="AccountName"
        size={INPUT_SIZE}
        name="PaymentAccountID"
        label="Payment Account"
        value={searchFields.PaymentAccountID}
        onChange={handleSearchChange}
      />

      <FormSelect
        colSpan={4}
        listItem={supportingTable?.Table2 || []}
        idName="BankId"
        valueName="BankName"
        size={INPUT_SIZE}
        name="BankId"
        label="Bank"
        value={searchFields.BankId}
        onChange={handleSearchChange}
      />
      <FormSelect
        colSpan={4}
        listItem={
          supportingTable?.Table3?.filter(
            (x) => x.BankId === formFields.BankId
          ) || []
        }
        idName="BankDetailId"
        valueName="AccountNo"
        size={INPUT_SIZE}
        name="PaymentAccountID"
        label="Account Number"
        value={searchFields.PaymentAccountID}
        onChange={handleSearchChange}
        disabled={searchFields.BankId === null}
      />
      <FormSelect
        colSpan={4}
        listItem={supportingTable?.Table5 || []}
        idName="PaymentModeid"
        valueName="PaymentMode"
        size={INPUT_SIZE}
        name="PaymentModeID"
        label="Payment Mode"
        value={searchFields.PaymentModeID}
        onChange={handleSearchChange}
      />

      <FormTextField
        colSpan={4}
        type="date"
        label="Date"
        name="DateTo"
        size={INPUT_SIZE}
        // value={() => dateformatFunction(searchFields.DateTo)}
        value={searchFields.DateTo}
        onChange={handleSearchChange}
      />
      <FormTextField
        colSpan={4}
        label="Chq / DD / OTN"
        name="ChequeNo"
        size={INPUT_SIZE}
        value={searchFields.ChequeNo}
        onChange={handleSearchChange}
      />

      <FormTextField
        colSpan={4}
        label="Invoice Number"
        name="InvoiceNo"
        size={INPUT_SIZE}
        value={searchFields.InvoiceNo}
        onChange={handleSearchChange}
      />
    </Fragment>
  );

  const formPanel = (
    <Fragment>
      {userData.branchId === null && (
        <FormSelect
          colSpan={9}
          listItem={supportingTable.Table6 || []}
          idName="BranchId"
          valueName="BranchName"
          size={INPUT_SIZE}
          name="BranchID"
          label="Branch"
          value={formFields.BranchID}
          onChange={handleFormChange}
          required={true}
        />
      )}
      <FormTextField
        colSpan={9}
        type="date"
        label="Date"
        name="Date"
        size={INPUT_SIZE}
        value={formFields.Date}
        onChange={handleFormChange}
        max={dateformatFunction(Date.now())}
        required={true}
      />
      <FormSelect
        colSpan={9}
        listItem={supportingTable.Table4 || []}
        idName="ExpenseTypeID"
        valueName="ExpenseTypeName"
        size={INPUT_SIZE}
        name="ExpenseTypeID"
        label="Expense Type"
        value={formFields.ExpenseTypeID}
        onChange={handleFormChange}
        required
      />
      <FormSelect
        colSpan={9}
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
        required={true}
      />
      {formFields.Mode === 1 && (
        <FormSelect
          colSpan={8}
          listItem={supportingTable.Table1 || []}
          idName="ChartOfAccountId"
          valueName="AccountName"
          size={INPUT_SIZE}
          name="PaymentAccountID"
          label="Cash Account"
          value={formFields.PaymentAccountID}
          onChange={handleFormChange}
          required={true}
        />
      )}
      {formFields.Mode === 2 && (
        <>
          <FormSelect
            colSpan={8}
            listItem={supportingTable.Table2 || []}
            idName="BankId"
            valueName="BankName"
            size={INPUT_SIZE}
            name="BankId"
            label="Bank"
            value={formFields.BankId}
            onChange={handleFormChange}
            required={true}
          />
          <FormSelect
            colSpan={8}
            listItem={
              supportingTable.Table3.filter(
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
            required={true}
          />
          <FormSelect
            colSpan={8}
            listItem={
              supportingTable.Table5.filter((x) =>
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
            required={true}
          />
        </>
      )}
      <FormTextField
        colSpan={8}
        label="Expense Amount"
        name="ExpenseAmount"
        size={INPUT_SIZE}
        value={formFields.ExpenseAmount}
        onChange={handleFormChange}
        required={true}
        isNumber="true"
      />
      {formFields.Mode === 2 && (
        <FormTextField
          colSpan={8}
          label="Chq / DD / OTN"
          name="ChequeNo"
          size={INPUT_SIZE}
          value={formFields.ChequeNo}
          onChange={handleFormChange}
          required={true}
        />
      )}
      <FormTextField
        colSpan={8}
        label="Invoice Number"
        name="InvoiceNo"
        size={INPUT_SIZE}
        value={formFields.InvoiceNo}
        onChange={handleFormChange}
        required={true}
      />
      <Col span={24}>
        <span>Description</span>
        <TextArea
          showCount
          maxLength={1000}
          name="Description"
          size={INPUT_SIZE}
          value={formFields.Description}
          onChange={(e) =>
            handleFormChange({ name: e.target.name, value: e.target.value })
          }
          required={true}
        />
      </Col>
    </Fragment>
  );

  return (
    <BasicFormComponent
      formTitle="Expenses"
      searchPanel={searchPanel}
      formPanel={formPanel}
      searchSubmit={handleSearchSubmit}
      onFormSave={handleFormSubmit}
      tableRows={itemList}
      tableLoading={tableLoading}
      formLoading={formLoading}
      tableColumn={columns}
      deleteRow={handleDeleteRow}
      actionID="ExpenseID"
      editRow={setUpdateId}
      fields={initialFormValues}
      crudTitle="Expense"
      formWidth={"50vw"}
    />
  );
};

export default Expense;
