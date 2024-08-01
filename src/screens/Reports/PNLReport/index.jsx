import { Button, message } from "antd";
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
import PNLDetailTemplate from "./PNLDetailTemplate.js";

const initialSearchValues = {
  CompanyId: null,
  BranchId: null,
  InvDateFrm: "",
  InvDateTo: "",
  ProductDtl: null,
  OperationId: null,
};

const PNLReport = () => {
  const dispatch = useDispatch();
  const controller = new window.AbortController();
  const userData = useSelector((state) => state.authReducer);
  const [data, setData] = useState(initialSearchValues);
  const [list, setList] = useState([]);
  const [headList, setHeadList] = useState([]);
  const [supportingTable, setSupportingTable] = useState([]);
  const [branches, setBranches] = useState([]);
  const [productDetails, setProductDetails] = useState([]);
  const [parentList, setParentList] = useState([]);
  const [totalList, setTotalList] = useState([]);

  useEffect(() => {
    postRequest(
      "/CrudRPTIssuanceDetails",
      {
        ...data,
        CompanyId: userData.CompanyId,
        BranchId: userData.branchId,
        OperationId: 1,
      },
      controller
    )
      .then((res) => {
        setSupportingTable(res.data.DataSet);
        setBranches(res.data.DataSet.Table);
        setProductDetails(res.data.DataSet.Table1);
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
    postRequest("/CrudRPTIssuanceDetails", {
      ...data,
      CompanyId: userData.CompanyId,
      OperationId: 2,
    })
      .then((res) => {
        if (res.data.DataSet.Table.length <= 0) {
          setList([]);
          setParentList([]);
          setTotalList([]);
          message.error("No records founds.");
          return;
        }
        setList(res.data.DataSet.Table1);
        setParentList(res.data.DataSet.Table);
        setTotalList(res.data.DataSet.Table2);
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
          listItem={branches || []}
          idName="BranchId"
          valueName="BranchName"
          size={INPUT_SIZE}
          name="BranchId"
          label="Branch"
          value={data.BranchId}
          onChange={handleSearchChange}
        />

        <FormTextField
          colSpan={4}
          label="Date From"
          type="date"
          name="InvDateFrm"
          size={INPUT_SIZE}
          value={data.InvDateFrm}
          required={true}
          onChange={handleSearchChange}
        />
        <FormTextField
          colSpan={4}
          label="Date to"
          type="date"
          name="InvDateTo"
          size={INPUT_SIZE}
          value={data.InvDateTo}
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
        PNL Report
      </Title>
      {searchPanel}
      <ReportComponent
        rows={list}
        customTable={true}
        table={
          <PNLDetailTemplate
            list={list}
            headList={[]}
            date={`For the Period of ${data.InvDateFrm} To ${data.InvDateTo}`}
            parentList={parentList}
            totalList={totalList}
          />
        }
      />
    </div>
  );
};

export default PNLReport;
