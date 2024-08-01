import { SearchOutlined } from "@ant-design/icons";
import { Button, Col, Input, message, Radio, Row, Space, Table } from "antd";
import React, { Fragment, useEffect, useState, useRef } from "react";
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
import { UPDATE_FORM_FIELD } from "../../../redux/reduxConstants";
import { postRequest } from "../../../services/mainApp.service";
import { useReactToPrint } from "react-to-print";
import { EyeOutlined } from "@ant-design/icons";
import ModalComponent from "../../../components/formComponent/ModalComponent";
import Title from "antd/lib/typography/Title";

const columns = [
  {
    title: "Customer Name",
    dataIndex: "CustomerName",
    key: "CustomerName",
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
  Type: "C",
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

const CustomerReceivableNew = () => {
  const reportRef = useRef();
  const dispatch = useDispatch();
  const controller = new window.AbortController();
  const userData = useSelector((state) => state.authReducer);
  const [consumptionReport, setConsumptionReport] = useState(false);
  const [consumptionLoading, setConsumptionLoading] = useState(false);

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
      render: (_, record, index) => {
        return (
          <input
            type="checkbox"
            checked={record.selected}
            onChange={(e) => {
              let data = formFields.InVoiceList;
              data[index].selected = e.target.checked;
              dispatch({
                type: UPDATE_FORM_FIELD,
                payload: {
                  ...formFields,
                  InVoiceList: data,
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
      key: "OrderMasterId",
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

  const handleSearchSubmit = (e) => {
    e.preventDefault();

    dispatch(
      setInitialState(
        "/CustomerVendorPayableReceivable",
        searchFields,
        initialFormValues,
        searchFields,
        controller,
        userData
      )
    );
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
        CustomerId: formFields.CustomerId,
        PaymentAmount: formFields.PaymentAmount,
        IdStr: inVoiceIds,
        Type: "C",
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
        BranchId: formFields.BranchId,
        CustomerId: formFields.CustomerId,
        PaymentAmount: null,
        IdStr: "",
        Type: "C",
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

  const handleOnPrint = useReactToPrint({
    content: () => reportRef.current,
    pageStyle: `
    @media print {
      .main {
        page-break-inside: avoid;
      }
    }
    `,
  });

  const viewDailyExpenseReport = (record, opId) => {
    if (record) {
      setConsumptionReport(record);
      setConsumptionLoading(false);
    } else {
      setConsumptionLoading(true);
    }
  };

  // Consumption Report
  const ConsumptionReport = React.forwardRef((props, ref) => {
    const { reportData } = props;

    return (
      <div
        ref={ref}
        style={{
          backgroundColor: "white",
          margin: "10px 5px",
          fontWeight: "1000",
          color: "#000",
          overflow: "auto",
          pageBreakInside: "avoid",
          pageBreakAfter: "avoid",
          pageBreakBefore: "avoid",
        }}
        // className="main"
      >
        {/* heading */}
        {consumptionLoading ? (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItem: "center",
            }}
          >
            <Spin spinning={consumptionLoading} />
          </div>
        ) : (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <p style={{ margin: "3px 0", textAlign: "center" }}>Voucher No</p>
              <p style={{ margin: "3px 0", textAlign: "center" }}>
                {reportData.VoucherNumber}
              </p>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <p style={{ margin: "3px 0", textAlign: "center" }}>
                Branch Name
              </p>
              <p style={{ margin: "3px 0", textAlign: "center" }}>
                {reportData.BranchName}
              </p>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <p style={{ margin: "3px 0", textAlign: "center" }}>
                Customer Name
              </p>
              <p style={{ margin: "3px 0", textAlign: "center" }}>
                {reportData.CustomerName}
              </p>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <p style={{ margin: "3px 0", textAlign: "center" }}>
                Total Amount
              </p>
              <p style={{ margin: "3px 0", textAlign: "center" }}>
                {reportData.TotalPaymentAmount}
              </p>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <p style={{ margin: "3px 0", textAlign: "center" }}>
                Voucher Date
              </p>
              <p style={{ margin: "3px 0", textAlign: "center" }}>
                {/* {moment(reportData.ReservationDate).format("YYYY-MM-DD")} */}
                {reportData.VoucherDate &&
                  new Date(reportData.VoucherDate).toLocaleString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                    hour: "numeric",
                    minute: "numeric",
                    hour12: true,
                  })}
              </p>
            </div>
          </div>
        )}
      </div>
    );
  });

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
    columns.splice(columns.length - 2, 1, {
      title: "Slip",
      dataIndex: "view",
      render: (_, record) => {
        return (
          <FormButton
            icon={<EyeOutlined />}
            type="text"
            onClick={() => {
              viewDailyExpenseReport(record, 3);
            }}
          />
        );
      },
    });
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
        idName="CustomerId"
        valueName="CustomerName"
        size={INPUT_SIZE}
        name="CustomerId"
        label="Customer Name"
        value={searchFields.CustomerId}
        onChange={handleSearchChange}
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
        idName="CustomerId"
        valueName="CustomerName"
        size={INPUT_SIZE}
        name="CustomerId"
        label="Customer Name"
        value={formFields.CustomerId}
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
        <Table
          size="small"
          columns={formColumns}
          dataSource={
            formFields.InVoiceList
              ? formFields.InVoiceList.filter(
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
          onChange={handleFormChange}
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
          value={formFields?.InVoiceList?.filter((x) => x.selected).reduce(
            (acc, curr) => acc + curr.TotalBalance,
            0
          )}
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
              ? formFields?.PaymentAmount -
                formFields?.InVoiceList?.filter((x) => x.selected).reduce(
                  (acc, curr) => acc + curr.TotalBalance,
                  0
                )
              : 0
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
    <>
      <BasicFormComponent
        formTitle="Customer Receivable"
        searchPanel={searchPanel}
        formPanel={formPanel}
        searchSubmit={handleSearchSubmit}
        onFormSave={handleFormSubmit}
        tableRows={itemList}
        tableLoading={tableLoading}
        formLoading={formLoading}
        tableColumn={columns}
        // deleteRow={handleDeleteRow}
        actionID="VendorPayableId"
        // editRow={setUpdateId}
        fields={initialFormValues}
        crudTitle="Customer Payable"
        hideDelete={true}
      />

      <ModalComponent
        title={
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Title level={5}>Customer Receivable</Title>
            <div style={{ display: "flex" }}>
              <Button
                onClick={() => {
                  setConsumptionReport(false);
                  setHtml("");
                }}
                style={{ marginRight: 5 }}
              >
                Close
              </Button>

              <Button
                onClick={() => {
                  handleOnPrint();
                }}
                type="primary"
              >
                Print
              </Button>
            </div>
          </div>
        }
        isModalVisible={consumptionReport}
        footer={[]}
      >
        <ConsumptionReport ref={reportRef} reportData={consumptionReport} />
      </ModalComponent>
    </>
  );
};

export default CustomerReceivableNew;
