import { Button, Col, Row, Spin } from "antd";
import Title from "antd/lib/skeleton/Title";
import React, { useState } from "react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { INPUT_SIZE } from "../../../common/ThemeConstants";
import ReportComponent from "../../../components/formComponent/ReportComponent";
import FormSelect from "../../../components/general/FormSelect";
import FormTextField from "../../../components/general/FormTextField";
import ReportExcelDownload from "../../../components/ReportingComponents/ReportExcelDownload";
import { setBranches } from "../../../redux/actions/reportActions";
import { postRequest } from "../../../services/mainApp.service";
import HourlySaleReportTemp from "./hourlySaleReportTemp";
const HourlySaleReport = () => {
  const userData = useSelector((state) => state.authReducer);
  const { branches } = useSelector((state) => state.reportsReducer);
  const dispatch = useDispatch();
  const [data, setData] = useState({
    OperationId: 1,
    BranchId: null,
    DateFrom: null,
    DateTo: null,
    BusinessDayId: null,
    TerminalDetailId: null,
    ShiftId: null,
  });

  const [reportData, setReportData] = useState([]);
  const controller = new window.AbortController();
  const [disablePrint, setDisablePrint] = useState(true);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    dispatch(
      setBranches(
        "/PosReports",
        { ...data, OperationId: 0, CompanyId: userData.CompanyId },
        controller,
        userData
      )
    );
  }, []);
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (data.DateFrom !== "" && data.DateTo !== "") {
      if (new Date(data.DateFrom) <= new Date(data.DateTo)) {
        setLoading(true);

        postRequest("ProductSaleReport", {
          ...data,
          OperationId: 2,
          CompanyId: userData.CompanyId,
        }).then((res) => {
          setLoading(false);
          setReportData(res.data.DataSet.Table);
        });
      } else {
        message.error("Please select DateTo greater than DateFrom");
      }
    } else {
      message.error("Please select both dates");
    }
  };

  const fieldPanel = (
    <form onSubmit={handleSearchSubmit}>
      <div
        style={{
          display: "flex",
          alignItems: "flex-end",
          gap: 10,
        }}
      >
        <FormSelect
          colSpan={4}
          listItem={branches || []}
          idName="BranchId"
          valueName="BranchName"
          size={INPUT_SIZE}
          name="BranchId"
          label="Branch"
          value={data.BranchId || ""}
          onChange={(e) => {
            setData({ ...data, BranchId: e.value });
          }}
          required={true}
        />
        <FormTextField
          span={4}
          label="Date From"
          name="DateFrom"
          type="date"
          value={data.DateFrom}
          onChange={(e) => setData({ ...data, DateFrom: e.value })}
        />
        <FormTextField
          span={4}
          label="Date To"
          name="DateTo"
          type="date"
          value={data.DateTo}
          onChange={(e) => setData({ ...data, DateTo: e.value })}
        />

        <Button type="primary" htmlType="submit" style={{ marginLeft: "auto" }}>
          Search
        </Button>
      </div>
    </form>
  );

  return (
    <div style={{ background: "white", padding: 20 }}>
      <h3>Hourly Sale Report</h3>
      <Row>
        <Col span={24}>{fieldPanel}</Col>
      </Row>

      <ReportExcelDownload
        fileName={`Hourly_Sale_Report ${data.DateFrom}- ${data.DateTo}`}
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
        {reportData.length > 0 && (
          <HourlySaleReportTemp
            list={reportData}
            headList={reportData.length > 0 ? Object.keys(reportData[0]) : []}
            date={`Date Range: ${data.DateFrom} to ${data.DateTo}`}
          />
        )}
      </ReportExcelDownload>
    </div>
  );
};

export default HourlySaleReport;
