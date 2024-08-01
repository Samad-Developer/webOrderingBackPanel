import { Button, Col, message, Row, Spin } from "antd";
import Title from "antd/lib/typography/Title";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { INPUT_SIZE } from "../../../common/ThemeConstants";
import FormSelect from "../../../components/general/FormSelect";
import FormTextField from "../../../components/general/FormTextField";
import ReportExcelDownload from "../../../components/ReportingComponents/ReportExcelDownload";
import { dateformatFunction } from "../../../functions/dateFunctions";
import { resetState } from "../../../redux/actions/basicFormAction";
import { postRequest } from "../../../services/mainApp.service";
import WaiterRiderPerformanceTemplate from "./WaiterRiderPerformanceTemplate";

const initialSearchValues = {
  CompanyId: null,
  BranchId: null,
  DateFrom: "",
  DateTo: "",
  OperationId: null,
  UserId: null,
  Name: null,
};

const WaiterRiderPerformanceReport = () => {
  const dispatch = useDispatch();
  const controller = new window.AbortController();
  const userData = useSelector((state) => state.authReducer);
  const [data, setData] = useState(initialSearchValues);
  const [list, setList] = useState([]);
  const [headList, setHeadList] = useState([]);
  const [supportingTable, setSupportingTable] = useState([]);
  const [branches, setBranches] = useState([]);
  const [reportType, setReportsType] = useState([
    {
      id: 3,
      name: "Waiter Report",
    },
    {
      id: 2,
      name: "Rider Report",
    },
  ]);
  const [disableExcel, setDisableExcel] = useState(true);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    postRequest(
      "/RiderWaiterPerformanceReport",
      {
        ...data,
        CompanyId: userData.CompanyId,
        UserId: userData.UserId,
        OperationId: 1,
      },
      controller
    )
      .then((res) => {
        setBranches(res.data.DataSet.Table);
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
    setLoading(true);
    if (data.DateFrom > data.DateTo) {
      message.error("Invalid Date Range");
      return;
    }

    let value;

    if (data.Name) {
      value = data.Name;
      value = value.split("");
      value.push("%");
      value.unshift("%");
      value = value.join("");
    }

    postRequest("/RiderWaiterPerformanceReport", {
      ...data,
      Name: value ? value : null,
      CompanyId: userData.CompanyId,
      UserId: userData.UserId,
    })
      .then((res) => {
        if (res.data.DataSet.Table.length <= 0) {
          message.error("No Reports Found!");
          setDisableExcel(true);
          setLoading(false);
          return;
        }

        setList(res.data.DataSet.Table);
        setDisableExcel(false);
        setLoading(false);
      })
      .catch((err) => console.error(err));
  };

  const searchPanel = (
    <form onSubmit={handleSearchSubmit}>
      <div style={{ display: "flex", alignItems: "flex-end", gap: 10 }}>
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
          required={true}
        />
        <FormSelect
          colSpan={4}
          listItem={reportType || []}
          idName="id"
          valueName="name"
          size={INPUT_SIZE}
          name="OperationId"
          label="Waiter/Rider"
          required={true}
          value={data.reportType}
          onChange={handleSearchChange}
        />
        <FormTextField
          colSpan={4}
          label="Rider/Waiter Name"
          type="text"
          name="Name"
          size={INPUT_SIZE}
          value={data.Name}
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
        Rider/Waiter Performance Report
      </Title>
      <Row>
        <Col span={24}>{searchPanel}</Col>
      </Row>
      {/* <ReportComponent
        rows={list}
        customTable={true}
        disableExcel={disableExcel}
        table={
          <BranchActivityTemplate
            list={list}
            headList={[]}
            date={`For the Period of ${data.DateFrom} To ${data.DateTo}`}
          />
        }
      /> */}
      <ReportExcelDownload
        fileName={`Waiter_Rider_Performance_Report${data.DateFrom}-${data.DateTo}`}
      >
        {loading && (
          <Spin
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          />
        )}
        {list.length > 0 && (
          <WaiterRiderPerformanceTemplate
            list={list}
            headList={[]}
            reportType={data.OperationId}
            date={`For the Period of ${data.DateFrom} To ${data.DateTo}`}
          />
        )}
      </ReportExcelDownload>
    </div>
  );
};

export default WaiterRiderPerformanceReport;
