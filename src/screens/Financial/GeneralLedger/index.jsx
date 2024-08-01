import { Button } from "antd";
import Title from "antd/lib/typography/Title";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { INPUT_SIZE } from "../../../common/ThemeConstants";
import ReportComponent from "../../../components/formComponent/ReportComponent";
import FormSelect from "../../../components/general/FormSelect";
import FormTextField from "../../../components/general/FormTextField";
import { dateformatFunction } from "../../../functions/dateFunctions";
import { resetState } from "../../../redux/actions/basicFormAction";
import { postRequest } from "../../../services/mainApp.service";
import GeneralLedgerTemplate from "./GenerateLedgerTemplate";

const initialSearchValues = {
  CustomerID: null,
  BranchID: null,
  VendorID: null,
  COAID: null,
  FromDate: null,
  ToDate: null,
};

const GeneralLedger = () => {
  const dispatch = useDispatch();
  const controller = new window.AbortController();
  const userData = useSelector((state) => state.authReducer);
  const [data, setData] = useState(initialSearchValues);
  const [list, setList] = useState([]);
  const [headList, setHeadList] = useState([]);
  const [supportingTable, setSupportingTable] = useState([]);

  useEffect(() => {
    postRequest(
      "/GeneralLedger_FillControl",
      {
        CompanyID: userData.CompanyId,
        BranchID: userData.branchId,
      },
      controller
    )
      .then((res) => {
        setSupportingTable(res.data.DataSet);
      })
      .catch((err) => console.error(err));

    return () => {
      controller.abort();
      dispatch(resetState());
    };
  }, []);

  const handleSearchChange = (e) => {
    setData({ ...data, [e.name]: e.value });
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    let myData = {
      ...data,
      COAID: data?.COAID?.toString() || "0",
      CompanyID: userData.CompanyId,
    };
    postRequest("/Generate_Ledger", myData)
      .then((res) => {
        setHeadList(res.data.DataSet.Table);
        setList(res.data.DataSet.Table1);
      })
      .catch((err) => console.error(err));
  };

  const searchPanel = (
    <form onSubmit={handleSearchSubmit}>
      <div
        style={{ display: "flex", alignItems: "flex-end", flexWrap: "wrap" }}
      >
        <FormSelect
          colSpan={4}
          listItem={supportingTable?.Table || []}
          idName="CustomerId"
          valueName="CustomerName"
          size={INPUT_SIZE}
          name="CustomerID"
          label="Customer"
          value={data.CustomerID}
          onChange={handleSearchChange}
        />
        <FormSelect
          colSpan={4}
          listItem={supportingTable?.Table1 || []}
          idName="BranchId"
          valueName="BranchName"
          size={INPUT_SIZE}
          name="BranchID"
          label="Branch"
          value={data.BranchID}
          onChange={handleSearchChange}
        />
        <FormSelect
          colSpan={4}
          listItem={supportingTable?.Table2 || []}
          idName="VendorID"
          valueName="VendorName"
          size={INPUT_SIZE}
          name="VendorID"
          label="Vendor"
          value={data.VendorID}
          onChange={handleSearchChange}
        />
        <FormSelect
          colSpan={4}
          listItem={supportingTable?.Table3 || []}
          idName="ChartOfAccountId"
          valueName="AccountName"
          size={INPUT_SIZE}
          name="COAID"
          label="Chart Of Account"
          value={data.COAID}
          //   required={true}
          onChange={handleSearchChange}
        />
        <FormTextField
          colSpan={4}
          label="Date From"
          type="date"
          name="FromDate"
          size={INPUT_SIZE}
          value={data.FromDate}
          required={true}
          onChange={handleSearchChange}
        />
        <FormTextField
          colSpan={4}
          label="Date to"
          type="date"
          name="ToDate"
          size={INPUT_SIZE}
          value={data.ToDate}
          required={true}
          onChange={handleSearchChange}
          max={dateformatFunction(Date.now())}
        />
        <Button type="primary" htmlType="submit">
          Search
        </Button>
      </div>
    </form>
  );

  return (
    <div style={{ background: "white", padding: 20 }}>
      <Title level={3} type="primary">
        General Ledger
      </Title>
      {searchPanel}
      <ReportComponent
        rows={list}
        customTable={true}
        table={
          <GeneralLedgerTemplate
            list={list}
            headList={headList}
            date={`For the Period of ${data.FromDate} To ${data.ToDate}`}
          />
        }
      />
    </div>
  );
};

export default GeneralLedger;
