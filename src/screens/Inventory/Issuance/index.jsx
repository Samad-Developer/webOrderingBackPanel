import React, { Fragment, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteRow,
  resetState,
  setFormFieldValue,
  setInitialState,
  setSearchFieldValue,
  submitForm,
} from "../../../redux/actions/basicFormAction";
import { IoDuplicate } from "react-icons/io5";

import { INPUT_SIZE } from "../../../common/ThemeConstants";
import BasicFormComponent from "../../../components/formComponent/BasicFormComponent";
import FormTextField from "../../../components/general/FormTextField";
import {
  SET_SUPPORTING_TABLE,
  UPDATE_FORM_FIELD,
} from "../../../redux/reduxConstants";
import FormSelect from "../../../components/general/FormSelect";
import { Button, Col, DatePicker, Input, message, Table } from "antd";
import { postRequest } from "../../../services/mainApp.service";
import moment from "moment";
import FormCheckbox from "../../../components/general/FormCheckbox";
import ComponentToPrint from "../../../components/specificComponents/ComponentToPrint";
import { html, HTMLChunk } from "./issuanceHtmlReportTemplate.js";

const initialFormValues = {
  IssuanceMasterId: null,
  IssuanceNumber: "",
  IssuanceDate: new Date(Date.now()),
  BranchId: null,
  DemandNumber: null,
  TotalIssuanceQuantity: null,
  IsActive: true,
  IsSubmit: false,
  IssuanceDetailList: [],
  DemandMasterId: null,
  UseScanner: false,
};

const initialSearchValues = {
  IssuanceMasterId: null,
  IssuanceNumber: "",
  IssuanceDate: null,
  BranchId: null,
  DemandNumber: null,
  TotalIssuanceQuantity: null,
  IsActive: true,
  IsSubmit: false,
  IssuanceDetailList: [],
  DemandMasterId: null,
};
const columns = [
  {
    title: "Issuance Number",
    dataIndex: "IssuanceNumber",
    key: "IssuanceNumber",
  },
  {
    title: "Issuance Date",
    key: "IssuanceDate",
    render: (record) => {
      const splitDate = record.IssuanceDate?.split("T")[0];
      return splitDate;
    },
  },
  {
    title: "Branch",
    dataIndex: "BranchName",
    key: "BranchName",
  },
  {
    title: "Submitted",
    key: "IsSubmit",
    render: (record) => {
      return <div>{record.IsSubmit === true ? "Submitted" : ""}</div>;
    },
  },
  {
    title: "Demand",
    dataIndex: "DemandNumber",
    key: "DemandNumber",
  },
];

const Issuance = () => {
  const dispatch = useDispatch();
  const controller = new window.AbortController();
  const userData = useSelector((state) => state.authReducer);
  const [updateId, setUpdateId] = useState(null);
  const [demandTabData, setDemandTabData] = useState([]);
  const [demandDetailData, setDemandDetailData] = useState({});
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

  const handleQtyChange = (event, index) => {
    let tabData = demandTabData;
    tabData[index].IssuanceQuantity = event.target.value;
    if (
      tabData[index].DemandQuantityInConsume - event.target.value < 0 ||
      tabData[index].StockQuantity - event.target.value < 0
    ) {
      message.error(
        "Quantity can't be greater then Remaining Quantity OR Stock Quantity"
      );
      return;
    }
    setDemandTabData([...tabData]);
  };

  const handleIssueBatchChange = (e, record, index) => {
    let stock = demandDetailData?.Table1.filter(
      (item) => item.BatchId == e.value
    )[0]?.StockQuantity;
    let arr = demandTabData;
    arr[index].BatchId = e.value;
    arr[index].StockQuantity = stock;
    setDemandTabData([...demandTabData]);
  };

  const viewReport = (record, handlePrint) => {
    postRequest(
      "/CrudIssuance",
      {
        ...initialFormValues,
        Date: record.IssuanceDate,
        IssuanceDetailList: [],
        BranchId: record.BranchId,
        IssuanceMasterId: record.IssuanceMasterId,
        DemandMasterId: record.DemandMasterId,
        OperationId: 6,
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
        DATE_FROM: record.IssuanceDate.split("T")[0],
        DATE_TO: record.IssuanceDate.split("T")[0],
        master: res.data.DataSet.Table2[0],
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
  const IssuancTableCols = [
    {
      title: "Product Detail",
      dataIndex: "ProductDetailName",
      key: "ProductDetailName",
    },
    {
      title: "Stock Quantity",
      key: "StockQuantity",
      render: (record) => (record.BatchId !== null ? record.StockQuantity : 0),
    },
    {
      title: "Demand Remaining Quantity",
      key: "DemandQuantityInConsume",
      render: (record) => record.DemandQuantityInConsume,
    },
    {
      title: "Batch Number",
      key: "BatchId",
      render: (_, record, index) => {
        return (
          <FormSelect
            width={"auto"}
            colSpan={4}
            listItem={
              demandDetailData?.Table1?.filter(
                (x) => x.ProductDetailId === record.ProductDetailId
              ) ?? []
            }
            idName="BatchId"
            valueName="BatchNumber"
            size={INPUT_SIZE}
            name="BatchId"
            value={record.BatchId}
            onChange={(e) => handleIssueBatchChange(e, record, index)}
            required={true}
            disabled={formFields?.IsSubmit === true ? true : false}
          />
        );
      },
    },
    {
      title: "Issuance Quantity",
      key: "IssuanceQuantity",
      render: (_, record, index) => {
        return (
          <Input
            value={record.IssuanceQuantity}
            onChange={(e) => handleQtyChange(e, index)}
            type="number"
            min={1}
            disabled={formFields.IsSubmit}
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
      title: "Action",
      key: "action",
      render: (_, record, index) => {
        return (
          <Button
            type="text"
            icon={<IoDuplicate />}
            onClick={(e) => {
              let demand = demandTabData;
              demand?.splice(index + 1, 0, { ...record, IssuanceQuantity: 1 });
              setDemandTabData([...demand]);
            }}
            disabled={formFields.UseScanner}
          />
        );
      },
    },
  ];

  useEffect(() => {
    dispatch(
      setInitialState(
        "/CrudIssuance",
        {
          ...initialSearchValues,
          BranchId: formFields.BranchId,
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
      let objToUpdate = itemList.filter(
        (item) => item.IssuanceMasterId === updateId
      )[0];
      dispatch({
        type: UPDATE_FORM_FIELD,
        payload: objToUpdate,
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
        "/CrudIssuance",
        {
          ...initialFormValues,
          Date: finalDatee,
          IssuanceDetailList: [],
          BranchId: objToUpdate.BranchId,
          IssuanceMasterId: updateId,
          DemandMasterId: objToUpdate.DemandMasterId,
          OperationId: 6,
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

        setDemandTabData([...response.data.DataSet.Table]);
        setDemandDetailData({
          ...demandDetailData,
          demandData: response.data.DataSet.Table,
          Table1: response.data.DataSet.Table1,
        });
      });
    }
    setUpdateId(null);
  }, [updateId]);

  const handleSearchChange = (data) => {
    dispatch(setSearchFieldValue(data));
  };

  const handleFormChange = (data) => {
    dispatch(setFormFieldValue(data));
    if (data.name === "UseScanner") {
      dispatch(setFormFieldValue({ name: "DemandMasterId", value: "" }));
    }
    setDemandTabData([]);
    if (data.name === "DemandMasterId") {
      postRequest(
        "CrudIssuance",
        {
          ...formFields,
          OperationId: 5,
          CompanyId: userData.CompanyId,
          UserId: userData.UserId,
          UserIP: "12.1.1.2",
          DemandNumber: parseInt(data.value),
          BranchId: formFields.BranchId,
          DemandMasterId: data.value,
          IssuanceDetailList: [],
        },
        controller
      ).then((response) => {
        const demandData = response.data.DataSet.Table.map((x) => ({
          ...x,
          DemandQuantityInConsume: x.IssueQuantityRemaining,
          IssuanceQuantity: 1,
          IssuanceMasterId: null,
          IssuanceDetailId: null,
          IssuanceUnit: 1,
          StockQuantity: x.StockQuantity,
          BatchId: null,
        }));
        setDemandDetailData({
          demandData: demandData,
          Table1: response.data.DataSet.Table1,
        });
        !formFields.UseScanner && setDemandTabData([...demandData]);
      });
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    dispatch(
      setInitialState(
        "/CrudIssuance",
        {
          ...searchFields,
          BranchId: searchFields.BranchId,
          IssuanceNumber: searchFields.IssuanceNumber.trim(),
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
      deleteRow(
        "/CrudIssuance",
        {
          ...initialFormValues,
          IssuanceMasterId: id,
          IssuanceDetailList: [],
        },
        controller,
        userData
      )
    );
  };

  function submitCalculation() {
    let cond = false;
    // let cond2 = false;
    demandDetailData?.demandData?.forEach((element) => {
      let dtlList = demandTabData?.filter(
        (item) => item.ProductDetailId === element.ProductDetailId
      );

      //   dtlList?.forEach((x) => {
      //     if (
      //       demandDetailData?.Table1?.filter((y) => y.BatchId === x.BatchId)[0]
      //         .StockQuantity >= x.IssuanceQuantity
      //     )
      //       cond2 = true;
      //     else cond2 = false;
      //   });

      let qty = dtlList?.reduce((sum, record) => {
        return sum + parseInt(record.IssuanceQuantity, 0);
      }, 0);

      if (
        element.StockQuantity >= qty &&
        element.DemandQuantityInConsume >= qty
      )
        cond = true;
      else cond = false;

      if (cond === false) {
        return;
      }
    });
    // return cond === true && cond2 === true;
    return cond === true;
  }

  const handleFormSubmit = (e, id, submit, closeForm) => {
    e.preventDefault();
    let calc = true;
    if (submit === false) calc = submitCalculation();
    if (calc === false) {
      // message.error(
      //   "Your Product Quantity is Greater than Stock Quantity OR Remaining Quantity OR Available Batch Quantity",
      //   5
      // );
      message.error("Demand detail is required!", 5);
      return;
    }
    if (formFields.IssuanceDate === "") {
      message.error("Date cant be an empty string.");
      return;
    }
    if (demandTabData.length === 0) {
      message.error("Demand Details cant be empty");
      return;
    }

    let demandItemList = demandTabData.map((x) => ({
      ...x,
      DemandQuantityInConsume: x.DemandQuantityInConsume - x.IssuanceQuantity,
    }));
    formFields.IsSubmit = submit;
    dispatch(
      submitForm(
        "/CrudIssuance",
        {
          ...formFields,
          IssuanceDetailList: [...demandItemList],
          IssuanceNumber: `%${formFields.IssuanceNumber}%`,
        },
        initialFormValues,
        controller,
        userData,
        id,
        (res) => {
          let data = {
            Table1: res.Table2,
            Table2: res.Table3,
          };
          dispatch({ type: SET_SUPPORTING_TABLE, payload: data });
          closeForm();
        }
      )
    );
  };

  const closeForm = () => {
    setDemandTabData([]);
  };

  const searchPanel = (
    <Fragment>
      <FormTextField
        colSpan={4}
        label="Issuance Number"
        name="IssuanceNumber"
        size={INPUT_SIZE}
        value={searchFields.IssuanceNumber}
        onChange={handleSearchChange}
      />
      <FormSelect
        colSpan={4}
        listItem={supportingTable.Table2 ?? []}
        idName="BranchId"
        valueName="BranchName"
        size={INPUT_SIZE}
        name="BranchId"
        label="Branch"
        value={searchFields.BranchId}
        onChange={handleSearchChange}
      />

      <FormSelect
        colSpan={4}
        listItem={supportingTable.Table3 ? supportingTable.Table3 : []}
        idName="DemandMasterId"
        valueName="DemandNumber"
        size={INPUT_SIZE}
        name="DemandMasterId"
        label="Demand"
        value={searchFields.DemandMasterId}
        onChange={handleSearchChange}
      />
      <Col span={4}>
        <div>Issuance Date</div>
        <DatePicker
          span={6}
          style={{ width: "100%" }}
          placeholder="Issuance Date"
          value={
            searchFields.IssuanceDate
              ? moment(searchFields.IssuanceDate, "YYYY/MM/DD")
              : searchFields.IssuanceDate
          }
          onChange={(time, timeString) =>
            handleSearchChange({ name: "IssuanceDate", value: timeString })
          }
          allowClear={false}
        />
      </Col>
    </Fragment>
  );

  const formPanel = (
    <Fragment>
      <FormTextField
        colSpan={6}
        label="Issuance Number"
        name="IssuanceNumber"
        size={INPUT_SIZE}
        value={formFields.IssuanceNumber}
        onChange={handleFormChange}
        disabled={true}
      />
      <Col span={6}>
        <div>Issuance Date</div>
        <DatePicker
          span={6}
          style={{ width: "100%" }}
          placeholder="Issuance Date"
          value={
            formFields.IssuanceDate
              ? moment(formFields.IssuanceDate, "YYYY/MM/DD")
              : formFields.IssuanceDate
          }
          onChange={(time, timeString) =>
            handleFormChange({ name: "IssuanceDate", value: timeString })
          }
          allowClear={false}
          disabled={formFields.IsSubmit}
          required
        />
      </Col>
      <FormSelect
        colSpan={6}
        listItem={supportingTable.Table2 ?? []}
        idName="BranchId"
        valueName="BranchName"
        size={INPUT_SIZE}
        name="BranchId"
        label="Branch"
        value={formFields.BranchId}
        onChange={handleFormChange}
        disabled={formFields.IsSubmit}
        required
      />
      <FormCheckbox
        label={"Use Scanner For Entry"}
        checked={formFields.UseScanner}
        onChange={handleFormChange}
        name="UseScanner"
        disabled={formFields?.IsSubmit === true ? true : false}
      />
      <FormSelect
        colSpan={6}
        listItem={supportingTable.Table1 || []}
        idName="DemandMasterId"
        valueName="DemandNumber"
        size={INPUT_SIZE}
        name="DemandMasterId"
        label="Demand Number"
        value={formFields.DemandMasterId}
        onChange={handleFormChange}
        disabled={formFields.IsSubmit || formFields.BranchId === ("" || null)}
      />
      {formFields.UseScanner && (
        <FormTextField
          colSpan={6}
          label="Barcode"
          name="Barcode"
          size={INPUT_SIZE}
          value={formFields.Barcode}
          onChange={handleFormChange}
          disabled={false}
        />
      )}

      <Table
        columns={IssuancTableCols}
        dataSource={demandTabData}
        rowKey={(row) => row.DemandDetailId}
        style={{ marginTop: 16, width: "100%" }}
      />
    </Fragment>
  );

  return (
    <Fragment>
      <BasicFormComponent
        formTitle="Issuance"
        searchPanel={searchPanel}
        formPanel={formPanel}
        searchSubmit={handleSearchSubmit}
        onFormSave={handleFormSubmit}
        tableRows={itemList}
        tableLoading={tableLoading}
        formLoading={formLoading}
        tableColumn={columns}
        deleteRow={handleDeleteRow}
        actionID="IssuanceMasterId"
        editRow={setUpdateId}
        fields={initialFormValues}
        disableSaveAndSubmit={formFields.IsSubmit === true ? true : false}
        showSubmit={true}
        onFormClose={closeForm}
        formWidth="65vw"
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

export default Issuance;
