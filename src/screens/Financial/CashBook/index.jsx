import { Button } from "antd";
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
import CashBookTemplate from "./CashBookTemplate";

const initialSearchValues = {
  FromDate: null,
  ToDate: null,
  BranchId: null,
  IsCash: null,
};

const CashBook = () => {
  const dispatch = useDispatch();
  const controller = new window.AbortController();
  const userData = useSelector((state) => state.authReducer);
  const [data, setData] = useState(initialSearchValues);
  const [list, setList] = useState([]);
  const [supportingTable, setSupportingTable] = useState([]);

  useEffect(() => {
    postRequest(
      "/CrudGetCashBookData",
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
    postRequest("/GET_CASH_BOOK", {
      CompanyId: userData.CompanyId,
      BranchId: userData.branchId,
      ...data,
      IsCash: data.IsCash === 2 ? false : data.IsCash === 1 ? true : null,
    })
      .then((res) => {
        setList(res.data.DataSet.Table);
      })
      .catch((err) => console.error(err));
  };

  const searchPanel = (
    <form onSubmit={handleSearchSubmit}>
      <div style={{ display: "flex", alignItems: "flex-end" }}>
        <FormSelect
          colSpan={4}
          listItem={supportingTable?.Table || []}
          idName="BranchId"
          valueName="BranchName"
          size={INPUT_SIZE}
          name="BranchId"
          label="Branch"
          value={data.BranchId}
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
          size={INPUT_SIZE}
          name="IsCash"
          label="Cash Book Type"
          value={data.IsCash}
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
        Cash Book
      </Title>
      {searchPanel}
      <ReportComponent
        rows={list}
        customTable={true}
        table={
          <CashBookTemplate
            list={list}
            date={`${data.FromDate} - ${data.ToDate}`}
            IsCash={data.IsCash}
          />
        }
      />
    </div>
  );
};

export default CashBook;
