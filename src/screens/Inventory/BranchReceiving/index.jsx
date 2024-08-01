import { Button, Col, Input, message, Table } from "antd";

import React, { Fragment, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { INPUT_SIZE } from "../../../common/ThemeConstants";
import BasicFormComponent from "../../../components/formComponent/BasicFormComponent";

import { CloseOutlined } from "@ant-design/icons";
import FormRadioButtons from "../../../components/general/FormRadioButtons";
import FormSelect from "../../../components/general/FormSelect";
import FormTextField from "../../../components/general/FormTextField";
import ComponentToPrint from "../../../components/specificComponents/ComponentToPrint";
import {
  deleteRow,
  resetState,
  setFormFieldValue,
  setInitialState,
  setSearchFieldValue,
  submitForm,
} from "../../../redux/actions/basicFormAction";
import {
  SET_SUPPORTING_TABLE,
  UPDATE_FORM_FIELD,
} from "../../../redux/reduxConstants";
import { postRequest } from "../../../services/mainApp.service";
import "../Grn/styles.css";
import { html, HTMLChunk } from "./BranchRecvHtmlTemp";

const initialFormValues = {
  BranchId: null,
  IsSubmit: false,
  ReceivingNumber: "",
  ReceivingId: null,
  IssuanceId: null,
  TransferId: null,
  Date: "",
  ReceivingBy: "Issuence",
};

const initialSearchValues = {
  BranchId: null,
  IsSubmit: false,
  ReceivingNumber: "",
  ReceivingId: null,
  IssuanceId: null,
  TransferId: null,
  Date: "",
  ReceivingBy: "Issuence",
};

const columns = [
  {
    title: "Receiving Number",
    dataIndex: "ReceivingNumber",
    key: "ReceivingNumber",
  },
  {
    title: "Branch Name",
    dataIndex: "Branch",
    key: "Branch",
  },
  {
    title: "Date",
    key: "Date",
    render: (_, record) => {
      return <div>{record.Date?.split("T")[0]}</div>;
    },
  },
  {
    title: "Is Submit",
    key: "IsSubmit",
    render: (_, record) => {
      return <div>{record.IsSubmit === true ? "Submitted" : ""}</div>;
    },
  },
];

const BranchRecieving = () => {
  const dispatch = useDispatch();
  const controller = new window.AbortController();
  const userData = useSelector((state) => state.authReducer);
  const [updateId, setUpdateId] = useState(null);
  const [BranchReceivingDetail, setBranchReceivingDetail] = useState([]);
  const [date, setDate] = useState(new Date());
  const componentRefPrint = useRef();
  const [htmlReport, setHtmlReport] = useState("");

  const {
    formFields,
    searchFields,
    itemList,
    formLoading,
    tableLoading,
    supportingTable,
  } = useSelector((state) => state.basicFormReducer);

  const handleBranchRecevingetailChnage = (event, record, name) => {
    const BranchReceivingDetaillArr = BranchReceivingDetail;
    const index = BranchReceivingDetaillArr.findIndex(
      (x) => x.ProductDetailId === record.ProductDetailId
    );
    if (index > -1) {
      let grnDet = BranchReceivingDetaillArr[index];
      grnDet[name] = name === "BatchId" ? event.value : event.target.value;
      BranchReceivingDetaillArr[index] = grnDet;

      setBranchReceivingDetail([...BranchReceivingDetaillArr]);
    }
  };

  const columnsBranchReceivingDetail = [
    {
      title: "Product",
      dataIndex: "ProductSizeName",
      key: "ProductSizeName",
    },
    {
      title: "Unit",
      dataIndex: "UnitName",
      key: "UnitName",
    },
    {
      title: "Transfer/Issuance Quantity",
      key: "TransferIssuanceQuantity",
      render: (_, record) => {
        return record.TransferIssuanceQuantity;
      },
    },
    {
      title: "Receiving Quantity",
      key: "QtyInLevel2 ",
      render: (_, record) => {
        return (
          <Input
            value={record.QtyInLevel2}
            onChange={(event) =>
              handleBranchRecevingetailChnage(event, record, "QtyInLevel2")
            }
            onBlur={() => { }}
            type="number"
            disabled={formFields?.IsSubmit === true ? true : false}
            onKeyPress={(e) => {
              if (
                e.code === "Minus" ||
                e.code === "NumpadSubtract" ||
                e.code === "NumpadAdd"
              ) {
                e.preventDefault();
              }
            }}
          />
        );
      },
    },
    {
      title: "Batch",
      key: "BatchId",
      render: (_, record) => {
        return (
          <FormSelect
            colSpan={24}
            listItem={supportingTable.Table2?.filter(
              (e) => e.ProductDetailId === record.ProductDetailId
            )}
            idName="BatchId"
            valueName="BatchNumber"
            size={INPUT_SIZE}
            name="BatchId"
            label=""
            value={record.BatchId || ""}
            onChange={(event) =>
              handleBranchRecevingetailChnage(event, record, "BatchId")
            }
            disabled={formFields?.IsSubmit === true ? true : false}
          />
        );
      },
    },
    {
      title: "Delete",
      dataIndex: "delete",
      render: (_, record, index) => {
        return (
          <Button
            disabled={formFields?.IsSubmit === true ? true : false}
            icon={<CloseOutlined />}
            onClick={() => removeGrnDetail(record, index)}
          />
        );
      },
    },
  ];

  useEffect(() => {
    dispatch(
      setInitialState(
        "/CrudBranchReceiving",
        {
          ...initialFormValues,
          ReceivingNumber: "%%",
          Date: "",
          BranchId: userData.branchId,
          BranchReceivingDetail: [],
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
      let editObj = itemList.filter((item) => item.ReceivingId === updateId)[0];
      dispatch({
        type: UPDATE_FORM_FIELD,
        payload: { ...editObj, Date: editObj.Date.split("T")[0] },
      });
      const Datee = new Date();
      const finalDatee =
        Datee.getFullYear() +
        "-" +
        (Datee.getMonth() + 1) +
        "-" +
        Datee.getDate() +
        " " +
        "00:00:00.000";

      postRequest(
        "/CrudBranchReceiving",
        {
          ...initialFormValues,
          Date: finalDatee,
          BranchReceivingDetail: [],
          ReceivingId: updateId,
          OperationId: 5,
          IssuanceId: editObj.IssuanceId,
          TransferId: editObj.TransferId,
          CompanyId: userData.CompanyId,
          UserId: userData.UserId,
          UserIP: "1.2.2.1",
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
        const tables = {
          Table4: response.data.DataSet.Table2,
          Table3: response.data.DataSet.Table1,
        };
        dispatch({ type: SET_SUPPORTING_TABLE, payload: tables });

        setBranchReceivingDetail([...response.data.DataSet.Table]);
      });
    }
    setUpdateId(null);
  }, [updateId]);

  const handleSearchChange = (data) => {
    dispatch(setSearchFieldValue(data));
  };

  const handleFormChange = (data) => {
    if (data.name === "TransferId" || data.name === "IssuanceMasterId") {
      dispatch(
        setFormFieldValue({
          name: data.name === "TransferId" ? "IssuanceMasterId" : "TransferId",
          value: null,
        })
      );
      const Datee = new Date();
      const finalDatee =
        Datee.getFullYear() +
        "-" +
        (Datee.getMonth() + 1) +
        "-" +
        Datee.getDate() +
        " " +
        "00:00:00.000";
      postRequest(
        "/CrudBranchReceiving",
        {
          ...initialFormValues,
          Date: finalDatee,
          BranchReceivingDetail: [],
          TransferId: data.name === "TransferId" ? data.value : null,
          IssuanceId: data.name === "IssuanceMasterId" ? data.value : null,
          OperationId: 6,
          CompanyId: userData.CompanyId,
          UserId: userData.UserId,
          UserIP: "1.2.2.1",
          ReceivingId: null,
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
        setBranchReceivingDetail([...response.data.DataSet.Table]);
      });
    }
    dispatch(setFormFieldValue(data));
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    dispatch(
      setInitialState(
        "/CrudBranchReceiving",
        {
          ...searchFields,
          ReceivingNumber: `%${searchFields.ReceivingNumber.trim()}%`,
          BranchReceivingDetail: [],
          BranchId: searchFields.BranchId,
        },
        initialFormValues,
        searchFields,
        controller,
        userData
      )
    );
  };

  const closeForm = () => {
    setBranchReceivingDetail([]);
  };

  const handleDeleteRow = (id, record) => {
    if (record.IsSubmit === false) {
      dispatch(
        deleteRow(
          "/CrudBranchReceiving",
          {
            ...initialFormValues,
            ReceivingId: id,
            Date: date,
            BranchReceivingDetail: [],
          },
          controller,
          userData
        )
      );
    } else {
      message.error("Record cant be deleted!");
    }
  };

  const viewReport = (record, handlePrint) => {

    const Datee = new Date();
    const finalDatee =
      Datee.getFullYear() +
      "-" +
      (Datee.getMonth() + 1) +
      "-" +
      Datee.getDate() +
      " " +
      "00:00:00.000";

    postRequest(
      "/CrudBranchReceiving",
      {
        ...initialFormValues,
        Date: finalDatee,
        BranchReceivingDetail: [],
        ReceivingId: record.ReceivingId,
        OperationId: 5,
        CompanyId: userData.CompanyId,
        UserId: userData.UserId,
        UserIP: "1.2.2.1",
      },
      controller
    ).then((res) => {
      const htmlBody = HTMLChunk({
        detail: res.data.DataSet.Table,
      });
      const report = html({
        DATE_FROM: record.Date.split("T")[0],
        DATE_TO: record.Date.split("T")[0],
        master: record,
        body: htmlBody,
        BranchName: record.BranchName,
      });
      const setReport = new Promise((resolutionFunc, rejectionFunc) => {
        setHtmlReport(report);
        resolutionFunc("Resolved");
      });
      setReport.then(() => {
        handlePrint();
      });
    });
  };

  const handleRadioChange = (event) => {
    dispatch(setFormFieldValue(event));
    setBranchReceivingDetail([]);
    dispatch(
      setFormFieldValue({
        name: "TransferId",
        value: null,
      })
    );
    dispatch(
      setFormFieldValue({
        name: "IssuanceMasterId",
        value: null,
      })
    );
  };

  const removeGrnDetail = (record, index) => {
    let arr = BranchReceivingDetail;
    arr.splice(index, 1);
    setBranchReceivingDetail([...arr]);
  };

  const handleFormSubmit = (e, id, submit, closeForm) => {
    e.preventDefault();

    const formFieldsClone = { ...formFields };
    formFieldsClone.IsSubmit = submit;

    formFieldsClone.ReceivingNumber = `%${formFieldsClone.ReceivingNumber}%`;

    const length = BranchReceivingDetail.filter((e) => e.QtyInLevel2 === 0);
    if (length.length > 0) {
      message.error("Receving quantity is required");
      return;
    }

    if (BranchReceivingDetail.length === 0) {
      message.error("Branch receiving detail is required!");
      return;
    }

    dispatch(
      submitForm(
        "/CrudBranchReceiving",
        {
          ...formFieldsClone,
          TransferId:
            formFields.ReceivingBy === "Transfer"
              ? formFields.TransferId
              : null,
          IssuanceId:
            formFields.ReceivingBy === "Issuence"
              ? formFields.IssuanceMasterId
              : null,
          BranchReceivingDetail: BranchReceivingDetail,
        },
        initialFormValues,
        controller,
        userData,
        id,
        (tables) => {
          delete tables.Table;
          const tablesToSet = {
            Table1: tables.Table2,
            Table2: tables.Table3,
            Table3: tables.Table4,
            Table4: tables.Table5,
            Table5: tables.Table6,
            Table6: tables.Table7,
            Table7: tables.Table8,
            Table8: tables.Table9,
          };
          dispatch({ type: SET_SUPPORTING_TABLE, payload: tablesToSet });
        }
      )
    );
    closeForm();
  };

  const searchPanel = (
    <Fragment>
      <FormTextField
        colSpan={4}
        label="Receiving Number"
        name="ReceivingNumber"
        size={INPUT_SIZE}
        value={searchFields.ReceivingNumber}
        onChange={handleSearchChange}
      />
      <FormSelect
        colSpan={6}
        listItem={supportingTable.Table1}
        idName="BranchId"
        valueName="BranchName"
        size={INPUT_SIZE}
        name="BranchId"
        label="Branch"
        value={searchFields.BranchId || ""}
        onChange={handleSearchChange}
      />
      <FormTextField
        colSpan={4}
        label="Date"
        type="date"
        name="Date"
        size={INPUT_SIZE}
        value={searchFields.Date}
        onChange={handleSearchChange}
      />
    </Fragment>
  );

  const formPanel = (
    <Fragment>
      <FormTextField
        colSpan={6}
        label="Branch Receiving Number"
        name="RecievingNumber"
        size={INPUT_SIZE}
        value={formFields.ReceivingNumber}
        onChange={handleFormChange}
        disabled={true}
      />
      <FormSelect
        colSpan={6}
        listItem={supportingTable.Table1}
        idName="BranchId"
        valueName="BranchName"
        size={INPUT_SIZE}
        name="BranchId"
        label="Branch"
        value={formFields.BranchId || ""}
        onChange={handleFormChange}
        required={true}
        disabled={
          formFields?.IsSubmit === true
            ? true
            : BranchReceivingDetail.length > 0
              ? true
              : false
        }
      />
      <FormSelect
        colSpan={6}
        listItem={
          formFields.ReceivingBy === "Issuence"
            ? supportingTable.Table3?.filter(
              (isu) => isu.BranchId === formFields.BranchId
            )
            : supportingTable.Table4?.filter(
              (trans) => trans.BranchId === formFields.BranchId
            )
        }
        idName={
          formFields.ReceivingBy === "Issuence"
            ? "IssuanceMasterId"
            : "TransferId"
        }
        valueName={
          formFields.ReceivingBy === "Issuence"
            ? "IssuanceNumber"
            : "TransferNo"
        }
        size={INPUT_SIZE}
        name={
          formFields.ReceivingBy === "Issuence"
            ? "IssuanceMasterId"
            : "TransferId"
        }
        label="Issuance/Transfer"
        value={
          formFields.ReceivingBy === "Issuence"
            ? formFields.IssuanceMasterId
            : formFields.TransferId
        }
        onChange={handleFormChange}
        required={true}
        disabled={
          formFields?.IsSubmit === true
            ? true
            : BranchReceivingDetail.length > 0
              ? true
              : false
        }
      />

      <FormTextField
        colSpan={6}
        label="Receiving Date"
        type="date"
        name="Date"
        size={INPUT_SIZE}
        value={formFields.Date}
        onChange={handleFormChange}
        disabled={formFields?.IsSubmit === true ? true : false}
        required={true}
      />
      <FormRadioButtons
        list={[
          { name: "Issuance", value: "Issuence" },
          { name: "Transfer", value: "Transfer" },
        ]}
        onChange={handleRadioChange}
        value={formFields.ReceivingBy}
        name={"ReceivingBy"}
        disabled={
          formFields?.IsSubmit === true
            ? true
            : BranchReceivingDetail.length > 0
              ? true
              : false
        }
      />
      <Col span={24}>
        <Table
          rowClassName={(record, index) =>
            formFields?.IsSubmit === true
              ? "table-row-dark"
              : record.GRNRemainingQuantity === 0
                ? "table-row-light"
                : "table-row-dark"
          }
          columns={
            formFields.IsPo === false
              ? columnsBranchReceivingDetail.filter(
                (col) => col.key !== "GRNRemainingQuantity"
              )
              : columnsBranchReceivingDetail
          }
          dataSource={BranchReceivingDetail}
          pagination={false}
          size="small"
        />
      </Col>
    </Fragment>
  );

  return (
    <Fragment>
      <BasicFormComponent
        formTitle="Branch Receiving"
        searchPanel={searchPanel}
        formPanel={formPanel}
        searchSubmit={handleSearchSubmit}
        onFormSave={handleFormSubmit}
        tableRows={itemList}
        tableLoading={tableLoading}
        formLoading={formLoading}
        tableColumn={columns}
        deleteRow={handleDeleteRow}
        actionID="ReceivingId"
        editRow={setUpdateId}
        fields={initialFormValues}
        crudTitle="Branch Receiving"
        formWidth="70vw"
        showSubmit={true}
        onFormClose={closeForm}
        disableSaveAndSubmit={formFields.IsSubmit === true ? true : false}
        report={true}
        viewReport={viewReport}
        componentRefPrint={componentRefPrint}
      />
      <div style={{ display: "none" }}>
        <ComponentToPrint ref={componentRefPrint} Bill={htmlReport} />
      </div>
    </Fragment>
  );
};

export default BranchRecieving;
