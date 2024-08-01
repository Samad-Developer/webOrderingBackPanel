import { Button, Col, message, Row } from "antd";
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
import DemandvsIssuenceTemplate from "./DemandvsIssuenceTemplate.jsx";

const initialSearchValues = {
  CompanyId: null,
  DateFrom: "",
  DateTo: "",
  OperationId: null,
  BranchId: null,
  DemandNumber: "",
};

const DemandVsIssuance = () => {
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
      "/DemandVsIssuanceReport",
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
    if (data.DateFrom > data.DateTo) {
      message.error("Please select correct data range.");
      return;
    }

    postRequest("/DemandVsIssuanceReport", {
      ...data,
      CompanyId: userData.CompanyId,
      OperationId: 2,
    })
      .then((res) => {
        if (res.data.DataSet.Table.length <= 0) {
          setList([]);
          setParentList([]);
          setTotalList([]);
          message.error("No records found!");
          return;
        }
        setList(res.data.DataSet.Table);
      })
      .catch((err) => console.error(err));
  };

  const searchPanel = (
    <form onSubmit={handleSearchSubmit}>
      <div style={{ display: "flex", alignItems: "flex-end", gap: 10 }}>
        <FormTextField
          colSpan={4}
          label="Demand Number"
          //   type="date"
          name="DemandNumber"
          size={INPUT_SIZE}
          value={data.DemandNumber}
          onChange={handleSearchChange}
        />
        <FormSelect
          colSpan={4}
          listItem={branches || []}
          idName="BranchId"
          valueName="BranchName"
          size={INPUT_SIZE}
          name="BranchId"
          label="Branch"
          value={data.IssueBranchId}
          onChange={handleSearchChange}
        />

        <FormTextField
          colSpan={4}
          label="Date From"
          type="date"
          name="DateFrom"
          size={INPUT_SIZE}
          value={data.DateFrom}
          required={true}
          onChange={handleSearchChange}
        />
        <FormTextField
          colSpan={4}
          label="Date to"
          type="date"
          name="DateTo"
          size={INPUT_SIZE}
          value={data.DateTo}
          required={true}
          onChange={handleSearchChange}
          max={dateformatFunction(Date.now())}
        />
        <Button type="primary" htmlType="submit" style={{ marginLeft: "auto" }}>
          Search
        </Button>
      </div>
      <div style={{ margin: "10px 0", borderTop: "1px solid lightgray" }}></div>
    </form>
  );

  return (
    <div style={{ background: "white", padding: 20 }}>
      <Title level={3} type="primary">
        Demand Vs Issuance
      </Title>
      <Row>
        <Col span={24}>{searchPanel}</Col>
      </Row>
      <ReportComponent
        rows={list}
        customTable={true}
        table={
          <DemandvsIssuenceTemplate
            list={list}
            headList={[
              "Demand",
              "Date",
              "Branch",
              "Demand No",
              "Issuance No",
              "Category",
              "Item",
              "Unit",
              "Demand",
              "Quantity",
              "Issuence",
              "Quantity",
              "Difference",
            ]}
            date={`For the Period of ${data.DateFrom} To ${data.DateTo}`}
          />
        }
      />
    </div>
  );
};

export default DemandVsIssuance;
