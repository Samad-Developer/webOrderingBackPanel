import { Button, message } from "antd";
import Title from "antd/lib/typography/Title";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { INPUT_SIZE } from "../../../common/ThemeConstants";
import ReportComponent from "../../../components/formComponent/ReportComponent";
import FormCheckbox from "../../../components/general/FormCheckbox";
import FormSelect from "../../../components/general/FormSelect";
import FormTextField from "../../../components/general/FormTextField";
import { resetState } from "../../../redux/actions/basicFormAction";
import { postRequest } from "../../../services/mainApp.service";
import PayOffTemplate from "./PayOffTemplate";

const initialSearchValues = {
  OperationId: 1,
  CustomerID: null,
  BranchID: null,
  VendorID: null,
  COAID: null,
  FromDate: null,
  ToDate: null,
};

const PayOff = () => {
  const dispatch = useDispatch();
  const controller = new window.AbortController();
  const userData = useSelector((state) => state.authReducer);
  const [data, setData] = useState(initialSearchValues);
  const [list, setList] = useState([]);
  const [supportingTable, setSupportingTable] = useState([]);

  useEffect(() => {
    postRequest(
      "/PayOffs_FillControl",
      {
        CompanyId: userData.CompanyId,
        BranchId: userData.branchId,
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
      COAID: data.COAID.toString(),
      CompanyID: userData.CompanyId,
    };
    postRequest("/CrudPayOFFS", myData)
      .then((res) => {
        if (!res.data.DataSet.Table5) {
          message.error("No Records found!");
          setList([]);
          return;
        }
        setList(res.data.DataSet.Table5);
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
          listItem={supportingTable?.Table3 || []}
          idName="ChartOfAccountId"
          valueName="AccountName"
          size={INPUT_SIZE}
          name="COAID"
          label="Chart Of Account"
          value={data.COAID}
          required={true}
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
        Pay Off
      </Title>
      {searchPanel}
      <ReportComponent
        rows={list}
        // header={[
        //   "Date",
        //   "Voucher #",
        //   "Particulars",
        //   "Description",
        //   //   "Cost Center",
        //   "Vendor",
        //   "IN",
        //   "OUT",
        //   "Balance",
        // ]}
        customTable={true}
        table={<PayOffTemplate list={list} />}
      />
    </div>
  );
};

export default PayOff;
